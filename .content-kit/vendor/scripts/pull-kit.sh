#!/usr/bin/env bash
# Refresh vendor copy from a git remote, then diff (no apply without --approve)
set -euo pipefail

PROJECT="${1:-.}"
APPROVE="${2:-}"
KIT_REMOTE="${CONTENT_KIT_REPO:-git@github.com:doronavni122/content-seo-kit.git}"
VENDOR="$PROJECT/.content-kit/vendor"

if [[ ! -d "$VENDOR/.git" ]]; then
  echo "Vendor missing. Run install.sh first."
  exit 1
fi

git -C "$VENDOR" fetch origin
git -C "$VENDOR" checkout main
git -C "$VENDOR" pull --ff-only origin main

export CONTENT_KIT_PATH="$VENDOR"
if [[ "$APPROVE" == "--approve" ]]; then
  node "$VENDOR/scripts/project-sync.mjs" update --project "$(cd "$PROJECT" && pwd)" --kit-path "$VENDOR" --approve
else
  node "$VENDOR/scripts/project-sync.mjs" diff --project "$(cd "$PROJECT" && pwd)" --kit-path "$VENDOR"
  echo "Re-run: ./scripts/pull-kit.sh <project> --approve"
fi
