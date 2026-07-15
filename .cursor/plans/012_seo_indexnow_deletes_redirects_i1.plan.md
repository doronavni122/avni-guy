# Plan: indexnow-deletes-redirects-completeness

ADR: none , (cite SSOT.md)

## Goal

IndexNow covers content updates, 301 redirect sources, and gone/deleted URLs; sitemap `lastmod` bumps only on real content/page changes (no per-build `new Date()` churn).

## SSOT

- `SSOT.md` §A–E (static Next, MDX blog, verify via `pnpm build`)
- Existing: `scripts/post-deploy-indexnow.mjs`, `src/app/api/indexnow/route.ts`, `src/app/sitemap.ts`
- Legacy 301 sources: `src/middleware.ts` (`guy-avni-` prefix) — read-only reference
- Page `DATE_MODIFIED` constants on static routes (mirrored into sitemap map; pages themselves out of exclusive scope)

## Exclusive files

- `scripts/post-deploy-indexnow.mjs`
- `src/app/sitemap.ts`
- `src/app/api/indexnow/` (incl. `route.ts`)

## Non-goals

- No fake live IndexNow success; skip/dry-run when unset / non-prod without `INDEXNOW_PING=1`
- No FAQ theater, Globes pages, MDX entity-link rewrites
- No edits outside exclusive files (middleware/vercel.json remain reference-only)
- Top-20 blog expand + GSC client → scope `indexnow-gsc-one-shot`

## Design

### 1. sitemap `lastmod` honesty (`src/app/sitemap.ts`)

- Remove `new Date()` for static paths.
- `STATIC_PATH_LASTMOD`: explicit ISO dates aligned with each page’s known `DATE_MODIFIED` (home/about/services/categories/tags/editorial-policy/sheelot); contact/search use fixed baselines until those pages gain dates.
- Keep post `updatedDate ?? pubDate`; blog archive/pagination/categories lists may use `getArchiveDateModified(posts)`.

### 2. IndexNow API (`src/app/api/indexnow/route.ts`)

- Validate every URL host matches site host (`SITE_URL` / `avniguy.co.il`).
- Optional `action`: `update` | `redirect` | `gone` for structured error logs only (same upstream IndexNow POST).
- Keep batch cap ≤100 per request; return clear 4xx/5xx; never claim ok without upstream success when key configured.
- Error logging every step.

### 3. Post-deploy script (`scripts/post-deploy-indexnow.mjs`)

- Build URL sets:
  - **update**: static paths (sitemap parity) + all `/blog/{slug}/` from `src/content/blog/`
  - **redirect**: legacy `/blog/guy-avni-{slug}/` for non-prefixed slugs
  - **gone**: previous-run live set minus current (state under `.next/indexnow-url-state.json`) ∪ `INDEXNOW_GONE_URLS` (comma-separated paths/URLs)
- Chunk batches of 100; POST to `{SITE_URL}/api/indexnow/` with `{ urls, action }`.
- Skip when `INDEXNOW_KEY` unset (exit 0).
- Live ping only when `VERCEL=1` or `INDEXNOW_PING=1`; otherwise dry-run log counts (no fake ok).
- Persist state after computing live URLs even on dry-run/skip-key so deletes detect next time.
- Never fail `build:ci` (exit 0 on network/upstream errors).

## Verify

- `pnpm build` in worktree
- Confirm sitemap static entries no longer use runtime `new Date()`
- Script dry-run logs update/redirect/gone counts without requiring live API

## Commits (atomic)

1. plan-seo-indexnow-deletes-redirects-i1
2. honest-sitemap-static-lastmod
3. harden-indexnow-api-host-action
4. extend-post-deploy-indexnow-updates-deletes-redirects
5. brief-indexnow-deletes-redirects-completeness
