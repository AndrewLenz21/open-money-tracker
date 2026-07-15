# Dashboard Module

Financial analysis dashboard with metrics, charts, transaction table, category management, and user-defined category packages.

## Purpose

The core analytical view of the application. Aggregates imported transaction data, computes financial metrics and insights, renders interactive charts, and provides a fully categorisable transaction table with pagination and include/exclude controls.

## Responsibilities

- Load transaction data from IndexedDB via shared store
- Compute financial summaries (income, expenses, cash flow, balance)
- Cash flow and category spending charts (Recharts)
- Transactions table with search, filters, sorting, and pagination
- Include/exclude individual transactions from calculations
- Category package system (user-defined categories, icons, colours)
- Auto-categorisation rules (merchant/description matching)
- Desktop import sidebar with resize and collapse
- Currency and date-range filtering (persisted)

## Public API

| Export | Path | Description |
|--------|------|-------------|
| `DashboardPage` | `@modules/dashboard` | Main dashboard (React island) |
| `useDashboardData` | `@modules/dashboard/providers` | Store + filter state |
| `useDashboardTranslations` | `@modules/dashboard/providers` | Localised `t()` hook |

## Component Structure

```
dashboard/
  components/
    header/         DashboardHeader, ImportMetadata
    metrics/        PrimaryMetrics (4 cards), SecondarySummary, MetricCard
    charts/         CashFlowChart, CategorySpendingChart
    insights/       FinancialInsights
    transactions/   TransactionsSection, TransactionsToolbar, TransactionsTable,
                    TransactionsPagination, RowsPerPageSelector, CategorySelector
    sidebar/        ImportSidebar (desktop), ImportList
    shared/         SectionCard, AmountDisplay, CategoryBadge, StatusBadge
    filters/        DashboardFilters (currency + date range)
    states/         DashboardSkeleton, DashboardError, DashboardEmpty
  hooks/            useTransactionCategories, useTransactionFilters,
                    useDashboardAnalytics, useExcludedTransactions
  stores/           dashboardStore (Zustand + localStorage)
  providers/        useDashboardData, useDashboardTranslations
  domain/           CurrencySummary, BalancePoint, calculations
  i18n/             en.json, es.json
```

## Feature Details

### Category Packages

Users create their own category systems (packages) with custom names, icons, and colours. No preset categories. Packages are independent of imports and survive import deletion.

### Auto-categorisation Rules

Rules are created explicitly from categorised transactions:
- Exact merchant match
- Exact description
- Description contains
- Description starts with

Rules are package-scoped and apply only when that package is selected for an import.

### Excluded Transactions

Each transaction row has a checkbox. Unchecked transactions are filtered from all analytics (metrics, charts, insights) but remain visible in the table with reduced opacity.

### Pagination

Applied after search, filters, and sorting. Page numbers with ellipsis compression. Configurable rows per page (5, 10, 20, 50, 100), persisted to localStorage.

### Desktop Sidebar

Fixed-position sidebar with push layout on desktop. The navbar shifts via `margin-left` when the sidebar opens/closes. Resizable from the right edge. On mobile, the sidebar becomes an overlay drawer.

## Stores

| Store | Module | Persistence |
|-------|--------|-------------|
| `dashboardStore` | `@modules/dashboard/stores` | localStorage |
| `importDataStore` | `@modules/import-transactions/stores` | IndexedDB |
| `useCategoryPackages` | `@modules/categories` | localStorage (multiple keys) |

## Dependencies

- Recharts (ComposedChart, BarChart, LineChart, ResponsiveContainer)
- Zustand (stores)
- `@modules/import-transactions` (domain types, storage services)
- `@modules/categories` (category packages, rules, assignments)
- `@modules/navigation` (useAppLocale, ModalShell)
- `@shared/components/ui` (Card, Button, Badge, Table, Select, DropdownMenu)
- `@shared/utils` (formatCurrency, formatDate)
- Lucide icons

## Known Limitations

- No comparison between time periods
- No export of chart data or transactions
- Balance line only uses transactions with explicit balance values
