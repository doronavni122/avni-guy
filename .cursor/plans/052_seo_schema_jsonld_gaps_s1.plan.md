# 052 SEO schema JSON-LD gaps

ADR: seo , kit-structured-data ssot-repo-structure
audit: OWNER-REPORTS/010_seo_schema_jsonld_audit_2026-11-23.md

## goal
Close all audit findings F01–F13 (P0→P2). Leave NAP values and earned media BLOCKED without inventing data.

## todos
- [x] F01+F13 trailing-slash breadcrumb normalize + fix `/blog` `/contact` call sites
- [x] F03 BlogPosting `@id`
- [x] F10 remove BlogPosting.about Person
- [x] F11 inLanguage he-IL
- [x] F07 Organization NAP wiring via readOfficeNap
- [x] F04 archive CollectionPage unique @id
- [x] F05 SiteShell lean Person when missing
- [x] F06 FAQPage when faqItems.length >= 1
- [x] F02 tag hub CollectionPage + ItemList
- [x] F08 search WebPage
- [x] F09 media ItemList owned channels
- [x] F12 always include category crumb on articles
- [ ] verify build+dev+live JSON-LD spot-check
- [ ] PR merge cleanup deploy

## non-goals
- new articles
- inventing office NAP or media appearances
- ADR file creation (ADR/ absent)
