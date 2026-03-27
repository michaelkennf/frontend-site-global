"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, MapPin, Calendar } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"

function ActivityContent() {
  const { lang } = useI18n()
  const params = useParams()
  const [item, setItem] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      activitiesApi.getOnePublic(params.id as string)
        .then(setItem)
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

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-xl font-bold mb-4">{lang === "fr" ? "Actualité introuvable" : "Not found"}</p>
            <Link href="/news" className="text-[var(--sos-blue)] hover:underline">← {lang === "fr" ? "Retour aux actualités" : "Back"}</Link>
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
        <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: "#0a1e46" }}>
          <div className="absolute inset-0">
            <Image
              src={item.image || "/images/hero.png"}
              alt=""
              fill
              className="object-cover object-center opacity-25"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={16} />
              {lang === "fr" ? "Retour aux actualités" : "Back to news"}
            </Link>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-4 ${item.status === "ONGOING" ? "bg-green-500" : "bg-gray-500"}`}>
              {lang === "fr" ? (item.status === "ONGOING" ? "En cours" : "Terminé") : (item.status === "ONGOING" ? "Ongoing" : "Completed")}
            </span>
            <motion.h1
              className="font-serif font-black text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {lang === "fr" ? item.titleFr : item.titleEn}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <span className="inline-flex items-center gap-1"><MapPin size={14} />{item.location}</span>
              <span className="inline-flex items-center gap-1"><Calendar size={14} />{item.date}</span>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

