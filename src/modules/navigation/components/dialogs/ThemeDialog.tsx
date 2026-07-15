// ---------------------------------------------------------------------------
// Theme selection dialog — shown on mobile from the side drawer.
// Each option uses an identical 3-column grid (preview · text · icon).
// ---------------------------------------------------------------------------

import { Check } from "lucide-react";
import { useAppTheme } from "../../providers";
import { APP_THEMES, type AppTheme } from "@shared/config/themes";
import { resolveTranslation } from "@core/i18n";
import { ThemePreview } from "../menus/ThemePreview";
import { ModalShell } from "./ModalShell";

// -- reusable 3-column theme option --------------------------------------
type ThemeOptionProps = {
  name: string;
  label: string;
  description: string;
  active: boolean;
  onSelect: () => void;
};

function ThemeOption({
  name,
  label,
  description,
  active,
  onSelect,
}: ThemeOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
        active
          ? "bg-accent ring-2 ring-primary/30"
          : "hover:bg-accent/50"
      }`}
    >
      {/* fixed preview column */}
      <span className="flex shrink-0 items-center" aria-hidden="true">
        <ThemePreview theme={name} />
      </span>

      {/* flexible text column */}
      <span className="min-w-0">
        <span
          className={`block text-sm font-semibold ${
            active ? "text-accent-foreground" : "text-foreground"
          }`}
        >
          {label}
        </span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          {description}
        </span>
      </span>

      {/* fixed icon column — always occupies space */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {active && <Check className="h-4 w-4 text-primary" />}
      </span>
    </button>
  );
}

// -- dialog --------------------------------------------------------------
type ThemeDialogProps = {
  open: boolean;
  onClose: () => void;
  translations: Record<string, unknown>;
};

export function ThemeDialog({
  open,
  onClose,
  translations,
}: ThemeDialogProps) {
  const { theme, setTheme, mounted } = useAppTheme();

  const t = (path: string): string => resolveTranslation(path, translations);
  const currentTheme = mounted ? theme : "dark";

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("theme.selectTheme") || "Select theme"}
      description={
        t("theme.description") || "Select the visual style of the application"
      }
      maxWidth="max-w-2xl"
      closeLabel={t("mobile.closeDialog") || "Close dialog"}
    >
      <div className="space-y-2">
        {APP_THEMES.map((tm) => {
          const themeT = (path: string): string =>
            resolveTranslation(path, translations);
          return (
            <ThemeOption
              key={tm.name}
              name={tm.name}
              label={themeT(`theme.${tm.name}.name`) || tm.label}
              description={
                themeT(`theme.${tm.name}.description`) || ""
              }
              active={tm.name === currentTheme}
              onSelect={() => {
                setTheme(tm.name as AppTheme);
              }}
            />
          );
        })}
      </div>
    </ModalShell>
  );
}
