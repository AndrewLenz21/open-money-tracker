import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@shared/components/ui";
import { DEFAULT_CATEGORY_COLOR } from "../../constants/categoryColors";
import type { UserCategory } from "../../types/categories.types";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryIconPicker } from "./CategoryIconPicker";

interface CategoryFormDialogProps {
  editCategory?: UserCategory | null;
  open?: boolean;
  onCreate: (name: string, color: string, icon?: string) => { ok: true; categoryId?: string } | { ok: false; error: string };
  onClose: () => void;
}

export function CategoryFormDialog({ editCategory, open: controlledOpen, onCreate, onClose }: CategoryFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState(DEFAULT_CATEGORY_COLOR);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(editCategory);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setIcon(editCategory.icon ?? "");
      setColor(editCategory.color);
      setError(null);
      if (!isControlled) setInternalOpen(true);
    }
  }, [editCategory, isControlled]);

  const reset = () => {
    setName("");
    setIcon("");
    setColor(DEFAULT_CATEGORY_COLOR);
    setError(null);
    if (!isControlled) setInternalOpen(false);
    onClose();
  };

  return (
    <>
      {!isEdit && !isControlled && (
        <Button size="sm" onClick={() => setInternalOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create category
        </Button>
      )}

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={reset} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-2xl animate-modal-in" role="dialog" aria-modal="true" aria-label={isEdit ? "Edit category" : "Create category"}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {isEdit ? "Edit category" : "New category"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isEdit ? "Update the name, icon, or color." : "Add a category to the current package."}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Category name"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60"
                autoFocus
              />
              <CategoryIconPicker value={icon} color={color} onChange={setIcon} />
              <CategoryColorPicker value={color} onChange={setColor} />
              {error ? <p className="text-xs text-destructive">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={reset}>Cancel</Button>
                <Button onClick={() => {
                  const result = onCreate(name, color, icon || undefined);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                  reset();
                }}>
                  {isEdit ? "Save changes" : "Save category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}