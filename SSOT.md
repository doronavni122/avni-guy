# SSOT: project requirements and agent handoff

This file is the **single source of truth** for non-code expectations (workflow, SEO, deployment). **Code behavior** remains authoritative in source files; this document lists what must stay true across changes.

**Article pipeline quality** is **not** defined here. It lives only in code: `scripts/lib/article-pipeline-contract.mjs` (see plan `.cursor/plans/001_article_pipeline_study_anchors_8f2c1a4b.plan.md`).

---

## A. Product and stack

1. **Site type**: Hebrew-first static Next.js site; MDX blog; target ~20–40 articles.
2. **Rendering**: SSG via `generateStaticParams`; `export const dynamic = 'force-static'`.
3. **Stack**: Next.js 15+ App Router, MDX (`next-mdx-remote/rsc` + `gray-matter` / Zod), Tailwind CSS 4, shadcn/ui, path alias `@/*` → `src/*`.
4. **RTL**: Site assumes RTL (`dir="rtl"`).
5. **Package manager**: **pnpm** (`pnpm-lock.yaml`).

---

## B. Content (minimal)

1. **Articles**: `src/content/blog/`; schema in `src/lib/content/schema.ts` (do not change fields unless the task requires it).
2. **Frontmatter**: Required SEO fields per schema (`title`, `description`, `metaTitle`, `metaDescription`, `mainKeyword`, etc.).
3. **Headings**: Exactly one visible `H1` per page (layout/title); MDX body must not start with `#`.
4. **Taxonomy**: Categories/tags from content; routes consistent with `src/utils/content-taxonomy.ts`.
5. **Pipeline entry**: `pnpm run article:pipeline -- <slug>` - all article quality gates enforced in code + audits, not Cursor rules.

---

## C. SEO and metadata

1. **Uniqueness**: Distinct page `title` and meta description per route.
2. **Primary keyword**: Each page exposes a primary keyword; keyword in visible `H1` where applicable.
3. **Main-menu heroes** (`/`, `/about/`, `/services/`, `/blog/`, `/categories/`, `/tags/`, `/contact/`): `src/lib/seo/main-page-heroes.ts`; validated by `hero-rules.ts` and `pnpm run seo:guardrails`.
4. **Banned typography**: Unicode em dash (U+2014) forbidden in `src/`, `public/`, and content. Use `-`, `:`, or commas. Checked in `seo:guardrails`.
5. **Canonical**: `trailingSlash: true` in `next.config.ts`; `SITE_URL` in `src/consts.ts` matches sitemap/RSS/robots.
6. **Structured data**: `src/utils/structured-data.ts` for breadcrumbs and article JSON-LD.
7. **Media**: Optimized images; English keyword-oriented filenames for local assets; meaningful `alt` (and title where used).

---

## D. UI and design

1. Premium legal-grade UI; reuse `SiteShell`, `Header`, `Footer`, `src/components/ui/*`.
2. Container width (`max-w-6xl`), sticky header, mobile nav as client island only where needed.
3. No split/broken anchor tags across lines in prose.

---

## E. Engineering workflow (mandatory)

1. **Atomic commits**: One logical change per commit (when user requests commits).
2. **task_graph.log**: Append-only; one numbered line per committed change; format: `<n>. <task-id> , <files>`.
3. **Scope discipline**: Implement only what the task specifies.
4. **Verification**: `pnpm build` before considering work done; `pnpm run dev` on **http://localhost:3001/**.

---

## F. Documentation policy (default)

Do not add unsolicited reports or extra markdown unless the user explicitly asks. Exceptions: this `SSOT.md`, `task_graph.log`, and `.cursor/plans/*.plan.md` when requested.

---

## G. Handoff

- **Article quality contract**: implement per `.cursor/plans/001_article_pipeline_study_anchors_8f2c1a4b.plan.md`; code SSOT `scripts/lib/article-pipeline-contract.mjs`.
- **Traceability**: latest entry in `task_graph.log`.
- **First files for article work**: `scripts/run-article-pipeline.mjs`, `scripts/lib/article-pipeline-contract.mjs`, `scripts/lib/apply-research-to-mdx.mjs`, `scripts/lib/check-article-content.mjs`, `scripts/lib/research-study-rules.mjs`.
