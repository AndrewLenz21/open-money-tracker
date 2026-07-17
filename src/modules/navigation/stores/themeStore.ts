// ---------------------------------------------------------------------------
// Zustand store — theme state persisted in localStorage.
// Single source of truth for the current theme.
//
// Static-site rule: read the persisted theme synchronously before creating
// the store. Do not wait for async hydration here; otherwise React can render
// labels from one theme while the pre-hydration HTML already uses another.
// ---------------------------------------------------------------------------

import { create } from "zustand";
import type { AppTheme } from "@shared/config/themes";
import { DEFAULT_THEME, APP_THEME_NAMES } from "@shared/config/themes";
import { STORAGE_KEYS } from "@core/storage";

const THEME_SET = new Set<string>(APP_THEME_NAMES);

function applyDomTheme(theme: AppTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // The app uses class-based theming on <html>. Always remove every known
  // theme before adding the active one so CSS variables cannot mix themes.
  for (const t of APP_THEME_NAMES) root.classList.remove(t);
  root.classList.add(theme);
}

function readStoredTheme(): AppTheme {
  if (typeof localStorage === "undefined") return DEFAULT_THEME;
  const raw = localStorage.getItem(STORAGE_KEYS.theme);
  if (!raw) return DEFAULT_THEME;

  // Preferred format mirrors Zustand persist so the inline head script and the
  // React store read the same object shape on static pages.
  try {
    const data = JSON.parse(raw) as { state?: { theme?: unknown } };
    const theme = data.state?.theme;
    if (typeof theme === "string" && THEME_SET.has(theme)) return theme as AppTheme;
  } catch {
    // Legacy fallback: older builds stored the raw theme string directly.
    if (THEME_SET.has(raw)) return raw as AppTheme;
  }

  return DEFAULT_THEME;
}

function writeStoredTheme(theme: AppTheme): void {
  if (typeof localStorage === "undefined") return;
  try {
    // Keep this shape in sync with the early script in Layout.astro.
    localStorage.setItem(
      STORAGE_KEYS.theme,
      JSON.stringify({ state: { theme }, version: 0 }),
    );
  } catch { /* noop */ }
}

const initialTheme = readStoredTheme();

// Apply once at module load for client-only React islands. The layout script
// already handled first paint; this keeps the store and DOM aligned when the
// JS bundle starts.
applyDomTheme(initialTheme);

// -- Store definition ----------------------------------------------------

type ThemeState = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,

  setTheme: (theme) => {
    // Every theme change must update all layers together: DOM, storage, store.
    applyDomTheme(theme);
    writeStoredTheme(theme);
    set({ theme });
  },
}));

// Safety net: sync DOM if the store changes outside setTheme.
if (typeof document !== "undefined") {
  useThemeStore.subscribe(() => {
    applyDomTheme(useThemeStore.getState().theme);
  });
}
