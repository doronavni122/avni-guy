# home-h1-demote-non-entity

ADR: none , (SSOT.md — one H1/page; entity hub `/about/`)

##todos
- [ ] Set `/` H1 in `src/lib/seo/main-page-heroes.mjs` (and `.ts` source if present) off exact `גיא אבני עורך דין`
- [ ] Keep `/about/` H1 = `גיא אבני עורך דין`
- [ ] Verify rendered H1s differ (G0)

## Goal
Home is firm/portal H1; about keeps lawyer-query H1.

## Files
- `src/lib/seo/main-page-heroes.mjs`
- `src/lib/seo/main-page-heroes.ts` (if authoritative)

## Verify
`pnpm build` or `build:ci`; spot-check heroes SSOT.
