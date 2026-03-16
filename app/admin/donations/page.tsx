"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, TrendingUp, Download, Users, Calendar, Loader2, Save, DollarSign } from "lucide-react"
import { donationsApi, Donation, DonationInfo } from "@/lib/api"
import { isAuthenticated, getStoredUser } from "@/lib/auth"

export default function AdminDonations() {
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState<any>(null)
  const [info, setInfo] = useState<DonationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingInfo, setSavingInfo] = useState(false)
  const [saved, setSaved] = useState(false)
  const user = getStoredUser()

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    Promise.all([
      donationsApi.getAll().then(setDonations),
      donationsApi.getStats().then(setStats),
      donationsApi.getInfo().then(setInfo),
    ]).finally(() => setLoading(false))
  }, [router])

  async function handleSaveInfo() {
    if (!info) return
    setSavingInfo(true)
    try {
      await donationsApi.updateInfo(info)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) { console.error(e) }
    finally { setSavingInfo(false) }
  }

  const statCards = stats ? [
    { label: "Total confirmé", value: `$${stats.totalAmount.toFixed(0)}`, icon: DollarSign, color: "#16a34a" },
    { label: "Nombre de dons", value: String(stats.count), icon: Heart, color: "#E31E24" },
    { label: "Donateurs uniques", value: String(stats.uniqueDonors), icon: Users, color: "#1B6EC2" },
    { label: "Don moyen", value: `$${stats.averageAmount.toFixed(0)}`, icon: TrendingUp, color: "#f59e0b" },
  ] : []

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-gray-900">Dons</h1>
              <p className="text-gray-500 mt-1">Gérez les dons et les informations de paiement</p>
            </div>
            <Button variant="outline" onClick={() => {
              const csv = ["Donateur,Email,Montant,Devise,Méthode,Statut,Date",
                ...donations.map(d => `${d.donorName},${d.donorEmail},${d.amount},${d.currency},${d.method},${d.status},${new Date(d.createdAt).toLocaleDateString("fr-FR")}`)
              ].join("\n")
              const blob = new Blob([csv], { type: "text/csv" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a"); a.href = url; a.download = "dons.csv"; a.click()
            }}>
              <Download className="w-4 h-4 mr-2" />Exporter CSV
            </Button>
          </div>

          {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div> : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, i) => (
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

              {/* Donation Info Edit (Gestionnaire & Admin) */}
              {info && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[var(--sos-red)]" />
                      Informations de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: "M-Pesa — Numéro", key: "mpesaNumber" },
                        { label: "M-Pesa — Nom", key: "mpesaName" },
                        { label: "Airtel Money — Numéro", key: "airtelMoneyNumber" },
                        { label: "Airtel Money — Nom", key: "airtelMoneyName" },
                        { label: "Orange Money — Numéro", key: "orangeMoneyNumber" },
                        { label: "Orange Money — Nom", key: "orangeMoneyName" },
                        { label: "Nom de la banque", key: "bankName" },
                        { label: "Nom titulaire compte", key: "bankAccountName" },
                        { label: "Numéro de compte", key: "bankAccountNumber" },
                        { label: "Code SWIFT", key: "bankSwift" },
                        { label: "IBAN", key: "bankIban" },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
                          <Input value={(info as any)[key]} onChange={(e) => setInfo({ ...info, [key]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Description de la page don</label>
                      <Input value={info.donationDescription} onChange={(e) => setInfo({ ...info, donationDescription: e.target.value })} />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveInfo} disabled={savingInfo} className="bg-[var(--sos-blue)] text-white">
                        {savingInfo ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {saved ? "Enregistré !" : "Enregistrer les informations"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Donations Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[var(--sos-red)]" />
                    Historique des dons ({donations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {donations.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">Aucun don enregistré</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                            <th className="pb-3 pr-4">Donateur</th>
                            <th className="pb-3 pr-4">Email</th>
                            <th className="pb-3 pr-4">Montant</th>
                            <th className="pb-3 pr-4">Méthode</th>
                            <th className="pb-3 pr-4">Date</th>
                            <th className="pb-3">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((d, i) => (
                            <motion.tr key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 last:border-0">
                              <td className="py-3 pr-4 font-medium text-gray-900">{d.donorName}</td>
                              <td className="py-3 pr-4 text-sm text-gray-500">{d.donorEmail}</td>
                              <td className="py-3 pr-4 font-semibold text-green-600">${d.amount} {d.currency}</td>
                              <td className="py-3 pr-4 text-sm text-gray-500">{d.method}</td>
                              <td className="py-3 pr-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(d.createdAt).toLocaleDateString("fr-FR")}</div>
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === "CONFIRMED" ? "bg-green-100 text-green-700" : d.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                  {d.status === "CONFIRMED" ? "Confirmé" : d.status === "PENDING" ? "En attente" : "Échoué"}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
