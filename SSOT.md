# SSOT — project requirements and agent handoff

This file is the **single source of truth** for non-code expectations (workflow, SEO, content, deployment). **Code behavior** remains authoritative in source files; this document lists what must stay true across changes.

---

## A. Product and stack

1. **Site type**: Hebrew-first static Astro site; MDX + content collections; target ~20–40 articles.
2. **Rendering**: Static output by default; React **islands only** where interactivity is needed (keep JS minimal).
3. **Stack (current)**: Astro, MDX, Tailwind v4 (`@tailwindcss/vite`), React (`@astrojs/react`), shadcn-style UI under `src/components/ui/`, utilities in `src/lib/utils.ts`, path alias `@/*` → `src/*`.
4. **RTL**: Site and shadcn config assume RTL (`dir="rtl"` / `components.json` rtl as configured).
5. **Package manager**: Prefer **pnpm** (project uses `pnpm-lock.yaml`).

---

## B. Content and schema

1. **Articles**: Live under `src/content/blog/`; must satisfy `src/content.config.ts` (do not change schema fields unless the task explicitly requires it).
2. **Frontmatter**: Include required SEO fields per schema (e.g. title, description, meta fields, main keyword as defined in code).
3. **Headings**: Exactly one visible `H1` per page (from layout/title where applicable); sensible `H2`/`H3` in body. MDX articles must not add a second `#` title.
4. **Main-menu heroes** (`/`, `/about/`, `/services/`, `/blog/`, `/categories/`, `/tags/`, `/contact/`): SSOT in `src/lib/seo/main-page-heroes.ts`; validated by `src/lib/seo/hero-rules.ts` and `pnpm run seo:guardrails`.
   - Intro paragraph under H1: **130–200 Hebrew words**, includes a `SITE_KEYWORDS` phrase naturally, magazine-style (no generic index copy — see `GENERIC_HERO_BLOCKLIST` in hero-rules).
5. **Internal linking**: Articles and listing pages should link to services, about, contact, blog, categories, tags, and related posts where it helps readers.
   - For internal-link loop passes, every article must include **at least 10 internal links**.
   - Links used for the quota must be **paragraph hypertext only** (no title/heading/formatted container links for quota).
   - **Buttons do not count** toward the internal-link quota.
   - Per article, hyperlink text must be **unique** (no repeated anchor text).
   - Per article, each link must point to a **different internal path** (no duplicate destinations in the same article).
   - Allowed targets are internal **pages, articles, tags, and categories**.
6. **Taxonomy**: Categories/tags driven from content; listing pages under `/categories`, `/tags` and dynamic routes must stay consistent with `src/utils/content-taxonomy.ts`.

---

## C. SEO and metadata

1. **Uniqueness**: Distinct page `title` and `meta description` per route.
2. **Primary keyword**: Each page exposes a primary keyword to layout/BaseHead as required by existing props/types; keyword should appear in the visible `H1` where applicable.
3. **Canonical**: Correct canonical URLs; `astro.config.mjs` `site` must match `SITE_URL` in `src/consts.ts` (used for sitemap, RSS, absolute URLs).
4. **Structured data**: Use existing helpers (e.g. `src/utils/structured-data.ts`) for breadcrumbs and article JSON-LD where already wired.
5. **robots / sitemap**: `public/robots.txt` and generated sitemap must reference the same production host as `SITE_URL`.
6. **Media**: Optimized images; English, keyword-oriented filenames for local assets; meaningful `alt` (and title where used).

7. **Image naming and keyword alignment (mandatory)**  
   - **Filenames** (all raster/SVG assets under `public/`, including blog images, shared OG fallbacks, and branding): each file name must **either exactly equal** or **contain as ASCII substrings** the page’s primary keyword, category slug, and tag slugs **translated to English** (use hyphenated `kebab-case`). When two assets would collide, append a **numeric suffix** (`-2`, `-3`, …) before the extension so names stay unique.  
   - **Blog article images** (`images[]` in MDX): each entry must include **`alt`**, **`title`**, and **`description`**. All three strings must **contain the same English keyword tokens** as the filename rule above (primary keyword in English, `category`, and each `tags[]` value), plus a **numeric disambiguator** (`1`, `2`, `3`, …) matching the image index when needed for uniqueness. Hebrew prose may wrap those English tokens; do not omit the English tokens from any of the three fields.

---

## D. UI and design (premium legal redesign)

1. **Visual system**: Premium legal-grade UI: restrained palette, strong typography, cards/sections consistent with current `SiteLayout`, `Header`, `Footer`, and page templates.
2. **Components**: Prefer existing `src/components/ui/*` primitives; add new shadcn pieces only when needed; avoid bulk unused components.
3. **Layout**: Container-based width (`max-w-6xl` pattern), sticky header, footer using shared patterns.
4. **Mobile nav**: `src/components/react/MobileNav.tsx` + `client:media` for small viewports only.
5. **HTML hygiene**: No split/broken anchor tags across lines (e.g. `</a` + newline + `>`); validate links in prose blocks after edits.

---

## E. Engineering workflow (mandatory)

1. **Atomic commits**: One logical change per commit; message describes that single change.
2. **task_graph.log**: Append-only; exactly **one new numbered line** per committed change batch that touches code/config in scope; format:  
   `<n>. <descriptive-task-id> , <space-separated principal files>`  
   Never edit, delete, or renumber existing lines.
3. **Scope discipline**: Implement only what the task specifies; avoid unrelated refactors and schema drift.
4. **Imports**: Keep imports at top of file; match project import style (Astro vs React).
5. **Verification**: Run `pnpm build` before considering work done; fix regressions.
6. **Deployment**: Vercel CLI deploy when releasing; after deploy, spot-check metadata, sitemap, and crawlability.

---

## F. Documentation policy (default)

1. Do **not** add unsolicited reports, implementation write-ups, or extra markdown docs unless the user explicitly asks.
2. **Exception**: This `SSOT.md` and `task_graph.log` are allowed as the agreed SSOT / traceability artifacts.

---

## G. Handoff — notes for the next agent

**Branch / last change**

- Latest traceability entry: **`task_graph.log` line 6** — `premium-legal-shadcn-redesign-with-react-islands` (commit on branch `pr5-vercel-deploy-and-production-validation` at time of writing).
- Redesign landed: React + Tailwind v4 + shadcn primitives, layout shell, all main templates (home, about, services, contact, blog index, `BlogPost`, categories/tags index + dynamic), `MobileNav` island, `SITE_URL` aligned with `public/robots.txt`.

**Build**

- `pnpm build` was green (static, ~74 routes including taxonomy).

**Suggested next steps (pick by priority)**

1. **Production pass**: Deploy with Vercel CLI; confirm canonical, `og:url`, sitemap index, and RSS URLs on a sample of pages (home, one blog post, one tag, one category).
2. **A11y / UX**: Keyboard trap and focus order for `Sheet` / mobile menu; visible focus rings; Hebrew screen-reader labels where missing.
3. **Performance**: Lighthouse or Astro bundle analysis; ensure images use appropriate loading/sizing; keep islands lean.
4. **Content QA**: Spot-check MDX articles for broken internal links and heading hierarchy after template changes.
5. **Further interactivity**: Only add new islands if a clear UX need appears; default remains static Astro.

**Files to open first**

- `src/layouts/SiteLayout.astro`, `src/components/BaseHead.astro`, `src/consts.ts`, `astro.config.mjs`, `src/styles/global.css`, `src/components/react/MobileNav.tsx`, `components.json`.

When you complete new work: append **`task_graph.log`**, commit atomically, and extend this SSOT only if requirements materially change.
