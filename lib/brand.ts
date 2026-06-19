/** Couleur bleu ciel officielle Global SOS — Hex #20B7E6, RGB 32, 183, 230 */
export const BRAND_BLUE = "#20B7E6"
export const BRAND_BLUE_RGB = "32, 183, 230"
export const BRAND_BLUE_DARK = "#18A0C7"
export const BRAND_BLUE_LIGHT = "#E0F7FC"
export const BRAND_RED = "#E32219"
export const BRAND_RED_RGB = "227, 34, 25"

/** Fond léger pour icônes admin (évite `var(--sos-blue)15` qui est invalide en CSS). */
export function brandTintBg(color: string, alpha = 0.15): string {
  if (color === BRAND_BLUE || color === "var(--sos-blue)") {
    return `rgba(${BRAND_BLUE_RGB}, ${alpha})`
  }
  if (color === BRAND_RED || color === "#E32219") {
    return `rgba(${BRAND_RED_RGB}, ${alpha})`
  }
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    const a = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")
    return `${color}${a}`
  }
  return `rgba(${BRAND_BLUE_RGB}, ${alpha})`
}

/** Logo officiel Global SOS — fichier PNG `public/images/logo SOS.png` (inchangé). */
export const LOGO_FILE = "/images/logo SOS.png"
/** Incrémenter après chaque changement de logo pour invalider le cache navigateur/CDN. */
export const LOGO_VERSION = "20260613"
export const LOGO_SRC = `${LOGO_FILE}?v=${LOGO_VERSION}`
