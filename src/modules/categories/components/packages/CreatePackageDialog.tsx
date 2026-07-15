import { useState } from "react";
import { PackagePlus, X } from "lucide-react";
import { Button } from "@shared/components/ui";

interface CreatePackageDialogProps {
  onCreate: (name: string, description?: string) => { ok: true; packageId: string } | { ok: false; error: string };
  onCreated: (packageId: string) => void;
}

export function CreatePackageDialog({ onCreate, onCreated }: CreatePackageDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setDescription("");
    setError(null);
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PackagePlus className="mr-1.5 h-3.5 w-3.5" />
        New
      </Button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { reset(); setOpen(false); }} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-2xl animate-modal-in" role="dialog" aria-modal="true" aria-label="Create package">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">New package</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create a reusable category package.</p>
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
                placeholder="Package name"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60"
                autoFocus
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description (optional)"
                className="h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60"
              />
              {error ? <p className="text-xs text-destructive">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
                <Button onClick={() => {
                  const result = onCreate(name, description);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                  reset();
                  setOpen(false);
                  onCreated(result.packageId);
                }}>
                  Create package
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}