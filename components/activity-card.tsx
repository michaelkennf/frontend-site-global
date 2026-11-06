"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"
import type { Activity } from "@/lib/api"
import type { Language } from "@/lib/i18n"
import { formatPublicationCategoryLabel } from "@/lib/blog-categories"
import { resolveMediaUrl } from "@/lib/media-url"

export function ActivityCard({
  item,
  lang,
  index = 0,
}: {
  item: Activity
  lang: Language
  index?: number
}) {
  const img = item.image?.trim() ? resolveMediaUrl(item.image) : ""
  const title = lang === "fr" ? item.titleFr : item.titleEn
  const desc = lang === "fr" ? item.descriptionFr : item.descriptionEn
  const statusLabel =
    item.status === "COMPLETED"
      ? lang === "fr"
        ? "Terminée"
        : "Completed"
      : lang === "fr"
        ? "En cours"
        : "Ongoing"

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.45 }}
    >
      <Link
        href={`/activities/${item.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-lg transition-all"
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
          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
              item.status === "COMPLETED"
                ? "bg-gray-900/85 text-white"
                : "bg-white/95 text-[var(--sos-blue-dark)]"
            }`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold text-[var(--sos-blue)] mb-2">
            {formatPublicationCategoryLabel(item.category, lang)}
          </p>
          <h3 className="font-serif font-bold text-xl text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[var(--sos-red)] transition-colors">
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
      </Link>
    </motion.article>
  )
}
