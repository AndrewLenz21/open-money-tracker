import type { CategoryRule } from "../types/categories.types";

export const CATEGORY_RULES_KEY = "open-money-tracker.category-rules.v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // noop
  }
}

export function readCategoryRules(): CategoryRule[] {
  return readJson<CategoryRule[]>(CATEGORY_RULES_KEY, []);
}

export function saveCategoryRules(rules: CategoryRule[]): void {
  writeJson(CATEGORY_RULES_KEY, rules);
}
