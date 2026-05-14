"use client"

import { useEffect, useState } from "react"
import { siteContentApi, SiteContent } from "@/lib/api"

type Lang = "fr" | "en"

export function useSiteContent(section: string, lang: Lang = "fr") {
  const [items, setItems] = useState<SiteContent[]>([])

  useEffect(() => {
    siteContentApi.getBySection(section).then(setItems).catch(() => {})
  }, [section])

  /** Returns CMS value if set, otherwise fallback */
  function c(key: string, fallback = ""): string {
    const item = items.find((i) => i.key === key)
    if (!item) return fallback
    const val = lang === "fr" ? item.valueFr : item.valueEn
    return val?.trim() ? val : fallback
  }

  return { c, items, loaded: items.length > 0 }
}
