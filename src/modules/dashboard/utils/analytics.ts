import type { FilterMode } from "../stores/dashboardStore";
import type {
  CashFlowPoint,
  CategorizedTransaction,
  DashboardAnalytics,
} from "../types/dashboard.types";
import type { UserCategory } from "@modules/categories";

function startOfDay(date: Date): Date {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfWeek(date: Date): Date {
  const value = startOfDay(date);
  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + diff);
  return value;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getDateCutoff(filterMode: FilterMode): Date | null {
  if (filterMode === "all") return null;
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (filterMode === "last7" ? 7 : 30));
  return cutoff;
}

export function filterTransactionsByDate<T extends { paymentDate: Date }>(
  transactions: T[],
  filterMode: FilterMode,
): T[] {
  const cutoff = getDateCutoff(filterMode);
  if (!cutoff) return transactions;
  return transactions.filter((tx) => tx.paymentDate >= cutoff);
}

function getDateRange(
  transactions: CategorizedTransaction[],
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

function getSeriesGrouping(
  dateRange: { from: Date; to: Date } | null,
): "day" | "week" | "month" {
  if (!dateRange) return "day";
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.max(
    1,
    Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / msPerDay),
  );
  if (days <= 45) return "day";
  if (days <= 180) return "week";
  return "month";
}

function formatSeriesLabel(date: Date, grouping: "day" | "week" | "month"): string {
  if (grouping === "month") {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      year: "2-digit",
    }).format(date);
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function buildCashFlowSeries(
  transactions: CategorizedTransaction[],
): CashFlowPoint[] {
  const dateRange = getDateRange(transactions);
  const grouping = getSeriesGrouping(dateRange);
  const buckets = new Map<string, { date: Date; income: number; expenses: number; net: number }>();

  for (const tx of transactions) {
    const bucketDate = grouping === "day"
      ? startOfDay(tx.paymentDate)
      : grouping === "week"
        ? startOfWeek(tx.paymentDate)
        : startOfMonth(tx.paymentDate);
    const key = bucketDate.toISOString();
    const bucket = buckets.get(key) ?? {
      date: bucketDate,
      income: 0,
      expenses: 0,
      net: 0,
    };

    if (tx.amount >= 0) {
      bucket.income += tx.amount;
    } else {
      bucket.expenses += Math.abs(tx.amount);
    }
    bucket.net += tx.amount - tx.fee;
    buckets.set(key, bucket);
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((item) => ({
      label: formatSeriesLabel(item.date, grouping),
      income: item.income,
      expenses: item.expenses,
      net: item.net,
    }));
}

export function computeDashboardAnalytics(
  transactions: CategorizedTransaction[],
  currency: string,
  filterMode: FilterMode,
  categories: UserCategory[],
): DashboardAnalytics {
  const completedCurrencyTransactions = transactions
    .filter((tx) => tx.currency === currency && tx.state === "COMPLETED")
    .sort((a, b) => a.paymentDate.getTime() - b.paymentDate.getTime());
  const filteredTransactions = filterTransactionsByDate(
    completedCurrencyTransactions,
    filterMode,
  );

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalFees = 0;

  for (const tx of filteredTransactions) {
    if (tx.amount >= 0) {
      totalIncome += tx.amount;
    } else {
      totalExpenses += Math.abs(tx.amount);
    }
    totalFees += tx.fee;
  }

  const dateRange = getDateRange(filteredTransactions);
  const latestBalance = [...filteredTransactions]
    .reverse()
    .find((tx) => tx.balance !== null)?.balance ?? null;

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const categoryTotals = new Map<string, { amount: number; count: number }>();
  for (const tx of filteredTransactions) {
    if (tx.amount >= 0) continue;
    const key = tx.categoryId ?? "uncategorized";
    const current = categoryTotals.get(key) ?? { amount: 0, count: 0 };
    current.amount += Math.abs(tx.amount);
    current.count += 1;
    categoryTotals.set(key, current);
  }

  const categorySpending = Array.from(categoryTotals.entries())
    .map(([categoryId, value]) => {
      const category = categoryId === "uncategorized" ? null : categoryById.get(categoryId) ?? null;
      return {
      categoryId: category?.id ?? null,
      label: category?.name ?? "Uncategorized",
      color: category?.color ?? "var(--chart-uncategorized)",
      amount: value.amount,
      percentage: totalExpenses > 0 ? (value.amount / totalExpenses) * 100 : 0,
      count: value.count,
      category,
    };})
    .sort((a, b) => b.amount - a.amount);

  const largestExpense = filteredTransactions
    .filter((tx) => tx.amount < 0)
    .sort((a, b) => a.amount - b.amount)[0] ?? null;

  const merchantCounts = new Map<string, number>();
  for (const tx of filteredTransactions) {
    if (!tx.merchant) continue;
    merchantCounts.set(tx.merchant, (merchantCounts.get(tx.merchant) ?? 0) + 1);
  }

  let mostFrequentMerchant: { merchant: string; count: number } | null = null;
  for (const [merchant, count] of merchantCounts) {
    if (!mostFrequentMerchant || count > mostFrequentMerchant.count) {
      mostFrequentMerchant = { merchant, count };
    }
  }

  const averageDailySpending = (() => {
    if (!dateRange || totalExpenses === 0) return 0;
    const diff = dateRange.to.getTime() - dateRange.from.getTime();
    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
    return totalExpenses / days;
  })();

  return {
    transactions: filteredTransactions,
    currentBalance: latestBalance,
    totalIncome,
    totalExpenses,
    netCashFlow: totalIncome - totalExpenses - totalFees,
    totalFees,
    transactionCount: filteredTransactions.length,
    uncategorizedCount: filteredTransactions.filter(
      (tx) => tx.categoryId === null,
    ).length,
    dateRange,
    averageDailySpending,
    categorySpending,
    cashFlowSeries: buildCashFlowSeries(filteredTransactions),
    largestExpense,
    mostFrequentMerchant,
    highestSpendingCategory: categorySpending[0] ?? null,
  };
}
