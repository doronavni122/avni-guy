# 052 SEO schema JSON-LD gaps

ADR: seo , kit-structured-data ssot-repo-structure
audit: OWNER-REPORTS/010_seo_schema_jsonld_audit_2026-11-23.md

## goal
Close all audit findings F01–F13 (P0→P2). Leave NAP values and earned media BLOCKED without inventing data.

## todos
- [ ] F01+F13 trailing-slash breadcrumb normalize + fix `/blog` `/contact` call sites
- [ ] F03 BlogPosting `@id`
- [ ] F10 remove BlogPosting.about Person
- [ ] F11 inLanguage he-IL
- [ ] F07 Organization NAP wiring via readOfficeNap
- [ ] F04 archive CollectionPage unique @id
- [ ] F05 SiteShell lean Person when missing
- [ ] F06 FAQPage when faqItems.length >= 1
- [ ] F02 tag hub CollectionPage + ItemList
- [ ] F08 search WebPage
- [ ] F09 media ItemList owned channels
- [ ] F12 always include category crumb on articles
- [ ] verify build+dev+live JSON-LD spot-check
- [ ] PR merge cleanup deploy

## non-goals
- new articles
- inventing office NAP or media appearances
- ADR file creation (ADR/ absent)
