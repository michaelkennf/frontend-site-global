"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Settings, TrendingUp, Save, Loader2, CheckCircle } from "lucide-react"
import { statsApi, ImpactStat } from "@/lib/api"
import { isAuthenticated, getStoredUser } from "@/lib/auth"

export default function AdminSettings() {
  const router = useRouter()
  const [stats, setStats] = useState<ImpactStat | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const currentUser = getStoredUser()

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    statsApi.getImpact().then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [router])

  async function handleSaveStats() {
    if (!stats) return
    setSaving(true); setError("")
    try {
      await statsApi.updateImpact({
        communities: stats.communities,
        trained: stats.trained,
        responses: stats.responses,
        initiatives: stats.initiatives,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de la sauvegarde")
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl text-gray-900">Paramètres</h1>
            <p className="text-gray-500 mt-1">Configurez les paramètres de votre site</p>
          </div>

          <div className="space-y-6">
            {/* Impact Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[var(--sos-blue)]" />
                    Chiffres d'impact
                  </CardTitle>
                  <CardDescription>Ces chiffres apparaissent sur la page d'accueil du site public</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                  ) : stats ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Communautés soutenues
                          </label>
                          <Input
                            type="number"
                            value={stats.communities}
                            onChange={(e) => setStats({ ...stats, communities: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Personnes formées
                          </label>
                          <Input
                            type="number"
                            value={stats.trained}
                            onChange={(e) => setStats({ ...stats, trained: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Réponses d'urgence
                          </label>
                          <Input
                            type="number"
                            value={stats.responses}
                            onChange={(e) => setStats({ ...stats, responses: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Initiatives environnementales
                          </label>
                          <Input
                            type="number"
                            value={stats.initiatives}
                            onChange={(e) => setStats({ ...stats, initiatives: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      {error && <p className="text-red-500 text-sm">{error}</p>}

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handleSaveStats}
                          disabled={saving}
                          className="bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] text-white"
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : saved ? (
                            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          {saved ? "Enregistré !" : "Enregistrer les chiffres"}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[var(--sos-blue)]" />
                    Mon compte
                  </CardTitle>
                  <CardDescription>Informations de votre compte actuel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-[var(--sos-blue)] flex items-center justify-center text-white font-bold text-lg">
                        {currentUser?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{currentUser?.name}</p>
                        <p className="text-sm text-gray-500">{currentUser?.email}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${currentUser?.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-blue-100 text-[var(--sos-blue)]"}`}>
                          {currentUser?.role === "ADMIN" ? "Administrateur" : "Gestionnaire"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Pour modifier vos informations de compte, contactez l'administrateur principal à{" "}
                      <a href="mailto:contact@globalsos.org" className="text-[var(--sos-blue)] hover:underline">
                        contact@globalsos.org
                      </a>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
