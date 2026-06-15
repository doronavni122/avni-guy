#!/usr/bin/env bash
# Install content-seo-kit into a project
set -euo pipefail

KIT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT="${1:-}"
PROFILE="${2:-default}"
APPROVE=""
KIT_REMOTE="${CONTENT_KIT_REPO:-https://github.com/doronavni122/content-seo-kit.git}"

for arg in "$@"; do
  if [[ "$arg" == "--approve" ]]; then APPROVE="--approve"; fi
done

if [[ -z "$PROJECT" ]] || [[ "$PROJECT" == "--approve" ]]; then
  echo "Usage: ./scripts/install.sh <project-path> [profile] [--approve]"
  echo "Profiles: default | next-guide | astro-blog | wordpress | static-docs | research-only"
  echo "Env: CONTENT_KIT_REPO, USE_LOCAL_KIT=1 (dev: copy from this repo)"
  exit 1
fi

if [[ "$PROFILE" == "--approve" ]]; then PROFILE="default"; fi

mkdir -p "$PROJECT/.content-kit"
VENDOR="$PROJECT/.content-kit/vendor"

if [[ "${USE_LOCAL_KIT:-}" == "1" ]]; then
  mkdir -p "$VENDOR"
  rsync -a --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    "$KIT_ROOT/" "$VENDOR/"
  echo "Installed vendor from local kit: $KIT_ROOT"
elif [[ -d "$VENDOR/.git" ]]; then
  git -C "$VENDOR" fetch origin
  git -C "$VENDOR" checkout main 2>/dev/null || git -C "$VENDOR" checkout master
  git -C "$VENDOR" pull --ff-only
  echo "Updated vendor git clone."
else
  rm -rf "$VENDOR"
  git clone "$KIT_REMOTE" "$VENDOR"
  echo "Cloned kit to $VENDOR"
fi

export CONTENT_KIT_PATH="$VENDOR"
CMD=(node "$VENDOR/scripts/project-sync.mjs" init --project "$(cd "$PROJECT" && pwd)" --profile "$PROFILE" --kit-path "$VENDOR")
if [[ -n "$APPROVE" ]]; then
  CMD+=(--approve)
else
  echo "Dry-run init. Append --approve to apply."
fi
"${CMD[@]}"
