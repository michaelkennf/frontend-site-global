"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, MapPin, Calendar, Share2, ArrowRight } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"
import { HeroRedDivider } from "@/components/hero-red-divider"
import {
  classifyActivityForDomain,
  formatCategoryLabel,
} from "@/lib/blog-categories"

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

function ActivityContent() {
  const { t, lang } = useI18n()
  const params = useParams()
  const [item, setItem] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<Activity[]>([])

  useEffect(() => {
    if (!params?.id) return
    setLoading(true)
    activitiesApi
      .getOnePublic(params.id as string)
      .then(setItem)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params?.id])

  const domain = useMemo(() => (item ? classifyActivityForDomain(item) : null), [item])

  useEffect(() => {
    if (!item) return
    activitiesApi
      .getPublic()
      .then((all) => {
        const filtered = all.filter((a) => a.id !== item.id)
        const sameDomain = domain
          ? filtered.filter((a) => classifyActivityForDomain(a) === domain)
          : filtered
        setRelated((sameDomain.length ? sameDomain : filtered).slice(0, 3))
      })
      .catch(() => setRelated([]))
  }, [item, domain])

  function handleShare() {
    if (typeof window === "undefined") return
    const url = window.location.href
    const title = item ? (lang === "fr" ? item.titleFr : item.titleEn) : "Global SOS"
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-xl font-bold mb-4">
              {lang === "fr" ? "Actualité introuvable" : "Not found"}
            </p>
            <Link href="/news" className="text-[var(--sos-blue)] hover:underline">
              ← {t.news.backToList}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const reading = readingMinutes(
    lang === "fr" ? item.descriptionFr : item.descriptionEn,
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* En-tête éditorial */}
        <section className="pt-32 pb-10 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[var(--sos-blue)] hover:text-[var(--sos-blue-dark)] text-sm font-medium mb-6"
            >
              <ArrowLeft size={16} />
              {t.news.backToList}
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {domain && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[var(--sos-blue-light)] text-[var(--sos-blue-dark)] uppercase tracking-widest">
                  {formatCategoryLabel(domain, lang)}
                </span>
              )}
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                  item.status === "ONGOING"
                    ? "bg-[var(--sos-blue)] text-white"
                    : "bg-[var(--sos-red-light)] text-[var(--sos-red-dark)]"
                }`}
              >
                {lang === "fr"
                  ? item.status === "ONGOING"
                    ? "En cours"
                    : "Terminé"
                  : item.status === "ONGOING"
                    ? "Ongoing"
                    : "Completed"}
              </span>
            </div>
            <motion.h1
              className="font-serif font-black text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {lang === "fr" ? item.titleFr : item.titleEn}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-6">
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(item.createdAt, lang) || item.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {item.location}
              </span>
              <span>
                {reading} {t.news.readingMin}
              </span>
              {item.author?.name && (
                <span>
                  {lang === "fr" ? "Par" : "By"} <strong>{item.author.name}</strong>
                </span>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 text-[var(--sos-blue)] hover:text-[var(--sos-blue-dark)] font-semibold ml-auto"
              >
                <Share2 size={14} />
                {t.news.shareTitle}
              </button>
            </div>
          </div>
        </section>

        {/* Image principale */}
        <section className="bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100">
              <Image
                src={item.image || "/images/hero image.png"}
                alt={lang === "fr" ? item.titleFr : item.titleEn}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        <HeroRedDivider />

        {/* Corps de l'article */}
        <section className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {lang === "fr" ? item.descriptionFr : item.descriptionEn}
            </motion.div>
          </div>
        </section>

        {/* Articles connexes */}
        {related.length > 0 && (
          <section className="py-14 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <h2 className="font-serif font-black text-2xl md:text-3xl text-gray-900">
                  {t.news.relatedTitle}
                </h2>
                <Link
                  href="/news"
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[var(--sos-blue)] hover:gap-3 transition-all"
                >
                  {t.activities.viewAll}
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((a) => {
                  const d = classifyActivityForDomain(a)
                  return (
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
                        {d && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--sos-blue)] mb-2">
                            {formatCategoryLabel(d, lang)}
                          </span>
                        )}
                        <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[var(--sos-red)] transition-colors">
                          {lang === "fr" ? a.titleFr : a.titleEn}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(a.createdAt, lang) || a.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} />
                            {a.location}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function ActivityPage() {
  return (
    <I18nProvider>
      <ActivityContent />
    </I18nProvider>
  )
}
