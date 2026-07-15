import { UNCATEGORIZED_ID, type CategoryPackage, type UserCategory } from "../types/categories.types";

export function normalizeCategoryName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeComparable(value: string): string {
  return normalizeCategoryName(value).toLowerCase();
}

export function isReservedCategoryName(value: string): boolean {
  return normalizeComparable(value) === UNCATEGORIZED_ID;
}

export function validatePackageName(
  name: string,
  packages: CategoryPackage[],
  editingPackageId?: string,
): string | null {
  const normalized = normalizeCategoryName(name);
  if (!normalized) return "Package name is required.";
  if (normalized.length > 60) return "Package name must be 60 characters or less.";
  const duplicate = packages.some(
    (pkg) => pkg.id !== editingPackageId && normalizeComparable(pkg.name) === normalizeComparable(normalized),
  );
  if (duplicate) return "A package with this name already exists.";
  return null;
}

export function validateCategoryName(
  name: string,
  categories: UserCategory[],
  packageId: string,
  editingCategoryId?: string,
): string | null {
  const normalized = normalizeCategoryName(name);
  if (!normalized) return "Category name is required.";
  if (normalized.length > 40) return "Category name must be 40 characters or less.";
  if (isReservedCategoryName(normalized)) return "Uncategorized is reserved and cannot be used.";
  const duplicate = categories.some(
    (category) =>
      category.packageId === packageId &&
      category.id !== editingCategoryId &&
      normalizeComparable(category.name) === normalizeComparable(normalized),
  );
  if (duplicate) return "A category with this name already exists in this package.";
  return null;
}
