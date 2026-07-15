// ---------------------------------------------------------------------------
// Thin hook wrapper — useImportData() provides the shared import data store.
// Consumed by the dashboard and any other module that needs the loaded result.
// ---------------------------------------------------------------------------

import { useImportDataStore } from "../stores/importDataStore";

export function useImportData() {
  const data = useImportDataStore((s) => s.data);
  const importRecords = useImportDataStore((s) => s.importRecords);
  const loading = useImportDataStore((s) => s.loading);
  const error = useImportDataStore((s) => s.error);
  const load = useImportDataStore((s) => s.load);

  return { data, importRecords, loading, error, load };
}
