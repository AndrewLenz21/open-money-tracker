export const APP_CONFIG = {
  name: "Open Money Tracker",
  version: "0.1.0",
  defaultLocale: "en",
  supportedLocales: ["en", "es"] as const,
  storagePrefix: "omt",
  demoCsvFilename: "sample-revolut-statement.csv",
  demoCsvPath: "/sample-revolut-statement.csv",
} as const;
