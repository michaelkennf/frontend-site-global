import DOMPurify from "isomorphic-dompurify"

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
]
const ALLOWED_ATTR = ["style", "class", "href", "target", "rel"]

export function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value?.trim() ?? "")
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Convertit du texte brut historique en HTML éditable. */
export function plainTextToHtml(raw: string): string {
  const text = raw ?? ""
  if (!text.trim()) return ""
  if (looksLikeHtml(text)) return text
  return text
    .split(/\n\n+/)
    .map((block) => {
      const withBreaks = escapeHtml(block).replace(/\n/g, "<br>")
      return `<p>${withBreaks || "<br>"}</p>`
    })
    .join("")
}

export function sanitizeRichHtml(html: string): string {
  if (!html?.trim()) return ""
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })
}

/** Pour l’éditeur TipTap : HTML propre ou conversion du texte brut. */
export function toEditorHtml(raw: string): string {
  if (!raw?.trim()) return ""
  return looksLikeHtml(raw) ? sanitizeRichHtml(raw) : plainTextToHtml(raw)
}

/** Pour l’affichage public : sanitize si HTML, sinon texte brut. */
export function prepareDisplayHtml(raw: string): { html: string; isHtml: boolean } {
  if (!raw?.trim()) return { html: "", isHtml: false }
  if (!looksLikeHtml(raw)) return { html: raw, isHtml: false }
  return { html: sanitizeRichHtml(raw), isHtml: true }
}

/** Extrait du texte brut pour les cartes / aperçus (line-clamp). */
export function htmlToPlainText(html: string): string {
  if (!html?.trim()) return ""
  if (!looksLikeHtml(html)) return html
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
}
