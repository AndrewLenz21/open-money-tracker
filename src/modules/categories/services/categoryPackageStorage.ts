import type { CategoryPackage, UserCategory } from "../types/categories.types";

export const CATEGORY_PACKAGES_KEY = "open-money-tracker.category-packages.v1";
export const USER_CATEGORIES_KEY = "open-money-tracker.categories.v1";

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

export function readCategoryPackages(): CategoryPackage[] {
  return readJson<CategoryPackage[]>(CATEGORY_PACKAGES_KEY, []);
}

export function saveCategoryPackages(packages: CategoryPackage[]): void {
  writeJson(CATEGORY_PACKAGES_KEY, packages);
}

export function readUserCategories(): UserCategory[] {
  return readJson<UserCategory[]>(USER_CATEGORIES_KEY, []);
}

export function saveUserCategories(categories: UserCategory[]): void {
  writeJson(USER_CATEGORIES_KEY, categories);
}
