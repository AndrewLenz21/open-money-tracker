# Shared Module

Reusable, domain-agnostic UI components, hooks, and utilities.

## Purpose

Provides the foundational building blocks consumed by all feature modules.

## Responsibilities

- shadcn/ui component primitives (Button, Card, Badge, Alert, Select, Table, Skeleton, DropdownMenu)
- Class merging utility (`cn`)
- Formatting utilities (currency, date, number)

## Public API

| Export | Path |
|--------|------|
| UI components | `@shared/components/ui` |
| Utilities | `@shared/utils` |
| `cn` | `@shared/lib/utils` |

## Components

| Component | shadcn Variant | Usage |
|-----------|---------------|-------|
| Button | default, destructive, outline, secondary, ghost, link | Forms, actions, toggles |
| Card | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter | Layout containers |
| Badge | default, secondary, destructive, outline, success, warning | Labels, status |
| Select | native `<select>` with chevron | Filters, dropdowns |
| Table | Table, TableHeader, TableBody, TableRow, TableHead, TableCell | Data tables |
| Alert | default, destructive, success, warning | Notifications, confirmations |
| Skeleton | — | Loading states |
| DropdownMenu | Trigger, Content, Item, Label, Separator | Context menus, actions |

## Dependencies

- class-variance-authority (variant props)
- clsx + tailwind-merge (cn utility)
- Lucide React (icons)
