import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Building2, Check, ChevronDown, Clock, FileText } from "lucide-react";
import { cn } from "@shared/lib/utils";

type ProviderOption = {
  id: string;
  name: string;
  description: string;
  state: string;
  selectable: boolean;
  icon: typeof FileText;
};

type ProviderSelectProps = {
  label: string;
  current: string;
  currentDescription: string;
  n26: string;
  n26Description: string;
  intesa: string;
  intesaDescription: string;
  generic: string;
  genericDescription: string;
  more: string;
  available: string;
  comingSoon: string;
  planned: string;
};

export function ProviderSelect({
  label,
  current,
  currentDescription,
  n26,
  n26Description,
  intesa,
  intesaDescription,
  generic,
  genericDescription,
  more,
  available,
  comingSoon,
  planned,
}: ProviderSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const providers: ProviderOption[] = [
    { id: "revolut", name: current, description: currentDescription, state: available, selectable: true, icon: FileText },
    { id: "n26", name: n26, description: n26Description, state: comingSoon, selectable: false, icon: Building2 },
    { id: "intesa", name: intesa, description: intesaDescription, state: comingSoon, selectable: false, icon: Building2 },
    { id: "generic", name: generic, description: genericDescription, state: planned, selectable: false, icon: FileText },
  ];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("mousedown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  const moveFocus = useCallback((direction: 1 | -1) => {
    if (!menuRef.current) return;
    const items = Array.from(menuRef.current.querySelectorAll<HTMLButtonElement>("button[data-provider-option]:not(:disabled)"));
    if (items.length === 0) return;
    const idx = items.findIndex((item) => item === document.activeElement);
    const next = idx === -1 ? 0 : (idx + direction + items.length) % items.length;
    items[next].focus();
  }, []);

  const setMenuNode = useCallback((node: HTMLDivElement | null) => { menuRef.current = node; }, []);

  const rect = triggerRef.current?.getBoundingClientRect() ?? null;

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <label className="sr-only" id="provider-select-label">{label}</label>
      <button
        ref={triggerRef}
        type="button"
        aria-labelledby="provider-select-label"
        aria-label={`${label}: ${current}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); requestAnimationFrame(() => moveFocus(1)); }
        }}
        className={cn(
          "flex h-10 w-full items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3 text-left text-sm shadow-sm",
          "transition-all duration-200 hover:border-primary/40 hover:bg-accent/20",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate text-left">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
          <span className="font-medium text-foreground"> {current} CSV</span>
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && rect && (
        <PortalDropdown
          triggerRect={rect}
          providers={providers}
          more={more}
          menuRef={setMenuNode}
          moveFocus={moveFocus}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/* ── portal‑rendered dropdown ───────────────────────────────────────── */

function PortalDropdown({
  triggerRect,
  providers,
  more,
  menuRef,
  moveFocus,
  onClose,
}: {
  triggerRect: DOMRect;
  providers: ProviderOption[];
  more: string;
  menuRef: (node: HTMLDivElement | null) => void;
  moveFocus: (dir: 1 | -1) => void;
  onClose: () => void;
}) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => { menuRef(innerRef.current); return () => menuRef(null); }, [menuRef]);

  useEffect(() => {
    function calc() {
      const el = innerRef.current;
      if (!el) return;
      const menuW = 320;
      const left = Math.max(8, Math.min(triggerRect.left, window.innerWidth - menuW - 8));
      const menuH = el.offsetHeight || 280;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const top = spaceBelow < menuH + 8 && triggerRect.top > menuH
        ? triggerRect.top - menuH - 6
        : triggerRect.bottom + 6;
      setStyle({ position: "fixed", top, left, width: menuW, zIndex: 90 });
    }
    calc();
    window.addEventListener("scroll", calc, { capture: true, passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc, { capture: true });
      window.removeEventListener("resize", calc);
    };
  }, [triggerRect]);

  return createPortal(
    <div
      ref={innerRef}
      role="listbox"
      aria-labelledby="provider-select-label"
      style={style}
      className="overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl"
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") { event.preventDefault(); moveFocus(1); }
        if (event.key === "ArrowUp") { event.preventDefault(); moveFocus(-1); }
      }}
    >
      {providers.map((provider) => {
        const Icon = provider.icon;
        const selected = provider.id === "revolut";
        return (
          <button
            key={provider.id}
            type="button"
            data-provider-option
            role="option"
            aria-selected={selected}
            disabled={!provider.selectable}
            onClick={() => { if (provider.selectable) onClose(); }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
              provider.selectable ? "hover:bg-accent focus:bg-accent" : "cursor-not-allowed opacity-60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{provider.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{provider.description}</span>
            </span>
            <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              provider.selectable ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border bg-muted text-muted-foreground",
            )}>
              {provider.state}
            </span>
            {selected ? <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : null}
          </button>
        );
      })}
      <div className="mt-1 flex items-center gap-2 border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />{more}
      </div>
    </div>,
    document.body,
  );
}
