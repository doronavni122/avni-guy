# Plan: measure-gates-g1-g4

ADR: none , cite SSOT.md

##todos
- [x] Ship dense ops runbook: G1–G4 SERP measure steps
- [x] Encode kill-switch three flat cycles + escalation path
- [x] Encode dual-property rank matrix (avniguy / guyavni / Globes / FB)
- [x] Leave all live SERP checkboxes unchecked — no fake ranks

## Goal
Close scope `measure-gates-g1-g4` (maps-005: `gate-g1..g4`, `kill-switch-three-flat-cycles`, `dual-property-rank-matrix`) as **agentic/ops-runbook** work. Operators measure live SERP on schedule; agents must **not** invent ranks or mark live boxes.

## SSOT
- `SSOT.md` §A–E (Hebrew-first static Next, verify discipline)
- Deps DONE on main: `home-h1-demote-non-entity`, `home-title-brand-portal`, `home-internal-link-weight-to-about`
- Working inventory (non-authoritative): `OWNER-REPORTS/005_serp-occupation-further-actions_2026-07-14.md` §§ gate-g1..g4, kill-switch, dual-property-rank-matrix

## Exclusive files
- `notes/implementations/measure-gates-g1-g4_ops_runbook.txt`
- this plan + `notes/implementations/019_ops_measure_gates_g1_g4_m1_brief.txt`

## Out of scope
- Source/code edits (other workers own home/about SEO)
- Live SERP claims, screenshots, or rank fill-ins without operator measurement
- AI citation loop / moonshots (downstream scopes)
- Extra high-intent URL work (unlocked only after documented G1–G2 stall)

## Verify
Ops artifact only — skip `pnpm build` / `pnpm dev`. Gate = runbook present, machine-parseable, pass/fail rules exact, live checkboxes remain `[ ]`.

## Commits (atomic)
1. add-plan-ops-measure-gates-g1-g4-m1
2. add-measure-gates-g1-g4-ops-runbook
3. brief-ops-measure-gates-g1-g4-m1
