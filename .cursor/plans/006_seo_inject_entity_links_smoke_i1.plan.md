# Plan: inject-entity-links-smoke

ADR: none , (cite SSOT.md)

## Goal

Validate runtime entity-hub link injection on blog posts: sample 3 posts for `href="/about/"` / markdown `](/about/)`; close when ≥2 anchors/post; redesign `injectEntityLinks` only when <1/post.

## SSOT

- `SSOT.md` — static Next, MDX blog, force-static
- Runtime inject: `src/lib/content/inject-entity-links.ts`
- Wire: `src/app/blog/[slug]/page.tsx` (`injectEntityLinks` after `bodyForRender`, before figures/MDX)
- Entity hub path: `/about/`

## Exclusive files

- `src/lib/content/inject-entity-links.ts` (edit only if smoke `<1` entity hub link/post)

## Non-goals

- No MDX rewrites under `src/content/blog/`
- No edits to HomePage, about page, schema fields
- No new npm dependencies

## Work

1. Sample 3 published slugs (runtime inject on MDX body + live HTML)
2. Count entity-hub anchors (`](/about/)` / `href="/about/"`)
3. If ≥2/post → document evidence in brief; no code change
4. If <1/post → redesign inject density in exclusive file only; re-smoke; `pnpm build`

## Verify

- Smoke evidence: ≥2 entity-hub links/post on sample (close gate)
- Non-regression: no git changes under `src/content/blog/`
- Build: required only if inject code changes

## Commits (atomic)

1. add-plan-inject-entity-links-smoke-i1
2. document-inject-entity-links-smoke-evidence (brief)
