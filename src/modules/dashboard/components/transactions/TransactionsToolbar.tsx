import { Badge, Button, Select } from "@shared/components/ui";
import type { UserCategory } from "@modules/categories";
import type { FilterMode } from "../../stores/dashboardStore";
import type { TransactionSort, TransactionTypeFilter } from "../../types/dashboard.types";

interface TransactionsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string | null | "all";
  categories: UserCategory[];
  onCategoryChange: (value: string | null | "all") => void;
  type: TransactionTypeFilter;
  onTypeChange: (value: TransactionTypeFilter) => void;
  filterMode: FilterMode;
  onFilterModeChange: (value: FilterMode) => void;
  sort: TransactionSort;
  onSortChange: (value: TransactionSort) => void;
  onlyUncategorized: boolean;
  onOnlyUncategorizedChange: (value: boolean) => void;
  onReset: () => void;
  t: (path: string) => string;
}

export function TransactionsToolbar({
  search,
  onSearchChange,
  categoryId,
  categories,
  onCategoryChange,
  type,
  onTypeChange,
  filterMode,
  onFilterModeChange,
  sort,
  onSortChange,
  onlyUncategorized,
  onOnlyUncategorizedChange,
  onReset,
  t,
}: TransactionsToolbarProps) {
  const activeFilters = [
    categoryId !== "all",
    type !== "all",
    filterMode !== "all",
    sort !== "date-desc",
    onlyUncategorized,
  ].filter(Boolean).length;

  const filters = (
    <>
      <Select
        value={categoryId === null ? "uncategorized" : categoryId}
        onChange={(event) => onCategoryChange(event.target.value === "uncategorized" ? null : event.target.value as string | "all")}
        options={[
          { value: "all", label: t("table.allCategories") || "All categories" },
          { value: "uncategorized", label: "Uncategorized" },
          ...categories.map((item) => ({ value: item.id, label: item.name })),
        ]}
        aria-label={t("table.category") || "Category"}
      />
      <Select
        value={type}
        onChange={(event) => onTypeChange(event.target.value as TransactionTypeFilter)}
        options={[
          { value: "all", label: t("table.allTypes") || "All types" },
          { value: "income", label: t("table.income") || "Income" },
          { value: "expense", label: t("table.expense") || "Expense" },
        ]}
        aria-label={t("table.type") || "Type"}
      />
      <Select
        value={filterMode}
        onChange={(event) => onFilterModeChange(event.target.value as FilterMode)}
        options={[
          { value: "all", label: t("filter.all") || "All time" },
          { value: "last7", label: t("filter.last7") || "Last 7 days" },
          { value: "last30", label: t("filter.last30") || "Last 30 days" },
        ]}
        aria-label={t("table.dateFilter") || "Date range"}
      />
      <Select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as TransactionSort)}
        options={[
          { value: "date-desc", label: t("table.sortNewest") || "Newest first" },
          { value: "date-asc", label: t("table.sortOldest") || "Oldest first" },
          { value: "amount-desc", label: t("table.sortHighest") || "Highest amount" },
          { value: "amount-asc", label: t("table.sortLowest") || "Lowest amount" },
        ]}
        aria-label={t("table.sort") || "Sort"}
      />
      <div className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-muted/20 px-3 py-2">
        <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
          <input
            type="checkbox"
            checked={onlyUncategorized}
            onChange={(event) => onOnlyUncategorizedChange(event.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          {t("table.onlyUncategorized") || "Only uncategorized"}
        </label>
        <Button variant="ghost" size="sm" onClick={onReset}>
          {t("table.clearFilters") || "Clear"}
        </Button>
      </div>
    </>
  );

  return (
    <div className="space-y-3">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={t("table.searchPlaceholder") || "Search merchant or description"}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60"
        aria-label={t("table.search") || "Search transactions"}
      />

      <details className="rounded-xl border border-border/70 bg-muted/10 p-3 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground">
          <span>Filters</span>
          {activeFilters > 0 ? <Badge variant="secondary">{activeFilters}</Badge> : null}
        </summary>
        <div className="mt-3 grid gap-3">{filters}</div>
      </details>

      <div className="hidden gap-3 lg:grid lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(280px,1.2fr)]">
        {filters}
      </div>
    </div>
  );
}
