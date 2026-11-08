# SEO + AIO audit — live main pages (avniguy.co.il)

**Repo:** `avni-guy`  
**Live host audited:** `https://avniguy.co.il` (+ `www` host check)  
**Created:** 2026-11-08  
**Method:** live HTTP fetch of main routes + robots/sitemap/llms + Google IL SERP samples  
**Rubric SSOT (Nov 2026):** Google Search Central — [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) (updated 2025-12-10) + [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (updated 2026-07-10)  
**Status:** owner workfile — **not SSOT** (see `OWNER-REPORTS/README.md`)

---

## Rubric used (Nov 2026 only — Google-official)

Google’s Nov-2026 posture for AI Overviews / AI Mode:

1. **No special “AIO markup”** — no extra schema, no required `llms.txt`, no content chunking for AI.
2. **Eligibility** = indexed + snippet-eligible + included in Search Console **Search generative AI control**.
3. **What still matters:** crawlability, internal links, page experience, **textual** primary content, accurate structured data that matches visible text, helpful **non-commodity** people-first content, E-E-A-T (esp. YMYL/legal).
4. **Measure** via Search Console Performance (Web) + Generative AI performance report.
5. **Ignore as Google ranking levers:** `llms.txt` theater, AEO/GEO “hacks”, fan-out keyword pages, inauthentic mentions. (`llms.txt` is fine for *other* AI systems; Google says it neither helps nor hurts Search.)

Third-party “GEO checklists” were **not** used as pass/fail criteria.

---

## Scope (main pages)

| URL | Role |
|-----|------|
| `/` | Home |
| `/about/` | Entity hub |
| `/guy-avni/` | Latin-script entity card |
| `/services/` | Services |
| `/contact/` | Contact / conversion |
| `/blog/` | Article index |
| `/categories/` | Topic hub |
| `/sheelot/` | FAQ hub |
| `/nedlan-lawyer-guy-avni/` | Practice landing |
| `/contracts-lawyer-guy-avni/` | Practice landing |
| `/media/` | Media / sameAs support |
| `/editorial-policy/` | Trust / methodology |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/rss.xml`, `/agent-card.json` | Discovery layer |

Blog article bodies were **out of scope** for this pass (index + hubs only).

---

## Executive scorecard

| Pillar (Nov 2026) | Score | Notes |
|-------------------|-------|-------|
| Crawl / index eligibility | **8.5/10** | Allow-all robots (intentional AI bots), sitemap 139 URLs, SSG prerender, `index,follow`, RSS OK. Dual `www`+apex 200 weakens host clarity. |
| Technical page SEO | **8/10** | Unique titles/H1/canonicals; OG/Twitter present; `lang=he-IL` + `dir=rtl`. Home HTML ~240KB. |
| Structured data (rich-result hygiene) | **8/10** | Valid JSON-LD graphs; Person `@id` on entity pages; FAQ/HowTo where visible. Home missing Person node; Contact missing ContactPage. |
| AIO / generative eligibility | **7.5/10** | Fundamentals strong; GSC generative AI control + Generative AI report **not verifiable from outside**. Thin practice landings hurt citability. |
| E-E-A-T / YMYL trust | **8.5/10** | Strong `/about/` (credential, Wikidata, public-record section, editorial policy). Disclaimer uneven on some hubs. |
| Brand / entity SERP (IL) | **4/10** | Competing firm `guyavni.co.il` + news + name collisions dominate open brand queries; site:avniguy shows healthy indexing. |
| Non-commodity / unique POV | **6.5/10** | Home/about/services substantial; `/nedlan-*` + `/contracts-*` ~190 words = thin / near-doorway risk under 2026 spam + “don’t overdo fan-out pages”. |

**Overall live main-page SEO/AIO readiness: ~7.3/10** (technical/entity strong; brand SERP + thin landings + host dual-serve hold the score down).

---

## Sitewide technical findings

### Pass
- HTTPS + HSTS (`max-age=63072000`).
- Apex canonicals consistently `https://avniguy.co.il/...` even when fetched via `www`.
- `x-nextjs-prerender: 1` — primary HTML is crawlable text (critical for AIO grounding).
- `robots.txt`: `Allow: /` for `*`; CMS paths disallowed; explicit allow for GPTBot / OAI-SearchBot / Claude* / Perplexity* / Google-Extended (owner policy documented in file).
- `Sitemap: https://avniguy.co.il/sitemap.xml` — **139** `<loc>` entries including all main hubs.
- `rss.xml` **200**; `llms.txt` + `llms-full.txt` + `agent-card.json` present and correctly framed as **non-Google** discovery (matches Google mythbusting).
- Images on audited pages: **0 missing alts** in sampled main pages.
- Meta robots: `index, follow` on all audited pages; no `nosnippet` / `noindex` observed.

### Fail / risk
1. **Host dual-serve (P0):** `https://www.avniguy.co.il/` and `https://avniguy.co.il/` both return **200** (no 301 www→apex). Canonicals point to apex (mitigation), but crawl budget + possible soft duplicate signals remain. Prefer **301 www → apex** at edge.
2. **Thin practice URLs (P0 for quality):**  
   - `/nedlan-lawyer-guy-avni/` ≈ **193** words  
   - `/contracts-lawyer-guy-avni/` ≈ **187** words  
   Nov 2026 Google guide: avoid low-value / variation pages; prefer unique expert content or consolidate into `/services/` + topic articles.
3. **OG image reuse (P1):** fallback `...og-law-fallback-photo-1.jpg` used on **10/12** main pages (only `/` and `/about/` unique). Conflicts with project unique-image law and weakens social/AI media distinctiveness.
4. **Home payload (P2):** ~**240 KB** HTML — hurts page experience vs lighter hubs (~60–130 KB).
5. **Sitemap freshness (P2):** several main `lastmod` values look stale (e.g. home `2026-07-09`) relative to live content age — weak freshness signal for crawlers.
6. **Disclaimer consistency (P2):** visible-body legal “not personal advice” present on about/blog/media/sheelot/editorial/contracts; **missing in visible body** on home, services, categories, guy-avni, nedlan, contact (contact has phrase only in meta description). YMYL trust gap.

---

## Per-page matrix (live 2026-11-08)

Legend: T=title, D=meta description chars, W≈visible words, H1=count, Schema=types summary.

| Page | T / H1 align | D | W | Schema highlights | AIO-relevant | Issues |
|------|--------------|---|---|-------------------|--------------|--------|
| `/` | OK firm brand; H1=title | 137 | ~2178 | WebSite, LegalService, FAQ(5), HowTo, ItemList | Strong FAQ + textual depth | No Person `@id`; no disclaimer; heavy exact-name H2 repetition; large HTML |
| `/about/` | Strong entity (`אודות גיא אבני עורך דין`) | 133 | ~1756 | Person `#person`, AboutPage, FAQ(8), HowTo, Breadcrumb | **Best AIO/entity page** | Keep as canonical entity; ensure SERP titles stay entity-first |
| `/guy-avni/` | Latin+Hebrew card | 112 | ~518 | Person → `/about/#person`, FAQ | Good for Latin queries | OG fallback; secondary to `/about/` (OK if thin unique value only) |
| `/services/` | OK; H1 longer than title | 134 | ~924 | FAQ, HowTo, ItemList, WebPage | Solid | No Person node; OG fallback |
| `/contact/` | Title short; H1 conversion-led | 154 | ~370 | Person + LegalService + Breadcrumb | Weak citability | Thin; no ContactPage / NAP schema; no FAQ; disclaimer in meta only (not visible body) |
| `/blog/` | OK index | 125 | ~1432 | CollectionPage, ItemList | Hub OK | OG fallback; low H2 structure |
| `/categories/` | OK | 125 | ~643 | CollectionPage, FAQ(3), ItemList | OK | OG fallback |
| `/sheelot/` | Question H2s excellent for answers | 128 | ~570 | FAQPage(8) | **High AIO answer potential** | Answers short — deepen with unique practice POV + cite sources |
| `/nedlan-lawyer-guy-avni/` | Keyword landing | 121 | ~**193** | Person + WebPage | Poor | **Thin / consolidate or rewrite** |
| `/contracts-lawyer-guy-avni/` | Keyword landing | 94 | ~**187** | Person + WebPage | Poor | **Thin / consolidate or rewrite** |
| `/media/` | OK | 126 | ~503 | FAQ(4) | Supports sameAs / brand | OG fallback |
| `/editorial-policy/` | Trust page OK | 132 | ~681 | FAQ(4) | Strong E-E-A-T support | OG fallback |

---

## AIO / AI Overviews checklist (official)

| Check | Live status |
|-------|-------------|
| Crawlable / not blocked | PASS |
| Indexed + snippet eligible (no nosnippet) | PASS (live controls); confirm in GSC URL Inspection |
| Text generative AI control = Include | **OPERATOR:** verify in Search Console |
| Important content in HTML text (not image-only) | PASS (prerender) |
| Structured data matches visible content | MOSTLY PASS — FAQ pages have visible Qs; HowTo on home/about/services should stay in sync with UI |
| Unique non-commodity insight | MIXED — about/home/services yes; practice landings no |
| Media support (image/video) | PARTIAL — unique OG weak; **no** on-page `<video>`/`<iframe>` embeds found; YouTube appears only as channel links / `sameAs` |
| Internal linking to entity + hubs | PASS (dense apex internal links) |
| GSC Generative AI performance monitored | **OPERATOR** |
| Avoid scaled / fan-out doorway pages | **FAIL risk** on two practice landings |

Note: Presence of `llms.txt` / MCP / agent-card is **aligned** with Google’s “OK for other systems, ignored for Search ranking” guidance — do not treat as AIO ranking work.

---

## Brand / entity SERP snapshot (Google IL, 2026-11-08)

Query samples (Bright Data Google `country=il`) — **directional only** (third-party SERP; ranks not GSC-verified; confidence on exact positions **&lt; 0.95**):

- `גיא אבני עורך דין` — sampled organic included **`guyavni.co.il`** + news (Globes / similar); avniguy not observed as clear #1 in that sample.
- `"גיא אבני"` — name collisions (other people) + other firm/news in sample; avniguy appeared in the sampled set but not proven top.
- `site:avniguy.co.il גיא אבני` — sampled hits included home/about/services/contact/categories with expected titles/snippets (indexing existence for those URLs: high confidence; completeness of index: unproven).

**Implication (Nov 2026):** AIO citations for the person entity will prefer sources with clear entity disambiguation + trust. `/about/` already does public-record transparency; still need host consolidation, stronger NAP/GBP if local intent, and resolution of **sameAs → `https://guyavni.co.il/`** (URL is present in live Person/LegalService `sameAs`; if that property is *not* this practice, it injects entity confusion into the Knowledge Graph / RAG context).

---

## Priority actions (implementation-ready)

### P0
1. **301 `www` → apex** (Vercel domain / redirects) so only one host serves 200.
2. **Thin landings:** either (a) expand `/nedlan-lawyer-guy-avni/` and `/contracts-lawyer-guy-avni/` into unique expert guides (≥ people-first depth, sources, process POV) **or** (b) 301 into `/services/` + relevant category/articles — prefer (b) if no unique experience to add.
3. **Audit `sameAs` → guyavni.co.il** — keep only if same legal person/org; otherwise remove to stop cross-entity pollution.

### P1
4. Unique OG/hero images per main page (stop shared fallback on 10 hubs).
5. Add visible YMYL disclaimer to home + contact (+ any hub missing it).
6. Contact page: deepen prep content; add `ContactPage` + `ContactPoint` (phone/email/areaServed) matching visible NAP; consider GBP consistency.
7. Home JSON-LD: reference `https://avniguy.co.il/about/#person` from LegalService/`about`/`employee` so entity graph is home→about coherent.

### P2
8. Refresh sitemap `lastmod` from real content mtimes.
9. Reduce home HTML weight / H2 exact-match density (keep entity anchors; cut repetitive “גיא אבני” stuffing).
10. Operator: confirm Search Console generative AI control = Include; baseline Generative AI performance report for main URLs.
11. Deepen `/sheelot/` answers with unique practice notes + outbound citations to primary law sources (improves answer-engine citability without “AEO hacks”).

---

## What not to do (per Google Jul/Dec 2025–2026 docs)

- Do not add special “AI Overview schema”.
- Do not rewrite copy solely for AI phrasing / chunking.
- Do not spawn more query-variation landing pages for fan-out coverage.
- Do not treat `llms.txt` as a Google ranking project (keep for other agents if useful).
- Do not chase inauthentic web mentions.

---

## Evidence log

- Live fetches: 2026-11-08, User-Agent SEOAudit/2026.11, status 200 all scoped HTML routes.
- robots/sitemap/llms/rss/agent-card: fetched same day.
- Official rubric URLs + last-updated dates cited in header.
- SERP samples: Google IL via Bright Data (untrusted third-party SERP HTML; treat ranks as directional, re-check in GSC/SerpBear).
- **Validate-true re-fetch:** 2026-11-08 (same day), User-Agent SEOValidate/2026.11 — see section below.

---

## VALIDATE_TRUE (`.commends/TODO_validate_true.md`) — 2026-11-08

**Rule:** every item must be true/correct with confidence **&gt; 0.95**, else corrected or demoted.

### Corrections applied (failed &gt;0.95 as originally written)

| # | Original claim | Verdict | Fix |
|---|----------------|---------|-----|
| C1 | “video embeds present sitewide” | **FALSE** (conf ≥0.99) | No `<iframe>`/`<video>` on home/media; YouTube only as footer/`sameAs` channel links. Checklist row corrected. |
| C2 | Contact issues: “no disclaimer” | **IMPRECISE** (conf ≥0.99) | Meta description contains “אינו תחליף לייעוץ”; **visible body has none**. Matrix + disclaimer bullet corrected. |
| C3 | SERP absolute dominance / mid-pack phrasing | **NOT &gt;0.95** | Third-party SERP sample only. Language demoted to directional; scorecard brand pillar remains judgment. |

### Fact checks — PASS (conf &gt; 0.95)

| Claim | Conf | Proof |
|-------|------|-------|
| `www` and apex both HTTP 200 (no 301 www→apex) | 0.99 | `curl -I` both hosts → 200; http→https 308 only |
| Apex canonicals on www fetches | 0.99 | `www/about/` canonical = `https://avniguy.co.il/about/` |
| HSTS `max-age=63072000` | 0.99 | response header |
| Prerender `x-nextjs-prerender: 1` on main HTML | 0.99 | headers |
| robots Allow `/`, Disallow keystatic, listed AI bots present, Sitemap line | 0.99 | `/robots.txt` |
| sitemap **139** `<loc>` | 0.99 | count |
| rss.xml 200; feed.xml 404; llms.txt / llms-full.txt / agent-card.json 200 | 0.99 | HEAD/GET |
| llms.txt frames non-Google discovery | 0.98 | Hebrew note re Google Search / SEO theater |
| Per-page status 200, title/H1/canonical/desc_len/words/kb as matrix (re-measured) | 0.99 | table re-fetch matches within rounding |
| Thin landings ~193 / ~187 words | 0.99 | word count method stable |
| Home ~2178 words, ~240.0 KB HTML | 0.99 | |
| OG fallback reused on **10/12** main pages; unique on `/` and `/about/` only | 0.99 | Counter |
| 0 missing `alt` on audited main-page `<img>` | 0.99 | |
| Home LD types include FAQ(5)/HowTo/ItemList/LegalService/WebSite/WebPage; **no Person** | 0.99 | JSON-LD parse |
| About has Person `@id` `/about/#person`, FAQ 8, AboutPage | 0.99 | |
| Contact has Person, **no** ContactPage, **no** FAQPage | 0.99 | |
| `sameAs` includes `https://guyavni.co.il/` on Person | 0.99 | about Person.sameAs |
| Sitemap home lastmod `2026-07-09` | 0.99 | sitemap XML |
| Home all 11 H2s contain “גיא אבני” | 0.99 | |
| Google AI docs: no special AIO markup; llms.txt ignored for Search; Search generative AI control required; Generative AI performance report exists | 0.98 | fetched docs last-updated 2025-12-10 / 2026-07-10 |
| HowTo on home name matches visible H2 process section; 4 steps in LD | 0.97 | schema↔H2 name match (step UI sync not line-audited beyond name) |

### Judgment / non-fact items (not assertable &gt;0.95 as “true”)

- Numeric pillar scores and overall **~7.3/10** — operator judgment, kept as opinion.
- “near-doorway” / “FAIL risk” labeling of thin landings — interpretive vs Google scaled-content policy; thin word counts themselves are facts.
- “Best AIO/entity page” / “High AIO answer potential” — qualitative.
- GSC generative AI control value and Generative AI report baselines — **unverified** (operator).
- Full index coverage for all 139 sitemap URLs — unproven from outside GSC.

### Validate-true result

- **Factual live/technical claims:** re-verified; **3 corrections** applied (C1–C3).
- Remaining factual bullets in Pass/Fail/matrix (after corrections): **conf &gt; 0.95**.
- Opinion scores + SERP ranks: explicitly marked non-&gt;0.95 / directional.

---

## next plan suggestion

`007` or next plan id: **host-canonical-301 + thin-landing consolidate + sameAs cleanup + unique OG for main hubs** — then re-run this audit checklist.

## files to read (if implementing)

- `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`
- `src/app/nedlan-lawyer-guy-avni/page.tsx`, `src/app/contracts-lawyer-guy-avni/page.tsx`
- `src/lib/seo/*`, `vercel.json` / domain redirects
- `public/robots.txt`, `public/llms.txt`

## open issues

- [ ] www→apex 301
- [ ] thin practice pages disposition
- [ ] sameAs guyavni.co.il validity
- [ ] unique OG per main page
- [ ] GSC generative AI control + performance baseline (owner)
- [ ] home Person graph + disclaimer
