export const DOMAIN_SLUGS = [
  "risques-catastrophes",
  "urgences-sanitaires",
  "justice-climatique",
] as const

export type DomainSlug = (typeof DOMAIN_SLUGS)[number]

export function isDomainSlug(s: string): s is DomainSlug {
  return (DOMAIN_SLUGS as readonly string[]).includes(s)
}
