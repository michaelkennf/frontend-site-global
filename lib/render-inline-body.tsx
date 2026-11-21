import Image from "next/image"
import React from "react"
import { normalizeInlineImageMarkers, resolveMediaUrl } from "@/lib/inline-image-markers"
import { RichTextView } from "@/components/rich-text-view"

function parseInlineUrls(raw?: string | null): string[] {
  if (!raw) return []
  try {
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return []
    return arr.map((u) => String(u || "")).slice(0, 4)
  } catch {
    return []
  }
}

/**
 * Découpe le texte sur [[IMG1]] … [[IMG4]] et insère les images.
 * Le texte entre les marqueurs peut être du HTML mis en forme (admin).
 */
export function renderBodyWithInlineImages(
  body: string,
  inlineImagesJson: string | undefined | null,
  imageAlt: string,
): React.ReactNode {
  const urls = parseInlineUrls(inlineImagesJson).map(resolveMediaUrl)
  if (!body) return null

  const normalizedBody = normalizeInlineImageMarkers(body)
  const parts: React.ReactNode[] = []
  let last = 0
  const re = /\[\[IMG([1-4])\]\]/g
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(normalizedBody)) !== null) {
    const idx = parseInt(m[1], 10) - 1
    if (m.index > last) {
      const chunk = normalizedBody.slice(last, m.index)
      parts.push(<RichTextView key={`t-${key++}`} content={chunk} />)
    }
    const src = urls[idx]
    if (src) {
      parts.push(
        <figure key={`img-${key++}`} className="my-8 not-prose">
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
            <Image src={src} alt={`${imageAlt} — ${m[1]}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 42rem" />
          </div>
        </figure>,
      )
    }
    last = m.index + m[0].length
  }
  if (last < normalizedBody.length) {
    parts.push(<RichTextView key={`t-${key++}`} content={normalizedBody.slice(last)} />)
  }

  if (parts.length === 0) {
    return <RichTextView content={normalizedBody} />
  }
  return <>{parts}</>
}
