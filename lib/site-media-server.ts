import type { SiteMedia } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media-url"

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"
}

/** Chargement serveur de la médiathèque (évite le flash de l’ancienne image). */
export async function fetchSiteMediaPublic(): Promise<SiteMedia[]> {
  try {
    const res = await fetch(`${apiBase()}/site-media/public/all`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return []
    const data = (await res.json()) as SiteMedia[]
    if (!Array.isArray(data)) return []
    return data.map((item) => ({ ...item, url: resolveMediaUrl(item.url) }))
  } catch {
    return []
  }
}
