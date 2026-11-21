"use client"

import { useEffect, useMemo, useState } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { siteMediaApi, videosApi, SiteMedia, SiteVideo } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media-url"
import { parseYoutubeId, youtubeEmbedUrl } from "@/lib/youtube"
import { cn } from "@/lib/utils"
import { Images, Play, Loader2, X, Film } from "lucide-react"

type GalleryFilter = "all" | "images" | "videos"

type GalleryItem =
  | { kind: "image"; id: string; src: string; title: string; section: string }
  | { kind: "video"; id: string; youtubeUrl: string; title: string }

function GalleryContent() {
  const { lang } = useI18n()
  const [filter, setFilter] = useState<GalleryFilter>("all")
  const [images, setImages] = useState<SiteMedia[]>([])
  const [videos, setVideos] = useState<SiteVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    Promise.all([siteMediaApi.getAllPublic(), videosApi.getPublic()])
      .then(([media, vids]) => {
        setImages(Array.isArray(media) ? media.filter((m) => m.isActive !== false && m.url) : [])
        setVideos(Array.isArray(vids) ? vids : [])
      })
      .catch(() => {
        setImages([])
        setVideos([])
      })
      .finally(() => setLoading(false))
  }, [])

  const items = useMemo(() => {
    const imageItems: GalleryItem[] = images.map((m) => ({
      kind: "image" as const,
      id: `img-${m.id}`,
      src: resolveMediaUrl(m.url),
      title: (lang === "fr" ? m.altFr : m.altEn)?.trim() || m.key,
      section: m.section,
    }))
    const videoItems: GalleryItem[] = videos.map((v) => ({
      kind: "video" as const,
      id: `vid-${v.id}`,
      youtubeUrl: v.youtubeUrl,
      title: lang === "fr" ? v.titleFr : v.titleEn,
    }))
    if (filter === "images") return imageItems
    if (filter === "videos") return videoItems
    return [...imageItems, ...videoItems]
  }, [images, videos, filter, lang])

  const filters: { id: GalleryFilter; label: string }[] = [
    { id: "all", label: lang === "fr" ? "Tout" : "All" },
    { id: "images", label: lang === "fr" ? "Images" : "Images" },
    { id: "videos", label: lang === "fr" ? "Vidéos" : "Videos" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-white flex items-end min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--sos-blue)] to-[var(--sos-blue-dark)]" />
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16 md:pb-20">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/85 mb-4">
              <Images size={14} />
              {lang === "fr" ? "Médias" : "Media"}
            </span>
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white mb-5 text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {lang === "fr" ? "Galerie" : "Gallery"}
            </motion.h1>
            <motion.p
              className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {lang === "fr"
                ? "Images et vidéos publiées sur le site Global SOS."
                : "Images and videos published on the Global SOS website."}
            </motion.p>
          </div>
        </section>

        <HeroRedDivider />

        <section className="py-8 bg-white border-b border-gray-100 sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2 justify-center md:justify-start">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
                  filter === f.id
                    ? "bg-[var(--sos-blue)] text-white border-[var(--sos-blue)]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[var(--sos-blue)] hover:text-[var(--sos-blue)]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <section className="py-14 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-center text-gray-500 py-24">
                {lang === "fr"
                  ? "Aucun média dans la galerie pour le moment."
                  : "No media in the gallery yet."}
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {items.map((item, i) => {
                  if (item.kind === "image") {
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => setLightbox(item)}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(i, 12) * 0.04 }}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm text-left"
                      >
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                          <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
                        </div>
                      </motion.button>
                    )
                  }

                  const ytId = parseYoutubeId(item.youtubeUrl)
                  const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ""
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={() => setLightbox(item)}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 12) * 0.04 }}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-gray-100 shadow-sm text-left"
                    >
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={item.title}
                          fill
                          className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Film className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-14 h-14 rounded-full bg-[var(--sos-red)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={22} fill="currentColor" />
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                        <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2"
              onClick={() => setLightbox(null)}
              aria-label={lang === "fr" ? "Fermer" : "Close"}
            >
              <X size={28} />
            </button>
            <div
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.kind === "image" ? (
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black">
                  <Image
                    src={lightbox.src}
                    alt={lightbox.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                  {parseYoutubeId(lightbox.youtubeUrl) ? (
                    <iframe
                      src={youtubeEmbedUrl(parseYoutubeId(lightbox.youtubeUrl)!)}
                      title={lightbox.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : null}
                </div>
              )}
              <p className="text-white text-center mt-4 font-medium">{lightbox.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function GaleriePage() {
  return (
    <I18nProvider>
      <GalleryContent />
    </I18nProvider>
  )
}
