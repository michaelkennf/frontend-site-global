"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { siteMediaApi, type SiteMedia } from "@/lib/api"
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Eye,
  Scale,
  HeartHandshake,
  Users,
  ShieldCheck,
  Heart,
  ArrowRight,
} from "lucide-react"

const FALLBACK_CAROUSEL = [
  { id: "f1", src: "/images/carousel-children.jpg", altFr: "Enfants qui jouent", altEn: "Children playing" },
  { id: "f2", src: "/images/carousel-sister.jpg", altFr: "Fille portant sa sœur", altEn: "Girl carrying her sister" },
  { id: "f3", src: "/images/carousel-farming.jpg", altFr: "Femmes en agriculture", altEn: "Women farming" },
  { id: "f4", src: "/images/hero.png", altFr: "Terrain humanitaire", altEn: "Field work" },
]

export const valueIcons = [
  { icon: Scale, color: "var(--sos-blue)", bg: "var(--sos-blue-light)", label: "Équité / Equity" },
  { icon: HeartHandshake, color: "var(--sos-red)", bg: "var(--sos-red-light)", label: "Respect" },
  { icon: Users, color: "var(--sos-blue)", bg: "var(--sos-blue-light)", label: "Solidarité / Solidarity" },
  { icon: Eye, color: "var(--sos-red)", bg: "var(--sos-red-light)", label: "Transparence / Transparency" },
  { icon: ShieldCheck, color: "var(--sos-blue)", bg: "var(--sos-blue-light)", label: "Confidentialité / Confidentiality" },
  { icon: Heart, color: "var(--sos-red)", bg: "var(--sos-red-light)", label: "Empathie / Empathy" },
]

export function AboutSection() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [carouselImages, setCarouselImages] = useState<
    { id: string; src: string; altFr: string; altEn: string }[]
  >(FALLBACK_CAROUSEL)

  useEffect(() => {
    siteMediaApi
      .getBySection("about-carousel")
      .then((items: SiteMedia[]) => {
        if (items && items.length > 0) {
          setCarouselImages(items.map((m) => ({ id: m.id, src: m.url, altFr: m.altFr, altEn: m.altEn })))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [carouselImages.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  }

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-white"
      ref={ref}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,87,184,0.12), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(227,30,36,0.06), transparent)",
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bloc identité — Qui sommes-nous */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] mb-5 rounded-full px-5 py-2.5 shadow-sm"
            style={{
              color: "var(--sos-blue)",
              background: "linear-gradient(135deg, rgba(0,87,184,0.14), rgba(0,87,184,0.06))",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <span className="h-px w-6 sm:w-8 rounded-full bg-[var(--sos-blue)]/35" aria-hidden />
            <span className="relative">{t.about.homeAboutEyebrow}</span>
            <span className="h-px w-6 sm:w-8 rounded-full bg-[var(--sos-blue)]/35" aria-hidden />
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif font-black text-3xl sm:text-4xl md:text-[2.75rem] tracking-tight text-balance leading-[1.15] mb-6 px-3 py-2 rounded-2xl inline-block"
            style={{
              color: "var(--sos-blue)",
              background: "linear-gradient(180deg, rgba(0,87,184,0.12) 0%, rgba(0,87,184,0.04) 100%)",
            }}
          >
            {t.about.whoWeAreTitle}
          </motion.h2>
          <motion.div variants={fadeUp} className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed text-pretty">
            {t.about.whoWeAreParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full border border-transparent bg-[var(--sos-red)] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-red-900/15 transition-all hover:bg-[var(--sos-red-dark)] hover:gap-3 hover:shadow-lg"
            >
              {t.hero.learnMore}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 lg:items-stretch">
          {/* Carousel */}
          <motion.div
            className="lg:col-span-7 flex flex-col"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-gray-900/10 ring-1 ring-black/5 aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={carouselImages[currentSlide].src}
                    alt={
                      lang === "fr"
                        ? carouselImages[currentSlide].altFr
                        : carouselImages[currentSlide].altEn
                    }
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,30,70,0.45) 0%, transparent 45%), linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 35%)",
                }}
              />
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {carouselImages.map((_img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/45 hover:bg-white/70"}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <div
                className="absolute bottom-5 left-5 z-10 rounded-2xl px-5 py-4 shadow-lg ring-1 max-[380px]:hidden backdrop-blur-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(227,30,36,0.12), rgba(255,255,255,0.92))",
                  borderColor: "rgba(227,30,36,0.15)",
                  boxShadow: "0 10px 40px -10px rgba(227,30,36,0.25)",
                }}
              >
                <div className="text-3xl font-black font-serif leading-none" style={{ color: "var(--sos-red)" }}>
                  15+
                </div>
                <div className="text-xs font-bold mt-1.5" style={{ color: "var(--sos-red)" }}>
                  {lang === "fr" ? "Années d'engagement" : "Years of commitment"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission & vision — occupe la hauteur du carrousel (zone laissée par la suppression des valeurs) */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between gap-6 lg:gap-8 lg:h-full lg:min-h-0"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            {[
              {
                Icon: Target,
                label: t.about.mission,
                text: t.about.missionText,
                border: "var(--sos-blue)",
                bg: "rgba(0, 87, 184, 0.06)",
              },
              {
                Icon: Eye,
                label: t.about.vision,
                text: t.about.visionText,
                border: "var(--sos-red)",
                bg: "rgba(227, 30, 36, 0.06)",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-6 sm:p-7 lg:p-8 shadow-sm ring-1 ring-black/5 min-h-0"
                style={{ borderLeftWidth: "4px", borderLeftColor: item.border }}
              >
                <div className="flex gap-4 sm:gap-5 flex-1">
                  <div
                    className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: item.bg }}
                  >
                    <item.Icon size={24} style={{ color: item.border }} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center flex-1">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-[0.12em] mb-3">
                      {item.label}
                    </h3>
                    <p className="text-gray-600 text-base sm:text-[1.05rem] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
