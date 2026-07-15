import type { Locale } from "../types/app";
import type { TranslationObject } from "./types";

const LOCALE_STORAGE_KEY = "omt:locale";
const DEFAULT_LOCALE: Locale = "en";

const eagerTranslationModules = import.meta.glob<{ default: TranslationObject }>(
  "../../modules/**/i18n/*.json",
  { eager: true },
);

export function getStoredLocale(): Locale {
  if (typeof document !== "undefined") {
    try {
      const match = document.cookie.match(/(?:^|;\s*)omt_locale=([^;]*)/);
      if (match?.[1] === "en" || match?.[1] === "es") return match[1];
    } catch { /* SSR */ }
  }
  if (typeof localStorage !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === "en" || stored === "es") return stored;
    } catch { /* unavailable */ }
  }
  return DEFAULT_LOCALE;
}

export function setStoredLocale(locale: Locale): void {
  if (typeof document !== "undefined") {
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `omt_locale=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
  }
  if (typeof localStorage !== "undefined") {
    try { localStorage.setItem(LOCALE_STORAGE_KEY, locale); } catch { /* noop */ }
  }
}

export function resolveTranslation(
  path: string,
  translations: Record<string, unknown>,
): string {
  const keys = path.split(".");
  let current: unknown = translations;

  for (const key of keys) {
    if (current === null || typeof current !== "object") {
      return "";
    }
    const obj = current as Record<string, unknown>;
    if (!(key in obj)) {
      return "";
    }
    current = obj[key];
  }

  return typeof current === "string" ? current : "";
}

export function getModuleTranslations(
  locale: Locale,
  moduleName: string,
): TranslationObject {
  const primaryPath = `../../modules/${moduleName}/i18n/${locale}.json`;
  const fallbackPath = `../../modules/${moduleName}/i18n/en.json`;

  return (
    eagerTranslationModules[primaryPath]?.default ||
    eagerTranslationModules[fallbackPath]?.default ||
    {}
  );
}

export async function loadModuleTranslations(
  locale: Locale,
  moduleName: string,
): Promise<TranslationObject> {
  return getModuleTranslations(locale, moduleName);
}
