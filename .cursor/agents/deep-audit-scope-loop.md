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
- For each scope listed under `## Scopes` in the same file:
  - **Plan**: Enter plan mode; produce full plan (create/update plan in `.cursor/plans/` per plans-directory-and-numbering and plans-adr-link).
  - **Implement**: Implement fully for that scope.
  - **Post-implementation checklist**: Run the project checklist (e.g. post-implementation-checklist rule); complete every item for this scope.
  - **Assess**: Confirm scope done.
  - **Mark in file**: In the same spike audit file, mark the scope as done (e.g. `- [x] <scope_name>` or a "Done" subsection). Do not leave a scope half-done; repeat until all scopes are complete and checklist items done.

**5. Invariants**
- Single file for entire process: spike + audit + scope list + done markers all in `OWNER-REPORTS/<plan_base>_spike_audit.md`.
- Plans created during scope loop live in `.cursor/plans/` only.
- Do not create extra docs; keep report dense and machine-parseable (plans-reports-agentic-only).
