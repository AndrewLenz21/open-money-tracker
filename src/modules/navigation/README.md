# Navigation Module

Application navigation bar, theme/locale providers, and mobile drawer infrastructure.

## Purpose

Sticky top navigation shared across all routes, with brand display, language/theme selection, desktop sidebar toggle, and mobile drawer system for imports.

## Responsibilities

- Sticky navigation bar with desktop sidebar toggle
- Brand display with responsive layout
- Language selection (EN/ES)
- Theme selection with visual previews (Dark, Light, Atom, Sky, Ocean)
- Theme and locale React context providers
- Mobile imports drawer (overlay, portaled to body)
- Mobile navigation drawer
- Shared modal shell for dialogs

## Public API

| Export | Path | Description |
|--------|------|-------------|
| `Navbar` | `@modules/navigation` | Main navigation bar (React island) |
| `Brand` | `@modules/navigation` | Logo + app name |
| `ImportsDrawer` | `@modules/navigation` | Mobile imports sidebar |
| `MobileDrawer` | `@modules/navigation` | Mobile nav drawer |
| `ModalShell` | `@modules/navigation` | Reusable modal wrapper |
| `useAppLocale`, `useAppTheme` | `@modules/navigation/providers` | Context hooks |
| `LocaleProvider`, `ThemeProvider` | `@modules/navigation/providers` | Context providers |

## Desktop Sidebar Integration

The navbar includes a toggle button (left of the brand) that controls the desktop import sidebar via Zustand state. When the sidebar is open, the navbar shifts horizontally via `margin-left` to maintain alignment.

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (≥768px) | Sidebar toggle visible, full controls |
| Mobile (<768px) | Sidebar becomes overlay drawer, compact navbar with three-zone grid |

## Theme Preview Colors

| Theme | Background | Primary | Accent |
|-------|-----------|---------|--------|
| Dark | oklch(0.145 0 0) | oklch(0.922 0 0) | oklch(0.269 0 0) |
| Light | oklch(1 0 0) | oklch(0.205 0 0) | oklch(0.97 0 0) |
| Sky | oklch(0.96 0.015 235) | oklch(0.45 0.14 255) | oklch(0.94 0.02 235) |
| Ocean | oklch(0.93 0.045 195) | oklch(0.4 0.18 195) | oklch(0.91 0.06 195) |
| Atom | oklch(0.27 0.03 260) | oklch(0.73 0.17 245) | oklch(0.35 0.03 260) |

## Known Limitations

- Route detection uses `window.location.pathname` (not Astro router)
- Locale change triggers full page reload
- Theme preview colours are hardcoded duplicates of CSS variables
- No sync between inline flash-prevention script and React theme provider
