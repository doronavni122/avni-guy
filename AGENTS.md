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
- **Exactly one `<h1>` per page** (blog title via `BlogPostLayout`; MDX body must not start with `#`).
- **Main-menu pages** (`/`, `/about/`, `/services/`, `/blog/`, `/categories/`, `/tags/`, `/contact/`): hero copy lives in [`src/lib/seo/main-page-heroes.ts`](src/lib/seo/main-page-heroes.ts); render with [`MainPageHero`](src/components/seo/MainPageHero.tsx).
  - One intro **paragraph** directly under the H1: **130–200 words** (Hebrew word count via `countWordsHe` in [`src/lib/seo/hero-rules.ts`](src/lib/seo/hero-rules.ts)).
  - Intro must include at least one phrase from `SITE_KEYWORDS` in [`src/consts.ts`](src/consts.ts) in natural prose.
  - **No generic/nav boilerplate** in H1 or intro (e.g. `רשימת מאמרים`, `בחירה מהירה לפי נושא`, `קטגוריות תוכן`, `תגיות תוכן`). Use magazine-style, concrete Hebrew — not index labels.
  - Good H1: *גיא אבני — כשצריך תוכן ברור וליווי משפטי בלי רעש*. Bad H1: *קטגוריות תוכן*.
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
