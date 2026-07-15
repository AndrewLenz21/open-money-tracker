import type { SupportedDateFormat } from "@core/types";

export type Transaction = {
  id: string;
  type: string;
  product: string;
  startedAt: Date;
  completedAt: Date | null;
  description: string;
  amount: number;
  fee: number;
  currency: string;
  state: string;
  balance: number | null;
};

export type RejectedRow = {
  rowIndex: number;
  reason: string;
  rawData: string;
};

export type ImportWarning = {
  type: "missing_balance" | "future_date" | "unusual_amount";
  message: string;
  rowIndex?: number;
};

export type ImportMetadata = {
  provider: "revolut";
  filename: string;
  importedAt: string;
  totalRows: number;
  acceptedRows: number;
  rejectedRows: number;
  dateFormat: SupportedDateFormat;
};

export type ImportResult = {
  transactions: Transaction[];
  rejectedRows: RejectedRow[];
  warnings: ImportWarning[];
  metadata: ImportMetadata;
};

export type NormalizedTransaction = {
  id: string;
  importId: number;
  paymentName: string;
  paymentDate: Date;
  amount: number;
  fee: number;
  currency: string;
  state: string;
  type: "income" | "expense";
  source: string;
  originalDescription: string;
  accountProduct: string;
  balance: number | null;
  importedAt: string;
  filename: string;
};

export type ImportRecord = {
  id?: number;
  provider: string;
  filename: string;
  importedAt: string;
  totalRows: number;
  acceptedRows: number;
  rejectedRows: number;
  dateFormat: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
};

export type DateParseResult =
  | { ok: true; date: Date }
  | { ok: false; error: string };
