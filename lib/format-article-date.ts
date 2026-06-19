export function formatArticleDate(
  value: string | null | undefined,
  lang: "fr" | "en",
): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  try {
    return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  } catch {
    return value
  }
}

/** Affichage compact pour les cartes (jour + mois). */
export function articleDateParts(
  value: string | null | undefined,
  lang: "fr" | "en",
): { day: string; month: string } {
  if (!value) return { day: "--", month: "N/A" }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { day: "--", month: "N/A" }
  try {
    const day = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
      day: "2-digit",
    }).format(date)
    const month = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
      month: "short",
    })
      .format(date)
      .replace(".", "")
    return { day, month }
  } catch {
    return { day: "--", month: "N/A" }
  }
}

export function articleDisplayDate(
  article: { publishedAt?: string | null; createdAt: string },
): string {
  return article.publishedAt || article.createdAt
}
