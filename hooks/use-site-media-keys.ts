"use client"

import { useCallback, useEffect, useState } from "react"
import { siteMediaApi, type SiteMedia } from "@/lib/api"

/** Charge plusieurs médias publics par clé (Médiathèque). Valeur null si absent ou erreur. */
export function useSiteMediaKeys(keys: readonly string[]) {
  const sorted = [...keys].sort().join("|")
  const [data, setData] = useState<Record<string, SiteMedia | null>>({})

  const load = useCallback(async () => {
    const list = [...keys].sort()
    const out: Record<string, SiteMedia | null> = {}
    await Promise.all(
      list.map(async (k) => {
        out[k] = await siteMediaApi.getPublicByKey(k)
      }),
    )
    setData(out)
  }, [keys, sorted])

  useEffect(() => {
    load()
    const onRefresh = () => {
      if (document.visibilityState === "hidden") return
      load()
    }
    window.addEventListener("focus", onRefresh)
    document.addEventListener("visibilitychange", onRefresh)
    return () => {
      window.removeEventListener("focus", onRefresh)
      document.removeEventListener("visibilitychange", onRefresh)
    }
  }, [load])

  return data
}
