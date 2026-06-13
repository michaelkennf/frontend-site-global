"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentDetailView, ContentDetailMeta } from "@/components/content-detail-view"
import { LayoutSettings, serializeLayoutSettings } from "@/lib/article-layout"
import { cn } from "@/lib/utils"

export interface ContentPreviewData {
  titleFr: string
  titleEn: string
  excerptFr?: string
  excerptEn?: string
  bodyFr: string
  bodyEn: string
  image?: string
  inlineImages?: string[]
  layoutSettings: LayoutSettings
  metaFr?: ContentDetailMeta
  metaEn?: ContentDetailMeta
}

interface ContentPreviewModalProps {
  open: boolean
  onClose: () => void
  data: ContentPreviewData
}

export function ContentPreviewModal({ open, onClose, data }: ContentPreviewModalProps) {
  const [lang, setLang] = useState<"fr" | "en">("fr")

  const title = lang === "fr" ? data.titleFr || data.titleEn : data.titleEn || data.titleFr
  const excerpt =
    lang === "fr"
      ? data.excerptFr || data.excerptEn
      : data.excerptEn || data.excerptFr
  const body = lang === "fr" ? data.bodyFr || data.bodyEn : data.bodyEn || data.bodyFr
  const meta = lang === "fr" ? data.metaFr : data.metaEn
  const inlineJson = JSON.stringify((data.inlineImages ?? []).filter(Boolean))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/70 flex flex-col"
        >
          <div className="shrink-0 flex items-center justify-between gap-4 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <Eye size={18} className="text-[var(--sos-blue)] shrink-0" />
              <span className="font-semibold text-gray-900 truncate">Aperçu avant publication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-bold">
                {(["fr", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={cn(
                      "px-3 py-1.5 uppercase transition-colors",
                      lang === l
                        ? "bg-[var(--sos-blue)] text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X size={16} className="mr-1" />
                Fermer
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-100">
            <div className="max-w-6xl my-6 mx-4 sm:mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
              <div className="h-2 bg-gradient-to-r from-[var(--sos-blue)] via-[var(--sos-red)] to-[var(--sos-blue)]" />
              <ContentDetailView
                title={title || "(Sans titre)"}
                excerpt={excerpt}
                body={body || "(Contenu vide)"}
                image={data.image}
                inlineImages={inlineJson}
                layoutSettings={serializeLayoutSettings(data.layoutSettings)}
                lang={lang}
                meta={meta}
                preview
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
