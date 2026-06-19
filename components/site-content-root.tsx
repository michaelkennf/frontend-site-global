"use client"

import type { SiteContent } from "@/lib/api"
import { SiteContentProvider } from "@/lib/site-content-provider"

export function SiteContentRoot({
  children,
  initialItems,
}: {
  children: React.ReactNode
  initialItems: SiteContent[]
}) {
  return <SiteContentProvider initialItems={initialItems}>{children}</SiteContentProvider>
}
