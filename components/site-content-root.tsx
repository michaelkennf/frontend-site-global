"use client"

import type { SiteContent, SiteMedia } from "@/lib/api"
import { SiteContentProvider } from "@/lib/site-content-provider"
import { SiteMediaProvider } from "@/lib/site-media-provider"

export function SiteContentRoot({
  children,
  initialItems,
  initialMedia = [],
}: {
  children: React.ReactNode
  initialItems: SiteContent[]
  initialMedia?: SiteMedia[]
}) {
  return (
    <SiteContentProvider initialItems={initialItems}>
      <SiteMediaProvider initialItems={initialMedia}>{children}</SiteMediaProvider>
    </SiteContentProvider>
  )
}
