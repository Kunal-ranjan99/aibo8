#!/usr/bin/env bash
set -euo pipefail

echo "====================================================="
echo "  Aibo8 LMS — Fast Zero-Build EC2 Update"
echo "====================================================="

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

OLD_LOCK_HASH="$(sha256sum package-lock.json 2>/dev/null | awk '{print $1}' || echo 'none')"

echo "[1/5] Pulling latest prebuilt code from GitHub..."
git fetch origin main
git reset --hard origin/main
# Remove stale untracked .next artifacts (keeps .env and public/uploads untouched)
git clean -fd .next
chmod +x deploy/*.sh
echo "Now at commit: $(git log -1 --oneline)"

NEW_LOCK_HASH="$(sha256sum package-lock.json 2>/dev/null | awk '{print $1}' || echo 'none')"

echo "[2/5] Stopping PM2 app cleanly before swapping runtime..."
pm2 stop aibo8-lms 2>/dev/null || true

echo "[3/5] Syncing dependencies & Prisma schema..."
if [ ! -d node_modules ] || [ "$OLD_LOCK_HASH" != "$NEW_LOCK_HASH" ]; then
  echo "package-lock.json changed — running npm ci..."
  npm ci --no-audit --no-fund
else
  echo "Dependencies unchanged — skipping npm ci for speed."
fi

npx prisma generate
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi
npx prisma db push --accept-data-loss || echo "Warning: prisma db push skipped (check DATABASE_URL in .env)"

echo "[4/5] Starting fresh Aibo8 LMS process on PM2..."
pm2 delete aibo8-lms 2>/dev/null || true
pm2 start ecosystem.config.cjs --update-env
pm2 save

echo "[5/5] Verifying live app..."
sleep 2
pm2 status aibo8-lms
curl -sI http://127.0.0.1:3000 | head -n 1 || echo "Note: app still warming up on port 3000"

echo "=== Update complete! Aibo8 LMS is live on commit $(git rev-parse --short HEAD) ==="
