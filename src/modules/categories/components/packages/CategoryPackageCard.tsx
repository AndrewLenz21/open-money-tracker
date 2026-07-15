import { Button, Badge } from "@shared/components/ui";
import type { CategoryPackage } from "../../types/categories.types";

interface CategoryPackageCardProps {
  pkg: CategoryPackage;
  selected: boolean;
  categoryCount: number;
  usageCount: number;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function CategoryPackageCard({ pkg, selected, categoryCount, usageCount, onSelect, onDuplicate, onDelete }: CategoryPackageCardProps) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 ${selected ? "border-primary bg-muted/35" : "border-border/70 bg-card/80"}`}>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{pkg.name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{pkg.description || "No description."}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{categoryCount} categories</Badge>
        <Badge variant="outline">{usageCount} imports</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant={selected ? "secondary" : "outline"} size="sm" onClick={onSelect}>{selected ? "Editing" : "Edit"}</Button>
        <Button variant="ghost" size="sm" onClick={onDuplicate}>Duplicate</Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}
