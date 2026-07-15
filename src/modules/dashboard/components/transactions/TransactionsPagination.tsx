import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { RowsPerPageSelector } from "./RowsPerPageSelector";

interface TransactionsPaginationProps {
  page: number;
  totalPages: number;
  totalResults: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  t: (path: string) => string;
}

function getVisiblePages(current: number, total: number): (number | "dots")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "dots")[] = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  pages.push(1);
  if (left > 2) pages.push("dots");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("dots");
  pages.push(total);

  return pages;
}

export function TransactionsPagination({
  page,
  totalPages,
  totalResults,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  t,
}: TransactionsPaginationProps) {
  const start = totalResults === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(totalResults, page * rowsPerPage);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;
  const pageNumbers = getVisiblePages(page, totalPages);

  const btn =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-20 disabled:pointer-events-none";

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 bg-background/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Summary */}
      <p className="text-xs text-muted-foreground whitespace-nowrap">
        {t("pagination.showing") || "Showing"} {start}–{end} {t("pagination.of") || "of"} {totalResults}
      </p>

      {/* Center: page navigation */}
      <div className="flex items-center justify-center gap-0.5">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => onPageChange(1)}
          className={btn}
          aria-label={t("pagination.firstPage") || "First page"}
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
          className={btn}
          aria-label={t("pagination.previousPage") || "Previous page"}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-0.5 mx-1">
          {pageNumbers.map((item, index) =>
            item === "dots" ? (
              <span
                key={`dots-${index}`}
                className="inline-flex h-9 w-5 items-center justify-center text-xs text-muted-foreground/40"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg px-1.5 text-xs font-medium transition ${
                  item === page
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
          className={btn}
          aria-label={t("pagination.nextPage") || "Next page"}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
          className={btn}
          aria-label={t("pagination.lastPage") || "Last page"}
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right: rows per page */}
      <RowsPerPageSelector value={rowsPerPage} onChange={onRowsPerPageChange} t={t} />
    </div>
  );
}