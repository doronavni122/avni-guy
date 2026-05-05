---
name: content-enhancer-loop
description: Enhances Astro blog articles in a strict queue-based loop with research, Hebrew translation, SEO-safe title upgrades, live-page review, and checklist progress tracking. Use when asked to run iterative content enhancement across `src/content/blog/`.
disable-model-invocation: true
---

# Content Enhancer Loop

## Instructions

Execute all steps in order with explicit step-level error logging.

1. Build `temp_articles_checklist.txt`:
   - Include only article paths, one per line, format `- [ ] <path>`.
   - No extra prose in file.
2. Select the first unchecked article.
3. Upgrade title quality while preserving SEO keyword rules and schema compatibility.
4. Run deep research for the article subject and save findings in a temp `.md` file.
5. Translate the temp research file to Hebrew.
6. Push translated findings into the selected article as the new content.
7. Run `pnpm dev` (Node 22+) and review the live page for that article.
8. Remove unrelated links and normalize formatting to site style.
9. Mark processed article as done (`- [x] <path>`).
10. Repeat until all lines are checked.

## Constraints

- Do not change unrelated files.
- Do not modify schema fields or keys.
- Keep frontmatter valid per `src/content.config.ts`.
- Keep internal links meaningful and relevant.
- Keep the process atomic and traceable.
