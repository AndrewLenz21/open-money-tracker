// ---------------------------------------------------------------------------
// Drawer — shared off-canvas drawer primitive.
// Renders backdrop + animated panel; handles Escape and focus.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@shared/lib/utils";

type DrawerSide = "left" | "right";

interface DrawerProps {
  open: boolean;
  closing: boolean;
  onClose: () => void;
  side?: DrawerSide;
  width?: string;
  children: React.ReactNode;
}

export function Drawer({
  open,
  closing,
  onClose,
  side = "right",
  width = "min(88vw, 420px)",
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const isLeft = side === "left";
  const animIn = isLeft ? "animate-drawer-in-left" : "animate-drawer-in";
  const animOut = isLeft ? "animate-drawer-out-left" : "animate-drawer-out";

  // Store focus on open, restore on close
  useEffect(() => {
    if (open && !closing) {
      previousFocus.current = document.activeElement as HTMLElement;
      panelRef.current?.focus();
    }
    if (!open && !closing && previousFocus.current) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [open, closing]);

  // Escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" onKeyDown={handleKeyDown}>
      {/* backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm",
          closing ? animOut : animIn,
        )}
        onClick={onClose}
      />

      {/* panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute inset-y-0 flex flex-col border-border bg-background/98 shadow-2xl supports-[backdrop-filter]:backdrop-blur-xl",
          isLeft
            ? "left-0 border-r"
            : "right-0 border-l",
          closing ? animOut : animIn,
        )}
        style={{ width, maxWidth: isLeft ? "85vw" : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
