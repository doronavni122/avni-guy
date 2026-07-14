# Globes SERP nuke — #3 agentic occupation (continue here)

**Repo:** `avni-guy` (avniguy.co.il)  
**Created:** 2026-07-14  
**Status:** owner checklist — not SSOT  
**Companion (measurement only):** `serp-bar/OWNER-REPORTS/001_serp-ranking-pipeline-work_2026-07-07.md`  
**Prior site scopes:** `OWNER-REPORTS/001_serp-ranking-site-seo-work_2026-07-07.md`, `OWNER-REPORTS/002_serp-ranking-site-seo-scopes_2026-07-07.md`  
**Research chat:** serp-bar session 2026-07-14 (Globes first-page nuke ranking)

## Boundary

| In this repo | Not in this repo |
|--------------|------------------|
| avniguy.co.il pages, schema, IndexNow, Wikidata sameAs, content surfaces | Globes publisher demand (#1) |
| Raise owned ranks until Globes leaves page 1 | Israeli court order → Google Legal (#2) |
| Verify via serp-bar report / Bright Data | `serp-bar` Google-removal / Facebook Graph demote |

**Framing:** #3 is **displace**, not Google delist. Globes URLs stay indexed; goal is Globes organic positions **> 10** on both name keywords.

## Why #3 lives here

| Rank | Action | Agent E2E? | Where |
|------|--------|------------|-------|
| #1 | Globes delete/noindex `did=1001489336` → Google Outdated Content | No | Human + Globes; serp-bar ROC after 404 |
| #2 | Israeli court order naming exact URLs → Google Legal Help court-order form | No | Counsel + court |
| **#3** | **SERP occupation on avniguy.co.il** until Globes >10 | **Yes** | **This repo** |

Google Outdated / personal-info deny live court journalism (`Content still on page`). Facebook `#3` is `globesnews` → `FACEBOOK_NOT_OWNED`. Only owned-site occupation is fully agent-completable.

## Live SERP baseline (2026-07-14, Google IL Bright Data)

### Keyword: `גיא אבני`

| Rank | Host | URL / note |
|------|------|------------|
| 1 | globes.co.il | `article.aspx?did=1001489336` (מוכר החלומות — פסק דין ראשון) |
| 2 | guyavni.co.il | firm site (separate property) |
| 3 | facebook.com | globesnews post (mirror of #1) |
| 4 | globes.co.il | `article.aspx?did=1001501424` (אישור מחלה / 1.2M) |
| 5–8 | directories / calcalist / Haifa / guyavni contact | mixed |
| ~12 | globes.co.il | `did=1001533397` (670k) |
| — | **avniguy.co.il** | **not in top 10** |

### Keyword: `גיא אבני עורך דין`

| Rank | Host | URL / note |
|------|------|------------|
| 1 | guyavni.co.il | firm home |
| 2 | globes.co.il | `did=1001489336` |
| 3 | facebook.com | globesnews mirror |
| 4 | globes.co.il | `did=1001501424` |
| 8 | **avniguy.co.il** | home — only owned page-1 foothold |
| 10 | globes.co.il | `did=1001533397` |

**Success criteria (this report):**

- [ ] `גיא אבני` — zero `globes.co.il` URLs with organic rank ≤ 10 (desktop + mobile in serp-bar)
- [ ] `גיא אבני עורך דין` — zero `globes.co.il` URLs with organic rank ≤ 10
- [ ] avniguy owns ≥ 2 distinct URLs in top 10 on each keyword (hub + home and/or strong posts)

## Already shipped (002 scopes — do not redo blindly)

Scopes in `002` marked `[x]`: entity hub `/about/`, Person JSON-LD, BlogPosting `@id` mesh, runtime entity links, FAQPage, SearchAction `/search/`, IndexNow + GSC inspection scripts, Wikidata sync script.

**Live spot-check 2026-07-14:** `https://avniguy.co.il/about/` title ≈ `גיא אבני עורך דין | משרד גיא אבני`; Person + FAQ present. Drift vs 001 plan title `גיא אבני | עורך דין` — close but not exact plan string.

**Gap:** foundation shipped; **rank outcome not yet met** (Globes still page 1). This report = iteration until criteria pass.

## Agent E2E loop (continue from here)

Repeat until success criteria checked:

1. **Measure** — in `serp-bar`: free :3000, SerpBear up, `npm run run:report` (or Bright Data cross-check `geo_location=il`). Record avniguy + globes ranks for both keywords.
2. **Diagnose** — which owned URLs rank / missing; title-H1-query match; indexation (run `scripts/gsc-url-inspection.mjs` if secrets set).
3. **Implement one atomic SEO change** in this repo (examples below) — honor 002 non-regression (no MDX source rewrites; runtime entity links only).
4. **Ship** — `pnpm run build:ci` → deploy → `pnpm run post-deploy-indexnow` (or equivalent) for changed URLs.
5. **Re-measure** after crawl window; update criteria checkboxes only when ranks prove it.
6. **Handoff** — if continuing next session, append a dated note block at bottom of **this** file (do not invent SSOT elsewhere).

### Priority work queue (open)

- [ ] Align `/about/` `<title>` / visible H1 to exact SERP query strings (`גיא אבני`, `גיא אבני עורך דין`) without breaking brand — verify snippet in live Google
- [ ] Ensure homepage does not conflict with entity hub (canonical / internal link weight → `/about/`)
- [ ] Force IndexNow + GSC inspect on `/`, `/about/`, top 20 blog URLs; fix any non-indexed
- [ ] Confirm Wikidata Q-item exists and `WIKIDATA_PERSON_URL` set in prod env so `sameAs` emits live
- [ ] Add / strengthen 1–2 **self-owned** ranking URLs (hub sections or high-intent static pages — not Globes commentary) that can occupy extra page-1 slots
- [ ] Runtime entity-link density audit: sample posts actually inject anchors to `/about/`
- [ ] After each deploy: serp-bar report → paste rank snapshot into dated note below
- [ ] Stop when Globes >10 on both keywords; mark success criteria `[x]`

### Explicitly out of scope for agents here

- Emailing Globes / court filings / Google Legal court-order PDF upload
- Editing `serp-bar` removal queue to spam Outdated Content on live Globes (policy deny)
- Mutating `src/content/blog/` MDX sources for entity links (use runtime inject only)
- Claiming Meta Graph demote of `globesnews` posts

## Globes URLs (context only — do not scrape-edit)

| Priority | URL | Live role 2026-07-14 |
|----------|-----|----------------------|
| P0 | `https://www.globes.co.il/news/article.aspx?did=1001489336` | #1 name / #2 lawyer |
| P0 | `https://www.globes.co.il/news/article.aspx?did=1001501424` | #4 both |
| P0 mirror | Facebook globesnews post id path `…935942738577620` | #3 both |
| P1 | `https://www.globes.co.il/news/article.aspx?did=1001533397` | ~#10–12 |
| P1 | `https://www.globes.co.il/news/גיא_אבני.tag` | person hub (serp-bar sometimes mis-paired) |

serp-bar note: report CSV previously mis-paired titles with `did=1001533397`; trust Bright Data / live Google for occupation targeting.

## Files to read first (next agent)

```
OWNER-REPORTS/003_globes-serp-nuke-occupation_2026-07-14.md  (this)
OWNER-REPORTS/002_serp-ranking-site-seo-scopes_2026-07-07.md  (non-regression)
src/app/about/page.tsx
src/lib/seo/schema-person.ts
src/lib/content/inject-entity-links.ts
scripts/post-deploy-indexnow.mjs
scripts/gsc-url-inspection.mjs
```

## Rules / tools

- `.cursor/rules/owner-reports-non-authoritative.mdc` — this file is working context, not product law
- `.cursor/rules/content-seo-quality.mdc` + 002 non-regression constraints
- Measure: serp-bar `npm run run:report` + Bright Data `search_engine` `geo_location=il`
- Atomic commits + `task_graph.log` per avni-guy enforcement

## Confidence

- 0.95 that #3 is the correct **agent-E2E** path vs #1/#2
- Rank time-to-criteria unknown (iterate); foundation from 002 reduces bootstrap risk

---

## Dated notes

### 2026-07-14 — handoff from serp-bar research

- Ranked nuke options; #3 placed here for continuation.
- Live SERP captured via Bright Data zone (see tables above).
- 002 scopes largely complete; outcome gap remains — occupation iteration starts next.
