"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { videosApi, SiteVideo } from "@/lib/api"
import { parseYoutubeId, youtubeEmbedUrl } from "@/lib/youtube"

export function VideosSection() {
  const { lang } = useI18n()
  const [videos, setVideos] = useState<SiteVideo[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    videosApi
      .getPublic()
      .then((list) => {
        setVideos(list)
        if (list.length) setActiveId(list[0].id)
      })
      .catch(() => setVideos([]))
  }, [])

  if (!videos.length) return null

  const active = videos.find((v) => v.id === activeId) ?? videos[0]
  const activeVideoId = parseYoutubeId(active.youtubeUrl)

  return (
    <section className="py-20 md:py-24 bg-white" id="videos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--sos-blue)" }}
          >
            <Play size={14} />
            {lang === "fr" ? "Médias" : "Media"}
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            <span style={{ color: "var(--sos-blue)" }}>
              {lang === "fr" ? "Nos" : "Our"}
            </span>{" "}
            <span style={{ color: "var(--sos-red)" }}>
              {lang === "fr" ? "vidéos" : "videos"}
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {activeVideoId && (
            <motion.div
              className="lg:col-span-8"
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-lg border border-gray-100">
                <iframe
                  src={youtubeEmbedUrl(activeVideoId)}
                  title={
                    lang === "fr"
                      ? active.titleFr || "Vidéo Global SOS"
                      : active.titleEn || active.titleFr || "Global SOS video"
                  }
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              {(active.titleFr || active.titleEn) && (
                <p className="mt-4 text-lg font-semibold text-gray-900">
                  {lang === "fr"
                    ? active.titleFr || active.titleEn
                    : active.titleEn || active.titleFr}
                </p>
              )}
            </motion.div>
          )}

          <div className="lg:col-span-4 space-y-3">
            {videos.map((v) => {
              const vid = parseYoutubeId(v.youtubeUrl)
              const title =
                lang === "fr"
                  ? v.titleFr || v.titleEn || "Vidéo"
                  : v.titleEn || v.titleFr || "Video"
              const isActive = v.id === active.id
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveId(v.id)}
                  className={`w-full flex gap-3 p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? "border-[var(--sos-blue)] bg-[var(--sos-blue-light)]/40 shadow-sm"
                      : "border-gray-200 bg-gray-50 hover:border-[var(--sos-blue)]/50"
                  }`}
                >
                  <div
                    className="relative w-28 shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-200"
                    style={
                      vid
                        ? {
                            backgroundImage: `url(https://img.youtube.com/vi/${vid}/hqdefault.jpg)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play size={20} className="text-white" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 line-clamp-3 pt-1">
                    {title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
