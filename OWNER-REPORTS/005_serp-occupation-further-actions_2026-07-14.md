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

- [ ] Read `/` and `/about/` H1 strings in `src/lib/seo/main-page-heroes.mjs` (both currently `גיא אבני עורך דין`)
- [ ] Change `/` H1 off exact brand-lawyer string in `src/lib/seo/main-page-heroes.mjs`
- [ ] Validate `/about/` H1 remains `גיא אבני עורך דין` in `src/lib/seo/main-page-heroes.mjs`
- [ ] Validate rendered H1 on `/` ≠ rendered H1 on `/about/` (G0)

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

- [ ] Inventory visible `/about/` sections — note: `/about/#person` inbound exists but HTML `id="person"` is currently absent
- [ ] Add stable section `id`s on `/about/` for query-bearing surfaces
- [ ] Strengthen visible section content on `/about/` for those surfaces
- [ ] Add inbound query-bearing anchors from home to about section fragments
- [ ] Add inbound query-bearing anchors from services to about section fragments
- [ ] Validate no new thin entity URLs were added for this scope

## high-intent-owned-url-gated

- [ ] ops: Evaluate G1–G2 gate status from live SERP (stall vs met)
- [ ] Halt extra-URL work when G1–G2 not stalled
- [ ] Strengthen brand-support copy on `/services/` or one credential page when gated
- [ ] Add new static URL path to sitemap only when gated URL ships
- [ ] ops: Validate target is 2nd avniguy top-10 slot on lawyer query

## entity-federation-guyavni

- [ ] ops: Confirm guyavni ownership/control (same person)
- [ ] Read Person `sameAs` wiring in `src/lib/seo/schema-person.ts` + env keys
- [ ] Add mutual `sameAs` edge for guyavni when same owner
- [ ] Add visible footer “אתר התוכן / אתר המשרד” link pair
- [ ] Split Person graph role (avniguy=authority media; guyavni=office/conversion)
- [ ] Validate two homes no longer compete as duplicate entity hubs

## brand-image-pack

- [ ] Search repo for existing portrait/office basename collisions
- [ ] Add unique portrait/office assets under allowed image paths
- [ ] Set filename/`alt`/`ImageObject` to `גיא אבני עורך דין`
- [ ] Run image optimize pipeline for new assets
- [ ] Validate unique-site-images law for each placement

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

- [ ] Identify speakable short-answer blocks on `/about/`
- [ ] Identify speakable short-answer blocks on top hubs
- [ ] Add visible HE voice-answer copy on those surfaces
- [ ] Add Speakable markup only where visible text matches
- [ ] Validate schema text == visible text

## transliteration-bridge-routes

- [ ] Create `/guy-avni/` entity card route linking to `/about/`
- [ ] Decide whether `/גיא-אבני/` bridge route is required
- [ ] Create `/גיא-אבני/` bridge route when required
- [ ] Add bridge path(s) to sitemap
- [ ] Validate bridges are short cards, not a full EN site

## practice-bridge-landings

- [ ] Select 1–3 practice-bridge intents
- [ ] Create practice-bridge landing route(s) with non-brand H1
- [ ] Put brand in subtitle/schema only
- [ ] Validate no outcome claims / bar-safe copy
- [ ] Add landing path(s) to sitemap

## mcp-citation-bait

- [x] Validate `public/llms.txt` still documents `POST /api/search/` + `GET /api/search/?q=` + `POST /api/mcp/` (already shipped)
- [x] Document `scripts/site-mcp-server.mjs` (stdio) in `llms.txt`/agent surface (HTTP `/api/mcp/` is documented; script path is not)
- [ ] ops: Publish “who is גיא אבני” agent card to external MCP/agent registries
- [x] Validate this surface is not framed as Google SEO

## fan-out-h2-maps-on-hubs

- [ ] Map AI Mode fan-out sub-asks for `/about/`
- [ ] Map AI Mode fan-out sub-asks for `/services/`
- [ ] Map AI Mode fan-out sub-asks for top guides
- [ ] Add H2 clusters on existing hubs from the map
- [ ] Validate zero new thin fan-out URLs were created

## person-schema-edges-truthful

- [ ] Inventory credentials that are true and visible on `/about/`
- [ ] Add `alumniOf` to Person schema only when true+visible
- [ ] Add `memberOf` to Person schema only when true+visible
- [ ] Add bar ID to Person schema only when true+visible
- [ ] Validate Person `image` remains stable

## nap-license-visible

- [ ] Write office NAP (street/phone/locality) once on `/about/` (visible) — currently absent
- [ ] Add visible bar license **number / verified listing link** on `/about/` when verified (generic “רישיון לשכת עורכי הדין” text already exists in `AttorneyCredentialBlock`)
- [ ] Emit NAP + bar ID/listing parity in Person schema when visible
- [ ] Validate single NAP/license exposure (no duplicates)

## editorial-policy-page

- [x] Create public methodology/editorial-policy page
- [x] Include review process + bar affiliation + disclaimer
- [ ] Link page from `/about/` (deferred: parent file_claim)
- [ ] Link page from footer (deferred: parent file_claim)
- [x] Add page path to sitemap

## media-appearances-index

- [ ] Choose surface (`/media/` vs about section)
- [ ] Create indexable media/appearances content
- [ ] Link surface from about/nav as needed
- [ ] Add URL to sitemap when standalone route

## home-heroes-entity-role-split

- [ ] Read home hero copy/images/eyebrows vs about person hub
- [ ] Align home hero Hebrew eyebrows to firm-portal role
- [ ] Align home hero copy to firm-portal role
- [ ] Align home hero images per unique-site-images law
- [ ] Validate home role ≠ person-hub role

## indexnow-deletes-redirects-completeness

- [x] Read current IndexNow/publish ping coverage
- [x] Extend ping path for content updates
- [x] Extend ping path for 301/gone URLs
- [x] Restrict sitemap `lastmod` bumps to true content changes
- [x] Validate no false `lastmod` churn

## youtube-short-form-embed

- [ ] ops: Select Hebrew short-form Q&A source clip(s)
- [ ] Embed YouTube short-form on `/about/` and/or `/services/`
- [ ] Validate embed is experimental owned multimodal SERP surface

## non-commodity-ymyl-originals

- [x] Select claim→evidence YMYL pieces to publish/refresh
- [x] Refresh first-person evidence + primary cites + dated refresh
- [x] ops: Audit brand-prefix title spam CTR on brand SERP
- [x] Stop brand-prefix title spam when CTR audit shows no lift

## bar-listing-sameas

- [ ] ops: Claim verified Israel Bar individual listing URL
- [ ] Set `PERSON_ISRAEL_BAR_URL` in prod env (key exists in `src/env.ts` / `schema-person.ts`)
- [ ] ops: Validate live Person `sameAs` emits Bar URL

## owned-page1-asset-pack

- [ ] ops: Set LinkedIn Hebrew descriptor `גיא אבני עורך דין` + `/about/` link
- [ ] ops: Set Bar listing descriptor + `/about/` link
- [ ] ops: Set YouTube channel/about descriptor + `/about/` link
- [ ] ops: Set GBP descriptor + `/about/` link when eligible
- [ ] ops: Validate identical Hebrew descriptor across owned pack

## chaptered-youtube

- [ ] Select 6–12 min HE explainer topics from existing articles
- [ ] ops: Publish chaptered videos (chapters = H2s)
- [ ] ops: Set description + pinned comment → avniguy URL
- [ ] ops: Set channel name to exact brand

## wikidata-q-hebrew-kp-loop

- [ ] ops: Set Hebrew labels on Wikidata Q-item
- [ ] ops: Set occupation on Wikidata Q-item
- [ ] ops: Set official site on Wikidata Q-item
- [ ] ops: Set image + bar/LinkedIn sameAs on Wikidata Q-item
- [ ] ops: Assert `WIKIDATA_PERSON_URL` present in prod
- [ ] ops: Claim Knowledge Panel when available

## hebrew-name-disambiguation-offsite

- [ ] ops: Inventory owned off-site profiles for name descriptor drift
- [ ] ops: Set HE descriptor `גיא אבני עורך דין` on each owned profile
- [ ] ops: Set EN descriptor `Guy Avni lawyer` on each owned profile
- [ ] ops: Validate reduced common-name collision wording

## google-business-profile

- [ ] ops: Refresh GBP name fields
- [ ] ops: Refresh GBP posts
- [ ] ops: Refresh GBP Q&A paraphrasing first-party FAQ
- [ ] Validate Local Pack work stays separate from blue-link SEO track (process rule)

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

- [ ] Select original CLE/notes with real authorship only
- [ ] ops: Deposit to Open Library / Scholar / SSRN-style venues
- [ ] ops: Add outbound links to `/about/`

## wikipedia-notability-gate

- [ ] ops: Evaluate Hebrew Wikipedia notability policy against evidence
- [ ] Halt Wikipedia attempt when notability fails
- [ ] Park on Wikidata hygiene + secondary sources when notability fails
- [ ] ops: Attempt Wikipedia only when notability clears

## newsletter-public-archive

- [x] ops: Launch owned newsletter
- [x] ops: Publish public archive URLs
- [x] ops: Validate archive URLs are indexable brand-adjacent freshness surfaces

## positive-co-occurrence-network

- [x] ops: Identify CLE / panel / NPO bio placement targets
- [x] ops: Earn placements with name + practice only
- [x] Validate no Globes attack narrative / bar-safe copy (content rule)

## other-guy-avni-disambiguation-card

- [ ] ops: Detect whether SERP mixes unrelated people
- [ ] Halt disambiguation card when mix is absent
- [ ] Add truthful disambiguation card on `/about/` when mix is present
- [ ] Merge via federation when guyavni is same person (do not disambiguate against self)

## secondary-domain-role-split

- [ ] ops: Confirm guyavni ownership/control
- [ ] ops: Convert guyavni to office/conversion leaf when controlled
- [ ] ops: 301 duplicate entity pages on secondary domain
- [ ] Keep avniguy as authority media hub
- [ ] ops: Escalate to human/legal consolidation when not controllable via SEO

## prod-sameas-live-assert

- [ ] ops: Curl live `/about/` JSON-LD
- [ ] ops: Assert `sameAs` includes Wikidata
- [ ] ops: Assert `sameAs` includes Bar when env set
- [ ] Fix missing edges via Vercel env only

## indexnow-gsc-one-shot

- [ ] Extend `scripts/post-deploy-indexnow.mjs` beyond static 6 paths (`/`, `/about/`, `/search/`, `/services/`, `/contact/`, `/blog/`) to include top 20 blog URLs — current script does **not** ping top 20
- [ ] Run `scripts/post-deploy-indexnow.mjs` after deploy (static set, then extended set when shipped)
- [ ] Implement real GSC URL Inspection client in `scripts/gsc-url-inspection.mjs` (today returns `SKIPPED_NO_API_CLIENT` stub) — or ops: manual GSC until client ships
- [ ] Run GSC inspection for `/`, `/about/`, top 20 only after client exists (or manual)
- [ ] ops: Ticket only non-indexed URLs; one run per deploy

## inject-entity-links-smoke

- [x] ops: Sample 3 live posts for `href="/about/"`
- [x] Count entity-hub anchors per sampled post
- [x] Close scope when ≥2 anchors/post
- [x] Redesign inject only when <1 link/post

## about-eeat-visible-photo-credentials

- [ ] Audit attorney photo visibility on `/about/`
- [ ] Audit credential/bar block visibility on `/about/`
- [ ] Fix missing visible photo/credentials when audit fails

## gate-g0-h1-title-split

- [ ] Assert `/` H1 ≠ `/about/` H1 in code/render (currently equal — fails until `home-h1-demote-non-entity`)
- [ ] Assert about title ≤ ~60 chars / no template bloat (`absoluteTitle` already on about)
- [ ] Block deploy when G0 fails

## gate-g1-about-lawyer-query

- [ ] ops: Measure `גיא אבני עורך דין` ranks after 7–14d
- [ ] ops: Pass when `/about/` ≤10 or (home ≤8 and `/about/` ≤15)
- [ ] Fix links/titles when fail (no new pages in this gate)

## gate-g2-two-owned-slots

- [ ] ops: Measure distinct `avniguy.co.il` URLs ≤10 on lawyer query
- [ ] ops: Pass when ≥2 owned URLs ≤10
- [ ] Unlock extra URL work only if G1 met and still 1 slot

## gate-g3-bare-name-foothold

- [ ] ops: Measure `גיא אבני` ranks
- [ ] ops: Pass when any avniguy URL ≤10

## gate-g4-globes-off-page1

- [ ] ops: Measure Globes ranks on both keywords (desktop)
- [ ] ops: Measure Globes ranks on both keywords (mobile)
- [ ] ops: Pass when zero `globes.co.il` ≤10
- [ ] Stop agent SEO changes when G4 passes
- [ ] Mark S1–S3 complete when G4 passes

## bing-ai-performance-loop

- [ ] ops: Pull monthly Bing Webmaster AI Performance
- [ ] Identify grounding gaps
- [ ] Patch `/about/` + 2–3 YMYL pillars for gaps
- [ ] Ping IndexNow including deletes

## gsc-genai-monthly-brand-serp

- [ ] ops: Check GenAI report availability on IL property
- [ ] ops: Log cited URLs when available
- [ ] ops: Capture monthly brand SERP screenshot
- [ ] ops: Annotate Globes drop + owned slot count

## citation-bait-ai-prompts

- [ ] ops: Run monthly HE prompt “מי זה גיא אבני עורך דין”
- [ ] ops: Run monthly EN/practice variants
- [ ] ops: Log which URL each engine cites

## image-search-rank-panel

- [ ] Confirm brand-image-pack shipped
- [ ] ops: Track brand image-pack ranks separately from text SERP

## hallucination-battery

- [ ] ops: Run monthly ChatGPT brand-query battery
- [ ] ops: Run monthly Perplexity brand-query battery
- [ ] ops: Run monthly Gemini brand-query battery
- [ ] Patch `/about/` until engines cite owned URL

## kill-switch-three-flat-cycles

- [ ] ops: Count measured deploy cycles with G1–G3 flat
- [ ] ops: Escalate off-site/#1/#2/guyavni conflict after 3 flat cycles
- [ ] Stop endless on-site rewrites after kill-switch fires

## ac-il-cle-bio

- [ ] ops: Secure CLE / university guest lecture path
- [ ] ops: Publish institutional `.ac.il` bio with outbound to `/about/`

## well-known-person-json

- [ ] Create `/.well-known/person.json` machine CV
- [ ] Link machine CV from Person schema

## archive-org-hygiene

- [ ] ops: Snapshot `/about/` on Wayback after meaningful update
- [ ] ops: Snapshot services on Wayback after meaningful update
- [ ] ops: Snapshot top guides on Wayback after meaningful update

## dual-property-rank-matrix

- [ ] ops: Track guyavni ranks on brand keywords
- [ ] ops: Track avniguy ranks on brand keywords
- [ ] ops: Track Globes + FB ranks on brand keywords
- [ ] Score win as Globes >10, not avniguy beating guyavni (S4)
