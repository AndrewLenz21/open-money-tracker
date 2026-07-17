// ---------------------------------------------------------------------------
// Mobile side-drawer panel — uses the shared Drawer primitive.
// Contains Dashboard link, and rows that open Language / Theme dialogs.
// ---------------------------------------------------------------------------

import { X, LayoutDashboard, ChevronRight } from "lucide-react";
import { ROUTES } from "@core/routing";
import { resolveTranslation } from "@core/i18n";
import { useAppLocale } from "../../providers";
import { useAppTheme } from "../../providers";
import { APP_THEMES, DEFAULT_THEME } from "@shared/config/themes";
import { FlagEN, FlagES } from "@shared/components/ui/flags";
import { ThemePreview } from "../menus/ThemePreview";
import { Drawer } from "../drawer/Drawer";

const FLAG_MAP: Record<string, React.ReactNode> = {
  en: <FlagEN />,
  es: <FlagES />,
};

const LOCALE_NAME: Record<string, string> = {
  en: "English",
  es: "Español",
};

type MobileDrawerProps = {
  open: boolean;
  closing: boolean;
  onClose: () => void;
  onOpenLanguage: () => void;
  onOpenTheme: () => void;
  translations: Record<string, unknown>;
};

export function MobileDrawer({
  open,
  closing,
  onClose,
  onOpenLanguage,
  onOpenTheme,
  translations,
}: MobileDrawerProps) {
  const { locale, mounted: localeMounted } = useAppLocale();
  const { theme, mounted: themeMounted } = useAppTheme();

  const t = (path: string): string => resolveTranslation(path, translations);

  const currentLocale = localeMounted ? locale : "en";
  const currentTheme = themeMounted ? theme : DEFAULT_THEME;
  const dashboardHref = ROUTES.dashboard;

  const isDashboardActive =
    typeof window !== "undefined" &&
    window.location.pathname === ROUTES.dashboard;

  return (
    <Drawer
      open={open}
      closing={closing}
      onClose={onClose}
      side="right"
      width="min(88vw, 420px)"
    >
      {/* header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span className="text-sm font-semibold text-foreground">
          {t("header.title") || "Open Money Tracker"}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("mobile.closeMenu")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-5 h-px bg-border" />

      {/* body */}
      <div className="scrollarea flex-1 overflow-y-auto px-5 pt-3 pb-8 space-y-3">
        {/* navigation */}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          {t("mobile.navigationSection") || "Navigation"}
        </p>

        <a
          href={dashboardHref}
          onClick={onClose}
          className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
            isDashboardActive
              ? "bg-accent text-accent-foreground"
              : "text-foreground hover:bg-accent/50"
          }`}
        >
          <span className="flex items-center gap-3">
            <LayoutDashboard className="h-4 w-4" />
            {t("header.nav.dashboard") || "Dashboard"}
          </span>
        </a>

        {/* preferences */}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 pt-2">
          {t("mobile.preferencesSection") || "Preferences"}
        </p>

        {/* language row */}
        <button
          type="button"
          onClick={onOpenLanguage}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent/50"
        >
          <span className="flex items-center gap-3">
            {FLAG_MAP[currentLocale]}
            {t("language.label") || "Language"}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">
              {t(`language.locales.${currentLocale}`) || LOCALE_NAME[currentLocale] || "English"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </span>
        </button>

        {/* theme row */}
        <button
          type="button"
          onClick={onOpenTheme}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent/50"
        >
          <span className="flex items-center gap-3">
            <ThemePreview theme={currentTheme} compact />
            {t("theme.label") || "Theme"}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">
              {t(`theme.${currentTheme}.name`) ||
                APP_THEMES.find((tm) => tm.name === currentTheme)?.label ||
                "Dark"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </Drawer>
  );
}
