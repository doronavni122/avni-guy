---
name: deep-audit-scope-loop
description: After a spike report exists, runs 3 iterations of deep audit in the same OWNER-REPORTS spike audit file; if issues need resolution, writes scope list in that file, runs scope-list-completion loop, and marks scopes done in the same file. Use when spike-report-post-plan has finished or when given path to OWNER-REPORTS/*_spike_audit.md.
---

You run the deep-audit and scope-loop workflow. When invoked (with the spike audit file path, or right after spike-report-post-plan):

**1. Locate the spike audit file**
- Use the path provided (e.g. `OWNER-REPORTS/<plan_base>_spike_audit.md`) or the most recent `*_spike_audit.md` in `OWNER-REPORTS/`. Read the full file; all work appends to this same file.

**2. Three iterations of deep audit (append to same file)**
- **Iteration 1**: Audit the codebase and behavior based on the spike content. Check alignment with .cursor/rules (enforcement-meta, META-RULES), ADRs, and the implemented plan. Append findings under `## Audit` (e.g. `### Audit iteration 1`). Dense, machine-parseable; list concrete issues (missing validation, rule violations, gaps).
- **Iteration 2**: Deeper audit pass using iteration 1 findings: trace each issue to code/config, check boundaries and ownership. Append under `### Audit iteration 2`.
- **Iteration 3**: Final pass: security, error handling, consistency, anything that must be resolved or implemented. Append under `### Audit iteration 3`.

**3. Scope list from audit**
- If any audit finding requires resolution (implement, align, fix, refactor, or otherwise handle), treat those as scopes. Add or update the `## Scopes` section in the **same** spike audit file with a list of scope names (one per line or bullet). Use clear, actionable names (e.g. `add-api-input-validation`, `align-env-with-ssot`). If the work is large, split into several scopes. If no issues need handling, write `## Scopes` with "None" and stop.

**4. Run scope-list-completion loop**
- Follow `.cursor/skills/scope-list-implementation-loop/SKILL.md` end-to-end. On repeated scope failure use **escalation** (RCA, deep eval, re-plan) — do **not** stop outer loop or skip scope.
- For each scope listed under `## Scopes` in the same file: run the full per-scope pipeline from the skill.
- Mark `- [x]` on each scope in the spike audit `## Scopes` section when DONE (not owner checklist).
- Do not leave a scope half-done; use escalation ladder until scope DONE or user aborts (no terminal BLOCKED).

**5. Invariants**
- Single file for entire process: spike + audit + scope list + done markers all in `OWNER-REPORTS/<plan_base>_spike_audit.md`.
- Plans created during scope loop live in `.cursor/plans/` only.
- Do not create extra docs; keep report dense and machine-parseable (plans-reports-agentic-only).
