# SERP ranking — site scopes (file-backed only)

**Repo:** `avni-guy` (avniguy.co.il)  
**Created:** 2026-07-07  
**Source report:** `OWNER-REPORTS/001_serp-ranking-site-seo-work_2026-07-07.md`  
**Derived via:** `.commends/TODO_report2checklist.md` → `.commends/TODO_convert_atomic.md`  
**Filter:** actionable items that name a repo file path only  
**Status:** owner checklist — not SSOT

## Non-regression constraints (content kit + live site)

- **Do not mutate** `src/content/blog/` MDX source files — entity links are **runtime-only** (mirror `src/lib/content/inject-figures.ts`).
- **Preserve** `content-pipeline.profile.json` → `structuredDataModule: src/utils/structured-data.ts` export surface (`buildBlogPostingSchema`, etc.).
- **Do not change** article frontmatter schema, `check-article.mjs` rules, or publish flow (`scripts/publish-draft-to-content.mjs`).
- **Do not change** article `metaTitle` / `title` / per-post FAQ — only global schema + about/home entity surfaces.
- **Sitemap:** keep dynamic blog URL generation via `getPostsIndex()`; only append new static paths (e.g. `/search/`).
- **IndexNow / GSC scripts:** skip when env secrets unset; never fail `pnpm run build:ci`.
- **Verify after each scope:** `node .content-kit/validators/check-publish.mjs`, sample `check-article.mjs`, `pnpm run build:ci` (sitemap blog URL floor unchanged).


## Goal

Raise **avniguy.co.il** for `גיא אבני` and `גיא אבני עורך דין` (~#13–17).

---

## entity-hub-title-h1-person-schema

- [x] Promote `src/app/about/page.tsx` as canonical entity home (route + on-page entity hub content)
- [x] Set entity `<title>` to `גיא אבני | עורך דין` in `src/app/about/page.tsx` via `src/lib/metadata.ts`
- [x] Set entity `<h1>` to `גיא אבני עורך דין` in `src/lib/seo/main-page-heroes.mjs` (`/about/` entry; rendered by `src/app/about/page.tsx`)
- [x] Add standalone `Person` JSON-LD (`@id` `https://avniguy.co.il/about/#person`; `name`, `jobTitle`, `url`, `image`, `worksFor`, `knowsAbout`, `hasCredential`) in `src/lib/seo/schema-person.ts`
- [x] Wire `Person` JSON-LD output on entity home in `src/app/about/page.tsx`
- [x] Remove conflicting homepage entity title/H1 in `src/consts.ts` (`SITE_TITLE`), `src/lib/seo/main-page-heroes.mjs` (`/` H1), and `src/app/page.tsx` metadata

## blogposting-author-graph-entity-links

- [x] Change `BlogPosting.author` from inline `Person` to `{ "@id": "https://avniguy.co.il/about/#person" }` in `src/lib/seo/schema-article.ts`
- [x] Add `"about": { "@id": "https://avniguy.co.il/about/#person" }` on article schema in `src/lib/seo/schema-article.ts`
- [x] Refactor existing inline author in `src/utils/structured-data.ts` `buildBlogPostingSchema` to delegate to `src/lib/seo/schema-article.ts` (keep export signature stable for `content-pipeline.profile.json`)
- [x] Consume article schema from `src/lib/seo/schema-article.ts` in `src/app/blog/[slug]/page.tsx`
- [x] Add runtime contextual entity-hub link injection (2–3 links/post; anchor rotation) in `src/lib/content/inject-entity-links.ts` (mirror `inject-figures.ts`; **no writes** to `src/content/blog/`)
- [x] Wire `injectEntityLinks()` in `src/app/blog/[slug]/page.tsx` render pipeline (after `bodyForRender`, before MDX render)

## wikidata-sameas-graph

- [x] Add Wikidata create/claim + property sync (`P856`, `P106`, Hebrew label) in `scripts/wikidata-sync.mjs` (secrets via env only)
- [x] Put Wikidata QID first in `Person.sameAs` in `src/lib/seo/schema-person.ts`
- [x] Add LinkedIn, Israel Bar, verified social URLs to `Person.sameAs` in `src/lib/seo/schema-person.ts`

## brand-faq-searchaction

- [x] Add brand-targeted `FAQPage` JSON-LD (`מי זה גיא אבני?`, `גיא אבני עורך דין — באילו תחומים?`, `איך ליצור קשר עם גיא אבני?`) on `src/app/about/page.tsx`
- [x] Add `WebSite.potentialAction` → `SearchAction` (`/search?q={search_term_string}`) in `src/utils/structured-data.ts` `buildWebSiteJsonLd`
- [x] Implement minimal validating `/search/` UI route in `src/app/search/page.tsx` (schema target `/search?q=`; existing API is `src/app/api/search/route.ts` with `?q=`)
- [x] Add `/search/` to `STATIC_PATHS` in `src/app/sitemap.ts`

## gsc-indexnow-loop

- [x] Add IndexNow POST handler for changed URLs in `src/app/api/indexnow/route.ts`
- [x] Host IndexNow key verification file at `public/{INDEXNOW_KEY}.txt`
- [x] Ping IndexNow on publish/deploy in `scripts/post-deploy-indexnow.mjs` (skip when `INDEXNOW_KEY` unset — must not fail `build:ci`)
- [x] Wire publish/deploy hook to `scripts/post-deploy-indexnow.mjs` via `package.json` `postbuild` or Vercel deploy hook config
- [x] Run GSC URL Inspection on entity hub + top 20 blog URLs in `scripts/gsc-url-inspection.mjs`
- [x] Alert when `coverageState ≠ SUBMITTED_AND_INDEXED` in `scripts/gsc-url-inspection.mjs`

---

## atomic-tasks

### entity-hub-title-h1-person-schema

- [x] Add entity-home intro section to `src/app/about/page.tsx`
- [x] Add credentials / `knowsAbout` surface section to `src/app/about/page.tsx`
- [x] Set `metadata.title` to `גיא אבני | עורך דין` in `src/app/about/page.tsx` (`buildPageMetadata` call)
- [x] Set `/about/` `h1` to `גיא אבני עורך דין` in `src/lib/seo/main-page-heroes.mjs`
- [x] Create `src/lib/seo/schema-person.ts` with `SITE_PERSON_ID` (`https://avniguy.co.il/about/#person`)
- [x] Add `buildPersonSchema()` with `name`, `jobTitle`, `url`, `image` in `src/lib/seo/schema-person.ts`
- [x] Add `worksFor`, `knowsAbout`, `hasCredential` to `buildPersonSchema()` in `src/lib/seo/schema-person.ts`
- [x] Import `buildPersonSchema` in `src/app/about/page.tsx`
- [x] Pass `buildPersonSchema()` via `extraJsonLd` on `SiteShell` in `src/app/about/page.tsx`
- [x] Retitle `SITE_TITLE` in `src/consts.ts` (remove competing entity phrasing)
- [x] Retitle `/` `h1` in `src/lib/seo/main-page-heroes.mjs` (non-conflicting with entity hub)
- [x] Update homepage `buildPageMetadata` title in `src/app/page.tsx`

### blogposting-author-graph-entity-links

- [x] Create `src/lib/seo/schema-article.ts` with `PERSON_REF` (`{ "@id": "https://avniguy.co.il/about/#person" }`)
- [x] Set `BlogPosting.author` to `PERSON_REF` in `buildArticleSchema()` in `src/lib/seo/schema-article.ts`
- [x] Add `BlogPosting.about` as `PERSON_REF` in `buildArticleSchema()` in `src/lib/seo/schema-article.ts`
- [x] Delegate `buildBlogPostingSchema` to `src/lib/seo/schema-article.ts` from `src/utils/structured-data.ts` (preserve export + input type for kit `structuredDataModule`)
- [x] Import `buildArticleSchema` from `src/lib/seo/schema-article.ts` in `src/app/blog/[slug]/page.tsx`
- [x] Replace inline schema assembly with `buildArticleSchema()` in `src/app/blog/[slug]/page.tsx`
- [x] Create `src/lib/content/inject-entity-links.ts` with error logging (runtime only; no MDX file writes)
- [x] Add anchor registry rotation to `src/lib/content/inject-entity-links.ts`
- [x] Enforce exact-match anchor cap (~20–30%) in `src/lib/content/inject-entity-links.ts`
- [x] Wrap injected anchors in entity-relationship sentences in `src/lib/content/inject-entity-links.ts`
- [x] Add contextual entity-hub link insertion (2–3/post) to `src/lib/content/inject-entity-links.ts`
- [x] Import `injectEntityLinks` in `src/app/blog/[slug]/page.tsx`
- [x] Call `injectEntityLinks()` after `bodyForRender()` and before `injectArticleFigures()` in `src/app/blog/[slug]/page.tsx`

### wikidata-sameas-graph

- [x] Create `scripts/wikidata-sync.mjs` with env secret load and error logging
- [x] Add Wikidata Q-item create/claim HTTP call in `scripts/wikidata-sync.mjs`
- [x] Add `P856` (avniguy.co.il) property sync in `scripts/wikidata-sync.mjs`
- [x] Add `P106` (lawyer) property sync in `scripts/wikidata-sync.mjs`
- [x] Add Hebrew label `גיא אבני` sync in `scripts/wikidata-sync.mjs`
- [x] Add `sameAs` field to `buildPersonSchema()` in `src/lib/seo/schema-person.ts`
- [x] Put Wikidata QID URL first in `Person.sameAs` in `src/lib/seo/schema-person.ts`
- [x] Add LinkedIn URL to `Person.sameAs` in `src/lib/seo/schema-person.ts`
- [x] Add Israel Bar listing URL to `Person.sameAs` in `src/lib/seo/schema-person.ts`
- [x] Add verified social URLs to `Person.sameAs` in `src/lib/seo/schema-person.ts`

### brand-faq-searchaction

- [x] Define brand FAQ Q&A constant in `src/app/about/page.tsx`
- [x] Emit brand `FAQPage` JSON-LD via `buildFaqSchema` in `src/app/about/page.tsx`
- [x] Add `potentialAction` `SearchAction` to `buildWebSiteJsonLd()` in `src/utils/structured-data.ts`
- [x] Create `src/app/search/page.tsx` route shell
- [x] Read `q` search param in `src/app/search/page.tsx`
- [x] Forward `q` to `/api/search/` from `src/app/search/page.tsx`
- [x] Add `/search/` to `STATIC_PATHS` in `src/app/sitemap.ts`

### gsc-indexnow-loop

- [x] Create `src/app/api/indexnow/route.ts` POST handler skeleton with error logging
- [x] Validate IndexNow request body (URL list) in `src/app/api/indexnow/route.ts`
- [x] POST submitted URLs to IndexNow API in `src/app/api/indexnow/route.ts`
- [x] Write IndexNow key verification file to `public/{INDEXNOW_KEY}.txt`
- [x] Create `scripts/post-deploy-indexnow.mjs` with error logging
- [x] Skip IndexNow ping when `INDEXNOW_KEY` unset in `scripts/post-deploy-indexnow.mjs`
- [x] Collect changed URLs since last deploy in `scripts/post-deploy-indexnow.mjs`
- [x] POST changed URLs to IndexNow in `scripts/post-deploy-indexnow.mjs`
- [x] Trigger sitemap regen after deploy (fresh `lastModified` via `src/app/sitemap.ts` on next build) in `scripts/post-deploy-indexnow.mjs`
- [x] Add `post-deploy-indexnow` script entry in `package.json`
- [x] Chain `post-deploy-indexnow` in `package.json` `postbuild`
- [x] Create `scripts/gsc-url-inspection.mjs` with env secret load and error logging
- [x] Inspect entity hub URL via GSC URL Inspection API in `scripts/gsc-url-inspection.mjs`
- [x] Inspect top 20 blog URLs via GSC URL Inspection API in `scripts/gsc-url-inspection.mjs`
- [x] Log alert when `coverageState ≠ SUBMITTED_AND_INDEXED` in `scripts/gsc-url-inspection.mjs`
