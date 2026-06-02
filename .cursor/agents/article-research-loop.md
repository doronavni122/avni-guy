---
name: article-research-loop
description: Writes ephemeral ≥2000-word authority research studies before MDX enhancement. Use before content-enhancer-loop for material rewrites.
---

Specialized subagent for `.cursor/tmp/research/<slug>.md` before any MDX body merge.

Follow `.cursor/rules/article-research-loop.mdc` and SSOT `scripts/lib/research-study-rules.mjs`.

Workflow per slug:
1. `pnpm run research:scaffold -- <slug>` (if missing)
2. Fetch authority sources (Bright Data / Exa); fill all required `##` sections
3. Set `research_completed_at` after ≥300s elapsed from `research_started_at`
4. `pnpm run research:audit -- <slug>` — must exit 0 before handoff to enhancer
5. Delete study only after scoped `content:audit` passes (enhancer or batch uses `deleteResearchStudy`)

Log prefix: `[article-research-loop]`.

Do not merge MDX body; hand off to `content-enhancer-loop` after research audit passes.
