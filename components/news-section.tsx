"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowRight } from "lucide-react"
import { articlesApi, Article } from "@/lib/api"

// Carte compacte droite avec panorama vertical de l'image
function SmallArticleCard({ article, lang, index }: { article: Article; lang: string; index: number }) {
  const [hovered, setHovered] = useState(false)
  const title = lang === "fr" ? article.titleFr : article.titleEn
  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })
    : ""

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
    >
      <Link
        href={`/news/${article.id}`}
        className="flex items-start gap-4 group py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail avec panorama vertical */}
        <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
          <motion.div
            className="absolute inset-0"
            animate={{ y: hovered ? "-15%" : "0%" }}
            transition={{ duration: 4, ease: "easeInOut", repeat: hovered ? Infinity : 0, repeatType: "reverse" }}
          >
            <Image
              src={article.image ?? "/images/hero.png"}
              alt={title}
              fill
              className="object-cover object-center"
              sizes="96px"
            />
          </motion.div>
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold uppercase" style={{ color: "#E31E24" }}>
            {article.category}
          </span>
          <h3 className="text-sm font-bold text-gray-900 leading-snug mt-0.5 mb-1 line-clamp-2 group-hover:text-[#1B6EC2] transition-colors">
            {title}
          </h3>
          <span className="text-xs text-gray-400">{dateStr}</span>
        </div>
      </Link>
    </motion.div>
  )
}

export function NewsSection() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    articlesApi.getPublished().then((data) => setArticles(data.slice(0, 4))).catch(() => {})
  }, [])

  if (articles.length === 0) return null

  const [featured, ...rest] = articles

  const featuredTitle = lang === "fr" ? featured.titleFr : featured.titleEn
  const featuredDate = featured.publishedAt
    ? new Date(featured.publishedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })
    : ""

  return (
    <section id="news" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "#e8f2fc", color: "#1B6EC2" }}
          >
            {t.news.title}
          </span>
          <h2 className="font-serif font-black text-4xl lg:text-5xl text-gray-900">
            {t.news.subtitle}
          </h2>
        </motion.div>

        {/* Layout : grande carte gauche + liste droite */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">

          {/* Grande carte — dernière actualité */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Link href={`/news/${featured.id}`} className="group block relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-900">
              {/* Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                <Image
                  src={featured.image ?? "/images/hero.png"}
                  alt={featuredTitle}
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
                {/* Gradient overlay bas */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.20) 50%, transparent 100%)" }} />
              </div>

              {/* Texte superposé en bas */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: "#E31E24" }}>
                    {featured.category}
                  </span>
                  <span className="text-white/60 text-xs">{featuredDate}</span>
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-white leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
                  {featuredTitle}
                </h3>
              </div>
            </Link>
          </motion.div>

          {/* Liste droite — actualités précédentes */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-2"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {rest.length > 0 ? (
              rest.map((article, i) => (
                <SmallArticleCard key={article.id} article={article} lang={lang} index={i} />
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">
                {lang === "fr" ? "Aucune autre actualité" : "No other articles"}
              </p>
            )}
          </motion.div>
        </div>

        {/* Bouton voir plus */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-[#1B6EC2] hover:text-[#1B6EC2] transition-colors"
          >
            {lang === "fr" ? "Voir plus d'actualités" : "See more news"}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
