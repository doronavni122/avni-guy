# AGENTS.md - Hebrew Next.js Content Site

## Project Type
- Small static Next.js App Router site (Hebrew-first) with MDX blog content.
- Target scale: 20-40 articles.
- Default rendering: SSG via `generateStaticParams` and `export const dynamic = 'force-static'`.

## Core Stack
- Next.js 15+ (App Router)
- MDX via `next-mdx-remote/rsc` + `gray-matter` / Zod validation
- Tailwind CSS 4 + shadcn/ui (React Server Components where possible)
- Vercel deployment

## Content Workflow (published)
- Store live articles in `src/content/blog/`.
- Schema: `src/lib/content/schema.ts`.
- Use consistent heading hierarchy (`H1` from title, then `H2`/`H3` in body).

## Content SEO Kit (v1.3.1)
Template pipeline and validators live in `.content-kit/`. Project wiring: `content-pipeline.profile.json`. Sync wrapper: `scripts/content-kit-sync.mjs`.

```bash
node scripts/content-kit-sync.mjs check
node scripts/content-kit-sync.mjs diff
node scripts/content-kit-sync.mjs update --approve
```

## Media Rules
- Use optimized images with descriptive alt text and title text.
- Keep file names in English and keyword-oriented when local assets are used.
- External blog images may use plain `<img>` with full URLs; local assets may use `next/image`.

## Next.js Practices
- Keep imports at top of file.
- Prefer Server Components; use `'use client'` only for interactive UI (mobile nav, sheets).
- Reuse `SiteShell`, `BlogPostLayout`, and shared layout helpers.

## Deployment
- Deploy with Vercel (`framework: nextjs` in `vercel.json`).
- Verify build output, metadata, sitemap, and crawlability post-deploy.

## Local development
- Dev server: `pnpm run dev` → **http://localhost:3001/** (port 3001 is pinned; do not use `:3000` if another app occupies it).
- CMS local editing: `pnpm run cms:dev` (Keystatic with `KEYSTATIC_STORAGE_KIND=local`).
- Pre-flight: `pnpm run build:ci` before merge.

## Keystatic (GitHub mode on Vercel)
When `KEYSTATIC_STORAGE_KIND=github`, set:
- `KEYSTATIC_GITHUB_REPO` (`owner/repo`)
- `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` (OAuth app per Keystatic docs)
