// ---------------------------------------------------------------------------
// Dashboard translations hook — loads module translations and returns `t()`.
// Pattern matches ImportFlow.tsx (useAppLocale + useEffect + resolveTranslation).
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from "react";
import { useAppLocale } from "@modules/navigation";
import { getModuleTranslations, resolveTranslation } from "@core/i18n";

export function useDashboardTranslations() {
  const { locale } = useAppLocale();
  const [translations, setTranslations] = useState<Record<string, unknown>>(() =>
    getModuleTranslations(locale, "dashboard"),
  );

  useEffect(() => {
    setTranslations(getModuleTranslations(locale, "dashboard"));
  }, [locale]);

  const t = useCallback(
    (path: string): string =>
      resolveTranslation(path, translations as Record<string, unknown>) || "",
    [translations],
  );

  return t;
}
