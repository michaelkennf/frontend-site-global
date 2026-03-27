"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Users, Download, Search, TrendingUp, Trash2, Loader2 } from "lucide-react"
import { newsletterApi, NewsletterSubscriber } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"

export default function AdminNewsletter() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [stats, setStats] = useState<{ total: number; active: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    fetchData()
  }, [router])

  async function fetchData() {
    setLoading(true)
    try {
      const [subs, st] = await Promise.all([newsletterApi.getAll(), newsletterApi.getStats()])
      setSubscribers(subs); setStats(st)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet abonné ?")) return
    try {
      await newsletterApi.delete(id)
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
      if (stats) setStats({ ...stats, total: stats.total - 1, active: stats.active - 1 })
    } catch (e) { console.error(e) }
  }

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-gray-900">Newsletter</h1>
              <p className="text-gray-500 mt-1">{stats?.active ?? "—"} abonnés actifs</p>
            </div>
            <Button variant="outline" onClick={() => {
              const csv = ["Email,Date inscription,Statut",
                ...subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString("fr-FR")},${s.active ? "Actif" : "Désabonné"}`)
              ].join("\n")
              const blob = new Blob([csv], { type: "text/csv" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a"); a.href = url; a.download = "newsletter.csv"; a.click()
            }}>
              <Download className="w-4 h-4 mr-2" />Exporter CSV
            </Button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total abonnés", value: stats.total, icon: Users, color: "#0057B8" },
                { label: "Actifs", value: stats.active, icon: Mail, color: "#16a34a" },
                { label: "Désabonnés", value: stats.total - stats.active, icon: TrendingUp, color: "#f59e0b" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card><CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      <div><p className="text-xs text-gray-500">{stat.label}</p><p className="text-xl font-bold text-gray-900">{stat.value}</p></div>
                    </div>
                  </CardContent></Card>
                </motion.div>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--sos-blue)]" />
                  Liste des abonnés ({filtered.length})
                </CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
              ) : filtered.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Aucun abonné</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Date d'inscription</th>
                        <th className="pb-3 pr-4">Statut</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s, i) => (
                        <motion.tr key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="font-medium text-gray-900">{s.email}</span></div>
                          </td>
                          <td className="py-3 pr-4 text-sm text-gray-500">{new Date(s.subscribedAt).toLocaleDateString("fr-FR")}</td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {s.active ? "Actif" : "Désabonné"}
                            </span>
                          </td>
                          <td className="py-3">
                            <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
