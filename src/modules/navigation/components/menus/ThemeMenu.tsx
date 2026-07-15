// ---------------------------------------------------------------------------
// Theme switcher with visual previews using shadcn-style DropdownMenu.
// Used in the desktop nav and reused as the source of truth for the mobile dialog.
// ---------------------------------------------------------------------------

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components/ui";
import { useAppTheme } from "../../providers";
import { APP_THEMES, DEFAULT_THEME, type AppTheme } from "@shared/config/themes";
import { resolveTranslation } from "@core/i18n";
import { ThemePreview } from "./ThemePreview";
import { Palette } from "lucide-react";

type ThemeMenuProps = {
  translations: Record<string, unknown>;
};

export function ThemeMenu({ translations }: ThemeMenuProps) {
  const { theme, setTheme, mounted } = useAppTheme();

  const t = (path: string): string => resolveTranslation(path, translations);

  const current = mounted ? (theme ?? DEFAULT_THEME) : DEFAULT_THEME;
  const currentTheme =
    APP_THEMES.find((tm) => tm.name === current) ?? APP_THEMES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
        aria-label={t("theme.changeTheme") || "Change theme"}
      >
        <Palette className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline text-xs font-medium">
          {t(`theme.${currentTheme.name}.name`) || currentTheme.label}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        {APP_THEMES.map((tm) => {
          const active = tm.name === current;
          const themeT = (path: string): string =>
            resolveTranslation(path, translations);

          return (
            <DropdownMenuItem
              key={tm.name}
              onClick={() => {
                setTheme(tm.name as AppTheme);
              }}
              className={active ? "bg-accent" : ""}
            >
              <div className="flex items-center gap-3 w-full py-1">
                <ThemePreview theme={tm.name} />
                <div className="flex-1 min-w-0">
                  <div
                    className={
                      active
                        ? "text-sm font-semibold text-primary"
                        : "text-sm font-medium"
                    }
                  >
                    {themeT(`theme.${tm.name}.name`) || tm.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {themeT(`theme.${tm.name}.description`) || ""}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
