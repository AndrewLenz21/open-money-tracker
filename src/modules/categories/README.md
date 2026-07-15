# Categories Module

User-defined category package system for organising transactions.

## Purpose

Provides a fully user-configurable categorisation system. Users create category packages (e.g. "Personal", "Business"), define custom categories with icons and colours, and create auto-categorisation rules. Categories are not preset — every category is created by the user.

## Responsibilities

- Category package CRUD (create, read, update, duplicate, delete)
- User category management (name, icon, colour, order, archive)
- Import-to-package linking
- Transaction-to-category assignments
- User-created auto-categorisation rules
- Persistence via localStorage (versioned keys)
- Legacy migration (cleans up old category storage format)

## Public API

| Export | Path | Description |
|--------|------|-------------|
| `useCategoryPackages` | `@modules/categories/hooks` | Main hook: packages, categories, rules, assignments |
| `CategoryPackagesPage` | `@modules/categories/components/packages` | Full package management UI |
| `CategoryPackageSelector` | `@modules/categories/components/selectors` | Package selector for imports |
| `TransactionCategorySelector` | `@modules/categories/components/selectors` | Per-transaction category picker |
| `CategoryEditor` | `@modules/categories/components/categories` | Category + rules editor |
| `CategoryFormDialog` | `@modules/categories/components/categories` | Create/edit category dialog |
| `CategoryIconPicker` | `@modules/categories/components/categories` | Visual icon selector |
| `getCategoryIcon` | `@modules/categories/components/categories` | Icon lookup utility |
| `findMatchingRule` | `@modules/categories/utils` | Rule matching engine |

## Data Model

```
CategoryPackage (packageId) ──► UserCategory[]
                             ──► CategoryRule[]
Import ──► ImportCategoryPackageLink (importId, packageId)
Transaction ──► TransactionCategoryAssignment (transactionKey, packageId, categoryId)
```

### Types

| Type | Fields |
|------|--------|
| `CategoryPackage` | id, name, description, createdAt, updatedAt |
| `UserCategory` | id, packageId, name, color, icon?, order, isArchived, createdAt, updatedAt |
| `CategoryRule` | id, packageId, categoryId, matchType, matchValue, priority, isActive |
| `ImportCategoryPackageLink` | importId, packageId, updatedAt |
| `TransactionCategoryAssignment` | transactionKey, importId, packageId, categoryId, updatedAt |

## Storage (localStorage)

| Key | Content |
|-----|---------|
| `open-money-tracker.category-packages.v1` | CategoryPackage[] |
| `open-money-tracker.categories.v1` | UserCategory[] |
| `open-money-tracker.import-package-links.v1` | ImportCategoryPackageLink[] |
| `open-money-tracker.transaction-categories.v1` | TransactionCategoryAssignment[] |
| `open-money-tracker.category-rules.v1` | CategoryRule[] |

## Key Design Decisions

- No preset categories — every category is user-created
- Packages are independent from imports (deleting an import does not delete its package)
- Rules are package-scoped and only apply when that package is selected
- `Uncategorized` is a technical state, not an editable category
- Category IDs are stable (do not change when the name changes)
- Icon/color changes are reflected immediately in the dashboard table badges
