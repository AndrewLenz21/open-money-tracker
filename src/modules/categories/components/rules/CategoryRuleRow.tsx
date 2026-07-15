import { Button, Badge } from "@shared/components/ui";
import type { CategoryRule, UserCategory } from "../../types/categories.types";

interface CategoryRuleRowProps {
  rule: CategoryRule;
  category: UserCategory | undefined;
  onToggle: () => void;
  onDelete: () => void;
}

export function CategoryRuleRow({ rule, category, onToggle, onDelete }: CategoryRuleRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 text-sm">
        <p className="font-medium text-foreground">{category?.name ?? "Missing category"}</p>
        <p className="text-xs text-muted-foreground">{rule.matchType} · {rule.matchValue}</p>
      </div>
      <div className="flex gap-2">
        <Badge variant={rule.isActive ? "success" : "outline"}>{rule.isActive ? "Active" : "Inactive"}</Badge>
        <Button variant="ghost" size="sm" onClick={onToggle}>{rule.isActive ? "Disable" : "Enable"}</Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}
