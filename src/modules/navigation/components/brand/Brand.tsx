// ---------------------------------------------------------------------------
// Shared brand (desktop + mobile): logo icon + product name.
// ---------------------------------------------------------------------------

import { ROUTES } from "@core/routing";
import { resolveTranslation } from "@core/i18n";
import { cn } from "@shared/lib/utils";
import { ChartArea } from "lucide-react";

interface BrandProps {
  translations: Record<string, unknown>;
  hideTitle?: boolean;
}

export function Brand({ translations, hideTitle }: BrandProps) {
  const t = (path: string): string => resolveTranslation(path, translations);
  return (
    <a
      href={ROUTES.home}
      className="flex items-center gap-2 text-foreground no-underline"
      aria-label={t("navbar.brandAria") || "Go to home page"}
    >
      <ChartArea className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
      <span className={cn("text-base font-semibold tracking-tight max-[380px]:hidden", hideTitle && "hidden")}>
        {t("header.title") || "Open Money Tracker"}
      </span>
    </a>
  );
}