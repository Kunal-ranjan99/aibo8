param(
  [string]$Message = "Update Aibo8 LMS prebuilt release"
)

$ErrorActionPreference = "Stop"
Write-Host "=== 1. Running clean local Next.js build ===" -ForegroundColor Cyan
npm run build

Write-Host "=== 2. Committing source + prebuilt .next bundle ===" -ForegroundColor Cyan
git add -A
git commit -m $Message

Write-Host "=== 3. Pushing to GitHub (origin main) ===" -ForegroundColor Cyan
git push origin main

Write-Host "=== Done! Now run ./deploy/update-ec2.sh on your EC2 server. ===" -ForegroundColor Green
