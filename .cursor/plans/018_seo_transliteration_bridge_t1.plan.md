# transliteration-bridge-routes — Latin entity card bridge

ADR: none , cite SSOT.md

##todos
- [ ] Create `src/app/guy-avni/page.tsx` — Hebrew-first entity card (not thin spam; not full /about/ clone)
- [ ] Primary CTA + schema `mainEntity` → `/about/`; practice links → services/blog/contact
- [ ] Add `/guy-avni/` to `src/app/sitemap.ts` STATIC_PATH_LASTMOD
- [ ] Decide HE unicode: skip `/גיא-אבני/` (ASCII bridge sufficient; `/about/` owns HE brand queries)
- [ ] Verify: `pnpm build` in worktree

## Goal
Indexable Latin transliteration bridge `/guy-avni/` for “guy avni” / Latin SERP demand. Short real entity card that clarifies identity (גיא אבני עורך דין) and routes readers to canonical entity home `/about/`. Sitemap inclusion.

## Route decision (005)
| Path | Ship? | Rationale |
|------|-------|-----------|
| `/guy-avni/` | yes | Exclusive dir; Latin transliteration bridge |
| `/גיא-אבני/` | no | Optional only; fragile unicode App Router folder; HE brand already owned by `/about/` |

## Exclusive files
- `src/app/guy-avni/`
- `src/app/sitemap.ts`

## Out of scope
- Nav/footer/layout wiring (parent after merge)
- Edits to `/about/`
- MAIN_PAGE_HEROES registry (inline hero on page)
- HE unicode route folder
- `task_graph.log` (orchestrator post-merge)

## Card content requirements (anti-thin)
- Visible H1, short bio, practice areas, FAQ (3–4), credential block reuse
- Explicit link to `/about/` as entity home
- Self-canonical `/guy-avni/`; Person `@id` points to `/about/#person`
- `force-static`; SiteShell; error logging on page data assembly if any

## Verify
`pnpm build` in worktree (hard gate). Dev optional if build pass.
