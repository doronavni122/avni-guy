---
name: rca-scope
description: Root-cause analysis for a stuck scope after inner iteration ceiling. Writes dense escalation file with at least 3 potential causes; confirmed causes require code proof and confidence above 0.95. Use at escalation E1 in scope-list-implementation-loop; spawn before E2–E6.
---

You perform **RCA (root cause analysis)** for one scope that failed assess after `inner_iteration > max_inner_iterations`. You do **not** stop the outer loop.

**Read first**: `.cursor/skills/scope-list-implementation-loop/SKILL.md` (Escalation ladder E1).

## Inputs

- Scope name (slug from scope list)
- `notes/implementations/scope_loop_state.json` — `last_gate`, `last_failure`, `inner_iteration`, `plan`
- Plan file: `.cursor/plans/<plan>.plan.md`
- Recent git log / diff for scope commits
- Last verify output (build/dev logs, test output)
- `task_graph.log` (recent lines relevant to the scope)

## Output file (mandatory)

Write: `notes/implementations/<scope>_escalation_<N>.txt` where N = next number (1, 2, …).

Append path to `scopes.<scope>.rca_files[]` in state file.

## File format (dense, machine-parseable)

```
scope: <name>
escalation: <N>
date: YYYY-MM-DD
failed_gate: verify_fail | review_fail | governance_fail | assess_incomplete
last_failure: <one line summary>

## symptoms
- bullet evidence from logs, gates, diffs

## potential_causes
(minimum 3 — required even when one cause seems obvious)
- id: C1 | hypothesis: <sentence> | confidence: 0.xx | status: hypothesis | evidence: <brief>
- id: C2 | hypothesis: <sentence> | confidence: 0.xx | status: hypothesis | evidence: <brief>
- id: C3 | hypothesis: <sentence> | confidence: 0.xx | status: hypothesis | evidence: <brief>
(add C4+ if useful)

## confirmed_root_causes
(only causes promoted from potential_causes when proof + confidence > 0.95)
- id: C1 | cause: <declarative sentence> | confidence: 0.96
  proof:
    - <repo-relative-path>:L<start>-L<end> — <what this code/config shows>
    - <repo-relative-path>:L<line> — <what this shows>
(omit section or leave empty if no cause meets threshold)

## wrong_assumptions
- plan or scope assumptions that were false

## fix_strategy
- concrete next plan direction (not implementation yet)

## dependency_blockers
- infrastructure | env | submodule | external_service | none

## recommended_next
- split_scope | re_plan | structure_reader | stack_up | adr_review
```

## Rules

### Potential causes (mandatory)

- List **at least 3** distinct potential causes in `potential_causes`.
- Rank by likelihood; assign each a `confidence` in `[0.0, 1.0]` while status is `hypothesis`.
- Causes must be **distinct** (different failure mechanisms), not rephrasings of the same idea.

### Confirmed root causes (proof gate)

- Promote a cause to `confirmed_root_causes` **only** when:
  1. **confidence > 0.95**, and
  2. **code/file proof** is cited — read relevant source, config, or schema files; cite `path:Lstart-Lend` (or `path:Lline`) and state what each citation proves.
- Proof must point at **repository files** (not log lines alone). Logs may support hypotheses; file citations confirm.
- If **no** cause reaches 0.95 with file proof, leave `confirmed_root_causes` empty and set `recommended_next: re_plan` with spike questions in `fix_strategy`.
- Do **not** list a cause as confirmed without having read the cited files in this run.

### Process

- Do not implement fixes in this agent — analysis only.
- Do not declare terminal BLOCKED or recommend stopping the outer loop.

## Handoff

Return to parent/orchestrator: path to escalation file + `recommended_next` value for E2–E6 routing.
