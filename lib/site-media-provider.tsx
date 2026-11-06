"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { siteMediaApi, type SiteMedia } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media-url"

const STORAGE_KEY = "globalsos-site-media-updated"
const UPDATE_EVENT = "globalsos-site-media-updated"

type SiteMediaContextType = {
  items: SiteMedia[]
  byKey: Record<string, SiteMedia>
  loaded: boolean
  refresh: () => void
}

const SiteMediaContext = createContext<SiteMediaContextType | null>(null)

export function notifySiteMediaUpdated() {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, String(Date.now()))
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

function normalizeMedia(item: SiteMedia): SiteMedia {
  return { ...item, url: resolveMediaUrl(item.url) }
}

function indexByKey(items: SiteMedia[]): Record<string, SiteMedia> {
  const map: Record<string, SiteMedia> = {}
  for (const item of items) {
    if (item?.key) map[item.key] = normalizeMedia(item)
  }
  return map
}

export function SiteMediaProvider({
  children,
  initialItems = [],
}: {
  children: ReactNode
  initialItems?: SiteMedia[]
}) {
  const [items, setItems] = useState<SiteMedia[]>(() =>
    initialItems.map(normalizeMedia),
  )
  const [loaded, setLoaded] = useState(initialItems.length > 0)

  const refresh = useCallback(() => {
    return siteMediaApi
      .getAllPublic()
      .then((data) => {
        if (Array.isArray(data)) setItems(data.map(normalizeMedia))
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    // Rafraîchir en arrière-plan sans vider l’état initial (évite le flash)
    refresh()
    const onFocus = () => refresh()
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh()
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh()
    }
    const onCustom = () => refresh()

    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("storage", onStorage)
    window.addEventListener(UPDATE_EVENT, onCustom)
    return () => {
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(UPDATE_EVENT, onCustom)
    }
  }, [refresh])

  const byKey = useMemo(() => indexByKey(items), [items])

  const value = useMemo(
    () => ({ items, byKey, loaded, refresh }),
    [items, byKey, loaded, refresh],
  )

  return (
    <SiteMediaContext.Provider value={value}>{children}</SiteMediaContext.Provider>
  )
}

export function useSiteMediaStore() {
  return useContext(SiteMediaContext)
}
