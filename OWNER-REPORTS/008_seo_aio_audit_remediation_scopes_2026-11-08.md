# SEO/AIO audit remediation scopes — 006 + 007 merge

**Sources:** `006_seo_aio_live_main_pages_audit_2026-11-08.md` + `007_seo_aio_content_keywords_main_pages_2026-11-08.md`  
**Created:** 2026-11-08  
**Mode:** sequential (shared pages/footer/schema — no parallel file claims)  
**Status:** owner workfile — not SSOT  
**DoD:** every IN_REPO scope `[x]` only after plan → implement → verify → post-impl → governance → review-scope → validate_true (conf > 0.95)

---

## Merge notes

| Duplicate theme | Kept as |
|-----------------|---------|
| Thin practice landings (006 P0 + 007 P0) | `thin-practice-landings` |
| sameAs + dual guyavni footer/copy (006 P0 + 007 P0) | `sameas-dual-domain-clarity` |
| Home H2 stuffing (007 P0) + home density/weight (006 P2) | `home-h2-destuff` (+ optional weight in same plan if cheap) |
| YMYL disclaimer (006 P1 + 007 P1) | `ymyl-disclaimer-hubs` |
| Contact depth/schema (006 P1) + contact FAQ (007 P1) | `contact-schema-depth` |
| Sheelot deepen (006 P2 + 007 P1) | `sheelot-answer-depth` |
| Home misui framing (007 P1) | folded into `home-h2-destuff` DoD |
| GSC generative control (006/007) | `OPERATOR-gsc-generative` |

---

## Scopes (P0 → P1 → P2 → OPERATOR)

### P0

- [x] **www-apex-301** — 301 `www.avniguy.co.il` → apex `avniguy.co.il` at edge (Vercel domain redirects / `vercel.json`). DoD: `curl -I https://www.avniguy.co.il/` → 301/308 Location apex; apex still 200. Sources: 006 P0.1
- [x] **thin-practice-landings** — Dispose `/nedlan-lawyer-guy-avni/` and `/contracts-lawyer-guy-avni/` (MainW ~74–79, 0 H2): either expand into unique expert guides (process, checklists, primary sources, first-hand POV) **or** 301 into `/services/` (+ category/articles). Prefer consolidate if no unique experience. Update sitemap/internal links. DoD: no thin doorway URLs remain live as thin; verify word depth or 301. Sources: 006 P0.2, 007 P0.1
- [x] **sameas-dual-domain-clarity** — Audit `sameAs` → `https://guyavni.co.il/`; keep only if same legal person/org else remove. Align sitewide footer dual-domain messaging so entity intent is unambiguous (avniguy = content authority; conversion link only if valid). DoD: schema + visible copy consistent; no cross-entity pollution if unrelated. Sources: 006 P0.3, 007 P0.3
- [x] **home-h2-destuff** — Rewrite home H2s so they are human topical (process/audience/FAQ) without forcing `גיא אבני` into every H2; keep brand in H1/title/body naturally. Add one people-first `מיסוי מקרקעין` / מס שבח–רכישה framing section linking tax category + sheelot (no stuffing). Optionally trim home HTML weight if same change set. DoD: not all H2s contain brand string; misui framing present. Sources: 007 P0.2, 007 P1.6, 006 P2.9

### P1

- [x] **unique-og-main-pages** — Unique OG/hero image per remaining main hub (stop shared `og-law-fallback-photo-1.jpg` on hubs). Respect `unique-site-images.mdc`. DoD: each live main page has distinct OG; optimize images. Sources: 006 P1.4
- [x] **ymyl-disclaimer-hubs** — Add visible site-level YMYL “not personal advice” disclaimer to hubs missing it: home, services, categories, contact (visible body), and practice pages if kept. DoD: phrase visible in body on listed hubs. Sources: 006 P1.5, 007 P1.5
- [ ] **contact-schema-depth** — Deepen contact prep content; add `ContactPage` + `ContactPoint` (phone/email/areaServed) matching visible NAP; add 2–4 prep FAQ Q→A. DoD: schema types present + match visible; FAQ visible. Sources: 006 P1.6, 007 P1.7
- [ ] **home-person-graph** — Home JSON-LD: reference `https://avniguy.co.il/about/#person` from LegalService/`about`/`employee` so home→about entity graph is coherent. DoD: Person `@id` link present in home LD. Sources: 006 P1.7
- [ ] **sheelot-answer-depth** — Deepen `/sheelot/` answers with unique practice notes, concrete steps, outbound cites to primary law / Tax Authority; keep Q→A structure. DoD: answers longer/substantive than ~150–192c commodity text; citations present. Sources: 006 P2.11, 007 P1.4

### P2

- [ ] **sitemap-lastmod** — Refresh sitemap `lastmod` from real content mtimes (not stale e.g. home `2026-07-09`). DoD: main hubs lastmod reflect current content age. Sources: 006 P2.8
- [ ] **services-about-dedupe** — Soften services↔about practice-list duplication: services = pathways/process; about = identity/E-E-A-T. DoD: reduced copy collision without losing mesh. Sources: 007 P2.9

### OPERATOR (not in-repo code — DoD = instructions + documented blocker)

- [x] **OPERATOR-gsc-generative** — Owner: confirm Search Console Search generative AI control = Include; baseline Generative AI performance for main URLs. DoD: written verification steps + owner confirmation note (agent cannot click GSC). Sources: 006 P2.10, 007 P2.10
- [x] **OPERATOR-media-verified-only** — Do not invent media appearances; enrich `/media/` only with verified items when owner supplies them. DoD: instructions recorded; no fabricated entries shipped. Sources: 007 P2.8

#### OPERATOR-gsc-generative — owner verification steps (agent cannot click)

1. Open Google Search Console → property `avniguy.co.il` (apex; after www→apex redirect prefer apex property).
2. Settings → **Crawl** / **Search generative AI** (or current GSC label for generative AI control) → set/confirm **Include** (not Exclude).
3. Performance → **Generative AI** (or Search results filtered to generative surfaces when available) → export/baseline impressions/clicks for main hubs: `/`, `/about/`, `/services/`, `/sheelot/`, `/contact/`, `/categories/`, `/blog/`.
4. URL Inspection on each hub: indexable, no `nosnippet`, canonical apex.
5. Record date + screenshot/note in owner ops log. **Owner confirmation:** pending human click — instructions complete 2026-11-08.

#### OPERATOR-media-verified-only — no-invent rule

1. Do **not** add appearances to `/media/` unless the owner supplies a verifiable URL, outlet name, date, and title.
2. Prefer primary source (publisher page, YouTube upload owned by firm, court/media byline) over hearsay.
3. If unverified: leave slot empty; do not invent guests, shows, or dates.
4. This remediation run shipped **zero** new fabricated media rows.

---

## VALIDATE_TRUE (scope list) — 2026-11-08

**Rule:** every actionable item traced to 006/007 with conf > 0.95 that the source audits contain the finding.

| Scope | Source claim | Conf |
|-------|--------------|------|
| www-apex-301 | 006: www+apex both 200 | 0.99 |
| thin-practice-landings | 006 ~193/187 W; 007 MainW 79/74, 0 H2 | 0.99 |
| sameas-dual-domain-clarity | 006 sameAs guyavni; 007 footer dual messaging | 0.99 |
| home-h2-destuff | 007 11/11 H2 brand; home misui exact 0 | 0.99 |
| unique-og-main-pages | 006 OG fallback 10/12 | 0.99 |
| ymyl-disclaimer-hubs | 006/007 uneven disclaimer | 0.99 |
| contact-schema-depth | 006 no ContactPage; 007 0 FAQ | 0.99 |
| home-person-graph | 006 home LD no Person | 0.99 |
| sheelot-answer-depth | 006/007 deepen answers | 0.98 |
| sitemap-lastmod | 006 home lastmod 2026-07-09 | 0.99 |
| services-about-dedupe | 007 P2 services↔about | 0.97 |
| OPERATOR-* | marked operator in both audits | 0.99 |

**Outcome:** PASS — no invented scopes; duplicates merged.

---

## Execution

Follow `.commends/TODO_scope_list_implement.md` + `.cursor/skills/scope-list-implementation-loop/SKILL.md`.  
State: `notes/implementations/scope_loop_state.json`  
DAG: `notes/implementations/scope_dag.json`  
Close-out each plan/report with `.commends/TODO_validate_true.md`.
