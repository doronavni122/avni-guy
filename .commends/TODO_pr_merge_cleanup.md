**read only file***

Do the next steps one by one:
- [] open PR for the current short-lived branch (create if missing; reuse if exists).
- [] merge the PR (use repo default merge method; prefer squash when unknown).
- [] push / sync local to the base branch after merge.
- [] delete the remote and local feature branch (never delete main/master/preview/develop/trunk).

Use the pr-merge-cleanup skill and/or pr-merge-cleanup-runner subagent.

