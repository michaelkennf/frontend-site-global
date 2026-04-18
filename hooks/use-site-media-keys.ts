"use client"

import { useEffect, useState } from "react"
import { siteMediaApi, type SiteMedia } from "@/lib/api"

/** Charge plusieurs médias publics par clé (Médiathèque). Valeur null si absent ou erreur. */
export function useSiteMediaKeys(keys: readonly string[]) {
  const sorted = [...keys].sort().join("|")
  const [data, setData] = useState<Record<string, SiteMedia | null>>({})

  useEffect(() => {
    let cancelled = false
    const list = [...keys].sort()
    ;(async () => {
      const out: Record<string, SiteMedia | null> = {}
      await Promise.all(
        list.map(async (k) => {
          out[k] = await siteMediaApi.getPublicByKey(k)
        }),
      )
      if (!cancelled) setData(out)
    })()
    return () => {
      cancelled = true
    }
  }, [sorted])

  return data
}
