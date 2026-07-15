// ---------------------------------------------------------------------------
// Desktop: language / theme dropdown trigger + dashboard link.
// ---------------------------------------------------------------------------

import { DashboardLink } from "./DashboardLink";
import { LanguageMenu } from "../menus/LanguageMenu";
import { ThemeMenu } from "../menus/ThemeMenu";
import { resolveTranslation } from "@core/i18n";

interface DesktopNavigationProps {
  translations: Record<string, unknown>;
}

export function DesktopNavigation({ translations }: DesktopNavigationProps) {
  const t = (path: string): string => resolveTranslation(path, translations);

  return (
    <nav
      aria-label={t("navbar.mainAria") || "Main navigation"}
      className="hidden md:flex items-center gap-2"
    >
      <DashboardLink translations={translations} />
      <div className="h-5 w-px bg-border/60 mx-1" aria-hidden="true" />
      <LanguageMenu translations={translations} />
      <ThemeMenu translations={translations} />
    </nav>
  );
}
