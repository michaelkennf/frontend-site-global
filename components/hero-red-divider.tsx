/** Ligne rouge sang sous le bandeau hero (identique sur tout le site). */
export function HeroRedDivider() {
  return (
    <div
      className="w-full h-1.5 shrink-0"
      style={{ background: "var(--sos-red)" }}
      aria-hidden
    />
  )
}
