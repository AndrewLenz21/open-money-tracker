import { useCallback, useRef, useEffect, useState } from "react";
import { Layers } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { useDashboardStore } from "../../stores/dashboardStore";
import { ImportList } from "./ImportList";
import type { NormalizedTransaction, ImportRecord } from "@modules/import-transactions/domain";

const SIDEBAR_MIN = 260;
const SIDEBAR_MAX = 440;
const ANIM_DURATION = 250;

interface ImportSidebarProps {
  importRecords: ImportRecord[] | null;
  allTransactions: NormalizedTransaction[] | null;
  selectedImportId: number | null;
  onSelectImport: (id: number | null) => void;
  onDeleteImport: (id: number) => void;
  t: (path: string) => string;
}

export function ImportSidebar({
  importRecords,
  allTransactions,
  selectedImportId,
  onSelectImport,
  onDeleteImport,
  t,
}: ImportSidebarProps) {
  const desktopSidebarOpen = useDashboardStore((s) => s.desktopSidebarOpen);
  const sidebarWidth = useDashboardStore((s) => s.sidebarWidth);
  const setSidebarWidth = useDashboardStore((s) => s.setSidebarWidth);

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [resizing, setResizing] = useState(false);

  const isResizing = useRef(false);
  const widthRef = useRef(sidebarWidth);

  useEffect(() => {
    widthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  // Sync desktopSidebarOpen → visible/closing
  useEffect(() => {
    if (desktopSidebarOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [desktopSidebarOpen, visible]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      setResizing(true);
      const startX = e.clientX;
      const startWidth = widthRef.current;

      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      const handleMouseMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = Math.min(
          SIDEBAR_MAX,
          Math.max(SIDEBAR_MIN, startWidth + (ev.clientX - startX)),
        );
        widthRef.current = newWidth;
        setSidebarWidth(newWidth);
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        setResizing(false);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [setSidebarWidth],
  );

  return (
    <aside
      className={cn(
        "hidden md:block fixed left-0 top-0 z-40 border-r border-border bg-muted/30 overflow-hidden",
        resizing ? "" : "transition-[width] duration-[250ms] ease-out",
        visible ? "" : "w-0 border-r-0",
      )}
      style={{ height: "100vh", width: visible ? (closing ? 0 : sidebarWidth) : 0 }}
    >
      {visible && (
        <div
          className={cn(
            "flex flex-col h-full",
            closing ? "animate-drawer-out-left" : "animate-drawer-in-left",
          )}
        >
          <div className="flex shrink-0 items-center gap-1.5 border-b border-border px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              {t("sidebar.imports") || "Imports"}
            </div>
            <div className="flex-1" />
            {importRecords && importRecords.length > 0 && (
              <span className="text-xs tabular-nums text-muted-foreground">
                {importRecords.length}
              </span>
            )}
          </div>

          <div className="scrollarea flex-1 overflow-y-auto p-2">
            <ImportList
              importRecords={importRecords}
              allTransactions={allTransactions}
              selectedImportId={selectedImportId}
              onSelectImport={onSelectImport}
              onDeleteImport={onDeleteImport}
              t={t}
            />
          </div>

          <div
            className="absolute right-0 top-0 z-10 w-1.5 cursor-col-resize transition-colors hover:bg-primary/30 active:bg-primary/40"
            style={{ bottom: 0 }}
            onMouseDown={handleResizeStart}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
          />
        </div>
      )}
    </aside>
  );
}
