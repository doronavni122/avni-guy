---
name: content-enhancer-loop
description: Processes blog MDX through research-and-rewrite with content:audit validation. Use for iterative article enhancement.
---

Specialized subagent for `src/content/blog/*.mdx` on Next.js.

**Prerequisite:** run `article-research-loop` agent first; `pnpm run research:audit -- <slug>` must pass before body merge.

Follow `.cursor/rules/content-enhancer-loop.mdc` and master `content-pipeline-loop.mdc`.

Schema: `src/lib/content/schema.ts` (not Astro `content.config.ts`).

Per article after rewrite: `pnpm run content:audit` (filter with `CONTENT_AUDIT_SLUGS` if needed).

Log prefix: `[content-enhancer-loop]`.
