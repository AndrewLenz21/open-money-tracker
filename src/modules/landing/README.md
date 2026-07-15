# Landing Module

Marketing/intro page that explains the product value proposition and links to the import flow.

## Purpose

The public-facing landing page that presents Open Money Tracker to new users. Highlights privacy, import capabilities, insights, and open-source nature.

## Responsibilities

- Hero section with badge, headline, and subtitle
- Feature cards (privacy, Revolut import, insights, open source)
- Footer with licence and privacy links
- Demo data teaser that feeds into the import flow

## Public API

| Export | Path | Description |
|--------|------|-------------|
| `LandingHero` | `@modules/landing` | Top-of-page hero section |
| `LandingFeatures` | `@modules/landing` | Feature grid + footer |

## Component Structure

```
landing/
  components/
    LandingHero.tsx        Hero section (badge, title, subtitle)
    LandingFeatures.tsx    Features grid + footer
  i18n/
    en.json                English
    es.json                Spanish
  index.ts                 Barrel export
```

## Translation Keys

| Prefix | Scope |
|--------|-------|
| `hero.*` | Badge, title, subtitle |
| `features.*` | Feature card titles and descriptions |
| `footer.*` | Open-source and privacy links |

## Dependencies

- `@core/i18n` (translation loading)
- `@modules/navigation` (useAppLocale)
- `@shared/components/ui` (Button via LandingFeatures)
- Lucide icons (Lock, Upload, BarChart3, Code)
