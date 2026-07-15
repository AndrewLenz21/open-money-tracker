import type { CategoryDataSnapshot } from "../types/categories.types";

export function migrateCategoryData<T>(value: T, fallback: T): T {
  return value ?? fallback;
}

export const EMPTY_CATEGORY_DATA: CategoryDataSnapshot = {
  packages: [],
  categories: [],
  importLinks: [],
  assignments: [],
  rules: [],
};

export function clearLegacyDashboardCategoryStorage(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem("omt:dashboard:transactionCategories");
    localStorage.removeItem("omt:dashboard:merchantCategoryRules");
  } catch {
    // noop
  }
}
