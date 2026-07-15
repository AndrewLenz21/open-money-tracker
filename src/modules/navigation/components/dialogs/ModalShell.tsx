// ---------------------------------------------------------------------------
// Reusable overlay + dialog shell used by LanguageDialog and ThemeDialog.
// ---------------------------------------------------------------------------

import { useRef, useEffect } from "react";
import { X } from "lucide-react";

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
  closeLabel?: string;
};

export function ModalShell({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-md",
  closeLabel = "Close",
}: ModalShellProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-modal-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-border bg-popover p-6 shadow-2xl animate-modal-in`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
