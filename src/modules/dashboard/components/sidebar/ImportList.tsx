import { useState, useMemo } from "react";
import { Receipt, Trash2, AlertTriangle, Calendar } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { formatDate } from "@shared/utils";
import { Button } from "@shared/components/ui";
import type { NormalizedTransaction, ImportRecord } from "@modules/import-transactions/domain";

interface ImportListProps {
  importRecords: ImportRecord[] | null;
  allTransactions: NormalizedTransaction[] | null;
  selectedImportId: number | null;
  onSelectImport: (id: number | null) => void;
  onDeleteImport: (id: number) => void;
  t: (path: string) => string;
}

export function ImportList({
  importRecords,
  allTransactions,
  selectedImportId,
  onSelectImport,
  onDeleteImport,
  t,
}: ImportListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const recordCounts = useMemo(() => {
    if (!allTransactions || !importRecords) return new Map<number, number>();
    const map = new Map<number, number>();
    for (const tx of allTransactions) {
      map.set(tx.importId, (map.get(tx.importId) ?? 0) + 1);
    }
    return map;
  }, [allTransactions, importRecords]);

  return (
    <>
      <div className="flex flex-col gap-0.5">
        {importRecords && importRecords.length > 0 && (
          <>
            {importRecords.map((record) => {
              const txCount =
                recordCounts.get(record.id ?? -1) ?? record.acceptedRows;
              const isSelected = selectedImportId === record.id;

              return (
                <div
                  key={record.id ?? record.importedAt}
                  className={cn(
                    "group relative grid cursor-pointer grid-cols-[28px_1fr] items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors",
                    isSelected
                      ? "bg-primary/10 ring-1 ring-primary/20"
                      : "hover:bg-accent",
                  )}
                  onClick={() => record.id != null && onSelectImport(record.id)}
                >
                  <Receipt
                    className={cn(
                      "h-4 w-4 justify-self-center",
                      isSelected ? "text-primary" : "text-muted-foreground",
                    )}
                  />

                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="truncate text-sm font-semibold text-foreground"
                        title={record.filename}
                      >
                        {record.filename}
                      </p>

                      {record.id != null && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(record.id!);
                          }}
                          className={cn(
                            "shrink-0 rounded-md p-1 text-muted-foreground/40 transition-colors",
                            "hover:bg-destructive/10 hover:text-destructive",
                            isSelected
                              ? "text-muted-foreground/60"
                              : "opacity-0 group-hover:opacity-100",
                            "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30",
                          )}
                          aria-label={t("sidebar.delete") || "Eliminar importación"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {record.dateRangeStart && record.dateRangeEnd ? (
                      <p className="text-xs font-medium text-foreground/80">
                        {formatDate(new Date(record.dateRangeStart))}
                        {" → "}
                        {formatDate(new Date(record.dateRangeEnd))}
                      </p>
                    ) : null}

                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t("sidebar.importedPrefix") || "Imported"}{" "}
                        {formatDate(new Date(record.importedAt))}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 tabular-nums"
                        aria-label={`${txCount} ${t("sidebar.transactions") || "transacciones"}`}
                      >
                        <Receipt className="h-3 w-3" />
                        {txCount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {confirmDeleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border/70 bg-card/95 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-label={t("sidebar.deleteConfirmTitle") || "Delete import?"}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-base font-semibold text-foreground">
                  {t("sidebar.deleteConfirmTitle") || "Delete import?"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("sidebar.deleteConfirmDescription") ||
                    "This will permanently remove all transactions from this import."}
                </p>
                <p className="text-sm font-medium text-destructive/80">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteId(null)}
              >
                {t("sidebar.deleteCancel") || "Cancel"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDeleteImport(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                {t("sidebar.deleteConfirm") || "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}