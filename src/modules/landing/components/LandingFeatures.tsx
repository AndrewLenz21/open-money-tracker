import { useState, useEffect, useCallback } from "react";
import { Lock, Upload, BarChart3, Code } from "lucide-react";
import { getModuleTranslations, resolveTranslation } from "@core/i18n";
import { useAppLocale } from "@modules/navigation";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lock: Lock,
  upload: Upload,
  chart: BarChart3,
  code: Code,
};

interface FeatureItem {
  icon: string;
  variant: "privacy" | "import" | "insights" | "oss";
  iconAccent: "privacy" | "import" | "insights" | "oss";
  titleKey: string;
  fallbackTitle: string;
  descriptionKey: string;
  fallbackDescription: string;
  emphasis?: boolean;
}

const FEATURES: FeatureItem[] = [
  {
    icon: "lock",
    variant: "privacy",
    iconAccent: "privacy",
    titleKey: "features.privacy.title",
    fallbackTitle: "100% Local",
    descriptionKey: "features.privacy.description",
    fallbackDescription: "All data stays in your browser. No server, no cloud, no tracking.",
    emphasis: true,
  },
  {
    icon: "upload",
    variant: "import",
    iconAccent: "import",
    titleKey: "features.revolut.title",
    fallbackTitle: "Bank CSV Import",
    descriptionKey: "features.revolut.description",
    fallbackDescription: "Add your bank statement CSV for instant local analysis.",
  },
  {
    icon: "chart",
    variant: "insights",
    iconAccent: "insights",
    titleKey: "features.insights.title",
    fallbackTitle: "Clear Insights",
    descriptionKey: "features.insights.description",
    fallbackDescription: "Income, expenses, cash flow, and balance trends at a glance.",
  },
  {
    icon: "code",
    variant: "oss",
    iconAccent: "oss",
    titleKey: "features.openSource.title",
    fallbackTitle: "Open Source",
    descriptionKey: "features.openSource.description",
    fallbackDescription: "MIT licensed. Free forever. Contribute on GitHub.",
  },
];

const SECTION_FALLBACKS: Record<string, string> = {
  "features.eyebrow": "WHY IT WORKS",
  "features.title": "Features",
  "features.subtitle":
    "Everything you need to understand your finances, without giving up your privacy.",
  "features.privacyBadge": "Privacy first",
  "footer.openSource": "Open Source",
  "footer.privacy": "Privacy-first. No data leaves your device.",
};

export default function LandingFeatures() {
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
    <>
      <section className="features-section relative px-4 py-14 sm:py-20">
        {/* Decorative background — positioned wider than the viewport and
            centered, so the line chart / glow extend naturally past the
            visible area instead of appearing as a clipped pill. */}
        <div aria-hidden="true" className="features-background">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1800 360"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Main smooth line chart spanning the full background width. */}
            <path
              className="deco-line"
              d="M 0 240 C 200 200, 380 280, 560 220 S 900 120, 1140 180 S 1500 260, 1800 160"
            />
            {/* Secondary softer line, offset for depth. */}
            <path
              className="deco-line deco-line-soft"
              d="M 0 300 C 240 260, 480 320, 720 280 S 1140 220, 1380 260 S 1660 300, 1800 240"
            />
            {/* Vertical bars on the right. */}
            <g className="deco-bars">
              <rect className="deco-bar" x="1380" y="200" width="6" height="60" rx="2" />
              <rect className="deco-bar" x="1410" y="170" width="6" height="90" rx="2" />
              <rect className="deco-bar" x="1440" y="190" width="6" height="70" rx="2" />
              <rect className="deco-bar" x="1470" y="150" width="6" height="110" rx="2" />
              <rect className="deco-bar" x="1500" y="180" width="6" height="80" rx="2" />
              <rect className="deco-bar" x="1530" y="160" width="6" height="100" rx="2" />
              <rect className="deco-bar" x="1560" y="200" width="6" height="60" rx="2" />
              <rect className="deco-bar" x="1590" y="180" width="6" height="80" rx="2" />
              <rect className="deco-bar" x="1620" y="170" width="6" height="90" rx="2" />
              <rect className="deco-bar" x="1650" y="190" width="6" height="70" rx="2" />
              <rect className="deco-bar" x="1680" y="160" width="6" height="100" rx="2" />
              <rect className="deco-bar" x="1710" y="200" width="6" height="60" rx="2" />
            </g>
            {/* Dotted grid on the left. */}
            <g className="deco-dots">
              {Array.from({ length: 6 }).map((_, row) =>
                Array.from({ length: 6 }).map((__, col) => (
                  <circle
                    key={`${row}-${col}`}
                    className="deco-dot"
                    cx={60 + col * 18}
                    cy={100 + row * 18}
                    r="1.2"
                  />
                )),
              )}
            </g>
          </svg>
        </div>

        {/* Content container — separate from the decoration so the
            max-width never clips the background. */}
        <div className="features-container">
          {/* Header: eyebrow + title + subtitle */}
          <div className="relative mx-auto mb-10 sm:mb-14 max-w-2xl text-center">
            <span
              className="anim-fade-up features-eyebrow"
              style={{ animationDelay: "0ms" } as React.CSSProperties}
            >
              {t("features.eyebrow", SECTION_FALLBACKS["features.eyebrow"])}
            </span>
            <h2
              className="anim-fade-up mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ animationDelay: "60ms" } as React.CSSProperties}
            >
              {t("features.title", SECTION_FALLBACKS["features.title"])}
            </h2>
            <p
              className="anim-fade-up features-subtitle mt-3"
              style={{ animationDelay: "120ms" } as React.CSSProperties}
            >
              {t("features.subtitle", SECTION_FALLBACKS["features.subtitle"])}
            </p>
          </div>

          {/* Card grid */}
          <div className="relative mx-auto grid max-w-5xl gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => {
              const Icon = ICONS[feature.icon] ?? ICONS.code;
              return (
                <div
                  key={feature.icon}
                  className="anim-fade-up"
                  style={{ animationDelay: `${(i + 1) * 80 + 120}ms` } as React.CSSProperties}
                >
                  <article
                    className={[
                      "feature-card",
                      `feature-card--variant-${feature.variant}`,
                      feature.emphasis ? "feature-card--privacy" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div
                      className={`feature-icon feature-icon--${feature.iconAccent}`}
                      aria-hidden="true"
                    >
                      <Icon />
                    </div>
                    <h3 className="feature-title">
                      {t(feature.titleKey, feature.fallbackTitle)}
                      {feature.emphasis && (
                        <span className="feature-badge">
                          {t("features.privacyBadge", SECTION_FALLBACKS["features.privacyBadge"])}
                        </span>
                      )}
                    </h3>
                    <p className="feature-description">
                      {t(feature.descriptionKey, feature.fallbackDescription)}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border/40 py-8 px-4 text-center text-xs text-muted-foreground">
        <p>
          {t("footer.openSource", SECTION_FALLBACKS["footer.openSource"])}
          {" "}&mdash;{" "}
          {t("footer.privacy", SECTION_FALLBACKS["footer.privacy"])}
        </p>
      </footer>
    </>
  );
}
