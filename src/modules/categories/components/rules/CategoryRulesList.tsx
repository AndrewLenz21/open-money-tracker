import type { CategoryRule, UserCategory } from "../../types/categories.types";
import { CategoryRuleRow } from "./CategoryRuleRow";

interface CategoryRulesListProps {
  rules: CategoryRule[];
  categories: UserCategory[];
  onToggle: (ruleId: string, isActive: boolean) => void;
  onDelete: (ruleId: string) => void;
}

export function CategoryRulesList({ rules, categories, onToggle, onDelete }: CategoryRulesListProps) {
  if (rules.length === 0) {
    return <p className="text-sm text-muted-foreground">No rules have been created for this package.</p>;
  }

  return (
    <div className="space-y-2">
      {rules.map((rule) => (
        <CategoryRuleRow
          key={rule.id}
          rule={rule}
          category={categories.find((category) => category.id === rule.categoryId)}
          onToggle={() => onToggle(rule.id, !rule.isActive)}
          onDelete={() => onDelete(rule.id)}
        />
      ))}
    </div>
  );
}
