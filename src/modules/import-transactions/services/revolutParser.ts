import Papa from "papaparse";
import type { ParseResult as PapaParseResult } from "papaparse";
import type { SupportedDateFormat } from "@core/types";
import type {
  Transaction,
  ImportResult,
  RejectedRow,
  ImportWarning,
} from "../domain";
import { parseRevolutDate } from "./dateParser";

const REQUIRED_COLUMNS = [
  "Type",
  "Product",
  "Started Date",
  "Completed Date",
  "Description",
  "Amount",
  "Fee",
  "Currency",
  "State",
  "Balance",
] as const;

function removeBOM(text: string): string {
  if (text.charCodeAt(0) === 0xfeff) {
    return text.slice(1);
  }
  return text;
}

function detectDelimiter(header: string): string {
  const commaCount = (header.match(/,/g) || []).length;
  const semicolonCount = (header.match(/;/g) || []).length;
  const tabCount = (header.match(/\t/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount > tabCount) return ";";
  if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
  return ",";
}

function validateColumns(headers: string[]): string | null {
  const headerSet = new Set(headers.map((h) => h.trim()));
  const missing = REQUIRED_COLUMNS.filter((col) => !headerSet.has(col));
  if (missing.length > 0) {
    return `Missing required columns: ${missing.join(", ")}`;
  }
  return null;
}

function generateTransactionId(tx: Omit<Transaction, "id">): string {
  const raw = `${tx.type}|${tx.product}|${tx.startedAt.getTime()}|${tx.description}|${tx.amount}|${tx.currency}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const chr = raw.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(36).padStart(8, "0");
}

function parseAmount(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "-" || isNaN(Number(trimmed))) {
    return null;
  }
  return Number(trimmed);
}

function parseBalance(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "-" || isNaN(Number(trimmed))) {
    return null;
  }
  return Number(trimmed);
}

export function parseRevolutCsv(
  csvText: string,
  options: { dateFormat: SupportedDateFormat; filename: string }
): ImportResult {
  const cleanedCsv = removeBOM(csvText);
  const delimiter = detectDelimiter(cleanedCsv.split("\n")[0] || "");

  const parseResult: PapaParseResult<Record<string, string>> = Papa.parse(
    cleanedCsv,
    {
      header: true,
      delimiter,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      transform: (v: string) => v.trim(),
    }
  );

  if (parseResult.errors.length > 0 && parseResult.data.length === 0) {
    return {
      transactions: [],
      rejectedRows: [
        { rowIndex: 0, reason: parseResult.errors[0]?.message || "CSV parse error", rawData: "" },
      ],
      warnings: [],
      metadata: {
        provider: "revolut",
        filename: options.filename,
        importedAt: new Date().toISOString(),
        totalRows: 0,
        acceptedRows: 0,
        rejectedRows: 1,
        dateFormat: options.dateFormat,
      },
    };
  }

  const headers = parseResult.meta.fields || [];
  const columnError = validateColumns(headers);
  if (columnError) {
    return {
      transactions: [],
      rejectedRows: [{ rowIndex: 0, reason: columnError, rawData: headers.join(delimiter) }],
      warnings: [],
      metadata: {
        provider: "revolut",
        filename: options.filename,
        importedAt: new Date().toISOString(),
        totalRows: parseResult.data.length,
        acceptedRows: 0,
        rejectedRows: parseResult.data.length,
        dateFormat: options.dateFormat,
      },
    };
  }

  const transactions: Transaction[] = [];
  const rejectedRows: RejectedRow[] = [];
  const warnings: ImportWarning[] = [];

  for (let i = 0; i < parseResult.data.length; i++) {
    const row = parseResult.data[i]!;
    const rowIndex = i + 2;

    const startedDateResult = parseRevolutDate(row["Started Date"] || "", options.dateFormat);
    if (!startedDateResult.ok) {
      rejectedRows.push({
        rowIndex,
        reason: `Started Date: ${startedDateResult.error}`,
        rawData: JSON.stringify(row),
      });
      continue;
    }

    let completedDateResult = null;
    if (row["Completed Date"] && row["Completed Date"].trim().length > 0) {
      completedDateResult = parseRevolutDate(row["Completed Date"], options.dateFormat);
      if (!completedDateResult.ok) {
        rejectedRows.push({
          rowIndex,
          reason: `Completed Date: ${completedDateResult.error}`,
          rawData: JSON.stringify(row),
        });
        continue;
      }
    }

    const amount = parseAmount(row["Amount"] || "");
    if (amount === null) {
      rejectedRows.push({
        rowIndex,
        reason: `Invalid amount: "${row["Amount"]}"`,
        rawData: JSON.stringify(row),
      });
      continue;
    }

    const fee = parseAmount(row["Fee"] || "");
    if (fee === null) {
      rejectedRows.push({
        rowIndex,
        reason: `Invalid fee: "${row["Fee"]}"`,
        rawData: JSON.stringify(row),
      });
      continue;
    }

    const balance = parseBalance(row["Balance"] || "");

    const tx: Transaction = {
      id: "",
      type: row["Type"] || "",
      product: row["Product"] || "",
      startedAt: startedDateResult.date,
      completedAt: completedDateResult?.date ?? null,
      description: row["Description"] || "",
      amount,
      fee,
      currency: row["Currency"] || "EUR",
      state: row["State"] || "",
      balance,
    };

    tx.id = generateTransactionId(tx);

    if (balance === null) {
      warnings.push({
        type: "missing_balance",
        message: `Row ${rowIndex}: balance is missing`,
        rowIndex,
      });
    }

    transactions.push(tx);
  }

  return {
    transactions,
    rejectedRows,
    warnings,
    metadata: {
      provider: "revolut",
      filename: options.filename,
      importedAt: new Date().toISOString(),
      totalRows: parseResult.data.length,
      acceptedRows: transactions.length,
      rejectedRows: rejectedRows.length,
      dateFormat: options.dateFormat,
    },
  };
}
