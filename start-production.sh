#!/usr/bin/env bash
# Déploiement site Global SOS en production (VPS Linux)
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env.production ]; then
  echo "Erreur : fichier .env.production manquant."
  echo "Copiez .env.example vers .env.production et définissez NEXT_PUBLIC_API_URL."
  exit 1
fi

echo "==> Installation des dépendances..."
npm ci

echo "==> Build Next.js..."
npm run build

mkdir -p logs

if command -v pm2 >/dev/null 2>&1; then
  echo "==> Démarrage avec PM2..."
  pm2 delete globalsos-web 2>/dev/null || true
  pm2 start ecosystem.config.js --env production
  pm2 save
  echo "Site en ligne : pm2 logs globalsos-web"
else
  echo "==> Démarrage direct (sans PM2)..."
  npm run start
fi
