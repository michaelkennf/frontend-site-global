import type { Activity, Article } from "@/lib/api"
import type { DomainSlug } from "@/lib/domain-slugs"
import type { Language } from "@/lib/i18n"

export type BlogCategoryFilter = "all" | DomainSlug

export const BLOG_DOMAIN_SLUGS: DomainSlug[] = [
  "risques-catastrophes",
  "urgences-sanitaires",
  "justice-climatique",
]

const KEYWORDS: Record<DomainSlug, RegExp> = {
  "risques-catastrophes": /\b(risque|catastrophe|alerte|reconstruction|résilience|inondation|seisme|séisme|disaster|risk|emergency|reconstruction|resilience|preparedness|évacu|preparation|préparation)\b/i,
  "urgences-sanitaires": /\b(sant[eé]|santé|sanit|épidémi|epidemi|dssr|sssr|srhr|contraception|sexuelle|reproductive|gbv|violence|maternel|maladie|hospital|clinic|cliniqu|vaccin|vihsida|vih|sida)\b/i,
  "justice-climatique": /\b(climat|climate|environnement|environment|ecosys|écosys|reboise|reforest|recyclage|déchet|biodivers|carbone|carbon|pollution|nature|durable|sustainable)\b/i,
}

export function classifyActivityForDomain(activity: Activity): DomainSlug | null {
  const explicit = activity.category?.trim()
  if (explicit && (BLOG_DOMAIN_SLUGS as readonly string[]).includes(explicit)) {
    return explicit as DomainSlug
  }
  const text = `${activity.titleFr} ${activity.titleEn} ${activity.descriptionFr} ${activity.descriptionEn} ${activity.location ?? ""}`
  for (const slug of BLOG_DOMAIN_SLUGS) {
    if (KEYWORDS[slug].test(text)) return slug
  }
  return null
}

export function classifyArticleForDomain(article: Article): DomainSlug | null {
  const explicit = article.category?.trim()
  if (explicit && (BLOG_DOMAIN_SLUGS as readonly string[]).includes(explicit)) {
    return explicit as DomainSlug
  }
  const text = `${article.titleFr} ${article.titleEn} ${article.excerptFr} ${article.excerptEn} ${article.contentFr} ${article.contentEn}`
  for (const slug of BLOG_DOMAIN_SLUGS) {
    if (KEYWORDS[slug].test(text)) return slug
  }
  return null
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
