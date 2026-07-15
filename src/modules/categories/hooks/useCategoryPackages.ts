import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_CATEGORY_COLOR } from "../constants/categoryColors";
import {
  readImportPackageLinks,
  readTransactionCategoryAssignments,
  saveImportPackageLinks,
  saveTransactionCategoryAssignments,
} from "../services/categoryAssignmentStorage";
import {
  readCategoryPackages,
  readUserCategories,
  saveCategoryPackages,
  saveUserCategories,
} from "../services/categoryPackageStorage";
import { readCategoryRules, saveCategoryRules } from "../services/categoryRuleStorage";
import type {
  CategoryMutationResult,
  CategoryPackage,
  CategoryRule,
  CategoryRuleMatchType,
  ImportCategoryPackageLink,
  TransactionCategoryAssignment,
  UserCategory,
} from "../types/categories.types";
import { normalizeCategoryName, validateCategoryName, validatePackageName } from "../utils/categoryValidation";
import { clearLegacyDashboardCategoryStorage } from "../utils/packageMigration";

function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

function now(): string {
  return new Date().toISOString();
}

export function useCategoryPackages() {
  const [packages, setPackagesState] = useState(readCategoryPackages);
  const [categories, setCategoriesState] = useState(readUserCategories);
  const [importLinks, setImportLinksState] = useState(readImportPackageLinks);
  const [assignments, setAssignmentsState] = useState(readTransactionCategoryAssignments);
  const [rules, setRulesState] = useState(readCategoryRules);

  useEffect(() => {
    clearLegacyDashboardCategoryStorage();
  }, []);

  const setPackages = useCallback((next: CategoryPackage[]) => {
    setPackagesState(next);
    saveCategoryPackages(next);
  }, []);

  const setCategories = useCallback((next: UserCategory[]) => {
    setCategoriesState(next);
    saveUserCategories(next);
  }, []);

  const setImportLinks = useCallback((next: ImportCategoryPackageLink[]) => {
    setImportLinksState(next);
    saveImportPackageLinks(next);
  }, []);

  const setAssignments = useCallback((next: TransactionCategoryAssignment[]) => {
    setAssignmentsState(next);
    saveTransactionCategoryAssignments(next);
  }, []);

  const setRules = useCallback((next: CategoryRule[]) => {
    setRulesState(next);
    saveCategoryRules(next);
  }, []);

  const getPackageCategories = useCallback(
    (packageId: string, includeArchived = false) =>
      categories
        .filter((category) => category.packageId === packageId && (includeArchived || !category.isArchived))
        .sort((a, b) => a.order - b.order),
    [categories],
  );

  const createPackage = useCallback(
    (name: string, description?: string): { ok: true; packageId: string } | { ok: false; error: string } => {
      const error = validatePackageName(name, packages);
      if (error) return { ok: false, error };
      const timestamp = now();
      const pkg: CategoryPackage = {
        id: createId("pkg"),
        name: normalizeCategoryName(name),
        description: description?.trim() || undefined,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setPackages([...packages, pkg]);
      return { ok: true, packageId: pkg.id };
    },
    [packages, setPackages],
  );

  const updatePackage = useCallback(
    (packageId: string, name: string, description?: string): CategoryMutationResult => {
      const error = validatePackageName(name, packages, packageId);
      if (error) return { ok: false, error };
      setPackages(
        packages.map((pkg) =>
          pkg.id === packageId
            ? {
                ...pkg,
                name: normalizeCategoryName(name),
                description: description?.trim() || undefined,
                updatedAt: now(),
              }
            : pkg,
        ),
      );
      return { ok: true };
    },
    [packages, setPackages],
  );

  const duplicatePackage = useCallback(
    (packageId: string): { ok: true; packageId: string } | { ok: false; error: string } => {
      const source = packages.find((pkg) => pkg.id === packageId);
      if (!source) return { ok: false, error: "Package not found." };
      const baseName = `${source.name} copy`;
      let nextName = baseName;
      let suffix = 2;
      while (validatePackageName(nextName, packages)) {
        nextName = `${baseName} ${suffix}`;
        suffix += 1;
      }
      const timestamp = now();
      const newPackageId = createId("pkg");
      const sourceCategories = getPackageCategories(packageId, true);
      const idMap = new Map<string, string>();
      const duplicatedCategories = sourceCategories.map((category) => {
        const id = createId("cat");
        idMap.set(category.id, id);
        return {
          ...category,
          id,
          packageId: newPackageId,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
      });
      const duplicatedRules = rules
        .filter((rule) => rule.packageId === packageId && idMap.has(rule.categoryId))
        .map((rule) => ({
          ...rule,
          id: createId("rule"),
          packageId: newPackageId,
          categoryId: idMap.get(rule.categoryId)!,
          createdAt: timestamp,
          updatedAt: timestamp,
        }));
      setPackages([
        ...packages,
        {
          ...source,
          id: newPackageId,
          name: nextName,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ]);
      setCategories([...categories, ...duplicatedCategories]);
      setRules([...rules, ...duplicatedRules]);
      return { ok: true, packageId: newPackageId };
    },
    [categories, getPackageCategories, packages, rules, setCategories, setPackages, setRules],
  );

  const deletePackage = useCallback(
    (packageId: string): CategoryMutationResult => {
      setPackages(packages.filter((pkg) => pkg.id !== packageId));
      setCategories(categories.filter((category) => category.packageId !== packageId));
      setRules(rules.filter((rule) => rule.packageId !== packageId));
      setImportLinks(importLinks.filter((link) => link.packageId !== packageId));
      setAssignments(assignments.filter((assignment) => assignment.packageId !== packageId));
      return { ok: true };
    },
    [assignments, categories, importLinks, packages, rules, setAssignments, setCategories, setImportLinks, setPackages, setRules],
  );

  const createCategory = useCallback(
    (packageId: string, name: string, color = DEFAULT_CATEGORY_COLOR, icon?: string): { ok: true; categoryId: string } | { ok: false; error: string } => {
      const error = validateCategoryName(name, categories, packageId);
      if (error) return { ok: false, error };
      const timestamp = now();
      const order = Math.max(-1, ...categories.filter((category) => category.packageId === packageId).map((category) => category.order)) + 1;
      const category: UserCategory = {
        id: createId("cat"),
        packageId,
        name: normalizeCategoryName(name),
        color,
        icon: icon?.trim() || undefined,
        order,
        isArchived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setCategories([...categories, category]);
      return { ok: true, categoryId: category.id };
    },
    [categories, setCategories],
  );

  const updateCategory = useCallback(
    (categoryId: string, updates: Partial<Pick<UserCategory, "name" | "color" | "icon" | "order" | "isArchived">>): CategoryMutationResult => {
      const category = categories.find((item) => item.id === categoryId);
      if (!category) return { ok: false, error: "Category not found." };
      if (updates.name !== undefined) {
        const error = validateCategoryName(updates.name, categories, category.packageId, categoryId);
        if (error) return { ok: false, error };
      }
      setCategories(
        categories.map((item) =>
          item.id === categoryId
            ? {
                ...item,
                ...updates,
                name: updates.name !== undefined ? normalizeCategoryName(updates.name) : item.name,
                icon: updates.icon?.trim() || undefined,
                updatedAt: now(),
              }
            : item,
        ),
      );
      return { ok: true };
    },
    [categories, setCategories],
  );

  const deleteCategory = useCallback(
    (categoryId: string): CategoryMutationResult => {
      setCategories(categories.filter((category) => category.id !== categoryId));
      setRules(rules.filter((rule) => rule.categoryId !== categoryId));
      setAssignments(assignments.map((assignment) => assignment.categoryId === categoryId ? { ...assignment, categoryId: null, updatedAt: now() } : assignment));
      return { ok: true };
    },
    [assignments, categories, rules, setAssignments, setCategories, setRules],
  );

  const moveCategory = useCallback(
    (packageId: string, categoryId: string, direction: "up" | "down") => {
      const packageCategories = getPackageCategories(packageId, true);
      const index = packageCategories.findIndex((category) => category.id === categoryId);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || targetIndex < 0 || targetIndex >= packageCategories.length) return;
      const reordered = [...packageCategories];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, moved!);
      const orderMap = new Map(reordered.map((category, order) => [category.id, order]));
      setCategories(categories.map((category) => orderMap.has(category.id) ? { ...category, order: orderMap.get(category.id)!, updatedAt: now() } : category));
    },
    [categories, getPackageCategories, setCategories],
  );

  const reorderCategory = useCallback(
    (packageId: string, categoryId: string, targetPosition: number) => {
      const packageCategories = getPackageCategories(packageId, true);
      const currentIndex = packageCategories.findIndex((category) => category.id === categoryId);
      if (currentIndex < 0 || currentIndex === targetPosition) return;
      const reordered = [...packageCategories];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(targetPosition, 0, moved!);
      const orderMap = new Map(reordered.map((category, order) => [category.id, order]));
      setCategories(categories.map((category) => orderMap.has(category.id) ? { ...category, order: orderMap.get(category.id)!, updatedAt: now() } : category));
    },
    [categories, getPackageCategories, setCategories],
  );

  const getPackageForImport = useCallback(
    (importId: number | null | undefined) => {
      if (importId == null) return null;
      const packageId = importLinks.find((link) => link.importId === String(importId))?.packageId;
      return packageId ? packages.find((pkg) => pkg.id === packageId) ?? null : null;
    },
    [importLinks, packages],
  );

  const linkImportToPackage = useCallback(
    (importId: number, packageId: string | null, resetAssignments: boolean) => {
      const importKey = String(importId);
      setImportLinks(
        packageId
          ? [...importLinks.filter((link) => link.importId !== importKey), { importId: importKey, packageId, updatedAt: now() }]
          : importLinks.filter((link) => link.importId !== importKey),
      );
      if (resetAssignments) {
        setAssignments(assignments.filter((assignment) => assignment.importId !== importKey));
      }
    },
    [assignments, importLinks, setAssignments, setImportLinks],
  );

  const setTransactionCategory = useCallback(
    (transactionKey: string, importId: number, packageId: string, categoryId: string | null) => {
      const importKey = String(importId);
      setAssignmentsState((prev) => {
        const existing = prev.filter(
          (assignment) => !(assignment.transactionKey === transactionKey && assignment.packageId === packageId),
        );
        const next = [
          ...existing,
          {
            transactionKey,
            importId: importKey,
            packageId,
            categoryId,
            updatedAt: now(),
          },
        ];
        saveTransactionCategoryAssignments(next);
        return next;
      });
    },
    [setAssignmentsState],
  );

  const createRule = useCallback(
    (packageId: string, categoryId: string, matchType: CategoryRuleMatchType, matchValue: string): CategoryMutationResult => {
      const normalized = matchValue.trim();
      if (!normalized) return { ok: false, error: "Rule value is required." };
      const timestamp = now();
      const maxPriority = Math.max(-1, ...rules.filter((rule) => rule.packageId === packageId).map((rule) => rule.priority));
      setRules([
        ...rules,
        {
          id: createId("rule"),
          packageId,
          categoryId,
          matchType,
          matchValue: normalized,
          priority: maxPriority + 1,
          isActive: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ]);
      return { ok: true };
    },
    [rules, setRules],
  );

  const updateRule = useCallback(
    (ruleId: string, updates: Partial<Pick<CategoryRule, "isActive" | "priority">>) => {
      setRules(rules.map((rule) => rule.id === ruleId ? { ...rule, ...updates, updatedAt: now() } : rule));
    },
    [rules, setRules],
  );

  const deleteRule = useCallback(
    (ruleId: string) => {
      setRules(rules.filter((rule) => rule.id !== ruleId));
    },
    [rules, setRules],
  );

  const packageUsage = useMemo(() => {
    const usage = new Map<string, number>();
    for (const link of importLinks) {
      usage.set(link.packageId, (usage.get(link.packageId) ?? 0) + 1);
    }
    return usage;
  }, [importLinks]);

  return {
    packages,
    categories,
    importLinks,
    assignments,
    rules,
    packageUsage,
    getPackageCategories,
    getPackageForImport,
    createPackage,
    updatePackage,
    duplicatePackage,
    deletePackage,
    createCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
    reorderCategory,
    linkImportToPackage,
    setTransactionCategory,
    createRule,
    updateRule,
    deleteRule,
  };
}
