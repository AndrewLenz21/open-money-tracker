import type { CategoryPackage, UserCategory } from "../../types/categories.types";
import { CategoryPackageCard } from "./CategoryPackageCard";

interface CategoryPackageListProps {
  packages: CategoryPackage[];
  categories: UserCategory[];
  selectedPackageId: string | null;
  usage: Map<string, number>;
  onSelect: (packageId: string) => void;
  onDuplicate: (packageId: string) => void;
  onDelete: (packageId: string) => void;
}

export function CategoryPackageList({ packages, categories, selectedPackageId, usage, onSelect, onDuplicate, onDelete }: CategoryPackageListProps) {
  if (packages.length === 0) {
    return <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-5 py-8 text-center text-sm text-muted-foreground">No category packages yet. Create one to start categorizing.</div>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {packages.map((pkg) => (
        <CategoryPackageCard
          key={pkg.id}
          pkg={pkg}
          selected={pkg.id === selectedPackageId}
          categoryCount={categories.filter((category) => category.packageId === pkg.id && !category.isArchived).length}
          usageCount={usage.get(pkg.id) ?? 0}
          onSelect={() => onSelect(pkg.id)}
          onDuplicate={() => onDuplicate(pkg.id)}
          onDelete={() => onDelete(pkg.id)}
        />
      ))}
    </div>
  );
}
