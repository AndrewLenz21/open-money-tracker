import { useState } from "react";
import { Pencil, Save, X, Copy, Trash2 } from "lucide-react";
import { Button, Badge } from "@shared/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import type { CategoryPackage, CategoryRule, UserCategory } from "../../types/categories.types";
import { CategoryEditor } from "../categories/CategoryEditor";

interface CategoryPackageWorkspaceProps {
  selectedPackage: CategoryPackage | null;
  categories: UserCategory[];
  rules: CategoryRule[];
  usageCount: number;
  onUpdatePackage: (name: string, description?: string) => { ok: true } | { ok: false; error: string };
  onDuplicate: () => void;
  onDelete: () => void;
  onCreateCategory: (name: string, color: string, icon?: string) => { ok: true } | { ok: false; error: string };
  onUpdateCategory: (categoryId: string, updates: Partial<Pick<UserCategory, "name" | "color" | "icon" | "isArchived">>) => { ok: true } | { ok: false; error: string };
  onMoveCategory: (categoryId: string, direction: "up" | "down") => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategory: (categoryId: string, targetIndex: number) => void;
  onToggleRule: (ruleId: string, isActive: boolean) => void;
  onDeleteRule: (ruleId: string) => void;
  t: (path: string) => string;
}

export function CategoryPackageWorkspace({
  selectedPackage,
  categories,
  rules,
  usageCount,
  onUpdatePackage,
  onDuplicate,
  onDelete,
  onCreateCategory,
  onUpdateCategory,
  onMoveCategory,
  onDeleteCategory,
  onReorderCategory,
  onToggleRule,
  onDeleteRule,
  t,
}: CategoryPackageWorkspaceProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!selectedPackage) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="max-w-xs text-center">
          <p className="text-sm font-medium text-foreground">{t("packages.noPackageSelected") || "No package selected"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("packages.selectPackageHint") || "Select a package from the sidebar or create a new one to start configuring categories."}
          </p>
        </div>
      </div>
    );
  }

  const activeCategories = categories.filter((category) => !category.isArchived);
  const archivedCategories = categories.filter((category) => category.isArchived);

  const startEditing = () => {
    setName(selectedPackage.name);
    setDescription(selectedPackage.description ?? "");
    setError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setError(null);
  };

  const saveEditing = () => {
    const result = onUpdatePackage(name, description || undefined);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setEditing(false);
    setError(null);
  };

  return (
    <div className="scrollarea flex h-full flex-col gap-5 overflow-y-auto px-1">
      {/* Package header */}
      <section className="space-y-2">
        {editing ? (
          <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold"
              aria-label="Package name"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Package description (optional)"
              className="h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
              aria-label="Package description"
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEditing}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={cancelEditing}>
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">
                {selectedPackage.name}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {selectedPackage.description || "No description."}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                  {activeCategories.length} active
                </Badge>
                {archivedCategories.length > 0 ? (
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
                    {archivedCategories.length} archived
                  </Badge>
                ) : null}
                {usageCount > 0 ? (
                  <span className="text-[11px] text-muted-foreground">
                    {usageCount} import{usageCount > 1 ? "s" : ""} using this package
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="sm" onClick={startEditing}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                {t("packages.editPackage") || "Edit"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-3.5 w-3.5" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={onDelete}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </section>

      <div className="h-px bg-border/60" />

      {/* Categories & Rules */}
      <CategoryEditor
        selectedPackage={selectedPackage}
        categories={categories}
        rules={rules}
        usageCount={usageCount}
        onCreateCategory={onCreateCategory}
        onUpdateCategory={onUpdateCategory}
        onMoveCategory={onMoveCategory}
        onDeleteCategory={onDeleteCategory}
        onReorderCategory={(categoryId, targetIndex) => onReorderCategory(categoryId, targetIndex)}
        onToggleRule={onToggleRule}
        onDeleteRule={onDeleteRule}
        t={t}
      />
    </div>
  );
}