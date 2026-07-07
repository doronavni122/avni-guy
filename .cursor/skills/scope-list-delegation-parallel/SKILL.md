---
name: scope-list-delegation-parallel
description: Parallel multi-agent delegation over a scope DAG — branch/worktree isolation, file claims, orchestrator merge gate. Extends scope-list-implementation-loop for independent scopes. Use when scopes have no shared-file conflict.
---

# Scope-list delegation (parallel mode)

**Extends**: `.cursor/skills/scope-list-implementation-loop/SKILL.md` (sequential = default)

**Use when**: Scope list has **independent scopes** (no `Prerequisite:` chain, disjoint file ownership). Long runs with faster throughput.

**Do not use when**: Scopes touch same files (e.g. two scopes editing the same module) — stay **sequential**.

---

## Mode selection

| Mode | Skill | When |
|------|-------|------|
| **Sequential** | `scope-list-implementation-loop` | Default; prerequisites; shared files; single agent |
| **Parallel** | This skill + sequential skill gates | DAG with parallelizable leaves; orchestrator + workers |

Set in `scope_loop_state.json`: `"mode": "parallel" | "sequential"`.

---

## Scope DAG (before run)

1. Parse scope list; build `depends_on` from `Prerequisite:` lines and known order.
2. Classify each scope:
   - **exclusive_files** — paths only this scope may edit (from plan or SSOT)
   - **shared_readonly** — e.g. `task_graph.log` (sequential append only — one writer at a time)
3. Scopes with satisfied dependencies and disjoint `exclusive_files` → **parallel batch**.

Example parallel batch:

- `auth-middleware` + `api-validation` → **sequential** (same `apps/web/lib/` module)
- `supply-chain-hardening` + `ci-verification-gate` → **parallel** (disjoint paths)

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Orchestrator** | **scope-orchestrator** agent — DAG, workers, merge, escalation, non-stop invariant |
| **Worker** | **scope-worker** agent (Task subagent) — one scope, one branch, full pipeline |

Orchestrator spawns workers; workers return `SCOPE_WORKER_RESULT` for merge gate.

---

## Isolation rules

1. **Branch per scope**: `feature/scope-<slug>` from current integration branch.
2. **File claims** in state: `"file_claims": { "apps/web/foo.ts": "auth-middleware" }` — second worker must not edit claimed paths.
3. **`task_graph.log`**: only orchestrator appends after merge (workers return commit SHAs; orchestrator merges and logs one line per merged atomic change — preserve atomic invariant).
4. **Git submodules**: never parallel commits inside submodule + workspace — submodule pin = sequential only.

Optional: Cursor **cloud subagent** per scope for VM isolation ([Cursor subagents docs](https://cursor.com/docs/subagents)).

---

## Parallel state extensions

Add to `scope_loop_state.json`:

```json
{
  "mode": "parallel",
  "integration_branch": "feature/checklist-lock",
  "parallel_batch": ["supply-chain-hardening", "ci-verification-gate"],
  "workers": {
    "supply-chain-hardening": {
      "status": "IN_PROGRESS",
      "branch": "feature/scope-supply-chain-hardening",
      "agent_id": null,
      "exclusive_files": ["renovate.json5", "package.json"]
    }
  },
  "file_claims": {},
  "merge_queue": []
}
```

---

## Orchestrator loop

```
while scopes remain not DONE:
  ready = scopes where depends_on satisfied AND not DONE AND not IN_PROGRESS
  batch = filter ready for disjoint exclusive_files (max N workers, default 3)
  for each scope in batch:
    spawn worker Task(scope, branch, exclusive_files, skill gates)
  await all workers (verify pass in worker branch)
  for each completed worker:
    run review-scope on diff vs integration_branch
    merge to integration_branch (orchestrator)
    append task_graph lines for merged commits
    mark scope [x] in scope list + owner checklist if mapped
  if worker FAIL after escalation → orchestrator runs escalation E1–E6 (same scope, same worker or replace worker)
```

**Non-stop invariant** unchanged: outer loop until all scopes DONE.

---

## Worker contract (prompt template)

Worker receives:

- Scope name + scope list section text
- Branch name + exclusive_files
- Must follow full per-scope pipeline from `scope-list-implementation-loop` SKILL
- Output: branch URL/SHA, verify log, brief path, checklist lines to tick, `NEEDS_MERGE` status

Worker must **not** edit files outside `exclusive_files` except env/config templates listed in plan.

---

## Merge gate (mandatory)

Before mark DONE:

1. `git merge` worker branch → integration branch (orchestrator)
2. **build-dev-runner** on integration branch (`pnpm build` / `pnpm dev` per project)
3. **review-scope** on combined diff
4. Resolve conflicts → assign fix to **one** scope owner only

---

## When to stay sequential

- First scope in a dependency chain
- Any scope sharing `exclusive_files` with another active scope
- Escalation_level ≥ 2 on a scope (orchestrator takes over, no parallel workers on that scope)
- Unclear file ownership → default sequential

---

## References

- Sequential SSOT: `scope-list-implementation-loop/SKILL.md`
- Agents: `scope-orchestrator`, `scope-worker`, `rca-scope`, `review-scope`
- DAG: `notes/implementations/scope_dag.example.json`
- Cursor Task subagents / cloud subagents for VM isolation
