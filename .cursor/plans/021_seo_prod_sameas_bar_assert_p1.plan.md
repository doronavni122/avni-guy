# Plan: prod-sameas-bar-assert

ADR: none , (cite SSOT.md)

## Goal

Prod Person `sameAs` assert: emit only truthful env-claimed edges; include `PERSON_ISRAEL_BAR_URL` in sameAs / memberOf only when a verified individual Bar listing URL is claimed (never invent or use portal home). Ops live curl assert remains human-gated (runbook).

## SSOT

- `SSOT.md` — static Next, Hebrew-first, force-static; verify with `pnpm build`
- Env schema: `src/env.ts`
- Person sameAs: `src/lib/seo/schema-person.ts` → `readPersonSameAsUrls` / `buildPersonSchema`
- Ops live fetch: `notes/implementations/prod-sameas-bar-assert_ops_runbook.txt` (curl C1–C10)

## Exclusive files

- `src/lib/seo/schema-person.ts`
- `src/env.ts`
- `.env.example` / `.env.development.example` (PERSON_* mirror)

## Non-goals

- No inventing Bar / Wikidata / social URLs
- No Vercel env writes from agent
- No script outside exclusive files
- No homepage org schema edits

## Work

1. Plan this file
2. `env.ts`: production gap warns for sameAs keys; document Bar-when-claimed; keep Zod optional URL|''
3. `schema-person.ts`: filter non-truthful edges (placeholders, generic Israel Bar portal); assert claimed env URLs appear in emitted sameAs; error-log failures
4. Env examples: ensure `PERSON_OFFICE_SITE_URL` listed (opt-out = empty)
5. Brief + `pnpm build` in worktree

## Verify

- `pnpm build` (worktree)
- Unit of logic: claimed Bar URL → in sameAs; generic portal / placeholder → omitted + error log
- Live C1–C10 remain ops (human); code gate does not claim live pass

## Commits (atomic)

1. add-plan-seo-prod-sameas-bar-assert-p1
2. add-env-sameas-prod-gap-warns
3. add-person-sameas-truthful-assert
4. add-brief-seo-prod-sameas-bar-assert-p1
