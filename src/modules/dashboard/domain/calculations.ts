import type { NormalizedTransaction } from "@modules/import-transactions/domain";

export type CurrencySummary = {
  currency: string;
  totalIncome: number;
  totalExpenses: number;
  totalFees: number;
  netCashFlow: number;
  latestBalance: number | null;
  transactionCount: number;
};

export type BalancePoint = {
  date: Date;
  balance: number;
};

export function getAvailableCurrencies(
  transactions: NormalizedTransaction[],
): string[] {
  const currencies = new Set(transactions.map((tx) => tx.currency));
  return Array.from(currencies).sort();
}

export function getMostFrequentCurrency(
  transactions: NormalizedTransaction[],
): string | null {
  const counts = new Map<string, number>();
  for (const tx of transactions) {
    counts.set(tx.currency, (counts.get(tx.currency) || 0) + 1);
  }
  let maxCount = 0;
  let maxCurrency: string | null = null;
  for (const [cur, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      maxCurrency = cur;
    }
  }
  return maxCurrency;
}

export function computeCurrencySummary(
  transactions: NormalizedTransaction[],
  currency: string,
): CurrencySummary {
  const filtered = transactions
    .filter((tx) => tx.currency === currency && tx.state === "COMPLETED")
    .sort(
      (a, b) => a.paymentDate.getTime() - b.paymentDate.getTime(),
    );

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalFees = 0;

  for (const tx of filtered) {
    if (tx.amount > 0) {
      totalIncome += tx.amount;
    } else {
      totalExpenses += Math.abs(tx.amount);
    }
    totalFees += tx.fee;
  }

  const netCashFlow = totalIncome - totalExpenses - totalFees;
  const lastTxWithBalance = [...filtered]
    .reverse()
    .find((tx) => tx.balance !== null);
  const latestBalance = lastTxWithBalance?.balance ?? null;

  return {
    currency,
    totalIncome,
    totalExpenses,
    totalFees,
    netCashFlow,
    latestBalance,
    transactionCount: filtered.length,
  };
}

export function getDateRange(
  transactions: NormalizedTransaction[],
): { from: Date; to: Date } | null {
  if (transactions.length === 0) return null;
  const sorted = [...transactions].sort(
    (a, b) => a.paymentDate.getTime() - b.paymentDate.getTime(),
  );
  return {
    from: sorted[0]!.paymentDate,
    to: sorted[sorted.length - 1]!.paymentDate,
  };
}

export function computeBalanceHistory(
  transactions: NormalizedTransaction[],
  currency: string,
): BalancePoint[] {
  const filtered = transactions
    .filter((tx) => tx.currency === currency)
    .sort(
      (a, b) => a.paymentDate.getTime() - b.paymentDate.getTime(),
    );

  const points: BalancePoint[] = [];
  for (const tx of filtered) {
    if (tx.balance !== null) {
      points.push({ date: tx.paymentDate, balance: tx.balance });
    }
  }
  return points;
}

export function computeIncomeVsExpenses(
  transactions: NormalizedTransaction[],
  currency: string,
): { income: number; expenses: number } {
  const completed = transactions.filter(
    (tx) => tx.currency === currency && tx.state === "COMPLETED",
  );
  let income = 0;
  let expenses = 0;
  for (const tx of completed) {
    if (tx.amount > 0) income += tx.amount;
    else expenses += Math.abs(tx.amount);
  }
  return { income, expenses };
}
