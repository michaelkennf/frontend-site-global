"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { siteContentApi, SiteContent } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Save, Loader2, CheckCircle, FileEdit, List } from "lucide-react"
import {
  SITE_TEXT_CATALOG,
  catalogSectionsForTabs,
  type SiteTextCatalogEntry,
} from "@/lib/site-text-catalog"

type FieldValues = Record<string, { valueFr: string; valueEn: string }>

function defaultsFromCatalog(): FieldValues {
  const m: FieldValues = {}
  for (const e of SITE_TEXT_CATALOG) {
    m[e.key] = { valueFr: e.defaultFr, valueEn: e.defaultEn }
  }
  return m
}

export default function AdminContent() {
  const router = useRouter()
  const tabs = useMemo(() => catalogSectionsForTabs(), [])
  const [activeSection, setActiveSection] = useState(tabs[0]?.id ?? "nav")
  const [values, setValues] = useState<FieldValues>({})
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
      .then((rows: SiteContent[]) => {
        const base = defaultsFromCatalog()
        rows.forEach((r) => {
          base[r.key] = { valueFr: r.valueFr, valueEn: r.valueEn }
        })
        setValues(base)
      })
      .catch(() => setValues(defaultsFromCatalog()))
      .finally(() => setLoading(false))
  }, [router])

  const fieldsForSection = useMemo((): SiteTextCatalogEntry[] => {
    return SITE_TEXT_CATALOG.filter((e) => e.section === activeSection)
  }, [activeSection])

  function get(key: string, lang: "fr" | "en") {
    return values[key]?.[lang === "fr" ? "valueFr" : "valueEn"] ?? ""
  }

  function set(key: string, lang: "fr" | "en", val: string) {
    setValues((prev) => ({
      ...prev,
      [key]: {
        valueFr: lang === "fr" ? val : (prev[key]?.valueFr ?? ""),
        valueEn: lang === "en" ? val : (prev[key]?.valueEn ?? ""),
      },
    }))
  }

  async function handleSave(entry: SiteTextCatalogEntry) {
    const key = entry.key
    setSaving(key)
    setError(null)
    try {
      await siteContentApi.upsert(key, {
        valueFr: values[key]?.valueFr ?? "",
        valueEn: values[key]?.valueEn ?? "",
        section: entry.section,
      })
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
              Tous les textes publics listés par zone. Laissez une langue vide pour la remplir via la traduction
              automatique côté articles/activités ; ici les deux champs sont libres.
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
                      <button
                        type="button"
                        onClick={() => handleSave(field)}
                        disabled={saving === field.key}
                        className="inline-flex items-center justify-center gap-2 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
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
                              onChange={(e) => set(field.key, lang, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)] focus:border-transparent"
                              placeholder={lang === "fr" ? "Texte en français…" : "English text…"}
                            />
                          ) : (
                            <input
                              type="text"
                              value={get(field.key, lang)}
                              onChange={(e) => set(field.key, lang, e.target.value)}
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
