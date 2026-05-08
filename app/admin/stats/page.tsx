"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { statsApi } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { CalendarDays, Save, Loader2, CheckCircle } from "lucide-react"

export default function AdminStatsPage() {
  const router = useRouter()
  const [years, setYears] = useState<number>(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    statsApi.getImpact()
      .then((data) => setYears(data.yearsOfExistence ?? 10))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await statsApi.updateImpact({ yearsOfExistence: years })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Années d'existence</h1>
            <p className="text-gray-500 text-sm mt-1">
              Cette valeur est affichée publiquement sur la page d'accueil
            </p>
          </div>

          {error && (
            <div className="bg-[var(--sos-red-light)] border border-[var(--sos-red)] text-[var(--sos-red)] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              {/* Aperçu */}
              <div className="flex items-center justify-center mb-8">
                <div
                  className="flex flex-col items-center justify-center rounded-2xl px-12 py-8 text-white"
                  style={{ background: "var(--sos-blue)" }}
                >
                  <CalendarDays size={40} className="mb-3 opacity-80" />
                  <span className="font-serif font-black text-6xl leading-none">{years}</span>
                  <span className="mt-2 text-sm font-semibold uppercase tracking-widest opacity-80">
                    ans d'existence
                  </span>
                </div>
              </div>

              {/* Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Nombre d'années d'existence
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-xl px-5 py-3 text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)] focus:border-transparent text-center"
                />

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors mt-2"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : saved ? (
                    <CheckCircle size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {saved ? "Enregistré !" : "Enregistrer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
