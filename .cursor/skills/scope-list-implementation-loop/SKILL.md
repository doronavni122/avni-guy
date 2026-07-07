---
name: scope-list-implementation-loop
description: Orchestrates long multi-agent scope-list implementation — plan, implement, verify, review, handoff per scope until ALL scopes complete. Non-stop for hours; inner iteration ceiling triggers RCA and escalation, never terminal stop. Use with TODO_scope_list_implement, TODO_infinite_no_limits_loop, or scope list files.
---

# Scope-list implementation loop

**SSOT rule**: `.cursor/rules/enforcement/scope-list-infi-implementation-loop.mdc`

**Non-negotiable**: Run for hours until **every scope** is `DONE` and scope-list `[ ]` items are `[x]`. Do **not** stop, skip scopes, or conclude because of repeated failures. Failures trigger **RCA → escalation → re-plan → continue**.

**Post-implementation**: Use `post-implementation-checklist.mdc` and `post-implementation-runner` — not a shortcut that skips verify, governance, or review gates.

**Do not use** Cursor skill `loop` (timer `/loop 5m`).

---

## When to use

- `.commends/TODO_scope_list_implement.md` or `.commends/TODO_infinite_no_limits_loop.md`
- Scope list: `notes/TODO_checklist_full_scopes_*.txt`, OWNER-REPORTS `## Scopes`
- Long autonomous run: 4–10+ hours, agent team

---

## Before the outer loop (once)

1. Read `.commends/TODO_starter.md`
2. Spawn **scope-orchestrator** for multi-scope / multi-hour runs (or follow this skill directly for single-scope)
3. Run **structure-reader** if layout may change
4. Load scope list; build `notes/implementations/scope_dag.json` from example schema + prerequisites
5. Initialize `notes/implementations/scope_loop_state.json`

---

## Two loops (critical)

| Loop | Purpose | Stops? |
|------|---------|--------|
| **Inner** | Same scope: plan → implement → gates → assess | Never terminal; max 3 **same-approach** cycles then **escalate** |
| **Outer** | All scopes until every `[ ]` is `[x]` | **Only** when all scopes `DONE` or user explicitly aborts |

**Inner iteration ceiling ≠ stop.** It triggers **escalation** (RCA + higher-level evaluation), then continues the same scope with a new plan.

---

## Per-scope pipeline (inner loop)

| Step | Action | Agent / skill |
|------|--------|---------------|
| 0 | Update state: `current_scope`, `inner_iteration` | `scope_loop_state.json` |
| 1 | **Plan** | Plan mode; `enforcement/plans-directory-and-numbering.mdc`; ADR line when applicable |
| 2 | **Implement** | Atomic commits + `task_graph.log` |
| 3 | **Verify (hard gate)** | `build-dev-runner` / `post-implementation-build-dev` |
| 4 | **Post-implementation** | `post-implementation-runner`; `post-implementation-checklist.mdc` |
| 5 | **Governance** | `governance-police` |
| 6 | **Review (hard gate)** | `review-scope` or Task `bugbot` (readonly) |
| 7 | **Handoff** | `handoff-briefer` |
| 8 | **Assess** | See below |
| 9 | Mark scope `[x]` + owner checklist when high-level goal locked | `owner-checklist-agent-edits.mdc` |

---

## Assess (step 8)

**Fully complete** → mark scope list `[x]`, set scope `DONE`, advance outer loop to next scope.

**Not fully complete**:

1. Increment `inner_iteration`.
2. If `inner_iteration <= max_inner_iterations` (default **3**) → return to **Step 1** same scope (same escalation level; refine plan).
3. If `inner_iteration > max_inner_iterations` → **do not stop**; run **Escalation ladder** below, then reset `inner_iteration` to 1 and return to Step 1.

---

## Escalation ladder (mandatory after inner ceiling)

Run in order; append findings to `notes/implementations/<scope>_escalation_<N>.txt` (dense, machine-parseable).

**E1 RCA requirements** (see `.cursor/agents/rca-scope.md`): minimum **3 potential causes**; promote to confirmed only with **repository file citations** and **confidence > 0.95**.

| Level | Action | Agent / artifact |
|-------|--------|------------------|
| **E1 — RCA** | Root cause analysis file — **≥3 potential causes**; each **confirmed** cause needs file proof + **confidence > 0.95** | Spawn **rca-scope** → `notes/implementations/<scope>_escalation_<N>.txt` |
| **E2 — Deep evaluation** | 3-pass audit on **this scope only** (alignment with ADR, rules, SSOT boundaries) | Pattern from `deep-audit-scope-loop`; or spawn `deep-audit-scope-loop` if spike file exists |
| **E3 — Higher-level re-plan** | PLAN_MODE: new plan id (`escalation_level+1`); may **split scope** into sub-scopes in scope list file; re-read product SSOT + relevant ADRs | New `.cursor/plans/NNN_*.plan.md` |
| **E4 — Structure / SSOT check** | If RCA points to wrong path or missing wiring | `structure-reader` |
| **E5 — Dependency unblock** | If external (env, services, submodule): fix and document in escalation file; **retry verify** | `build-dev-runner` / `post-implementation-build-dev`; do not skip scope |
| **E6 — Reset inner loop** | `inner_iteration = 1`, `escalation_level += 1`, scope status `ESCALATING` → `IN_PROGRESS` | state file |

Repeat inner + escalation cycles until scope is **DONE**. There is **no** terminal `BLOCKED` that ends the outer loop.

**Escalation_level ≥ 3** on same scope: additionally run Task `thermo-nuclear-code-quality-review` or full `bugbot` on scope diff; consider ADR amendment proposal if architecture assumption was wrong.

---

## scope_loop_state.json schema

```json
{
  "scope_list_file": "notes/TODO_checklist_full_scopes_YYYY-MM-DD.txt",
  "started_at": "2026-01-01T12:00:00+00:00",
  "current_scope": "auth-middleware",
  "inner_iteration": 1,
  "max_inner_iterations": 3,
  "escalation_level": 0,
  "scopes": {
    "auth-middleware": {
      "status": "IN_PROGRESS",
      "plan": "001_auth_middleware_lock_a1",
      "last_gate": "verify_fail",
      "last_failure": "pnpm build: type error in apps/web",
      "escalation_count": 0,
      "rca_files": []
    }
  }
}
```

**status**: `PENDING` | `IN_PROGRESS` | `ESCALATING` | `DONE`

Do **not** use terminal `BLOCKED` to stop the outer loop. Use `last_failure` + RCA files to track stuck points while continuing escalation.

---

## Owner checklist vs scope list

Per `owner-checklist-agent-edits.mdc`:

| File | Agent edits |
|------|-------------|
| Scope list / OWNER-REPORTS scopes | Mark `[x]` when scope DONE |
| `implementaion_progress_checklist.md` | Toggle `[x]`, same-line label, append one-line high-level item only |

When a scope completes a mapped high-level goal: mark scope list `[x]` **and** owner checklist `[x]` with optional label e.g. `(scope:auth-middleware)`.

---

## Delegation (parallel)

Default: **sequential** (this skill). For parallel multi-agent runs with disjoint file ownership, also read `scope-list-delegation-parallel` SKILL and set `"mode": "parallel"` in state file.

---

## Outer loop stop condition (only these)

1. **All scopes `DONE`** and all scope-list `[ ]` → `[x]`
2. **User explicitly aborts** the run

Forbidden stop reasons: inner iteration count, escalation count, repeated verify/review failure, "too long", "needs human" (fix env/deps yourself per rules; escalate and continue).

---

## Subagents

| Agent | When |
|-------|------|
| **scope-orchestrator** | Multi-scope / hours-long run entry; sequential or parallel |
| **rca-scope** | Escalation E1 — ≥3 potential causes; confirmed causes need file proof + confidence > 0.95 |
| **scope-worker** | Parallel mode — one scope per worker branch |
| `structure-reader` | Loop start; escalation E4 |
| `build-dev-runner` | Step 3 verify |
| `post-implementation-runner` | Step 4 |
| `governance-police` | Step 5 |
| `review-scope` | Step 6 |
| `handoff-briefer` | Step 7 |
| `deep-audit-scope-loop` | Escalation E2 |
| `adr-specialist` | Escalation_level ≥ 3 + architecture wrong |

---

## References

- `.cursor/rules/enforcement/scope-list-infi-implementation-loop.mdc`
- `notes/implementations/scope_loop_state.example.json`
- `.cursor/skills/scope-list-delegation-parallel/SKILL.md`
- `notes/implementations/scope_dag.example.json`
- `.cursor/agents/scope-orchestrator.md`
- `.cursor/agents/scope-worker.md`
- `.cursor/agents/rca-scope.md`
