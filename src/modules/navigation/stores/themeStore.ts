// ---------------------------------------------------------------------------
// Zustand store — theme state + DOM class application.
// ---------------------------------------------------------------------------

import { create } from "zustand";
import type { AppTheme } from "@shared/config/themes";
import { DEFAULT_THEME, APP_THEME_NAMES } from "@shared/config/themes";
import { STORAGE_KEYS } from "@core/storage";

function readCurrentTheme(): AppTheme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  for (const t of APP_THEME_NAMES) {
    if (document.documentElement.classList.contains(t)) return t;
  }
  return DEFAULT_THEME;
}

function applyTheme(theme: AppTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const t of APP_THEME_NAMES) root.classList.remove(t);
  root.classList.add(theme);
  try { localStorage.setItem(STORAGE_KEYS.theme, theme); } catch { /* noop */ }
}

type ThemeState = {
  theme: AppTheme;
  mounted: boolean;
  setTheme: (theme: AppTheme) => void;
  hydrate: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: DEFAULT_THEME,
  mounted: false,

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },

  hydrate: () => {
    set({ theme: readCurrentTheme(), mounted: true });
  },
}));
