# 010 SEO schema / JSON-LD audit 2026-11-23

source: code `src/utils/structured-data.ts` `src/lib/seo/schema-*` + live https://avniguy.co.il
ssot: `.cursor/rules/ssot-repo-structure.mdc` AGENTS.md `.content-kit/standards/structured-data.md`
note: OWNER-REPORTS non-authoritative

## counts
P0: 1
P1: 6
P2: 6
total: 13

## findings

F01 DONE P0 status=done path=/blog/[slug]/ /contact/
evidence: live BreadcrumbList item `https://avniguy.co.il/blog` and `https://avniguy.co.il/contact` (no trailing slash); next.config trailingSlash=true; archive uses `/blog/`
fix: normalize crumb paths to trailing slash (call sites + defensive helper)

F02 DONE P1 status=done path=/tags/[tag]/
evidence: live graph types LegalService,WebSite,BreadcrumbList only; categories hubs emit CollectionPage+ItemList
fix: add CollectionPage + ItemList(+dateModified) like categories

F03 DONE P1 status=done path=BlogPosting builder
evidence: live BlogPosting has no `@id`; mainEntityOfPage `@id`=canonical orphans BlogPosting identity
fix: set `@id` to canonicalUrl in `buildArticleSchema`

F04 DONE P1 status=done path=/blog/page/N/
evidence: live page/2 CollectionPage `@id`=`…/blog/#webpage` while `url`=`…/blog/page/2/`
fix: unique `@id` per archive URL

F05 DONE P1 status=done path=article+most hubs
evidence: article graph defines only #organization #website; author `{@id:…/about/#person}` orphan in-page
fix: SiteShell inject lean Person when graph lacks SITE_PERSON_ID

F06 DONE P1 status=done path=/blog/[slug]/
evidence: FAQPage only if faqItems.length>=4; UI ArticleFaq shows any; 5 posts with 3 FAQs
fix: emit FAQPage when faqItems.length>=1

F07 DONE P1 status=done path=LegalService Organization
evidence: Person wires NAP via env; Organization omits address/telephone; prod NAP env empty
fix: wire `readOfficeNap` into `buildOrganizationSchema`; live NAP remains empty until env set (BLOCKED NAP values)

F08 DONE P2 status=done path=/search/
evidence: BreadcrumbList only; SearchAction exists on WebSite; page noindex
fix: add WebPage node

F09 DONE P2 status=done path=/media/
evidence: OWNED_CHANNELS visible list; no ItemList; DOCUMENTED_APPEARANCES=[]
fix: ItemList for owned channels (skip empty appearances)

F10 DONE P2 status=done path=BlogPosting
evidence: `about: PERSON_REF` on every article (topical posts are not “about” the person)
fix: remove BlogPosting.about Person; keep author

F11 DONE P2 status=done path=inLanguage
evidence: kit wants BCP47 `he-IL`; emitters use `he`
fix: align structured-data + article/person image objects to `he-IL`

F12 DONE P2 status=done path=/blog/[slug]/ breadcrumbs
evidence: category crumb gated by shouldIndexCategory; thin cats (22) omit existing `/categories/{slug}/` hubs
fix: always include category crumb when category page exists

F13 DONE P2 status=done path=buildBreadcrumbSchema
evidence: call-site typos cause slash drift
fix: normalize non-root paths to end with `/`

## out_of_scope_blocked
B01 BLOCKED owner: no published street/phone/locality in repo, /contact/, MDX, or live avniguy (email-only). guyavni.co.il unreachable (HTTP 000). Prod Vercel already has empty NEXT_PUBLIC_OFFICE_LOCALITY / NEXT_PUBLIC_OFFICE_STREET / NEXT_PUBLIC_OFFICE_PHONE; wiring + production warnProductionEnvGaps OK. Owner must supply real values for those three keys.
B02 DONE intentional: DOCUMENTED_APPEARANCES=[] — no earned media URLs on site; owned-channels ItemList already emitted; do not invent.
B03 SKIP: ADR/ absent — no formal SEO ADR invented; plan pillar from kit+SSOT only.

