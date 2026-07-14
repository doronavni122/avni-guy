# home-heroes-entity-role-split — firm portal vs person hub

ADR: none , cite SSOT.md

##todos
- [ ] Refine `/` hero eyebrow/subhead/keyword/intro to firm-portal role in `main-page-heroes.mjs`
- [ ] Keep `/` H1 firm/portal string; keep `/about/` person hub untouched
- [ ] Align home hero image alt/title in `loadHomeData.ts` to firm-portal keyword
- [ ] Validate home role ≠ about person-hub role (H1/eyebrow/keyword)
- [ ] Verify: `pnpm build` in worktree

## Goal
Align home hero copy/images/eyebrows to firm-portal vs person hub. Home already has portal title + demoted H1 — keep those; refine remaining hero fields so `/` reads as office portal and `/about/` remains person entity hub.

## Exclusive files
- `src/lib/seo/main-page-heroes.mjs`
- `src/lib/seo/main-page-heroes.ts` (re-export only; edit only if needed)
- `src/lib/home/loadHomeData.ts`

## Out of scope
- `src/app/page.tsx` metadata (already portal; home-title-brand-portal)
- `HomePage.tsx` / about page component wiring
- New image downloads (unique-site-images: alt/title framing only in exclusive files)

## Non-regression
- Exactly one H1 per page via MainPageHero
- `/about/` H1 stays `גיא אבני עורך דין`
- No em dash (U+2014) in new copy

## Verify
`pnpm build` in worktree `/Users/doronavni/avni-guy-wt-home-heroes-entity-role-split`
