# 053 AEO GEO AI appearances

ADR: seo , kit-structured-data ssot-repo-structure
audit: OWNER-REPORTS/011_aeo_geo_ai_appearances_2026-11-23.md

## goal
Close all code-doable AEO/GEO/AI-appearance findings F03–F17. Leave NAP values, earned sameAs, GSC Include, reviewedBy as BLOCKED owner.

## todos
- [x] F12 robots Allow Applebot-Extended + Bingbot (+ Applebot)
- [x] F13 vercel /feed.xml → /rss.xml
- [x] F07+F14 byline author→/about/ + always עודכן stamp
- [x] F08 deepen home FAQ answers with steps/links
- [x] F06 article Speakable (visible lead + BlogPosting.speakable)
- [x] F03+F04+F16 citability + answer-first via project validator + content-seo-quality (kit standards reverted — lock drift)
- [x] F09 regenerate-llms-full script from clean MDX; regenerate; hook publish
- [x] F10 geoKeywords on local-intent recent posts (ישראל)
- [x] F05 FAQ frontmatter batch for non-quarantined substantial posts lacking faq/H2
- [x] F03 cheap cites deferred — cluster 0021–0039 already have מקורות; mass rewrite out of scope
- [x] F17 tags in sitemap when non-thin
- [x] F15 mark plan 004 todos done
- [x] F11 verify IndexNow path; Bingbot not blocked
- [x] F01/F02/F19 leave BLOCKED with evidence in 011
- [x] verify build:ci + smoke + JSON-LD/Speakable/llms
- [x] PR merge cleanup + production READY (#220, dpl READY sha 40144cd)

## non-goals
- inventing NAP / Bar / LinkedIn / Wikidata
- mass rewrite of all posts
- claiming GSC Include
- FAQ-schema theater without visible FAQ
- ADR file creation (ADR/ absent)

## exclusive areas
- public/robots.txt, vercel.json
- BlogPostLayout, blog/[slug], speakable helpers
- loadHomeData FAQ
- scripts/regenerate-llms-full.mjs (+ publish hook)
- content validators / content-seo-quality / optional kit standards
- selected MDX faq/geoKeywords
- sitemap tags
- OWNER-REPORTS/011 + plan 004 close
