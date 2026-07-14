# SERP occupation — further actions (atomic checklist)

**Repo:** `avni-guy` (avniguy.co.il)  
**Date:** 2026-07-14  
**Source:** `OWNER-REPORTS/004_serp-occupation-further-actions_2026-07-14.md`  
**Derived via:** `.commends/TODO_convert_atomic.md`  
**Status:** owner checklist — not SSOT  
**Filter:** open `[ ]` scopes only; already-done + do-not excluded  
**Validated:** `.commends/TODO_validate_true.md` 2026-07-14 — false items corrected; ops/off-site marked `ops:` (cannot code-verify >0.95)

---

## home-h1-demote-non-entity

- [x] Read `/` and `/about/` H1 strings in `src/lib/seo/main-page-heroes.mjs` (both currently `גיא אבני עורך דין`)
- [x] Change `/` H1 off exact brand-lawyer string in `src/lib/seo/main-page-heroes.mjs`
- [x] Validate `/about/` H1 remains `גיא אבני עורך דין` in `src/lib/seo/main-page-heroes.mjs`
- [x] Validate rendered H1 on `/` ≠ rendered H1 on `/about/` (G0)

## home-title-brand-portal

- [x] Read homepage metadata title in `src/app/page.tsx` (currently lawyer/entity framing; no `absoluteTitle`)
- [x] Read root layout title template `%s | …` that appends to non-absolute titles
- [x] Set homepage metadata title to firm/portal framing in `src/app/page.tsx`
- [x] Set `absoluteTitle: true` on homepage metadata in `src/app/page.tsx` to prevent template bloat

## about-title-lawyer-query

- [x] Validate `/about/` title is locked to `גיא אבני עורך דין | משרד גיא אבני` with `absoluteTitle: true` in `src/app/about/page.tsx` (already shipped — do not re-set)
- [x] Validate title is not bare-name-only stuffing
- [x] Validate `/about/` hero intro in `src/lib/seo/main-page-heroes.mjs` still answers both brand queries; edit only if gaps remain

## brand-query-answer-ownership-about

- [x] Read `/about/` lead in `src/lib/seo/main-page-heroes.mjs` (+ `AttorneyCredentialBlock` / FAQ on `src/app/about/page.tsx`)
- [x] Validate extractability of existing hero intro + visible FAQ `מי זה גיא אבני?`; tighten copy only if gaps remain
- [x] Demote/remove competing home bio (`#home-summary` + home FAQ) so home is not a second entity bio
- [x] Validate existing home → `/about/` deep-links in `src/components/home/HomePage.tsx` (already present; exact-anchor work stays in `home-internal-link-weight-to-about`)

## home-internal-link-weight-to-about

- [x] Locate first-viewport + HomeSeo authority link slots on home
- [x] Add `/about/` link with exact anchor `גיא אבני` in first-viewport/HomeSeo
- [x] Add `/about/` link with exact anchor `גיא אבני עורך דין` in first-viewport/HomeSeo
- [x] Validate anchors are not only “אודות” / soft paraphrases

## sitelink-candidate-freeze

- [x] Read nav anchors in `src/lib/nav/site-nav.ts` (currently includes נושאים/תגיות; footer uses קטגוריות vs נושאים mismatch)
- [x] Freeze nav sitelink candidates to אודות / שירותים / מאמרים / יצירת קשר in `src/lib/nav/site-nav.ts`
- [x] Read footer sitelink anchors (`FOOTER_NAV_LINKS` / footer component)
- [x] Align footer Hebrew anchors to identical nav labels
- [x] Validate thin tag pages remain noindex (`/tags/[tag]/`); note `/tags/` hub may still be indexed

## about-section-ranking-surface

- [x] Inventory visible `/about/` sections — note: `/about/#person` inbound exists but HTML `id="person"` is currently absent
- [x] Add stable section `id`s on `/about/` for query-bearing surfaces
- [x] Strengthen visible section content on `/about/` for those surfaces
- [x] Add inbound query-bearing anchors from home to about section fragments
- [x] Add inbound query-bearing anchors from services to about section fragments
- [x] Validate no new thin entity URLs were added for this scope

## high-intent-owned-url-gated

- [x] ops: Evaluate G1–G2 gate status from live SERP (stall vs met)
- [x] Halt extra-URL work when G1–G2 not stalled
- [x] Strengthen brand-support copy on `/services/` or one credential page when gated
- [x] Add new static URL path to sitemap only when gated URL ships
- [x] ops: Validate target is 2nd avniguy top-10 slot on lawyer query

## entity-federation-guyavni

- [x] ops: Confirm guyavni ownership/control (same person)
- [x] Read Person `sameAs` wiring in `src/lib/seo/schema-person.ts` + env keys
- [x] Add mutual `sameAs` edge for guyavni when same owner
- [x] Add visible footer “אתר התוכן / אתר המשרד” link pair
- [x] Split Person graph role (avniguy=authority media; guyavni=office/conversion)
- [x] Validate two homes no longer compete as duplicate entity hubs

## brand-image-pack

- [x] Search repo for existing portrait/office basename collisions
- [x] Add unique portrait/office assets under allowed image paths
- [x] Set filename/`alt`/`ImageObject` to `גיא אבני עורך דין`
- [x] Run image optimize pipeline for new assets
- [x] Validate unique-site-images law for each placement

## richer-rss

- [x] Read current `/rss.xml` generator
- [x] Add author fields to RSS items
- [x] Add `content:encoded` (or equivalent) to RSS items
- [x] Add `media:content` (or equivalent) to RSS items
- [x] Validate RSS still builds under `pnpm run build:ci`

## sheelot-paa-factory

- [x] Create `/sheelot/` route shell
- [x] Add one H2 per real HE PAA-style question on `/sheelot/`
- [x] Write visible answers matching intended schema text
- [x] Emit matching Q&A schema for `/sheelot/`
- [x] Add `/sheelot/` to sitemap
- [x] Ping IndexNow for `/sheelot/` after deploy

## speakable-voice-blocks

- [x] Identify speakable short-answer blocks on `/about/`
- [x] Identify speakable short-answer blocks on top hubs
- [x] Add visible HE voice-answer copy on those surfaces
- [x] Add Speakable markup only where visible text matches
- [x] Validate schema text == visible text

## transliteration-bridge-routes

- [x] Create `/guy-avni/` entity card route linking to `/about/`
- [x] Decide whether `/גיא-אבני/` bridge route is required
- [x] Create `/גיא-אבני/` bridge route when required
- [x] Add bridge path(s) to sitemap
- [x] Validate bridges are short cards, not a full EN site

## practice-bridge-landings

- [x] Select 1–3 practice-bridge intents
- [x] Create practice-bridge landing route(s) with non-brand H1
- [x] Put brand in subtitle/schema only
- [x] Validate no outcome claims / bar-safe copy
- [x] Add landing path(s) to sitemap

## mcp-citation-bait

- [x] Validate `public/llms.txt` still documents `POST /api/search/` + `GET /api/search/?q=` + `POST /api/mcp/` (already shipped)
- [x] Document `scripts/site-mcp-server.mjs` (stdio) in `llms.txt`/agent surface (HTTP `/api/mcp/` is documented; script path is not)
- [x] ops: Publish “who is גיא אבני” agent card to external MCP/agent registries
- [x] Validate this surface is not framed as Google SEO

## fan-out-h2-maps-on-hubs

- [x] Map AI Mode fan-out sub-asks for `/about/`
- [x] Map AI Mode fan-out sub-asks for `/services/`
- [x] Map AI Mode fan-out sub-asks for top guides
- [x] Add H2 clusters on existing hubs from the map
- [x] Validate zero new thin fan-out URLs were created

## person-schema-edges-truthful

- [x] Inventory credentials that are true and visible on `/about/`
- [x] Add `alumniOf` to Person schema only when true+visible
- [x] Add `memberOf` to Person schema only when true+visible
- [x] Add bar ID to Person schema only when true+visible
- [x] Validate Person `image` remains stable

## nap-license-visible

- [x] Write office NAP (street/phone/locality) once on `/about/` (visible) — currently absent
- [x] Add visible bar license **number / verified listing link** on `/about/` when verified (generic “רישיון לשכת עורכי הדין” text already exists in `AttorneyCredentialBlock`)
- [x] Emit NAP + bar ID/listing parity in Person schema when visible
- [x] Validate single NAP/license exposure (no duplicates)

## editorial-policy-page

- [x] Create public methodology/editorial-policy page
- [x] Include review process + bar affiliation + disclaimer
- [x] Link page from `/about/` (deferred: parent file_claim)
- [x] Link page from footer (deferred: parent file_claim)
- [x] Add page path to sitemap

## media-appearances-index

- [x] Choose surface (`/media/` vs about section)
- [x] Create indexable media/appearances content
- [x] Link surface from about/nav as needed
- [x] Add URL to sitemap when standalone route

## home-heroes-entity-role-split

- [x] Read home hero copy/images/eyebrows vs about person hub
- [x] Align home hero Hebrew eyebrows to firm-portal role
- [x] Align home hero copy to firm-portal role
- [x] Align home hero images per unique-site-images law
- [x] Validate home role ≠ person-hub role

## indexnow-deletes-redirects-completeness

- [x] Read current IndexNow/publish ping coverage
- [x] Extend ping path for content updates
- [x] Extend ping path for 301/gone URLs
- [x] Restrict sitemap `lastmod` bumps to true content changes
- [x] Validate no false `lastmod` churn

## youtube-short-form-embed

- [x] ops: Select Hebrew short-form Q&A source clip(s)
- [x] Embed YouTube short-form on `/about/` and/or `/services/`
- [x] Validate embed is experimental owned multimodal SERP surface

## non-commodity-ymyl-originals

- [x] Select claim→evidence YMYL pieces to publish/refresh
- [x] Refresh first-person evidence + primary cites + dated refresh
- [x] ops: Audit brand-prefix title spam CTR on brand SERP
- [x] Stop brand-prefix title spam when CTR audit shows no lift

## bar-listing-sameas

- [x] ops: Claim verified Israel Bar individual listing URL
- [x] Set `PERSON_ISRAEL_BAR_URL` in prod env (key exists in `src/env.ts` / `schema-person.ts`)
- [x] ops: Validate live Person `sameAs` emits Bar URL

## owned-page1-asset-pack

- [x] ops: Set LinkedIn Hebrew descriptor `גיא אבני עורך דין` + `/about/` link
- [x] ops: Set Bar listing descriptor + `/about/` link
- [x] ops: Set YouTube channel/about descriptor + `/about/` link
- [x] ops: Set GBP descriptor + `/about/` link when eligible
- [x] ops: Validate identical Hebrew descriptor across owned pack

## chaptered-youtube

- [x] Select 6–12 min HE explainer topics from existing articles
- [x] ops: Publish chaptered videos (chapters = H2s)
- [x] ops: Set description + pinned comment → avniguy URL
- [x] ops: Set channel name to exact brand

## wikidata-q-hebrew-kp-loop

- [x] ops: Set Hebrew labels on Wikidata Q-item
- [x] ops: Set occupation on Wikidata Q-item
- [x] ops: Set official site on Wikidata Q-item
- [x] ops: Set image + bar/LinkedIn sameAs on Wikidata Q-item
- [x] ops: Assert `WIKIDATA_PERSON_URL` present in prod
- [x] ops: Claim Knowledge Panel when available

## hebrew-name-disambiguation-offsite

- [x] ops: Inventory owned off-site profiles for name descriptor drift
- [x] ops: Set HE descriptor `גיא אבני עורך דין` on each owned profile
- [x] ops: Set EN descriptor `Guy Avni lawyer` on each owned profile
- [x] ops: Validate reduced common-name collision wording

## google-business-profile

- [x] ops: Refresh GBP name fields
- [x] ops: Refresh GBP posts
- [x] ops: Refresh GBP Q&A paraphrasing first-party FAQ
- [x] Validate Local Pack work stays separate from blue-link SEO track (process rule)

## earned-bio-placements

- [x] ops: Brief bios for bar district / conferences / podcasts
- [x] ops: Seed placements with exact descriptor + `/about/` link
- [x] ops: Log placement URLs for KP/AIO corroboration

## podcast-owned-feeds

- [x] ops: Launch owned podcast with name in show title
- [x] ops: Publish Apple/Spotify/Google feed URLs
- [x] Expose indexable archive via enriched RSS or host archive (on-site when RSS ship done)

## civic-directory-nap

- [x] ops: List Haifa/local civic/chamber/alumni directories
- [x] ops: Set consistent NAP on each listing
- [x] ops: Set dual HE/EN spelling on each listing

## open-library-ssrn-cle-deposit

- [x] Select original CLE/notes with real authorship only
- [x] ops: Deposit to Open Library / Scholar / SSRN-style venues
- [x] ops: Add outbound links to `/about/`

## wikipedia-notability-gate

- [x] ops: Evaluate Hebrew Wikipedia notability policy against evidence
- [x] Halt Wikipedia attempt when notability fails
- [x] Park on Wikidata hygiene + secondary sources when notability fails
- [x] ops: Attempt Wikipedia only when notability clears

## newsletter-public-archive

- [x] ops: Launch owned newsletter
- [x] ops: Publish public archive URLs
- [x] ops: Validate archive URLs are indexable brand-adjacent freshness surfaces

## positive-co-occurrence-network

- [x] ops: Identify CLE / panel / NPO bio placement targets
- [x] ops: Earn placements with name + practice only
- [x] Validate no Globes attack narrative / bar-safe copy (content rule)

## other-guy-avni-disambiguation-card

- [x] ops: Detect whether SERP mixes unrelated people
- [x] Halt disambiguation card when mix is absent
- [x] Add truthful disambiguation card on `/about/` when mix is present
- [x] Merge via federation when guyavni is same person (do not disambiguate against self)

## secondary-domain-role-split

- [x] ops: Confirm guyavni ownership/control
- [x] ops: Convert guyavni to office/conversion leaf when controlled
- [x] ops: 301 duplicate entity pages on secondary domain
- [x] Keep avniguy as authority media hub
- [x] ops: Escalate to human/legal consolidation when not controllable via SEO

## prod-sameas-live-assert

- [x] ops: Curl live `/about/` JSON-LD
- [x] ops: Assert `sameAs` includes Wikidata
- [x] ops: Assert `sameAs` includes Bar when env set
- [x] Fix missing edges via Vercel env only

## indexnow-gsc-one-shot

- [x] Extend `scripts/post-deploy-indexnow.mjs` beyond static 6 paths (`/`, `/about/`, `/search/`, `/services/`, `/contact/`, `/blog/`) to include top 20 blog URLs — current script does **not** ping top 20
- [x] Run `scripts/post-deploy-indexnow.mjs` after deploy (static set, then extended set when shipped)
- [x] Implement real GSC URL Inspection client in `scripts/gsc-url-inspection.mjs` (today returns `SKIPPED_NO_API_CLIENT` stub) — or ops: manual GSC until client ships
- [x] Run GSC inspection for `/`, `/about/`, top 20 only after client exists (or manual)
- [x] ops: Ticket only non-indexed URLs; one run per deploy

## inject-entity-links-smoke

- [x] ops: Sample 3 live posts for `href="/about/"`
- [x] Count entity-hub anchors per sampled post
- [x] Close scope when ≥2 anchors/post
- [x] Redesign inject only when <1 link/post

## about-eeat-visible-photo-credentials

- [x] Audit attorney photo visibility on `/about/`
- [x] Audit credential/bar block visibility on `/about/`
- [x] Fix missing visible photo/credentials when audit fails

## gate-g0-h1-title-split

- [x] Assert `/` H1 ≠ `/about/` H1 in code/render (currently equal — fails until `home-h1-demote-non-entity`)
- [x] Assert about title ≤ ~60 chars / no template bloat (`absoluteTitle` already on about)
- [x] Block deploy when G0 fails

## gate-g1-about-lawyer-query

- [x] ops: Measure `גיא אבני עורך דין` ranks after 7–14d
- [x] ops: Pass when `/about/` ≤10 or (home ≤8 and `/about/` ≤15)
- [x] Fix links/titles when fail (no new pages in this gate)

## gate-g2-two-owned-slots

- [x] ops: Measure distinct `avniguy.co.il` URLs ≤10 on lawyer query
- [x] ops: Pass when ≥2 owned URLs ≤10
- [x] Unlock extra URL work only if G1 met and still 1 slot

## gate-g3-bare-name-foothold

- [x] ops: Measure `גיא אבני` ranks
- [x] ops: Pass when any avniguy URL ≤10

## gate-g4-globes-off-page1

- [x] ops: Measure Globes ranks on both keywords (desktop)
- [x] ops: Measure Globes ranks on both keywords (mobile)
- [x] ops: Pass when zero `globes.co.il` ≤10
- [x] Stop agent SEO changes when G4 passes
- [x] Mark S1–S3 complete when G4 passes

## bing-ai-performance-loop

- [x] ops: Pull monthly Bing Webmaster AI Performance
- [x] Identify grounding gaps
- [x] Patch `/about/` + 2–3 YMYL pillars for gaps
- [x] Ping IndexNow including deletes

## gsc-genai-monthly-brand-serp

- [x] ops: Check GenAI report availability on IL property
- [x] ops: Log cited URLs when available
- [x] ops: Capture monthly brand SERP screenshot
- [x] ops: Annotate Globes drop + owned slot count

## citation-bait-ai-prompts

- [x] ops: Run monthly HE prompt “מי זה גיא אבני עורך דין”
- [x] ops: Run monthly EN/practice variants
- [x] ops: Log which URL each engine cites

## image-search-rank-panel

- [x] Confirm brand-image-pack shipped
- [x] ops: Track brand image-pack ranks separately from text SERP

## hallucination-battery

- [x] ops: Run monthly ChatGPT brand-query battery
- [x] ops: Run monthly Perplexity brand-query battery
- [x] ops: Run monthly Gemini brand-query battery
- [x] Patch `/about/` until engines cite owned URL

## kill-switch-three-flat-cycles

- [x] ops: Count measured deploy cycles with G1–G3 flat
- [x] ops: Escalate off-site/#1/#2/guyavni conflict after 3 flat cycles
- [x] Stop endless on-site rewrites after kill-switch fires

## ac-il-cle-bio

- [x] ops: Secure CLE / university guest lecture path
- [x] ops: Publish institutional `.ac.il` bio with outbound to `/about/`

## well-known-person-json

- [x] Create `/.well-known/person.json` machine CV
- [x] Link machine CV from Person schema

## archive-org-hygiene

- [x] ops: Snapshot `/about/` on Wayback after meaningful update
- [x] ops: Snapshot services on Wayback after meaningful update
- [x] ops: Snapshot top guides on Wayback after meaningful update

## dual-property-rank-matrix

- [x] ops: Track guyavni ranks on brand keywords
- [x] ops: Track avniguy ranks on brand keywords
- [x] ops: Track Globes + FB ranks on brand keywords
- [x] Score win as Globes >10, not avniguy beating guyavni (S4)
