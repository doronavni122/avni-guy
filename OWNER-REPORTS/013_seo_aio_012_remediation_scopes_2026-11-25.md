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
| F04 | TRUE | 0.99 | IN_REPO → blogposting-inline-author |
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
| F15 | FALSE | 0.99 | SKIP permanently — prod INDEXNOW_KEY set; key file + post-deploy pings + POST /api/indexnow/ 200 |
| F16 | TRUE | 0.99 | IN_REPO → well-known-agent-card |
| F17 | TRUE | 0.99 | IN_REPO → imageobject-width-height (merge w/ F03 surface) |
| F18 | TRUE | 0.99 | IN_REPO → article-robots-og-freshness (w/ F19) |
| F19 | TRUE | 0.99 | merged → article-robots-og-freshness |
| F20 | TRUE | 0.99 | IN_REPO → rss-language-he-il |
| F21 | TRUE | 0.96 | OPERATOR-blocked (guyavni TLS / opt-out) |
| F22 | TRUE | 0.99 | IN_REPO → guy-about-entity-consolidation |
| F23 | TRUE | 0.99 | IN_REPO → services-offer-catalog-jsonld |
| F24 | TRUE | 0.99 | IN_REPO → person-attorney-schema-type |
| F25 | TRUE | 0.99 | IN_REPO → sitemap-hub-lastmod-refresh |
| F26 | skip-myth | 0.95 | SKIP (no in-repo AIO schema DoD) |
| F27 | skip-myth | 0.95 | SKIP (llms.txt not Google lever) |
| F28 | TRUE | 0.99 | OPERATOR-blocked (GSC — owner click only) |
| F29 | skip-myth | 0.92 | SKIP (Speakable beta product limit) |
| F30 | TRUE | 0.98 | OPERATOR-blocked (phone NAP) |

**Outcome (ground-truth interrupt 2026-11-25):** 29 TRUE / F15 FALSE→SKIP. IN_REPO includes restored F04/F22/F25. OPERATOR-blocked: F01 F02 F07 F21 F28 F30 (no invent). Myth SKIP: F26 F27 F29. IndexNow SKIP: F15.

---

## Scopes (IN_REPO)

- [ ] **org-logo-raster-jsonld** — Replace SVG-only Organization.logo with crawlable high-res raster ImageObject (+ width/height). Sources: F03 (+ F17 org half). DoD: logo ImageObject uses raster URL with width+height; SVG may remain visible UI.
- [ ] **imageobject-width-height** — Person (and remaining Org) ImageObjects emit width/height pixels. Sources: F17. DoD: live Person/Org ImageObjects include numeric width+height.
- [ ] **article-multi-aspect-imageobject** — BlogPosting.image as multi-aspect ImageObject set (1x1, 4x3, 16x9) per Google Article docs. Sources: F05. DoD: schema emits ImageObject array with aspect variants (or documented single-aspect fallback with dimensions).
- [ ] **blogposting-inline-author** — BlogPosting.author includes inline author.name + author.url (not @id-only) per Google Article author markup. Sources: F04. DoD: BlogPosting.author node has name+url (may still @id).
- [ ] **blogposting-citation-schema** — Emit schema.org `citation` for primary-law/gov outbound sources when article metadata provides them. Sources: F06. DoD: articles with known primary cites include citation in BlogPosting; no invented URLs.
- [ ] **about-profilepage-jsonld** — `/about/` emits ProfilePage (or WebPage subtype) with mainEntity Person per Search Central ProfilePage guidance. Sources: F08. DoD: about JSON-LD uses ProfilePage + mainEntity Person @id.
- [ ] **home-breadcrumb-jsonld** — Home JSON-LD includes BreadcrumbList consistent with other hubs. Sources: F09. DoD: home @graph includes BreadcrumbList.
- [ ] **home-speakable-spec** — Home gains visible `.speakable-voice` + SpeakableSpecification. Sources: F10. DoD: home HTML has speakable node; JSON-LD has SpeakableSpecification.
- [ ] **answer-hubs-speakable** — Add SpeakableSpecification (+ voice nodes) to answer hubs: /contact/ /sheelot/ /media/ /tags/ /editorial-policy/ /guy-avni/ /blog/. Sources: F11. DoD: each listed hub emits speakable when FAQ/answer intent present.
- [ ] **trim-deprecated-howto-jsonld** — Remove or gate HowTo JSON-LD on /, /about/, /services/ (Google HowTo rich results deprecated 2023); keep answer HTML. Sources: F12. DoD: no HowTo in those pages’ JSON-LD (or gated behind explicit non-Google flag with comment).
- [ ] **faq-jsonld-policy-align** — Align FAQPage emission with YMYL commercial reality: keep for Bing/entity understanding OR trim sitewide emission to hubs that need it; document decision in code comment. Sources: F13. DoD: intentional policy in code; no FAQ theater for Google-only rich results.
- [x] **website-searchaction-align** — Fix WebSite SearchAction targeting noindex `/search/` (remove potentialAction or point at indexable surface). Sources: F14. DoD: either no SearchAction or target is indexable; search page robots unchanged unless product chooses index. (plan 056; task 789)
- [x] **well-known-agent-card** — Serve agent card at `/.well-known/agent-card.json` (alias or route) matching `/agent-card.json`. Sources: F16. DoD: curl `/.well-known/agent-card.json` → 200 same body as `/agent-card.json`. (plan 055; task 788)
- [ ] **article-robots-og-freshness** — Articles: robots `max-image-preview:large` (+ related snippet directives as appropriate); OG `article:published_time` / `article:modified_time`. Sources: F18 F19. DoD: live article HTML includes both.
- [x] **rss-language-he-il** — RSS channel language `he-IL` to match site/JSON-LD BCP47. Sources: F20. DoD: rss.xml `<language>he-IL</language>`. (plan 054; task 787)
- [ ] **services-offer-catalog-jsonld** — `/services/` adds OfferCatalog and/or typed Service nodes for practice offerings. Sources: F23. DoD: services JSON-LD includes OfferCatalog or Service @types matching visible offerings (no invented prices).
- [ ] **person-attorney-schema-type** — Person uses schema.org Attorney (or Person+Attorney dual-type) where attorney identity is claimed. Sources: F24. DoD: Person @type includes Attorney; no false credentials.
- [ ] **guy-about-entity-consolidation** — Reduce entity dilution between indexable `/guy-avni/` and `/about/` Person signals (canonical, noindex bridge, or clearer mainEntity). Sources: F22. DoD: one primary entity profile for KG/AI; bridge page does not compete as duplicate Person hub.
- [ ] **sitemap-hub-lastmod-refresh** — Refresh sitemap lastmod on top hubs so they reflect current editorial freshness. Sources: F25. DoD: hub lastmod dates bump when content actually changes (not stale static stamps).

---

## OPERATOR (blocked — document only; do not invent NAP/phone/Bar/media)

- [ ] **OPERATOR-nap-localbusiness** — Owner must set claimed `NEXT_PUBLIC_OFFICE_*` NAP before LocalBusiness dual-type + telephone/PostalAddress. Sources: F01 F30. DoD: runbook steps recorded; no invented phone/address shipped.
- [ ] **OPERATOR-israel-bar-sameas** — Owner supplies individual Israel Bar listing URL via `PERSON_ISRAEL_BAR_URL`. Sources: F02. DoD: instructions only; empty env stays omit.
- [ ] **OPERATOR-reviewedby-identity** — reviewedBy only after real human reviewer identity exists. Sources: F07. DoD: blocker recorded; no fake reviewer.
- [ ] **OPERATOR-guyavni-sameas-tls** — Fix guyavni.co.il TLS or set `PERSON_OFFICE_SITE_URL=''` opt-out. Sources: F21. DoD: instructions recorded; agent does not invent replacement URL.
- [ ] **OPERATOR-gsc-generative** — Owner confirms GSC Search generative AI = Include + baselines apex. Sources: F28. DoD: verification steps (cannot click GSC).

---

## SKIP (myth / false / no concrete in-repo DoD)

- [x] **SKIP-indexnow-f15** — F15 FALSE: prod INDEXNOW_KEY already set; public key file written; post-deploy IndexNow batches succeeded; live POST `/api/indexnow/` → 200 `{"ok":true}`. Do not remediate.
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
