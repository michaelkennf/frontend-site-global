"use client"

import { useEffect, useState } from "react"
import { siteContentApi, type SiteContent } from "@/lib/api"
import { useSiteContentStore } from "@/lib/site-content-provider"

type Lang = "fr" | "en"

export function useSiteContent(section: string, lang: Lang = "fr") {
  const store = useSiteContentStore()
  const [fallbackItems, setFallbackItems] = useState<SiteContent[]>([])

  useEffect(() => {
    if (store) return
    siteContentApi.getBySection(section).then(setFallbackItems).catch(() => {})
  }, [section, store])

  /** Avec le store global : recherche par clé unique. Sinon : section chargée. */
  const items = store ? store.items : fallbackItems

  function c(key: string, fallback = ""): string {
    const item = items.find((i) => i.key === key)
    if (!item) return fallback
    const val = lang === "fr" ? item.valueFr : item.valueEn
    return val?.trim() ? val : fallback
  }

  return {
    c,
    items: store ? items.filter((i) => i.section === section) : fallbackItems,
    loaded: store ? store.loaded : fallbackItems.length > 0,
    refresh: store?.refresh,
  }
}
