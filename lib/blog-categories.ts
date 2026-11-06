import type { Activity, Article } from "@/lib/api"
import type { DomainSlug } from "@/lib/domain-slugs"
import type { Language } from "@/lib/i18n"

export type BlogCategoryFilter = "all" | DomainSlug

export const BLOG_DOMAIN_SLUGS: DomainSlug[] = [
  "risques-catastrophes",
  "urgences-sanitaires",
  "justice-climatique",
]

/**
 * Respecte uniquement la catégorie choisie à la publication.
 * « Général » (ou autre valeur hors domaines) ne doit jamais être
 * réaffecté automatiquement à un domaine via mots-clés.
 */
export function classifyActivityForDomain(activity: Activity): DomainSlug | null {
  const explicit = activity.category?.trim()
  if (explicit && (BLOG_DOMAIN_SLUGS as readonly string[]).includes(explicit)) {
    return explicit as DomainSlug
  }
  return null
}

export function classifyArticleForDomain(article: Article): DomainSlug | null {
  const explicit = article.category?.trim()
  if (explicit && (BLOG_DOMAIN_SLUGS as readonly string[]).includes(explicit)) {
    return explicit as DomainSlug
  }
  return null
}

/** Libellé public : domaine si choisi, sinon la catégorie brute (ex. Général). */
export function formatPublicationCategoryLabel(
  category: string | null | undefined,
  lang: Language,
): string {
  const raw = category?.trim()
  if (raw && (BLOG_DOMAIN_SLUGS as readonly string[]).includes(raw)) {
    return formatCategoryLabel(raw as DomainSlug, lang)
  }
  if (raw) return raw
  return lang === "fr" ? "Général" : "General"
}

export function formatArticleCategoryLabel(article: Article, lang: Language): string {
  return formatPublicationCategoryLabel(article.category, lang)
}

const LABELS_FR: Record<DomainSlug, string> = {
  "risques-catastrophes": "Gestion des risques",
  "urgences-sanitaires": "Urgences sanitaires & DSSR",
  "justice-climatique": "Justice climatique",
}

const LABELS_EN: Record<DomainSlug, string> = {
  "risques-catastrophes": "Disaster risk management",
  "urgences-sanitaires": "Health emergencies & SRHR",
  "justice-climatique": "Climate justice",
}

export function formatCategoryLabel(
  slug: DomainSlug | null,
  lang: Language,
): string {
  if (!slug) return lang === "fr" ? "Actualité" : "News"
  return (lang === "fr" ? LABELS_FR : LABELS_EN)[slug]
}

export function formatCategoryLabelOrAll(
  slug: BlogCategoryFilter,
  lang: Language,
): string {
  if (slug === "all") return lang === "fr" ? "Tous les articles" : "All articles"
  return formatCategoryLabel(slug, lang)
}
