import { useState, useCallback, useRef, useEffect } from "react";
import { Table, Check, Copy } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { useCsvImportStore } from "@modules/import-transactions/stores/csv-import.store";
import { getCsvSource, getCsvHeader } from "@core/config/csv-sources";

export function CsvFormatPreview() {
  const selectedSourceId = useCsvImportStore((s) => s.selectedSourceId);
  const [copied, setCopied] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [scrollbarActive, setScrollbarActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const source = getCsvSource(selectedSourceId);

  if (
    !source ||
    source.status !== "available" ||
    source.columns.length === 0
  ) {
    return null;
  }

  const csvHeader = getCsvHeader(selectedSourceId);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(csvHeader);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [csvHeader]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateFades = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setShowLeftFade(scrollLeft > 1);
      setShowRightFade(scrollLeft + clientWidth < scrollWidth - 1);
    };

    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });

    const observer = new ResizeObserver(updateFades);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateFades);
      observer.disconnect();
    };
  }, [source.columns]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleScrollAreaEnter = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    hoverTimerRef.current = setTimeout(() => {
      setScrollbarActive(true);
      hoverTimerRef.current = null;
    }, 300);
  }, []);

  const handleScrollAreaLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    setScrollbarActive(false);
  }, []);

  return (
    <div className="w-full sm:w-[calc(100%-4rem)] sm:mx-auto rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Table
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate text-[11px] font-medium text-foreground">
            Expected CSV format
          </span>
          <span className="shrink-0 rounded-full border border-border/60 px-1.5 py-px text-[9px] font-medium text-muted-foreground">
            {source.name}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
            "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            copied
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground",
          )}
        >
          {copied ? (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3" aria-hidden="true" />
              Copied
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Copy className="h-3 w-3" aria-hidden="true" />
              Copy header
            </span>
          )}
        </button>
      </div>

      <p className="mb-1.5 text-[10px] leading-relaxed text-muted-foreground">
        Your CSV must contain these columns in the following order.
      </p>

      <div className="relative">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-6 transition-opacity duration-200",
            showLeftFade ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "linear-gradient(to right, color-mix(in srgb, var(--muted) 30%, transparent), transparent)",
          }}
          aria-hidden="true"
        />

        <div
          ref={scrollRef}
          onMouseEnter={handleScrollAreaEnter}
          onMouseLeave={handleScrollAreaLeave}
          className={cn(
            "overflow-x-auto overflow-y-hidden px-4",
            "pb-1 [&::-webkit-scrollbar]:h-1.5",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:transition-colors",
            "[&::-webkit-scrollbar-thumb]:duration-300",
            scrollbarActive
              ? "[&::-webkit-scrollbar-thumb]:bg-border/40"
              : "[&::-webkit-scrollbar-thumb]:bg-transparent",
            "[&::-webkit-scrollbar-track]:bg-transparent",
          )}
          style={
            {
              scrollbarWidth: "thin",
              scrollbarColor: "var(--border) transparent",
            } as React.CSSProperties
          }
        >
          <div
            className="flex w-max items-center gap-1.5"
            role="list"
            aria-label="Expected CSV columns"
          >
            {source.columns.map((col, i) => (
              <span
                key={col.key}
                role="listitem"
                className="shrink-0 select-none rounded border border-border/50 bg-background px-1.5 py-0.5 text-[10px] font-mono tabular-nums leading-none text-foreground/80"
              >
                {`${String(i + 1).padStart(2, "0")} ${col.label}`}
              </span>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-6 transition-opacity duration-200",
            showRightFade ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "linear-gradient(to left, color-mix(in srgb, var(--muted) 30%, transparent), transparent)",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
