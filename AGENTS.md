# AGENTS.md - Hebrew Astro Content Site

## Project Type
- Small static Astro content site (Hebrew-first) with MDX content collections.
- Target scale: 20-40 articles.
- Default rendering mode: static, with islands only when strictly necessary.

## Core Stack
- Astro (static output)
- MDX + content collections
- Minimal client-side JS

## Content Workflow
- Store articles in `src/content/blog/`.
- Every article must follow the collection schema in `src/content.config.ts`.
- Frontmatter must include SEO fields (title, description, metaTitle, metaDescription, mainKeyword).
- Use consistent heading hierarchy (`H1` from title, then `H2`/`H3` in body).
- Include meaningful internal links to site pages, tags, categories, and related articles.

## SEO Rules
- Always provide unique `meta title` and `meta description` per page.
- Every page must declare a single primary keyword.
- Primary keyword must appear in the page `H1`.
- Keep canonical links correct.
- Include structured data where relevant (WebSite/Organization/Article).
- Optimize for Core Web Vitals (especially LCP) and fast static delivery.

## Media Rules
- Use optimized images with descriptive alt text and title text.
- Keep file names in English and keyword-oriented when local assets are used.
- Avoid heavy assets and unnecessary media payloads.

## Astro Best Practices
- Keep imports at top of file.
- Prefer server-side static generation and simple components.
- Reuse shared layout/head components.
- Keep CSS simple and readable.

## Deployment
- Deploy with Vercel CLI.
- Verify build output, metadata, sitemap, and crawlability post-deploy.
