import { Select } from "@shared/components/ui";
import type { FilterMode } from "../../stores";

interface DashboardFiltersProps {
  currencies: string[];
  selectedCurrency: string;
  setSelectedCurrency: (c: string) => void;
  filterMode: FilterMode;
  setFilterMode: (m: FilterMode) => void;
  t: (path: string) => string;
}

export function DashboardFilters({
  currencies,
  selectedCurrency,
  setSelectedCurrency,
  filterMode,
  setFilterMode,
  t,
}: DashboardFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("currency.label") || "Currency"}
        </p>
        <Select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          options={currencies.map((c) => ({ value: c, label: c }))}
          className="h-11"
          aria-label={t("currency.label") || "Currency"}
        />
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("table.dateFilter") || "Date range"}
        </p>
        <Select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value as FilterMode)}
          options={[
            { value: "all", label: t("filter.all") || "All time" },
            { value: "last7", label: t("filter.last7") || "Last 7 days" },
            { value: "last30", label: t("filter.last30") || "Last 30 days" },
          ]}
          className="h-11"
        />
      </div>
    </div>
  );
}
