"use client"

import { useMemo } from "react"
import type { SiteMedia } from "@/lib/api"
import { useSiteMediaStore } from "@/lib/site-media-provider"
import { mediaUrlWithCacheBust } from "@/lib/media-url"

/**
 * Médias publics par clé — lit le store préchargé (SSR),
 * donc pas de flash de l’ancienne image hero.
 */
export function useSiteMediaKeys(keys: readonly string[]) {
  const store = useSiteMediaStore()
  const sorted = [...keys].sort().join("|")

  return useMemo(() => {
    const list = sorted ? sorted.split("|") : []
    const out: Record<string, SiteMedia | null> = {}
    for (const k of list) {
      if (!k) continue
      const raw = store?.byKey[k] ?? null
      if (!raw) {
        out[k] = null
        continue
      }
      out[k] = {
        ...raw,
        url: mediaUrlWithCacheBust(raw.url, raw.updatedAt),
      }
    }
    return out
  }, [sorted, store?.byKey])
}
