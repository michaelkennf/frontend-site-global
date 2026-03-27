"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
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
} from "lucide-react"

const carouselImages = [
  { src: "/images/hero.png", alt: "Global SOS field work" },
  { src: "/images/carousel-children.jpg", alt: "Children playing" },
  { src: "/images/carousel-sister.jpg", alt: "Girl carrying sister" },
  { src: "/images/carousel-farming.jpg", alt: "Women farming" },
]

// Icon per value — order matches valuesList in i18n
export const valueIcons = [
  { icon: Scale,          color: "#0057B8", bg: "#E6EFF9", label: "Équité / Equity" },
  { icon: HeartHandshake, color: "#E31E24", bg: "#fdeaea", label: "Respect" },
  { icon: Users,          color: "#0057B8", bg: "#E6EFF9", label: "Solidarité / Solidarity" },
  { icon: Eye,            color: "#E31E24", bg: "#fdeaea", label: "Transparence / Transparency" },
  { icon: ShieldCheck,    color: "#0057B8", bg: "#E6EFF9", label: "Confidentialité / Confidentiality" },
  { icon: Heart,          color: "#E31E24", bg: "#fdeaea", label: "Empathie / Empathy" },
]

export function AboutSection() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="about" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Carousel ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={carouselImages[currentSlide].src}
                    alt={carouselImages[currentSlide].alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(27,110,194,0.25))" }} />
              <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all" aria-label="Previous">
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all" aria-label="Next">
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? "bg-white scale-110" : "bg-white/50"}`} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#E31E24] text-white p-6 rounded-xl shadow-lg max-w-[200px]">
              <div className="text-3xl font-black font-serif">15+</div>
              <div className="text-sm mt-1 text-white/90">{lang === "fr" ? "Ans d'expérience" : "Years of experience"}</div>
            </div>
          </motion.div>

          {/* ── Content ── */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="lg:pt-2"
          >
            {/* Label */}
            <motion.span
              variants={itemVariants}
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E6EFF9", color: "#0057B8" }}
            >
              {t.about.title}
            </motion.span>

            {/* Tagline — short, impactful */}
            <motion.p variants={itemVariants} className="text-gray-600 leading-relaxed mb-8 text-base">
              {t.about.description}
            </motion.p>

            {/* Mission & Vision — icon cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  Icon: Target,
                  label: t.about.mission,
                  text: t.about.missionText,
                  accent: "#0057B8",
                  bg: "#E6EFF9",
                },
                {
                  Icon: Eye,
                  label: t.about.vision,
                  text: t.about.visionText,
                  accent: "#E31E24",
                  bg: "#fdeaea",
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  className="p-5 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col gap-3"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                    <item.Icon size={22} style={{ color: item.accent }} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide mb-1.5" style={{ color: item.accent }}>
                      {item.label}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Values — icon grid */}
            <motion.div variants={itemVariants}>
              <div className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">{t.about.values}</div>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                {t.about.valuesList.map((v, i) => {
                  const vi = valueIcons[i] ?? valueIcons[0]
                  const Icon = vi.icon
                  return (
                    <div
                      key={v}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: vi.bg }}>
                        <Icon size={18} style={{ color: vi.color }} strokeWidth={2} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{v}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

