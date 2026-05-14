import Image from "next/image"
import React from "react"

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
 * Découpe le texte sur [[IMG1]] … [[IMG4]] et insère les images aux positions voulues.
 * Les URLs viennent du JSON `inlineImages` (indices 0–3 pour IMG1–4).
 */
export function renderBodyWithInlineImages(
  body: string,
  inlineImagesJson: string | undefined | null,
  imageAlt: string,
): React.ReactNode {
  const urls = parseInlineUrls(inlineImagesJson)
  if (!body) return null

  const parts: React.ReactNode[] = []
  let last = 0
  const re = /\[\[IMG([1-4])\]\]/g
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(body)) !== null) {
    const idx = parseInt(m[1], 10) - 1
    if (m.index > last) {
      const chunk = body.slice(last, m.index)
      parts.push(
        <span key={`t-${key++}`} className="whitespace-pre-wrap">
          {chunk}
        </span>,
      )
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
  if (last < body.length) {
    parts.push(
      <span key={`t-${key++}`} className="whitespace-pre-wrap">
        {body.slice(last)}
      </span>,
    )
  }

  if (parts.length === 0) {
    return <span className="whitespace-pre-wrap">{body}</span>
  }
  return <>{parts}</>
}
