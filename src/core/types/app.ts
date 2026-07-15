export type Locale = "en" | "es";

export type Theme = "dark" | "atom" | "sky" | "ocean";

export type SupportedDateFormat =
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD"
  | "DD/MM/YYYY HH:mm:ss"
  | "MM/DD/YYYY HH:mm:ss"
  | "YYYY-MM-DD HH:mm:ss";

export type DateFormatExample = Record<SupportedDateFormat, string>;
