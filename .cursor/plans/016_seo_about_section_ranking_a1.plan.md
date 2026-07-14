# about-section-ranking-surface — stable about section ids + inbound anchors

ADR: none , cite SSOT.md

##todos
- [x] Add stable HTML section ids on `/about/` (`person`, `practice`, `audience`, `workflow`, `principles`, `faq`, `entity`) matching inbound `#person`
- [x] Strengthen visible section content on those surfaces (no new thin entity URLs)
- [x] Export about fragment href SSOT in `homeSeoSections.ts`; wire query-bearing inbound from `HomePage.tsx`
- [x] Verify: `pnpm build` in worktree; no Globes pages; no FAQ schema theater; no MDX entity-link rewrites

## Goal
Make `/about/` a durable entity ranking surface: HTML fragment ids match schema/inbound (`/about/#person`), sections are query-bearing and content-rich, home links to fragments with brand/lawyer anchor text. Prefer home inbound; services deferred (not exclusive).

## Exclusive files
- `src/app/about/page.tsx`
- `src/components/home/HomePage.tsx`
- `src/lib/home/homeSeoSections.ts`

## Out of scope
- New entity URLs (`/guy-avni/`, Globes scrapes)
- MDX blog rewrites / `inject-entity-links` changes
- FAQ schema expansion (keep existing visible FAQ; no new theater)
- `src/app/services/` (parent merge / later inbound)
- `AttorneyCredentialBlock.tsx` edits (wrap `id="person"` from about page)

## Non-regression
- No Globes pages
- No FAQ schema theater
- No MDX blog entity-link source rewrites

## Verify
`pnpm build` in worktree `/Users/doronavni/avni-guy-wt-about-section-ranking-surface`
