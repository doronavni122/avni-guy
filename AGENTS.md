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
- Frontmatter must include SEO fields (title, description, metaTitle, metaDescription, mainKeyword).
- Use consistent heading hierarchy (`H1` from title, then `H2`/`H3` in body).

## Content SEO Kit (v1.3.1)
Research → draft articles → publish using the kit; quality law is stack-agnostic.

| Layer | Path |
|-------|------|
| Project profile | `content-pipeline.profile.json` |
| Kit install + lock | `.content-kit/` (standards, validators, schemas; vendor pinned copy) |
| Sync wrapper | `scripts/content-kit-sync.mjs` |
| Research drafts | `reserch/` (domain studies, not SERP reports) |
| Article drafts | `reserch-based-articles/` (pre-publish SEO blocks) |
| Pipeline commends | `.commends/TODO_article_reserch.md`, `.commends/TODO_reserch.md` |
| Standards | `.content-kit/standards/*.md` |
| Agent skill | `.cursor/skills/content-seo-pipeline/SKILL.md` |

**Before content pipeline work:** `node scripts/content-kit-sync.mjs check`; read profile + standards; execute `.commends/TODO_article_reserch.md`.

**Kit sync:**
```bash
node scripts/content-kit-sync.mjs check
node scripts/content-kit-sync.mjs diff
node scripts/content-kit-sync.mjs update --approve
```

**Validators:**
```bash
node .content-kit/validators/check-research.mjs reserch/NNNN_*.md
node .content-kit/validators/check-article.mjs reserch-based-articles/NNNN_*.md \
  --manifest article-slug-manifest.json --subject-nnnn NNNN
node .content-kit/validators/check-batch.mjs [--manifest article-slug-manifest.json]
node .content-kit/validators/check-publish.mjs [--pre-publish|--post-publish]
node .content-kit/validators/run-gate.mjs R1|A6|P [file] [extra args]
```

**Confidence gates:** R1 after research (`.commends/TODO_confidance_full_95.md`); A6 after link embed audit; P before publish. Do not proceed on FAIL.

**Publish (Phase 7):** copy validated draft from `reserch-based-articles/` → `src/content/blog/`; register in content registry / sitemap per existing Next.js wiring. Draft dirs stay local (gitignored).

## SEO Rules
- Always provide unique meta title and meta description per page (`buildPageMetadata` in `src/lib/metadata.ts`).
- Every page must declare a single primary keyword.
- Primary keyword must appear in the page `H1`.
- **Exactly one `<h1>` per page** (blog title via `BlogPostLayout`; MDX body must not start with `#`).
- **Main-menu pages** (`/`, `/about/`, `/services/`, `/blog/`, `/categories/`, `/tags/`, `/contact/`): hero copy lives in [`src/lib/seo/main-page-heroes.ts`](src/lib/seo/main-page-heroes.ts); render with [`MainPageHero`](src/components/seo/MainPageHero.tsx).
  - One intro **paragraph** directly under the H1: **130–200 words** (Hebrew word count via `countWordsHe` in [`src/lib/seo/hero-rules.ts`](src/lib/seo/hero-rules.ts)).
  - Intro must include at least one phrase from `SITE_KEYWORDS` in [`src/consts.ts`](src/consts.ts) in natural prose.
  - **Show, don't tell:** hero copy must not describe its own tone (e.g. meta phrases like `שפה ישירה`, `מגזינית`, `בגובה העיניים`). Conventions in [`src/lib/seo/main-page-style-rules.ts`](src/lib/seo/main-page-style-rules.ts).
  - **No generic/nav boilerplate** in H1 or intro (e.g. `רשימת מאמרים`, `בחירה מהירה לפי נושא`, `קטגוריות תוכן`, `תגיות תוכן`). Use concrete Hebrew, not index labels.
  - Good H1: *גיא אבני: כשצריך תוכן ברור וליווי משפטי בלי רעש*. Bad H1: *קטגוריות תוכן*.
- **Banned character:** never use the Unicode em dash (U+2014) anywhere in `src/`, `public/`, or content. Use hyphen `-`, colon `:`, or commas instead. See `BANNED_EM_DASH` in [`src/lib/seo/hero-rules.ts`](src/lib/seo/hero-rules.ts).
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
