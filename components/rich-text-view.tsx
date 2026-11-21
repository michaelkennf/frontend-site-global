"use client"

import { cn } from "@/lib/utils"
import { prepareDisplayHtml } from "@/lib/rich-text"

export function RichTextView({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const { html, isHtml } = prepareDisplayHtml(content)
  if (!html) return null

  if (!isHtml) {
    return <span className={cn("whitespace-pre-wrap", className)}>{html}</span>
  }

  return (
    <div
      className={cn(
        "rich-text-content [&_p]:mb-3 [&_p:last-child]:mb-0 [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mb-3 [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mb-2",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
