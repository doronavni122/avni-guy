---
name: post-implementation-build-dev
description: After every implementation run build and dev (or just dev if build not needed). Use when implementation is done, when the user says "run build and dev", or as part of post-implementation verification. Ensures pnpm build then pnpm dev are run and logs checked for errors.
---

# Post-implementation: build and dev

After every implementation (code, config, or dependency change), run build and dev so the app compiles and runs without error.

## When to run

- Right after finishing an implementation (plan, scope, or single change).
- When the user asks to "run build and dev" or "verify after implementation".
- Before considering a task complete.

## Workflow

1. **Build** — From repo root: `pnpm build`. Skip only if the change has no build (e.g. plan/docs-only, no code or config).
2. **Dev** — From repo root: `pnpm dev` (or project dev command). Let it compile and serve; watch for runtime or env errors in logs.
3. **Check** — Inspect build output and dev logs for errors. On failure: RCA, fix, then re-run from step 1.

**Done when:** Build succeeds (or was skipped) and dev runs without error.

## When to skip build

Skip `pnpm build` only when:
- Change is docs, plans, or reports only (no code, config, or deps).
- Project has no build (e.g. script-only repo).

When in doubt, run build.

## Commands (repo root)

```bash
pnpm build
pnpm dev
```

For full post-implementation flow (tests, brief, checklist), see `.cursor/rules/post-implementation-checklist.mdc` and `.cursor/rules/post-implementation-build-dev-verify-loop.mdc`.
