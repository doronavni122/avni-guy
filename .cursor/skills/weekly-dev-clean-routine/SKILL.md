---
name: weekly-dev-clean-routine
description: Maintains local developer environments with a practical and safe weekly cleanup routine for caches, package stores, and container artifacts. Runs automatically via beforeShellExecution hook when overdue (never asks for approval); also use when the user asks for local dev cleanup, cache reduction, or disk hygiene on macOS.
---

# Weekly Dev Clean Routine

## Quick workflow

Run this sequence in order:

1. Measure usage first.
2. Prune shared package stores.
3. Verify npm cache (do not aggressively wipe).
4. Prune Docker build cache with retention.
5. Clean Homebrew caches.
6. Optionally do deeper monthly cleanup.

## Weekly commands (safe defaults)

```bash
df -h
du -sh ~/.pnpm-store ~/.npm ~/.cache/ms-playwright 2>/dev/null
docker system df -v
pnpm store prune
npm cache verify
docker builder prune --filter "until=168h" --keep-storage 10GB -f
docker image prune -f
brew cleanup -s
brew autoremove
```

## Monthly commands (deeper cleanup)

Use only when needed and after confirming impact:

```bash
docker system prune -a -f
```

If Xcode is in use:

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

## Guardrails

- Prefer prune over full deletion.
- Do not run `npm cache clean --force` unless there is corruption/integrity failure.
- Do not use `docker system prune --volumes` unless data loss is acceptable.
- Do not mass-delete `node_modules`; remove only for broken repos.
