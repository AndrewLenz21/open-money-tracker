import { Badge } from "@shared/components/ui";
import { getCategoryIcon } from "@modules/categories/components/categories/CategoryIconPicker";
import type { LucideIcon } from "lucide-react";

interface CategoryBadgeProps {
  name: string;
  color: string | null;
  icon: string | undefined;
  isUncategorized: boolean;
}

export function CategoryBadge({ name, color, icon, isUncategorized }: CategoryBadgeProps) {
  const Icon: LucideIcon | null = icon ? getCategoryIcon(icon) : null;

  return (
    <Badge variant={isUncategorized ? "outline" : "secondary"} className="gap-1.5">
      {Icon ? (
        <Icon className="h-3 w-3" />
      ) : (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color ?? "var(--chart-uncategorized)" }}
        />
      )}
      {name}
    </Badge>
  );
}