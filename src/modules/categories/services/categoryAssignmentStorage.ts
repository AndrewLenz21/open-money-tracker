import type { ImportCategoryPackageLink, TransactionCategoryAssignment } from "../types/categories.types";

export const IMPORT_PACKAGE_LINKS_KEY = "open-money-tracker.import-package-links.v1";
export const TRANSACTION_CATEGORY_ASSIGNMENTS_KEY = "open-money-tracker.transaction-categories.v1";
export const ROWS_PER_PAGE_KEY = "open-money-tracker.dashboard.rows-per-page.v1";

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

export function readImportPackageLinks(): ImportCategoryPackageLink[] {
  return readJson<ImportCategoryPackageLink[]>(IMPORT_PACKAGE_LINKS_KEY, []);
}

export function saveImportPackageLinks(links: ImportCategoryPackageLink[]): void {
  writeJson(IMPORT_PACKAGE_LINKS_KEY, links);
}

export function readTransactionCategoryAssignments(): TransactionCategoryAssignment[] {
  return readJson<TransactionCategoryAssignment[]>(TRANSACTION_CATEGORY_ASSIGNMENTS_KEY, []);
}

export function saveTransactionCategoryAssignments(assignments: TransactionCategoryAssignment[]): void {
  writeJson(TRANSACTION_CATEGORY_ASSIGNMENTS_KEY, assignments);
}

export function readRowsPerPage(): number {
  const value = readJson<number>(ROWS_PER_PAGE_KEY, 20);
  return [5, 10, 20, 50, 100].includes(value) ? value : 20;
}

export function saveRowsPerPage(value: number): void {
  writeJson(ROWS_PER_PAGE_KEY, value);
}
