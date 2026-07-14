# SERP occupation — further actions (atomic checklist)

**Repo:** `avni-guy` (avniguy.co.il)  
**Date:** 2026-07-14  
**Source:** `OWNER-REPORTS/004_serp-occupation-further-actions_2026-07-14.md`  
**Derived via:** `.commends/TODO_convert_atomic.md`  
**Status:** owner checklist — not SSOT  
**Filter:** open `[ ]` scopes only; already-done + do-not excluded

---

## home-h1-demote-non-entity

- [ ] Read `/` and `/about/` H1 strings in `src/lib/seo/main-page-heroes.mjs`
- [ ] Change `/` H1 off exact brand-lawyer string in `src/lib/seo/main-page-heroes.mjs`
- [ ] Validate `/about/` H1 equals `גיא אבני עורך דין` in `src/lib/seo/main-page-heroes.mjs`
- [ ] Validate rendered H1 on `/` ≠ rendered H1 on `/about/` (G0)

## home-title-brand-portal

- [ ] Read homepage metadata title + template behavior in `src/app/page.tsx`
- [ ] Set homepage metadata title to firm/portal framing in `src/app/page.tsx`
- [ ] Detect whether site-name template still appends to homepage title
- [ ] Set `absoluteTitle: true` on homepage metadata in `src/app/page.tsx` when template bloat remains

## about-title-lawyer-query

- [ ] Read current `/about/` metadata title in `src/app/about/page.tsx`
- [ ] Set `/about/` title to one primary lawyer-query form in `src/app/about/page.tsx`
- [ ] Validate title is not bare-name-only stuffing
- [ ] Write first ~100 words on `/about/` answering both brand queries

## brand-query-answer-ownership-about

- [ ] Read current `/about/` lead copy in `src/app/about/page.tsx`
- [ ] Write extractable “מי זה גיא אבני” block as first 100–150 words on `/about/`
- [ ] Validate home does not host a second competing bio block
- [ ] Add home deep-link targeting `/about/` as entity destination

## home-internal-link-weight-to-about

- [ ] Locate first-viewport + HomeSeo authority link slots on home
- [ ] Add `/about/` link with anchor `גיא אבני` in first-viewport/HomeSeo
- [ ] Add `/about/` link with anchor `גיא אבני עורך דין` in first-viewport/HomeSeo
- [ ] Validate anchors are not only “אודות”

## sitelink-candidate-freeze

- [ ] Read nav anchors in `src/lib/nav/site-nav.ts`
- [ ] Freeze nav sitelink candidates to אודות / שירותים / מאמרים / יצירת קשר in `src/lib/nav/site-nav.ts`
- [ ] Read footer sitelink anchors
- [ ] Align footer Hebrew anchors to identical nav labels
- [ ] Validate thin tags remain noindex so they cannot steal sitelinks

## about-section-ranking-surface

- [ ] Inventory visible `/about/#…` section headings/ids
- [ ] Strengthen visible section content on `/about/` for query-bearing surfaces
- [ ] Add inbound query-bearing anchors from home to about sections
- [ ] Add inbound query-bearing anchors from services to about sections
- [ ] Validate no new thin entity URLs were added for this scope

## high-intent-owned-url-gated

- [ ] Evaluate G1–G2 gate status (stall vs met)
- [ ] Halt extra-URL work when G1–G2 not stalled
- [ ] Strengthen brand-support copy on `/services/` or one credential page when gated
- [ ] Add new static URL path to sitemap only when gated URL ships
- [ ] Validate target is 2nd avniguy top-10 slot on lawyer query (measure later)

## entity-federation-guyavni

- [ ] Read live Person `sameAs` emission for avniguy
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

- [ ] Read current `/rss.xml` generator
- [ ] Add author fields to RSS items
- [ ] Add `content:encoded` (or equivalent) to RSS items
- [ ] Add `media:content` (or equivalent) to RSS items
- [ ] Validate RSS still builds under `pnpm run build:ci`

## sheelot-paa-factory

- [ ] Create `/sheelot/` route shell
- [ ] Add one H2 per real HE PAA-style question on `/sheelot/`
- [ ] Write visible answers matching intended schema text
- [ ] Emit matching Q&A schema for `/sheelot/`
- [ ] Add `/sheelot/` to sitemap
- [ ] Ping IndexNow for `/sheelot/` after deploy

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

- [ ] Document `POST /api/search/` discoverability in `llms.txt`/agent surface
- [ ] Document `scripts/site-mcp-server.mjs` in MCP/agent registries surface
- [ ] Ship “who is גיא אבני” agent card for non-Google engines
- [ ] Validate this surface is not framed as Google SEO

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

- [ ] Write office NAP once on `/about/` (visible)
- [ ] Write bar license once on `/about/` (visible)
- [ ] Emit NAP/license parity in schema
- [ ] Validate single NAP/license exposure (no duplicates)

## editorial-policy-page

- [ ] Create public methodology/editorial-policy page
- [ ] Include review process + bar affiliation + disclaimer
- [ ] Link page from `/about/`
- [ ] Link page from footer
- [ ] Add page path to sitemap

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

- [ ] Read current IndexNow/publish ping coverage
- [ ] Extend ping path for content updates
- [ ] Extend ping path for 301/gone URLs
- [ ] Restrict sitemap `lastmod` bumps to true content changes
- [ ] Validate no false `lastmod` churn

## youtube-short-form-embed

- [ ] Select Hebrew short-form Q&A source clip(s)
- [ ] Embed YouTube short-form on `/about/` and/or `/services/`
- [ ] Validate embed is experimental owned multimodal SERP surface

## non-commodity-ymyl-originals

- [ ] Select claim→evidence YMYL pieces to publish/refresh
- [ ] Refresh first-person evidence + primary cites + dated refresh
- [ ] Audit brand-prefix title spam CTR on brand SERP
- [ ] Stop brand-prefix title spam when CTR audit shows no lift

## bar-listing-sameas

- [ ] Claim verified Israel Bar individual listing URL (human/ops)
- [ ] Set `PERSON_ISRAEL_BAR_URL` in prod env
- [ ] Validate live Person `sameAs` emits Bar URL

## owned-page1-asset-pack

- [ ] Set LinkedIn Hebrew descriptor `גיא אבני עורך דין` + `/about/` link
- [ ] Set Bar listing descriptor + `/about/` link
- [ ] Set YouTube channel/about descriptor + `/about/` link
- [ ] Set GBP descriptor + `/about/` link when eligible
- [ ] Validate identical Hebrew descriptor across owned pack

## chaptered-youtube

- [ ] Select 6–12 min HE explainer topics from existing articles
- [ ] Publish chaptered videos (chapters = H2s)
- [ ] Set description + pinned comment → avniguy URL
- [ ] Set channel name to exact brand

## wikidata-q-hebrew-kp-loop

- [ ] Set Hebrew labels on Wikidata Q-item
- [ ] Set occupation on Wikidata Q-item
- [ ] Set official site on Wikidata Q-item
- [ ] Set image + bar/LinkedIn sameAs on Wikidata Q-item
- [ ] Assert `WIKIDATA_PERSON_URL` present in prod
- [ ] Claim Knowledge Panel when available

## hebrew-name-disambiguation-offsite

- [ ] Inventory owned off-site profiles for name descriptor drift
- [ ] Set HE descriptor `גיא אבני עורך דין` on each owned profile
- [ ] Set EN descriptor `Guy Avni lawyer` on each owned profile
- [ ] Validate reduced common-name collision wording

## google-business-profile

- [ ] Refresh GBP name fields
- [ ] Refresh GBP posts
- [ ] Refresh GBP Q&A paraphrasing first-party FAQ
- [ ] Validate Local Pack work stays separate from blue-link SEO track

## earned-bio-placements

- [ ] Brief bios for bar district / conferences / podcasts
- [ ] Seed placements with exact descriptor + `/about/` link
- [ ] Log placement URLs for KP/AIO corroboration

## podcast-owned-feeds

- [ ] Launch owned podcast with name in show title
- [ ] Publish Apple/Spotify/Google feed URLs
- [ ] Expose indexable archive via enriched RSS or host archive

## civic-directory-nap

- [ ] List Haifa/local civic/chamber/alumni directories
- [ ] Set consistent NAP on each listing
- [ ] Set dual HE/EN spelling on each listing

## open-library-ssrn-cle-deposit

- [ ] Select original CLE/notes with real authorship only
- [ ] Deposit to Open Library / Scholar / SSRN-style venues
- [ ] Add outbound links to `/about/`

## wikipedia-notability-gate

- [ ] Evaluate Hebrew Wikipedia notability policy against evidence
- [ ] Halt Wikipedia attempt when notability fails
- [ ] Park on Wikidata hygiene + secondary sources when notability fails
- [ ] Attempt Wikipedia only when notability clears

## newsletter-public-archive

- [ ] Launch owned newsletter
- [ ] Publish public archive URLs
- [ ] Validate archive URLs are indexable brand-adjacent freshness surfaces

## positive-co-occurrence-network

- [ ] Identify CLE / panel / NPO bio placement targets
- [ ] Earn placements with name + practice only
- [ ] Validate no Globes attack narrative / bar-safe copy

## other-guy-avni-disambiguation-card

- [ ] Detect whether SERP mixes unrelated people
- [ ] Halt disambiguation card when mix is absent
- [ ] Add truthful disambiguation card on `/about/` when mix is present
- [ ] Merge via federation when guyavni is same person (do not disambiguate against self)

## secondary-domain-role-split

- [ ] Confirm guyavni ownership/control
- [ ] Convert guyavni to office/conversion leaf when controlled
- [ ] 301 duplicate entity pages on secondary domain
- [ ] Keep avniguy as authority media hub
- [ ] Escalate to human/legal consolidation when not controllable via SEO

## prod-sameas-live-assert

- [ ] Curl live `/about/` JSON-LD
- [ ] Assert `sameAs` includes Wikidata
- [ ] Assert `sameAs` includes Bar when env set
- [ ] Fix missing edges via Vercel env only

## indexnow-gsc-one-shot

- [ ] Run `scripts/post-deploy-indexnow.mjs` for `/`, `/about/`, top 20
- [ ] Run `scripts/gsc-url-inspection.mjs` for `/`, `/about/`, top 20
- [ ] Ticket only non-indexed URLs
- [ ] Enforce one run per deploy

## inject-entity-links-smoke

- [ ] Sample 3 live posts for `href="/about/"`
- [ ] Count entity-hub anchors per sampled post
- [ ] Close scope when ≥2 anchors/post
- [ ] Redesign inject only when <1 link/post

## about-eeat-visible-photo-credentials

- [ ] Audit attorney photo visibility on `/about/`
- [ ] Audit credential/bar block visibility on `/about/`
- [ ] Fix missing visible photo/credentials when audit fails

## gate-g0-h1-title-split

- [ ] Assert `/` H1 ≠ `/about/` H1 in code/render
- [ ] Assert about title ≤ ~60 chars / no template bloat
- [ ] Block deploy when G0 fails

## gate-g1-about-lawyer-query

- [ ] Measure `גיא אבני עורך דין` ranks after 7–14d
- [ ] Pass when `/about/` ≤10 or (home ≤8 and `/about/` ≤15)
- [ ] Fix links/titles when fail (no new pages in this gate)

## gate-g2-two-owned-slots

- [ ] Measure distinct `avniguy.co.il` URLs ≤10 on lawyer query
- [ ] Pass when ≥2 owned URLs ≤10
- [ ] Unlock extra URL work only if G1 met and still 1 slot

## gate-g3-bare-name-foothold

- [ ] Measure `גיא אבני` ranks
- [ ] Pass when any avniguy URL ≤10

## gate-g4-globes-off-page1

- [ ] Measure Globes ranks on both keywords (desktop)
- [ ] Measure Globes ranks on both keywords (mobile)
- [ ] Pass when zero `globes.co.il` ≤10
- [ ] Stop agent SEO changes when G4 passes
- [ ] Mark S1–S3 complete when G4 passes

## bing-ai-performance-loop

- [ ] Pull monthly Bing Webmaster AI Performance
- [ ] Identify grounding gaps
- [ ] Patch `/about/` + 2–3 YMYL pillars for gaps
- [ ] Ping IndexNow including deletes

## gsc-genai-monthly-brand-serp

- [ ] Check GenAI report availability on IL property
- [ ] Log cited URLs when available
- [ ] Capture monthly brand SERP screenshot
- [ ] Annotate Globes drop + owned slot count

## citation-bait-ai-prompts

- [ ] Run monthly HE prompt “מי זה גיא אבני עורך דין”
- [ ] Run monthly EN/practice variants
- [ ] Log which URL each engine cites

## image-search-rank-panel

- [ ] Confirm brand-image-pack shipped
- [ ] Track brand image-pack ranks separately from text SERP

## hallucination-battery

- [ ] Run monthly ChatGPT brand-query battery
- [ ] Run monthly Perplexity brand-query battery
- [ ] Run monthly Gemini brand-query battery
- [ ] Patch `/about/` until engines cite owned URL

## kill-switch-three-flat-cycles

- [ ] Count measured deploy cycles with G1–G3 flat
- [ ] Escalate off-site/#1/#2/guyavni conflict after 3 flat cycles
- [ ] Stop endless on-site rewrites after kill-switch fires

## ac-il-cle-bio

- [ ] Secure CLE / university guest lecture path
- [ ] Publish institutional `.ac.il` bio with outbound to `/about/`

## well-known-person-json

- [ ] Create `/.well-known/person.json` machine CV
- [ ] Link machine CV from Person schema

## archive-org-hygiene

- [ ] Snapshot `/about/` on Wayback after meaningful update
- [ ] Snapshot services on Wayback after meaningful update
- [ ] Snapshot top guides on Wayback after meaningful update

## dual-property-rank-matrix

- [ ] Track guyavni ranks on brand keywords
- [ ] Track avniguy ranks on brand keywords
- [ ] Track Globes + FB ranks on brand keywords
- [ ] Score win as Globes >10, not avniguy beating guyavni (S4)
