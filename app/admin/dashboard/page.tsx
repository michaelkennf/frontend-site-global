"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion } from "framer-motion"
import { Eye, Heart, Users, MessageSquare, TrendingUp, ArrowUpRight, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { statsApi, donationsApi, DashboardStats, Donation } from "@/lib/api"
import { isAuthenticated, getStoredUser } from "@/lib/auth"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const user = getStoredUser()

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    statsApi.getDashboard().then(setStats).catch(console.error)
    donationsApi.getAll().then((d) => setDonations(d.slice(0, 5))).catch(console.error)
  }, [router])

  const cards = stats
    ? [
        { label: "Articles publiés", value: String(stats.articles), icon: FileText, color: "#007CF8" },
        { label: "Dons confirmés", value: `$${stats.totalDonations.toFixed(0)}`, icon: Heart, color: "#E32219", positive: true, change: `${stats.donationCount} dons` },
        { label: "Abonnés actifs", value: String(stats.activeSubscribers), icon: Users, color: "#007CF8" },
        { label: "Messages non lus", value: String(stats.unreadMessages), icon: MessageSquare, color: "#E32219" },
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl text-gray-900">Tableau de bord</h1>
            <p className="text-gray-500 mt-1">
              Bienvenue, <strong>{user?.name}</strong> — {user?.role === "ADMIN" ? "Administrateur" : "Gestionnaire"}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        {stat.change && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-[var(--sos-blue)]">
                            <ArrowUpRight className="w-4 h-4" />
                            {stat.change}
                          </div>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Donations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[var(--sos-red)]" />
                    Dons récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {donations.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Aucun don enregistré</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                            <th className="pb-3 pr-3">Donateur</th>
                            <th className="pb-3 pr-3">Montant</th>
                            <th className="pb-3">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((d, i) => (
                            <tr key={d.id} className="border-t border-gray-100">
                              <td className="py-3 pr-3 font-medium text-gray-900">{d.donorName}</td>
                              <td className="py-3 pr-3 text-[var(--sos-blue)] font-semibold">${d.amount}</td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === "CONFIRMED" ? "bg-[var(--sos-blue-light)] text-[var(--sos-blue-dark)]" : d.status === "PENDING" ? "bg-[var(--sos-red-light)] text-[var(--sos-red-dark)]" : "bg-[var(--sos-red-light)] text-[var(--sos-red)]"}`}>
                                  {d.status === "CONFIRMED" ? "Confirmé" : d.status === "PENDING" ? "En attente" : "Échoué"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: FileText, label: "Nouvel article", color: "#007CF8", href: "/admin/articles" },
                      { icon: Calendar, label: "Nouvelle activité", color: "#007CF8", href: "/admin/activities" },
                      { icon: TrendingUp, label: "Voir les stats", color: "#007CF8", href: "/admin/stats" },
                      { icon: Heart, label: "Rapport dons", color: "#E32219", href: "/admin/donations" },
                    ].map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${action.color}15` }}>
                          <action.icon className="w-5 h-5" style={{ color: action.color }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
                      </a>
                    ))}
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
