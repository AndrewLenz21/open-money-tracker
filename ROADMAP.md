# Roadmap

## Completed

- **Revolut CSV import** — Full parser, validation, date normalization
- **Import flow** — Drag-and-drop upload, column detection, row-level validation
- **IndexedDB storage** — Persistent local storage for imports and transactions
- **Dashboard** — Cash flow and category spending charts, transaction table with pagination
- **Category packages** — Create, edit, and organize categories into packages
- **Auto-categorization rules** — Merchant-based, description-based matching with priority ordering
- **Multi-currency support** — Per-currency summaries in the dashboard
- **6 visual themes** — Dark, Light, Atom, Sky, Ocean, Pink
- **Internationalization** — English and Spanish, with modular i18n architecture
- **PWA support** — Offline-capable, installable via service worker
- **Responsive design** — Mobile-first layout with drawer navigation
- **Astro v7 + React 19** — Built on latest framework versions

## In Progress

- **N26 CSV parser** — Implementation for N26 (formerly Number26) bank exports
- **Intesa Sanpaolo CSV parser** — Implementation for Italy's largest bank
- **Generic CSV mapper** — Allow users to map their own CSV columns to the common transaction model
- **Test infrastructure** — Install vitest, establish testing patterns, add tests for the Revolut parser

## Planned

- **Import/export** — Export transactions and categories as JSON for backup and migration
- **Budgeting** — Set monthly budgets per category, track progress in the dashboard
- **Recurring transaction detection** — Automatically identify subscriptions and regular payments
- **Savings goals** — Track progress toward financial targets
- **Multi-account support** — Manage multiple bank accounts and view consolidated reports
- **Transaction search** — Full-text search across descriptions and amounts
- **Dashboard date ranges** — Custom date range selection (beyond preset filters)
- **CSR/Category ratio visuals** — Additional dashboard visualizations
- **Keyboard shortcuts** — Power user navigation without mouse

## Future Ideas

- **Mobile app** — Wrappers via Capacitor or Tauri for native mobile experience
- **Plug-in architecture** — Third-party providers as separate packages loaded dynamically
- **Bank statement PDF parsing** — Extract data from PDF statements (not just CSV)
- **Open Banking / API integrations** — Direct bank connections via Plaid, Tink, or Gocardless
- **Encryption at rest** — Optional passphrase-based encryption of IndexedDB data
- **Accessibility improvements** — Full WCAG 2.1 AA compliance, screen reader optimization
- **Additional languages** — French, German, Italian, Portuguese, Japanese, and more
- **Offline-first sync** — Encrypted sync between devices via WebRTC or a self-hosted relay
- **Dark mode refinements** — Per-component theme customization
- **Rule templates** — Community-shared auto-categorization rule packs
- **Financial insights engine** — ML-based spending pattern analysis (entirely local via ONNX or TensorFlow.js)
- **Receipt scanning** — OCR-based receipt data extraction (local only)
- **Tax reporting** — Generate annual tax reports from categorized transaction data
- **More bank providers** — Community contributions for banks worldwide (see CONTRIBUTING.md)

---

## How to Influence the Roadmap

Open issues and upvote existing ones to signal what matters most to you. We prioritize based on:

1. **Community demand** (reactions and comments on issues)
2. **Architectural impact** (features that unlock future work)
3. **Maintainability** (features we can sustain long-term)

We welcome PRs for anything on this roadmap — see [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.
