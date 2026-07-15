import { useState } from "react";
import { Badge } from "@shared/components/ui";
import type { CategoryPackage, CategoryRule, UserCategory } from "../../types/categories.types";
import { CategoryList } from "./CategoryList";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { CategoryRulesList } from "../rules/CategoryRulesList";

interface CategoryEditorProps {
  selectedPackage: CategoryPackage | null;
  categories: UserCategory[];
  rules: CategoryRule[];
  usageCount: number;
  onCreateCategory: (name: string, color: string, icon?: string) => { ok: true } | { ok: false; error: string };
  onUpdateCategory: (categoryId: string, updates: Partial<Pick<UserCategory, "name" | "color" | "icon" | "isArchived">>) => { ok: true } | { ok: false; error: string };
  onMoveCategory: (categoryId: string, direction: "up" | "down") => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategory: (categoryId: string, targetIndex: number) => void;
  onToggleRule: (ruleId: string, isActive: boolean) => void;
  onDeleteRule: (ruleId: string) => void;
  t: (path: string) => string;
}

export function CategoryEditor({
  selectedPackage,
  categories,
  rules,
  usageCount: _usageCount,
  onCreateCategory,
  onUpdateCategory,
  onMoveCategory,
  onDeleteCategory,
  onReorderCategory,
  onToggleRule,
  onDeleteRule,
  t,
}: CategoryEditorProps) {
  const [editingCategory, setEditingCategory] = useState<UserCategory | null>(null);

  if (!selectedPackage) return null;

  return (
    <div className="space-y-6">
      {/* Categories section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{t("packages.categories") || "Categories"}</p>
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
              {categories.filter((cat) => !cat.isArchived).length} {t("packages.active") || "active"}
            </Badge>
            {categories.filter((cat) => cat.isArchived).length > 0 ? (
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
                {categories.filter((cat) => cat.isArchived).length} {t("packages.archived") || "archived"}
              </Badge>
            ) : null}
          </div>
          <CategoryFormDialog onCreate={onCreateCategory} onClose={() => {}} />
        </div>

        <CategoryList
          categories={categories}
          onEdit={(category) => setEditingCategory(category)}
          onMove={onMoveCategory}
          onArchive={(categoryId, isArchived) => onUpdateCategory(categoryId, { isArchived })}
          onDelete={onDeleteCategory}
          onReorder={(categoryId, targetIndex) =>
            selectedPackage && onReorderCategory(categoryId, targetIndex)
          }
          onCreateClick={() => setEditingCategory(null)}
        />
      </section>

      {/* Edit dialog */}
      {editingCategory ? (
        <CategoryFormDialog
          editCategory={editingCategory}
          onCreate={(name, color, icon) => onUpdateCategory(editingCategory.id, { name, color, icon })}
          onClose={() => setEditingCategory(null)}
        />
      ) : null}

      {/* Rules section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{t("packages.rules") || "Rules"}</p>
            <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">{t("packages.manualOnly") || "Manual only"}</Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("packages.rulesDescription") || "Rules are created only when you explicitly save one from a categorized transaction."}
        </p>
        <CategoryRulesList
          rules={rules}
          categories={categories}
          onToggle={onToggleRule}
          onDelete={onDeleteRule}
        />
      </section>
    </div>
  );
}