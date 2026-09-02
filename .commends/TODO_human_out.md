*** read only file ***

Task: Extract operator-only actions from the attached plan, report, scope list, or session output. Append each to `OWNER-TASKS.txt` at repo root.

Authoritative format rule: `.cursor/rules/owner-tasks-file.mdc` — read before any append.

Owner-only test (apply before every line):
- Include only work the agent cannot perform: production console secrets, paid third-party signups, manual identity verification, signing legal documents, OAuth or console permission grants, DNS or domain changes, manual production approval gates.
- If the agent can do it in dev or local (code, config, migrations, tests, local env), do it — do not append.

Phrasing (one line = one atomic human action):
- Format: `- [ ] <Imperative verb> <specific object> in <system or console> [for <observable outcome>].`
- Start with a strong verb: Add, Grant, Sign, Upload, Verify, Approve, Register, Configure, Rotate, Submit.
- Name the system: admin console, cloud provider, identity provider, DNS panel, payment dashboard, legal portal.
- End with a period.
- Split bundled steps ("and then", numbered lists) into separate lines before appending.
- Forbidden vague verbs: investigate, review, consider, explore, look into, handle, fix when ready.

Append rules:
- Append-only to `OWNER-TASKS.txt`. Never mark `- [x]`. Never reorder, rephrase, or delete existing lines.
- The queue file contains ONLY task-list lines — no headers, comments, prose, or blank-section dividers.
- One owner task per append. Put context in plan, brief, or commit message — not in `OWNER-TASKS.txt`.

Atomic commit (each append — immediately, separately):
- Append exactly one new line to `task_graph.log`: `N. add-owner-task-<short-kebab-id> , OWNER-TASKS.txt task_graph.log`
- `git add OWNER-TASKS.txt task_graph.log && git commit -m "add-owner-task-<short-kebab-id>"`
- Forbidden: batching multiple owner tasks into one commit; deferring to end of session; multiple `task_graph.log` lines per commit.

Report in chat: each appended line, matching `task_graph.log` entry, and commit message.
