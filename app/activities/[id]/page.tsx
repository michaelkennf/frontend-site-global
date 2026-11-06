"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowLeft, Loader2 } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"
import { ContentDetailView } from "@/components/content-detail-view"
import { formatPublicationCategoryLabel } from "@/lib/blog-categories"

function ActivityDetailContent() {
  const { lang } = useI18n()
  const params = useParams()
  const [item, setItem] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    setLoading(true)
    activitiesApi
      .getOnePublic(params.id as string)
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [params?.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-xl font-bold mb-4">
              {lang === "fr" ? "Activité introuvable" : "Activity not found"}
            </p>
            <Link href="/activities" className="text-[var(--sos-blue)] hover:underline">
              ← {lang === "fr" ? "Retour aux activités" : "Back to activities"}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const title = lang === "fr" ? item.titleFr : item.titleEn
  const body = lang === "fr" ? item.descriptionFr : item.descriptionEn

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="pt-24 pb-4 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 text-[var(--sos-blue)] hover:text-[var(--sos-blue-dark)] text-sm font-medium"
            >
              <ArrowLeft size={16} />
              {lang === "fr" ? "Retour aux activités" : "Back to activities"}
            </Link>
          </div>
        </div>

        <ContentDetailView
          title={title}
          body={body}
          image={item.image}
          inlineImages={item.inlineImages}
          layoutSettings={item.layoutSettings}
          lang={lang}
          meta={{
            categoryLabel: formatPublicationCategoryLabel(item.category, lang),
            statusLabel:
              item.status === "COMPLETED"
                ? lang === "fr"
                  ? "Terminée"
                  : "Completed"
                : lang === "fr"
                  ? "En cours"
                  : "Ongoing",
            statusVariant: item.status === "COMPLETED" ? "completed" : "ongoing",
            date: item.date,
            location: item.location,
            authorName: item.author?.name,
          }}
        />
      </main>
      <Footer />
    </div>
  )
}

export default function ActivityDetailPage() {
  return (
    <I18nProvider>
      <ActivityDetailContent />
    </I18nProvider>
  )
}
