"use client"

import { useEffect, useState } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Loader2, ArrowRight, Calendar, MapPin } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { SITE_MEDIA } from "@/lib/site-media-keys"

function NewsContent() {
  const { t, lang } = useI18n()
  const headerMedia = useSiteMediaKeys([SITE_MEDIA.NEWS_LIST_HEADER])[SITE_MEDIA.NEWS_LIST_HEADER]
  const headerSrc = headerMedia?.url ?? "/images/news-header.png"
  const headerAlt =
    (lang === "fr" ? headerMedia?.altFr : headerMedia?.altEn)?.trim() || ""
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    activitiesApi.getPublic()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "#0a1e46" }}>
          <div className="absolute inset-0">
            <Image
              src={headerSrc}
              alt={headerAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "rgba(10,30,70,0.70)" }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t.news.title}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t.news.subtitle}
            </motion.p>
          </div>
        </section>

        <HeroRedDivider />

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>{lang === "fr" ? "Aucune actualité pour le moment." : "No news yet."}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((a, i) => (
                  <motion.article
                    key={a.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <Image
                        src={a.image || "/images/hero.png"}
                        alt={lang === "fr" ? a.titleFr : a.titleEn}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${a.status === "ONGOING" ? "bg-green-500" : "bg-gray-500"}`}>
                          {lang === "fr" ? (a.status === "ONGOING" ? "En cours" : "Terminé") : (a.status === "ONGOING" ? "Ongoing" : "Completed")}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 leading-snug">
                        {lang === "fr" ? a.titleFr : a.titleEn}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {lang === "fr" ? a.descriptionFr : a.descriptionEn}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col gap-1 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1"><MapPin size={12} />{a.location}</span>
                          <span className="inline-flex items-center gap-1"><Calendar size={12} />{a.date}</span>
                        </div>
                        <Link
                          href={`/news/${a.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sos-blue)]"
                        >
                          {lang === "fr" ? "Voir" : "View"}
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
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

