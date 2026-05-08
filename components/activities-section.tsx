"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { MapPin, Calendar, Clock3, Users, ArrowUpRight, ChevronUp, ChevronDown, ArrowRight } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"

const AUTO_MS = 5500

export function ActivitiesSection() {
  const { t, lang } = useI18n()
  const [activities, setActivities] = useState<Activity[]>([])
  const [currentSide, setCurrentSide] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    activitiesApi.getPublic().then(setActivities).catch(() => {})
  }, [])

  const primary = activities[0]
  const sidePool = useMemo(() => activities.slice(1), [activities])

  const bumpAuto = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (sidePool.length <= 3) return
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrentSide((c) => (c + 1) % sidePool.length)
    }, AUTO_MS)
  }, [sidePool.length])

  useEffect(() => {
    bumpAuto()
    return () => {
      if (intervalRef.current != null) clearInterval(intervalRef.current)
    }
  }, [bumpAuto])

  const next = useCallback(() => {
    if (sidePool.length <= 3) return
    setDirection(1)
    setCurrentSide((c) => (c + 1) % sidePool.length)
    bumpAuto()
  }, [sidePool.length, bumpAuto])

  const prev = useCallback(() => {
    if (sidePool.length <= 3) return
    setDirection(-1)
    setCurrentSide((c) => (c - 1 + sidePool.length) % sidePool.length)
    bumpAuto()
  }, [sidePool.length, bumpAuto])

  const sideItems = useMemo(() => {
    if (sidePool.length <= 3) return sidePool
    return Array.from({ length: 3 }, (_, i) => sidePool[(currentSide + i) % sidePool.length])
  }, [sidePool, currentSide])

  if (!primary) return null

  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-[#f5f7fb]" id="activities">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 md:mb-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
              style={{
                color: "var(--sos-blue)",
              }}
            >
              {t.activities.subtitle}
            </span>
            <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-[3.35rem] tracking-tight text-balance leading-[1.05]">
              <span style={{ color: "#0d3356" }}>
                {lang === "fr" ? "Actualités" : "Recent"}
              </span>{" "}
              <span style={{ color: "var(--sos-red)" }}>
                {lang === "fr" ? "récentes" : "News"}
              </span>
            </h2>
          </div>
          <Link
            href="/news"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start lg:self-auto rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:border-[var(--sos-blue)] hover:text-[var(--sos-blue)] transition-all shadow-sm"
          >
            {t.activities.viewAll}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <Link
            href={`/news/${primary.id}`}
            className="group lg:col-span-8 relative rounded-[20px] overflow-hidden min-h-[360px] md:min-h-[440px] bg-slate-900 shadow-[0_20px_40px_-20px_rgba(13,51,86,0.45)]"
          >
            <Image
              src={primary.image || "/images/hero image.png"}
              alt={lang === "fr" ? primary.titleFr : primary.titleEn}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(9,41,83,0.86)] via-[rgba(12,72,110,0.72)] to-[rgba(9,160,126,0.58)]" />
            <div className="relative z-10 h-full p-6 sm:p-8 md:p-9 flex flex-col justify-between text-white">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sos-blue)] text-white px-3 py-1 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {lang === "fr" ? "À la une" : "Featured"}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  {lang === "fr" ? "Actualité" : "News"}
                </span>
              </div>

              <div>
              <h3 className="font-serif font-black text-3xl md:text-[2.8rem] leading-[1.05] mb-3 max-w-2xl">
                {lang === "fr" ? primary.titleFr : primary.titleEn}
              </h3>
              <p className="text-white/85 text-base md:text-lg max-w-2xl mb-6 line-clamp-2">
                {lang === "fr" ? primary.descriptionFr : primary.descriptionEn}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6 max-w-xl">
                <span className="inline-flex items-center gap-2 text-white/90">
                  <Calendar size={16} />
                  {primary.date}
                </span>
                <span className="inline-flex items-center gap-2 text-white/90">
                  <Clock3 size={16} />
                  {lang === "fr" ? "09:00 - 17:00" : "09:00 - 17:00"}
                </span>
                <span className="inline-flex items-center gap-2 text-white/90">
                  <MapPin size={16} />
                  {primary.location}
                </span>
                <span className="inline-flex items-center gap-2 text-white/90">
                  <Users size={16} />
                  {lang === "fr" ? "250 attendus" : "250 expected"}
                </span>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--sos-red)] text-white px-5 py-2.5 text-sm font-bold w-fit shadow-md group-hover:bg-[var(--sos-red-dark)] transition-colors">
                {lang === "fr" ? "Voir plus" : "See more"}
                <ArrowUpRight size={15} />
              </span>
              </div>
            </div>
          </Link>

          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-2xl text-[#0d3356]">
                {lang === "fr" ? "Plus d'actualités" : "More news"}
              </h4>
              {sidePool.length > 3 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-[var(--sos-blue)] hover:border-[var(--sos-blue)] flex items-center justify-center"
                    aria-label={lang === "fr" ? "Monter" : "Scroll up"}
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-[var(--sos-blue)] hover:border-[var(--sos-blue)] flex items-center justify-center"
                    aria-label={lang === "fr" ? "Descendre" : "Scroll down"}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="relative min-h-[390px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${sideItems.map((i) => i.id).join("-")}-${direction}`}
                  initial={{ opacity: 0, y: direction >= 0 ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction >= 0 ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {sideItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="group block rounded-2xl border border-[#e8edf4] bg-white p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 flex flex-col items-center justify-center shrink-0">
                          <span className="text-sm font-black leading-none">
                            {item.date?.slice(0, 2) || "--"}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider">
                            {item.date?.slice(3, 6) || "N/A"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--sos-blue)] mb-1">
                            {item.status === "ONGOING"
                              ? lang === "fr"
                                ? "En cours"
                                : "Ongoing"
                              : lang === "fr"
                                ? "Terminé"
                                : "Completed"}
                          </p>
                          <h5 className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--sos-red)] transition-colors">
                            {lang === "fr" ? item.titleFr : item.titleEn}
                          </h5>
                          <p className="text-xs text-gray-500 mt-1 inline-flex items-center gap-1">
                            <MapPin size={12} />
                            {item.location}
                          </p>
                        </div>
                        <span className="shrink-0 mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--sos-blue)] group-hover:text-[var(--sos-red)] transition-colors whitespace-nowrap">
                          {lang === "fr" ? "Voir plus" : "See more"}
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {sidePool.length > 3 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.max(1, Math.ceil(sidePool.length / 3)) }).map((_, i) => {
                    const activePage = Math.floor(currentSide / 3)
                    return (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${i === activePage ? "w-6 bg-[var(--sos-blue)]" : "w-2 bg-gray-200"}`}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
