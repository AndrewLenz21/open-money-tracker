import type { SupportedDateFormat } from "@core/types";

export type CsvSourceId = "revolut" | "n26" | "intesa" | "generic";

export interface CsvColumnDefinition {
  key: string;
  label: string;
  required: boolean;
  description?: string;
}

export interface CsvSourceDefinition {
  id: CsvSourceId;
  name: string;
  description: string;
  status: "available" | "coming-soon" | "planned";
  columns: CsvColumnDefinition[];
  date?: CsvDateDefinition;
  sampleRow?: Record<string, string | number>;
}

export interface CsvDateDefinition {
  columns: string[];
  expectedFormats: SupportedDateFormat[];
}

export const CSV_SOURCES: CsvSourceDefinition[] = [
  {
    id: "revolut",
    name: "Revolut",
    description: "Revolut account statement CSV",
    status: "available",
    date: {
      columns: ["Completed Date", "Started Date"],
      expectedFormats: ["YYYY-MM-DD HH:mm:ss"],
    },
    columns: [
      { key: "Type", label: "Type", required: true },
      { key: "Product", label: "Product", required: true },
      { key: "Started Date", label: "Started Date", required: true },
      { key: "Completed Date", label: "Completed Date", required: true },
      { key: "Description", label: "Description", required: true },
      { key: "Amount", label: "Amount", required: true },
      { key: "Fee", label: "Fee", required: true },
      { key: "Currency", label: "Currency", required: true },
      { key: "State", label: "State", required: true },
      { key: "Balance", label: "Balance", required: true },
    ],
    sampleRow: {
      Type: "Card Payment",
      Product: "Savings",
      "Started Date": "2026-05-01 10:54:32",
      "Completed Date": "2026-05-02 11:20:41",
      Description: "Spotify",
      Amount: -16.99,
      Fee: 0,
      Currency: "EUR",
      State: "COMPLETED",
      Balance: 480,
    },
  },
  {
    id: "n26",
    name: "N26",
    description: "N26 account statement CSV",
    status: "coming-soon",
    columns: [],
  },
  {
    id: "intesa",
    name: "Intesa Sanpaolo",
    description: "Bank statement CSV",
    status: "coming-soon",
    columns: [],
  },
  {
    id: "generic",
    name: "Generic CSV",
    description: "Configure and map your own columns",
    status: "planned",
    columns: [],
  },
];

export function getCsvSource(
  sourceId: CsvSourceId,
): CsvSourceDefinition | undefined {
  return CSV_SOURCES.find((s) => s.id === sourceId);
}

export function getCsvHeader(sourceId: CsvSourceId): string {
  const source = getCsvSource(sourceId);
  if (!source || source.columns.length === 0) return "";
  return source.columns.map((c) => c.key).join(",");
}
