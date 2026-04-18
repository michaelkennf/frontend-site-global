import type { DomainSlug } from "./domain-slugs"
import type { SiteMedia } from "@/lib/api"

/** Clés Médiathèque pour chaque domaine (fallback fichiers statiques si API indisponible). */
export const DOMAIN_SLUG_MEDIA_KEY: Record<DomainSlug, string> = {
  "risques-catastrophes": "domain-risques",
  "justice-climatique": "domain-climat",
  "urgences-sanitaires": "domain-sante",
}

/** Illustrations par défaut (fallback si pas de ligne en base). */
export const DOMAIN_ILLUSTRATION: Record<DomainSlug, string> = {
  "risques-catastrophes": "/images/domaines/gestion-risques.png",
  "justice-climatique": "/images/domaines/justice-climat.png",
  "urgences-sanitaires": "/images/domaines/sante-dssr.png",
}

/** Ordre cartes page d’accueil et /domaines : gestion risques | climat | santé */
export const DOMAIN_DISPLAY_ORDER: DomainSlug[] = [
  "risques-catastrophes",
  "justice-climatique",
  "urgences-sanitaires",
]

/** URL affichée : média API si valide, sinon fichier statique du domaine. */
export function resolveDomainIllustrationUrl(
  slug: DomainSlug,
  media: SiteMedia | null | undefined,
): string {
  const fallback = DOMAIN_ILLUSTRATION[slug]
  const raw = media?.url?.trim()
  if (!raw) return fallback
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw
  return raw.startsWith("/") ? raw : `/${raw}`
}
