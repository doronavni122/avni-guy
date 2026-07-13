# Article structure standard (kit law)

Source: `reserch/NNNN_*.md` → `reserch-based-articles/NNNN_*.md` → live publish path.

## Phase 2 — minimal clean

Remove only: checklist mapping blocks, confidence matrices, `.commends` meta, tool error logs, admin version tables.  
Keep: all findings, tables, protocols, citations.

## Phase 3 — add (no thinning)

- YAML frontmatter per `schemas/article-frontmatter.schema.json`
- TL;DR: 3–6 bullets + CTA to profile `primaryCta`
- Reader hook after executive summary
- FAQ: 5–6 Q&As from **existing** body content (`faqHeading` from profile)
- Temporary bottom links section (removed in Phase 5)

## Phase 4 — typography & titles

- Auto-replace `—` (U+2014) with `-` at publish and render via `adapters/shared/replace-em-dash.mjs` (see `standards/typography.md`)
- No `«` or `»` in live output (strip at render or in source)
- `#` / `##` / `###` titles: subject keyword present; update `seo.title` to match

## Phase 5–6 — links

See `standards/internal-linking.md`. Phase 6 is mandatory audit before publish.

## Validator

`node .content-kit/validators/check-article.mjs reserch-based-articles/<file>.md`
