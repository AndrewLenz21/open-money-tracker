# Deployment Guide

> Open Money Tracker — Cloudflare Workers static site deployment.

## Table of Contents

- [Overview](#overview)
- [Repository](#repository)
- [Build & Deploy](#build--deploy)
- [Domain](#domain)
- [Workers Static Assets](#workers-static-assets)
- [Local preview](#local-preview)
- [Redeploy](#redeploy)

## Overview

The project is a fully static Astro site deployed to **Cloudflare Workers** using **Workers Static Assets**. No server-side runtime is required — the build output in `dist/` is served directly by Cloudflare's edge network.

## Repository

| Detail | Value |
|--------|-------|
| Provider | GitHub |
| URL | `https://github.com/AndrewLenz21/open-money-tracker` |
| Production branch | `main` |

## Build & Deploy

### Build

```bash
npm run build
```

Output is written to `./dist/`.

### Deploy

```bash
npx wrangler deploy
```

Deploys the contents of `./dist/` to the `open-money-tracker` Worker on Cloudflare.

### Non-production branches

To deploy a branch other than `main`:

```bash
npx wrangler deploy
```

Wrangler uses the branch name as a preview suffix automatically.

## Domain

**Production URL:** [https://open-money-tracker.andrew-lenz.com](https://open-money-tracker.andrew-lenz.com)

### Adding a custom domain

1. Go to **Cloudflare Dashboard → Workers & Pages → open-money-tracker**.
2. Open the **Domains** tab.
3. Click **Add Domain** and enter the domain.
4. Cloudflare automatically provisions the DNS record and HTTPS certificate.

> **Important:** Do NOT add the domain as a new Cloudflare zone. The domain is managed through the Worker's Domains section, not through a separate zone configuration.

## Workers Static Assets

The deployment uses Workers Static Assets mode. The configuration lives in `wrangler.jsonc` at the project root:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "open-money-tracker",
  "compatibility_date": "2026-07-15",
  "assets": {
    "directory": "./dist",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

Key settings:

| Field | Value | Description |
|-------|-------|-------------|
| `name` | `open-money-tracker` | Worker name on Cloudflare |
| `compatibility_date` | `2026-07-15` | Workers runtime compatibility date |
| `assets.directory` | `./dist` | Static files directory (Astro build output) |
| `assets.html_handling` | `auto-trailing-slash` | Automatically resolves `/dashboard` to `/dashboard/index.html` |
| `assets.not_found_handling` | `404-page` | Serves `404.html` for unmatched routes |

## Local preview

Test the production build locally before deploying:

```bash
npm run build
npm run preview
```

Astro's preview server serves the exact same `dist/` output that Wrangler will deploy.

## Redeploy

To trigger a new deployment:

1. Push to the `main` branch (GitHub push triggers Cloudflare's auto-deploy via the connected Git integration).
2. Or navigate to **Cloudflare Dashboard → Workers & Pages → open-money-tracker → Deployments** and click **Create Deployment**.
