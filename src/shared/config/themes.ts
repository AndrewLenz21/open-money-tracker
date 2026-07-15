export const APP_THEMES = [
  { name: "light", label: "Light" },
  { name: "dark", label: "Dark" },
  { name: "atom", label: "Atom" },
  { name: "sky", label: "Sky" },
  { name: "ocean", label: "Ocean" },
  { name: "pink", label: "Pink" },
] as const;

export type AppTheme = (typeof APP_THEMES)[number]["name"];

export const APP_THEME_NAMES = APP_THEMES.map(({ name }) => name) as AppTheme[];

export const DEFAULT_THEME: AppTheme = "dark";
