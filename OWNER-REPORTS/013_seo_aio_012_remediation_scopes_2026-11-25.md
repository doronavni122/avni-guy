# SEO/AIO 012 technical gaps — remediation scopes

**Source:** `OWNER-REPORTS/012_seo_aio_technical_gaps_2026-11-25.tmo`  
**Created:** 2026-11-25  
**Mode:** sequential (shared schema/metadata surfaces)  
**Status:** owner workfile — not SSOT  
**DoD:** every IN_REPO scope `[x]` only after plan → implement → verify → post-impl → governance → review-scope → validate_true (conf > 0.95)

---

## VALIDATE_TRUE (`.commends/TODO_validate_true.md`) — 2026-11-25

**Rule:** implement only TRUE with confidence > 0.95. Drop PARTIAL/UNCONFIRMED below threshold. Owner-blocked = OPERATOR (instructions only). Myths = SKIP.

| ID | Verdict | Conf | Disposition |
|----|---------|------|-------------|
| F01 | TRUE | 0.98 | OPERATOR-blocked (NAP env) |
| F02 | TRUE | 0.97 | OPERATOR-blocked (Bar URL) |
| F03 | TRUE | 0.99 | IN_REPO → org-logo-raster-jsonld |
| F04 | PARTIAL | 0.88 | DROP (conf≤0.95) |
| F05 | TRUE | 0.99 | IN_REPO → article-multi-aspect-imageobject |
| F06 | TRUE | 0.99 | IN_REPO → blogposting-citation-schema |
| F07 | TRUE | 0.99 | OPERATOR-blocked (reviewedBy identity) |
| F08 | TRUE | 0.99 | IN_REPO → about-profilepage-jsonld |
| F09 | TRUE | 0.99 | IN_REPO → home-breadcrumb-jsonld |
| F10 | TRUE | 0.99 | IN_REPO → home-speakable-spec |
| F11 | TRUE | 0.98 | IN_REPO → answer-hubs-speakable |
| F12 | TRUE | 0.97 | IN_REPO → trim-deprecated-howto-jsonld |
| F13 | TRUE | 0.98 | IN_REPO → faq-jsonld-policy-align |
| F14 | TRUE | 0.99 | IN_REPO → website-searchaction-align |
| F15 | TRUE | 0.96 | OPERATOR-blocked (INDEXNOW_KEY) |
| F16 | TRUE | 0.99 | IN_REPO → well-known-agent-card |
| F17 | TRUE | 0.99 | IN_REPO → imageobject-width-height (merge w/ F03 surface) |
| F18 | TRUE | 0.99 | IN_REPO → article-robots-og-freshness (w/ F19) |
| F19 | TRUE | 0.99 | merged → article-robots-og-freshness |
| F20 | TRUE | 0.99 | IN_REPO → rss-language-he-il |
| F21 | TRUE | 0.96 | OPERATOR-blocked (guyavni TLS / opt-out) |
| F22 | PARTIAL | 0.82 | DROP (conf≤0.95) |
| F23 | TRUE | 0.99 | IN_REPO → services-offer-catalog-jsonld |
| F24 | TRUE | 0.99 | IN_REPO → person-attorney-schema-type |
| F25 | PARTIAL | 0.90 | DROP (conf≤0.95) |
| F26 | skip-myth | 0.95 | SKIP (no in-repo AIO schema DoD) |
| F27 | skip-myth | 0.95 | SKIP (llms.txt not Google lever) |
| F28 | UNCONFIRMED | 0.40 | OPERATOR-blocked (GSC) |
| F29 | skip-myth | 0.92 | SKIP (Speakable beta product limit) |
| F30 | TRUE | 0.98 | OPERATOR-blocked (phone NAP) |

**Outcome:** PASS filter — 15 IN_REPO scopes (F18+F19 merged; F03+F17 kept adjacent), 7 OPERATOR-blocked, 3 SKIP, 3 DROP.

---

## Scopes (IN_REPO)

- [ ] **org-logo-raster-jsonld** — Replace SVG-only Organization.logo with crawlable high-res raster ImageObject (+ width/height). Sources: F03 (+ F17 org half). DoD: logo ImageObject uses raster URL with width+height; SVG may remain visible UI.
- [ ] **imageobject-width-height** — Person (and remaining Org) ImageObjects emit width/height pixels. Sources: F17. DoD: live Person/Org ImageObjects include numeric width+height.
- [ ] **article-multi-aspect-imageobject** — BlogPosting.image as multi-aspect ImageObject set (1x1, 4x3, 16x9) per Google Article docs. Sources: F05. DoD: schema emits ImageObject array with aspect variants (or documented single-aspect fallback with dimensions).
- [ ] **blogposting-citation-schema** — Emit schema.org `citation` for primary-law/gov outbound sources when article metadata provides them. Sources: F06. DoD: articles with known primary cites include citation in BlogPosting; no invented URLs.
- [ ] **about-profilepage-jsonld** — `/about/` emits ProfilePage (or WebPage subtype) with mainEntity Person per Search Central ProfilePage guidance. Sources: F08. DoD: about JSON-LD uses ProfilePage + mainEntity Person @id.
- [ ] **home-breadcrumb-jsonld** — Home JSON-LD includes BreadcrumbList consistent with other hubs. Sources: F09. DoD: home @graph includes BreadcrumbList.
- [ ] **home-speakable-spec** — Home gains visible `.speakable-voice` + SpeakableSpecification. Sources: F10. DoD: home HTML has speakable node; JSON-LD has SpeakableSpecification.
- [ ] **answer-hubs-speakable** — Add SpeakableSpecification (+ voice nodes) to answer hubs: /contact/ /sheelot/ /media/ /tags/ /editorial-policy/ /guy-avni/ /blog/. Sources: F11. DoD: each listed hub emits speakable when FAQ/answer intent present.
- [ ] **trim-deprecated-howto-jsonld** — Remove or gate HowTo JSON-LD on /, /about/, /services/ (Google HowTo rich results deprecated 2023); keep answer HTML. Sources: F12. DoD: no HowTo in those pages’ JSON-LD (or gated behind explicit non-Google flag with comment).
- [ ] **faq-jsonld-policy-align** — Align FAQPage emission with YMYL commercial reality: keep for Bing/entity understanding OR trim sitewide emission to hubs that need it; document decision in code comment. Sources: F13. DoD: intentional policy in code; no FAQ theater for Google-only rich results.
- [ ] **website-searchaction-align** — Fix WebSite SearchAction targeting noindex `/search/` (remove potentialAction or point at indexable surface). Sources: F14. DoD: either no SearchAction or target is indexable; search page robots unchanged unless product chooses index.
- [ ] **well-known-agent-card** — Serve agent card at `/.well-known/agent-card.json` (alias or route) matching `/agent-card.json`. Sources: F16. DoD: curl `/.well-known/agent-card.json` → 200 same body as `/agent-card.json`.
- [ ] **article-robots-og-freshness** — Articles: robots `max-image-preview:large` (+ related snippet directives as appropriate); OG `article:published_time` / `article:modified_time`. Sources: F18 F19. DoD: live article HTML includes both.
- [ ] **rss-language-he-il** — RSS channel language `he-IL` to match site/JSON-LD BCP47. Sources: F20. DoD: rss.xml `<language>he-IL</language>`.
- [ ] **services-offer-catalog-jsonld** — `/services/` adds OfferCatalog and/or typed Service nodes for practice offerings. Sources: F23. DoD: services JSON-LD includes OfferCatalog or Service @types matching visible offerings (no invented prices).
- [ ] **person-attorney-schema-type** — Person uses schema.org Attorney (or Person+Attorney dual-type) where attorney identity is claimed. Sources: F24. DoD: Person @type includes Attorney; no false credentials.

---

## OPERATOR (blocked — document only; do not invent NAP/phone/Bar/media/IndexNow secrets)

- [ ] **OPERATOR-nap-localbusiness** — Owner must set claimed `NEXT_PUBLIC_OFFICE_*` NAP before LocalBusiness dual-type + telephone/PostalAddress. Sources: F01 F30. DoD: runbook steps recorded; no invented phone/address shipped.
- [ ] **OPERATOR-israel-bar-sameas** — Owner supplies individual Israel Bar listing URL via `PERSON_ISRAEL_BAR_URL`. Sources: F02. DoD: instructions only; empty env stays omit.
- [ ] **OPERATOR-reviewedby-identity** — reviewedBy only after real human reviewer identity exists. Sources: F07. DoD: blocker recorded; no fake reviewer.
- [ ] **OPERATOR-indexnow-key** — Set `INDEXNOW_KEY` on Vercel for public key file + Bing pings. Sources: F15. DoD: owner env steps recorded.
- [ ] **OPERATOR-guyavni-sameas-tls** — Fix guyavni.co.il TLS or set `PERSON_OFFICE_SITE_URL=''` opt-out. Sources: F21. DoD: instructions recorded; agent does not invent replacement URL.
- [ ] **OPERATOR-gsc-generative** — Owner confirms GSC Search generative AI = Include + baselines apex. Sources: F28. DoD: verification steps (cannot click GSC).

---

## SKIP (myth / no concrete in-repo DoD)

- [x] **SKIP-aio-schema-myth** — F26: no special AIO schema; classic index/snippet + EEAT only. Reason: no implementable DoD beyond existing SEO work.
- [x] **SKIP-llms-txt-google** — F27: llms.txt ignored by Google generative features; keep for non-Google only. Reason: no Google ranking change.
- [x] **SKIP-speakable-beta-limit** — F29: SpeakableSpecification HE YMYL not reliable Google rich result. Reason: product limitation; speakable hygiene covered by home/answer-hubs scopes.

---

## Execution

Follow `.cursor/skills/scope-list-implementation-loop/SKILL.md`.  
State: `notes/implementations/scope_loop_state.json`  
DAG: `notes/implementations/scope_dag.json`  
Next plan numbers start at **054**.  
Branch: `feature/seo-aio-012-gaps-2026-11-25` (do not commit on `main`).
