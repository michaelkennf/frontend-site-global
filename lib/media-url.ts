const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "")

/** Résout `/uploads/...` vers l’origine de l’API (sinon Next Image cherche dans /public). */
export function resolveMediaUrl(url: string): string {
  const trimmed = url?.trim()
  if (!trimmed) return trimmed
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed
  if (trimmed.startsWith("/uploads/")) return `${API_ORIGIN}${trimmed}`
  return trimmed
}

/** Ajoute un paramètre de version pour invalider le cache navigateur / Next Image. */
export function mediaUrlWithCacheBust(url: string, updatedAt?: string | null): string {
  const resolved = resolveMediaUrl(url)
  if (!resolved) return resolved
  if (!updatedAt) return resolved
  const stamp = new Date(updatedAt).getTime()
  if (!Number.isFinite(stamp)) return resolved
  const sep = resolved.includes("?") ? "&" : "?"
  return `${resolved}${sep}v=${stamp}`
}
