# Plan: thin-practice-landings consolidate

ADR: none , (routing/canonical; SSOT.md App Router + vercel redirects)

## Decision

**Consolidate / 301** — no unique expert depth to add without inventing experience. Prefer 301 into `/services/` per 008 + 007 P0.1.

## Goal

Dispose thin doorway URLs `/nedlan-lawyer-guy-avni/` and `/contracts-lawyer-guy-avni/` (MainW ~74–79, 0 H2). No thin live indexable pages remain.

## Changes

1. `vercel.json` permanent redirects both paths → `/services/`
2. Replace App Router pages with `permanentRedirect('/services/')` (build-time / runtime safety)
3. Remove both paths from `sitemap.ts` STATIC_PATH_LASTMOD
4. Rewire internal links: `services/page.tsx`, `about/page.tsx` → categories (`/categories/tax/`, `/categories/real-estate/`, `/categories/contracts/`)
5. Clear or deprecate `PRACTICE_BRIDGE_PAGES` entries once routes no longer render content
6. Middleware optional path redirects (same destinations)

## Non-goals

- Writing new long-form practice guides
- Inventing first-hand case narratives

## Verify

- Build + dev :3001
- Local `/nedlan-lawyer-guy-avni/` and `/contracts-lawyer-guy-avni/` → 308/301 to `/services/`
- Sitemap omits both URLs
- No remaining internal href to thin paths (except redirect sources)

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| Thin landings finding | 006/007 MainW 74–79, 0 H2 | 0.99 |
| Prefer consolidate | 008 decision + user prompt | 0.99 |
| Redirects ship | vercel.json + permanentRedirect pages | 0.99 |

**Outcome:** PASS conf>0.95
