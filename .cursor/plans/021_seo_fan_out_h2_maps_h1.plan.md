# fan-out-h2-maps-on-hubs — H2 clusters on existing hubs

ADR: none , cite SSOT.md

##todos
- [x] Map AI Mode fan-out sub-asks for `/about/` → retitle/add H2 clusters on existing sections
- [x] Map AI Mode fan-out sub-asks for `/services/` → retitle/add H2 clusters + journey H2
- [x] Keep answers on hub pages only — zero new thin fan-out URLs
- [x] Verify: `pnpm build` in worktree; no new `src/app/*` routes for fan-out

## Goal
Answer likely AI Mode fan-out sub-asks as H2 clusters on `/about/` and `/services/` hubs. Strengthen query-bearing H2s; do not mint thin URL satellites.

## Exclusive files
- `src/app/about/page.tsx`
- `src/app/services/`

## Out of scope
- New routes under `src/app/` for each sub-ask
- Top guides MDX rewrites (deferred)
- Globes / commodity pages

## Fan-out map (hub-only)
### `/about/`
- מי זה גיא אבני עורך דין? → `#entity`
- באילו תחומים גיא אבני מלווה? → `#practice`
- למי מתאים הליווי של גיא אבני? → `#audience`
- איך עובדים עם גיא אבני עורך דין? → `#workflow`
- מה הערכים ודרך העבודה אצל גיא אבני? → `#principles`

### `/services/`
- מה מציע משרד גיא אבני? → services grid
- באילו תחומי ליווי המשרד עובד? → practice list
- איך נראה מסלול הליווי? → new journey H2 on same page
- שאלות על השירותים → existing FAQ section

## Non-regression
- Zero new thin URLs
- Existing about fragment ids stay stable
- No outcome-claim copy

## Verify
`pnpm build` in worktree `/Users/doronavni/avni-guy-wt-speakable-fanout`
