# earned-offsite-bios-network — ops runbook (no fake publishes)

ADR: none , cite SSOT.md

##todos
- [x] Ship dense ops runbook with exact steps for earned bios + co-occurrence + civic NAP
- [x] Encode HE descriptor → `/about/` + NAP field contract from first-party site
- [x] Mark agentic complete via runbook; leave live offsite publishes unchecked

## Goal
Close maps-005 items `earned-bio-placements`, `positive-co-occurrence-network`, `civic-directory-nap` as **agentic/ops-runbook** work. Do **not** invent or fake live offsite directory/bio publishes.

## Exclusive files
- `notes/implementations/earned-offsite-bios-network_ops_runbook.txt`
- this plan + matching brief under `notes/implementations/`

## Out of scope
- Editing `/about/` or Person schema (other scopes / nap-license-visible)
- Live claims, submissions, or scraped “already published” URLs without operator proof
- Wikipedia / Wikidata / GBP (other scopes)

## Verify
Ops artifact only — skip `pnpm build` / `pnpm dev`. Gate = runbook present, machine-parseable, descriptors + NAP contract exact.
