"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Heart, HandHeart } from "lucide-react"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { SITE_MEDIA } from "@/lib/site-media-keys"

export function DonateSection() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const donateBg = useSiteMediaKeys([SITE_MEDIA.DONATE_HERO_BG])[SITE_MEDIA.DONATE_HERO_BG]
  const bgSrc = donateBg?.url ?? "/images/hero image.png"
  const bgAlt =
    (lang === "fr" ? donateBg?.altFr : donateBg?.altEn)?.trim() ||
    (lang === "fr" ? "Action humanitaire" : "Humanitarian action")

  const amounts = [10, 25, 50, 100]

  return (
    <section id="donate" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100">
          {/* Image de fond — côté gauche uniquement sur desktop */}
          <div className="absolute inset-y-0 left-0 w-1/2 hidden lg:block">
            <Image
              src={bgSrc}
              alt={bgAlt}
              fill
              className="object-cover object-center"
              sizes="50vw"
            />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 border border-gray-200 rounded-2xl px-6 py-4">
                <div className="text-[var(--sos-blue)] font-black text-xl font-serif leading-snug">
                  {lang === "fr" ? "Ensemble nous pouvons changer des vies" : "Together we can change lives"}
                </div>
                <div className="text-gray-600 mt-1 text-sm">Global SOS ASBL • Bukavu, RDC</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Espace gauche (vide sur desktop — l'image est en position absolue derrière) */}
            <div className="hidden lg:block" />

            {/* Right: Content */}
            <motion.div
              className="p-10 lg:p-16 flex flex-col justify-center bg-white"
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 w-fit"
                style={{ background: "var(--sos-red-light)", color: "var(--sos-red)" }}
              >
                <Heart size={12} />
                {lang === "fr" ? "Faire un don" : "Donate"}
              </div>

              <h2 className="font-serif font-black text-4xl lg:text-5xl text-gray-900 leading-tight mb-4 text-balance">
                {t.donate.title}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {t.donate.subtitle}
              </p>

              {/* Amount buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-sm hover:border-[var(--sos-red)] hover:bg-[var(--sos-red)] hover:text-white transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
                <button className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 font-bold text-sm hover:border-gray-400 hover:text-gray-800 transition-colors">
                  {lang === "fr" ? "Autre" : "Other"}
                </button>
              </div>

              <Link
                href="/donate"
                className="inline-flex items-center justify-center gap-2 bg-[var(--sos-red)] hover:bg-[var(--sos-red-dark)] text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:scale-[1.02] w-fit"
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

