# SERP ranking — avniguy.co.il site work

**Repo:** `avni-guy` (avniguy.co.il)  
**Created:** 2026-07-07  
**Source:** serp-bar keyword report run 2026-07-07 (read-only input)  
**Companion (pipeline work):** `serp-bar/OWNER-REPORTS/001_serp-ranking-pipeline-work_2026-07-07.md`  
**Status:** owner checklist — not SSOT (see `OWNER-REPORTS/README.md`)

## Goal

Raise **avniguy.co.il** for `גיא אבני` and `גיא אבני עורך דין` (today ~#13–17; was #100).

## Boundary (this repo only)

| In scope | Out of scope |
|----------|--------------|
| Next.js pages, MDX, JSON-LD, sitemap, robots, Vercel deploy hooks | serp-bar report HTML/UI, Surge deploy, SerpBear Docker |
| GSC + IndexNow for **avniguy.co.il** property | Competitor URL monitoring scripts (→ serp-bar) |
| On-site internal linking, entity hub, schema | Editing globes / ynet / calcalist / facebook content |
| Wikidata / sameAs pointing **to** this site | `config/position-baselines.json` in serp-bar |

**Data flow:** serp-bar **measures** ranks → this repo **implements** on-site SEO. No circular dependency.

---

## Checklist — site work (confidence > 0.95)

### 1. Entity hub + exact SERP title/H1 alignment — **0.97**

- [ ] Add canonical entity page (e.g. `/about/` or `/guy-avni/`) as **entity home**
- [ ] `<title>` = `גיא אבני | עורך דין` (match current Google snippet)
- [ ] `<h1>` = `גיא אבני עורך דין`
- [ ] Standalone `Person` JSON-LD with stable `@id`: `https://avniguy.co.il/about/#person`
- [ ] Fields: `name`, `jobTitle`, `url`, `image`, `worksFor`, `knowsAbout`, `hasCredential`
- [ ] Align or redirect homepage entity signals so H1/title are not conflicting (`גיא אבני - מה קורה כשפותחים תיק…`)

**Files (expected):** `src/app/about/page.tsx` or new route, `src/lib/seo/schema-person.ts`, layout metadata helpers.

---

### 2. BlogPosting `@id` author graph + internal-link mesh — **0.96**

- [ ] Change all `BlogPosting.author` from inline `Person` to `{ "@id": "https://avniguy.co.il/about/#person" }`
- [ ] Add `"about": { "@id": "…/#person" }` on articles
- [ ] Build-time script: inject 2–3 contextual links per post → entity hub
- [ ] Anchor registry (rotate): `גיא אבני`, `גיא אבני עורך דין`, `עו״ד גיא אבני` (~20–30% exact-match cap)
- [ ] Entity-relationship sentences in body (not naked anchors)

**Files (expected):** `src/lib/seo/schema-article.ts`, `scripts/inject-entity-links.mjs` (or build hook), blog layout component.

---

### 3. Wikidata entity + `sameAs` graph — **0.95**

- [ ] Create/claim Wikidata Q-item (REST API or WikibaseIntegrator)
- [ ] Properties: `P856` → avniguy.co.il, `P106` lawyer, Hebrew label `גיא אבני`
- [ ] Put Wikidata QID **first** in `Person.sameAs` on entity home
- [ ] Add: LinkedIn, Israel Bar listing, verified social (as available)

**Files (expected):** `src/lib/seo/schema-person.ts`, optional `scripts/wikidata-sync.mjs` (secrets in env, not committed).

---

### 4. Brand FAQPage + SearchAction (SERP feature capture) — **0.95**

- [ ] Replace/add brand-targeted `FAQPage` on entity hub:
  - `מי זה גיא אבני?`
  - `גיא אבני עורך דין — באילו תחומים?`
  - `איך ליצור קשר עם גיא אבני?`
- [ ] Add `WebSite.potentialAction` → `SearchAction` targeting `/search?q={search_term_string}`
- [ ] Implement minimal `/search` route so schema validates

**Files (expected):** entity hub page, `src/app/search/page.tsx`, schema helpers.

---

### 5. GSC + IndexNow closed loop (avniguy property) — **0.98**

- [ ] `app/api/indexnow/route.ts` — POST changed URLs on publish/deploy
- [ ] Host `{INDEXNOW_KEY}.txt` in `public/`
- [ ] On Keystatic publish / Vercel deploy: ping IndexNow + bump sitemap `lastmod`
- [ ] Daily/weekly cron (or CI): GSC URL Inspection API on entity hub + top 20 blog URLs
- [ ] Alert if `coverageState ≠ SUBMITTED_AND_INDEXED`

**Secrets:** GSC service account, IndexNow key → Vercel env (not in repo).

**Files (expected):** `src/app/api/indexnow/route.ts`, deploy hook or `scripts/post-deploy-indexnow.mjs`.

---

## Suggested execution order

```
Week 1: #1 entity hub + #2 schema @id refactor
Week 2: #3 Wikidata + #4 FAQ/SearchAction
Week 3: #5 IndexNow/GSC loop
```

## Report baseline (2026-07-07)

| Keyword | avniguy.co.il | Top blockers |
|---------|---------------|--------------|
| גיא אבני | #13 desktop & mobile | globes #1, facebook #4, calcalist #6–7 |
| גיא אבני עורך דין | #14 / #17 | globes #2, facebook #3, calcalist #6 |

**Live report (read-only):** https://serp-bar-kw-report.surge.sh/
