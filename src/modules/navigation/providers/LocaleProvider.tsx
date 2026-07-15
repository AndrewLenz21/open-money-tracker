// ---------------------------------------------------------------------------
// Locale hook — thin Zustand wrapper, drop-in replacement for React context.
// Call `initializeLocale()` once on mount to read the stored/browser locale.
// ---------------------------------------------------------------------------

import { useEffect, useCallback } from "react";
import type { AppLocale } from "@shared/config/locales";
import { useLocaleStore } from "../stores/localeStore";

// Replaces the old React context hook — same API.
export function useAppLocale() {
  const locale = useLocaleStore((s) => s.locale);
  const mounted = useLocaleStore((s) => s.mounted);
  const setLocaleStore = useLocaleStore((s) => s.setLocale);
  const initializeLocale = useLocaleStore((s) => s.initializeLocale);

  useEffect(() => {
    if (!mounted) initializeLocale();
  }, [initializeLocale, mounted]);

  const setLocale = useCallback(
    (newLocale: AppLocale) => { setLocaleStore(newLocale); },
    [setLocaleStore],
  );

  return { locale, setLocale, mounted };
}
