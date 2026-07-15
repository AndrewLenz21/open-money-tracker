import { useState } from "react";
import { Search } from "lucide-react";
import type { CategoryPackage } from "../../types/categories.types";
import { CategoryPackageListItem } from "./CategoryPackageListItem";
import { CreatePackageDialog } from "./CreatePackageDialog";

interface CategoryPackageSidebarProps {
  packages: CategoryPackage[];
  categories: { packageId: string }[];
  selectedPackageId: string | null;
  usage: Map<string, number>;
  onSelect: (packageId: string) => void;
  onCreate: (name: string, description?: string) => { ok: true; packageId: string } | { ok: false; error: string };
  onCreated: (packageId: string) => void;
  onDuplicate: (packageId: string) => void;
  onDelete: (packageId: string) => void;
  t: (path: string) => string;
}

export function CategoryPackageSidebar({
  packages,
  categories,
  selectedPackageId,
  usage,
  onSelect,
  onCreate,
  onCreated,
  onDuplicate,
  onDelete,
  t,
}: CategoryPackageSidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? packages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(query.toLowerCase()) ||
          (pkg.description ?? "").toLowerCase().includes(query.toLowerCase()),
      )
    : packages;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{t("packages.sidebarTitle") || "Packages"}</p>
          <p className="text-xs text-muted-foreground">{packages.length} {t("packages.active") || "total"}</p>
        </div>
        <CreatePackageDialog onCreate={onCreate} onCreated={onCreated} />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("packages.sidebarSearch") || "Search packages\u2026"}
          className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
        />
      </div>

      <div className="scrollarea flex-1 overflow-y-auto -mx-1 px-1">
        <div className="space-y-1.5">
          {filtered.map((pkg) => (
            <CategoryPackageListItem
              key={pkg.id}
              name={pkg.name}
              description={pkg.description}
              categoryCount={categories.filter((cat) => cat.packageId === pkg.id).length}
              usageCount={usage.get(pkg.id) ?? 0}
              selected={pkg.id === selectedPackageId}
              onSelect={() => onSelect(pkg.id)}
              onDuplicate={() => onDuplicate(pkg.id)}
              onDelete={() => onDelete(pkg.id)}
            />
          ))}
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              {query ? t("packages.noPackagesMatch") || "No packages match your search." : t("packages.noPackages") || "No packages yet."}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}