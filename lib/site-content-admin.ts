import { type SiteContent } from "@/lib/api"
import { SITE_TEXT_CATALOG } from "@/lib/site-text-catalog"

export type ContentFieldValues = Record<string, { valueFr: string; valueEn: string }>

/** Valeurs initiales = textes actuels du site (catalogue i18n). */
export function defaultsFromCatalog(): ContentFieldValues {
  const m: ContentFieldValues = {}
  for (const e of SITE_TEXT_CATALOG) {
    m[e.key] = { valueFr: e.defaultFr, valueEn: e.defaultEn }
  }
  return m
}

/**
 * Fusionne la base de données avec le catalogue.
 * Les champs vides en BDD ne remplacent pas le texte existant affiché sur le site.
 */
export function mergeContentRows(rows: SiteContent[]): ContentFieldValues {
  const base = defaultsFromCatalog()
  for (const r of rows) {
    const fallback = base[r.key] ?? { valueFr: "", valueEn: "" }
    base[r.key] = {
      valueFr: r.valueFr?.trim() ? r.valueFr : fallback.valueFr,
      valueEn: r.valueEn?.trim() ? r.valueEn : fallback.valueEn,
    }
  }
  return base
}
