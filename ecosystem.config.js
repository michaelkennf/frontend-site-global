/**
 * PM2 — Site Global SOS (Next.js)
 *
 * Préparer : cp .env.example .env.production puis npm ci && npm run build
 * Démarrer : pm2 start ecosystem.config.js --env production
 * Logs     : pm2 logs globalsos-web
 */
module.exports = {
  apps: [
    {
      name: "globalsos-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "768M",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      time: true,
    },
  ],
}
