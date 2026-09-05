"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { partnersApi, Partner } from "@/lib/api"
import { Handshake } from "lucide-react"

export function PartnersSection() {
  const { lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [partners, setPartners] = useState<Partner[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    partnersApi
      .getPublic()
      .then((data) => setPartners(Array.isArray(data) ? data : []))
      .catch(() => setPartners([]))
      .finally(() => setLoaded(true))
  }, [])

  if (loaded && partners.length === 0) return null

  return (
    <section className="py-16 bg-[var(--sos-blue-light)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "var(--sos-blue-light)", color: "var(--sos-blue)" }}
          >
            <Handshake size={13} />
            {lang === "fr" ? "Nos Partenaires" : "Our Partners"}
          </div>
          <h2 className="font-serif font-black text-3xl lg:text-4xl" style={{ color: "var(--sos-blue)" }}>
            {lang === "fr" ? "Ils nous font confiance" : "They trust us"}
          </h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ background: "var(--sos-red)" }} />
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <PartnerCard partner={partner} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[var(--sos-blue-light)] px-6 py-4">
      {partner.logo ? (
        <div className="relative w-36 h-20">
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            className="object-contain"
            sizes="144px"
          />
        </div>
      ) : (
        <div className="w-36 h-20 flex items-center justify-center">
          <span className="text-sm font-semibold text-[var(--sos-blue)] text-center px-2">
            {partner.name}
          </span>
        </div>
      )}
    </div>
  )
}
