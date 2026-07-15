// ---------------------------------------------------------------------------
// Theme hook — thin Zustand wrapper, drop-in replacement for React context.
// Call `hydrate()` once on mount to read the current theme.
// ---------------------------------------------------------------------------

import { useEffect, useCallback } from "react";
import type { AppTheme } from "@shared/config/themes";
import { useThemeStore } from "../stores/themeStore";

// Replaces the old React context hook — same API.
export function useAppTheme() {
  const theme = useThemeStore((s) => s.theme);
  const mounted = useThemeStore((s) => s.mounted);
  const setThemeStore = useThemeStore((s) => s.setTheme);
  const hydrate = useThemeStore((s) => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);

  const setTheme = useCallback(
    (newTheme: AppTheme) => { setThemeStore(newTheme); },
    [setThemeStore],
  );

  return { theme, setTheme, mounted };
}
