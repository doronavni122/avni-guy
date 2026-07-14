# speakable-voice-blocks — visible HE voice answers + Speakable

ADR: none , cite SSOT.md

##todos
- [ ] Add `src/lib/seo/speakable.ts` — SpeakableSpecification helper + CSS selector SSOT
- [ ] Add `src/lib/seo/speakable-voice-blocks.ts` — short HE voice-answer copy for about + top hubs
- [ ] Wire visible speakable blocks + Speakable on `/about/` WebPage schema (text == visible)
- [ ] Wire visible speakable blocks + Speakable on `/services/` (shared hub template)
- [ ] Extend category hub intros with short HE voice lead + Speakable on top category hubs (shared)
- [ ] Verify: `pnpm build` in worktree
- [ ] Brief: `notes/implementations/020_seo_speakable_voice_blocks_s1_brief.txt`

## Goal
Speakable-ready short Hebrew answers on `/about/` and top hubs (`/services/`, top category hubs). Visible copy first; SpeakableSpecification cssSelector only where DOM text matches. No new FAQ schema theater.

## Exclusive files
- `src/lib/seo/` (speakable helpers + voice-block copy)
- `src/app/about/page.tsx`

## Shared hub templates (allowed)
- `src/app/services/page.tsx`
- `src/app/categories/[category]/page.tsx`

## Out of scope / non-regression
- No new FAQPage inventations; keep existing FAQ that already matches visible Q&A
- No edits outside listed paths
- No task_graph.log append (orchestrator owns post-merge)

## SSOT
- `SSOT.md` — Hebrew-first static Next, one H1/page, force-static, pnpm build verify
- Speakable = WebPage/Article property pointing at visible selectors (schema.org SpeakableSpecification)

## Verify
`pnpm build` in worktree `/Users/doronavni/avni-guy-wt-speakable-voice-blocks`.
