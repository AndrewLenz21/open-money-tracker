import { resolveTranslation } from "@core/i18n";
import type { AppLocale } from "@shared/config/locales";
import en from "./en.json";
import es from "./es.json";

const TRANSLATIONS: Record<AppLocale, Record<string, unknown>> = { en, es };

export function getNavigationTranslations(locale: AppLocale): Record<string, unknown> {
  return TRANSLATIONS[locale] ?? TRANSLATIONS.en;
}

export function translateNavigation(locale: AppLocale, path: string): string {
  return resolveTranslation(path, getNavigationTranslations(locale));
}
