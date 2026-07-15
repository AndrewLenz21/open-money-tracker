// ---------------------------------------------------------------------------
// DashboardPage — thin orchestrator for the financial analysis dashboard.
//
// Visual layout:
//   [Sidebar: ImportList] | [Main: info header + filters + summary + charts + table]
//
// Guard states (rendered instead of data view):
//   loading  → DashboardSkeleton
//   error    → DashboardError
//   no data  → DashboardEmpty
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useCallback, useState } from "react";
import { X } from "lucide-react";
import { useDashboardData } from "../providers/useDashboardData";
import { useDashboardTranslations } from "../providers/useDashboardTranslations";
import { useDashboardStore } from "../stores/dashboardStore";
import { DashboardSkeleton, DashboardError, DashboardEmpty } from "./states";
import { DashboardHeader } from "./header/DashboardHeader";
import { PrimaryMetrics } from "./metrics/PrimaryMetrics";
import { SecondarySummary } from "./metrics/SecondarySummary";
import { CashFlowChart } from "./charts/CashFlowChart";
import { CategorySpendingChart } from "./charts/CategorySpendingChart";
import { FinancialInsights } from "./insights/FinancialInsights";
import { TransactionsSection } from "./transactions/TransactionsSection";
import { ImportSidebar } from "./sidebar";
import type { ImportRecord } from "@modules/import-transactions/domain";
import { deleteImportRecord } from "@modules/import-transactions/services/storage";
import { useTransactionCategories } from "../hooks/useTransactionCategories";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";
import { useTransactionFilters } from "../hooks/useTransactionFilters";
import { useExcludedTransactions } from "../hooks/useExcludedTransactions";
import {
  CategoryPackageSelector,
  CategoryPackagesPage,
  useCategoryPackages,
  type CategoryRuleMatchType,
} from "@modules/categories";
import { ModalShell } from "@modules/navigation/components/dialogs/ModalShell";

export default function DashboardPage() {
  const t = useDashboardTranslations();
  const hydrate = useDashboardStore((s) => s.hydrate);
  const hydrated = useDashboardStore((s) => s.hydrated);
  const [showPackageManager, setShowPackageManager] = useState(false);
  const [pendingRule, setPendingRule] = useState<{ categoryId: string; matchType: CategoryRuleMatchType; matchValue: string; merchant: string } | null>(null);
  const desktopSidebarOpen = useDashboardStore((s) => s.desktopSidebarOpen);
  const sidebarWidth = useDashboardStore((s) => s.sidebarWidth);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const {
    transactions,
    allTransactions,
    importRecords,
    loading,
    error,
    load,
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    selectedImportId,
    setSelectedImportId,
    filterMode,
    setFilterMode,
  } = useDashboardData();

  useEffect(() => {
    hydrate();
    load();
  }, [hydrate, load]);

  const activeImport = useMemo<ImportRecord | null>(() => {
    if (!importRecords || selectedImportId === null) return null;
    return importRecords.find((r) => r.id === selectedImportId) ?? null;
  }, [importRecords, selectedImportId]);

  const handleDeleteImport = useCallback(
    async (importId: number) => {
      try {
        await deleteImportRecord(importId);
        load();
      } catch {
        // silently fail — data stays as-is
      }
    },
    [load],
  );

  const categoryModel = useCategoryPackages();
  const selectedCategoryPackage = categoryModel.getPackageForImport(selectedImportId);
  const activePackageCategories = selectedCategoryPackage
    ? categoryModel.getPackageCategories(selectedCategoryPackage.id)
    : [];

  const baseTransactions = transactions ?? [];
  const {
    categorizedTransactions,
  } = useTransactionCategories(
    baseTransactions,
    selectedCategoryPackage,
    categoryModel.categories,
    categoryModel.assignments,
    categoryModel.rules,
  );
  const { excluded: excludedTransactions, toggleExcluded, isExcluded } = useExcludedTransactions();
  const analyticsTransactions = categorizedTransactions.filter(
    (tx) => !excludedTransactions.has(tx.transactionKey),
  );
  const analytics = useDashboardAnalytics(
    analyticsTransactions,
    selectedCurrency,
    filterMode,
    activePackageCategories,
  );
  const transactionFilters = useTransactionFilters(
    categorizedTransactions,
    filterMode,
    setFilterMode,
  );

  const createCategoryInSelectedPackage = useCallback(
    (name: string, color: string) => {
      if (!selectedCategoryPackage) {
        return { ok: false as const, error: "Select a category package first." };
      }
      return categoryModel.createCategory(selectedCategoryPackage.id, name, color);
    },
    [categoryModel, selectedCategoryPackage],
  );

  const handleTransactionCategoryChange = useCallback(
    (tx: { transactionKey: string; importId: number; merchant: string }, categoryId: string | null) => {
      if (!selectedCategoryPackage || !tx.merchant) {
        if (!selectedCategoryPackage) return;
        categoryModel.setTransactionCategory(tx.transactionKey, tx.importId, selectedCategoryPackage.id, categoryId);
        return;
      }
      const merchantLower = tx.merchant.toLowerCase();
      for (const ct of categorizedTransactions) {
        if (ct.merchant.toLowerCase() === merchantLower && ct.importId === tx.importId) {
          categoryModel.setTransactionCategory(ct.transactionKey, ct.importId, selectedCategoryPackage.id, categoryId);
        }
      }
    },
    [categoryModel, categorizedTransactions, selectedCategoryPackage],
  );

  const handleCreateRule = useCallback(
    (tx: { categoryId: string | null; merchant: string; originalDescription: string }, matchType: CategoryRuleMatchType) => {
      if (!selectedCategoryPackage || !tx.categoryId) return;
      const matchValue = matchType === "merchant-exact" ? tx.merchant : tx.originalDescription;
      setPendingRule({ categoryId: tx.categoryId, matchType, matchValue, merchant: tx.merchant });
    },
    [selectedCategoryPackage],
  );

  const confirmRule = useCallback(() => {
    if (!pendingRule || !selectedCategoryPackage) return;
    categoryModel.createRule(selectedCategoryPackage.id, pendingRule.categoryId, pendingRule.matchType, pendingRule.matchValue);
    setPendingRule(null);
  }, [categoryModel, pendingRule, selectedCategoryPackage]);

  if (loading || !hydrated) return <DashboardSkeleton />;

  if (error) return <DashboardError error={error} />;

  if (!allTransactions || allTransactions.length === 0) {
    return <DashboardEmpty t={t} />;
  }

  return (
    <div className="flex min-h-screen">
      <ImportSidebar
        importRecords={importRecords}
        allTransactions={allTransactions}
        selectedImportId={selectedImportId}
        onSelectImport={setSelectedImportId}
        onDeleteImport={handleDeleteImport}
        t={t}
      />

      <main className="scrollarea flex-1 overflow-y-auto transition-all duration-[250ms] ease-out" style={{ minHeight: "calc(100vh - 4rem)", position: "sticky", top: "4rem", paddingLeft: isDesktop && desktopSidebarOpen ? sidebarWidth : 0 }}>
        <div className="space-y-6 px-4 py-8 lg:px-6">
          <DashboardHeader
            activeImport={activeImport}
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
            t={t}
          />

          <CategoryPackageSelector
            importId={selectedImportId}
            packages={categoryModel.packages}
            categories={categoryModel.categories}
            selectedPackage={selectedCategoryPackage}
            onChangePackage={(packageId, resetAssignments) => {
              if (selectedImportId !== null) {
                categoryModel.linkImportToPackage(selectedImportId, packageId, resetAssignments);
              }
            }}
            onCreatePackage={categoryModel.createPackage}
            onManagePackages={() => setShowPackageManager(true)}
          />

          <PrimaryMetrics
            currency={selectedCurrency}
            currentBalance={analytics.currentBalance}
            totalIncome={analytics.totalIncome}
            totalExpenses={analytics.totalExpenses}
            netCashFlow={analytics.netCashFlow}
            t={t}
          />

          <SecondarySummary
            currency={selectedCurrency}
            transactionCount={analytics.transactionCount}
            dateRange={analytics.dateRange}
            totalFees={analytics.totalFees}
            uncategorizedCount={analytics.uncategorizedCount}
            t={t}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <CashFlowChart
              data={analytics.cashFlowSeries}
              currency={selectedCurrency}
              t={t}
            />
            <CategorySpendingChart
              data={analytics.categorySpending}
              currency={selectedCurrency}
              packageSelected={Boolean(selectedCategoryPackage)}
              hasCategories={activePackageCategories.length > 0}
              onManageCategories={() => setShowPackageManager(true)}
              t={t}
            />
          </div>

          <FinancialInsights
            currency={selectedCurrency}
            averageDailySpending={analytics.averageDailySpending}
            uncategorizedCount={analytics.uncategorizedCount}
            highestSpendingCategory={analytics.highestSpendingCategory}
            largestExpense={analytics.largestExpense}
            mostFrequentMerchant={analytics.mostFrequentMerchant}
            t={t}
          />

          <TransactionsSection
            transactions={transactionFilters.filteredTransactions}
            paginatedTransactions={transactionFilters.paginatedTransactions}
            packageSelected={Boolean(selectedCategoryPackage)}
            categories={activePackageCategories}
            search={transactionFilters.search}
            onSearchChange={transactionFilters.setSearch}
            categoryId={transactionFilters.categoryId}
            onCategoryFilterChange={transactionFilters.setCategoryId}
            type={transactionFilters.type}
            onTypeChange={transactionFilters.setType}
            filterMode={transactionFilters.filterMode}
            onFilterModeChange={transactionFilters.setFilterMode}
            sort={transactionFilters.sort}
            onSortChange={transactionFilters.setSort}
            onlyUncategorized={transactionFilters.onlyUncategorized}
            onOnlyUncategorizedChange={transactionFilters.setOnlyUncategorized}
            onResetFilters={transactionFilters.resetFilters}
            page={transactionFilters.page}
            totalPages={transactionFilters.totalPages}
            totalResults={transactionFilters.totalResults}
            rowsPerPage={transactionFilters.rowsPerPage}
            onPageChange={transactionFilters.setPage}
            onRowsPerPageChange={transactionFilters.setRowsPerPage}
            onTransactionCategoryChange={handleTransactionCategoryChange}
            onCreateCategory={createCategoryInSelectedPackage}
            onCreateRule={handleCreateRule}
            isExcluded={isExcluded}
            onToggleExcluded={toggleExcluded}
            t={t}
          />
        </div>
      </main>

      <ModalShell
        open={showPackageManager}
        onClose={() => setShowPackageManager(false)}
        title="Category Packages"
        description="Manage reusable category packages separately from imports. Packages contain categories and explicit rules."
        maxWidth="max-w-[1400px]"
      >
        <CategoryPackagesPage
          packages={categoryModel.packages}
          categories={categoryModel.categories}
          rules={categoryModel.rules}
          usage={categoryModel.packageUsage}
          activePackageId={selectedCategoryPackage?.id ?? null}
          createPackage={categoryModel.createPackage}
          updatePackage={categoryModel.updatePackage}
          duplicatePackage={categoryModel.duplicatePackage}
          deletePackage={categoryModel.deletePackage}
          createCategory={categoryModel.createCategory}
          updateCategory={categoryModel.updateCategory}
          deleteCategory={categoryModel.deleteCategory}
          moveCategory={categoryModel.moveCategory}
          reorderCategory={categoryModel.reorderCategory}
          updateRule={categoryModel.updateRule}
          deleteRule={categoryModel.deleteRule}
          t={t}
        />
      </ModalShell>

      {pendingRule ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPendingRule(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-2xl animate-modal-in" role="dialog" aria-modal="true" aria-label="Create rule">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Create rule</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Apply this category automatically when <span className="font-medium text-foreground">{pendingRule.matchType.replace(/-/g, " ")}</span> matches &ldquo;{pendingRule.matchValue}&rdquo;?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPendingRule(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingRule(null)}
                className="inline-flex h-10 items-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRule}
                className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Create rule
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
