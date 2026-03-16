"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Heart, HandHeart } from "lucide-react"

export function DonateSection() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const amounts = [10, 25, 50, 100]

  return (
    <section id="donate" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: "#0a1e46" }}>
          {/* Image de fond — côté gauche uniquement sur desktop */}
          <div className="absolute inset-y-0 left-0 w-1/2 hidden lg:block">
            <Image
              src="/images/donate-bg.png"
              alt="Humanitarian action"
              fill
              className="object-cover object-center"
              sizes="50vw"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,30,70,0.30) 0%, rgba(10,30,70,0.55) 100%)" }} />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                <div className="text-white font-black text-xl font-serif leading-snug">
                  {lang === "fr" ? "Ensemble nous pouvons changer des vies" : "Together we can change lives"}
                </div>
                <div className="text-white/70 mt-1 text-sm">Global SOS ASBL • Bukavu, RDC</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Espace gauche (vide sur desktop — l'image est en position absolue derrière) */}
            <div className="hidden lg:block" />

            {/* Right: Content */}
            <motion.div
              className="p-10 lg:p-16 flex flex-col justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 w-fit"
                style={{ background: "rgba(227,30,36,0.2)", color: "#ff6b6b" }}
              >
                <Heart size={12} />
                {lang === "fr" ? "Faire un don" : "Donate"}
              </div>

              <h2 className="font-serif font-black text-4xl lg:text-5xl text-white leading-tight mb-4 text-balance">
                {t.donate.title}
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                {t.donate.subtitle}
              </p>

              {/* Amount buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    className="px-5 py-2.5 rounded-full border border-white/30 text-white font-bold text-sm hover:border-[#E31E24] hover:bg-[#E31E24] transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
                <button className="px-5 py-2.5 rounded-full border border-white/30 text-white/70 font-bold text-sm hover:border-white/60 hover:text-white transition-colors">
                  {lang === "fr" ? "Autre" : "Other"}
                </button>
              </div>

              <Link
                href="/donate"
                className="inline-flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#b8171c] text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-red-500/30 hover:scale-105 w-fit"
              >
                <HandHeart size={20} />
                {t.donate.button}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

