"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Loader2, CalendarDays } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"
import { ActivityCard } from "@/components/activity-card"
import { useSiteContent } from "@/hooks/use-site-content"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | "ONGOING" | "COMPLETED"

function parseStatusParam(value: string | null): StatusFilter {
  if (value === "ongoing" || value === "ONGOING") return "ONGOING"
  if (value === "completed" || value === "COMPLETED") return "COMPLETED"
  return "all"
}

function ActivitiesContent() {
  const { t, lang } = useI18n()
  const { c } = useSiteContent("activities", lang)
  const searchParams = useSearchParams()
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>(() =>
    parseStatusParam(searchParams.get("status")),
  )

  useEffect(() => {
    setFilter(parseStatusParam(searchParams.get("status")))
  }, [searchParams])

  useEffect(() => {
    activitiesApi
      .getPublic()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (filter === "all") return items
    return items.filter((a) => a.status === filter)
  }, [items, filter])

  const filters: { id: StatusFilter; label: string }[] = [
    { id: "all", label: lang === "fr" ? "Toutes" : "All" },
    { id: "ONGOING", label: lang === "fr" ? "En cours" : "Ongoing" },
    { id: "COMPLETED", label: lang === "fr" ? "Terminées" : "Completed" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-28 pb-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sos-blue)] mb-4">
                <CalendarDays size={14} />
                {c("activities.subtitle", t.activities.subtitle)}
              </span>
              <h1 className="font-serif font-black text-4xl md:text-5xl text-gray-900 mb-4">
                {c("activities.title", t.activities.title)}
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {lang === "fr"
                  ? "Retrouvez toutes nos actions sur le terrain, en cours ou déjà menées à terme."
                  : "Browse all our field actions, ongoing or already completed."}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 bg-white sticky top-20 z-30 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFilter(f.id)
                    const url =
                      f.id === "all"
                        ? "/activities"
                        : `/activities?status=${f.id === "ONGOING" ? "ongoing" : "completed"}`
                    window.history.replaceState(null, "", url)
                  }}
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
          </div>
        </section>

        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-500 py-24">
                {lang === "fr"
                  ? "Aucune activité pour ce filtre."
                  : "No activities for this filter."}
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filtered.map((item, i) => (
                  <ActivityCard key={item.id} item={item} lang={lang} index={i} />
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

export default function ActivitiesPage() {
  return (
    <I18nProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        }
      >
        <ActivitiesContent />
      </Suspense>
    </I18nProvider>
  )
}
