#!/bin/bash
set -euo pipefail

# Only needed in Claude Code on the web, where containers start fresh.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Idempotent: reuses node_modules from the container cache when present.
npm install --no-audit --no-fund
