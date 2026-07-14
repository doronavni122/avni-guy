# editorial-policy-page — public methodology page

ADR: none , cite SSOT.md

##todos
- [x] Create `src/app/editorial-policy/page.tsx` (Hebrew-first, SiteShell, review process, bar affiliation, disclaimer)
- [x] Add `/editorial-policy/` to `src/app/sitemap.ts` STATIC_PATHS
- [x] Body links to `/about/`, `/blog/`, `/contact/`; note parent must wire about/footer nav after P0
- [x] Verify: `pnpm build` + `pnpm dev` in worktree

## Goal
Public methodology/editorial-policy URL for YMYL trust signals: how content is researched/reviewed, Israel Bar affiliation, and clear non-advice disclaimer. Sitemap inclusion for crawl.

## Exclusive files
- `src/app/editorial-policy/`
- `src/app/sitemap.ts`

## Out of scope
- Footer / site-nav / layout (parent-claimed)
- Edits to `/about/` page (orchestrator wires link after merge)
- MAIN_PAGE_HEROES registry (inline hero on page only)

## Verify
`pnpm build` then `pnpm dev` (port 3001 or free alt).
