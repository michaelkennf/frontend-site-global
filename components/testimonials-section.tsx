"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { testimonialsApi, Testimonial } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media-url"

const AUTO_MS = 6000

export function TestimonialsSection() {
  const { t, lang } = useI18n()
  const [items, setItems] = useState<Testimonial[]>([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    testimonialsApi
      .getPublic()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true))
  }, [])

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (items.length <= 1) return
    timerRef.current = setInterval(() => {
      setDirection(1)
      setIndex((i) => (i + 1) % items.length)
    }, AUTO_MS)
  }, [items.length])

  useEffect(() => {
    restart()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [restart])

  const go = (dir: number) => {
    if (items.length <= 1) return
    setDirection(dir)
    setIndex((i) => (i + dir + items.length) % items.length)
    restart()
  }

  if (loaded && items.length === 0) return null
  if (!loaded || items.length === 0) return null

  const current = items[index]
  const photo = current.photo?.trim() ? resolveMediaUrl(current.photo) : ""

  return (
    <section id="testimonials" className="relative py-20 md:py-24 overflow-hidden bg-[var(--sos-blue)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 0, transparent 45%), radial-gradient(circle at 80% 70%, white 0, transparent 40%)",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 mb-3">
            <Quote size={14} />
            {lang === "fr" ? "Témoignages" : "Testimonials"}
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-white text-balance">
            {t.stories.title}
          </h2>
          <p className="mt-3 text-white/75 text-base md:text-lg max-w-2xl mx-auto">
            {t.stories.subtitle}
          </p>
        </motion.div>

        <div className="relative min-h-[280px] md:min-h-[260px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 48 : -48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -48 : 48 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl px-6 py-8 md:px-10 md:py-10 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <div className="shrink-0 mx-auto md:mx-0">
                  {photo ? (
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-[var(--sos-blue-light)]">
                      <Image src={photo} alt={current.name} fill className="object-cover" sizes="112px" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[var(--sos-blue-light)] flex items-center justify-center text-[var(--sos-blue)] font-black text-2xl">
                      {current.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 text-center md:text-left">
                  <Quote className="w-8 h-8 text-[var(--sos-red)]/40 mb-3 mx-auto md:mx-0" />
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-5">
                    “{current.quote}”
                  </p>
                  <p className="font-serif font-bold text-xl text-[var(--sos-blue)]">{current.name}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/15 flex items-center justify-center transition"
              aria-label={lang === "fr" ? "Précédent" : "Previous"}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setDirection(i > index ? 1 : -1)
                    setIndex(i)
                    restart()
                  }}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-white" : "w-2 bg-white/40"}`}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/15 flex items-center justify-center transition"
              aria-label={lang === "fr" ? "Suivant" : "Next"}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
