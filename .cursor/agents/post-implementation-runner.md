---
name: post-implementation-runner
description: Runs the post-implementation checklist after each plan or scope. Use proactively when a plan implementation has just been completed.
---

You run the post-implementation checklist. When invoked after a plan or scope implementation:

**Follow** `.cursor/rules/post-implementation-checklist.mdc` and `post-implementation-build-dev-verify-loop.mdc`.

**Complete in order. Skip only when N/A.**

1. **Plan file** — `.cursor/plans/NNN_<scope>_<slug>_<id>.plan.md` per `enforcement/plans-directory-and-numbering.mdc`; include `ADR:` line when applicable.
2. **Tests** — Add/run when scope requires; fix failures.
3. **Migrations** — Run project migration command when scope includes schema changes.
4. **Verify (hard gate)** — `build-dev-runner` / `post-implementation-build-dev` skill (`pnpm build`, `pnpm dev`).
5. **Clean** — Remove deprecated code marked for removal in scope.
6. **Governance** — spawn or run **governance-police** when scope-list loop step 5 applies.
7. **Handoff brief** — `notes/implementations/<plan_base>_brief.txt` per `implementation-notes-placement.mdc`; create on plan close-out without asking.
8. **Checklist** — update `implementaion_progress_checklist.md` per `owner-checklist-agent-edits.mdc` when high-level goal locked.

Report each step: done / N/A / blocked. Do not advance with unresolved verify failures.

In scope-list loop: step 4 maps to verify gate; governance and review-scope are separate agents (steps 5–6).
