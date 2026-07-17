// ---------------------------------------------------------------------------
// Zustand store — theme state persisted via zustand/middleware persist.
// Single source of truth for the current theme.
// ---------------------------------------------------------------------------

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppTheme } from "@shared/config/themes";
import { DEFAULT_THEME, APP_THEME_NAMES } from "@shared/config/themes";
import { STORAGE_KEYS } from "@core/storage";

function applyDomTheme(theme: AppTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const t of APP_THEME_NAMES) root.classList.remove(t);
  root.classList.add(theme);
}

type ThemeState = {
  theme: AppTheme;
  _hydrated: boolean;
  setTheme: (theme: AppTheme) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      _hydrated: false,

      setTheme: (theme) => {
        applyDomTheme(theme);
        set({ theme });
      },
    }),
    {
      name: STORAGE_KEYS.theme,
      // Only persist the theme value — _hydrated is transient
      partialize: (state) => ({ theme: state.theme }),

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // Could not parse persisted value — migration from old raw-string format.
          // Read the raw value directly and apply it.
          try {
            const raw = localStorage.getItem(STORAGE_KEYS.theme);
            if (raw && (APP_THEME_NAMES as readonly string[]).includes(raw)) {
              applyDomTheme(raw as AppTheme);
              useThemeStore.setState({ theme: raw as AppTheme, _hydrated: true });
              return;
            }
          } catch { /* noop */ }
        }
        if (state) {
          applyDomTheme(state.theme);
        }
        useThemeStore.setState({ _hydrated: true });
      },
    }
  )
);
