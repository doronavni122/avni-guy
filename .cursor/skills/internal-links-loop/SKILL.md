---
name: internal-links-loop
description: Runs a strict queue-based loop to add internal links to blog articles with paragraph-only hyperlink placement, minimum link count, and per-article uniqueness constraints for link text and target paths. Use when asked to perform iterative internal-link optimization across `src/content/blog/`.
disable-model-invocation: true
---

# Internal Links Loop

## Instructions

Execute all steps in order with explicit step-level error logging.

1. Build `temp_internal_links_checklist.txt`:
   - Include only article paths, one per line, format `- [ ] <path>`.
   - No extra prose in file.
2. Select the first unchecked article.
3. Collect internal destination candidates from pages/articles/tags/categories.
4. Insert links only in paragraph hypertext (not headings/titles/buttons).
5. Ensure the article has at least 10 internal links.
6. Ensure every link uses unique hypertext within the article.
7. Ensure every link target path is unique within the article.
8. Exclude button links from the required count.
9. Run `pnpm dev` (Node 22+) and review the live page for that article.
10. Mark processed article as done (`- [x] <path>`).
11. Repeat until all lines are checked.

## Constraints

- Do not change unrelated files.
- Do not modify schema fields or keys.
- Keep frontmatter valid per `src/content.config.ts`.
- Keep links internal and relevant.
- Keep the process atomic and traceable.
