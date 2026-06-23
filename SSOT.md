# SSOT: project requirements and agent handoff

This file is the **single source of truth** for non-code expectations (workflow, SEO, deployment). **Code behavior** remains authoritative in source files; this document lists what must stay true across changes.

---

## A. Product and stack

1. **Site type**: Hebrew-first static Next.js site; MDX blog; target ~20–40 articles.
2. **Rendering**: SSG via `generateStaticParams`; `export const dynamic = 'force-static'`.
3. **Stack**: Next.js 15+ App Router, MDX (`next-mdx-remote/rsc` + `gray-matter` / Zod), Tailwind CSS 4, shadcn/ui, path alias `@/*` → `src/*`.
4. **RTL**: Site assumes RTL (`dir="rtl"`).
5. **Package manager**: **pnpm** (`pnpm-lock.yaml`).

---

## B. Content (published)

1. **Articles**: `src/content/blog/`; schema in `src/lib/content/schema.ts` (do not change fields unless the task requires it).
2. **Frontmatter**: Required SEO fields per schema (`title`, `description`, `metaTitle`, `metaDescription`, `mainKeyword`, etc.).
3. **Headings**: Exactly one visible `H1` per page (layout/title); MDX body must not start with `#`.
4. **Taxonomy**: Categories/tags from content; routes consistent with `src/utils/content-taxonomy.ts`.

---

## C. Content SEO Kit (v1.3.1)

Kit-owned quality law; project wiring in `content-pipeline.profile.json` only.

1. **Profile SSOT**: `content-pipeline.profile.json` — `contentRoot`, `publishPrefix`, `researchDir` (`reserch/`), `articleDraftDir` (`reserch-based-articles/`), heading aliases, `subjectManifest`, `buildCommand`.
2. **Kit tree**: `.content-kit/` (standards, validators, schemas); sync via `scripts/content-kit-sync.mjs`.
3. **Pipeline entry**: `.commends/TODO_article_reserch.md` — explicit user instructions; research checklist `.commends/TODO_reserch.md`.
4. **Standards**: `.content-kit/standards/*.md` (research, article structure, SEO metadata, internal linking, confidence gate).
5. **Validators**: `.content-kit/validators/` — `check-research.mjs` (R1), `check-article.mjs` (A6), `check-batch.mjs`, `check-publish.mjs` (P), `run-gate.mjs`.
6. **Draft dirs**: local only (gitignored); publish copies validated drafts into `src/content/blog/` in Phase 7.
7. **Agent skill**: `.cursor/skills/content-seo-pipeline/SKILL.md`.

---

## D. SEO and metadata

1. **Uniqueness**: Distinct page `title` and meta description per route.
2. **Primary keyword**: Each page exposes a primary keyword; keyword in visible `H1` where applicable.
3. **Main-menu heroes** (`/`, `/about/`, `/services/`, `/blog/`, `/categories/`, `/tags/`, `/contact/`): `src/lib/seo/main-page-heroes.ts`; conventions in `hero-rules.ts`.
4. **Banned typography**: Unicode em dash (U+2014) forbidden in `src/`, `public/`, and content. Use `-`, `:`, or commas. See `BANNED_EM_DASH` in `hero-rules.ts`.
5. **Canonical**: `trailingSlash: true` in `next.config.ts`; `SITE_URL` in `src/consts.ts` matches sitemap/RSS/robots.
6. **Structured data**: `src/utils/structured-data.ts` for breadcrumbs and article JSON-LD.
7. **Media**: Optimized images; English keyword-oriented filenames for local assets; meaningful `alt` (and title where used).

---

## E. UI and design

1. Premium legal-grade UI; reuse `SiteShell`, `Header`, `Footer`, `src/components/ui/*`.
2. Container width (`max-w-6xl`), sticky header, mobile nav as client island only where needed.
3. No split/broken anchor tags across lines in prose.

---

## F. Engineering workflow (mandatory)

1. **Atomic commits**: One logical change per commit (when user requests commits).
2. **task_graph.log**: Append-only; one numbered line per committed change; format: `<n>. <task-id> , <files>`.
3. **Scope discipline**: Implement only what the task specifies.
4. **Verification**: `pnpm build` before considering work done; `pnpm run dev` on **http://localhost:3001/**.

---

## G. Documentation policy (default)

Do not add unsolicited reports or extra markdown unless the user explicitly asks. Exceptions: this `SSOT.md`, `task_graph.log`, and `.cursor/plans/*.plan.md` when requested.

---

## H. Handoff

- **Traceability**: latest entry in `task_graph.log`.
- **Published content**: `src/lib/content/schema.ts`, `src/lib/content/posts.ts`, `src/content/blog/`.
- **Content pipeline**: `content-pipeline.profile.json`, `.content-kit/standards/*.md`, `.commends/TODO_article_reserch.md`, `.cursor/skills/content-seo-pipeline/SKILL.md`.
