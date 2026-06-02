#!/usr/bin/env bash
# Wait for the Docker engine to accept commands (docker info). On macOS, launch Docker Desktop once if the daemon is down.
# Skips in CI or when SKIP_DOCKER_ENSURE=1.
set -euo pipefail

log() {
  echo "[ensure-docker-daemon] $*"
}

if [[ "${CI:-}" == "true" ]]; then
  log "skip: CI=true"
  exit 0
fi

if [[ "${SKIP_DOCKER_ENSURE:-}" == "1" ]]; then
  log "skip: SKIP_DOCKER_ENSURE=1"
  exit 0
fi

if ! command -v docker >/dev/null 2>&1; then
  log "error: docker CLI not in PATH; install Docker Desktop / Engine or set SKIP_DOCKER_ENSURE=1" >&2
  exit 1
fi

MAX_SEC="${DOCKER_READY_TIMEOUT_SEC:-180}"
INTERVAL="${DOCKER_READY_POLL_SEC:-2}"
elapsed=0
launched_desktop=0

launch_docker_desktop_macos() {
  if [[ "$(uname -s)" != "Darwin" ]]; then
    return 1
  fi
  if [[ ! -d "/Applications/Docker.app" ]]; then
    return 1
  fi
  if [[ "$launched_desktop" -eq 1 ]]; then
    return 0
  fi
  log "launching Docker Desktop (macOS)"
  open -a Docker || true
  launched_desktop=1
  return 0
}

if docker info >/dev/null 2>&1; then
  log "docker daemon already reachable"
  exit 0
fi

launch_docker_desktop_macos || log "hint: start Docker Engine manually on this OS if docker info keeps failing"

while (( elapsed < MAX_SEC )); do
  if docker info >/dev/null 2>&1; then
    log "docker daemon ready after ${elapsed}s"
    exit 0
  fi
  if (( elapsed == 0 )) || (( elapsed % 20 == 0 && elapsed > 0 )); then
    launch_docker_desktop_macos || true
  fi
  sleep "$INTERVAL"
  elapsed=$((elapsed + INTERVAL))
done

log "error: docker daemon not ready after ${MAX_SEC}s (is Docker running?)" >&2
exit 1
