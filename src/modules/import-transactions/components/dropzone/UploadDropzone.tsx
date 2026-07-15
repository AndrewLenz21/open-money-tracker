import { useState, useCallback, useRef, useEffect } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@shared/components/ui";
import { cn } from "@shared/lib/utils";
import { getModuleTranslations, resolveTranslation } from "@core/i18n";
import { useAppLocale } from "@modules/navigation";

export type DropzonePhase = "idle" | "file_selected" | "parsing";

interface UploadDropzoneProps {
  phase: DropzonePhase;
  selectedFile: File | null;
  header: React.ReactNode;
  replaceLabel: string;
  selectedFileDetails?: React.ReactNode;
  selectedFileActions?: React.ReactNode;
  onFileSelected: (file: File, csvText: string) => void;
  onReset: () => void;
  onError: (message: string) => void;
}

export default function UploadDropzone({
  phase,
  selectedFile,
  header,
  replaceLabel,
  selectedFileDetails,
  selectedFileActions,
  onFileSelected,
  onReset,
  onError,
}: UploadDropzoneProps) {
  const { locale } = useAppLocale();
  const [isDragOver, setIsDragOver] = useState(false);
  const [translations, setTranslations] = useState<Record<string, unknown>>(() =>
    getModuleTranslations(locale, "import-transactions"),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTranslations(getModuleTranslations(locale, "import-transactions"));
  }, [locale]);

  const t = useCallback(
    (path: string, fallback = ""): string =>
      resolveTranslation(path, translations) || fallback,
    [translations],
  );
  const isUploadInteractive = !selectedFile && phase !== "parsing";

  const readFile = useCallback(
    (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        onError("Please select a .csv file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        if (!csvText) {
          onError("Could not read the selected file.");
          return;
        }
        onFileSelected(file, csvText);
      };
      reader.onerror = () => onError("Error reading the selected file.");
      reader.readAsText(file);
    },
    [onError, onFileSelected],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile],
  );
  const handleClick = useCallback(() => inputRef.current?.click(), []);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFile(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [readFile],
  );

  return (
    <div
      role={isUploadInteractive ? "button" : undefined}
      tabIndex={isUploadInteractive ? 0 : undefined}
      onClick={isUploadInteractive ? handleClick : undefined}
      onKeyDown={isUploadInteractive ? handleKeyDown : undefined}
      onDragOver={isUploadInteractive ? handleDragOver : undefined}
      onDragLeave={isUploadInteractive ? handleDragLeave : undefined}
      onDrop={isUploadInteractive ? handleDrop : undefined}
      aria-label={
        isUploadInteractive
          ? t("dropzone.dragInactive", "Upload CSV file")
          : undefined
      }
      className={cn(
        "group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 text-center sm:px-10",
        selectedFile ? "py-5 sm:py-6" : "min-h-60 py-8 sm:min-h-64",
        isUploadInteractive
          ? "cursor-pointer transition-all duration-200 ease-out"
          : "cursor-default transition-all duration-200 ease-out",
        isUploadInteractive &&
          "hover:border-primary/50 hover:bg-accent/30 hover:shadow-md",
        isUploadInteractive &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDragOver
          ? "scale-[1.01] border-primary bg-primary/8 shadow-lg"
          : selectedFile
            ? "border-primary/40 bg-primary/3"
            : "border-muted-foreground/25 bg-card/30",
        phase === "parsing" && "pointer-events-none opacity-70",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-300",
          isDragOver ? "opacity-100" : "opacity-0",
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)",
        }}
      />

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileInput}
        aria-label="Upload CSV file"
      />

      <div className="relative z-10 flex w-full flex-col items-center gap-6">
        {!selectedFile && phase !== "parsing" && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full flex-col items-center gap-4"
          >
            {header}
          </div>
        )}

        {!selectedFile && phase !== "parsing" && (
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-background/80 shadow-sm transition-all duration-300 ease-out",
                "group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-md",
                isDragOver &&
                  "-translate-y-1 border-primary/60 shadow-md anim-icon-bob",
              )}
            >
              <Upload
                className={cn(
                  "h-6 w-6 text-muted-foreground transition-colors duration-200 group-hover:text-primary",
                  isDragOver && "text-primary",
                )}
                aria-hidden="true"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {isDragOver
                  ? t("dropzone.dragActive", "Drop your CSV file here")
                  : t(
                      "dropzone.dragInactive",
                      "Drag and drop your CSV file here, or click to browse",
                    )}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("dropzone.supportedFormats", "Only .csv files are accepted")}
              </p>
            </div>
          </div>
        )}

        {selectedFile && phase !== "parsing" && (
          <div className="anim-fade-in flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-primary/15 bg-background/55 p-4 shadow-sm sm:p-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-sm">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {selectedFileDetails ? (
              <>
                <div className="h-px bg-border/60" />
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-left"
                >
                  {selectedFileDetails}
                </div>
              </>
            ) : null}

            {selectedFileActions ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                {selectedFileActions}
              </div>
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReset();
                  }}
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  {replaceLabel}
                </Button>
              </div>
            )}
          </div>
        )}

        {phase === "parsing" && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Parsing CSV...</p>
          </div>
        )}
      </div>
    </div>
  );
}
