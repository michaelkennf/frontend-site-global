"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowRight, Heart } from "lucide-react"

export function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh" }}>
      {/* Background image — couvre toute la section, centré, visible en entier */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero.png"
          alt="Global SOS humanitarian work"
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
        {/* Overlay mobile : fond sombre uniforme pour lisibilité */}
        <div
          className="absolute inset-0 sm:hidden"
          style={{ background: "rgba(10,30,70,0.65)" }}
        />
        {/* Overlay desktop : dégradé gauche→droite, laisse voir l'image à droite */}
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(to right, rgba(10,30,70,0.88) 0%, rgba(10,30,70,0.55) 45%, rgba(10,30,70,0.10) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-28 sm:pt-32 sm:pb-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20 mb-6"
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#E31E24" }}
            />
            Organisation Humanitaire • Humanitarian NGO
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight text-white text-balance mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {t.hero.headline}
          </motion.h1>

          {/* Sub text */}
          <motion.p
            className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            {t.hero.sub}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1B6EC2] hover:bg-blue-50 font-bold px-8 py-4 rounded-full text-base transition-all hover:shadow-lg hover:scale-105 group"
            >
              {t.hero.learnMore}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#b8171c] text-white font-bold px-8 py-4 rounded-full text-base transition-all hover:shadow-lg hover:scale-105 group"
            >
              <Heart size={18} className="group-hover:scale-110 transition-transform" />
              {t.hero.donate}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
