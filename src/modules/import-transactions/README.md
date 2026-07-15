# Import Transactions Module

End-to-end CSV import pipeline: parse, validate, normalise, and persist financial transactions from bank CSV exports to IndexedDB.

## Purpose

Handles the complete import flow from file selection through parsing, validation, normalisation, and persistence. Exposes the domain model and storage services used by the dashboard.

## Responsibilities

- Revolut CSV parsing (Papa Parse)
- Date format detection and validation
- Transaction domain model and normalisation
- Input validation and error reporting (rejected rows, warnings)
- IndexedDB storage abstraction (v2 schema)
- Multi-step import UI: provider select, dropzone, date verification, demo data, error states

## Public API

| Export | Path | Description |
|--------|------|-------------|
| `ImportFlow` | `@modules/import-transactions` | Main import UI (React island) |
| `Transaction`, `NormalizedTransaction`, `ImportRecord`, `ImportResult` | `@modules/import-transactions/domain` | Domain types |
| `parseRevolutCsv` | `@modules/import-transactions/services` | CSV parsing |
| `saveImportResult`, `saveImportRecord`, `saveNormalizedTransactions` | `@modules/import-transactions/services` | IndexedDB persistence |
| `getAllImportRecords`, `getNormalizedTransactionsByImportId`, `deleteImportRecord` | `@modules/import-transactions/services` | IndexedDB queries |
| `useImportData` | `@modules/import-transactions/providers` | React hook for store access |

## Data Flow

```
CSV File ──► FileReader ──► Papa Parse ──► Validation ──► Normalisation ──► IndexedDB
                │                              │                │
           Raw text                        Rejected rows    NormalizedTransaction
                                           + warnings       + ImportRecord
                                           + metadata
```

## Domain Model

### NormalizedTransaction

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Deterministic hash |
| `importId` | `number` | FK to ImportRecord |
| `paymentName` | `string` | Merchant/description |
| `paymentDate` | `Date` | Transaction date |
| `amount` | `number` | Positive = income, negative = expense |
| `fee` | `number` | Transaction fee |
| `currency` | `string` | Currency code (EUR, USD, etc.) |
| `state` | `string` | COMPLETED, PENDING |
| `type` | `"income" | "expense"` | Normalised type |
| `source` | `string` | Provider identifier |
| `originalDescription` | `string` | Raw description before normalisation |
| `accountProduct` | `string` | Account type |
| `balance` | `number | null` | Running balance |
| `importedAt` | `string` | ISO timestamp |
| `filename` | `string` | Source filename |

## Storage Schema (IndexedDB v2)

| Store | Key | Indexes |
|-------|-----|---------|
| `imports` | auto-increment | importedAt |
| `importRecords` | auto-increment | importedAt |
| `normalizedTransactions` | `id` | importId, paymentDate, currency |

## Known Limitations

- Only Revolut CSV format is fully parsed end-to-end
- Locale change causes full page reload
- No file size validation
- No progress bar for large files
