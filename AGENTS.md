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

## Content Workflow
- Store articles in `src/content/blog/`.
- Schema: `src/lib/content/schema.ts` (ported from former Astro collection).
- Frontmatter must include SEO fields (title, description, metaTitle, metaDescription, mainKeyword).
- Use consistent heading hierarchy (`H1` from title, then `H2`/`H3` in body).
- Include meaningful internal links to site pages, tags, categories, and related articles.

## SEO Rules
- Always provide unique meta title and meta description per page (`buildPageMetadata` in `src/lib/metadata.ts`).
- Every page must declare a single primary keyword.
- Primary keyword must appear in the page `H1`.
- Keep canonical links correct (`trailingSlash: true` in `next.config.ts`).
- Global JSON-LD: `Organization` + `WebSite` in `SiteShell`; per-page breadcrumbs / `BlogPosting` / `FAQPage` as appropriate.
- Preserve `public/robots.txt`, `public/llms.txt`, `app/sitemap.ts`, `app/rss.xml/route.ts`.

## Media Rules
- Use optimized images with descriptive alt text and title text.
- Keep file names in English and keyword-oriented when local assets are used.
- External blog images may use plain `<img>` with full URLs; local assets may use `next/image`.

## Next.js Practices
- Keep imports at top of file.
- Prefer Server Components; use `'use client'` only for interactive UI (mobile nav, sheets).
- Reuse `SiteShell`, `BlogPostLayout`, and shared SEO helpers.
- Run `pnpm run seo:guardrails` after SEO-related changes.

## Deployment
- Deploy with Vercel (`framework: nextjs` in `vercel.json`).
- Verify build output, metadata, sitemap, and crawlability post-deploy.
