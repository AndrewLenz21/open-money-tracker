// ---------------------------------------------------------------------------
// Dashboard components barrel — public API.
// ---------------------------------------------------------------------------

// root orchestrator
export { default as DashboardPage } from "./DashboardPage";

// header
export { DashboardHeader, ImportMetadata } from "./header";

// metrics
export { MetricCard, PrimaryMetrics, SecondarySummary } from "./metrics";

// charts
export { CashFlowChart, CategorySpendingChart } from "./charts";

// insights
export { FinancialInsights } from "./insights";

// transactions
export { TransactionsSection, TransactionsTable, TransactionsToolbar, CategorySelector } from "./transactions";

// shared
export { AmountDisplay, CategoryBadge, SectionCard, StatusBadge } from "./shared";

// filters
export { DashboardFilters } from "./filters";

// states (skeleton, error, empty)
export { DashboardSkeleton, DashboardError, DashboardEmpty } from "./states";
