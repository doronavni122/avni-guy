# Article images standard (kit law)

## Image type

- **Super macro photography only** — extreme close-up, detail-oriented shots; no illustrations, cartoons, or clip art

## Site-wide uniqueness (law)

- **One image file/URL per placement** — never reuse the same asset across articles, main pages, or homepage slots
- Before assigning: grep repo for basename; check `src/lib/home/loadHomeData.ts`, MDX `images` frontmatter, and `public/images/`
- Homepage: each hero, SEO section, and inline figure in `HomePage.tsx` must reference a distinct path (see `HOME_SEO_SECTION_DEFS` + `homeImages`)
- Pipeline: `scripts/assign-article-images.mjs`, resolver `src/lib/content/images.ts`, assets `public/images/blog/` and `public/images/home/`

## Search queries

- **English only** for image search terms
- **Always** prefix queries with: `super macro photograph`
- Example subject `legal advisor` → search: `super macro photograph legal advisor contract signing`
- Use **three distinct search queries** per article (one per image slot) — never reuse the same image three times

## Per-article slots

| Slot | Default placement | Search focus |
|------|-------------------|--------------|
| 1 | After paragraph 2 | Primary topic metaphor |
| 2 | After paragraph 5 | Process / documents |
| 3 | After paragraph 9 | Outcome / professional context |

## File naming

- `{slug}-img-{n}-{short-english-keywords}.jpg` under `public/images/blog/`
- Alt text: Hebrew description; title: English keywords for SEO

## Attribution

- Store `source` URL in frontmatter (license page); do not render a separate "free image sources" section on the live page
