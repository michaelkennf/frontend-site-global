"use client"

import { useEffect, useState } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useParams, notFound } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, CheckCircle2, ArrowRight, Calendar, MapPin } from "lucide-react"
import { isDomainSlug, type DomainSlug } from "@/lib/domain-slugs"
import { DOMAIN_SLUG_MEDIA_KEY, resolveDomainIllustrationUrl } from "@/lib/domain-assets"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { articlesApi, type Article } from "@/lib/api"
import {
  classifyArticleForDomain,
  formatCategoryLabel,
} from "@/lib/blog-categories"
import { formatArticleDate, articleDisplayDate } from "@/lib/format-article-date"
import { useSiteContent } from "@/hooks/use-site-content"

const accentBySlug: Record<DomainSlug, { color: string; bg: string }> = {
  "risques-catastrophes": { color: "var(--sos-blue)", bg: "var(--sos-blue-light)" },
  "urgences-sanitaires": { color: "var(--sos-red)", bg: "var(--sos-red-light)" },
  "justice-climatique": { color: "var(--sos-blue)", bg: "var(--sos-blue-light)" },
}

function DomainDetailContent() {
  const { t, lang } = useI18n()
  const params = useParams()
  const slugParam = typeof params.slug === "string" ? params.slug : ""
  const cmsR = useSiteContent("domain-risques-catastrophes", lang)
  const cmsU = useSiteContent("domain-urgences-sanitaires", lang)
  const cmsJ = useSiteContent("domain-justice-climatique", lang)
  const cmsDomain = useSiteContent("domain-index", lang)
  const cmsActivities = useSiteContent("activities", lang)

  function cDomain(slug: DomainSlug) {
    if (slug === "risques-catastrophes") return cmsR.c
    if (slug === "urgences-sanitaires") return cmsU.c
    return cmsJ.c
  }
  const mediaKey = isDomainSlug(slugParam) ? DOMAIN_SLUG_MEDIA_KEY[slugParam] : null
  const domainMedia = useSiteMediaKeys(mediaKey ? [mediaKey] : [])
  const heroMedia = mediaKey ? domainMedia[mediaKey] : null
  const [relatedItems, setRelatedItems] = useState<Article[]>([])

  useEffect(() => {
    if (!isDomainSlug(slugParam)) return
    articlesApi
      .getPublic()
      .then((items) => {
        const filtered = items.filter(
          (a) => classifyArticleForDomain(a) === slugParam,
        )
        setRelatedItems(filtered.slice(0, 3))
      })
      .catch(() => setRelatedItems([]))
  }, [slugParam])

  if (!isDomainSlug(slugParam)) {
    notFound()
  }

  const slug = slugParam
  const dp = t.domainPages
  const page = dp[slug]
  const c = cDomain(slug)
  const heroSrc = resolveDomainIllustrationUrl(slug, heroMedia)
  const accent = accentBySlug[slug]

  const leadText = c(`domain.${slug}.lead`, page.lead)
  const bodyRaw = c(`domain.${slug}.body`, page.paragraphs.join("\n\n"))
  const bodyParagraphs =
    bodyRaw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean).length > 0
      ? bodyRaw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
      : page.paragraphs

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero éditorial */}
        <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/domaines"
              className="inline-flex items-center gap-1 text-[var(--sos-blue)] hover:text-[var(--sos-blue-dark)] text-sm font-medium mb-6"
            >
              <ChevronLeft size={18} />
              {cmsDomain.c("domainPages.indexTitle", dp.indexTitle)}
            </Link>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <span
                  className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-5"
                  style={{ background: accent.bg, color: accent.color }}
                >
                  {cmsDomain.c("domainPages.indexTitle", dp.indexTitle)}
                </span>
                <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-gray-900 text-balance leading-tight mb-5">
                  {c(`domain.${slug}.title`, page.title)}
                </h1>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                  {c(`domain.${slug}.excerpt`, page.excerpt)}
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                  <Image
                    src={heroSrc}
                    alt=""
                    fill
                    className="object-contain object-center p-4"
                    sizes="(max-width: 1024px) 100vw, 480px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <HeroRedDivider />

        {/* Contenu éditorial */}
        <section className="py-14 md:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {leadText.trim() && (
              <motion.p
                className="text-xl md:text-2xl text-gray-900 font-medium leading-relaxed mb-10 pl-5 border-l-4"
                style={{ borderColor: accent.color }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {leadText}
              </motion.p>
            )}
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              {bodyParagraphs.map((p, i) => (
                <motion.p
                  key={i}
                  className="leading-relaxed text-base md:text-lg text-pretty"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.45 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </section>

        {/* Nos actions */}
        {page.actions && page.actions.length > 0 && (
          <section className="py-14 md:py-16 bg-gray-50 border-t border-gray-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3"
                  style={{ background: accent.bg, color: accent.color }}
                >
                  {cmsDomain.c("domainPages.actionsTitle", dp.actionsTitle)}
                </span>
                <h2 className="font-serif font-black text-3xl md:text-4xl text-gray-900">
                  {cmsDomain.c("domainPages.actionsTitle", dp.actionsTitle)}
                </h2>
              </motion.div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.actions.map((action, i) => (
                  <motion.div
                    key={action}
                    className="flex items-start gap-3 bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.04 * i, duration: 0.4 }}
                  >
                    <CheckCircle2
                      size={22}
                      className="shrink-0 mt-0.5"
                      style={{ color: accent.color }}
                    />
                    <p className="text-gray-700 text-base leading-snug">{action}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Articles liés */}
        {relatedItems.length > 0 && (
          <section className="py-14 md:py-16 bg-white border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <div>
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3"
                    style={{ background: accent.bg, color: accent.color }}
                  >
                    {cmsDomain.c("domainPages.readArticles", dp.readArticles)}
                  </span>
                  <h2 className="font-serif font-black text-3xl md:text-4xl text-gray-900">
                    {lang === "fr" ? "Sur le terrain" : "From the field"}
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--sos-blue)] hover:gap-3 transition-all"
                >
                  {cmsActivities.c("activities.viewAll", t.activities.viewAll)}
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedItems.map((a) => (
                  <Link
                    key={a.id}
                    href={`/news/${a.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={a.image || "/images/hero image.png"}
                        alt={lang === "fr" ? a.titleFr : a.titleEn}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <span
                        className="inline-block text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: accent.color }}
                      >
                        {formatCategoryLabel(slug, lang)}
                      </span>
                      <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[var(--sos-red)] transition-colors">
                        {lang === "fr" ? a.titleFr : a.titleEn}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                        {lang === "fr" ? a.excerptFr || a.contentFr : a.excerptEn || a.contentEn}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {formatArticleDate(articleDisplayDate(a), lang)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function DomainDetailPage() {
  return (
    <I18nProvider>
      <DomainDetailContent />
    </I18nProvider>
  )
}
