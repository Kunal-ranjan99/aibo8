#!/usr/bin/env bash
set -euo pipefail

echo "====================================================="
echo "  Aibo8 LMS — Fast Zero-Build EC2 Update"
echo "====================================================="

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "[1/4] Pulling latest prebuilt code from GitHub..."
git fetch origin main
git reset --hard origin/main

echo "[2/4] Syncing dependencies & Prisma client..."
npm ci --no-audit --no-fund
npx prisma generate
npx prisma db push

echo "[3/4] Restarting Aibo8 LMS on PM2..."
pm2 restart aibo8-lms --update-env || pm2 start ecosystem.config.cjs
pm2 save

echo "[4/4] Checking status..."
pm2 status aibo8-lms

echo "=== Update complete! Aibo8 LMS is running latest build. ==="
