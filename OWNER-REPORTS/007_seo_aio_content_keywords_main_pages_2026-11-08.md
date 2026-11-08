# SEO + AIO content/keywords audit — live main pages (avniguy.co.il)

**Repo:** `avni-guy`  
**Live host audited:** `https://avniguy.co.il`  
**Created:** 2026-11-08  
**Method:** live HTML + Bright Data markdown of 12 main routes; keyword/heading/word metrics from prerendered HTML; Google IL SERP samples (directional); Google Search Central docs  
**Rubric SSOT (Nov 2026):** Google Search Central — [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) (updated 2025-12-10) + [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (updated 2026-07-10) + helpful/people-first / non-commodity / E-E-A-T  
**Status:** owner workfile — **not SSOT** (see `OWNER-REPORTS/README.md`)  
**Scope:** content + keywords + AIO answer/citability **only**. Technical SEO (robots, www, OG, schema validity, weight, HSTS, llms.txt) = out of scope except where schema/FAQ affects visible answer structure.

---

## Rubric used (content / keywords / AIO only)

Google Nov-2026 posture applied to **copy and entities**:

1. **Non-commodity, people-first content** — unique POV / experience beats generic summaries and keyword-variation pages.
2. **Human-readable structure** — clear H1/H2/H3 for readers; **not** AI chunking theater.
3. **Avoid scaled / fan-out keyword pages** — thin query-variation landings violate spam spirit of “don’t overdo fan-out pages.”
4. **AIO citability** = specific facts, steps, numbers, sources, clear Q→A — **not** special AIO schema / llms.txt / GEO hacks.
5. **YMYL legal E-E-A-T** — first-hand framing, transparency, disclaimers, credentials, public-record honesty.
6. **Ignore as ranking levers:** llms.txt, AEO/GEO checklists, “chunk for AI,” inauthentic mentions, special generative schema.

Third-party GEO lists were **not** pass/fail criteria.

---

## Scope (main pages — content only)

| URL | Content role |
|-----|--------------|
| `/` | Firm portal / brand + topical mesh |
| `/about/` | Canonical Hebrew entity hub |
| `/guy-avni/` | Latin transliteration entity bridge |
| `/services/` | Commercial service pathways |
| `/contact/` | Transactional conversion |
| `/blog/` | Article index hub |
| `/categories/` | Topic taxonomy hub |
| `/sheelot/` | FAQ / PAA-style answer hub |
| `/nedlan-lawyer-guy-avni/` | Practice keyword landing (נדל״ן/מיסוי) |
| `/contracts-lawyer-guy-avni/` | Practice keyword landing (חוזים) |
| `/media/` | Media / appearances hub |
| `/editorial-policy/` | Trust / methodology |

Blog article bodies out of scope except as linked from hubs.

---

## Executive content scorecard

| Pillar | Score | Notes |
|--------|-------|-------|
| Intent clarity (per-URL jobs) | **7.5/10** | Home/about/services/contact/blog mostly distinct; practice landings blur with `/services/` + categories |
| Entity / keyword alignment (Hebrew brand + practice) | **7/10** | Strong brand entity on `/about/`; home H2 exact-match density high; practice terms thin on landings |
| Non-commodity / unique POV | **7/10** | `/about/` public-record + process POV strong; practice URLs commodity/thin; `/sheelot/` answers generic-legal |
| AIO answer readiness / citability | **6.5/10** | Best: about FAQ + sheelot Q→A + editorial process; worst: thin landings; home FAQ answers short (~100–120 chars) |
| Thin / doorway / scaled-content risk | **4.5/10** | `/nedlan-*` + `/contracts-*` main≈74–79 words — high risk vs Jul-2026 “don’t overdo fan-out” |
| Internal topical mesh | **8/10** | Dense links among about/services/blog/categories/sheelot; landings are mostly link hubs |
| Cross-page cannibalization control | **6/10** | Entity OK (about vs guy-avni); practice intents overlap title/H1 across services + 2 landings + sheelot |
| Brand SERP context (directional) | **4/10** | Open brand queries still news + `guyavni.co.il` / name collisions; `site:avniguy` healthy |

**Overall content/keywords + AIO readiness (main pages): ~6.6/10**  
(Entity + mesh strong; thin keyword landings + brand SERP collision + uneven FAQ depth hold the score down.)

---

## Per-page content/keyword matrix (live 2026-11-08)

Legend: Intent = primary user intent · W≈body+chrome words (strip tags) · MainW≈`<main>` words · Dens = exact-match counts in full visible text · FAQ_a = FAQPage answer char lens (LD, matches visible where present).

| Page | Intent | Title / H1 | W / MainW | First ~150w answer quality | Keywords present (exact counts) | Non-commodity | AIO readiness | Thin/doorway | Mesh | Issues |
|------|--------|------------|-----------|----------------------------|----------------------------------|---------------|---------------|--------------|------|--------|
| `/` | Navigational + informational portal | T=H1 `משרד גיא אבני · מאמרים, שירותים וייעוץ` | 2178 / 2064 | Strong portal framing; routes to about/services/blog; little practice-tax depth | גיא אבני **31**; עורך דין/עו״ד **25**; נדל״ן **17**; חוזים **12**; מיסוי מקרקעין **0** | Mixed: process + reading paths yes; H2 brand stuffing | FAQ 5 answers ~102–120c (visible); process HowTo-style steps | Low | Links categories/blog/about/contact | **11/11 H2 contain “גיא אבני”**; no dedicated YMYL site disclaimer (only article card “לא ייעוץ משפטי”) |
| `/about/` | Navigational entity + informational | T `אודות גיא אבני עורך דין \| משרד גיא אבני` · H1 same core | 1756 / 1640 | **Excellent** entity answer in first screen + Bereshit public-record lead | גיא אבני **48**; עורך דין **28**; נדל״ן **13**; חוזים **15**; מיסוי מקרקעין **9** | **Best** — dates, court names, sums, Globes/ynet cites, no-outcome promise | FAQ 8 answers ~110–270c; voice Qs; process steps | Low | → services/blog/editorial/nedlan/sheelot | Keep as **canonical entity**; brand density high but justified |
| `/guy-avni/` | Navigational (Latin brand) | T `Guy Avni \| גיא אבני עורך דין` · H1 `Guy Avni - גיא אבני עורך דין` | 518 / **404** | Clear bridge: Latin = same person; points to `/about/` | גיא אבני **17**; Guy Avni present; practice terms light | Unique purpose (transliteration) | FAQ 4 short but clear | Acceptable if kept thin-on-purpose | Strong → `/about/` | Secondary to about; avoid expanding into duplicate entity essay |
| `/services/` | Commercial | T short services · H1 longer pathway copy | 924 / **808** | Strong “מסלול לא תפריט” POV; focus meeting defined | גיא אבני **13**; נדל״ן **8**; חוזים **7**; מיסוי מקרקעין **2** | Good process POV; no case specifics | FAQ 6 (~96–144c); voice Qs | Low–med | → nedlan/contracts/categories/about | Overlaps practice landings’ keyword job; no visible soft disclaimer beyond “אין הבטחת תוצאה” / FAQ no-outcome |
| `/contact/` | Transactional | T contact · H1 prep-led CTA | 370 / 256 | Good prep instructions; email NAP | Brand light; **0** נדל״ן/חוזים/מיסוי | Soft unique (prep ritual) | Weak citability; **0 FAQ** | Med thin for YMYL contact | → services/blog/about/categories | Body: “אינו ייעוץ אישי”; meta “אינו תחליף לייעוץ”; no practice keywords (OK for intent) |
| `/blog/` | Informational index | T=H1 articles | 1432 / (index+cards) | Strong “לשעה לא נוחה” framing; archive UX | Brand+עורך דין high via cards | Index commodity risk mitigated by distinctive intro | Low Q→A (no FAQ); cards carry specifics | Low as hub | → categories/tags/services | H2 only 2 (nav structure thin); disclaimer present in intro |
| `/categories/` | Navigational taxonomy | H1 brand+topics | 643 / (hub) | Clear “don’t browse randomly” | Brand **12**; category labels cover נדל״ן/חוזים/מיסים | Light POV | FAQ 3 short | Low | Dense category links | Overlaps blog hub; FAQ generic; **no** site-level “not advice” disclaimer phrase |
| `/sheelot/` | Informational (PAA) | H1 Q hub נדל״ן/מיסוי/מקרקעין | 570 / 454 | Explicit PAA framing; disclaimer | Brand **8**; practice via Qs; מיסוי מקרקעין exact **0** in body counts (מיסוי in title/H1) | Answers useful but **commodity-legal** (no firm-specific numbers) | **High structure**; 8 Qs as H2; a≈150–192c; deep links to guides | Low–med depth | → blog guides + services/about | Deepen answers with unique POV + primary-law cites |
| `/nedlan-lawyer-guy-avni/` | Commercial / informational hybrid | T `עורך דין נדל״ן ומיסוי \| גיא אבני` · H1 longer | **193 / 79** | Thin bridge copy only | Brand **7**; נדל״ן **3**; מיסוי מקרקעין **2**; **0 H2** | **Fail** unique POV | Poor — no FAQ, no steps, no facts | **HIGH thin / fan-out risk** | 3 links: about/services/tax | Consolidate or rewrite as expert guide |
| `/contracts-lawyer-guy-avni/` | Commercial / informational hybrid | T `עורך דין חוזים \| גיא אבני` · H1 longer | **187 / 74** | Thin bridge | Brand **7**; חוזים **6**; **0 H2** | **Fail** | Poor | **HIGH thin / fan-out risk** | about/services/contracts cat | Same disposition as nedlan |
| `/media/` | Navigational / E-E-A-T support | H1 מדיה והופעות | 503 / **391** | Honest empty external list | Brand **12**; practice light | Transparency (“אין הופעות מתועדות”) = unique | FAQ 4 (incl. not-legal-advice Q); low citability facts | Med (empty list) | → blog/editorial/about | Content gap = no verified appearances yet |
| `/editorial-policy/` | Informational trust | H1 מדיניות עריכה | 681 / (trust) | Strong methodology answer | Brand **14**; YMYL framing explicit | **Strong** 5-step process + Bar responsibility | FAQ 4 solid | Low | → about/blog | Model trust page; cite in other hubs |

### Scoring notes (judgment, not fact >0.95)
- “Best entity / AIO page” = `/about/` (qualitative).
- Thin/doorway **risk** = interpretive vs scaled-content policy; word counts are measured facts.

---

## Cross-page cannibalization map

| Cluster | Pages | Overlap signal | Verdict |
|---------|-------|----------------|---------|
| Entity / brand person | `/about/` vs `/guy-avni/` vs home authority sections | Same person, practice list, FAQ “מי זה” | **Controlled** if `/about/` stays Hebrew canonical and `/guy-avni/` stays bridge-only |
| Practice commercial | `/services/` vs `/nedlan-lawyer-guy-avni/` vs `/contracts-lawyer-guy-avni/` | Shared “עורך דין + תחום + גיא אבני” titles/H1s; services already maps both landings | **High** — landings add little unique text vs services/about |
| Real-estate Q&A | `/sheelot/` vs blog guides vs about §מקרקעין | Same PAA topics (מס רכישה, מס שבח, קבלן, חובה עו״ד) | **Medium** — OK if sheelot = short answers + links; risk if landings also try to rank same head terms with thin copy |
| Trust / disclaimer | `/editorial-policy/` vs about FAQ “האם תוכן=ייעוץ” vs media FAQ | Repeated disclaimer intent | **Low** — complementary roles |
| Index hubs | `/blog/` vs `/categories/` | Both navigate articles | **Low** — different UI jobs |
| Brand SERP collision (messaging) | Footer copy on all pages: `avniguy.co.il` = content authority, `guyavni.co.il` = conversion firm site | SameAs-style dual brand in **visible copy** | **Entity clarity risk** if SERP users confuse Netivot-style listings / other “גיא אבני” — copy should keep disambiguation (already stronger on `/about/` public record) |

Title/H1 collision examples (live):
- Services H1 and about both claim process + practice areas.
- Nedlan title/H1 ≈ keyword duplicate of services “נדל״ן ומיסוי” + about practice block.
- Contracts title/H1 ≈ services contracts path.

---

## Keyword / entity inventory (what copy actually targets)

### Primary entities (on-page)
| Entity / term | Where strongest | Notes |
|---------------|-----------------|-------|
| `גיא אבני` | about (48), home (31), blog (22) | Brand entity; home H2 over-use |
| `עורך דין` / `עו״ד` | about, blog, home | Role entity |
| `Guy Avni` / `guy-avni` | `/guy-avni/` | Latin bridge only |
| `גיא אבני משרד עורכי דין` | home, services | Org phrasing |
| `avniguy.co.il` | about lead, editorial | Site self-ID |
| `guyavni.co.il` | footer sitewide (“אתר המשרד”) | Dual-property messaging — keyword/entity clarity issue for brand SERP |

### Practice / topic terms
| Term | Strong pages | Weak / missing |
|------|--------------|----------------|
| `נדל״ן` | home, about, services, categories | contact 0; thin on nedlan landing despite title |
| `מיסוי מקרקעין` | about (9), guy-avni, media | **home 0 exact**; sheelot title uses מיסוי but exact phrase count 0 in body metric |
| `מס שבח` / `מס רכישה` | about, sheelot Qs, nedlan eyebrow | Not hub-depth on home |
| `חוזים` | about, services, contracts landing | contact 0 (OK) |
| `ליטיגציה` | about/services/categories | — |
| Process lexicon (`פגישת מיקוד`, `תמונת סיכונים`) | about, services, contact, home | Differentiator — keep |

### Exact-match density vs natural language
- **Home:** 11/11 H2 include `גיא אבני` → stuffing / unnatural heading pattern (fact); risks looking engineered vs people-first headings.
- **About:** high brand count but natural in entity/FAQ context.
- **Practice landings:** high keyword-in-title/H1 vs almost no body substance → classic thin landing pattern.

---

## AIO citability gaps (content-only)

| Gap | Why it hurts generative citation | Evidence |
|-----|----------------------------------|----------|
| Thin practice URLs | Nothing specific to ground (no steps, numbers, sources) | MainW 74–79; 0 H2; 0 FAQ |
| Sheelot answers short + generic | Citability prefers distinctive facts/sources | a≈150–192c; no statutes/dates inside answers (links only) |
| Home FAQ ultrashort | Supporting snippets weak vs about FAQ | a≈102–120c |
| Contact no Q→A | Prep content OK but not answer blocks | 0 FAQ |
| Media empty appearances | Cannot cite third-party media proof | Explicit empty list |
| Missing `מיסוי מקרקעין` on home body | Fan-out for tax queries less grounded on portal | exact count 0 |
| Dual `guyavni.co.il` footer framing | Generative systems may blend entities | Sitewide footer copy |
| Uneven YMYL disclaimer | Trust signal inconsistent | Home lacks site-level disclaimer; services/categories/nedlan weak |

**Strong citability already present (keep):**
- `/about/` public-record block: dates (2024-09-17, 2025-02-06, 2026-01-29, 2025-09-29), court/judge names, ≈1.2M / ≈670k sums, named press URLs.
- `/editorial-policy/` 5-step methodology + Bar responsibility.
- `/sheelot/` clear question H2s + links to deeper guides (structure ready; deepen substance).

---

## Brand / practice SERP context (directional only — conf &lt; 0.95)

Bright Data Google `country=il` samples 2026-11-08 — **not GSC-verified**:

| Query | Observed pattern (directional) |
|-------|--------------------------------|
| `גיא אבני עורך דין` | News/indictment narratives + other “גיא אבני” business listings; avniguy article/categories titles appear in mix — **not** proven #1 |
| `"גיא אבני" עורך דין` | `guyavni.co.il` + Globes + Calcalist + avniguy home snippet observed in sample set |
| `עורך דין נדלן גיא אבני` | `guyavni.co.il` specialties + news; Netivot-style listings |
| `מיסוי מקרקעין עורך דין` | Generic competitor practice pages dominate; avniguy not observed top in sample |
| `site:avniguy.co.il גיא אבני` | Home, about, contact, categories, articles — indexing existence **high confidence** for sampled URLs |

**Content implication:** On-page entity disambiguation (`/about/` public record + explicit avniguy identity) is the right keyword strategy; thin keyword landings will not out-compete news or colliding firm brands without unique substance.

---

## Priority content/keyword actions (P0–P2)

### P0
1. **Dispose thin practice landings** — expand `/nedlan-lawyer-guy-avni/` and `/contracts-lawyer-guy-avni/` into unique expert guides (process, checklists, primary sources, first-hand framing) **or** 301 into `/services/` (+ category/articles). Prefer consolidate if no unique experience to add (Google Jul-2026: avoid fan-out variation pages).
2. **Reduce home H2 brand stuffing** — rewrite H2s for human topics (process, audience, FAQ) without forcing `גיא אבני` into every heading; keep brand in H1/title/body naturally.
3. **Clarify dual-domain entity messaging in copy** — footer/about should not leave readers (or generative systems) unsure which “גיא אבני” property answers which intent; keep `/about/` as disambiguation hub; only link `guyavni.co.il` if same legal person/org (align with sameAs policy).

### P1
4. **Deepen `/sheelot/` answers** — add unique practice notes, concrete steps, and outbound cites to primary law / Tax Authority (citability without AEO hacks).
5. **Add consistent visible YMYL disclaimer** to home + services + categories + nedlan (and any hub missing clear “not personal advice”).
6. **Home portal:** introduce natural `מיסוי מקרקעין` / מס שבח–רכישה framing in one people-first section (not keyword stuffing) linking to tax category + sheelot.
7. **Contact:** add 2–4 prep FAQ Q→A blocks (documents, timeline, what happens after email) for answer readiness.

### P2
8. Enrich `/media/` only with **verified** appearances (do not invent); until then lean on blog/editorial links.
9. Soften services↔about practice-list duplication — services = pathways/pricing-process; about = identity/E-E-A-T.
10. Operator: monitor Generative AI performance in GSC for these URLs after content changes (measurement, not a content myth).

---

## What not to do (Google mythbusting — content)

- Do **not** create more query-variation landings for fan-out coverage.
- Do **not** rewrite copy solely for AI phrasing / micro-chunking.
- Do **not** add special “AI Overview schema” or treat FAQ schema as a ranking lever (schema OK for rich results; substance must match visible text).
- Do **not** treat `llms.txt` / GEO vendor checklists as content quality criteria.
- Do **not** chase inauthentic mentions to “win” brand AIO.
- Do **not** spam exact-match `גיא אבני` into every H2.

---

## Evidence log

- Live HTML fetches: 2026-11-08, UA `SEOContentAudit/2026.11`, HTTP 200 all 12 routes; metrics via Node strip-tags + `<main>` word counts + H1/H2 extract + entity exact-match counters → `/tmp/avniguy-007/`.
- Bright Data `scrape_batch` markdown same day for all 12 URLs (content cross-check).
- Official docs fetched: AI optimization guide last-updated **2026-07-10**; AI features last-updated **2025-12-10**.
- SERP: Bright Data Google IL samples — ranks directional (conf &lt; 0.95).
- Related prior workfile (technical pass): `006_seo_aio_live_main_pages_audit_2026-11-08.md` — consulted for format; this file is independent content/keywords depth.

---

## VALIDATE_TRUE (`.commends/TODO_validate_true.md`) — 2026-11-08

**Rule:** every factual item must be true/correct with confidence **&gt; 0.95**, else corrected or demoted.  
**Re-fetch 1:** UA `SEOContentAudit/2026.11` + Bright Data markdown + Google docs WebFetch.  
**Re-fetch 2 (close-out):** UA `SEOValidate/2026.11` re-download of home/about/sheelot/nedlan/contracts/services/guy-avni/media/contact/categories — matrix deltas below.

### Corrections applied during validate (failed &gt;0.95 as drafted, then fixed in-file)

| # | Draft claim | Verdict | Fix |
|---|-------------|---------|-----|
| C1 | Home “no disclaimer at all” | **IMPRECISE** | Article cards include “לא ייעוץ משפטי”; **no site-level YMYL disclaimer**. Matrix wording corrected. |
| C2 | Contact “disclaimer meta only” | **FALSE** | Visible body includes “התוכן באתר אינו ייעוץ אישי”; meta has “אינו תחליף לייעוץ”. Corrected. |
| C3 | Absolute SERP rank assertions | **NOT &gt;0.95** | Kept directional only; no #1 claims. |
| C4 | Practice pages “~190 words of unique expert content” | **IMPRECISE** | Total W≈187–193 includes chrome; **MainW≈74–79**. Matrix uses both. |
| C5 | Home FAQ answers missing from HTML | **FALSE** | Answer strings present in body (not LD-only). Noted short length instead. |
| C6 | guy-avni / services / media MainW “~” estimates | **IMPRECISE** | Second re-fetch: guy-avni **404**, services **808**, media **391**. Matrix updated. |
| C7 | Categories “disclaimer uneven” without check | **CONFIRMED gap** | Validate: no `אינו תחליף` / `אינו ייעוץ` phrase on categories; services has no-outcome FAQ but not soft “not advice” phrase. |

### Fact checks — PASS (conf &gt; 0.95)

| Claim | Conf | Proof |
|-------|------|-------|
| All 12 scoped URLs HTTP 200 | 0.99 | curl status lines |
| Titles/H1s as matrix | 0.99 | `<title>` / `<h1>` extract (validate re-fetch match) |
| Word totals as matrix (home 2178, about 1756, services 924, guy-avni 518, contact 370, blog 1432, categories 643, sheelot 570, nedlan 193, contracts 187, media 503, editorial 681) | 0.99 | strip-tags; editorial from first fetch + BD markdown cross-check |
| `<main>` words: home 2064, about 1640, sheelot 454, contact 256, nedlan 79, contracts 74, guy-avni 404, services 808, media 391 | 0.99 | validate re-fetch |
| Home **11** H2s, **all** contain `גיא אבני` | 0.99 | H2 extract ×2 |
| Nedlan/contracts **0** H2 | 0.99 | extract ×2 |
| Entity exact counts (about brand 48; home brand 31; home `מיסוי מקרקעין` 0; sheelot misui exact 0) | 0.99 | counters ×2 |
| FAQ counts: home 5, about 8, sheelot 8, services 6, guy-avni 4, media 4, contact 0, landings 0 | 0.99 | FAQPage LD |
| Sheelot FAQ answer lengths 150–192 chars | 0.99 | LD lengths re-check |
| About public-record cites Globes/ynet with dates/sums in visible copy | 0.99 | about HTML/markdown |
| Footer dual messaging avniguy vs guyavni present sitewide | 0.99 | scraped pages |
| Google docs: no special AIO markup; ignore llms.txt for Search ranking; non-commodity; avoid fan-out variation pages | 0.98 | AI features 2025-12-10; AI optimization 2026-07-10 |
| `site:avniguy.co.il` sample returns avniguy titles | 0.97 | SERP sample (existence only) |

### Judgment / non-fact (not assertable &gt;0.95 as “true”)

- Numeric pillar scores and overall **~6.6/10**.
- “HIGH doorway risk” / “Best AIO page” labels (word counts are facts; labels are judgment).
- SERP absolute positions / competitive dominance.
- Whether `guyavni.co.il` is same legal person — **operator** must confirm; on-page copy claims conversion property relationship.
- GSC Generative AI inclusion/performance — unverified.
- Blog/categories/editorial exact `<main>` word counts not re-asserted as hard targets in scorecard (hub pages card-heavy).

### Validate-true result

- Factual content/keyword claims re-verified on close-out re-fetch; **7 corrections** (C1–C7) applied in-file.
- Remaining factual matrix cells cited above: **conf &gt; 0.95**.
- Scores + SERP ranks: explicitly opinion / directional.
- **Outcome: PASS** for factual layer after corrections.

---

## next plan suggestion

Content plan: **thin-landing consolidate-or-rewrite + home H2 de-stuff + sheelot deepen + disclaimer consistency + dual-domain copy clarity** — then re-score this content matrix.

## files to read (if implementing)

- `src/app/page.tsx` (home H2/FAQ copy)
- `src/app/nedlan-lawyer-guy-avni/page.tsx`, `src/app/contracts-lawyer-guy-avni/page.tsx`
- `src/app/sheelot/page.tsx`, `src/app/services/page.tsx`, `src/app/contact/page.tsx`
- Footer / site chrome component carrying guyavni conversion link
- `src/app/about/page.tsx` (entity SSOT for copy)

## open issues

- [ ] Thin practice landing disposition (expand vs 301)
- [ ] Home H2 brand stuffing rewrite
- [ ] Dual-domain entity messaging decision
- [ ] Sheelot answer depth + primary sources
- [ ] Disclaimer consistency on hubs
- [ ] Operator confirm guyavni relationship + GSC generative baselines
