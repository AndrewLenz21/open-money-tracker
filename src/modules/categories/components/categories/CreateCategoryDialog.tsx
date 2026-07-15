import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@shared/components/ui";
import { DEFAULT_CATEGORY_COLOR } from "../../constants/categoryColors";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryIconPicker } from "./CategoryIconPicker";

interface CreateCategoryDialogProps {
  onCreate: (name: string, color: string, icon?: string) => { ok: true } | { ok: false; error: string };
}

export function CreateCategoryDialog({ onCreate }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState(DEFAULT_CATEGORY_COLOR);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setIcon("");
    setColor(DEFAULT_CATEGORY_COLOR);
    setError(null);
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Create category
      </Button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { reset(); setOpen(false); }} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-2xl animate-modal-in" role="dialog" aria-modal="true" aria-label="Create category">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">New category</h3>
                <p className="mt-1 text-sm text-muted-foreground">Add a category to the current package.</p>
              </div>
              <button
                type="button"
                onClick={() => { reset(); setOpen(false); }}
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
                <Button variant="ghost" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
                <Button onClick={() => {
                  const result = onCreate(name, color, icon || undefined);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                  reset();
                  setOpen(false);
                }}>
                  Save category
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}