import { useMemo } from "react";
import type { NormalizedTransaction } from "@modules/import-transactions/domain";
import type { CategoryPackage, CategoryRule, TransactionCategoryAssignment, UserCategory } from "@modules/categories";
import { findMatchingRule } from "@modules/categories";
import type { CategorizedTransaction } from "../types/dashboard.types";
import {
  buildTransactionKey,
  getTransactionMerchant,
} from "../utils/transactionKey";

export function useTransactionCategories(
  transactions: NormalizedTransaction[],
  selectedPackage: CategoryPackage | null,
  categories: UserCategory[],
  assignments: TransactionCategoryAssignment[],
  rules: CategoryRule[],
) {
  const categorizedTransactions = useMemo<CategorizedTransaction[]>(() => {
    const activeCategoryById = new Map(
      categories
        .filter((category) => category.packageId === selectedPackage?.id && !category.isArchived)
        .map((category) => [category.id, category]),
    );
    const assignmentByKey = new Map(
      assignments
        .filter((assignment) => assignment.packageId === selectedPackage?.id)
        .map((assignment) => [assignment.transactionKey, assignment]),
    );
    const packageRules = rules.filter((rule) => rule.packageId === selectedPackage?.id);

    return transactions.map((tx) => {
      const transactionKey = buildTransactionKey(tx);
      const merchant = getTransactionMerchant(tx);
      let category: UserCategory | null = null;
      let categorySource: CategorizedTransaction["categorySource"] = "none";

      if (selectedPackage) {
        const assignment = assignmentByKey.get(transactionKey);
        if (assignment?.categoryId) {
          category = activeCategoryById.get(assignment.categoryId) ?? null;
          categorySource = category ? "manual" : "none";
        } else if (!assignment) {
          const matchedRule = findMatchingRule(packageRules, merchant, tx.originalDescription);
          if (matchedRule) {
            category = activeCategoryById.get(matchedRule.categoryId) ?? null;
            categorySource = category ? "rule" : "none";
          }
        }
      }

      return {
        ...tx,
        transactionKey,
        merchant,
        categoryId: category?.id ?? null,
        categoryName: category?.name ?? "Uncategorized",
        categoryColor: category?.color ?? null,
        categoryIcon: category?.icon,
        categorySource,
        isUncategorized: !category,
      };
    });
  }, [assignments, categories, rules, selectedPackage, transactions]);

  return {
    categorizedTransactions,
  };
}
