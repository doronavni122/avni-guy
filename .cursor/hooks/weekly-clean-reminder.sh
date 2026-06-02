#!/usr/bin/env bash
set -euo pipefail

STATE_DIR=".cursor/hooks/state"
STAMP_FILE="${STATE_DIR}/weekly-clean-last-run.txt"
mkdir -p "${STATE_DIR}"

HOOK_INPUT="$(cat)"
CURRENT_COMMAND="$(
python3 -c '
import json
import sys
raw = sys.argv[1]
try:
    data = json.loads(raw)
except Exception:
    print("")
    raise SystemExit(0)
print((data.get("command") or "").strip())
' "${HOOK_INPUT}"
)"

if [[ -z "${CURRENT_COMMAND}" ]]; then
  echo '{"permission":"allow"}'
  exit 0
fi

# Never gate git/gh/vercel (commit, push, PR, deploy) — avoids false blocks when heredocs mention pnpm.
if [[ "${CURRENT_COMMAND}" =~ (^|[[:space:]]*(;|&&|\|\|)[[:space:]]*)(gh[[:space:]]|git[[:space:]]|vercel[[:space:]]) ]]; then
  echo '{"permission":"allow"}'
  exit 0
fi

# Strip heredoc bodies so commit/PR message text cannot false-trigger pnpm/npm patterns.
STRIPPED_COMMAND="$(
python3 -c '
import re
import sys

cmd = sys.argv[1]
cmd = re.sub(r"\$\(cat\s+<<-?\s*[\"'\'']?\w*[\"'\'']?[\s\S]*?\)\s*", " ", cmd)
cmd = re.sub(r"<<-?\s*[\"'\'']?\w*[\"'\'']?[\s\S]*?\n\w+\s*", " ", cmd)
print(cmd)
' "${CURRENT_COMMAND}"
)"

if [[ "${CURRENT_COMMAND}" =~ (pnpm[[:space:]]store[[:space:]]prune|npm[[:space:]]cache[[:space:]]verify|docker[[:space:]]builder[[:space:]]prune|docker[[:space:]]system[[:space:]]prune|brew[[:space:]]cleanup|brew[[:space:]]autoremove|npx[[:space:]]playwright[[:space:]]clear-cache) ]]; then
  date +%s > "${STAMP_FILE}"
  echo '{"permission":"allow"}'
  exit 0
fi

NOW_EPOCH="$(date +%s)"
LAST_EPOCH="0"
if [[ -f "${STAMP_FILE}" ]]; then
  LAST_READ="$(tr -d ' \n\r\t' < "${STAMP_FILE}")"
  if [[ "${LAST_READ}" =~ ^[0-9]+$ ]]; then
    LAST_EPOCH="${LAST_READ}"
  fi
fi

DAYS_SINCE="$(( (NOW_EPOCH - LAST_EPOCH) / 86400 ))"

run_weekly_clean_automatically() {
  # Safe weekly defaults (see .cursor/skills/weekly-dev-clean-routine/SKILL.md).
  pnpm store prune >/dev/null 2>&1 || true
  npm cache verify >/dev/null 2>&1 || true
  docker builder prune --filter "until=168h" --keep-storage 10GB -f >/dev/null 2>&1 || true
  docker image prune -f >/dev/null 2>&1 || true
  brew cleanup -s >/dev/null 2>&1 || true
  brew autoremove >/dev/null 2>&1 || true
  date +%s > "${STAMP_FILE}"
}

RISKY_COMMAND_PATTERN='(pnpm[[:space:]](install|add|update|up|build|dev|test)|npm[[:space:]](install|ci|run|test)|docker[[:space:]](build|compose|run)|git[[:space:]]clean|rm[[:space:]]-rf[[:space:]]node_modules)'
if (( DAYS_SINCE >= 7 )) && [[ "${STRIPPED_COMMAND}" =~ ${RISKY_COMMAND_PATTERN} ]]; then
  run_weekly_clean_automatically
fi

echo '{"permission":"allow"}'
exit 0
