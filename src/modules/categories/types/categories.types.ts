export const UNCATEGORIZED_ID = "uncategorized" as const;

export type CategoryPackage = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  visual?: {
    color?: string;
  };
};

export type UserCategory = {
  id: string;
  packageId: string;
  name: string;
  color: string;
  icon?: string;
  order: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ImportCategoryPackageLink = {
  importId: string;
  packageId: string;
  updatedAt: string;
};

export type TransactionCategoryAssignment = {
  transactionKey: string;
  importId: string;
  packageId: string;
  categoryId: string | null;
  updatedAt: string;
};

export type CategoryRuleMatchType =
  | "merchant-exact"
  | "description-exact"
  | "description-contains"
  | "description-starts-with";

export type CategoryRule = {
  id: string;
  packageId: string;
  categoryId: string;
  matchType: CategoryRuleMatchType;
  matchValue: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryDataSnapshot = {
  packages: CategoryPackage[];
  categories: UserCategory[];
  importLinks: ImportCategoryPackageLink[];
  assignments: TransactionCategoryAssignment[];
  rules: CategoryRule[];
};

export type CategoryMutationResult =
  | { ok: true }
  | { ok: false; error: string };
