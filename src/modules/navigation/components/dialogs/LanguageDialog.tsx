// ---------------------------------------------------------------------------
// Language selection dialog — shown on mobile from the side drawer.
// ---------------------------------------------------------------------------

import { Check } from "lucide-react";
import { useAppLocale } from "../../providers";
import { APP_LOCALES, type AppLocale } from "@shared/config/locales";
import { resolveTranslation } from "@core/i18n";
import { FlagEN, FlagES } from "@shared/components/ui/flags";
import { ModalShell } from "./ModalShell";

const FLAG_MAP: Record<string, React.ReactNode> = {
  en: <FlagEN />,
  es: <FlagES />,
};

const LOCALE_CODE: Record<string, string> = {
  en: "EN",
  es: "ES",
};

type LanguageDialogProps = {
  open: boolean;
  onClose: () => void;
  translations: Record<string, unknown>;
};

export function LanguageDialog({
  open,
  onClose,
  translations,
}: LanguageDialogProps) {
  const { locale, setLocale, mounted } = useAppLocale();

  const t = (path: string): string => resolveTranslation(path, translations);
  const currentLocale = mounted ? locale : "en";

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("language.selectLanguage") || "Select language"}
      description={
        t("language.description") || "Choose the language used by the application"
      }
      maxWidth="max-w-md"
      closeLabel={t("mobile.closeDialog") || "Close dialog"}
    >
      <div className="space-y-1">
        {APP_LOCALES.map((l) => {
          const active = l.code === currentLocale;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLocale(l.code as AppLocale);
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "text-foreground hover:bg-accent/50"
              }`}
            >
              {FLAG_MAP[l.code]}
              <span className="flex-1 text-left">
                {t(`language.locales.${l.code}`) || l.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {LOCALE_CODE[l.code]}
              </span>
              {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
            </button>
          );
        })}
      </div>

    </ModalShell>
  );
}
