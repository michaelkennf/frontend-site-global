const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "")

/** Marqueurs [[IMG1]]…[[IMG4]] ou [IMG1]…[IMG4] */
export const INLINE_IMAGE_MARKER_RE = /\[{1,2}IMG([1-4])\]{1,2}/gi

export function normalizeInlineImageMarkers(body: string): string {
  return body.replace(INLINE_IMAGE_MARKER_RE, (_, n) => `[[IMG${n}]]`)
}

export function resolveMediaUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed
  if (trimmed.startsWith("/uploads/")) return `${API_ORIGIN}${trimmed}`
  return trimmed
}
