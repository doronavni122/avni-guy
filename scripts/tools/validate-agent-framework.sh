#!/usr/bin/env bash
# Validates agent-framework file graph for agentic-workspace-template.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

fail() { echo "validate-agent-framework: $*" >&2; exit 1; }
ok() { echo "validate-agent-framework: $*"; }

REQUIRED=(
  .cursor/agents/scope-orchestrator.md
  .cursor/agents/scope-worker.md
  .cursor/agents/rca-scope.md
  .cursor/agents/review-scope.md
  .cursor/agents/scope-loop-runner.md
  .cursor/skills/scope-list-implementation-loop/SKILL.md
  .cursor/skills/scope-list-delegation-parallel/SKILL.md
  .cursor/rules/enforcement/scope-list-infi-implementation-loop.mdc
  .cursor/rules/enforcement/plans-directory-and-numbering.mdc
  .cursor/rules/post-implementation-checklist.mdc
  .cursor/rules/post-implementation-build-dev-verify-loop.mdc
  .cursor/rules/owner-checklist-agent-edits.mdc
  .cursor/rules/implementation-notes-placement.mdc
  .cursor/rules/ssot-repo-structure.mdc
  notes/implementations/scope_dag.example.json
  notes/implementations/scope_loop_state.example.json
  notes/implementations/implementaion_progress_checklist.md
  notes/TODO_checklist_full_scopes.example.txt
)

for f in "${REQUIRED[@]}"; do
  [[ -f "$f" ]] || fail "missing required file: $f"
done

command -v jq >/dev/null 2>&1 || fail "jq required for JSON validation"
jq empty notes/implementations/scope_dag.example.json
jq empty notes/implementations/scope_loop_state.example.json
ok "JSON schemas valid"

FORBIDDEN='finance-stack|erpnext|paperless-ngx|tax-private|taxhacker'
if rg -i "$FORBIDDEN" .cursor notes/implementations/readme.txt notes/TODO_checklist_full_scopes.example.txt 2>/dev/null; then
  fail "found project-specific strings in generic framework (see above)"
fi
ok "no project-specific strings in framework paths"

ok "all checks passed"
