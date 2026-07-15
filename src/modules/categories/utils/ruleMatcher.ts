import type { CategoryRule } from "../types/categories.types";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function matchCategoryRule(
  rule: CategoryRule,
  merchant: string,
  description: string,
): boolean {
  const matchValue = normalize(rule.matchValue);
  const normalizedMerchant = normalize(merchant);
  const normalizedDescription = normalize(description);

  if (!matchValue) return false;
  switch (rule.matchType) {
    case "merchant-exact":
      return normalizedMerchant === matchValue;
    case "description-exact":
      return normalizedDescription === matchValue;
    case "description-contains":
      return normalizedDescription.includes(matchValue);
    case "description-starts-with":
      return normalizedDescription.startsWith(matchValue);
  }
}

export function findMatchingRule(
  rules: CategoryRule[],
  merchant: string,
  description: string,
): CategoryRule | null {
  return [...rules]
    .filter((rule) => rule.isActive)
    .sort((a, b) => a.priority - b.priority)
    .find((rule) => matchCategoryRule(rule, merchant, description)) ?? null;
}
