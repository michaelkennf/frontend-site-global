"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Calendar, MapPin } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"
import { useSiteContent } from "@/hooks/use-site-content"
import { formatPublicationCategoryLabel } from "@/lib/blog-categories"
import { resolveMediaUrl } from "@/lib/media-url"

export function ActivitiesSection() {
  const { t, lang } = useI18n()
  const { c } = useSiteContent("activities", lang)
  const [items, setItems] = useState<Activity[]>([])

  useEffect(() => {
    activitiesApi.getPublic().then(setItems).catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-white" id="activities">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: "var(--sos-red)" }}
            >
              {c("activities.subtitle", t.activities.subtitle)}
            </span>
            <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-[3.35rem] tracking-tight text-balance leading-[1.05] text-gray-900">
              {c("activities.title", t.activities.title)}
            </h2>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.slice(0, 6).map((item, i) => {
            const img = item.image?.trim() ? resolveMediaUrl(item.image) : ""
            const title = lang === "fr" ? item.titleFr : item.titleEn
            const desc = lang === "fr" ? item.descriptionFr : item.descriptionEn
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  {img ? (
                    <Image
                      src={img}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--sos-blue)] to-[var(--sos-blue-dark)]" />
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sos-blue-dark)]">
                    {item.status === "COMPLETED"
                      ? lang === "fr"
                        ? "Terminée"
                        : "Completed"
                      : lang === "fr"
                        ? "En cours"
                        : "Ongoing"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold text-[var(--sos-blue)] mb-2">
                    {formatPublicationCategoryLabel(item.category, lang)}
                  </p>
                  <h3 className="font-serif font-bold text-xl text-gray-900 leading-snug mb-2 line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{desc}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} />
                      {item.date}
                    </span>
                    {item.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
