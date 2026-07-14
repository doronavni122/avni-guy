# fan-out-h2-maps-on-hubs — AI Mode fan-out H2 clusters on existing hubs

ADR: none , cite SSOT.md

##todos
- [ ] Add `src/lib/seo/fan-out-h2-maps.ts` — HE fan-out sub-ask maps for about, services, top guides
- [ ] Wire fan-out H2 clusters on `/about/` (preserve speakable + stable section ids)
- [ ] Wire fan-out H2 clusters on `/services/` (preserve speakable)
- [ ] Top-guide fan-out H2s live on hubs with links to existing blog URLs only (zero new routes)
- [ ] Mark scope `[x]` in `notes/TODO_checklist_full_scopes_2026-07-14.txt`
- [ ] Verify: `pnpm build` (+ `pnpm dev` smoke) in worktree
- [ ] Brief: `notes/implementations/023_seo_fan_out_h2_maps_f1_brief.txt`

## Goal
Add AI Mode-style fan-out H2 clusters (question-form Hebrew sub-asks + short visible answers) on existing hubs `/about/` and `/services/`. Top-guide fan-outs are answered on those hubs with links to existing pillar/guide URLs. Zero new thin fan-out URLs.

## Exclusive files
- `src/app/about/page.tsx`
- `src/app/services/`

## Shared (allowed)
- `src/lib/seo/fan-out-h2-maps.ts`
- `.cursor/plans/023_seo_fan_out_h2_maps_f1.plan.md`
- `notes/TODO_checklist_full_scopes_2026-07-14.txt` (scope checkbox only)
- `notes/implementations/023_seo_fan_out_h2_maps_f1_brief.txt`

## Shared verify-unblock (pre-existing main typebreak; not fan-out feature)
- `src/lib/seo/practice-bridge-pages.ts` — `keyword: SiteKeyword` + assert helper
- `src/app/contracts-lawyer-guy-avni/page.tsx` — narrow `def` after throw
- `src/app/nedlan-lawyer-guy-avni/page.tsx` — narrow `def` after throw
- `src/app/media/page.tsx` — use existing SiteKeyword (or add batch keyword)
- `src/lib/seo/site-keywords-batch.ts` — only if media/bridge keywords missing

## Out of scope / non-regression
- No new App Router pages or thin landing URLs
- Do not remove or break Speakable blocks / `SPEAKABLE_VOICE_CLASS` on about or services
- No FAQPage schema inventation for fan-out clusters (visible H2/answer only)
- No `task_graph.log` append (orchestrator owns post-merge)
- Never checkout feature branch in primary worktree

## SSOT
- `SSOT.md` / `AGENTS.md` — Hebrew-first static Next, one H1/page, H2/H3 body hierarchy, force-static
- Pattern reference: `/sheelot/` H2=question units; hubs keep entity/services role

## Verify
`pnpm build` then `pnpm dev` in `/Users/doronavni/avni-guy-wt-fanout`. Confirm `/about/` and `/services/` still expose speakable sections.
