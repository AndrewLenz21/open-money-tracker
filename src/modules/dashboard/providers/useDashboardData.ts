// ---------------------------------------------------------------------------
// Dashboard data hook — reads shared import-data store + local filter store,
// returns dashboard source data + persisted UI filters.
// ---------------------------------------------------------------------------

import { useMemo, useEffect } from "react";
import { useImportData } from "@modules/import-transactions/providers";
import { useDashboardStore } from "../stores/dashboardStore";
import { getAvailableCurrencies, getMostFrequentCurrency } from "../domain";

export function useDashboardData() {
  const { data: allTransactions, importRecords, loading, error, load } = useImportData();

  const selectedCurrency = useDashboardStore((s) => s.selectedCurrency);
  const filterMode = useDashboardStore((s) => s.filterMode);
  const selectedImportId = useDashboardStore((s) => s.selectedImportId);
  const hydrated = useDashboardStore((s) => s.hydrated);
  const setSelectedCurrency = useDashboardStore((s) => s.setSelectedCurrency);
  const setFilterMode = useDashboardStore((s) => s.setFilterMode);
  const setSelectedImportId = useDashboardStore((s) => s.setSelectedImportId);

  useEffect(() => {
    if (importRecords && importRecords.length > 0) {
      const ids = new Set(importRecords.map((r) => r.id));
      if (selectedImportId !== null && !ids.has(selectedImportId)) {
        setSelectedImportId(null);
      }
    }
  }, [importRecords, selectedImportId, setSelectedImportId]);

  useEffect(() => {
    if (importRecords && importRecords.length > 0 && selectedImportId === null) {
      const latest = importRecords.reduce((latest, r) =>
        (r.id ?? 0) > (latest.id ?? 0) ? r : latest,
      );
      if (latest.id != null) {
        setSelectedImportId(latest.id);
      }
    }
  }, [importRecords, selectedImportId, setSelectedImportId]);

  const transactions = useMemo(() => {
    if (!allTransactions) return null;
    if (selectedImportId !== null) {
      const filtered = allTransactions.filter(
        (tx) => tx.importId === selectedImportId,
      );
      if (filtered.length > 0) return filtered;
    }
    return allTransactions;
  }, [allTransactions, selectedImportId]);

  const currencies = useMemo(
    () => (transactions ? getAvailableCurrencies(transactions) : []),
    [transactions],
  );

  useEffect(() => {
    if (currencies.length > 0 && (!selectedCurrency || !currencies.includes(selectedCurrency))) {
      const mostFrequent =
        getMostFrequentCurrency(transactions ?? []) ?? currencies[0]!;
      setSelectedCurrency(mostFrequent);
    }
  }, [currencies, selectedCurrency, setSelectedCurrency, transactions]);

  return {
    transactions,
    importRecords,
    allTransactions,
    loading,
    error,
    load,
    hydrated,
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    selectedImportId,
    setSelectedImportId,
    filterMode,
    setFilterMode,
  };
}
