# sheelot-paa-factory — HE PAA Q&A landing

ADR: none , cite SSOT.md

##todos
- [x] Create `src/app/sheelot/page.tsx` — H1 hub, one H2 per HE PAA question, visible HE answers
- [x] Emit FAQPage JSON-LD via `buildFaqSchema` with text identical to visible Q&A
- [x] Add `/sheelot/` to `src/app/sitemap.ts` STATIC_PATHS
- [x] Verify: `pnpm build` (+ optional `pnpm dev` on free port)
- [x] Brief: IndexNow ping for `/sheelot/` is post-deploy ops (do not invent ping success)

## Goal
Dedicated `/sheelot/` surface for People-Also-Ask style Hebrew questions: each question is an H2, answers are visible, FAQPage schema matches visible text, sitemap inclusion for crawl. IndexNow is ops-after-deploy only.

## Exclusive files
- `src/app/sheelot/`
- `src/app/sitemap.ts`

## Out of scope / non-regression
- No new FAQ schema theater on brand pages (`/about/`, home)
- No Globes rebuttal content
- No MDX blog rewrites
- No edits to `scripts/post-deploy-indexnow.mjs` (note path for ops in brief)

## SSOT
- `SSOT.md` — Hebrew-first static Next, one H1/page, force-static
- Reuse SiteShell, buildFaqSchema, buildPageMetadata patterns from editorial-policy/services

## Verify
`pnpm build` in worktree; optional `pnpm dev` on free port if 3001 busy.
