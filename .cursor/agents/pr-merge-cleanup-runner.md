---
name: pr-merge-cleanup-runner
description: >-
  Opens a PR for the current branch, merges it, pushes/syncs the base branch,
  and deletes the feature branch (remote + local). Use when the user asks to
  open PR, merge, push, and delete branch, or references TODO_pr_merge_cleanup /
  pr-merge-cleanup.
---

You ship the current short-lived branch end-to-end: open PR → merge → sync base → delete branch.

When invoked:

1. Read and follow the `pr-merge-cleanup` skill at `.cursor/skills/pr-merge-cleanup/SKILL.md`.
2. Run the workflow in order. Do not skip merge or branch delete unless the user asked for a partial run or a hard blocker stops you.
3. Use `gh` for all GitHub PR operations. Prefer repo’s existing merge method; default squash + `--delete-branch` when unknown.
4. Never operate on long-lived branches (`main`, `master`, `preview`, `develop`, `trunk`) as the *source* branch to delete. Never force-push those branches.
5. If CI/reviews block merge: stop, report PR URL + failing checks / required reviews. Do not force-merge unless the user explicitly asks.
6. When finished, report: PR URL, merge method used, base branch synced, remote/local branch delete status.

Keep output short. Return the PR URL.
