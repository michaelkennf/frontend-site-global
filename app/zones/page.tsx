"use client"

import dynamic from "next/dynamic"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteContent } from "@/hooks/use-site-content"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { SITE_MEDIA } from "@/lib/site-media-keys"

const ZonesMap = dynamic(
  () => import("@/components/zones-map").then((m) => m.ZonesMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] md:h-[560px] w-full animate-pulse bg-gray-100" />
    ),
  },
)

function ZonesContent() {
  const { t, lang } = useI18n()
  const { c } = useSiteContent("zones", lang)
  const headerMedia = useSiteMediaKeys([SITE_MEDIA.ZONES_HEADER])[SITE_MEDIA.ZONES_HEADER]
  const headerSrc = headerMedia?.url ?? "/images/hero image.png"
  const headerAlt =
    (lang === "fr" ? headerMedia?.altFr : headerMedia?.altEn)?.trim() ||
    (lang === "fr" ? "Nos zones d'intervention" : "Our intervention zones")

  const eyebrow = c("zones.eyebrow", t.zones.eyebrow)
  const titleOur = c("zones.titleOur", t.zones.titleOur)
  const titleRest = c("zones.titleRest", t.zones.titleRest)
  const body = c("zones.body", t.zones.body)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-white flex items-end min-h-screen">
          <div className="absolute inset-0">
            <Image
              key={headerSrc}
              src={headerSrc}
              alt={headerAlt}
              fill
              className="object-cover"
              sizes="100vw"
              style={{ objectPosition: "center 25%" }}
              priority
            />
          </div>
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16 md:pb-20">
            <motion.p
              className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              {titleOur} {titleRest}
            </motion.h1>
          </div>
        </section>

        <HeroRedDivider />

        <div className="py-16 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.p
              className="text-lg md:text-xl text-gray-700 leading-relaxed text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              {body}
            </motion.p>
          </div>
        </div>

        <div className="pb-16 md:pb-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ZonesMap lang={lang} />
          </div>
        </div>
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
