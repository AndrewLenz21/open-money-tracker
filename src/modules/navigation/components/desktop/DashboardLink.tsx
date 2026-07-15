// ---------------------------------------------------------------------------
// Desktop: Dashboard navigation link with active-route detection.
// ---------------------------------------------------------------------------

import { cn } from "@shared/lib/utils";
import { ROUTES } from "@core/routing";
import { resolveTranslation } from "@core/i18n";
import { LayoutDashboard } from "lucide-react";

interface DashboardLinkProps {
  translations: Record<string, unknown>;
}

export function DashboardLink({ translations }: DashboardLinkProps) {
  const t = (path: string): string => resolveTranslation(path, translations);
  const isActive =
    typeof window !== "undefined" &&
    window.location.pathname === ROUTES.dashboard;

  return (
    <a
      href={ROUTES.dashboard}
      aria-label={t("navbar.dashboardAria") || "Go to dashboard"}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors no-underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      )}
    >
      <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">
        {t("header.nav.dashboard") || "Dashboard"}
      </span>
    </a>
  );
}
