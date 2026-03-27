"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Calendar, MapPin, X, Save, Loader2 } from "lucide-react"
import { activitiesApi, Activity, uploadsApi } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"

const emptyForm = {
  titleFr: "", titleEn: "", descriptionFr: "", descriptionEn: "",
  image: "", location: "", date: "", status: "ONGOING" as "ONGOING" | "COMPLETED",
}

export default function AdminActivities() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    fetchActivities()
  }, [router])

  async function fetchActivities() {
    setLoading(true)
    try { setActivities(await activitiesApi.getAll()) }
    catch { setError("Erreur lors du chargement") }
    finally { setLoading(false) }
  }

  function openCreate() { setEditingId(null); setForm(emptyForm); setShowForm(true) }

  function openEdit(a: Activity) {
    setEditingId(a.id)
    setForm({ titleFr: a.titleFr, titleEn: a.titleEn, descriptionFr: a.descriptionFr, descriptionEn: a.descriptionEn, image: a.image ?? "", location: a.location, date: a.date, status: a.status })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true); setError("")
    try {
      if (editingId) await activitiesApi.update(editingId, form)
      else await activitiesApi.create(form)
      setShowForm(false); fetchActivities()
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette activité ?")) return
    try { await activitiesApi.delete(id); setActivities((prev) => prev.filter((a) => a.id !== id)) }
    catch (err: any) { alert(err.message) }
  }

  async function handleImageFileChange(file?: File) {
    if (!file) return
    setUploadingImage(true)
    setError("")
    try {
      const imageUrl = await uploadsApi.uploadImage(file)
      setForm((prev) => ({ ...prev, image: imageUrl }))
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de l'upload de l'image")
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-gray-900">Activités</h1>
              <p className="text-gray-500 mt-1">Gérez vos activités et projets sur le terrain</p>
            </div>
            <Button className="bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)]" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />Nouvelle activité
            </Button>
          </div>

          {/* Form Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl">{editingId ? "Modifier l'activité" : "Nouvelle activité"}</h2>
                    <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Titre (FR)</label><Input value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Titre (EN)</label><Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Description (FR)</label><Textarea rows={3} value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Description (EN)</label><Textarea rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Image de l'activité</label>
                      <Input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e.target.files?.[0])} />
                      {uploadingImage && <p className="text-xs text-gray-500 mt-1">Upload en cours...</p>}
                      {form.image && (
                        <div className="mt-2 h-24 rounded-md overflow-hidden border border-gray-200">
                          <img src={form.image} alt="Aperçu activité" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Localisation</label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Bukavu, Sud-Kivu" /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Date</label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Mars 2026" /></div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Statut</label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                          <option value="ONGOING">En cours</option>
                          <option value="COMPLETED">Terminé</option>
                        </select>
                      </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex gap-3 justify-end pt-2">
                      <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                      <Button onClick={handleSave} disabled={saving} className="bg-[var(--sos-blue)] text-white">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : activities.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <p>Aucune activité. Cliquez sur "Nouvelle activité" pour commencer.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity, i) => (
                <motion.div key={activity.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4 bg-gradient-to-br from-[var(--sos-blue-light)] to-white border-b">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{activity.titleFr}</h3>
                        <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${activity.status === "ONGOING" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {activity.status === "ONGOING" ? "En cours" : "Terminé"}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{activity.descriptionFr}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activity.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{activity.date}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(activity)}>
                          <Edit className="w-4 h-4 mr-1" />Modifier
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(activity.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
