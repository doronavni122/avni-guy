# non-commodity-ymyl-originals — claim→evidence YMYL refresh

ADR: none , cite SSOT.md

##todos
- [x] Select 3 high-value YMYL cluster posts (contractor checklist, capital-gains single-apt exemption, deposit return)
- [x] Rewrite claim→evidence bodies + primary gov/nevo cites; dated updatedDate; strip template/FAQ theater on rewritten posts
- [x] Fix clear unsafe brand stuffing (brand-as-mainKeyword + brand-prefix metaTitle on selected posts; strip body brand-repeat spam)
- [x] Gate corpus-wide brand-prefix metaTitle removal on CTR audit (no invented metrics)
- [x] Verify: `pnpm build` in worktree
- [x] Brief: `notes/implementations/011_seo_non_commodity_ymyl_originals_n1_brief.txt`

## Goal
Maps-005 non-commodity-ymyl-originals: refresh claim→evidence YMYL originals; stop brand-prefix title spam only where clearly unsafe / after CTR gate.

## Exclusive files
- `src/content/blog/`

## Out of scope / non-regression
- No mass MDX entity-link `/about/` rewrites (runtime inject only)
- No Globes rebuttal pages
- No FAQ schema theater (real FAQs only; prefer substantive answers)
- No corpus-wide metaTitle strip without CTR evidence

## Selected posts
1. `buying-from-contractor-checklist.mdx` — template dump → checklist with gov cites
2. `capital-gains-exemption-single-apartment-2026.mdx` — brand H2 spam → claim→evidence tax
3. `landlord-security-deposit-return.mdx` — already solid; fix keyword/meta + dedupe fluff

## Brand-prefix CTR gate
Corpus ~134 posts use `metaTitle: גיא אבני… | topic`. Without GSC/CTR, do **not** mass-remove. On selected posts only: topic-first metaTitle + brand **suffix**; `mainKeyword` = intent keyword from `SITE_KEYWORDS_BATCH`.

## Verify
`pnpm build` in worktree after content changes.
