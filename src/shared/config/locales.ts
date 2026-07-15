export const APP_LOCALES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
] as const;

export type AppLocale = (typeof APP_LOCALES)[number]["code"];

export const DEFAULT_LOCALE: AppLocale = "en";
