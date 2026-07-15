// ---------------------------------------------------------------------------
// Navigation module — public API.
// ---------------------------------------------------------------------------

// root component
export { Navbar } from "./components/Navbar";

// sub-components (grouped by concern)
export { Brand } from "./components/brand/Brand";
export {
  DesktopNavigation,
  DashboardLink,
} from "./components/desktop";
export { LanguageMenu, ThemeMenu, ThemePreview } from "./components/menus";
export { MobileNavbar, MobileDrawer } from "./components/mobile";
export { LanguageDialog, ThemeDialog, ModalShell } from "./components/dialogs";

// hooks (thin Zustand wrappers — drop-in replacement for old context API)
export { useAppLocale, useAppTheme } from "./providers";

// stores (Zustand — usable from any module)
export { useLocaleStore, useThemeStore } from "./stores";
