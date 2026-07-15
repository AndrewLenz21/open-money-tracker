// ---------------------------------------------------------------------------
// Zustand store — locale state + persistence to localStorage.
// ---------------------------------------------------------------------------

import { create } from "zustand";
import type { AppLocale } from "@shared/config/locales";
import { DEFAULT_LOCALE } from "@shared/config/locales";
import { setStoredLocale } from "@core/i18n";

const LEGACY_LOCALE_STORAGE_KEY = "omt-locale";
const LOCALE_STORAGE_KEY = "omt:locale";

function normalizeLocale(value: string | null | undefined): AppLocale {
  const language = value?.toLowerCase().split("-")[0];
  return language === "es" ? "es" : "en";
}

function readSavedLocale(): AppLocale | null {
  if (typeof document !== "undefined") {
    try {
      const match = document.cookie.match(/(?:^|;\s*)omt_locale=([^;]*)/);
      if (match?.[1] === "en" || match?.[1] === "es") return match[1];
    } catch { /* noop */ }
  }
  if (typeof localStorage === "undefined") return null;
  try {
    const value =
      localStorage.getItem(LOCALE_STORAGE_KEY) ??
      localStorage.getItem(LEGACY_LOCALE_STORAGE_KEY);
    if (value === "en" || value === "es") return value;
  } catch { /* noop */ }
  return null;
}

function readBrowserLocale(): AppLocale | null {
  if (typeof navigator === "undefined") return null;
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const match = candidates.find((value) => normalizeLocale(value) !== DEFAULT_LOCALE);
  return match ? normalizeLocale(match) : normalizeLocale(candidates[0]);
}

function resolveInitialLocale(): AppLocale {
  return readSavedLocale() ?? readBrowserLocale() ?? DEFAULT_LOCALE;
}

function applyLocale(locale: AppLocale): void {
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
  setStoredLocale(locale);
}

type LocaleStore = {
  locale: AppLocale;
  mounted: boolean;
  setLocale: (locale: AppLocale) => void;
  initializeLocale: () => void;
  hydrate: () => void;
};

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: resolveInitialLocale(),
  mounted: typeof window !== "undefined",

  setLocale: (locale) => {
    applyLocale(locale);
    set({ locale });
  },

  initializeLocale: () => {
    const locale = resolveInitialLocale();
    applyLocale(locale);
    set({ locale, mounted: true });
  },

  hydrate: () => useLocaleStore.getState().initializeLocale(),
}));
