import { useState, useEffect, useCallback } from "react";
import { getModuleTranslations, resolveTranslation } from "@core/i18n";
import { useAppLocale } from "@modules/navigation";

const FALLBACKS: Record<string, string> = {
  "hero.badge": "100% local · No account required",
  "hero.title": "Privacy-first personal finance",
  "hero.subtitle":
    "Track your spending locally. No accounts, no cloud, your data stays on your device.",
};

export default function LandingHero() {
  const { locale } = useAppLocale();
  const [translations, setTranslations] = useState<Record<string, unknown>>(() =>
    getModuleTranslations(locale, "landing"),
  );

  useEffect(() => {
    setTranslations(getModuleTranslations(locale, "landing"));
  }, [locale]);

  const t = useCallback(
    (path: string, fallback: string): string =>
      resolveTranslation(path, translations) || fallback,
    [translations],
  );

  return (
    <section className="relative px-4 pt-12 pb-6 sm:pt-16 sm:pb-8 text-center">
      <div
        className="anim-fade-down"
        style={{ animationDelay: "0ms" } as React.CSSProperties}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          {t("hero.badge", FALLBACKS["hero.badge"])}
        </span>
      </div>
      <h1
        className="anim-fade-down mx-auto mt-4 max-w-2xl text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
        style={{ animationDelay: "80ms" } as React.CSSProperties}
      >
        {t("hero.title", FALLBACKS["hero.title"])}
      </h1>
      <p
        className="anim-fade-down mx-auto mt-3 max-w-xl text-sm sm:text-base text-muted-foreground"
        style={{ animationDelay: "160ms" } as React.CSSProperties}
      >
        {t("hero.subtitle", FALLBACKS["hero.subtitle"])}
      </p>
    </section>
  );
}
