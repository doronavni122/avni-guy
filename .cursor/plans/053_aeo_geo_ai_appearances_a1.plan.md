# 053 AEO GEO AI appearances

ADR: seo , kit-structured-data ssot-repo-structure
audit: OWNER-REPORTS/011_aeo_geo_ai_appearances_2026-11-23.md

## goal
Close all code-doable AEO/GEO/AI-appearance findings F03–F17. Leave NAP values, earned sameAs, GSC Include, reviewedBy as BLOCKED owner.

## todos
- [ ] F12 robots Allow Applebot-Extended + Bingbot (+ Applebot)
- [ ] F13 vercel /feed.xml → /rss.xml
- [ ] F07+F14 byline author→/about/ + always עודכן stamp
- [ ] F08 deepen home FAQ answers with steps/links
- [ ] F06 article Speakable (visible lead + BlogPosting.speakable)
- [ ] F03+F04+F16 citability + answer-first: project validator/script + content-seo-quality; kit standards only if no lock fight
- [ ] F09 regenerate-llms-full script from clean MDX; regenerate; hook publish
- [ ] F10 geoKeywords on local-intent recent posts (ישראל)
- [ ] F05 FAQ frontmatter batch for non-quarantined substantial posts lacking faq/H2
- [ ] F03 cheap: strengthen מקורות/נכון ל on a few recent thin-cite posts if high-confidence
- [ ] F17 tags in sitemap when non-thin
- [ ] F15 mark plan 004 todos done
- [ ] F11 verify IndexNow path; Bingbot not blocked
- [ ] F01/F02/F19 leave BLOCKED with evidence in 011
- [ ] verify build:ci + smoke + JSON-LD/Speakable/llms
- [ ] PR merge cleanup + production READY

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
