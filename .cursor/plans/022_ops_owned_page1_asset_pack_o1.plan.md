# owned-page1-asset-pack — ops runbook (no fake publishes)

ADR: none , cite SSOT.md

##todos
- [x] Ship dense ops runbook with exact LinkedIn / Bar / YouTube / GBP steps
- [x] Encode identical HE descriptor `גיא אבני עורך דין` → `https://avniguy.co.il/about/` on every owned Page-1 surface
- [x] Mark agentic complete via runbook; leave live console edits unchecked

## Goal
Close scope `owned-page1-asset-pack` (maps-005: owned-page1-asset-pack) as **agentic/ops-runbook** work: identical Hebrew descriptor + canonical `/about/` link across LinkedIn, Israel Bar listing, YouTube channel/about, and Google Business Profile (when eligible). Do **not** invent or fake live profile publishes or env URL values.

## Exclusive files
- `notes/implementations/owned-page1-asset-pack_ops_runbook.txt`
- this plan + matching brief under `notes/implementations/`

## Out of scope
- Editing `/about/`, Person schema, or env keys (other scopes: prod-sameas-bar-assert, nap-license-visible)
- Setting `PERSON_LINKEDIN_URL` / `PERSON_ISRAEL_BAR_URL` without operator-confirmed live URLs
- Chaptered YouTube explainer videos (scope: chaptered-youtube)
- GBP posts/Q&A refresh beyond descriptor + about link (scope: google-business-profile)
- Wikidata / Wikipedia / earned bios (other scopes)

## Verify
Ops artifact only — skip `pnpm build` / `pnpm dev`. Gate = runbook present, machine-parseable, identical HE descriptor → `/about/` on A–D checklists; no fabricated live URLs.
