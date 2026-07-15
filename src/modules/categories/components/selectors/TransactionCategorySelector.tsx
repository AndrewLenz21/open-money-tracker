import { useState } from "react";
import { Plus } from "lucide-react";
import { Select } from "@shared/components/ui";
import type { UserCategory } from "../../types/categories.types";
import { CategoryFormDialog } from "../categories/CategoryFormDialog";

interface TransactionCategorySelectorProps {
  value: string | null;
  categories: UserCategory[];
  disabled: boolean;
  onChange: (categoryId: string | null) => void;
  onCreateCategory: (name: string, color: string) => { ok: true; categoryId: string } | { ok: false; error: string };
}

export function TransactionCategorySelector({
  value,
  categories,
  disabled,
  onChange,
  onCreateCategory,
}: TransactionCategorySelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value || null)}
        options={[
          { value: "", label: "Uncategorized" },
          ...categories.map((category) => ({ value: category.id, label: category.name })),
        ]}
        className="h-9 min-w-[150px] text-xs"
        aria-label="Category"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setDialogOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
        title="New category"
      >
        <Plus className="h-4 w-4" />
      </button>

      {dialogOpen ? (
        <CategoryFormDialog
          open={dialogOpen}
          onCreate={(name, color, _icon) => {
            const result = onCreateCategory(name, color);
            if (result.ok) {
              onChange(result.categoryId);
            }
            setDialogOpen(false);
            return result;
          }}
          onClose={() => setDialogOpen(false)}
        />
      ) : null}
    </div>
  );
}