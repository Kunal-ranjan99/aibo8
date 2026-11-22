#!/usr/bin/env bash
set -euo pipefail

echo "====================================================="
echo "  Aibo8 LMS — Free-Tier AWS EC2 One-Shot Installer"
echo "  (Uses prebuilt .next bundle — Zero RAM build spike)"
echo "====================================================="

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

# 1. Add 2GB swap file if low RAM (free-tier t2.micro / t3.micro safety net)
if ! swapon --show | grep -q '/swapfile'; then
  echo "[1/7] Creating 2GB swap file for low-RAM EC2..."
  sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
else
  echo "[1/7] Swap file already active."
fi

# 2. Install system packages (Nginx, PostgreSQL, Git, Curl)
echo "[2/7] Installing system packages..."
sudo apt-get update -y
sudo apt-get install -y curl git nginx postgresql postgresql-contrib

# 3. Install Node.js 22 LTS & PM2
echo "[3/7] Installing Node.js 22 & PM2..."
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

# 4. Configure local PostgreSQL database (skipped if .env already points to RDS)
echo "[4/7] Configuring PostgreSQL database..."
sudo systemctl enable --now postgresql
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='aibo8'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER aibo8 WITH PASSWORD 'aibo8_strong_password';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='aibo8_lms'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE aibo8_lms OWNER aibo8;"

if [ ! -f .env ]; then
  cat <<EOF > .env
DATABASE_URL="postgresql://aibo8:aibo8_strong_password@127.0.0.1:5432/aibo8_lms?schema=public"
JWT_SECRET="$(openssl rand -hex 32)"
COOKIE_SECURE="false"
EOF
  echo "Created .env (set COOKIE_SECURE=true after enabling HTTPS/Certbot)"
fi

# 5. Install runtime dependencies & initialize Prisma for Linux (NO next build!)
echo "[5/7] Installing dependencies & pushing Prisma schema..."
npm ci --no-audit --no-fund
npx prisma generate
npx prisma db push
npm run db:seed

# 6. Launch Aibo8 LMS via PM2 (using local prebuilt .next folder)
echo "[6/7] Starting Aibo8 LMS with PM2..."
pm2 delete aibo8-lms 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$USER" --hp "$HOME" || true

# 7. Configure Nginx Reverse Proxy on Port 80
echo "[7/7] Configuring Nginx reverse proxy..."
sudo cp deploy/nginx-aibo8.conf /etc/nginx/sites-available/aibo8
sudo ln -sf /etc/nginx/sites-available/aibo8 /etc/nginx/sites-enabled/aibo8
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl restart nginx

PUBLIC_IP="$(curl -s --max-time 3 http://checkip.amazonaws.com || echo 'YOUR-EC2-PUBLIC-IP')"
echo ""
echo "====================================================="
echo "  Aibo8 LMS is LIVE!"
echo "  URL: http://${PUBLIC_IP}"
echo "  Check logs: pm2 logs aibo8-lms"
echo "  Future updates: ./deploy/update-ec2.sh"
echo "====================================================="
