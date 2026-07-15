// ---------------------------------------------------------------------------
// Theme thumbnail preview shared by the desktop dropdown, the mobile drawer
// row, and the theme selection dialog. Two variants:
//   - compact: 3 stacked colour circles (used inside tight rows)
//   - full:    64×42 px mock UI with static theme colours
// Colours are derived from each theme's CSS custom properties.
// ---------------------------------------------------------------------------

type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  text: string;
  border: string;
};

const THEME_META: Record<string, ThemeColors> = {
  light: {
    background: "oklch(1 0 0)",
    surface: "oklch(0.97 0 0)",
    primary: "oklch(0.205 0 0)",
    text: "oklch(0.145 0 0)",
    border: "oklch(0.922 0 0)",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    surface: "oklch(0.205 0 0)",
    primary: "oklch(0.922 0 0)",
    text: "oklch(0.985 0 0)",
    border: "oklch(1 0 0 / 18%)",
  },
  atom: {
    background: "oklch(0.27 0.03 260)",
    surface: "oklch(0.24 0.03 260)",
    primary: "oklch(0.73 0.17 245)",
    text: "oklch(0.79 0.03 260)",
    border: "oklch(1 0 0 / 18%)",
  },
  sky: {
    background: "oklch(0.96 0.015 235)",
    surface: "oklch(1 0 0)",
    primary: "oklch(0.45 0.14 255)",
    text: "oklch(0.25 0.06 250)",
    border: "oklch(0.84 0.05 235)",
  },
  ocean: {
    background: "oklch(0.93 0.045 195)",
    surface: "oklch(1 0 0)",
    primary: "oklch(0.4 0.18 195)",
    text: "oklch(0.25 0.08 200)",
    border: "oklch(0.82 0.09 195)",
  },
  pink: {
    background: "oklch(0.975 0.012 350)",
    surface: "oklch(1 0 0)",
    primary: "oklch(0.58 0.22 350)",
    text: "oklch(0.22 0.02 340)",
    border: "oklch(0.84 0.025 340)",
  },
};

export function ThemePreview({
  theme,
  compact,
}: {
  theme: string;
  compact?: boolean;
}) {
  const c = THEME_META[theme];
  if (!c) return null;

  // Inline compact version for tight rows (e.g. drawer row, dropdown trigger).
  if (compact) {
    return (
      <span className="flex items-center gap-0.5 shrink-0" aria-hidden="true">
        <span
          className="block h-3 w-3 rounded-full"
          style={{
            backgroundColor: c.background,
            border: `1px solid ${c.border}`,
          }}
        />
        <span
          className="block h-3 w-3 rounded-full"
          style={{ backgroundColor: c.primary }}
        />
        <span
          className="block h-3 w-3 rounded-full"
          style={{ backgroundColor: c.text, opacity: 0.6 }}
        />
      </span>
    );
  }

  // Full thumbnail version for dialogs and dropdown menus.
  return (
    <span
      className="relative flex shrink-0 overflow-hidden rounded-[7px]"
      style={{
        width: 64,
        height: 42,
        backgroundColor: c.background,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 0 1px ${c.border} inset`,
      }}
      aria-hidden="true"
    >
      {/* top bar (surface colour) */}
      <span
        className="absolute top-0 left-0 right-0 block"
        style={{ height: 8, backgroundColor: c.surface }}
      />

      {/* text line (below top bar) */}
      <span
        className="absolute left-2 block rounded-sm"
        style={{
          top: 13,
          width: "35%",
          height: 3,
          backgroundColor: c.text,
          opacity: 0.35,
        }}
      />

      {/* content block 1 (primary) */}
      <span
        className="absolute left-2 block rounded-sm"
        style={{
          top: 20,
          width: 22,
          height: 14,
          backgroundColor: c.primary,
          opacity: 0.7,
        }}
      />

      {/* content block 2 (surface / border tone) */}
      <span
        className="absolute left-[30px] block rounded-sm"
        style={{
          top: 20,
          width: 22,
          height: 14,
          backgroundColor: c.text,
          opacity: 0.12,
          border: `1px solid ${c.border}`,
        }}
      />
    </span>
  );
}
