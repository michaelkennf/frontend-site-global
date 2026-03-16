"use client"

import { useEffect, useState } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { articlesApi, Article } from "@/lib/api"

function NewsContent() {
  const { t, lang } = useI18n()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    articlesApi.getPublished().then(setArticles).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "#0a1e46" }}>
          <div className="absolute inset-0">
            <Image
              src="/images/news-header.png"
              alt=""
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

        {/* Articles */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>{lang === "fr" ? "Aucun article publié pour le moment." : "No articles published yet."}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, i) => (
                  <motion.article
                    key={article.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <Image
                        src={article.image ?? "/images/hero.png"}
                        alt={lang === "fr" ? article.titleFr : article.titleEn}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: "#1B6EC2" }}>
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-gray-400 mb-3">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" })
                          : ""}
                      </p>
                      <h3 className="font-bold text-gray-900 text-lg mb-3 leading-snug">
                        {lang === "fr" ? article.titleFr : article.titleEn}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-5">
                        {lang === "fr" ? article.excerptFr : article.excerptEn}
                      </p>
                      <Link
                        href={`/news/${article.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold group/link"
                        style={{ color: "#1B6EC2" }}
                      >
                        {t.news.readMore}
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
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
