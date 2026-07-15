import { useState } from "react";
import { Button, Select, Badge } from "@shared/components/ui";
import type { CategoryPackage, UserCategory } from "../../types/categories.types";

interface CategoryPackageSelectorProps {
  importId: number | null;
  packages: CategoryPackage[];
  categories: UserCategory[];
  selectedPackage: CategoryPackage | null;
  onChangePackage: (packageId: string | null, resetAssignments: boolean) => void;
  onCreatePackage: (name: string, description?: string) => { ok: true; packageId: string } | { ok: false; error: string };
  onManagePackages: () => void;
}

export function CategoryPackageSelector({
  importId,
  packages,
  categories,
  selectedPackage,
  onChangePackage,
  onCreatePackage,
  onManagePackages,
}: CategoryPackageSelectorProps) {
  const [pendingPackageId, setPendingPackageId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedCount = selectedPackage
    ? categories.filter((category) => category.packageId === selectedPackage.id && !category.isArchived).length
    : 0;

  return (
    <div className="rounded-lg border border-border/70 bg-card/95 p-4 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Category package</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">{selectedPackage?.name ?? "No package selected"}</p>
            {selectedPackage ? <Badge variant="secondary">{selectedCount} categories</Badge> : null}
          </div>
          {!selectedPackage ? (
            <p className="mt-1 text-sm text-muted-foreground">Select a category package to start categorizing these transactions.</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={selectedPackage?.id ?? ""}
            onChange={(event) => {
              const next = event.target.value || null;
              if (!selectedPackage || next === selectedPackage.id) {
                onChangePackage(next, false);
              } else {
                setPendingPackageId(next);
              }
            }}
            disabled={importId === null}
            options={[
              { value: "", label: "No package" },
              ...packages.map((pkg) => ({ value: pkg.id, label: pkg.name })),
            ]}
            className="min-w-[220px]"
          />
          <Button variant="outline" onClick={() => setCreating(true)}>New package</Button>
          <Button variant="ghost" onClick={onManagePackages}>Manage packages</Button>
        </div>
      </div>

      {pendingPackageId !== null ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm space-y-3">
          <p className="text-foreground">Changing packages can make existing category assignments incompatible. Choose how to continue.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => { onChangePackage(pendingPackageId, true); setPendingPackageId(null); }}>Switch package and reset transaction categories</Button>
            <Button variant="outline" size="sm" onClick={() => { onChangePackage(pendingPackageId, false); setPendingPackageId(null); }}>Switch package and keep compatible mappings</Button>
            <Button variant="ghost" size="sm" onClick={() => setPendingPackageId(null)}>Cancel</Button>
          </div>
        </div>
      ) : null}

      {creating ? (
        <div className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-3">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Package name" className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
            <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description optional" className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => {
              const result = onCreatePackage(name, description);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              onChangePackage(result.packageId, false);
              setCreating(false);
              setName("");
              setDescription("");
              setError(null);
            }}>Create and select</Button>
            <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>Cancel</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
