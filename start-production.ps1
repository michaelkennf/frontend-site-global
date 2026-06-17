# Déploiement site Global SOS avec PM2 (Windows)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path ".env.production")) {
  Write-Host "Erreur : .env.production manquant. Copiez .env.example vers .env.production" -ForegroundColor Red
  exit 1
}

New-Item -ItemType Directory -Force -Path logs | Out-Null

Write-Host "==> npm ci"
npm ci

Write-Host "==> Build"
npm run build

Write-Host "==> PM2"
pm2 delete globalsos-web 2>$null
pm2 start ecosystem.config.js --env production
pm2 save

Write-Host "Site en ligne. Logs : pm2 logs globalsos-web"
