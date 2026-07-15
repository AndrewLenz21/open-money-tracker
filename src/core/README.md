# Core Module

Application-wide infrastructure layer.

## Purpose

Foundational services used by all modules: configuration, internationalisation, routing, types, and storage keys.

## Responsibilities

- Global application configuration
- i18n loader and locale utilities
- Route constants
- Shared TypeScript types (Locale, Theme, SupportedDateFormat)
- localStorage key constants

## Public API

| Export | Path | Description |
|--------|------|-------------|
| `APP_CONFIG` | `@core/config` | App constants (demo path, filename, etc.) |
| `loadModuleTranslations` | `@core/i18n` | Load translations for a module |
| `resolveTranslation` | `@core/i18n` | Resolve a dot-path key in translations |
| `getStoredLocale` / `setStoredLocale` | `@core/i18n` | Locale persistence |
| `ROUTES` | `@core/routing` | Route path constants |
| `Locale`, `Theme`, `SupportedDateFormat` | `@core/types` | Shared type definitions |

## Folder Structure

```
core/
  config/     App constants
  i18n/       Translation loader, types, resolver
  routing/    Route path constants
  types/      Shared type definitions
  storage/    localStorage key constants
  index.ts    Barrel export
```

## Dependencies

- None (zero external dependencies at the core layer)

## Known Limitations

- Locale is read from localStorage only (no URL-based detection during SSR)
- `getStoredLocale()` defaults to "en" during SSR since localStorage is unavailable
