# 011 AEO / GEO / AI appearances — findings 2026-11-23

source: 6 research/audit workers synthesis; live repo + main@2455c75 (NAP gate #219 already merged)
plan: `.cursor/plans/053_aeo_geo_ai_appearances_a1.plan.md`
consensus: Google AIO = classic SEO (index/snippet/GSC Include ops + answer-first HE YMYL + EEAT + primary law cites). Non-Google: SearchBots allow + HTML passages + entity truth + freshness. NOT llms/FAQ-schema/chunking theater alone.

## Checklist

| id | sev | finding | status | evidence / action |
|----|-----|---------|--------|-------------------|
| F01 | P0 | Entity NAP/sameAs values | BLOCKED owner | Wiring+empty prod keys+warnProductionEnvGaps exist (010 B01, #218/#219). No street/phone/locality in published content. Do not invent. |
| F02 | P0 | sameAs Bar/LinkedIn/Wikidata | BLOCKED owner | Env keys empty; generic Bar portal rejected in schema-person. |
| F03 | P0 | Primary-source + נכון ל־ citability rule | DONE code | `scripts/check-aeo-citability.mjs` + content-seo-quality AEO note. Kit standards skipped (lock drift blocked). |
| F04 | P0 | Answer-first / definition-led opening | DONE code | Same checker enforces TL;DR + lead length; Speakable lead surfaces quotable HE. |
| F05 | P1 | FAQ coverage gaps | DONE code | +24 quality faq FM on non-quarantined posts (93 total with faq). Cluster 0021–0039 already had faq. |
| F06 | P1 | Article Speakable | DONE code | extractArticleSpeakableLead + visible `.speakable-voice` + BlogPosting.speakable. |
| F07 | P1 | Visible review/update stamp | DONE code | Always עודכן + מאת→/about/. reviewedBy BLOCKED (no real reviewer). |
| F08 | P1 | Home FAQ thin answers | DONE code | loadHomeData answers lengthened with steps/paths. |
| F09 | P1 | llms-full.txt noise | DONE code | regenerate-llms-full.mjs (skip quarantine) + publish hook; file regenerated. |
| F10 | P1 | geoKeywords unused | DONE code | geoKeywords: ישראל on 15 local-intent posts. |
| F11 | P1 | Bing/IndexNow | DONE verify | Existing IndexNow path; Bingbot Allow added. INDEXNOW_KEY empty prod = ops warn. |
| F12 | P1 | robots Applebot-Extended / agents | DONE code | Applebot, Applebot-Extended, Bingbot Allow. |
| F13 | P1 | /feed.xml alias | DONE code | vercel permanent redirect → /rss.xml. |
| F14 | P1 | Author byline → /about/ | DONE code | Header byline link + AuthorBio. |
| F15 | P1 | Plan 004 mcp citation bait | DONE | Plan todos marked [x]; llms/agent-card verified. |
| F16 | P1 | Content-kit GEO citability note | DONE project | Project rule+script (kit managed standards reverted — lock drift). |
| F17 | P2 | Tag URLs in sitemap | DONE code | Non-thin tags (≥4 posts) via shouldIndexTag. |
| F18 | P2 | Speakable more hubs | SKIP | categories/services/about already. |
| F19 | ops | GSC Include generative | BLOCKED owner | Operator-only — do not claim. See plan 041. |

## Non-goals / DO NOT
- Invent NAP, Bar listing, LinkedIn, Wikidata, media
- Mass rewrite 162 posts / AI spam pages
- Fake “ChatGPT recommends”
- Fluff docs beyond this inventory + plan + task_graph

## Verify targets
- build:ci; smoke / /blog/ /about/ /robots.txt /llms-full.txt /rss.xml /feed.xml
- JSON-LD Speakable on sample article; FAQPage when faq present
- robots Allow Applebot-Extended + Bingbot
