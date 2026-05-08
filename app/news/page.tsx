"use client"

import { useEffect, useMemo, useState } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Loader2, ArrowRight, Calendar, MapPin, Newspaper } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { SITE_MEDIA } from "@/lib/site-media-keys"
import {
  BlogCategoryFilter,
  BLOG_DOMAIN_SLUGS,
  classifyActivityForDomain,
  formatCategoryLabel,
  formatCategoryLabelOrAll,
} from "@/lib/blog-categories"
import { cn } from "@/lib/utils"

function readingMinutes(text: string): number {
  if (!text) return 1
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function formatDate(value: string, lang: "fr" | "en"): string {
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

function NewsContent() {
  const { t, lang } = useI18n()
  const headerMedia = useSiteMediaKeys([SITE_MEDIA.NEWS_LIST_HEADER])[SITE_MEDIA.NEWS_LIST_HEADER]
  const headerSrc = headerMedia?.url ?? "/images/hero image.png"
  const headerAlt =
    (lang === "fr" ? headerMedia?.altFr : headerMedia?.altEn)?.trim() || ""
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BlogCategoryFilter>("all")

  useEffect(() => {
    activitiesApi.getPublic()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const enriched = useMemo(
    () =>
      items.map((item) => ({
        item,
        domain: classifyActivityForDomain(item),
      })),
    [items],
  )

  const filtered = useMemo(() => {
    if (filter === "all") return enriched
    return enriched.filter((entry) => entry.domain === filter)
  }, [enriched, filter])

  const featured = filtered[0]
  const others = filtered.slice(1)

  const filterButtons: { id: BlogCategoryFilter; label: string }[] = [
    { id: "all", label: formatCategoryLabelOrAll("all", lang) },
    ...BLOG_DOMAIN_SLUGS.map((slug) => ({
      id: slug as BlogCategoryFilter,
      label: formatCategoryLabel(slug, lang),
    })),
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero blog */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-white">
          <div className="absolute inset-0">
            <Image
              src={headerSrc}
              alt={headerAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.35))" }}
            />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/85 mb-4">
              <Newspaper size={14} />
              {lang === "fr" ? "Le blog" : "Our blog"}
            </span>
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white mb-5 text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t.news.title}
            </motion.h1>
            <motion.p
              className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t.news.subtitle}
            </motion.p>
          </div>
        </section>

        <HeroRedDivider />

        {/* Filtres par domaine */}
        <section className="py-8 bg-white border-b border-gray-100 sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                {t.news.filterTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {filterButtons.map((btn) => {
                  const active = filter === btn.id
                  return (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setFilter(btn.id)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors border",
                        active
                          ? "bg-[var(--sos-red)] text-white border-[var(--sos-red)] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[var(--sos-blue)] hover:text-[var(--sos-blue)]",
                      )}
                    >
                      {btn.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Newspaper className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">{t.news.empty}</p>
              </div>
            ) : (
              <>
                {/* Featured */}
                {featured && (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow mb-12"
                  >
                    <Link
                      href={`/news/${featured.item.id}`}
                      className="relative lg:col-span-7 block aspect-[16/10] lg:aspect-[16/11] overflow-hidden group"
                    >
                      <Image
                        src={featured.item.image || "/images/hero image.png"}
                        alt={lang === "fr" ? featured.item.titleFr : featured.item.titleEn}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                        <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[var(--sos-red)] text-white uppercase tracking-wider">
                          {t.news.featured}
                        </span>
                        {featured.domain && (
                          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-[var(--sos-blue-dark)] uppercase tracking-wider">
                            {formatCategoryLabel(featured.domain, lang)}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(featured.item.createdAt, lang) || featured.item.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} />
                          {featured.item.location}
                        </span>
                        <span>
                          {readingMinutes(
                            lang === "fr"
                              ? featured.item.descriptionFr
                              : featured.item.descriptionEn,
                          )}{" "}
                          {t.news.readingMin}
                        </span>
                      </div>
                      <h2 className="font-serif font-black text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-tight mb-4 text-pretty">
                        <Link
                          href={`/news/${featured.item.id}`}
                          className="hover:text-[var(--sos-red)] transition-colors"
                        >
                          {lang === "fr" ? featured.item.titleFr : featured.item.titleEn}
                        </Link>
                      </h2>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 line-clamp-4">
                        {lang === "fr"
                          ? featured.item.descriptionFr
                          : featured.item.descriptionEn}
                      </p>
                      <Link
                        href={`/news/${featured.item.id}`}
                        className="inline-flex items-center gap-2 text-[var(--sos-blue)] font-bold hover:gap-3 transition-all"
                      >
                        {t.news.readMore}
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </motion.article>
                )}

                {/* Grille articles */}
                {others.length > 0 && (
                  <>
                    <div className="flex items-end justify-between mb-8">
                      <h3 className="font-serif font-bold text-xl md:text-2xl text-gray-900">
                        {t.news.latest}
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {others.map((entry, i) => {
                        const a = entry.item
                        return (
                          <motion.article
                            key={a.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            whileHover={{ y: -4 }}
                          >
                            <Link
                              href={`/news/${a.id}`}
                              className="relative h-48 sm:h-52 overflow-hidden block"
                            >
                              <Image
                                src={a.image || "/images/hero image.png"}
                                alt={lang === "fr" ? a.titleFr : a.titleEn}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                loading="lazy"
                              />
                              {entry.domain && (
                                <div className="absolute top-4 left-4">
                                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/95 text-[var(--sos-blue-dark)] uppercase tracking-widest">
                                    {formatCategoryLabel(entry.domain, lang)}
                                  </span>
                                </div>
                              )}
                            </Link>
                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                <span className="inline-flex items-center gap-1">
                                  <Calendar size={12} />
                                  {formatDate(a.createdAt, lang) || a.date}
                                </span>
                                <span>
                                  {readingMinutes(
                                    lang === "fr" ? a.descriptionFr : a.descriptionEn,
                                  )}{" "}
                                  {t.news.readingMin}
                                </span>
                              </div>
                              <h3 className="font-serif font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-[var(--sos-red)] transition-colors">
                                <Link href={`/news/${a.id}`}>
                                  {lang === "fr" ? a.titleFr : a.titleEn}
                                </Link>
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                                {lang === "fr" ? a.descriptionFr : a.descriptionEn}
                              </p>
                              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin size={12} />
                                  {a.location}
                                </span>
                                <Link
                                  href={`/news/${a.id}`}
                                  className="inline-flex items-center gap-1 text-sm font-bold text-[var(--sos-blue)] hover:gap-2 transition-all"
                                >
                                  {t.news.readMore}
                                  <ArrowRight size={14} />
                                </Link>
                              </div>
                            </div>
                          </motion.article>
                        )
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function NewsPage() {
  return (
    <I18nProvider>
      <NewsContent />
    </I18nProvider>
  )
}
