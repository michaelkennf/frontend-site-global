"use client"

import { useCallback, useEffect, useState } from "react"
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

  const items = store?.items ?? fallbackItems
  const loaded = store ? store.loaded : fallbackItems.length > 0

  const c = useCallback(
    (key: string, fallback = ""): string => {
      const item = items.find((i) => i.key === key)
      if (!item) return fallback
      if (!item.valueFr?.trim() && !item.valueEn?.trim()) return fallback
      const val = lang === "fr" ? item.valueFr : item.valueEn
      return val?.trim() ? val : fallback
    },
    [items, lang],
  )

  return {
    c,
    items: store ? items.filter((i) => i.section === section) : fallbackItems,
    loaded,
    refresh: store?.refresh,
  }
}
