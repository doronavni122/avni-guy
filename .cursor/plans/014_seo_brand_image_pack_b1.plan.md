# Plan: brand-image-pack

ADR: none , (cite SSOT.md)

## Goal

Unique portrait + office raster assets under `public/images/shared/`; Person `ImageObject` (name/caption/alt = `גיא אבני עורך דין`); export image-rank panel constants for ops tracking.

## SSOT

- `SSOT.md` §A–E (static Next, verify via `pnpm build` / `pnpm dev` on :3001)
- `.cursor/rules/unique-site-images.mdc` — one file URL per placement; prefer new filenames
- `.cursor/rules/ssot-repo-structure.mdc` — `public/images/` shared brand assets; SEO in `src/lib/seo/`

## Exclusive files

- `public/images/shared/`
- `src/lib/seo/schema-person.ts`

## Non-goals

- No `/about/` page edits (parent-owned)
- No edits to `AttorneyCredentialBlock`, `metadata.ts`, OG fallback consumers
- No reuse of existing `og-law-fallback-photo-1` as the Person portrait placement
- No `task_graph.log` (orchestrator owns post-merge)

## Design

### 1. Assets (`public/images/shared/`)

- Add unique **portrait** JPEG: `guy-avni-avni-guy-law-firm-lawyer-brand-portrait-photo-2.jpg`
- Add unique **office** JPEG: `guy-avni-avni-guy-law-firm-lawyer-office-interior-photo-3.jpg`
- Collision-check basenames before write; run `node scripts/optimize-images.mjs` for WebP/AVIF siblings

### 2. Person ImageObject + rank panel (`schema-person.ts`)

- Replace bare URL `image` with `ImageObject` (url/contentUrl/name/caption/description; HE alt string `גיא אבני עורך דין`)
- Export `BRAND_IMAGE_RANK_PANEL` listing portrait + office paths + alt for image-search-rank-panel ops
- Export path constants so other scopes can adopt without colliding shared fallback
- Keep error logging on URL helpers

## Verify

- Basename uniqueness grep across `public/` + `src/`
- `pnpm build` then `pnpm dev` (port 3001) in worktree
- Confirm Person schema emits ImageObject with brand name string

## Commits (atomic)

1. plan-seo-brand-image-pack-b1
2. add-brand-portrait-and-office-shared-assets
3. wire-person-imageobject-and-rank-panel
4. brief-seo-brand-image-pack-b1
