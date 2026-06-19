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

echo "==> Vérification du logo..."
if [ ! -f "public/images/logo SOS.png" ]; then
  echo "ATTENTION : public/images/logo SOS.png est absent — copiez le fichier depuis votre machine locale."
fi

echo "==> Nettoyage du cache Next.js..."
rm -rf .next

echo "==> Build Next.js..."
npm run build

mkdir -p logs

if command -v pm2 >/dev/null 2>&1; then
  echo "==> Redémarrage PM2..."
  pm2 restart globalsos-web 2>/dev/null || pm2 start ecosystem.config.js --env production
  pm2 save
  echo "Site en ligne : pm2 logs globalsos-web"
else
  echo "==> Démarrage direct (sans PM2)..."
  npm run start
fi
