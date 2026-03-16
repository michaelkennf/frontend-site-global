"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { statsApi, ImpactStat } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import {
  Users, GraduationCap, Siren, Leaf,
  Save, Loader2, CheckCircle, RefreshCw, X,
} from "lucide-react"

const DEFAULTS = { communities: 150, trained: 12000, responses: 87, initiatives: 45 }

const STAT_META = [
  {
    key: "communities" as keyof typeof DEFAULTS,
    labelFr: "Communautés soutenues",
    labelEn: "Communities supported",
    suffix: "+",
    icon: Users,
    color: "#1B6EC2",
    bg: "#e8f2fc",
    description: "Nombre de communautés bénéficiaires de nos actions",
  },
  {
    key: "trained" as keyof typeof DEFAULTS,
    labelFr: "Personnes formées",
    labelEn: "People trained",
    suffix: "+",
    icon: GraduationCap,
    color: "#E31E24",
    bg: "#fdeaea",
    description: "Personnes ayant bénéficié de nos formations",
  },
  {
    key: "responses" as keyof typeof DEFAULTS,
    labelFr: "Réponses d'urgence",
    labelEn: "Emergency responses",
    suffix: "",
    icon: Siren,
    color: "#1B6EC2",
    bg: "#e8f2fc",
    description: "Interventions d'urgence menées depuis notre création",
  },
  {
    key: "initiatives" as keyof typeof DEFAULTS,
    labelFr: "Initiatives environnementales",
    labelEn: "Environmental initiatives",
    suffix: "+",
    icon: Leaf,
    color: "#E31E24",
    bg: "#fdeaea",
    description: "Projets environnementaux et de développement durable",
  },
]

export default function AdminStatsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<ImpactStat | null>(null)
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const data = await statsApi.getImpact()
      setStats(data)
      setForm({
        communities: data.communities,
        trained: data.trained,
        responses: data.responses,
        initiatives: data.initiatives,
      })
    } catch {
      setForm(DEFAULTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    load()
  }, [router])

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await statsApi.updateImpact(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      await load()
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setForm(DEFAULTS)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chiffres d'impact</h1>
            <p className="text-gray-500 text-sm mt-1">
              Ces statistiques sont affichées publiquement sur la page d'accueil
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              <RefreshCw size={15} />
              Valeurs par défaut
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#1B6EC2] hover:bg-[#155fa8] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : saved ? (
                <CheckCircle size={16} />
              ) : (
                <Save size={16} />
              )}
              {saved ? "Enregistré !" : "Enregistrer"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}

        {/* Aperçu visuel (copie du style homepage) */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: "#0a1e46" }}>
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
              Aperçu — rendu sur le site public
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
            {STAT_META.map((meta) => (
              <div key={meta.key} className="text-center py-8 px-4">
                <div className="text-4xl font-black font-serif mb-2" style={{ color: meta.color }}>
                  {loading ? "…" : (form[meta.key] ?? DEFAULTS[meta.key]).toLocaleString()}{meta.suffix}
                </div>
                <div className="text-white/60 text-xs font-medium uppercase tracking-wide leading-snug">
                  {meta.labelFr}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {STAT_META.map((meta) => {
              const Icon = meta.icon
              return (
                <div key={meta.key} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: meta.bg }}
                    >
                      <Icon size={22} style={{ color: meta.color }} />
                    </div>
                    <div className="flex-1">
                      <label className="block font-bold text-gray-900 mb-0.5">
                        {meta.labelFr}
                      </label>
                      <p className="text-xs text-gray-400 mb-3">{meta.description}</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={form[meta.key]}
                          onChange={(e) =>
                            setForm({ ...form, [meta.key]: parseInt(e.target.value) || 0 })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B6EC2] focus:border-transparent"
                        />
                        {meta.suffix && (
                          <span className="text-gray-400 font-bold text-lg">{meta.suffix}</span>
                        )}
                      </div>
                      {form[meta.key] !== DEFAULTS[meta.key] && (
                        <p className="text-xs text-amber-600 mt-1.5 font-medium">
                          Valeur par défaut : {DEFAULTS[meta.key].toLocaleString()}{meta.suffix}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-sm text-blue-700">
          <strong>Note :</strong> Les valeurs par défaut sont{" "}
          {Object.entries(DEFAULTS).map(([k, v], i, arr) => (
            <span key={k}>
              <strong>{v.toLocaleString()}</strong>{" "}
              ({STAT_META.find(m => m.key === k)?.labelFr}){i < arr.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          Cliquez sur <strong>"Valeurs par défaut"</strong> pour les restaurer.
        </div>
      </div>
      </main>
    </div>
  )
}
