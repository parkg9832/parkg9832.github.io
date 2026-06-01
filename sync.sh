#!/usr/bin/env bash
set -euo pipefail

# Run once if needed: chmod +x sync.sh

EXPECTED_BRANCH="main"
CURRENT_BRANCH="$(git branch --show-current)"

if [ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ]; then
  echo "This repository deploys from the main branch."
  echo "Current branch: ${CURRENT_BRANCH:-unknown}"
  echo "Run: git switch main"
  exit 1
fi

MSG="$*"

if [ -z "$MSG" ]; then
  MSG="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
fi

git add -A

if git diff --cached --quiet; then
  echo "No changes to commit."
  exit 0
fi

git commit -m "$MSG"
git push origin "$EXPECTED_BRANCH"
