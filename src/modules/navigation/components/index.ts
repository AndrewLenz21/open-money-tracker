// ---------------------------------------------------------------------------
// Components barrel — public API for all navbar sub-components.
// ---------------------------------------------------------------------------

export { Navbar } from "./Navbar";

// brand
export { Brand } from "./brand/Brand";

// desktop
export { DesktopNavigation } from "./desktop/DesktopNavigation";
export { DashboardLink } from "./desktop/DashboardLink";

// menus (shared language/theme pickers)
export { LanguageMenu } from "./menus/LanguageMenu";
export { ThemeMenu } from "./menus/ThemeMenu";
export { ThemePreview } from "./menus/ThemePreview";

// mobile
export { MobileNavbar } from "./mobile/MobileNavbar";
export { MobileDrawer } from "./mobile/MobileDrawer";

// dialogs
export { LanguageDialog } from "./dialogs/LanguageDialog";
export { ThemeDialog } from "./dialogs/ThemeDialog";
export { ModalShell } from "./dialogs/ModalShell";
