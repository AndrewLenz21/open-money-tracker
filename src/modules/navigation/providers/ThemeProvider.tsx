// ---------------------------------------------------------------------------
// Theme hook — thin Zustand wrapper, drop-in replacement for React context.
// Exposes theme, setTheme, and a mounted flag that reflects persist hydration.
// ---------------------------------------------------------------------------

import { useCallback } from "react";
import type { AppTheme } from "@shared/config/themes";
import { useThemeStore } from "../stores/themeStore";

export function useAppTheme() {
  const theme = useThemeStore((s) => s.theme);
  const mounted = useThemeStore((s) => s._hydrated);
  const setThemeStore = useThemeStore((s) => s.setTheme);

  const setTheme = useCallback(
    (newTheme: AppTheme) => { setThemeStore(newTheme); },
    [setThemeStore],
  );

  return { theme, setTheme, mounted };
}
