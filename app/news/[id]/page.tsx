"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, Calendar, ArrowRight } from "lucide-react"
import { articlesApi, Article } from "@/lib/api"
import {
  classifyArticleForDomain,
  formatCategoryLabel,
} from "@/lib/blog-categories"
import { ContentDetailView } from "@/components/content-detail-view"
import { formatArticleDate, articleDisplayDate } from "@/lib/format-article-date"

function readingMinutes(text: string): number {
  if (!text) return 1
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function ArticleContent() {
  const { t, lang } = useI18n()
  const params = useParams()
  const [item, setItem] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<Article[]>([])

  useEffect(() => {
    if (!params?.id) return
    setLoading(true)
    articlesApi
      .getOnePublic(params.id as string)
      .then(setItem)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params?.id])

  const domain = useMemo(() => (item ? classifyArticleForDomain(item) : null), [item])

  useEffect(() => {
    if (!item) return
    articlesApi
      .getPublic()
      .then((all) => {
        const filtered = all.filter((a) => a.id !== item.id)
        const sameDomain = domain
          ? filtered.filter((a) => classifyArticleForDomain(a) === domain)
          : filtered
        setRelated((sameDomain.length ? sameDomain : filtered).slice(0, 3))
      })
      .catch(() => setRelated([]))
  }, [item, domain])

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
              {lang === "fr" ? "Article introuvable" : "Article not found"}
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

  const title = lang === "fr" ? item.titleFr : item.titleEn
  const excerpt = lang === "fr" ? item.excerptFr : item.excerptEn
  const body = lang === "fr" ? item.contentFr : item.contentEn
  const reading = readingMinutes(body)
  const dateStr = formatArticleDate(articleDisplayDate(item), lang)

  const detailMeta = {
    categoryLabel: domain ? formatCategoryLabel(domain, lang) : item.category,
    statusLabel: lang === "fr" ? "Publié" : "Published",
    statusVariant: "published" as const,
    date: dateStr,
    authorName: item.author?.name,
    readingMinutes: reading,
    readingMinLabel: t.news.readingMin,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="pt-24 pb-4 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[var(--sos-blue)] hover:text-[var(--sos-blue-dark)] text-sm font-medium"
            >
              <ArrowLeft size={16} />
              {t.news.backToList}
            </Link>
          </div>
        </div>

        <ContentDetailView
          title={title}
          excerpt={excerpt}
          body={body}
          image={item.image}
          inlineImages={item.inlineImages}
          layoutSettings={item.layoutSettings}
          lang={lang}
          meta={detailMeta}
        />

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
                  const d = classifyArticleForDomain(a)
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
                            {formatArticleDate(articleDisplayDate(a), lang)}
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

export default function ArticlePage() {
  return (
    <I18nProvider>
      <ArticleContent />
    </I18nProvider>
  )
}
