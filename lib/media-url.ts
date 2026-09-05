/** Ajoute un paramètre de version pour invalider le cache navigateur / Next Image. */
export function mediaUrlWithCacheBust(url: string, updatedAt?: string | null): string {
  const trimmed = url?.trim()
  if (!trimmed) return trimmed
  if (!updatedAt) return trimmed
  const stamp = new Date(updatedAt).getTime()
  if (!Number.isFinite(stamp)) return trimmed
  const sep = trimmed.includes("?") ? "&" : "?"
  return `${trimmed}${sep}v=${stamp}`
}
