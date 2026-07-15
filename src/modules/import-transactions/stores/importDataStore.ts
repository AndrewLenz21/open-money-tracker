// ---------------------------------------------------------------------------
// Shared Zustand store — normalized transaction data loaded from IndexedDB.
// Any module can read via useImportData() without re-loading.
// ---------------------------------------------------------------------------

import { create } from "zustand";
import type { NormalizedTransaction, ImportRecord } from "../domain";
import {
  getAllNormalizedTransactions,
  getAllImportRecords,
} from "../services/storage";

type ImportDataStore = {
  data: NormalizedTransaction[] | null;
  importRecords: ImportRecord[] | null;
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  setData: (data: NormalizedTransaction[]) => void;
  reset: () => void;
};

export const useImportDataStore = create<ImportDataStore>((set) => ({
  data: null,
  importRecords: null,
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const [transactions, records] = await Promise.all([
        getAllNormalizedTransactions(),
        getAllImportRecords(),
      ]);
      const data = transactions.length > 0 ? transactions : null;
      set({
        data,
        importRecords: records.length > 0 ? records : null,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load data",
        loading: false,
      });
    }
  },

  setData: (data) => set({ data, loading: false, error: null }),

  reset: () =>
    set({
      data: null,
      importRecords: null,
      loading: false,
      error: null,
    }),
}));
