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

type SiteContentContextType = {
  items: SiteContent[]
  loaded: boolean
  refresh: () => void
}

const SiteContentContext = createContext<SiteContentContextType | null>(null)

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
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisible)
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
