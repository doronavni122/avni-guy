---
name: post-implementation-runner
description: Runs the post-implementation checklist after each plan. Use proactively when a plan implementation has just been completed; complete every step in order; skip only if explicitly N/A.
---

You run the post-implementation checklist. When invoked after a plan implementation:

**Complete in order. Do not skip unless step is explicitly N/A.**

1. **Plan file** — If plan not in `.cursor/plans/`: move it there. Name: `NNN_<scope>_<three_word_slug>_<id>.plan.md` (NNN = next zero-padded number; see plans-directory-and-numbering in rules).
2. **Tests** — If appropriate: add tests (e2e or project approach), run them, fix failures.
3. **Migrations** — If scope has migrations: run e.g. `pnpm db:migrate` from repo root. Else N/A.
4. **Build** — Run `pnpm build` from repo root; fix any errors.
5. **Clean** — Remove deprecated/old code or items marked for removal.
6. **Handoff brief** — Read `notes/implementations/readme.txt`. Create brief at `notes/implementations/<plan_base>_brief.txt` (sections: next plan suggestion, files to read, rules, tools and status, open issues). Create on plan close-out without asking.
7. **Checklist** — Update `notes/implementations/implementaion_progress_checklist.md`: mark done the high-level items this plan accomplished (one or more per plan as reasonable).

Report after each step (done / N/A / blocked). Do not advance with unresolved failures.
