"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { siteContentApi, type SiteContent } from "@/lib/api"

const STORAGE_KEY = "globalsos-site-content-updated"
const UPDATE_EVENT = "globalsos-site-content-updated"

type SiteContentContextType = {
  items: SiteContent[]
  loaded: boolean
  refresh: () => void
}

const SiteContentContext = createContext<SiteContentContextType | null>(null)

/** Appelé après une sauvegarde admin pour rafraîchir le site public. */
export function notifySiteContentUpdated() {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, String(Date.now()))
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SiteContent[]>([])
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(() => {
    siteContentApi
      .getAllPublic()
      .then((data) => setItems(data))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
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

  return (
    <SiteContentContext.Provider value={{ items, loaded, refresh }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContentStore() {
  return useContext(SiteContentContext)
}
