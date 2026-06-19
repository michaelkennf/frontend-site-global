import type { SiteContent } from "@/lib/api"

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"
}

/** Chargement serveur du CMS (utilisé par le layout pour les visiteurs). */
export async function fetchSiteContentPublic(): Promise<SiteContent[]> {
  try {
    const res = await fetch(`${apiBase()}/site-content/public/all`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return []
    const data = (await res.json()) as SiteContent[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
