# SEO/AIO/GEO Audit — Merged (July 2026)

URLs: `/about/`, `/services/`, `/blog/`, `/categories/`, `/tags/` on https://avniguy.co.il  
Date: 2026-07-13 | Method: live fetch + codebase review

---

## Cross-page executive summary

**Shared strengths:** All five hubs are SSG (`force-static`), HTTP 200, `index,follow`, Hebrew RTL (`lang="he"`, `dir="rtl"`), self-referencing canonicals with trailing slashes, sitemap inclusion, global `LegalService` + `WebSite` + `BreadcrumbList` JSON-LD, AI-crawler-friendly `robots.txt`, and substantive unique Hebrew copy (not thin link farms).

**Shared patterns (gaps):**
| Pattern | Pages affected | Severity |
|---------|----------------|----------|
| Root `title.template` duplicates `SITE_TITLE` → 70–95 char bloated `<title>` | all 5 | high |
| Breadcrumb JSON-LD missing trailing slash vs canonical | all 5 | low–medium |
| No page-level `WebPage`/`CollectionPage` + `dateModified` (homepage has it; hubs don't) | services, blog, categories, tags (+ about) | medium–high |
| No `ItemList` for visible directory entries | blog (135 posts), categories (19), tags (188) | high |
| YMYL E-E-A-T: no visible author/credential block on archive hubs | blog, categories, tags, services | medium–high |
| `lang="he"` not `he-IL` | sitewide | low |
| Fallback OG image (no placement-unique social images) | all 5 | low |
| CrUX/CWV unverified in audit (ops, not code) | all 5 | low (verify in GSC) |

**Strategic outlier:** `/tags/[slug]/` — ~188 thin tag archives indexed + in sitemap (TAG-010 critical).

**July 2026 GEO consensus applied:** Answer-first blocks, visible Q&A where useful, JSON-LD matching visible content, Person↔Organization entity graph, freshness via `dateModified`, FAQPage valuable for AI extraction (Google FAQ rich results deprecated May 2026).

---

## Site-wide priority matrix

| Priority | ID cluster | Scope | Impact |
|----------|------------|-------|--------|
| P0 critical | TAG-010 | Tag archive noindex + sitemap removal | Crawl budget / index bloat |
| P1 high | ABOUT-001, SVC-005, BLOG-002, CAT-002, TAG-007 | Absolute titles (no template bloat) | SERP display |
| P1 high | ABOUT-002, CAT-005 | Heading hierarchy h2→h3 | SEO + a11y + AI outline |
| P1 high | ABOUT-003, SVC-008, BLOG-004, CAT-006, TAG-004 | Visible E-E-A-T blocks | YMYL trust |
| P1 high | SVC-001, CAT-004, TAG-008 | FAQ visible + schema | GEO extraction |
| P1 high | BLOG-001, CAT-001, TAG-001/002 | CollectionPage + ItemList schema | Machine-readable hubs |
| P1 high | BLOG-003 | Blog pagination | Scale (135 posts, 419KB HTML) |
| P2 medium | ABOUT-004/005, SVC-002/003/004, BLOG-005/006/008, TAG-003/005/012 | WebPage, HowTo, freshness, direct-answer leads | GEO + entity |
| P2 medium | SVC-007, SVC-009, ABOUT-012 | Practice areas, Organization sameAs | Topical authority |
| P3 low | Breadcrumb slashes, he-IL, OG images, CWV verify | Hygiene + ops | Consistency |

---

## Per-page: /about/

**Grade:** Strong entity hub; gaps in title, headings, visible E-E-A-T, WebPage/HowTo schema.

| ID | Severity | Summary |
|----|----------|---------|
| ABOUT-001 | high | Fix title template duplication |
| ABOUT-002 | high | h2→h3 for cards and FAQ |
| ABOUT-003 | high | Visible attorney photo + credential block |
| ABOUT-004 | medium | WebPage/AboutPage + dateModified |
| ABOUT-005 | medium | HowTo schema for workflow |
| ABOUT-006 | medium | Breadcrumb trailing slash |
| ABOUT-007 | medium | Hebrew eyebrows; dedupe hero/entity section |
| ABOUT-008 | low | Enrich llms.txt about entry |
| ABOUT-009 | low | Page-specific OG image |
| ABOUT-010 | low | Deep links per practice card |
| ABOUT-011 | low | Verify CWV in GSC (ops) |
| ABOUT-012 | medium | Israel Bar URL in sameAs (env) |

---

## Per-page: /services/

**Grade:** Technically sound; thin vs /about/; missing FAQ, WebPage, ItemList, HowTo.

| ID | Severity | Summary |
|----|----------|---------|
| SVC-001 | high | Services FAQ visible + FAQPage schema |
| SVC-002 | medium | WebPage + dateModified |
| SVC-003 | medium | ItemList/Service schema for four offerings |
| SVC-004 | medium | HowTo for service journey |
| SVC-005 | high | Shorten title tag |
| SVC-006 | medium | 40–60 word direct-answer lead |
| SVC-007 | medium | Practice-area section + deep links |
| SVC-008 | medium | Author/entity cross-link block |
| SVC-009 | medium | Organization sameAs sitewide |
| SVC-010 | low | Breadcrumb trailing slash |
| SVC-011 | low | lang he-IL |
| SVC-012 | low | Services-specific OG image |
| SVC-013 | low | Expand meta keywords array |
| SVC-014 | low | Refactor internal link paragraph |

---

## Per-page: /blog/

**Grade:** Strong crawlability; scale risk (135 posts single page); missing CollectionPage/ItemList.

| ID | Severity | Summary |
|----|----------|---------|
| BLOG-001 | high | CollectionPage + ItemList schema |
| BLOG-002 | high | Shorten rendered title |
| BLOG-003 | high | Paginate archive (crawlable) |
| BLOG-004 | medium | Editorial ownership block |
| BLOG-005 | medium | Truthful archive/article freshness |
| BLOG-006 | medium | Concise archive scope statement |
| BLOG-007 | medium | Topic/year navigation |
| BLOG-008 | medium | Align H1/title; fix "weekly" wording |
| BLOG-009 | low | article + time semantics |
| BLOG-010 | low | Breadcrumb trailing slash |
| BLOG-011 | low | Unique blog-index OG image |
| BLOG-012 | medium | Mobile CWV monitoring (ops) |
| BLOG-013 | low | FAQ optional — skip unless user-led |
| BLOG-014 | medium | Verify IndexNow production |

---

## Per-page: /categories/

**Grade:** Good static hub; schema-light vs homepage; cards lack counts.

| ID | Severity | Summary |
|----|----------|---------|
| CAT-001 | high | CollectionPage + ItemList JSON-LD |
| CAT-002 | high | Fix title template duplication |
| CAT-003 | medium | Article count per category card |
| CAT-004 | medium | Visible FAQ + FAQPage schema |
| CAT-005 | medium | H2→H3 for category cards |
| CAT-006 | medium | E-E-A-T curator snippet |
| CAT-007 | low | Breadcrumb trailing slash |
| CAT-008 | low | lang he-IL |
| CAT-009 | low | Expand CTA links (services/blog) |
| CAT-010 | low | Featured categories row |
| CAT-011 | low | Verify CWV (ops) |
| CAT-012 | low | One-line category descriptions (defer) |

---

## Per-page: /tags/

**Grade:** B- ; critical tag-slug index bloat; missing WebPage/ItemList.

| ID | Severity | Summary |
|----|----------|---------|
| TAG-001 | high | WebPage JSON-LD on hub |
| TAG-002 | high | ItemList for tag directory |
| TAG-003 | medium | 40–60 word direct-answer lead |
| TAG-004 | high | Visible E-E-A-T block |
| TAG-005 | medium | Align H1 with title keyword |
| TAG-006 | low | Breadcrumb trailing slash |
| TAG-007 | medium | Shorten rendered title |
| TAG-008 | medium | FAQ section + schema |
| TAG-009 | medium | Post counts on tag links |
| TAG-010 | critical | noindex tag archives; remove from sitemap |
| TAG-011 | medium | Tag cloud grouping (defer partial) |
| TAG-012 | medium | dateModified visible + schema |
| TAG-013 | low | Unified @graph (defer) |

---

## Scopes

### scope-sitewide-metadata

- [x] ABOUT-001: Set absolute title on `/about/` via `buildPageMetadata({ absoluteTitle: true })` so root template does not duplicate brand
- [x] SVC-005: Set absolute title on `/services/` targeting ~45 chars primary phrase
- [x] BLOG-002: Set absolute title on `/blog/` aligned with archive H1 phrase
- [x] CAT-002: Set absolute title on `/categories/` ≤60 chars
- [x] TAG-007: Set absolute title on `/tags/` ≤60 chars without duplicate suffix
- [x] SVC-011: Change root layout `<html lang="he">` to `lang="he-IL"`
- [x] CAT-008: Same as SVC-011 (layout single change covers both)

### scope-sitewide-breadcrumbs

- [x] ABOUT-006: Breadcrumb path `/about` → `/about/` in about page
- [x] SVC-010: Breadcrumb path `/services` → `/services/`
- [x] BLOG-010: Breadcrumb path `/blog` → `/blog/`
- [x] CAT-007: Breadcrumb path `/categories` → `/categories/`
- [x] TAG-006: Breadcrumb path `/tags` → `/tags/`

### scope-structured-data-foundation

- [x] SVC-009: Add `sameAs` to `buildOrganizationSchema` from env URLs (Wikidata, LinkedIn, Israel Bar, Facebook)
- [x] ABOUT-012: `readPersonSameAsUrls()` already reads `PERSON_ISRAEL_BAR_URL`; org schema mirrors same URLs
- [x] TAG-013: Merge Organization, WebSite, page schemas into single `@graph` via `buildJsonLdGraph` in SiteShell

### scope-about-page

- [x] ABOUT-002: Change practice area, principle, and FAQ headings from h2 to h3
- [x] ABOUT-003: Add visible attorney photo + credential block (bar, years, Israel Bar link from env)
- [x] ABOUT-004: Add AboutPage/WebPage schema with dateModified and mainEntity → #person
- [x] ABOUT-005: Call buildHowToSchema for WORKFLOW_STEPS in extraJsonLd
- [x] ABOUT-007: Replace English eyebrows with Hebrew; trim duplicate hero/entity paragraphs
- [x] ABOUT-008: Expand llms.txt about bullet with practice areas and entity-hub role
- [x] ABOUT-009: Pass dedicated about OG image to buildPageMetadata
- [x] ABOUT-010: Link each practice area card to flagship blog/category URL
- [x] ABOUT-011: Ops-only — owner monitors CWV for `/about/` in GSC PageSpeed Insights / CrUX (no automated integration; pages are static SSG and measurable)

### scope-services-page

- [x] SVC-001: Add 6–8 Hebrew services FAQ visible + buildFaqSchema
- [x] SVC-002: Add services WebPage schema with dateModified
- [x] SVC-003: Add ItemList schema from SERVICES array
- [x] SVC-004: Add HowTo schema from service journey steps
- [x] SVC-006: Insert 40–60 word direct-answer block after H1
- [x] SVC-007: Add practice-area section with links to categories/blog
- [x] SVC-008: Add EntityByline component linking to /about/
- [x] SVC-012: Assign services-specific OG image in metadata
- [x] SVC-013: Pass keywords array in services metadata
- [x] SVC-014: Refactor closing paragraph with contextual practice links

### scope-blog-archive

- [x] BLOG-001: Emit CollectionPage/WebPage + ItemList for visible posts on current page
- [x] BLOG-003: Add server-rendered pagination at `/blog/page/[n]/` with self-canonical URLs
- [x] BLOG-004: Add editorial byline linking to /about/
- [x] BLOG-005: Derive archive dateModified from newest post updatedDate; show עודכן when updatedDate > pubDate
- [x] BLOG-006: Add concise archive scope statement near H1
- [x] BLOG-007: Add category/year navigation block with post counts
- [x] BLOG-008: Align H1 to "מאמרים משפטיים מעשיים"; rename section away from "השבוע"
- [x] BLOG-009: Wrap ArticleList items in article; FormattedDate already emits time
- [x] BLOG-011: Assign unique blog-index OG image
- [x] BLOG-012: Ops-only — owner monitors mobile CWV for `/blog/` and paginated `/blog/page/[n]/` in GSC/CrUX after deploy
- [x] BLOG-013: Skip optional FAQ — no user-led Q&A requirement confirmed
- [x] BLOG-014: IndexNow wired (`write-indexnow-key-file.mjs`, `post-deploy-indexnow.mjs`, `/api/indexnow`); dev key in `.env.development.example` + `.env.local`; production `INDEXNOW_KEY` must be set by owner in Vercel (currently empty in prod env)

### scope-categories-hub

- [x] CAT-001: Add CollectionPage + ItemList JSON-LD for 19 categories
- [x] CAT-003: Show article count per category card from getPostsIndex
- [x] CAT-004: Add 3–5 visible FAQ + FAQPage schema
- [x] CAT-005: Render category names as h3 inside links
- [x] CAT-006: Add curator snippet + link to /about/
- [x] CAT-009: Add /services/ and /blog/ to secondary CTA paragraph
- [x] CAT-010: Surface featured categories row (real-estate, contracts, litigation, tax)
- [x] CAT-011: Ops-only — owner verifies CWV for `/categories/` in GSC PageSpeed Insights / CrUX (static SSG; no fake CWV claims in code)
- [x] CAT-012: One-line category blurbs SSOT in `category-index-blurbs.ts`; shown on index cards

### scope-tags-hub-indexation

- [x] TAG-001: Add WebPage JSON-LD with dateModified on /tags/
- [x] TAG-002: Emit ItemList for tag directory
- [x] TAG-003: Add 40–60 word direct-answer lead in hero config
- [x] TAG-004: Add EntityByline on tags hub
- [x] TAG-005: Align tags H1 to include "תגיות לנושאים ממוקדים"
- [x] TAG-008: Add tags vs categories FAQ visible + schema
- [x] TAG-009: Show post counts on tag links
- [x] TAG-010: noindex,follow on /tags/[slug]/; remove tag slugs from sitemap
- [x] TAG-011: Tag cloud grouped by topic cluster (`tag-cloud-groups.ts`) with Hebrew dedupe + client search filter (`TagsCloudGrouped`)
- [x] TAG-012: Add dateModified in WebPage schema + visible עודכן label

---

## Plan estimate

**12 Cursor PLAN_MODE plans** (one per scope above):

1. scope-sitewide-metadata  
2. scope-sitewide-breadcrumbs  
3. scope-structured-data-foundation  
4. scope-about-page  
5. scope-services-page  
6. scope-blog-archive (schema + quick wins)  
7. scope-blog-pagination-freshness (may merge with 6 if single session)  
8. scope-categories-hub  
9. scope-tags-hub-indexation  

Consolidated count: **10 plans** if blog pagination+freshness merge with blog-archive; **12** if split blog into schema vs pagination vs freshness.

**Recommended: 11 plans** — sitewide (2) + foundation (1) + about (1) + services (1) + blog (2: schema/quick + pagination/freshness) + categories (1) + tags (2: hub + indexation policy).

---

## Validation

*(Updated after codebase verification — confidence >0.95)*

- All five pages use `buildPageMetadata` without `absoluteTitle` — title bloat finding **confirmed**.
- All five breadcrumb arrays use paths without trailing slash — **confirmed** in source.
- `buildOrganizationSchema` lacks `sameAs` — **confirmed**.
- Blog loads all posts via `getSortedPosts()` with no pagination — **confirmed**.
- Sitemap includes all tag slugs at priority 0.5 — **confirmed**.
- Google FAQ rich result deprecated May 2026 — **confirmed** (external); BLOG-013 skip justified.
- ABOUT-011, BLOG-012, CAT-011 are ops/GSC tasks — **correct** as non-code scopes.
- CAT-012, TAG-011, TAG-013 — **implemented** (tasks 294–296).

**Post-implementation validation (2026-07-13 final, confidence >0.95):**

- `absoluteTitle` added to `buildPageMetadata`; all five hub routes use it — **verified in source**.
- `lang="he-IL"` on root layout — **verified**.
- Breadcrumb paths use trailing slashes on all five hubs — **verified**.
- `buildWebPageSchema` + org `sameAs` wired — **verified**.
- About: h3 hierarchy, AttorneyCredentialBlock, AboutPage/HowTo/FAQ schema — **verified**.
- Services: FAQ, WebPage, ItemList, HowTo, direct answer, EntityByline — **verified**.
- Blog: pagination at `/blog/page/[n]/`, CollectionPage+ItemList, scope statement, archive nav — **verified**.
- Categories: CollectionPage, ItemList, counts, FAQ, h3, featured row, **one-line blurbs (CAT-012)** — **verified**.
- Tags: WebPage, ItemList, FAQ, counts, noindex on `[tag]`, tag slugs removed from sitemap, **grouped cloud + search (TAG-011)** — **verified**.
- **Unified `@graph` JSON-LD (TAG-013)** via `buildJsonLdGraph` in SiteShell — **verified** (single script tag with `@graph` on `/tags/`).
- `llms.txt` about entry expanded — **verified**.
- **INDEXNOW_KEY**: dev value in `.env.development.example` + local `.env.local`; production build warns when empty; **owner action**: set real key in Vercel production env for live pings.
- Ops-only (no code): ABOUT-011, BLOG-012, CAT-011 — owner monitors CWV in GSC/CrUX manually; pages are static SSG and measurable.
- `pnpm build` passes (359 static pages); dev smoke 200 on `/categories/` and `/tags/`.
