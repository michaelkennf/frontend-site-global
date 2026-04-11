"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { partnersApi, Partner } from "@/lib/api"
import { Handshake } from "lucide-react"

const FALLBACK_PARTNERS: Partner[] = [
  {
    id: "yarh-drc",
    name: "YARH DRC",
    logo: "/images/partners/yarh-drc.png",
    website: "https://yarhdrc.org",
    description: "Youth Alliance for Reproductive Health",
    order: 0,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
]

export function PartnersSection() {
  const { lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS)

  useEffect(() => {
    partnersApi.getPublic()
      .then((data) => { if (data.length > 0) setPartners(data) })
      .catch(() => {})
  }, [])

  return (
    <section className="py-16" style={{ background: "#0a1e46" }} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(255,255,255,0.10)", color: "#a8c4e8" }}>
            <Handshake size={13} />
            {lang === "fr" ? "Nos Partenaires" : "Our Partners"}
          </div>
          <h2 className="font-serif font-black text-3xl lg:text-4xl text-white">
            {lang === "fr" ? "Ils nous font confiance" : "They trust us"}
          </h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ background: "#E31E24" }} />
        </motion.div>

        {/* Logos grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {partner.website ? (
                <Link
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.name}
                  className="block group"
                >
                  <PartnerCard partner={partner} />
                </Link>
              ) : (
                <div title={partner.name}>
                  <PartnerCard partner={partner} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      {partner.logo ? (
        <div className="relative w-40 h-24">
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="160px"
            style={{ mixBlendMode: "screen" }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <Handshake size={36} className="text-white/70" />
          <span className="text-sm font-bold text-white/80">{partner.name}</span>
        </div>
      )}
    </div>
  )
}
