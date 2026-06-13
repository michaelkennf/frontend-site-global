export type ContentLayout = "classic" | "magazine" | "immersive" | "minimal"
export type TextAlign = "left" | "center" | "justify"
export type ContentWidth = "narrow" | "medium" | "wide"

export interface LayoutSettings {
  layout: ContentLayout
  textAlign: TextAlign
  contentWidth: ContentWidth
  showExcerpt: boolean
}

export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  layout: "classic",
  textAlign: "left",
  contentWidth: "medium",
  showExcerpt: true,
}

const LAYOUTS: ContentLayout[] = ["classic", "magazine", "immersive", "minimal"]
const ALIGNS: TextAlign[] = ["left", "center", "justify"]
const WIDTHS: ContentWidth[] = ["narrow", "medium", "wide"]

export function parseLayoutSettings(raw?: string | null): LayoutSettings {
  if (!raw?.trim()) return { ...DEFAULT_LAYOUT_SETTINGS }
  try {
    const p = JSON.parse(raw) as Partial<LayoutSettings>
    return {
      layout: LAYOUTS.includes(p.layout as ContentLayout)
        ? (p.layout as ContentLayout)
        : DEFAULT_LAYOUT_SETTINGS.layout,
      textAlign: ALIGNS.includes(p.textAlign as TextAlign)
        ? (p.textAlign as TextAlign)
        : DEFAULT_LAYOUT_SETTINGS.textAlign,
      contentWidth: WIDTHS.includes(p.contentWidth as ContentWidth)
        ? (p.contentWidth as ContentWidth)
        : DEFAULT_LAYOUT_SETTINGS.contentWidth,
      showExcerpt: p.showExcerpt !== false,
    }
  } catch {
    return { ...DEFAULT_LAYOUT_SETTINGS }
  }
}

export function serializeLayoutSettings(s: LayoutSettings): string {
  return JSON.stringify(s)
}

export function contentWidthClass(w: ContentWidth): string {
  if (w === "narrow") return "max-w-3xl"
  if (w === "wide") return "max-w-5xl"
  return "max-w-4xl"
}

export function textAlignClass(a: TextAlign): string {
  if (a === "center") return "text-center"
  if (a === "justify") return "text-justify"
  return "text-left"
}

export const LAYOUT_OPTIONS: {
  id: ContentLayout
  labelFr: string
  descFr: string
}[] = [
  {
    id: "classic",
    labelFr: "Classique",
    descFr: "Titre en haut, grande image, puis le texte",
  },
  {
    id: "magazine",
    labelFr: "Magazine",
    descFr: "Image à gauche, titre et résumé à droite",
  },
  {
    id: "immersive",
    labelFr: "Immersion",
    descFr: "Titre et résumé sur l'image en pleine largeur",
  },
  {
    id: "minimal",
    labelFr: "Épuré",
    descFr: "Texte en premier, image discrète à côté du titre",
  },
]
