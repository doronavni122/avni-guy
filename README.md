# Agentic workspace template

Stack-agnostic Cursor boilerplate: rules, agents, skills, `.commends` workflows, atomic `task_graph.log`, ADR scaffold, and optional-doc stubs.

## New repo (GitHub UI)

1. Click **Use this template** → create your repository.
2. Clone locally and edit `workspace.config.json` (app root, URLs, doc filenames).
3. Replace stub SSOT files listed in `WORKSPACE-OPTIONAL-DOCS.md`.

## Existing project (one command)

```bash
gh repo clone doronavni122/agentic-workspace-template /tmp/agentic-workspace-template && rsync -a /tmp/agentic-workspace-template/ /path/to/your-project/ --exclude .git && rm -rf /tmp/agentic-workspace-template
```

Or with the bootstrap CLI (from any machine with Node 20+):

```bash
node /path/to/string11-onramp/packages/agentic-workspace-bootstrap/bin/agentic-workspace.mjs install-github --target /path/to/your-project --force
```

Default template: `doronavni122/agentic-workspace-template` (override with `--slug owner/repo`).

## After install

1. Read `WORKSPACE-OPTIONAL-DOCS.md` — which files are stubs vs authoritative.
2. Customize `workspace.config.json`.
3. Fill `SETUP-INSTRUCTIONS.md`, product SSOT, and journey docs when ready.
4. Optional: `pnpm` / npm script — add root scripts from your monorepo as needed.

## Publish updates (maintainers)

From `string11-onramp`:

```bash
pnpm agentic-workspace:export-template
cd packages/agentic-workspace-bootstrap/dist/github-template
git init && git add -A && git commit -m "sync template"
git remote add origin git@github.com:doronavni122/agentic-workspace-template.git
git push -u origin main --force
```

Then ensure **Template repository** is enabled in GitHub repo settings.
