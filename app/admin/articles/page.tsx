"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Eye, FileText, X, Save, Loader2 } from "lucide-react"
import { articlesApi, Article } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Textarea } from "@/components/ui/textarea"

const emptyForm = {
  titleFr: "", titleEn: "", excerptFr: "", excerptEn: "",
  contentFr: "", contentEn: "", category: "Général", status: "DRAFT" as "DRAFT" | "PUBLISHED",
}

export default function AdminArticles() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    fetchArticles()
  }, [router])

  async function fetchArticles() {
    setLoading(true)
    try {
      const data = await articlesApi.getAll()
      setArticles(data)
    } catch { setError("Erreur lors du chargement") }
    finally { setLoading(false) }
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(article: Article) {
    setEditingId(article.id)
    setForm({
      titleFr: article.titleFr, titleEn: article.titleEn,
      excerptFr: article.excerptFr, excerptEn: article.excerptEn,
      contentFr: article.contentFr, contentEn: article.contentEn,
      category: article.category, status: article.status,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      if (editingId) {
        await articlesApi.update(editingId, form)
      } else {
        await articlesApi.create(form)
      }
      setShowForm(false)
      fetchArticles()
    } catch (err: any) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return
    try {
      await articlesApi.delete(id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) { alert(err.message) }
  }

  const filtered = articles.filter((a) =>
    a.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-gray-900">Articles</h1>
              <p className="text-gray-500 mt-1">Gérez vos articles et publications</p>
            </div>
            <Button className="bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)]" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </div>

          {/* Form Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl text-gray-900">{editingId ? "Modifier l'article" : "Nouvel article"}</h2>
                    <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Titre (FR)</label><Input value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Titre (EN)</label><Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Extrait (FR)</label><Textarea rows={2} value={form.excerptFr} onChange={(e) => setForm({ ...form, excerptFr: e.target.value })} /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Extrait (EN)</label><Textarea rows={2} value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Contenu (FR)</label><Textarea rows={5} value={form.contentFr} onChange={(e) => setForm({ ...form, contentFr: e.target.value })} /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Contenu (EN)</label><Textarea rows={5} value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Catégorie</label>
                        <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Santé, Environnement..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Statut</label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                          <option value="DRAFT">Brouillon</option>
                          <option value="PUBLISHED">Publié</option>
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

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Rechercher un article..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--sos-blue)]" />
                Tous les articles ({filtered.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
              ) : filtered.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Aucun article trouvé</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                        <th className="pb-3 pr-4">Titre</th>
                        <th className="pb-3 pr-4">Catégorie</th>
                        <th className="pb-3 pr-4">Statut</th>
                        <th className="pb-3 pr-4">Vues</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((article, i) => (
                        <motion.tr key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-gray-100 last:border-0">
                          <td className="py-4 pr-4">
                            <span className="font-medium text-gray-900 line-clamp-2">{article.titleFr}</span>
                            <span className="text-xs text-gray-400 block mt-0.5">{article.titleEn}</span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-xs bg-blue-50 text-[var(--sos-blue)] px-2 py-1 rounded-full">{article.category}</span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {article.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500"><Eye className="w-4 h-4" />{article.views}</div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEdit(article)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit className="w-4 h-4 text-gray-500" /></button>
                              <button onClick={() => handleDelete(article.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
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
