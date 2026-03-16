"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, Eye, Calendar } from "lucide-react"
import { articlesApi, Article } from "@/lib/api"

function ArticleContent() {
  const { lang } = useI18n()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      articlesApi.getOne(params.id as string)
        .then(setArticle)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [params?.id])

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

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-xl font-bold mb-4">Article introuvable</p>
            <Link href="/news" className="text-[#1B6EC2] hover:underline">← Retour aux actualités</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: "#0a1e46" }}>
          {article.image && (
            <div className="absolute inset-0">
              <Image src={article.image} alt="" fill className="object-cover object-center opacity-20" sizes="100vw" />
            </div>
          )}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={16} />
              {lang === "fr" ? "Retour aux actualités" : "Back to news"}
            </Link>
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-4" style={{ background: "#1B6EC2" }}>
              {article.category}
            </span>
            <motion.h1
              className="font-serif font-black text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {lang === "fr" ? article.titleFr : article.titleEn}
            </motion.h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              {article.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(article.publishedAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              <span className="flex items-center gap-1"><Eye size={14} />{article.views} vues</span>
              {article.author && <span>{lang === "fr" ? "Par" : "By"} {article.author.name}</span>}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {article.image && (
            <motion.div
              className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={article.image}
                alt={lang === "fr" ? article.titleFr : article.titleEn}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </motion.div>
          )}
            <motion.p
              className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-[#1B6EC2] pl-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {lang === "fr" ? article.excerptFr : article.excerptEn}
            </motion.p>
            <motion.div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {lang === "fr" ? article.contentFr : article.contentEn}
            </motion.div>
          </div>
        </section>
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
