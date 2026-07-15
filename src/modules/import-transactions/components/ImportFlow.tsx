import { useState, useEffect, useCallback, useMemo } from "react";
import Papa from "papaparse";
import { AlertTriangle, CheckCircle, Sparkles, XCircle } from "lucide-react";
import { Button, Select } from "@shared/components/ui";
import { Alert, AlertDescription, AlertTitle } from "@shared/components/ui";
import { ROUTES } from "@core/routing";
import type { SupportedDateFormat } from "@core/types";
import { getCsvSource, type CsvSourceId } from "@core/config/csv-sources";
import { getModuleTranslations, resolveTranslation } from "@core/i18n";
import { APP_CONFIG } from "@core/config";
import { useAppLocale } from "@modules/navigation";
import { cn } from "@shared/lib/utils";
import { saveImportResult } from "@modules/import-transactions/services/storage";
import { saveImportRecord } from "@modules/import-transactions/services/storage";
import { saveNormalizedTransactions } from "@modules/import-transactions/services/storage";
import { parseRevolutDate } from "@modules/import-transactions/services/dateParser";
import { parseRevolutCsv } from "@modules/import-transactions/services/revolutParser";
import type { ImportResult } from "@modules/import-transactions/domain";
import { normalizeTransactions } from "@modules/import-transactions/domain";
import { useCsvImportStore } from "@modules/import-transactions/stores";
import { useDashboardStore } from "@modules/dashboard/stores/dashboardStore";
import UploadDropzone, { type DropzonePhase } from "./dropzone/UploadDropzone";
import { ProviderSelect } from "./dropzone/ProviderSelect";
import { CsvFormatPreview } from "./dropzone/CsvFormatPreview";
import { DemoPreview } from "./preview/DemoPreview";
import { StepIndicator, type ImportStep } from "./flow/StepIndicator";
import { AnimatedSection } from "./shared/AnimatedSection";

type Phase = DropzonePhase | "error";

const PHASE_TO_STEP: Record<Phase, ImportStep> = {
  idle: 1,
  file_selected: 2,
  parsing: 3,
  error: 1,
};

// ---------------------------------------------------------------------------
// ImportFlow — root orchestrator for the CSV import experience.
//
// Phase machine: idle → file_selected → parsing → redirect to dashboard (or error)
//
// Visual layout (top to bottom):
//   1. StepIndicator       — always visible (Add CSV → Date format → View results)
//   2. UploadDropzone      — file selection area + date format config
//   3. Phase "idle"        — privacy note + "or" divider + DemoPreview
//   4. Phase "parsing"     — brief spinner while processing
//   5. Phase "error"       — destructive alert with Try Again button
// ---------------------------------------------------------------------------

interface ImportFlowProps {}

const SUPPORTED_DATE_FORMATS: SupportedDateFormat[] = [
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD",
  "DD/MM/YYYY HH:mm:ss",
  "MM/DD/YYYY HH:mm:ss",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
];

type DateDetectionResult = {
  detectedDateColumn: string | null;
  originalDateValue: string | null;
  automaticallyDetectedFormat: SupportedDateFormat | null;
  selectedDateFormat: SupportedDateFormat | null;
  dateFormatConfidence: "high" | "ambiguous" | "unknown";
  dateFormatError: string | null;
};

type DateValidationResult = {
  parsedDatePreview: Date | null;
  dateFormatValidationStatus:
    | "idle"
    | "valid"
    | "invalid"
    | "no-date-column"
    | "empty-date-value";
  dateFormatValidationMessage: string | null;
};

function getMatchingDateFormats(value: string): SupportedDateFormat[] {
  return SUPPORTED_DATE_FORMATS.filter(
    (format) => parseRevolutDate(value, format).ok,
  );
}

function detectDateConfiguration(
  sourceId: CsvSourceId,
  csvText: string,
): DateDetectionResult {
  const source = getCsvSource(sourceId);
  const dateConfig = source?.date;

  if (!dateConfig || dateConfig.columns.length === 0) {
    return {
      detectedDateColumn: null,
      originalDateValue: null,
      automaticallyDetectedFormat: null,
      selectedDateFormat: null,
      dateFormatConfidence: "unknown",
      dateFormatError: "This CSV source does not define date columns.",
    };
  }

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  const availableColumns = new Set((parsed.meta.fields || []).map((field) => field.trim()));

  for (const column of dateConfig.columns) {
    if (!availableColumns.has(column)) continue;

    const firstNonEmptyValue = parsed.data
      .map((row) => {
        const rawValue = row?.[column];
        return typeof rawValue === "string" ? rawValue.trim() : "";
      })
      .find((value) => value.length > 0);

    if (!firstNonEmptyValue) {
      return {
        detectedDateColumn: column,
        originalDateValue: null,
        automaticallyDetectedFormat: null,
        selectedDateFormat: null,
        dateFormatConfidence: "unknown",
        dateFormatError: "The detected date column has no non-empty values.",
      };
    }

    const expectedMatch = dateConfig.expectedFormats.find(
      (format) => parseRevolutDate(firstNonEmptyValue, format).ok,
    );

    if (expectedMatch) {
      return {
        detectedDateColumn: column,
        originalDateValue: firstNonEmptyValue,
        automaticallyDetectedFormat: expectedMatch,
        selectedDateFormat: expectedMatch,
        dateFormatConfidence: "high",
        dateFormatError: null,
      };
    }

    const matchingFormats = getMatchingDateFormats(firstNonEmptyValue);

    if (matchingFormats.length === 1) {
      return {
        detectedDateColumn: column,
        originalDateValue: firstNonEmptyValue,
        automaticallyDetectedFormat: matchingFormats[0],
        selectedDateFormat: matchingFormats[0],
        dateFormatConfidence: "high",
        dateFormatError: null,
      };
    }

    if (matchingFormats.length > 1) {
      return {
        detectedDateColumn: column,
        originalDateValue: firstNonEmptyValue,
        automaticallyDetectedFormat: null,
        selectedDateFormat: null,
        dateFormatConfidence: "ambiguous",
        dateFormatError: null,
      };
    }
  }

  return {
    detectedDateColumn: null,
    originalDateValue: null,
    automaticallyDetectedFormat: null,
    selectedDateFormat: null,
    dateFormatConfidence: "unknown",
    dateFormatError: "We couldn't find a configured date column in this CSV.",
  };
}

function validateDateFormatSelection(
  originalDateValue: string | null,
  detectedDateColumn: string | null,
  selectedDateFormat: SupportedDateFormat | null,
): DateValidationResult {
  if (!detectedDateColumn) {
    return {
      parsedDatePreview: null,
      dateFormatValidationStatus: "no-date-column",
      dateFormatValidationMessage: "No date column could be detected in the CSV.",
    };
  }

  if (!originalDateValue) {
    return {
      parsedDatePreview: null,
      dateFormatValidationStatus: "empty-date-value",
      dateFormatValidationMessage:
        "The detected date column does not contain a usable value.",
    };
  }

  if (!selectedDateFormat) {
    return {
      parsedDatePreview: null,
      dateFormatValidationStatus: "idle",
      dateFormatValidationMessage: null,
    };
  }

  const parsed = parseRevolutDate(originalDateValue, selectedDateFormat);

  if (!parsed.ok) {
    return {
      parsedDatePreview: null,
      dateFormatValidationStatus: "invalid",
      dateFormatValidationMessage:
        parsed.error.startsWith("Invalid calendar date")
          ? parsed.error
          : "This format does not match the CSV date value.",
    };
  }

  return {
    parsedDatePreview: parsed.date,
    dateFormatValidationStatus: "valid",
    dateFormatValidationMessage: "Valid format",
  };
}

export default function ImportFlow(_props: ImportFlowProps) {
  // -- locale & translations -------------------------------------------------
  const { locale } = useAppLocale();
  const selectedSourceId = useCsvImportStore((state) => state.selectedSourceId);
  const storeSelectedDateFormat = useCsvImportStore(
    (state) => state.selectedDateFormat,
  );
  const originalDateValue = useCsvImportStore((state) => state.originalDateValue);
  const detectedDateColumn = useCsvImportStore(
    (state) => state.detectedDateColumn,
  );
  const parsedDatePreview = useCsvImportStore((state) => state.parsedDatePreview);
  const dateFormatValidationStatus = useCsvImportStore(
    (state) => state.dateFormatValidationStatus,
  );
  const dateFormatValidationMessage = useCsvImportStore(
    (state) => state.dateFormatValidationMessage,
  );
  const dateFormatConfidence = useCsvImportStore(
    (state) => state.dateFormatConfidence,
  );
  const dateFormatError = useCsvImportStore((state) => state.dateFormatError);
  const setStoreSelectedFile = useCsvImportStore((state) => state.setSelectedFile);
  const setDateDetection = useCsvImportStore((state) => state.setDateDetection);
  const setSelectedDateFormat = useCsvImportStore(
    (state) => state.setSelectedDateFormat,
  );
  const setDateValidation = useCsvImportStore((state) => state.setDateValidation);
  const resetCsvImport = useCsvImportStore((state) => state.resetImport);
  // -- core state: file, phase, parse/import results ------------------------
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, unknown>>(() =>
    getModuleTranslations(locale, "import-transactions"),
  );

  useEffect(() => {
    setTranslations(getModuleTranslations(locale, "import-transactions"));
  }, [locale]);

  const t = useCallback(
    (path: string, fallback = ""): string =>
      resolveTranslation(path, translations) || fallback,
    [translations],
  );

  // -- derived: steps config -------------------------------------------------
  const currentStep = PHASE_TO_STEP[phase];
  const steps = useMemo(
    () => [
      { index: 1 as const, label: t("importFlow.step1.label", "Add CSV") },
      { index: 2 as const, label: t("importFlow.step2.label", "Preview") },
      { index: 3 as const, label: t("importFlow.step3.label", "Import") },
    ],
    [t],
  );
  const detectedDateMatches = useMemo(
    () => (originalDateValue ? getMatchingDateFormats(originalDateValue) : []),
    [originalDateValue],
  );
  const dateFormatOptions = useMemo(
    () =>
      (detectedDateMatches.length > 1
        ? detectedDateMatches
        : SUPPORTED_DATE_FORMATS
      ).map((format) => ({ value: format, label: format })),
    [detectedDateMatches],
  );
  const canImport = useMemo(() => {
    if (!selectedFile || !csvText || !storeSelectedDateFormat) return false;
    return dateFormatValidationStatus === "valid";
  }, [
    csvText,
    dateFormatValidationStatus,
    selectedFile,
    storeSelectedDateFormat,
  ]);
  const formattedDatePreview = useMemo(() => {
    if (!parsedDatePreview) return null;

    return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(parsedDatePreview);
  }, [locale, parsedDatePreview]);
  const translatedDateFormatError = useMemo(() => {
    if (!dateFormatError) return null;

    if (dateFormatError === "This CSV source does not define date columns.") {
      return t(
        "preview.sourceHasNoDateColumns",
        "This CSV source does not define date columns.",
      );
    }

    if (dateFormatError === "The detected date column has no non-empty values.") {
      return t(
        "preview.detectedColumnEmpty",
        "The detected date column has no non-empty values.",
      );
    }

    if (dateFormatError === "We couldn't find a configured date column in this CSV.") {
      return t(
        "preview.noConfiguredDateColumn",
        "We couldn't find a configured date column in this CSV.",
      );
    }

    return dateFormatError;
  }, [dateFormatError, t]);
  const translatedValidationMessage = useMemo(() => {
    if (!dateFormatValidationMessage) return null;

    if (dateFormatValidationStatus === "invalid") {
      if (dateFormatValidationMessage.startsWith("Invalid calendar date")) {
        return t(
          "preview.impossibleDate",
          "The CSV contains an impossible date.",
        );
      }

      return t(
        "preview.formatMismatch",
        "This format does not match the CSV date value.",
      );
    }

    if (dateFormatValidationStatus === "no-date-column") {
      return t(
        "preview.noDateColumn",
        "No date column detected",
      );
    }

    if (dateFormatValidationStatus === "empty-date-value") {
      return t(
        "preview.emptyDateValue",
        "No usable date value found",
      );
    }

    return dateFormatValidationMessage;
  }, [dateFormatValidationMessage, dateFormatValidationStatus, t]);

  // -- callbacks: file → date → import → redirect -------------------------
  const handleFileSelected = useCallback(
    (file: File, text: string) => {
      const dateDetection = detectDateConfiguration(selectedSourceId, text);

      setSelectedFile(file);
      setStoreSelectedFile(file);
      setCsvText(text);
      setErrorMessage(null);
      setDateDetection(dateDetection);
      setDateValidation(
        validateDateFormatSelection(
          dateDetection.originalDateValue,
          dateDetection.detectedDateColumn,
          dateDetection.selectedDateFormat,
        ),
      );
      setPhase("file_selected");
    },
    [selectedSourceId, setDateDetection, setDateValidation, setStoreSelectedFile],
  );

  const handleViewResults = useCallback(async () => {
    if (!selectedFile || !csvText || !storeSelectedDateFormat) return;
    setPhase("parsing");
    setErrorMessage(null);

    let parsed: ImportResult;
    try {
      parsed = parseRevolutCsv(csvText, {
        dateFormat: storeSelectedDateFormat,
        filename: selectedFile.name,
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : t("preview.noTransactions", "Could not parse the selected file."),
      );
      setPhase("error");
      return;
    }

    if (parsed.metadata.acceptedRows === 0) {
      setErrorMessage(
        t("preview.noTransactions", "No valid transactions found in the file."),
      );
      setPhase("error");
      return;
    }

    try {
      await saveImportResult(parsed);

      let dateRangeStart: string | undefined;
      let dateRangeEnd: string | undefined;
      if (parsed.transactions.length > 0) {
        let minDate = parsed.transactions[0]!.completedAt ?? parsed.transactions[0]!.startedAt;
        let maxDate = minDate;
        for (const tx of parsed.transactions) {
          const d = tx.completedAt ?? tx.startedAt;
          if (d < minDate) minDate = d;
          if (d > maxDate) maxDate = d;
        }
        dateRangeStart = minDate.toISOString();
        dateRangeEnd = maxDate.toISOString();
      }

      const importRecord = {
        provider: parsed.metadata.provider,
        filename: parsed.metadata.filename,
        importedAt: parsed.metadata.importedAt,
        totalRows: parsed.metadata.totalRows,
        acceptedRows: parsed.metadata.acceptedRows,
        rejectedRows: parsed.metadata.rejectedRows,
        dateFormat: parsed.metadata.dateFormat,
        dateRangeStart,
        dateRangeEnd,
      };
      const importId = await saveImportRecord(importRecord);

      const normalized = normalizeTransactions(parsed, importId);
      await saveNormalizedTransactions(normalized);

      const dashboardStore = useDashboardStore.getState();
      dashboardStore.setSelectedImportId(importId);
      dashboardStore.setMobileImportsOpen(false);

      window.location.href = ROUTES.dashboard;
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to save import.",
      );
      setPhase("error");
    }
  }, [csvText, selectedFile, storeSelectedDateFormat, t]);

  const handleTryDemo = useCallback(async () => {
    try {
      const response = await fetch(APP_CONFIG.demoCsvPath);
      if (!response.ok) {
        throw new Error(`Unable to load demo CSV (${response.status})`);
      }

      const demoCsv = await response.text();
      const demoFile = new File([demoCsv], APP_CONFIG.demoCsvFilename, {
        type: "text/csv",
      });

      handleFileSelected(demoFile, demoCsv);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : t("error.generic", "Something went wrong while reading the file."),
      );
      setPhase("error");
    }
  }, [handleFileSelected, t]);

  const handleDateFormatChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextDateFormat = event.target.value;
      const selectedFormat = nextDateFormat
        ? (nextDateFormat as SupportedDateFormat)
        : null;

      setSelectedDateFormat(selectedFormat);
      setDateValidation(
        validateDateFormatSelection(
          originalDateValue,
          detectedDateColumn,
          selectedFormat,
        ),
      );
    },
    [detectedDateColumn, originalDateValue, setDateValidation, setSelectedDateFormat],
  );

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setCsvText(null);
    setErrorMessage(null);
    resetCsvImport();
    setPhase("idle");
  }, [resetCsvImport]);

  // -- dropzone header (provider select) ------------------------------------
  const dropzoneHeader = (
    <div className="flex w-full flex-col items-center gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {t("importFlow.step1.title", "Add your bank statement CSV")}
      </h2>
      <ProviderSelect
        label={t("providers.label", "CSV source")}
        current={t("providers.revolut", "Revolut")}
        currentDescription={t(
          "providers.revolutDescription",
          "Revolut account statement CSV",
        )}
        n26={t("providers.n26", "N26")}
        n26Description={t(
          "providers.n26Description",
          "N26 account statement CSV",
        )}
        intesa={t("providers.intesa", "Intesa Sanpaolo")}
        intesaDescription={t(
          "providers.intesaDescription",
          "Bank statement CSV",
        )}
        generic={t("providers.generic", "Generic CSV")}
        genericDescription={t(
          "providers.genericDescription",
          "Configure and map your own columns",
        )}
        more={t("providers.more", "More options coming soon")}
        available={t("providers.available", "Available")}
        comingSoon={t("providers.comingSoon", "Coming soon")}
        planned={t("providers.planned", "Planned")}
      />
      <CsvFormatPreview />
    </div>
  );

  const selectedFileDetails =
    phase === "file_selected" && selectedFile ? (
      <div className="mx-auto flex w-full max-w-[780px] flex-col gap-2.5">
        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.9fr)] sm:items-start">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <span>{t("dateFormat.label", "Date format")}</span>
            <span className="inline-flex items-center self-center rounded-full border border-border/60 bg-background/50 px-1.5 py-px text-[9px] font-medium leading-none text-muted-foreground/90">
              {dateFormatConfidence === "high"
                ? t("preview.detected", "Detected automatically")
                : dateFormatConfidence === "ambiguous"
                  ? t("preview.selectionRequired", "Selection required")
                  : t("preview.unavailable", "Could not detect")}
            </span>
          </div>

          <div className="flex items-center text-[11px] font-medium text-muted-foreground">
            {t("preview.previewLabel", "Preview")}
          </div>

          <div className="w-full min-w-0">
            <Select
              aria-label={t("dateFormat.label", "Date format")}
              value={storeSelectedDateFormat ?? ""}
              onChange={handleDateFormatChange}
              className="h-10 w-full text-xs font-mono"
              options={[
                {
                  value: "",
                  label: t("dateFormat.choose", "Choose a format"),
                },
                ...dateFormatOptions,
              ]}
            />
          </div>

          <div className="flex h-10 min-w-0 items-center rounded-md border border-border/60 bg-background/60 px-3 text-left">
            {dateFormatValidationStatus === "valid" && formattedDatePreview ? (
              <p className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
                <CheckCircle
                  className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {t("preview.validFormat", "Valid format")}
                </span>
                <span>{formattedDatePreview}</span>
              </p>
            ) : (
              <p className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
                <XCircle
                  className="h-3.5 w-3.5 shrink-0 text-destructive"
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {t("preview.invalidFormat", "Invalid format")}
                </span>
                <span>
                  {dateFormatValidationStatus === "no-date-column"
                    ? t("preview.noDateColumn", "No date column detected")
                    : dateFormatValidationStatus === "empty-date-value"
                      ? t("preview.emptyDateValue", "No usable date value found")
                      : t("preview.unableToParse", "Unable to parse date")}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1 text-[11px] text-muted-foreground">
          {dateFormatConfidence === "ambiguous" && originalDateValue ? (
            <p>
              {t("preview.ambiguous", "We found the date")} <span className="font-mono text-foreground/80">{originalDateValue}</span>. {t("preview.ambiguousQuestion", "Which format does your CSV use?")}
            </p>
          ) : null}

          {originalDateValue ? (
            <p>
              {t("preview.originalValue", "Original value")}: <span className="font-mono text-foreground/80">{originalDateValue}</span>
            </p>
          ) : null}

          {detectedDateColumn ? (
            <p>
              {t("preview.detectedColumn", "Detected column")}: <span className="text-foreground/80">&ldquo;{detectedDateColumn}&rdquo;</span>
            </p>
          ) : null}

          {translatedValidationMessage && dateFormatValidationStatus !== "valid" ? (
            <p className="text-destructive">{translatedValidationMessage}</p>
          ) : null}
        </div>

        {translatedDateFormatError ? (
          <p className="text-[11px] text-destructive">{translatedDateFormatError}</p>
        ) : null}
      </div>
    ) : undefined;

  const selectedFileActions =
    phase === "file_selected" && selectedFile ? (
      <>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          {t("transactionPreview.replace", "Replace file")}
        </Button>
        <Button
          onClick={handleViewResults}
          disabled={!canImport}
          className="gap-2"
        >
          <Sparkles
            className={cn(
              "h-4 w-4",
              canImport && "anim-icon-bob text-primary-foreground/90",
            )}
            aria-hidden="true"
          />
          {t("preview.continue", "View results")}
        </Button>
      </>
    ) : undefined;

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-4">
      {/* 1. Step indicator — always on top */}
      <AnimatedSection index={0}>
        <StepIndicator steps={steps} currentStep={currentStep} />
      </AnimatedSection>

      {/* 2. Dropzone — hidden after success or error */}
      {phase !== "error" && (
        <AnimatedSection index={1}>
          <UploadDropzone
            phase={phase}
            selectedFile={selectedFile}
            header={phase === "idle" ? dropzoneHeader : null}
            replaceLabel={t("transactionPreview.replace", "Replace file")}
            selectedFileDetails={selectedFileDetails}
            selectedFileActions={selectedFileActions}
            onFileSelected={handleFileSelected}
            onReset={handleReset}
            onError={(message) => {
              setErrorMessage(message);
              setPhase("error");
            }}
          />
        </AnimatedSection>
      )}

      {/* 3a. Idle — privacy note + divider + demo preview */}
      {phase === "idle" && (
        <AnimatedSection index={2}>
          <p className="text-center text-[11px] text-muted-foreground">
            {t(
              "privacyNote",
              "Your data stays on your device. Nothing is uploaded to any server.",
            )}
          </p>
          <div className="my-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border/60" />
            or
            <span className="h-px flex-1 bg-border/60" />
          </div>
          <DemoPreview
            title={t("demoPreview.title", "See how your data will look")}
            description={t(
              "demoPreview.description",
              "Preview, review, and categorize your transactions before importing them.",
            )}
            actionLabel={t("demo.label", "Try demo data")}
            onTryDemo={handleTryDemo}
          />
        </AnimatedSection>
      )}

      {/* 3b. Error — destructive alert + try again */}
      {phase === "error" && (
        <AnimatedSection index={2}>
          <Alert variant="destructive" className="anim-fade-up">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("error.title", "Import failed")}</AlertTitle>
            <AlertDescription>
              <p>
                {errorMessage ||
                  t(
                    "error.generic",
                    "Something went wrong while reading the file.",
                  )}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleReset}
              >
                {t("error.tryAgain", "Try again")}
              </Button>
            </AlertDescription>
          </Alert>
        </AnimatedSection>
      )}
    </div>
  );
}
