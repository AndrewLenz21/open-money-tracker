// ---------------------------------------------------------------------------
// Theme hook — thin Zustand wrapper, drop-in replacement for React context.
//
// Static pages do not have a server-side user preference. The layout applies
// the persisted theme before paint, and the store starts from the same value.
// Components must read theme and setTheme from this hook only, not local state.
// ---------------------------------------------------------------------------

import { useCallback } from "react";
import type { AppTheme } from "@shared/config/themes";
import { useThemeStore } from "../stores/themeStore";

export function useAppTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setThemeStore = useThemeStore((s) => s.setTheme);

  const setTheme = useCallback(
    (newTheme: AppTheme) => { setThemeStore(newTheme); },
    [setThemeStore],
  );

  // mounted is kept for the old API. Theme initialization is synchronous now,
  // so consumers can safely render the selected theme immediately.
  return { theme, setTheme, mounted: true };
}
