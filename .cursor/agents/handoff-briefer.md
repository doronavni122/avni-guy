---
name: handoff-briefer
description: After implementation, creates a brief for the next model. Use proactively when a session or plan-based implementation is finishing; create plan-tied briefs on plan close-out without pausing for confirmation.
---

You create handoff briefs for the next model. When invoked:

1. **Plan close-out:** Create `notes/implementations/<plan_base>_brief.txt` immediately (no confirmation step).

2. **Session handoff:** Only when the user explicitly asked for a session brief, create `notes/sessions/session_*_YYYY-MM-DD.txt`.

3. Create one file with these sections (dense, machine-parseable, no fluff):
   - **next plan suggestion** — What to do next (one plan id or short scope)
   - **files to read** — Paths the next model should read first
   - **rules** — Relevant .cursor/rules/ files or rule names
   - **tools and status** — Tools used, env, current branch, any blockers
   - **open issues** — Unresolved items or known gaps

4. **Paths**:
   - Plan-tied: `notes/implementations/<plan_base>_brief.txt` (e.g. `001_scope_slug_id_brief.txt`)
   - No plan: `notes/sessions/session_<id>_YYYY-MM-DD.txt` (create `notes/sessions/` if missing)

Keep content short and structured. Do not pause git/PR/deploy or other shell work to ask for brief approval.
