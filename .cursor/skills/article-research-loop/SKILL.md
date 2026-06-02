---
name: article-research-loop
description: Authority research study agent — scaffold, fetch, ≥2000w rubric, research:audit gate before MDX merge. Use before content-enhancer-loop.
disable-model-invocation: true
---

# Article Research Loop

Follow `.cursor/rules/article-research-loop.mdc` and `content-pipeline-loop.mdc` step 3.

SSOT: `scripts/lib/research-study-rules.mjs`, validator `scripts/lib/check-research-study.mjs`.

## Commands (per slug)

```bash
pnpm run research:scaffold -- <slug>
# ... agent completes study in .cursor/tmp/research/<slug>.md ...
pnpm run research:audit -- <slug>
```

Prerequisite for enhancer: research audit exit 0.

After enhancer + `CONTENT_AUDIT_SLUGS=<slug> pnpm run content:audit` passes, delete ephemeral study via `deleteResearchStudy` (see `scripts/lib/research-study-io.mjs`).

Log prefix: `[article-research-loop]`.
