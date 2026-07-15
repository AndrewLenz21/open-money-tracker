import { create } from "zustand";
import type { CsvSourceId } from "@core/config/csv-sources";
import type { SupportedDateFormat } from "@core/types";

type DateFormatConfidence = "high" | "ambiguous" | "unknown";
type DateFormatValidationStatus =
  | "idle"
  | "valid"
  | "invalid"
  | "no-date-column"
  | "empty-date-value";

interface CsvImportState {
  selectedSourceId: CsvSourceId;
  selectedFile: File | null;
  detectedColumns: string[];
  validationErrors: string[];
  detectedDateColumn: string | null;
  originalDateValue: string | null;
  automaticallyDetectedFormat: SupportedDateFormat | null;
  selectedDateFormat: SupportedDateFormat | null;
  parsedDatePreview: Date | null;
  dateFormatValidationStatus: DateFormatValidationStatus;
  dateFormatValidationMessage: string | null;
  dateFormatConfidence: DateFormatConfidence;
  dateFormatError: string | null;

  setSelectedSource: (sourceId: CsvSourceId) => void;
  setSelectedFile: (file: File | null) => void;
  setDetectedColumns: (columns: string[]) => void;
  setValidationErrors: (errors: string[]) => void;
  setDateDetection: (payload: {
    detectedDateColumn: string | null;
    originalDateValue: string | null;
    automaticallyDetectedFormat: SupportedDateFormat | null;
    selectedDateFormat: SupportedDateFormat | null;
    dateFormatConfidence: DateFormatConfidence;
    dateFormatError: string | null;
  }) => void;
  setSelectedDateFormat: (format: SupportedDateFormat | null) => void;
  setDateValidation: (payload: {
    parsedDatePreview: Date | null;
    dateFormatValidationStatus: DateFormatValidationStatus;
    dateFormatValidationMessage: string | null;
  }) => void;
  resetImport: () => void;
}

const resetDateState = {
  detectedDateColumn: null,
  originalDateValue: null,
  automaticallyDetectedFormat: null,
  selectedDateFormat: null,
  parsedDatePreview: null,
  dateFormatValidationStatus: "idle" as const,
  dateFormatValidationMessage: null,
  dateFormatConfidence: "unknown" as const,
  dateFormatError: null,
};

export const useCsvImportStore = create<CsvImportState>((set) => ({
  selectedSourceId: "revolut",
  selectedFile: null,
  detectedColumns: [],
  validationErrors: [],
  ...resetDateState,

  setSelectedSource: (sourceId) =>
    set({ selectedSourceId: sourceId, ...resetDateState }),
  setSelectedFile: (file) => set({ selectedFile: file, ...resetDateState }),
  setDetectedColumns: (columns) => set({ detectedColumns: columns }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  setDateDetection: (payload) =>
    set({
      ...payload,
      parsedDatePreview: null,
      dateFormatValidationStatus: "idle",
      dateFormatValidationMessage: null,
    }),
  setSelectedDateFormat: (format) => set({ selectedDateFormat: format }),
  setDateValidation: (payload) => set(payload),
  resetImport: () =>
    set({
      selectedFile: null,
      detectedColumns: [],
      validationErrors: [],
      ...resetDateState,
    }),
}));
