import { useMemo } from "react";
import type { FilterMode } from "../stores/dashboardStore";
import type { CategorizedTransaction } from "../types/dashboard.types";
import { computeDashboardAnalytics } from "../utils/analytics";
import type { UserCategory } from "@modules/categories";

export function useDashboardAnalytics(
  transactions: CategorizedTransaction[],
  currency: string,
  filterMode: FilterMode,
  categories: UserCategory[],
) {
  return useMemo(
    () => computeDashboardAnalytics(transactions, currency, filterMode, categories),
    [categories, currency, filterMode, transactions],
  );
}
