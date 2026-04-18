"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { MapPin, Calendar, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"

const AUTO_MS = 6500

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
}

const textVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 32 : -32,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir < 0 ? 32 : -32,
    opacity: 0,
  }),
}

export function ActivitiesSection() {
  const { t, lang } = useI18n()
  const [activities, setActivities] = useState<Activity[]>([])
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    activitiesApi.getPublic().then(setActivities).catch(() => {})
  }, [])

  const bumpAuto = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (activities.length <= 1) return
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrent((c) => (c + 1) % activities.length)
    }, AUTO_MS)
  }, [activities.length])

  useEffect(() => {
    bumpAuto()
    return () => {
      if (intervalRef.current != null) clearInterval(intervalRef.current)
    }
  }, [bumpAuto])

  const goTo = useCallback(
    (index: number) => {
      if (activities.length === 0) return
      const len = activities.length
      const normalized = ((index % len) + len) % len
      if (normalized === current) return
      setDirection(normalized > current ? 1 : -1)
      setCurrent(normalized)
      bumpAuto()
    },
    [activities.length, current, bumpAuto],
  )

  const next = useCallback(() => {
    if (activities.length === 0) return
    setDirection(1)
    setCurrent((c) => (c + 1) % activities.length)
    bumpAuto()
  }, [activities.length, bumpAuto])

  const prev = useCallback(() => {
    if (activities.length === 0) return
    setDirection(-1)
    setCurrent((c) => (c - 1 + activities.length) % activities.length)
    bumpAuto()
  }, [activities.length, bumpAuto])

  if (activities.length === 0) return null

  const activity = activities[current]
  const title = lang === "fr" ? activity.titleFr : activity.titleEn
  const description = lang === "fr" ? activity.descriptionFr : activity.descriptionEn
  const ongoing =
    lang === "fr"
      ? activity.status === "ONGOING"
        ? "En cours"
        : "Terminé"
      : activity.status === "ONGOING"
        ? "Ongoing"
        : "Completed"

  const multiple = activities.length > 1

  return (
    <section
      className="relative py-24 md:py-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white"
      id="activities"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--sos-blue)]/25 to-transparent"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 md:mb-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-5"
              style={{
                background: "linear-gradient(135deg, rgba(0,87,184,0.12), rgba(0,87,184,0.05))",
                color: "var(--sos-blue)",
              }}
            >
              {t.activities.subtitle}
            </span>
            <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-[3.25rem] text-gray-900 tracking-tight text-balance leading-[1.1]">
              {t.activities.title}
            </h2>
          </div>
          <Link
            href="/news"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start lg:self-auto rounded-full bg-[var(--sos-red)] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-red-900/20 transition-all hover:bg-[var(--sos-red-dark)] hover:gap-3 hover:shadow-lg"
          >
            {t.activities.viewAll}
            <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Panorama : couverture pleine largeur, sans cadre ni marge décorative */}
        <div className="relative">
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-neutral-200 aspect-[16/10] sm:aspect-[2/1] md:aspect-[2.2/1] md:min-h-[280px] md:max-h-[min(52vh,440px)]"
            role="region"
            aria-roledescription={lang === "fr" ? "carrousel" : "carousel"}
            aria-label={t.activities.title}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activity.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.55 }}
                className="absolute inset-0"
              >
                <Link
                  href={`/news/${activity.id}`}
                  className="relative block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-2xl"
                >
                  <Image
                    src={activity.image || "/images/hero.png"}
                    alt={title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1280px) 100vw, 1152px"
                    priority={current === 0}
                    loading={current === 0 ? "eager" : "lazy"}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none"
                    aria-hidden
                  />
                  <div className="absolute left-4 top-4 sm:left-5 sm:top-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm ${
                        activity.status === "ONGOING" ? "bg-emerald-600/95" : "bg-gray-900/85"
                      }`}
                    >
                      {ongoing}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Calendar size={14} />
                      {activity.date}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {multiple && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white md:left-4"
                  aria-label={lang === "fr" ? "Actualité précédente" : "Previous story"}
                >
                  <ChevronLeft size={22} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white md:right-4"
                  aria-label={lang === "fr" ? "Actualité suivante" : "Next story"}
                >
                  <ChevronRight size={22} strokeWidth={2} />
                </button>
              </>
            )}
          </div>

          {multiple && (
            <div
              className="mt-4 flex justify-center gap-2"
              role="tablist"
              aria-label={lang === "fr" ? "Sélection d’actualités" : "News selection"}
            >
              {activities.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={
                    lang === "fr" ? `Afficher l’actualité ${i + 1}` : `Show story ${i + 1}`
                  }
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-10 bg-[var(--sos-red)]" : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Texte qui défile en même temps que la couverture */}
        <div className="mt-8 md:mt-10 max-w-4xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activity.id}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.42 }}
              className="space-y-4"
              aria-live="polite"
            >
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-gray-900 leading-snug text-pretty">
                {title}
              </h3>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed text-pretty">
                {description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={18} className="shrink-0 text-[var(--sos-red)]" />
                  {activity.location}
                </span>
                <Link
                  href={`/news/${activity.id}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--sos-red)] transition hover:gap-3"
                >
                  {t.news.readMore}
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
