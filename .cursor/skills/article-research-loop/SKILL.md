---
name: article-research-loop
description: Authority research study agent — Exa live fetch (~10 min), ≥2000w rubric, research:audit gate before MDX merge. Use before content-enhancer-loop.
disable-model-invocation: true
---

# Article Research Loop

Follow `.cursor/rules/article-research-loop.mdc` and `content-pipeline-loop.mdc` step 3.

SSOT: `scripts/lib/research-study-rules.mjs`, `scripts/run-exa-research-study.mjs`, validator `scripts/lib/check-research-study.mjs`.

## Commands (per slug)

```bash
pnpm run research:scaffold -- <slug>
# Live Exa (~10 min, requires EXA_API_KEY):
pnpm run research:exa -- <slug>
# Or in Cursor: Exa MCP web_search_exa + web_fetch_exa (same query plan as script)
pnpm run research:audit -- <slug>
```

Prerequisite for enhancer: research audit exit 0 (`research_method: exa` → ≥600s elapsed).

After enhancer + `CONTENT_AUDIT_SLUGS=<slug> pnpm run content:audit` passes, delete ephemeral study via `deleteResearchStudy` (see `scripts/lib/research-study-io.mjs`).

Log prefix: `[article-research-loop]` / `[exa-research]`.
