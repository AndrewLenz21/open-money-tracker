import type { CategoryRuleMatchType, UserCategory } from "@modules/categories";
import type { FilterMode } from "../../stores/dashboardStore";
import type {
  CategorizedTransaction,
  TransactionSort,
  TransactionTypeFilter,
} from "../../types/dashboard.types";
import { SectionCard } from "../shared/SectionCard";
import { TransactionsPagination } from "./TransactionsPagination";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionsToolbar } from "./TransactionsToolbar";

interface TransactionsSectionProps {
  transactions: CategorizedTransaction[];
  paginatedTransactions: CategorizedTransaction[];
  packageSelected: boolean;
  categories: UserCategory[];
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string | null | "all";
  onCategoryFilterChange: (value: string | null | "all") => void;
  type: TransactionTypeFilter;
  onTypeChange: (value: TransactionTypeFilter) => void;
  filterMode: FilterMode;
  onFilterModeChange: (value: FilterMode) => void;
  sort: TransactionSort;
  onSortChange: (value: TransactionSort) => void;
  onlyUncategorized: boolean;
  onOnlyUncategorizedChange: (value: boolean) => void;
  onResetFilters: () => void;
  page: number;
  totalPages: number;
  totalResults: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  onTransactionCategoryChange: (
    transaction: CategorizedTransaction,
    value: string | null,
  ) => void;
  onCreateCategory: (name: string, color: string) => { ok: true; categoryId: string } | { ok: false; error: string };
  onCreateRule: (transaction: CategorizedTransaction, matchType: CategoryRuleMatchType) => void;
  isExcluded: (transactionKey: string) => boolean;
  onToggleExcluded: (transactionKey: string) => void;
  t: (path: string) => string;
}

export function TransactionsSection({
  transactions,
  paginatedTransactions,
  packageSelected,
  categories,
  search,
  onSearchChange,
  categoryId,
  onCategoryFilterChange,
  type,
  onTypeChange,
  filterMode,
  onFilterModeChange,
  sort,
  onSortChange,
  onlyUncategorized,
  onOnlyUncategorizedChange,
  onResetFilters,
  page,
  totalPages,
  totalResults,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onTransactionCategoryChange,
  onCreateCategory,
  onCreateRule,
  isExcluded,
  onToggleExcluded,
  t,
}: TransactionsSectionProps) {
  const showFeeColumn =
    transactions.length > 0 &&
    transactions.filter((tx) => tx.fee > 0).length / transactions.length >= 0.1;

  return (
    <SectionCard
      title={t("table.title") || "Transactions"}
      description={
        t("table.descriptionLong") ||
        "Search, categorize, and inspect the transactions behind your numbers."
      }
      contentClassName="space-y-4 pt-0"
    >
      <TransactionsToolbar
        search={search}
        onSearchChange={onSearchChange}
        categoryId={categoryId}
        categories={categories}
        onCategoryChange={onCategoryFilterChange}
        type={type}
        onTypeChange={onTypeChange}
        filterMode={filterMode}
        onFilterModeChange={onFilterModeChange}
        sort={sort}
        onSortChange={onSortChange}
        onlyUncategorized={onlyUncategorized}
        onOnlyUncategorizedChange={onOnlyUncategorizedChange}
        onReset={onResetFilters}
        t={t}
      />

      {transactions.length > 0 ? (
        <>
          <TransactionsTable
            transactions={paginatedTransactions}
            packageSelected={packageSelected}
            categories={categories}
            showFeeColumn={showFeeColumn}
            isExcluded={isExcluded}
            onToggleExcluded={onToggleExcluded}
            onCategoryChange={onTransactionCategoryChange}
            onCreateCategory={onCreateCategory}
            onCreateRule={onCreateRule}
            t={t}
          />
          <TransactionsPagination
            page={page}
            totalPages={totalPages}
            totalResults={totalResults}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            t={t}
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center text-sm text-muted-foreground">
          {t("table.noTransactions") || "No transactions match the current filters."}
        </div>
      )}
    </SectionCard>
  );
}
