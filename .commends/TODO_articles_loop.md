# Articles loop — reader copy, SEO, links, publish (`reserch-based-articles/` → live)

**Purpose:** Run **Phases 2–8** after research loop completes: transform studies into reader-facing articles, add SEO blocks, inline links, audit, publish to site.  
**Prerequisite:** N completed files in `reserch/NNNN_<subject_label>.md` from `.commends/TODO_reserch_loop.md`.  
**Agent rule:** Treat this file as explicit user instructions (`.commends/` = execute every step). Do not skip delegations where marked.

---

## INPUTS (substitute before starting)

| Placeholder | Meaning |
|-------------|---------|
| `<SUBJECT_1>` … `<SUBJECT_N>` | N subjects (same as research loop) |
| `<N>` | Count of subjects |
| `<DATE>` | ISO date for frontmatter (`YYYY-MM-DD`) |
| `<SITE_BRAND>` | Brand name in titles |
| `<SITE_DOMAIN>` | Production origin (e.g. `https://www.example.com`) |
| `<PRIMARY_CTA_PATH>` | Primary conversion path (e.g. `/`, `/#quote`, `/contact/`) |
| `<PRIMARY_SERVICE_ANCHOR>` | Homepage or primary CTA link anchor text |
| `<CONTENT_TYPE>` | Published page kind (guide, blog, doc, article) |
| `<PUBLISH_PATH_PREFIX>` | Live URL prefix (e.g. `/blog/`, `/guide/`) — **no** numeric draft prefix |
| `<CONTENT_ROOT>` | Published markdown root (e.g. `src/content/blog/`) — discover from repo SSOT |
| `<ARTICLE_SLUG_i>` | URL slug for subject *i* — keyword-based, **no** `0001`-style prefix |
| `<CONTENT_FILE_i>` | Filename under `<CONTENT_ROOT>` — typically `<ARTICLE_SLUG_i>.md` or `.mdx` per project |
| `<PROJECT_LANGUAGE>` | Primary reader language |
| `<FAQ_HEADING>` | FAQ section title in `<PROJECT_LANGUAGE>` |
| `<LINKS_SECTION_HEADING>` | Temporary bottom links section title (removed in Phase 5) |
| `<NAV_SECTION_LABEL>` | Nav/menu label for this content type (if site has section nav) |
| `<LINK_DENYLIST>` | Outbound link patterns to strip (TLD, domains, competitors) — from project rules |
| `<INTERNAL_LINK_MANIFEST_i>` | Per-article required internal paths (homepage, CTA, siblings, related pages) |

**Numbering convention (draft files only):**
- Source: `reserch/NNNN_<subject_label>.md`
- Articles: `reserch-based-articles/NNNN_<subject_label>.md` (same `NNNN` as research)
- **Live URLs:** `<PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>`

**Slug rules:**
- Derive from primary subject keyword or project-agreed slug convention
- Lowercase, hyphen-separated, no digits-only segments (unless project SSOT says otherwise)
- Set in YAML `seo.slug` and `seo.canonical` as `<PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>`
- Register slug in project content registry / sitemap SSOT (path discovered in Phase 0)

---

## PHASE 0 — Coordinator setup (parent agent)

- [ ] Confirm research loop done: all N files exist in `reserch/`
- [ ] Read project structure SSOT — discover `<CONTENT_ROOT>`, publish route, SEO registry, sitemap, nav, markdown loader
- [ ] Resolve: `<PRIMARY_CTA_PATH>`, `<FAQ_HEADING>`, `<LINKS_SECTION_HEADING>`, `<NAV_SECTION_LABEL>`, `<LINK_DENYLIST>`
- [ ] Create `reserch-based-articles/` if missing
- [ ] Extend subject manifest: for each *i*, add `<CONTENT_FILE_i>`, `<INTERNAL_LINK_MANIFEST_i>`
- [ ] Plan **N parallel subagents** per phase (one subject per agent; audit/publish phases may use one agent)

---

## PHASE 2 — Reader-facing articles (`reserch-based-articles/`)

### Per subject — delegate **one subagent** (parallel N)

**Source:** `reserch/NNNN_<subject_label>.md`  
**Output:** `reserch-based-articles/NNNN_<subject_label>.md`

- [ ] Copy full research content into new file (then edit in place)
- [ ] **Minimal clean** — remove validation/instruction meta only:
  - TODO_reserch mapping sections, confidence audit matrices, `.commends` checklist blocks, tool error logs, admin-only version tables
  - **Keep** all research findings, tables, protocols, citations
- [ ] Translate non-`<PROJECT_LANGUAGE>` headings → `<PROJECT_LANGUAGE>`
- [ ] Replace generic headings with **subject-based sentences** using `<SUBJECT_i>`
- [ ] **Suggest** minimal SEO edits in agent response only — **do not implement yet**
- [ ] Leave `reserch/` originals untouched
- [ ] No commit unless asked

---

## PHASE 3 — Implement SEO blocks (no content thinning)

### Per article file — delegate **one subagent** (parallel N)

**Add only; do not delete body paragraphs.**

- [ ] YAML frontmatter:
  - `seo.title`, `seo.description`, `seo.slug` (`<PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>`), `seo.keywords[]`, `seo.dateModified: <DATE>`, `seo.canonical`
- [ ] TL;DR block (3–6 bullets + CTA to `<PRIMARY_CTA_PATH>`)
- [ ] Reader hook paragraph after executive summary (tone for `<CONTENT_TYPE>`)
- [ ] `## <FAQ_HEADING>` — 5–6 FAQ Q&As from existing content
- [ ] Bottom `## <LINKS_SECTION_HEADING>` block (temporary — removed in Phase 5)
- [ ] Tables may keep `—` as N/A placeholders where already used
- [ ] No commit unless asked

---

## PHASE 4 — Em dash + title refresh

### Per article file — delegate **one subagent** (parallel N)

- [ ] Replace all `—` with `:` or `,` (keep `-` hyphens; table N/A placeholders exempt if needed)
- [ ] Brainstorm improved `#` / `##` / `###` / `####` titles (subject keyword in title; high creativity)
- [ ] **Implement** chosen titles in file + update `seo.title` in YAML
- [ ] Re-run any failed files individually
- [ ] No commit unless asked

---

## PHASE 5 — Inline links + source cleanup

### Per article — delegate **one subagent** (parallel N)

- [ ] **Remove** bottom link-list sections (including `<LINKS_SECTION_HEADING>` and any project-defined variants) and TL;DR lines that are **only** link lists
- [ ] **Embed** every link from removed sections into **body paragraphs** with natural anchors, spread across **≥4 H2 sections** (not clustered in TL;DR only)
- [ ] **Exactly one** homepage link per article: long-tail anchor around `<PRIMARY_SERVICE_ANCHOR>` → `/` or `<SITE_DOMAIN>/`
- [ ] Weave internal links per `<INTERNAL_LINK_MANIFEST_i>`:
  - Always consider: `/`, `<PRIMARY_CTA_PATH>`, existing published pages under `<PUBLISH_PATH_PREFIX>` and other site sections related by topic
  - Cross-link sibling articles from the same batch where topically appropriate
  - Minimum per manifest (set in Phase 0): homepage, primary CTA, 2+ related pages
- [ ] **Remove all** hyperlinks matching `<LINK_DENYLIST>` from body + sources section
- [ ] Replace removed links with authoritative sources appropriate to the domain (standards bodies, peer-reviewed, government, industry orgs)
- [ ] Do not thin content
- [ ] No commit unless asked

---

## PHASE 6 — Embed-all-links audit (parent or one subagent)

- [ ] Read all N files in `reserch-based-articles/`
- [ ] For each file, verify every path in `<INTERNAL_LINK_MANIFEST_i>` is present in body (not only TL;DR)
- [ ] Fix gaps: missing slugs, clustered links, duplicate homepage links, leftover link-list-only blocks
- [ ] Global checks per file:
  - [ ] 0 denylisted outbound links
  - [ ] 0 bottom link-list sections
  - [ ] Exactly **1** homepage link
  - [ ] Links in **4+** distinct body sections
- [ ] No commit unless asked

---

## PHASE 7 — Publish to site (code + content)

**Goal:** live pages at `<PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>` using article markdown **as-is** (YAML kept in file; strip at render per project loader).

### 7.1 Content copy

- [ ] For each subject *i*: copy `reserch-based-articles/NNNN_<subject_label>.md` → `<CONTENT_ROOT>/<CONTENT_FILE_i>`
- [ ] **Do not edit** article body during copy

### 7.2 Code — read before edit

- [ ] From repo SSOT: existing publish route(s), content registry, sitemap builder, site nav, markdown loader, article page shell
- [ ] Do not assume fixed paths — match what the project already uses for `<CONTENT_TYPE>` pages

### 7.3 Code — implement or extend

- [ ] Content registry SSOT — add all N entries (slug, contentFile, title, description, nav/breadcrumb labels, dates) + keep existing
- [ ] Markdown loader — read file + strip YAML frontmatter for render
- [ ] Shared article UI — markdown components + page shell + structured data if project uses it
- [ ] Dynamic or static publish route — `generateStaticParams` / `generateMetadata` / `notFound` as applicable
- [ ] Remove obsolete per-slug duplicate routes if consolidating to one dynamic route
- [ ] Sitemap — include all new `<PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>` paths
- [ ] Nav — add entries under `<NAV_SECTION_LABEL>` if site exposes this content type in nav
- [ ] Do **not** commit auto-generated local dev artifacts

### 7.4 Verify build

- [ ] Project build command (e.g. `pnpm build`)
- [ ] Confirm build output lists all new publish routes
- [ ] Dev server smoke — 2 sample article URLs under `<PUBLISH_PATH_PREFIX>`

---

## PHASE 8 — Commit, push, deploy (when user asks)

- [ ] Append **one** line to project task log if repo uses atomic logging (e.g. `task_graph.log`)
- [ ] Stage only pipeline deliverables (published content + code); exclude draft dirs (`reserch/`, `reserch-based-articles/`) unless user includes them
- [ ] Atomic commit with descriptive kebab-case message
- [ ] Push to production branch per project workflow
- [ ] Confirm host deploy **Ready** (provider per project)
- [ ] HTTP 200 smoke on `<SITE_DOMAIN><PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>` for 2+ articles

---

## DELEGATION MAP (articles loop)

| Phase | Parallel agents | Typical subagent type |
|-------|-----------------|------------------------|
| 2 Articles | N | generalPurpose |
| 3 SEO blocks | N | generalPurpose |
| 4 Titles/dash | N | generalPurpose |
| 5 Links/sources | N | generalPurpose |
| 6 Embed audit | 1 | generalPurpose |
| 7 Publish | 1 | parent agent |
| 8 Deploy | 1 | parent agent |

---

## CODE TOUCH LIST (Phase 7 — discover paths from SSOT)

```
<PUBLISH_ROUTE>                 e.g. app/**/[slug]/page.tsx or equivalent
<ARTICLE_PAGE_COMPONENT>        page shell for <CONTENT_TYPE>
<MARKDOWN_RENDERER>             shared markdown/MDX component
<SITE_NAV>                      if nav lists this content type
<CONTENT_ROOT>/<CONTENT_FILE_i> (× N)
<CONTENT_REGISTRY>              slug ↔ file ↔ metadata SSOT
<SITEMAP_BUILDER>               includes new publish paths
<MARKDOWN_LOADER>               read file, strip frontmatter
<task_log>                      Phase 8 only, if repo uses it
```

Remove obsolete per-slug static routes when consolidating to one dynamic route.

---

## INVOCATION PROMPT TEMPLATE

```
Prerequisite: N research files in reserch/ from @.commends/TODO_reserch_loop.md

Subjects (N=<N>):
Content type: <CONTENT_TYPE>
Publish prefix: <PUBLISH_PATH_PREFIX>
Language: <PROJECT_LANGUAGE>
Site: <SITE_DOMAIN>
Primary CTA: <PRIMARY_CTA_PATH>
1. <SUBJECT_1> → slug: <ARTICLE_SLUG_1>
2. <SUBJECT_2> → slug: <ARTICLE_SLUG_2>
…

Execute @.commends/TODO_articles_loop.md end-to-end.
Delegate one subagent per subject for Phases 2–5.
Run Phase 6 audit and Phase 7 publish; Phase 8 only if I ask to commit/deploy.
```

---

## DONE CRITERIA (articles loop)

- [ ] N files in `reserch-based-articles/` (SEO blocks, inline links, denylist clean)
- [ ] N files in `<CONTENT_ROOT>/<CONTENT_FILE_i>`
- [ ] All slugs registered in project content registry, sitemap, and nav (if applicable)
- [ ] Production URLs at `<SITE_DOMAIN><PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>` return 200 after deploy
