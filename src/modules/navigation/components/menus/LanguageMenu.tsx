// ---------------------------------------------------------------------------
// Language switcher using shadcn-style DropdownMenu.
// Used in the desktop nav; the mobile drawer opens a LanguageDialog instead.
// ---------------------------------------------------------------------------

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components/ui";
import { useAppLocale } from "../../providers";
import { APP_LOCALES, type AppLocale } from "@shared/config/locales";
import { resolveTranslation } from "@core/i18n";
import { FlagEN, FlagES } from "@shared/components/ui/flags";
import { Languages, ChevronDown, Check } from "lucide-react";

interface LanguageMenuProps {
  translations: Record<string, unknown>;
}

const FLAG_MAP: Record<string, React.ReactNode> = {
  en: <FlagEN />,
  es: <FlagES />,
};

const LOCALE_LABEL: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export function LanguageMenu({ translations }: LanguageMenuProps) {
  const { locale, setLocale, mounted } = useAppLocale();

  const t = (path: string): string => resolveTranslation(path, translations);

  const currentLocale = mounted ? locale : "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
        aria-label={t("language.selectLanguage") || "Select language"}
      >
        {FLAG_MAP[currentLocale]}
        <Languages className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-semibold tabular-nums">
          {LOCALE_LABEL[currentLocale] ?? "EN"}
        </span>
        <ChevronDown className="h-3 w-3 opacity-50" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {APP_LOCALES.map((l) => {
          const active = l.code === currentLocale;
          return (
            <DropdownMenuItem
              key={l.code}
              onClick={() => {
                setLocale(l.code as AppLocale);
              }}
              className={active ? "font-semibold text-primary" : ""}
            >
              <span className="mr-2">{FLAG_MAP[l.code]}</span>
              <span className="flex-1">
                {t(`language.locales.${l.code}`) || l.label}
              </span>
              {active && <Check className="ml-2 h-4 w-4 shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
