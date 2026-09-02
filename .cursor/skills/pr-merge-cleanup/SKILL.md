---
name: pr-merge-cleanup
description: >-
  Opens a PR for the current branch, merges it, pushes, and deletes the
  feature branch (remote then local). Use when the user asks to open PR,
  merge, push, and delete branch, or references TODO_pr_merge_cleanup /
  pr-merge-cleanup-runner.
disable-model-invocation: true
---

# PR merge cleanup

When the user triggers this workflow: **open PR → merge → push → delete branch**.

## Preconditions

- Working tree clean enough to ship (commit or stash unrelated work first; do not mix unrelated files into the PR).
- Current branch is a short-lived branch (`feature/`, `bugfix/`, `hotfix/`, `release/`, or equivalent). Never run against long-lived defaults (`main`, `master`, `preview`, `develop`, `trunk`).
- `gh` authenticated and remote is GitHub.

## Workflow (do in order)

1. **Context**
   ```bash
   git status
   git branch --show-current
   git rev-parse --abbrev-ref @{upstream} 2>/dev/null || true
   git log --oneline -10
   ```
   Detect base branch: prefer the branch the PR will target (usually `main` or `master`; if repo uses `preview` as integration default, use that only when the user or existing PR says so).

2. **Push branch** (if not already on remote)
   ```bash
   git push -u origin HEAD
   ```

3. **Open or reuse PR**
   - If a PR already exists for this branch: use it (`gh pr view --json url,number,state,baseRefName`).
   - Else create:
   ```bash
   gh pr create --title "<concise title>" --body "$(cat <<'EOF'
   ## Summary
   - <1-3 bullets of what changed and why>

   ## Test plan
   - [ ] <how to verify>
   EOF
   )"
   ```
   Title format when project uses it: `[type] short description` (e.g. `[fix] …`, `[feat] …`).

4. **Merge**
   - Prefer squash or merge method the repo already uses (`gh pr view --json mergeStateStatus,mergeable` then `gh api repos/{owner}/{repo}` / repo settings if unclear).
   - Default when unknown: `gh pr merge --squash --delete-branch` (remote branch delete via gh).
   - If merge is blocked (reviews, CI): report the blocker URL/checks; do **not** force-merge or skip required checks unless the user explicitly asks.

5. **Push / sync local after merge**
   ```bash
   git fetch origin
   git checkout <base>
   git pull --ff-only origin <base>
   ```

6. **Delete branch**
   - Remote: already deleted if `--delete-branch` was used; else `git push origin --delete <branch>`.
   - Local: `git branch -d <branch>` (use `-D` only if already merged on remote and `-d` refuses).
   - Never delete `main` / `master` / `preview` / `develop` / `trunk`.

## Done when

- PR URL reported (created or existing).
- PR merged (or clear blocker reported).
- Local on base branch, up to date.
- Feature branch removed remotely and locally.

## Guardrails

- No `git push --force` to default/long-lived branches.
- No `--no-verify` unless the user explicitly requests it.
- Do not amend commits you did not create in this session.
- Do not change git config.
- If the user only asked for part of the flow (e.g. open PR only), stop after that step.
