# SEO p5 next-main audit 2026-11-21

pipeline: .commands/PIPLINE_seo_p5.md
month: 2026-11
rubric: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide (page last updated 2026-07-10 UTC; fetched 2026-11-21)
rubric_blog: https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing (John Mueller, 2026-05-15)
graph: notes/implementations/seo_work_graph.json
selected:
- /tags/
- /categories/real-estate/
- /categories/tax/
- /categories/litigation/
- /categories/contracts/
skipped_reaudit: mains with auditCount 1 from 2026-11-08 (/, /about/, /services/, /blog/, /contact/, and the other hubs in that run)
articles: none. This pipeline file does not name article slugs.

## Rubric (Google, still current Nov 2026)

- Generative AI features use Search ranking + RAG + query fan-out. AEO/GEO for Google Search is SEO.
- Eligible only if indexed and snippet-eligible.
- Non-commodity, people-first, accurate text. Structured data must match visible content and is for rich results, not a special AI markup.
- Do not add thin fan-out URLs, llms.txt-for-Google, or chunking.
- Freshness signals must be honest (dateModified matches the page's real update).

## /tags/

evidence: src/app/tags/page.tsx
- PASS: index,follow via buildPageMetadata; unique OG mainPageOgImageUrl('/tags/'); FAQ visible and in FAQPage schema; breadcrumb trailing slash; EntityByline matches TAGS_DATE_MODIFIED 2026-07-13; sitemap /tags/ lastmod 2026-07-13.
- FINDING tags-faq-count: FAQ answer and FAQPage schema hardcode "מאות תגיות". getTags() is the count. Corpus on 2026-11-21 is 190 tags. The sentence is not derived from that count.
- FINDING tags-contact-link: DIRECT_ANSWER says "יצירת קשר" as plain text. Rendered body links /categories/ only. No href="/contact/".
- FINDING tags-ymyl: /categories/, /services/, /contact/, and home render YmylDisclaimer. /tags/ does not.

## /categories/real-estate/ /categories/tax/ /categories/litigation/ /categories/contracts/

evidence: src/app/categories/[category]/page.tsx (one template). Counts: real-estate 31, tax 20, litigation 20, contracts 10. All shouldIndexCategory true (min 4, not in NOINDEX_OVERLAP_CATEGORIES).
- PASS: index,follow when post count qualifies; speakable block when hub copy exists; hub intros in src/lib/seo/category-hub-intros.ts; pillar links to existing articles; H1 present; canonical from path.
- FINDING category-datemodified: CollectionPage dateModified is the literal "2026-07-14" for every category. Sitemap category lastmod uses getArchiveDateModified(posts). Schema date is not the category's latest post date.
- FINDING category-breadcrumb-slash: breadcrumb path "/categories" has no trailing slash. next.config.ts and vercel.json set trailingSlash true. Sibling crumbs use "/categories/".
- FINDING category-ymyl: category index page renders YmylDisclaimer. These YMYL collection URLs do not.
- FINDING category-tag-links: buildCategoryMetaDescription promises "קישורים למאמרים ותגיות". The template renders article links and pillar links. It does not render any /tags/ link.
- FINDING category-itemlist: visible ArticleList has no matching ItemList JSON-LD. Blog index builds ItemList from the posts it shows.
- FINDING category-og: generateMetadata omits image, so buildPageMetadata uses FALLBACK_OG_IMAGE for every category URL. unique-site-images: one file per page. The four selected hubs share that fallback.

## VALIDATE_TRUE

| id | claim | evidence | conf |
|----|-------|----------|------|
| tags-faq-count | FAQ string is hardcoded, not getTags() | src/app/tags/page.tsx TAGS_FAQ | 0.99 |
| tags-contact-link | no /contact/ href on the page | src/app/tags/page.tsx | 0.99 |
| tags-ymyl | YmylDisclaimer absent; present on /categories/ | src/app/tags/page.tsx vs src/app/categories/page.tsx | 0.99 |
| category-datemodified | literal 2026-07-14 in schema | src/app/categories/[category]/page.tsx dateModified | 0.99 |
| category-breadcrumb-slash | path '/categories' | same file breadcrumbItems | 0.99 |
| category-ymyl | disclaimer component not imported | same file imports | 0.99 |
| category-tag-links | meta description mentions תגיות; template has no /tags/ href | taxonomy-labels.ts buildCategoryMetaDescription; category page | 0.99 |
| category-itemlist | no buildItemListSchema call | category page imports | 0.99 |
| category-og | no image passed; fallback shared | metadata.ts FALLBACK_OG_IMAGE; category generateMetadata | 0.99 |

CONFIDENCE_GATE: PASS

## Scopes

- [x] tags-faq-count
  - Bind the "כמה תגיות" FAQ answer (visible + FAQPage schema) to getTags().length.

- [x] tags-contact-link
  - Add a visible link to /contact/ on /tags/.

- [x] tags-ymyl
  - Render YmylDisclaimer on /tags/.

- [ ] category-datemodified
  - Set CollectionPage dateModified from getArchiveDateModified of that category's posts.

- [ ] category-breadcrumb-slash
  - Use path /categories/ on the category breadcrumb.

- [ ] category-ymyl
  - Render YmylDisclaimer on category hubs.

- [ ] category-tag-links
  - Render links to the tags used by that category's posts so the meta description is true.

- [ ] category-itemlist
  - Emit ItemList JSON-LD for the articles the page lists.

- [ ] category-og
  - Give /categories/real-estate/, /categories/tax/, /categories/litigation/, and /categories/contracts/ each a unique OG image. Keep source URL and license off the visible page.
