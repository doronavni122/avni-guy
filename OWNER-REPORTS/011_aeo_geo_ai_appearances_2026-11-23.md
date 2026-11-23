# 011 AEO / GEO / AI appearances — findings 2026-11-23

source: 6 research/audit workers synthesis; live repo + main@2455c75 (NAP gate #219 already merged)
plan: `.cursor/plans/053_aeo_geo_ai_appearances_a1.plan.md`
consensus: Google AIO = classic SEO (index/snippet/GSC Include ops + answer-first HE YMYL + EEAT + primary law cites). Non-Google: SearchBots allow + HTML passages + entity truth + freshness. NOT llms/FAQ-schema/chunking theater alone.

## Checklist

| id | sev | finding | status | evidence / action |
|----|-----|---------|--------|-------------------|
| F01 | P0 | Entity NAP/sameAs values | BLOCKED owner | Wiring+empty prod keys+warnProductionEnvGaps exist (010 B01, #218/#219). No street/phone/locality in published content. Do not invent. |
| F02 | P0 | sameAs Bar/LinkedIn/Wikidata | BLOCKED owner | Env keys empty; generic Bar portal rejected in schema-person. |
| F03 | P0 | Primary-source + נכון ל־ citability rule | OPEN→code | sources.md weak; only ~8 posts say נכון ל; 44 lack מקורות. Enforce in kit/validator or project script; cheap cite fixes on recent only. |
| F04 | P0 | Answer-first / definition-led opening | OPEN→code | Kit has TL;DR; check-article soft on missing TL;DR; strengthen invariant HE definition + TL;DR. |
| F05 | P1 | FAQ coverage gaps | OPEN→code | 69 faq FM; 59 neither faq nor H2; cluster 0021–0039 already have faq. Add quality FAQ to non-quarantined substantial posts. |
| F06 | P1 | Article Speakable | OPEN→code | Hubs have Speakable; blog posts do not. Mirror hub: visible lead + attachSpeakable on BlogPosting. |
| F07 | P1 | Visible review/update stamp | PARTIAL | Layout shows עודכן when updatedDate set; add always-stamp + author→/about/ in byline. reviewedBy BLOCKED (no real reviewer). |
| F08 | P1 | Home FAQ thin answers | OPEN→code | loadHomeData faqItems commodity-short; lengthen with steps/links. |
| F09 | P1 | llms-full.txt noise | OPEN→code | File polluted with quarantine/template scrapings; need clean regen from MDX + hook publish. |
| F10 | P1 | geoKeywords unused | OPEN→code | Schema supports; 0 posts use. Fill ישראל (or true locality) on local-intent recent only — no spam. |
| F11 | P1 | Bing/IndexNow | DONE verify | scripts/post-deploy-indexnow.mjs + api/indexnow + layout msvalidate. Add Bingbot Allow in robots. INDEXNOW_KEY empty prod = ops warn exists. |
| F12 | P1 | robots Applebot-Extended / agents | OPEN→code | Missing Applebot-Extended, Bingbot, Applebot; policy already Allow for OAI/Claude/Perplexity. |
| F13 | P1 | /feed.xml alias | OPEN→code | rss.xml 200; feed.xml 404 (006). Trivial vercel redirect. |
| F14 | P1 | Author byline → /about/ | PARTIAL | AuthorBio links /about/; header byline lacks author name link. |
| F15 | P1 | Plan 004 mcp citation bait | OPEN→close | llms.txt documents search/mcp/agent-card; mark plan todos done. |
| F16 | P1 | Content-kit GEO citability note | OPEN→code | Prefer project rule/script if kit.lock managed drift; small standards patch only with sync approve. |
| F17 | P2 | Tag URLs in sitemap | OPEN→if time | sitemap omits /tags/{tag}/; add when postCount ≥ thin threshold. |
| F18 | P2 | Speakable more hubs | SKIP unless time | categories/services/about already. |
| F19 | ops | GSC Include generative | BLOCKED owner | Operator-only; leave checklist note — do not claim. See plan 041. |

## Non-goals / DO NOT
- Invent NAP, Bar listing, LinkedIn, Wikidata, media
- Mass rewrite 162 posts / AI spam pages
- Fake “ChatGPT recommends”
- Fluff docs beyond this inventory + plan + task_graph

## Verify targets
- build:ci; smoke / /blog/ /about/ /robots.txt /llms-full.txt /rss.xml /feed.xml
- JSON-LD Speakable on sample article; FAQPage when faq present
- robots Allow Applebot-Extended + Bingbot
