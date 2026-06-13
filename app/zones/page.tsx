"use client"

import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteContent } from "@/hooks/use-site-content"

function ZonesContent() {
  const { t, lang } = useI18n()
  const { c } = useSiteContent("zones", lang)

  const titleOur = c("zones.titleOur", t.zones.titleOur)
  const titleRest = c("zones.titleRest", t.zones.titleRest)
  const body = c("zones.body", t.zones.body)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-32 pb-16 md:pb-20 bg-gradient-to-b from-[var(--sos-blue-light)]/60 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-[var(--sos-blue)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MapPin size={14} />
              {lang === "fr" ? "Rayon d'activité" : "Area of operation"}
            </motion.span>
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span style={{ color: "var(--sos-blue)" }}>{titleOur}</span>{" "}
              <span className="text-gray-900">{titleRest}</span>
            </motion.h1>
          </div>
        </section>

        <HeroRedDivider />

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.blockquote
              className="relative text-lg md:text-xl text-gray-700 leading-relaxed italic text-center border-l-0 pl-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <span
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl text-[var(--sos-blue)]/25 font-serif leading-none select-none"
                aria-hidden
              >
                &ldquo;
              </span>
              {body}
            </motion.blockquote>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function ZonesPage() {
  return (
    <I18nProvider>
      <ZonesContent />
    </I18nProvider>
  )
}
