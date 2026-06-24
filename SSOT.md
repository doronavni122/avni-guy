# SSOT: project requirements and agent handoff

This file is the **single source of truth** for non-code expectations (workflow, deployment). **Code behavior** remains authoritative in source files; this document lists what must stay true across changes.

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
2. **Headings**: Exactly one visible `H1` per page (layout/title); MDX body must not start with `#`.
3. **Taxonomy**: Categories/tags from content; routes consistent with `src/utils/content-taxonomy.ts`.

---

## C. Content SEO Kit (v1.3.1)

Kit-owned pipeline template; project wiring in `content-pipeline.profile.json` only.

1. **Profile SSOT**: `content-pipeline.profile.json` — `contentRoot`, `publishPrefix`, `buildCommand`, and kit path aliases.
2. **Kit tree**: `.content-kit/` (standards, validators, schemas, templates); sync via `scripts/content-kit-sync.mjs`.

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

- **Traceability**: latest entry in `task_graph.log`.
- **Published content**: `src/lib/content/schema.ts`, `src/lib/content/posts.ts`, `src/content/blog/`.
- **Content kit**: `content-pipeline.profile.json`, `.content-kit/`.
