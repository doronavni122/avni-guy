# media-appearances-index — indexable /media/ route

ADR: none , cite SSOT.md

##todos
- [ ] Create `src/app/media/page.tsx` (Hebrew-first, SiteShell, appearances hub, no invented offsite URLs)
- [ ] Add `/media/` to `src/app/sitemap.ts` STATIC_PATH_LASTMOD
- [ ] Body links to `/about/`, `/blog/`, `/contact/`; defer about/nav/footer wiring (parent file_claim)
- [ ] Verify: `pnpm build` + `pnpm dev` in worktree

## Goal
Indexable `/media/` hub for media/appearances SERP surface: Hebrew trust copy, owned/earned appearance inventory (truthful only), JSON-LD, sitemap crawl entry. Do not invent press/podcast listing URLs.

## Exclusive files
- `src/app/media/`
- `src/app/sitemap.ts`

## Out of scope
- Edits to `/about/` (parent file_claim — wire link after merge)
- Footer / site-nav / layout (parent-claimed)
- MAIN_PAGE_HEROES registry (inline hero on page only)
- Fake earned-media URLs (ops logs when live)

## Verify
`pnpm build` then `pnpm dev` (port 3001 or free alt).
