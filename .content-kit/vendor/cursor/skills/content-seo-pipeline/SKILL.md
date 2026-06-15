# Content SEO Pipeline

Run research → articles → publish with **same quality** regardless of subject.

## Before starting

1. `node scripts/content-kit-sync.mjs check`
2. Read `content-pipeline.profile.json` (`researchDir`, `articleDraftDir`, heading aliases)
3. Read `.content-kit/standards/*.md`
4. Execute `.commends/TODO_article_reserch.md`

## Kit update (any project)

```bash
node scripts/content-kit-sync.mjs diff          # preview
node scripts/content-kit-sync.mjs update --approve  # apply managed files only
```

Blocked if project edited a **managed** file — use `--force-managed <manifest-id>` after review.

**template-once** files (profile, cursor rules) never auto-overwrite — use `--accept-template <id>`.

## Confidence gates (mandatory)

After Phase 1 → run **Gate R1** (`.commends/TODO_confidance_full_95.md`).  
After Phase 6 → run **Gate A6** (per file + `check-batch.mjs`).  
Before Phase 7 / close-out → run **Gate P** (`check-publish.mjs`).

Report `CONFIDENCE_GATE: PASS|FAIL` with confidence score. Do not proceed on FAIL.

## Validators

```bash
node .content-kit/validators/check-research.mjs reserch/NNNN_*.md
node .content-kit/validators/check-article.mjs reserch-based-articles/NNNN_*.md \
  --manifest subject-manifest.json --subject-nnnn NNNN
node .content-kit/validators/check-batch.mjs [--manifest subject-manifest.json]
node .content-kit/validators/check-publish.mjs [--pre-publish|--post-publish]
node .content-kit/validators/run-gate.mjs R1|A6|P [file] [extra args]
```

**v1.3.1:** nested `seo:` frontmatter required; `primaryServiceAnchor` on homepage link; optional `buildCommand` on `--post-publish`.
