"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useI18n, translations } from "@/lib/i18n"
import { CheckCircle2, ArrowRight } from "lucide-react"
import type { DomainSlug } from "@/lib/domain-slugs"
import type { SiteMedia } from "@/lib/api"
import {
  DOMAIN_DISPLAY_ORDER,
  DOMAIN_ILLUSTRATION,
  DOMAIN_SLUG_MEDIA_KEY,
  resolveDomainIllustrationUrl,
} from "@/lib/domain-assets"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"

type AreasBlock = typeof translations.fr.areas

function areaContentForSlug(slug: DomainSlug, areas: AreasBlock) {
  switch (slug) {
    case "risques-catastrophes":
      return {
        title: areas.area1Title,
        desc: areas.area1Desc,
        items: areas.area1Items,
      }
    case "urgences-sanitaires":
      return {
        title: areas.area2Title,
        desc: areas.area2Desc,
        items: areas.area2Items,
      }
    case "justice-climatique":
      return {
        title: areas.area3Title,
        desc: areas.area3Desc,
        items: areas.area3Items,
      }
  }
}

const checklistColor: Record<DomainSlug, string> = {
  "risques-catastrophes": "var(--sos-blue)",
  "justice-climatique": "#16a34a",
  "urgences-sanitaires": "var(--sos-red)",
}

/** next/image fill + padding sur la même balise peut casser l’affichage ; repli si URL API invalide. */
function DomainIllustrationFigure({
  slug,
  media,
  alt,
}: {
  slug: DomainSlug
  media: SiteMedia | null | undefined
  alt: string
}) {
  const primary = resolveDomainIllustrationUrl(slug, media)
  const fallbackStatic = DOMAIN_ILLUSTRATION[slug]
  const emergency = "/images/hero.png"
  const [src, setSrc] = useState(primary)

  useEffect(() => {
    setSrc(primary)
  }, [primary])

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-contain object-center"
      onError={() => {
        setSrc((prev) => (prev !== fallbackStatic ? fallbackStatic : emergency))
      }}
    />
  )
}

export function AreasSection() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const domainKeys = DOMAIN_DISPLAY_ORDER.map((s) => DOMAIN_SLUG_MEDIA_KEY[s])
  const domainMedia = useSiteMediaKeys(domainKeys)

  return (
    <section id="work" className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 md:mb-24 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "var(--sos-blue-light)", color: "var(--sos-blue)" }}
          >
            {t.areas.subtitle}
          </span>
          <h2 className="font-serif font-black text-4xl lg:text-5xl text-gray-900 text-balance">
            {t.areas.title}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-20 md:gap-28">
          {DOMAIN_DISPLAY_ORDER.map((slug, i) => {
            const area = areaContentForSlug(slug, t.areas)
            const mkey = DOMAIN_SLUG_MEDIA_KEY[slug]
            const m = domainMedia[mkey]
            const alt =
              (lang === "fr" ? m?.altFr : m?.altEn)?.trim() || area.title
            const accent = checklistColor[slug]
            const imageOnLeft = i % 2 === 0

            const imageBlock = (
              <motion.div
                className="relative w-full min-h-[240px] aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 shadow-xl shadow-gray-900/10 ring-1 ring-black/5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.55 }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                  <div className="relative h-full w-full min-h-[200px]">
                    <DomainIllustrationFigure slug={slug} media={m} alt={alt} />
                  </div>
                </div>
              </motion.div>
            )

            const textBlock = (
              <motion.div
                className="flex flex-col justify-center text-left"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.55 }}
              >
                <span
                  className="text-xs font-black uppercase tracking-[0.2em] mb-4"
                  style={{ color: accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight mb-5 text-pretty">
                  {area.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                  {area.desc}
                </p>
                <ul className="space-y-3.5 mb-10 max-w-xl">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-700 text-base leading-snug">
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0" style={{ color: accent }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/domaines/${slug}`}
                  className="inline-flex items-center gap-2 text-base font-bold transition-colors hover:gap-3 w-fit"
                  style={{ color: "var(--sos-red)" }}
                >
                  {t.domainPages.discover}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            )

            return (
              <div
                key={slug}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center"
              >
                {imageOnLeft ? (
                  <>
                    <div className="min-w-0">{imageBlock}</div>
                    <div className="min-w-0">{textBlock}</div>
                  </>
                ) : (
                  <>
                    <div className="min-w-0 order-1 lg:order-1">{textBlock}</div>
                    <div className="min-w-0 order-2 lg:order-2">{imageBlock}</div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
