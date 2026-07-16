# Contributing to Open Money Tracker

First off, thank you for considering contributing. This project is built with the belief that personal finance should be private, local, and accessible to everyone — regardless of which country or bank they use.

## Project Philosophy

- **Privacy by design.** All data processing happens in the browser. No accounts, no servers, no telemetry.
- **Local-first.** Your financial data never leaves your machine. The application works entirely offline once loaded.
- **Bank-agnostic.** Anyone should be able to add support for their local bank, no matter where they live.
- **Progressive enhancement.** The app should work for everyone. Accessibility, i18n, and performance are features, not afterthoughts.
- **Ship small, ship often.** Small focused PRs are easier to review, safer to merge, and more likely to be accepted.

## Architecture Overview

The project follows a **vertical-slice modular architecture**.

```
src/
├── core/                  # App-wide infrastructure (config, i18n loader, types, routing)
│   ├── config/            # CSV source definitions, app config
│   ├── i18n/              # Translation loader & resolver
│   ├── routing/           # Route definitions
│   ├── storage/           # Storage key constants
│   └── types/             # Shared app types (Locale, Theme, etc.)
├── modules/               # Feature modules — each is self-contained
│   ├── landing/           # Marketing/hero section
│   ├── navigation/        # Navbar, theme/locale providers, drawer
│   ├── import-transactions/  # CSV parsing, validation, storage
│   ├── dashboard/         # Financial analytics, charts, transactions table
│   └── categories/        # Category packages, rules, assignments
├── shared/                # Reusable UI primitives (shadcn/ui), hooks, utilities
├── styles/                # Tailwind + CSS custom properties per theme
├── layouts/               # Astro layout shell
└── pages/                 # Astro routes (index, dashboard, 404)
```

Each module contains its own:

- **`components/`** — React (`.tsx`) or Astro (`.astro`) components
- **`domain/`** — Domain types, pure business logic, normalization
- **`services/`** — Data access, external integrations (e.g., CSV parsers)
- **`stores/`** — Zustand state management
- **`providers/`** — Thin hooks for cross-module consumption
- **`hooks/`** — Internal composition hooks
- **`i18n/`** — Locale JSON files (English as default, with fallback)

Modules communicate through **provider hooks** in `providers/` directories, keeping internal implementation hidden behind barrel exports (`index.ts`).

## Development Setup

### Prerequisites

- **Node.js** >= 22.12.0
- **npm** (comes with Node.js)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/open-money-tracker.git
cd open-money-tracker

# Install dependencies
npm install

# Start the development server (background mode)
npm run dev -- --background

# View the app
# Open http://localhost:4321 in your browser

# Check for TypeScript errors
npx astro check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

We recommend running Astro in background mode during development:

```bash
astro dev --background
```

Manage the server with:

```bash
astro dev stop     # Stop the dev server
astro dev status   # Check if the dev server is running
astro dev logs     # View server logs
```

## Coding Standards

### TypeScript

- Strict mode is enabled. Avoid `any` — prefer `unknown` and type narrowing.
- Use explicit return types on public functions.
- Barrel exports in every module (`index.ts`).
- Path aliases are configured: `@core`, `@modules`, `@shared`, `@styles`.

### React Components

- Prefer function components with hooks.
- Use `shadcn/ui` primitives from `@shared/components/ui/` for consistency.
- Components that require interactivity use `client:only="react"` in Astro pages.
- Keep components focused; if a file exceeds 300 lines, consider splitting.

### State Management

- **Zustand** for all client state.
- **IndexedDB** (`idb` library) for transactional data (imports, transactions).
- **localStorage** for preferences and category data.
- Stores should expose a `hydrate()` function for initialization on mount.

### Styling

- **Tailwind CSS v4** for utility classes.
- Theme colors are defined as CSS custom properties (OKLCH color space) in `src/styles/theme-tokens.css`.
- Six themes are available: Dark, Light, Atom, Sky, Ocean, Pink.
- Use the `cn()` utility (`@shared/lib/utils`) for conditional class merging.

### i18n

- Each module has its own `i18n/{locale}.json` file.
- English (`en`) is the default locale and serves as the fallback.
- Use the `resolveTranslation()` pattern from `@core/i18n` for key lookup.
- When adding a new locale, provide a complete translation file for every module.

### File Naming

- **Components**: PascalCase (e.g., `TransactionTable.tsx`)
- **Utilities/Services**: camelCase (e.g., `dateParser.ts`, `normalization.ts`)
- **Stores**: kebab-case with `.store.ts` suffix (e.g., `csv-import.store.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `dashboard.types.ts`)
- **Tests**: match the source file name with `.test.ts` suffix (e.g., `revolutParser.test.ts`)

## Branch Naming

Use descriptive names with a forward slash separator:

```
feat/bank-hsbc-uk
fix/date-parser-european-format
refactor/csv-provider-strategy
docs/bank-provider-guide
i18n/fr-translations
```

Prefixes: `feat/`, `fix/`, `refactor/`, `docs/`, `i18n/`, `test/`, `chore/`.

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(import): add HSBC UK CSV parser
fix(dashboard): handle negative amounts in cash flow chart
refactor(providers): extract common CSV parsing interface
i18n(landing): add French translations
test(revolut): add edge case tests for date parsing
```

Types: `feat`, `fix`, `refactor`, `i18n`, `test`, `docs`, `chore`, `style`, `perf`.

## Pull Request Process

1. **Create an issue first** for non-trivial changes. Discuss the approach before writing code.
2. **Keep PRs small and focused.** A single PR should address one concern. If you find yourself fixing three things, split them.
3. **Write or update tests** for the code you changed. Untested code will be treated as incomplete.
4. **Run `npx astro check`** to ensure no TypeScript errors.
5. **Verify the app builds** with `npm run build`.
6. **Update documentation** if you change public APIs, add a new provider, or modify the architecture.
7. **Request review** from at least one maintainer.

## Code Review Expectations

- Reviewers will look for correctness, test coverage, adherence to existing patterns, and documentation.
- Nitpicks about style are fine, but reviewers should focus on substance.
- If a PR sits unreviewed for more than 3 business days, feel free to ping.
- All review discussions should be respectful and constructive. "Why did you do it this way?" is always a welcome question.

## Documentation Expectations

- **New features** must include inline documentation for non-obvious logic.
- **New providers** must include sample CSV files and a description of the expected format.
- **Architecture changes** should update this CONTRIBUTING.md if they affect the module structure.
- **README changes** should be proposed separately from feature PRs.

---

## Adding a New Bank Provider

One of the project's primary goals is to support banks from every country. This section explains how to add support for a new bank's CSV export format.

### Architecture

Each provider follows a consistent pipeline:

```
CSV File → Detect Format → Parse CSV → Validate Columns → Normalize → Common Transaction Model
```

The provider integration involves these components:

```
src/modules/import-transactions/
├── services/
│   └── yourBankParser.ts          # Parser implementation
├── domain/
│   └── types.ts                   # Uses existing Transaction/NormalizedTransaction
└── data/
    └── sample-yourbank.csv.ts     # Sample data for testing (optional, recommended)
```

And a registration in:

```
src/core/config/csv-sources.ts     # Add your bank to CSV_SOURCES
```

### Step-by-step Guide

#### 1. Add the CSV Source Definition

Edit `src/core/config/csv-sources.ts`:

```typescript
export type CsvSourceId = "revolut" | "n26" | "intesa" | "generic" | "your-bank-id";
```

Add an entry to the `CSV_SOURCES` array:

```typescript
{
  id: "your-bank-id",
  name: "Your Bank Name",
  description: "Support for Your Bank CSV exports",
  status: "available",
  columns: [
    { key: "date", label: "Date", required: true, description: "Transaction date (DD/MM/YYYY)" },
    { key: "description", label: "Description", required: true },
    { key: "amount", label: "Amount", required: true, description: "Transaction amount" },
    // ... map all columns from your bank's CSV
  ],
  date: {
    columns: ["date"],
    expectedFormats: ["DD/MM/YYYY"],
  },
  sampleRow: {
    date: "15/01/2024",
    description: "Example transaction",
    amount: -42.50,
  },
}
```

#### 2. Create the Parser Service

Create `src/modules/import-transactions/services/yourBankParser.ts`.

Your parser **must** implement this contract:

```typescript
import type { ImportResult } from "../domain/types";

export function parseYourBankCsv(
  csvContent: string,
  filename: string
): ImportResult {
  // 1. Strip BOM characters if present
  // 2. Auto-detect delimiter (, ; or \t)
  // 3. Parse with Papa Parse (header: true, skipEmptyLines: true)
  // 4. Validate required columns exist (throw descriptive error if missing)
  // 5. Map each row to Transaction type
  // 6. Return ImportResult with transactions, rejectedRows, warnings, metadata
}
```

**Key requirements:**

- **Detect the format.** Check required column headers to ensure this file matches your bank's format. Return a clear error if the columns don't match.
- **Validate each row.** Use `parseRevolutDate()` from `dateParser.ts` or add your own date parsing. Validate amounts are valid numbers. Collect invalid rows in `rejectedRows` rather than throwing.
- **Generate stable IDs.** Each `Transaction` needs a deterministic `id`. Use the existing pattern of hashing relevant fields.
- **Return warnings** for recoverable issues (missing optional fields, future dates, unusual amounts).

#### 3. Wire It Up

In the import flow integration point (currently in the CSV import store or a service registry), add a mapping from your provider ID to your parser function. The `ProviderSelect.tsx` component will automatically pick up your new provider from the `CSV_SOURCES` config if its status is `"available"` or `"coming-soon"`.

#### 4. Provide Sample Data

If possible, create a sample CSV file at `public/sample-yourbank.csv` with anonymized data. This helps maintainers test and verify the parser.

For embedding demo data in tests or the import flow, create `src/modules/import-transactions/data/sample-yourbank.csv.ts`:

```typescript
export const SAMPLE_YOURBANK_CSV = `Date,Description,Amount
15/01/2024,Example transaction,-42.50
...`;
```

#### 5. Write Tests

Create `src/modules/import-transactions/services/yourBankParser.test.ts` covering:

- **Happy path:** A valid CSV parses correctly and returns the expected `ImportResult`.
- **Column validation:** An invalid CSV (missing required columns) throws a descriptive error.
- **Row rejection:** A CSV with some valid and some invalid rows correctly separates them.
- **Edge cases:** Empty files, BOM prefixes, different delimiters, unusual date formats, very large numbers.
- **Normalization:** The output of `normalizeTransactions()` with your provider's data produces correct `NormalizedTransaction` objects.

Since the project currently has no test framework installed, add your tests using **vitest** — install it with `npm install -D vitest` and add a `test` script to `package.json`. Follow the patterns used by the existing Revolut parser when choosing test structure.

#### 6. Include a Sample CSV File

Add an anonymized sample CSV to `public/sample-yourbank.csv`. This serves two purposes:

- Lets maintainers run the import flow without having an account at your bank.
- Documents the expected format clearly.

Make sure to anonymize all data — replace names, locations, and any identifying information.

### Updating the Provider Registry

After creating your parser, update `ImportMetadata` in `src/modules/import-transactions/domain/types.ts` if needed (the `provider` field may need widening from a union type). Submit a PR that includes all the changes above.

### Why This Architecture?

Separating each provider into its own file with a clear interface means:

- Contributors from any country can add their local bank without understanding the entire codebase.
- Each provider can be tested independently.
- The import pipeline (parse → validate → normalize → store) remains consistent regardless of the source format.
- Adding a new provider never breaks existing ones.

We welcome contributions from every country. If your bank's CSV format is unusual, open an issue and we'll help you design the parser.
