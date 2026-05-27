#!/usr/bin/env bash
set -e

# Run once if needed: chmod +x sync.sh

MSG="$*"

if [ -z "$MSG" ]; then
  MSG="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
fi

git add .
git commit -m "$MSG"
git push
