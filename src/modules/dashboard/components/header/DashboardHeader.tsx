import type { ImportRecord } from "@modules/import-transactions/domain";
import { DashboardFilters } from "../filters";
import type { FilterMode } from "../../stores/dashboardStore";
import { ImportMetadata } from "./ImportMetadata";

interface DashboardHeaderProps {
  activeImport: ImportRecord | null;
  currencies: string[];
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  filterMode: FilterMode;
  setFilterMode: (mode: FilterMode) => void;
  t: (path: string) => string;
}

export function DashboardHeader({
  activeImport,
  currencies,
  selectedCurrency,
  setSelectedCurrency,
  filterMode,
  setFilterMode,
  t,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("title") || "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("header.description") || "A compact view of your cash flow, spending patterns, and transactions."}
            </p>
          </div>
        </div>
        <ImportMetadata activeImport={activeImport} t={t} />
      </div>

      <div className="xl:min-w-[320px]">
        <DashboardFilters
          currencies={currencies}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          t={t}
        />
      </div>
    </div>
  );
}
