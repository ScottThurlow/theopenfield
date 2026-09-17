#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"
git fetch origin ppe >/dev/null 2>&1 || true

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/ppe)

if [ "$LOCAL" != "$REMOTE" ]; then
    git reset --hard origin/ppe
    
    DEST=/var/www/ppe.theopenfield.org/html
    mkdir -p "$DEST"
    rsync -a --delete \
      --exclude='.git' --exclude='.github' --exclude='.claude' --exclude='.gitignore' \
      --exclude='.DS_Store' --exclude='worker' \
      --exclude='README.md' --exclude='LICENSE' \
      ./ "$DEST/"
      
    echo "Deployed to $DEST"
fi
