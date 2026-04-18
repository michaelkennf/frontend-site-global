"use client"

import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useParams, notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { isDomainSlug } from "@/lib/domain-slugs"
import { DOMAIN_SLUG_MEDIA_KEY } from "@/lib/domain-assets"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"

function DomainDetailContent() {
  const { t } = useI18n()
  const params = useParams()
  const slugParam = typeof params.slug === "string" ? params.slug : ""
  const mediaKey = isDomainSlug(slugParam) ? DOMAIN_SLUG_MEDIA_KEY[slugParam] : null
  const domainMedia = useSiteMediaKeys(mediaKey ? [mediaKey] : [])
  const heroMedia = mediaKey ? domainMedia[mediaKey] : null

  if (!isDomainSlug(slugParam)) {
    notFound()
  }

  const slug = slugParam
  const dp = t.domainPages
  const page = dp[slug]
  const heroSrc = heroMedia?.url ?? page.heroImage

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-28 pb-12 sm:pt-32 overflow-hidden min-h-[280px]" style={{ background: "var(--sos-blue)" }}>
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
            <div className="relative w-full max-w-2xl h-48 sm:h-64">
              <Image
                src={heroSrc}
                alt=""
                fill
                className="object-contain object-center opacity-90"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/domaines"
              className="inline-flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium mb-6"
            >
              <ChevronLeft size={18} />
              {t.domainPages.indexTitle}
            </Link>
            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-white text-balance">
              {page.title}
            </h1>
            <p className="mt-4 text-white/85 text-lg max-w-2xl">{page.excerpt}</p>
          </div>
        </section>

        <HeroRedDivider />

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            {page.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {page.gallery.map((img) => (
              <div key={img.src} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" />
              </div>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default function DomainDetailPage() {
  return (
    <I18nProvider>
      <DomainDetailContent />
    </I18nProvider>
  )
}
