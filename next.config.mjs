import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Origines autorisées pour fetch / WebSocket (API locale, prod, traductions). */
function buildCspConnectSrc() {
  const origins = new Set([
    "'self'",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:4000",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:4000",
    "https://api.globalsos.org",
    "https://api-free.deepl.com",
    "https://api.mymemory.translated.net",
    "ws:",
    "wss:",
  ])
  const raw = process.env.NEXT_PUBLIC_API_URL
  if (raw) {
    try {
      origins.add(new URL(raw).origin)
    } catch {
      /* ignore */
    }
  }
  return [...origins].join(" ")
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowLocalIP: true,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production"
    const connectSrc = buildCspConnectSrc()
    const scriptSrc = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval'"
      : "'self' 'unsafe-inline'"
    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https: http:",
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'self'",
    ].join("; ")
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ]
  },
}

export default nextConfig
