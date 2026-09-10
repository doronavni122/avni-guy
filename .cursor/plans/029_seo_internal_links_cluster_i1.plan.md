# Plan: internal-links-cluster

ADR: none , (cite SSOT.md + tmp/internal-linking-strategy-sep-2026.txt Gate P)

## Goal

Ship the locked Sep 2026 internal-link first+second pass: hub↔spoke MDX, homepage/category quarantine cleanup, related-posts seed, disable runtime /about/ inject, breadcrumb index gate.

## SSOT

- `.content-kit/standards/internal-linking.md`
- `src/lib/seo/indexation.ts`
- `tmp/internal-linking-strategy-sep-2026.txt` (Gate P PASS 0.97)

## Exclusive files (by scope)

- cluster-mdx-graph: six `src/content/blog/*.mdx` Sep 10
- homepage-quarantine-swap: HomePage.tsx, HomeSeoContentSections.tsx, loadHomeData.ts
- category-hub-pillarlinks: category-hub-intros.ts
- related-posts-seed: related-posts.ts
- disable-entity-inject: inject-entity-links.ts
- breadcrumb-index-gate: src/app/blog/[slug]/page.tsx

## Non-goals

- real-estate-law ranking hub
- mass contentType backfill
- kit 1.4.1 force-managed sync
- dual pillars

## Verify

- pnpm build
- pnpm dev on :3001
- 44M has ≥2 in-body inbounds from hubs
- Home does not href quarantined slugs
