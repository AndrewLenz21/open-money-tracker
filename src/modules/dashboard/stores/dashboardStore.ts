// ---------------------------------------------------------------------------
// Zustand store — dashboard filters and import panel state.
// Pattern follows the navigation locale/theme stores.
// ---------------------------------------------------------------------------

import { create } from "zustand";

export type FilterMode = "all" | "last7" | "last30";

const STORAGE_CURRENCY = "omt:dashboard:currency";
const STORAGE_FILTER = "omt:dashboard:filter";
export const STORAGE_IMPORT_ID = "omt:dashboard:importId";
const STORAGE_SIDEBAR_OPEN = "omt:dashboard:sidebarOpen";
const STORAGE_SIDEBAR_WIDTH = "omt:dashboard:sidebarWidth";

function readCurrency(): string {
  if (typeof localStorage === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_CURRENCY) ?? "";
  } catch {
    return "";
  }
}

function readFilterMode(): FilterMode {
  if (typeof localStorage === "undefined") return "all";
  try {
    const v = localStorage.getItem(STORAGE_FILTER);
    if (v === "all" || v === "last7" || v === "last30") return v;
  } catch { /* noop */ }
  return "all";
}

function readImportId(): number | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_IMPORT_ID);
    return v ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
}

function readSidebarOpen(): boolean {
  if (typeof localStorage === "undefined") return true;
  try {
    const v = localStorage.getItem(STORAGE_SIDEBAR_OPEN);
    return v !== "false";
  } catch {
    return true;
  }
}

function readSidebarWidth(): number {
  if (typeof localStorage === "undefined") return 320;
  try {
    const v = localStorage.getItem(STORAGE_SIDEBAR_WIDTH);
    const n = v ? parseInt(v, 10) : 320;
    return Math.min(440, Math.max(260, n));
  } catch {
    return 320;
  }
}

type DashboardStore = {
  selectedCurrency: string;
  filterMode: FilterMode;
  selectedImportId: number | null;
  desktopSidebarOpen: boolean;
  mobileImportsOpen: boolean;
  sidebarWidth: number;
  hydrated: boolean;

  setSelectedCurrency: (currency: string) => void;
  setFilterMode: (mode: FilterMode) => void;
  setSelectedImportId: (id: number | null) => void;
  setDesktopSidebarOpen: (open: boolean) => void;
  setMobileImportsOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  hydrate: () => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedCurrency: "",
  filterMode: "all",
  selectedImportId: null,
  desktopSidebarOpen: false,
  mobileImportsOpen: false,
  sidebarWidth: 320,
  hydrated: false,

  setSelectedCurrency: (currency) => {
    set({ selectedCurrency: currency });
    try {
      localStorage.setItem(STORAGE_CURRENCY, currency);
    } catch { /* noop */ }
  },

  setFilterMode: (mode) => {
    set({ filterMode: mode });
    try {
      localStorage.setItem(STORAGE_FILTER, mode);
    } catch { /* noop */ }
  },

  setSelectedImportId: (id) => {
    set({ selectedImportId: id });
    try {
      if (id === null) {
        localStorage.removeItem(STORAGE_IMPORT_ID);
      } else {
        localStorage.setItem(STORAGE_IMPORT_ID, id.toString());
      }
    } catch { /* noop */ }
  },

  setDesktopSidebarOpen: (open) => {
    set({ desktopSidebarOpen: open });
    try {
      localStorage.setItem(STORAGE_SIDEBAR_OPEN, open ? "true" : "false");
    } catch { /* noop */ }
  },

  setMobileImportsOpen: (open) => {
    set({ mobileImportsOpen: open });
  },

  setSidebarWidth: (width) => {
    const clamped = Math.min(440, Math.max(260, width));
    set({ sidebarWidth: clamped });
    try {
      localStorage.setItem(STORAGE_SIDEBAR_WIDTH, clamped.toString());
    } catch { /* noop */ }
  },

  hydrate: () => {
    const currency = readCurrency();
    const filterMode = readFilterMode();
    const selectedImportId = readImportId();
    const desktopSidebarOpen = readSidebarOpen();
    const sidebarWidth = readSidebarWidth();
    set({
      selectedCurrency: currency,
      filterMode,
      selectedImportId,
      desktopSidebarOpen,
      sidebarWidth,
      hydrated: true,
    });
  },
}));
