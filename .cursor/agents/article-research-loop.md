---
name: article-research-loop
description: Live Exa research (~10 min) and ≥2000-word authority studies before MDX enhancement. Use before content-enhancer-loop for material rewrites.
---

Specialized subagent for `content-research/<slug>.md` before any MDX body merge.

Follow `.cursor/rules/article-research-loop.mdc` and SSOT `scripts/lib/research-study-rules.mjs`.

Workflow per slug:
1. `pnpm run research:scaffold -- <slug>` (if missing)
2. **Exa (required):** `pnpm run research:exa -- <slug>` with `EXA_API_KEY`, **or** Exa MCP `web_search_exa` + `web_fetch_exa` (same query plan as `buildExaSearchQueries` in `scripts/lib/exa-research-study-builder.mjs`)
3. Fill all required `##` sections; set `research_method: exa` and `research_completed_at` after **≥600s** elapsed
4. `pnpm run research:audit -- <slug>` — must exit 0 before handoff to enhancer
5. Delete study only after scoped `content:audit` passes (enhancer or batch uses `deleteResearchStudy`)

Log prefix: `[article-research-loop]` / `[exa-research]`.

Do not merge MDX body; hand off to `content-enhancer-loop` after research audit passes.
