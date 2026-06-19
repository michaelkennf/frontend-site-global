"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { siteContentApi, SiteContent } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Save, Loader2, CheckCircle, FileEdit, List, Languages } from "lucide-react"
import {
  SITE_TEXT_CATALOG,
  catalogSectionsForTabs,
  type SiteTextCatalogEntry,
} from "@/lib/site-text-catalog"
import {
  mergeContentRows,
  type ContentFieldValues,
} from "@/lib/site-content-admin"
import { notifySiteContentUpdated } from "@/lib/site-content-provider"

export default function AdminContent() {
  const router = useRouter()
  const tabs = useMemo(() => catalogSectionsForTabs(), [])
  const [activeSection, setActiveSection] = useState(tabs[0]?.id ?? "nav")
  const [values, setValues] = useState<ContentFieldValues>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }
    setLoading(true)
    siteContentApi
      .getAllAdmin()
      .then((rows: SiteContent[]) => setValues(mergeContentRows(rows)))
      .catch(() => setError("Impossible de charger le contenu. Vérifiez votre connexion."))
      .finally(() => setLoading(false))
  }, [router])

  const fieldsForSection = useMemo((): SiteTextCatalogEntry[] => {
    return SITE_TEXT_CATALOG.filter((e) => e.section === activeSection)
  }, [activeSection])

  function get(key: string, lang: "fr" | "en") {
    return values[key]?.[lang === "fr" ? "valueFr" : "valueEn"] ?? ""
  }

  function setField(key: string, lang: "fr" | "en", val: string) {
    setValues((prev) => ({
      ...prev,
      [key]: {
        valueFr: lang === "fr" ? val : (prev[key]?.valueFr ?? ""),
        valueEn: lang === "en" ? val : (prev[key]?.valueEn ?? ""),
      },
    }))
  }

  async function handleSave(entry: SiteTextCatalogEntry, forceRetranslateEn = false) {
    const key = entry.key
    const current = values[key]
    if (!current) return

    const valueFr = current.valueFr ?? ""
    const valueEn = forceRetranslateEn ? "" : (current.valueEn ?? "")

    if (!valueFr.trim() && !valueEn.trim()) {
      setError("Le texte ne peut pas être vide. Remplissez au moins le champ français.")
      return
    }

    setSaving(key)
    setError(null)
    try {
      const updated = await siteContentApi.upsert(key, {
        valueFr,
        valueEn,
        section: entry.section,
        retranslateEn: forceRetranslateEn,
      })
      if (!updated.valueFr?.trim() && !updated.valueEn?.trim()) {
        throw new Error("La sauvegarde a échoué : contenu vide renvoyé par le serveur.")
      }
      const next = { valueFr: updated.valueFr, valueEn: updated.valueEn }
      setValues((prev) => ({ ...prev, [key]: next }))
      notifySiteContentUpdated()
      setSaved(key)
      setTimeout(() => setSaved(null), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde")
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl text-gray-900 flex items-center gap-3">
              <FileEdit className="w-7 h-7 text-[var(--sos-blue)]" />
              Contenu du site
            </h1>
            <p className="text-gray-500 mt-1 flex flex-wrap items-center gap-2">
              <List className="w-4 h-4 shrink-0" />
              Les textes actuels du site sont préremplis (français et anglais). Modifiez le français
              puis enregistrez : l&apos;anglais est traduit automatiquement s&apos;il est vide.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Utilisez « Retraduire EN » pour regénérer l&apos;anglais à partir du français.
            </p>
          </div>

          {error && (
            <div className="bg-[var(--sos-red-light)] border border-[var(--sos-red)] text-[var(--sos-red)] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4 max-h-[40vh] overflow-y-auto">
            {tabs.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  activeSection === s.id
                    ? "bg-[var(--sos-blue)] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[var(--sos-blue)] hover:text-[var(--sos-blue)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-6">
              {fieldsForSection.length === 0 ? (
                <p className="text-gray-500">Aucun champ pour cette section.</p>
              ) : (
                fieldsForSection.map((field) => (
                  <div
                    key={field.key}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{field.label}</h3>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{field.key}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSave(field, true)}
                          disabled={saving === field.key || !get(field.key, "fr").trim()}
                          title="Regénérer l'anglais depuis le français"
                          className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-[var(--sos-blue)] hover:text-[var(--sos-blue)] disabled:opacity-50 text-gray-600 text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                        >
                          <Languages size={15} />
                          Retraduire EN
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSave(field)}
                          disabled={saving === field.key}
                          className="inline-flex items-center justify-center gap-2 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          {saving === field.key ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : saved === field.key ? (
                            <CheckCircle size={15} />
                          ) : (
                            <Save size={15} />
                          )}
                          {saved === field.key ? "Enregistré !" : "Enregistrer"}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {(["fr", "en"] as const).map((lang) => (
                        <div key={lang}>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                            {lang === "fr" ? "Français" : "English"}
                          </label>
                          {field.multiline ? (
                            <textarea
                              rows={field.key.includes("body") || field.key.includes("description") ? 8 : 4}
                              value={get(field.key, lang)}
                              onChange={(e) => setField(field.key, lang, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)] focus:border-transparent"
                              placeholder={lang === "fr" ? "Texte en français…" : "English text…"}
                            />
                          ) : (
                            <input
                              type="text"
                              value={get(field.key, lang)}
                              onChange={(e) => setField(field.key, lang, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)] focus:border-transparent"
                              placeholder={lang === "fr" ? "Texte en français…" : "English text…"}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
