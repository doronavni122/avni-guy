# Plan: indexnow-gsc-one-shot

ADR: none , (cite SSOT.md)

## Goal

One-shot ops after deploy: IndexNow priority set (`/`, `/about/`, top-20 newest blog URLs); GSC URL Inspection via real Google client when credentials exist, else dense manual console path — never fake live success.

## SSOT

- `SSOT.md` §A–E (static Next, MDX blog, verify via `pnpm build`)
- Dep DONE: `indexnow-deletes-redirects-completeness` — full update/redirect/gone ping + honest sitemap
- Existing: `scripts/post-deploy-indexnow.mjs`, `scripts/gsc-url-inspection.mjs`
- Session context (non-authoritative): `notes/sessions/session_serp-seo-gsc-handoff_2026-07-08.txt`

## Exclusive files

- `scripts/post-deploy-indexnow.mjs`
- `scripts/gsc-url-inspection.mjs`
- Plan / brief / ops runbook under `notes/implementations/` + this plan

## Non-goals

- No `package.json` / new deps (no `googleapis`); JWT+fetch client only
- No fake IndexNow/GSC “ok” when key/credentials unset or API fails
- No edits to `src/app/api/indexnow/`, sitemap, middleware, env schema (document env in ops runbook only)
- No live claimed success in CI without secrets

## Design

### 1. IndexNow top-20 one-shot (`scripts/post-deploy-indexnow.mjs`)

- Keep default postbuild behavior: full live set + redirect + gone (from dep scope).
- When `INDEXNOW_ONESHOT_TOP20=1`: build **priority** update set = `/`, `/about/` + newest 20 posts by `pubDate` (gray-matter / fallback mtime); still honor dry-run vs live (`INDEXNOW_KEY` + `VERCEL=1`|`INDEXNOW_PING=1`).
- Log counts distinctly: `mode=full|top20-oneshot`; never print success without live POST ok.
- Optional: oneshot redirect sources only for those 20 slugs (prefix `guy-avni-`).

### 2. GSC URL Inspection (`scripts/gsc-url-inspection.mjs`)

- Target URLs: `/`, `/about/`, top-20 newest blog posts (same selection).
- If `GSC_SERVICE_ACCOUNT_JSON` points to readable SA JSON + `GSC_SITE_URL` set (e.g. `sc-domain:avniguy.co.il` or `https://avniguy.co.il/`):
  - JWT RS256 → OAuth token (`webmasters.readonly`)
  - POST `urlInspection/index:inspect` per URL
  - Log `coverageState` / `verdict`; ALERT when not indexed / fail
  - Persist results JSON under `.next/gsc-url-inspection-last.json` (local artifact; not a success claim)
- Else: write URL checklist to `.next/gsc-manual-urls.json`, print MANUAL path steps, exit 0 — no fake API success.
- Env `GSC_FORCE_MANUAL=1` forces manual path even if credentials present.

### 3. Ops runbook (`notes/implementations/013_ops_indexnow_gsc_one_shot_g1_ops_runbook.txt`)

Dense machine-parseable: env keys, oneshot IndexNow command, GSC API vs human Search Console steps, ticket-only-non-indexed rule, one run per deploy.

## Verify

- `node scripts/post-deploy-indexnow.mjs` dry-run (no key / no PING) logs top20 or full counts
- `INDEXNOW_ONESHOT_TOP20=1 node scripts/post-deploy-indexnow.mjs` shows priority count ≤ 22
- `node scripts/gsc-url-inspection.mjs` without credentials → MANUAL path, exit 0
- `pnpm build` + `pnpm dev` (scripts wired via postbuild; must not fail CI)

## Commits (atomic)

1. plan-ops-indexnow-gsc-one-shot-g1
2. expand-indexnow-oneshot-top20-mode
3. implement-gsc-url-inspection-jwt-or-manual
4. add-ops-runbook-indexnow-gsc-one-shot
5. brief-indexnow-gsc-one-shot
