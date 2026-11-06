"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { activitiesApi, Activity } from "@/lib/api"
import { useSiteContent } from "@/hooks/use-site-content"
import { ActivityCard } from "@/components/activity-card"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | "ONGOING" | "COMPLETED"
const HOME_LIMIT = 6

export function ActivitiesSection() {
  const { t, lang } = useI18n()
  const { c } = useSiteContent("activities", lang)
  const [items, setItems] = useState<Activity[]>([])
  const [filter, setFilter] = useState<StatusFilter>("all")

  useEffect(() => {
    activitiesApi.getPublic().then(setItems).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    if (filter === "all") return items
    return items.filter((a) => a.status === filter)
  }, [items, filter])

  const visible = filtered.slice(0, HOME_LIMIT)

  if (items.length === 0) return null

  const filters: { id: StatusFilter; label: string }[] = [
    { id: "all", label: lang === "fr" ? "Toutes" : "All" },
    { id: "ONGOING", label: lang === "fr" ? "En cours" : "Ongoing" },
    { id: "COMPLETED", label: lang === "fr" ? "Terminées" : "Completed" },
  ]

  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-white" id="activities">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8"
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
          <Link
            href="/activities"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start lg:self-auto rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:border-[var(--sos-blue)] hover:text-[var(--sos-blue)] transition-all shadow-sm"
          >
            {c("activities.viewAll", t.activities.viewAll)}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-colors border",
                filter === f.id
                  ? "bg-[var(--sos-blue)] text-white border-[var(--sos-blue)]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[var(--sos-blue)] hover:text-[var(--sos-blue)]",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            {lang === "fr" ? "Aucune activité dans cette catégorie." : "No activities in this category."}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visible.map((item, i) => (
              <ActivityCard key={item.id} item={item} lang={lang} index={i} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href={
              filter === "all"
                ? "/activities"
                : `/activities?status=${filter === "ONGOING" ? "ongoing" : "completed"}`
            }
            className="inline-flex items-center gap-2 rounded-full bg-[var(--sos-red)] hover:bg-[var(--sos-red-dark)] text-white font-bold px-6 py-3 text-sm transition-colors shadow-md"
          >
            {lang === "fr" ? "Voir plus" : "See more"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
