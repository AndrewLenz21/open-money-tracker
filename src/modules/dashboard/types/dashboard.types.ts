import type { FilterMode } from "../stores/dashboardStore";
import type { NormalizedTransaction } from "@modules/import-transactions/domain";
import type { UserCategory } from "@modules/categories";

export type CategorySource = "manual" | "rule" | "none";

export type CategorizedTransaction = NormalizedTransaction & {
  transactionKey: string;
  merchant: string;
  categoryId: string | null;
  categoryName: string;
  categoryColor: string | null;
  categoryIcon: string | undefined;
  categorySource: CategorySource;
  isUncategorized: boolean;
};

export type TransactionSort =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc";

export type TransactionTypeFilter = "all" | "income" | "expense";

export type TransactionTableFilters = {
  search: string;
  categoryId: string | null | "all";
  type: TransactionTypeFilter;
  onlyUncategorized: boolean;
  sort: TransactionSort;
  dateMode: FilterMode;
};

export type CashFlowPoint = {
  label: string;
  income: number;
  expenses: number;
  net: number;
};

export type CategorySpendingPoint = {
  categoryId: string | null;
  label: string;
  color: string;
  amount: number;
  percentage: number;
  count: number;
  category: UserCategory | null;
};

export type DashboardInsight = {
  label: string;
  value: string;
  help?: string;
};

export type DashboardAnalytics = {
  transactions: CategorizedTransaction[];
  currentBalance: number | null;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  totalFees: number;
  transactionCount: number;
  uncategorizedCount: number;
  dateRange: { from: Date; to: Date } | null;
  averageDailySpending: number;
  categorySpending: CategorySpendingPoint[];
  cashFlowSeries: CashFlowPoint[];
  largestExpense: CategorizedTransaction | null;
  mostFrequentMerchant: { merchant: string; count: number } | null;
  highestSpendingCategory: CategorySpendingPoint | null;
};
