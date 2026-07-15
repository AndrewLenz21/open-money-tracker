import type { NormalizedTransaction } from "@modules/import-transactions/domain";

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getTransactionMerchant(tx: NormalizedTransaction): string {
  return tx.paymentName.trim() || tx.originalDescription.trim() || tx.source.trim();
}

export function getMerchantRuleKey(value: string): string {
  return normalizeText(value);
}

export function buildTransactionKey(tx: NormalizedTransaction): string {
  return [
    tx.importId,
    tx.id,
    tx.paymentDate.toISOString(),
    tx.amount,
    tx.currency,
  ].join(":");
}

export function normalizeSearchText(value: string): string {
  return normalizeText(value);
}
