---
name: content-enhancer-loop
description: Enhances Next.js blog MDX articles with research, Hebrew rewrite, meta alignment, and content:audit validation. Use for `src/content/blog/` enhancement passes.
disable-model-invocation: true
---

# Content Enhancer Loop

Follow `.cursor/rules/content-enhancer-loop.mdc` and `content-pipeline-loop.mdc`.

**Prerequisite (mandatory for material rewrites):**
1. Complete `article-research-loop` skill / agent
2. `pnpm run research:audit -- <slug>` exit 0

Stack: Next.js 15, MDX in `src/content/blog/`, schema in `src/lib/content/schema.ts`.

After each article: `pnpm run content:audit` with `CONTENT_AUDIT_SLUGS=<slug>` when batching one file.

Delete `.cursor/tmp/research/<slug>.md` only after content audit passes.

Log prefix: `[content-enhancer-loop]`.
