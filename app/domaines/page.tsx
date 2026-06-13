"use client"

import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { DOMAIN_DISPLAY_ORDER, DOMAIN_SLUG_MEDIA_KEY, resolveDomainIllustrationUrl } from "@/lib/domain-assets"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { useSiteContent } from "@/hooks/use-site-content"

const accentMap: Record<string, { color: string; bg: string }> = {
  "risques-catastrophes": { color: "var(--sos-blue)", bg: "var(--sos-blue-light)" },
  "urgences-sanitaires": { color: "var(--sos-red)", bg: "var(--sos-red-light)" },
  "justice-climatique": { color: "var(--sos-blue)", bg: "var(--sos-blue-light)" },
}

function DomainesContent() {
  const { t, lang } = useI18n()
  const { c } = useSiteContent("domain-index", lang)
  const { c: cAreas } = useSiteContent("areas", lang)
  const dp = t.domainPages
  const domainKeys = DOMAIN_DISPLAY_ORDER.map((s) => DOMAIN_SLUG_MEDIA_KEY[s])
  const domainMedia = useSiteMediaKeys(domainKeys)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero éditorial */}
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--sos-blue-rgb),0.08), transparent 60%), radial-gradient(ellipse 50% 35% at 100% 100%, rgba(227,34,25,0.05), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full mb-4 bg-[var(--sos-blue-light)] text-[var(--sos-blue)]">
              {cAreas("areas.subtitle", t.areas.subtitle)}
            </span>
            <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-gray-900 text-balance mb-5 leading-[1.1]">
              {c("domainPages.indexTitle", dp.indexTitle)}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {c("domainPages.indexSubtitle", dp.indexSubtitle)}
            </p>
          </div>
        </section>

        <HeroRedDivider />

        {/* Cartes domaines */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DOMAIN_DISPLAY_ORDER.map((slug, i) => {
              const block = dp[slug]
              const accent = accentMap[slug]
              return (
                <motion.article
                  key={slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group"
                >
                  <Link
                    href={`/domaines/${slug}`}
                    className="relative aspect-[4/3] block bg-gray-50 overflow-hidden"
                  >
                    <Image
                      src={resolveDomainIllustrationUrl(slug, domainMedia[DOMAIN_SLUG_MEDIA_KEY[slug]])}
                      alt={block.title}
                      fill
                      className="object-contain object-center p-6 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="p-7 flex flex-col flex-1">
                    <span
                      className="inline-block self-start text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3"
                      style={{ background: accent.bg, color: accent.color }}
                    >
                      {String(i + 1).padStart(2, "0")} · {c("domainPages.indexTitle", dp.indexTitle)}
                    </span>
                    <h2 className="font-serif font-black text-xl md:text-2xl text-gray-900 mb-3 leading-snug">
                      <Link
                        href={`/domaines/${slug}`}
                        className="hover:text-[var(--sos-red)] transition-colors"
                      >
                        {c(`domain.${slug}.title`, block.title)}
                      </Link>
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5 flex-1">
                      {c(`domain.${slug}.excerpt`, block.excerpt)}
                    </p>
                    {block.actions && block.actions.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {block.actions.slice(0, 3).map((act) => (
                          <li
                            key={act}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle2
                              size={16}
                              className="shrink-0 mt-0.5"
                              style={{ color: accent.color }}
                            />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href={`/domaines/${slug}`}
                      className="inline-flex items-center gap-2 font-bold text-sm hover:gap-3 transition-all w-fit"
                      style={{ color: "var(--sos-red)" }}
                    >
                      {c("domainPages.discover", dp.discover)}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function DomainesPage() {
  return (
    <I18nProvider>
      <DomainesContent />
    </I18nProvider>
  )
}
