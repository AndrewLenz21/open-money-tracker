// ---------------------------------------------------------------------------
// ImportsDrawer — mobile drawer for selecting imports.
// Reads data directly from shared Zustand stores.
// ---------------------------------------------------------------------------

import { useEffect, useState, useCallback } from "react";
import { X, Layers, FileText, PanelLeftClose } from "lucide-react";
import { resolveTranslation } from "@core/i18n";
import { useDashboardStore } from "@modules/dashboard/stores/dashboardStore";
import { useImportDataStore } from "@modules/import-transactions/stores/importDataStore";
import { deleteImportRecord } from "@modules/import-transactions/services/storage";
import { ImportList } from "@modules/dashboard/components/sidebar/ImportList";
import { Drawer } from "./Drawer";

interface ImportsDrawerProps {
  translations: Record<string, unknown>;
}

export function ImportsDrawer({ translations }: ImportsDrawerProps) {
  const t = (path: string, fallback = ""): string =>
    resolveTranslation(path, translations) || fallback;

  const mobileImportsOpen = useDashboardStore((s) => s.mobileImportsOpen);
  const setMobileImportsOpen = useDashboardStore((s) => s.setMobileImportsOpen);
  const selectedImportId = useDashboardStore((s) => s.selectedImportId);
  const setSelectedImportId = useDashboardStore((s) => s.setSelectedImportId);

  const allTransactions = useImportDataStore((s) => s.data);
  const importRecords = useImportDataStore((s) => s.importRecords);
  const load = useImportDataStore((s) => s.load);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (mobileImportsOpen) {
      setDrawerOpen(true);
      setClosing(false);
    } else if (drawerOpen) {
      setClosing(true);
      const timer = setTimeout(() => {
        setDrawerOpen(false);
        setClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [mobileImportsOpen, drawerOpen]);

  const handleClose = useCallback(() => {
    setMobileImportsOpen(false);
  }, [setMobileImportsOpen]);

  const handleDeleteImport = useCallback(
    async (importId: number) => {
      try {
        await deleteImportRecord(importId);
        load();
      } catch {
        // silently fail
      }
    },
    [load],
  );

  return (
    <Drawer
      open={drawerOpen}
      closing={closing}
      onClose={handleClose}
      side="left"
      width="min(88vw, 380px)"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border py-3 pl-2 pr-3">
        <div className="flex items-center gap-0">
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("mobile.closeMenu", "Close")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
            <Layers className="h-3.5 w-3.5" />
            {t("sidebar.imports", "Imports")}
            {importRecords && importRecords.length > 0 && (
              <span className="inline-flex items-center gap-1 ml-1 text-muted-foreground/70">
                <FileText className="h-3 w-3" />
                <span className="tabular-nums text-xs">{importRecords.length}</span>
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label={t("mobile.closeMenu", "Close")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="scrollarea flex-1 overflow-y-auto px-3 py-2">
        <ImportList
          importRecords={importRecords}
          allTransactions={allTransactions}
          selectedImportId={selectedImportId}
          onSelectImport={(id) => {
            setSelectedImportId(id);
            handleClose();
          }}
          onDeleteImport={handleDeleteImport}
          t={t}
        />
      </div>
    </Drawer>
  );
}
