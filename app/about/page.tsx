"use client"

import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, Users, Globe, Shield } from "lucide-react"
import { useMemo } from "react"
import { valueIcons } from "@/components/about-section"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { useSiteContent } from "@/hooks/use-site-content"
import { SITE_MEDIA } from "@/lib/site-media-keys"
import { RichTextView } from "@/components/rich-text-view"
import { looksLikeHtml } from "@/lib/rich-text"

function resolveAboutPageTitle(raw: string, fallback: string): string {
  const value = raw?.trim() || fallback
  if (/à propos de global\s*sos/i.test(value) || /about global\s*sos/i.test(value)) {
    return fallback
  }
  return value
}

function AboutContent() {
  const { t, lang } = useI18n()
  const { c } = useSiteContent("about", lang)
  const headerMedia = useSiteMediaKeys([SITE_MEDIA.ABOUT_HEADER])[SITE_MEDIA.ABOUT_HEADER]
  const headerSrc = headerMedia?.url ?? "/images/hero image.png"
  const headerAlt =
    (lang === "fr" ? headerMedia?.altFr : headerMedia?.altEn)?.trim() || ""
  const pageTitle = resolveAboutPageTitle(c("about.pageTitle", t.about.title), t.about.title)

  const principles = t.about.principlesList
  const values = t.about.valuesList

  const presentationParagraphs = useMemo(() => {
    const fallback = t.about.whoWeAreParagraphs
    const fromCms = c("about.description", "")
    if (
      !fromCms.trim() ||
      fromCms.length < 400 ||
      !/approche participative|participatory and community/i.test(fromCms)
    ) {
      return fallback
    }
    return fromCms.split("\n\n").map((p) => p.trim()).filter(Boolean)
  }, [c, t.about.whoWeAreParagraphs])

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
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {pageTitle}
            </motion.h1>
          </div>
        </section>

        <HeroRedDivider />

        {/* Qui sommes-nous */}
        <section id="qui-sommes-nous" className="py-16 md:py-24 bg-gray-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="rounded-3xl bg-white border border-gray-100 shadow-sm p-8 md:p-12 lg:p-14"
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sos-blue)] mb-5">
                <span className="h-px w-10 bg-[var(--sos-blue)]/35" aria-hidden />
                {lang === "fr" ? "Présentation" : "Introduction"}
              </span>
              <h2 className="font-serif font-black text-3xl md:text-4xl text-gray-900 mb-8 text-balance leading-tight">
                {t.about.whoWeAreTitle}
              </h2>
              <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
                {looksLikeHtml(presentationParagraphs.join("\n\n")) ? (
                  <RichTextView content={presentationParagraphs.join("\n\n")} />
                ) : (
                  presentationParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif font-black text-4xl text-gray-900 mb-4">{c("about.values", t.about.values)}</h2>
              <div className="w-16 h-1 mx-auto rounded-full bg-[var(--sos-red)]" />
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {values.map((value, i) => {
                const vi = valueIcons[i] ?? valueIcons[0]
                const Icon = vi.icon
                return (
                  <motion.div
                    key={value}
                    className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: vi.bg }}
                    >
                      <Icon size={26} style={{ color: vi.color }} strokeWidth={1.8} />
                    </div>
                    <span className="font-bold text-gray-800 text-sm leading-snug">{value}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Principes fondamentaux */}
        <section className="py-20 bg-[var(--sos-blue)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif font-black text-4xl text-white mb-4">{c("about.principles", t.about.principles)}</h2>
              <div className="w-16 h-1 mx-auto rounded-full bg-[var(--sos-red)]" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((principle, i) => {
                const icons = [Shield, Users, Globe, Heart]
                const Icon = icons[i % icons.length]
                return (
                  <motion.div
                    key={principle}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Icon className="w-10 h-10 mx-auto mb-4 text-[var(--sos-red)]" />
                    <span className="font-bold text-white text-lg">{principle}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function AboutPage() {
  return (
    <I18nProvider>
      <AboutContent />
    </I18nProvider>
  )
}
