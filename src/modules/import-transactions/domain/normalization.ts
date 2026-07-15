import type {
  ImportResult,
  NormalizedTransaction,
} from "./types";

export function normalizeTransactions(
  result: ImportResult,
  importId: number,
): NormalizedTransaction[] {
  return result.transactions.map((tx) => ({
    id: tx.id,
    importId,
    paymentName: tx.description,
    paymentDate: tx.completedAt ?? tx.startedAt,
    amount: tx.amount,
    fee: tx.fee,
    currency: tx.currency,
    state: tx.state,
    type: tx.amount > 0 ? ("income" as const) : ("expense" as const),
    source: result.metadata.provider,
    originalDescription: tx.description,
    accountProduct: tx.product,
    balance: tx.balance,
    importedAt: result.metadata.importedAt,
    filename: result.metadata.filename,
  }));
}
