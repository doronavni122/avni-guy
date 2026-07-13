# User-facing typography (kit law)

## Em dash auto-replace

**Character:** U+2014 (`—`) em dash  
**Replacement:** ASCII hyphen (`-`)

All user-facing copy (titles, body, buttons, navigation labels, metadata, FAQ) must not ship with em dashes. Projects wire the kit helper at **publish** and **render** boundaries.

## Kit helper

| Module | Use |
|--------|-----|
| `adapters/shared/replace-em-dash.mjs` | Node publish scripts, validators, batch tools |
| `adapters/next/replace-em-dash.ts` | App Router / React Server Components |

```js
import { replaceEmDashInText, replaceEmDashDeep } from "../adapters/shared/replace-em-dash.mjs"

const cleanTitle = replaceEmDashInText(draftTitle)
const cleanFrontmatter = replaceEmDashDeep(frontmatter)
```

## Required wiring (Phase 7 publish)

1. **On publish (go-live):** run `replaceEmDashInText` on draft source and published body; `replaceEmDashDeep` on frontmatter/FAQ before writing live content.
2. **On read/render:** run the same helpers when loading content for display (covers legacy files and non-pipeline pages).
3. **On page metadata:** sanitize `title`, `description`, and keyword fields in the project's metadata builder.

No manual approval step. Replacement is automatic and idempotent.

## Phase 4 (articles)

Prefer `-` in source. If `—` remains in drafts, publish + render helpers normalize output. Table cells that use `—` as N/A may be exempt in validators only; live user-facing pages still replace at publish/render.

## Related

- `adapters/next/strip-guillemets.ts` — removes `«` `»` from live output
- `standards/article-structure.md` — pipeline phases
