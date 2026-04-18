"use client"

import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { DOMAIN_DISPLAY_ORDER, DOMAIN_SLUG_MEDIA_KEY } from "@/lib/domain-assets"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"

function DomainesContent() {
  const { t } = useI18n()
  const dp = t.domainPages
  const domainKeys = DOMAIN_DISPLAY_ORDER.map((s) => DOMAIN_SLUG_MEDIA_KEY[s])
  const domainMedia = useSiteMediaKeys(domainKeys)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: "var(--sos-blue)" }}>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-black text-4xl lg:text-5xl text-white text-balance mb-4">
              {dp.indexTitle}
            </h1>
            <p className="text-white/85 text-lg">{dp.indexSubtitle}</p>
          </div>
        </section>

        <HeroRedDivider />

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
            {DOMAIN_DISPLAY_ORDER.map((slug, i) => {
              const block = dp[slug]
              return (
                <motion.article
                  key={slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
                >
                  <Link href={`/domaines/${slug}`} className="relative aspect-[4/3] block bg-gray-50">
                    <Image
                      src={domainMedia[DOMAIN_SLUG_MEDIA_KEY[slug]]?.url ?? block.heroImage}
                      alt=""
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-serif font-bold text-xl text-gray-900 mb-2">{block.title}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{block.excerpt}</p>
                    <Link
                      href={`/domaines/${slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-sm"
                      style={{ color: "var(--sos-red)" }}
                    >
                      {dp.discover}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function DomainesPage() {
  return (
    <I18nProvider>
      <DomainesContent />
    </I18nProvider>
  )
}
