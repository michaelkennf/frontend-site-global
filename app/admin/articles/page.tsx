"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  FileText,
  Eye,
  EyeOff,
  Search,
  Send,
  ImagePlus,
} from "lucide-react"
import {
  DEFAULT_LAYOUT_SETTINGS,
  LayoutSettings,
  parseLayoutSettings,
  serializeLayoutSettings,
} from "@/lib/article-layout"
import { LayoutSettingsForm } from "@/components/layout-settings-form"
import { ContentPreviewModal } from "@/components/content-preview-modal"
import {
  articlesApi,
  Article,
  ArticleStatus,
  uploadsApi,
} from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { cn } from "@/lib/utils"

const DOMAIN_OPTIONS: { id: string; label: string }[] = [
  { id: "Général", label: "Général" },
  { id: "risques-catastrophes", label: "Gestion des risques de catastrophes" },
  { id: "urgences-sanitaires", label: "Urgences sanitaires & DSSR" },
  { id: "justice-climatique", label: "Justice climatique & environnementale" },
]

type FormState = {
  titleFr: string
  titleEn: string
  excerptFr: string
  excerptEn: string
  contentFr: string
  contentEn: string
  image: string
  inlineImages: string[]
  category: string
  status: ArticleStatus
  layoutSettings: LayoutSettings
}

const emptyForm: FormState = {
  titleFr: "",
  titleEn: "",
  excerptFr: "",
  excerptEn: "",
  contentFr: "",
  contentEn: "",
  image: "",
  inlineImages: ["", "", "", ""],
  category: "Général",
  status: "DRAFT",
  layoutSettings: { ...DEFAULT_LAYOUT_SETTINGS },
}

type StatusFilter = "all" | ArticleStatus

export default function AdminArticles() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingInline, setUploadingInline] = useState<boolean[]>([false, false, false, false])
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [search, setSearch] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }
    fetchArticles()
  }, [router])

  async function fetchArticles() {
    setLoading(true)
    try {
      setArticles(await articlesApi.getAll())
    } catch {
      setError("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setError("")
    setShowForm(true)
  }

  function openEdit(a: Article) {
    setEditingId(a.id)
    let parsed: string[] = []
    try { parsed = a.inlineImages ? JSON.parse(a.inlineImages) : [] } catch { parsed = [] }
    while (parsed.length < 4) parsed.push("")
    parsed = parsed.slice(0, 4)
    setForm({
      titleFr: a.titleFr,
      titleEn: a.titleEn,
      excerptFr: a.excerptFr,
      excerptEn: a.excerptEn,
      contentFr: a.contentFr,
      contentEn: a.contentEn,
      image: a.image ?? "",
      inlineImages: parsed,
      category: a.category || "Général",
      status: a.status,
      layoutSettings: parseLayoutSettings(a.layoutSettings),
    })
    setError("")
    setShowForm(true)
  }

  async function handleInlineImageUpload(index: number, file?: File) {
    if (!file) return
    setUploadingInline((prev) => { const n = [...prev]; n[index] = true; return n })
    try {
      const url = await uploadsApi.uploadImage(file)
      setForm((prev) => {
        const imgs = [...prev.inlineImages]
        while (imgs.length < 4) imgs.push("")
        imgs[index] = url
        return { ...prev, inlineImages: imgs }
      })
    } catch (err: any) {
      setError(err.message ?? "Erreur upload image")
    } finally {
      setUploadingInline((prev) => { const n = [...prev]; n[index] = false; return n })
    }
  }

  async function handleSave(nextStatus?: ArticleStatus) {
    setSaving(true)
    setError("")
    try {
      const { inlineImages, layoutSettings, ...rest } = form
      const payload = {
        ...(nextStatus ? { ...rest, status: nextStatus } : rest),
        inlineImages: JSON.stringify(inlineImages.slice(0, 4).filter(Boolean)),
        layoutSettings: serializeLayoutSettings(layoutSettings),
      }
      if (editingId) {
        await articlesApi.update(editingId, payload)
      } else {
        await articlesApi.create(payload)
      }
      setShowForm(false)
      fetchArticles()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return
    try {
      await articlesApi.delete(id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function togglePublish(article: Article) {
    const next = article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
    try {
      const updated = await articlesApi.update(article.id, { status: next })
      setArticles((prev) => prev.map((a) => (a.id === article.id ? updated : a)))
    } catch (err: any) {
      alert(err.message)
    }
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

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const haystack = `${a.titleFr} ${a.titleEn} ${a.excerptFr} ${a.excerptEn} ${a.category}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [articles, statusFilter, search])

  function categoryLabel(value: string): string {
    const found = DOMAIN_OPTIONS.find((o) => o.id === value)
    return found?.label ?? value
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-gray-900">Articles</h1>
              <p className="text-gray-500 mt-1">
                Rédigez, publiez et gérez le contenu du blog par domaine d&apos;intervention
              </p>
            </div>
            <Button
              className="bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)]"
              onClick={openCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </div>

          {/* Filtres */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                { id: "all", label: "Tous" },
                { id: "PUBLISHED", label: "Publiés" },
                { id: "DRAFT", label: "Brouillons" },
              ] as { id: StatusFilter; label: string }[]).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setStatusFilter(b.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold transition-colors border",
                    statusFilter === b.id
                      ? "bg-[var(--sos-red)] text-white border-[var(--sos-red)]"
                      : "bg-white border-gray-200 text-gray-600 hover:border-[var(--sos-blue)] hover:text-[var(--sos-blue)]",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
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
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl">
                      {editingId ? "Modifier l'article" : "Nouvel article"}
                    </h2>
                    <button onClick={() => setShowForm(false)}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Titre (FR)
                        </label>
                        <Input
                          value={form.titleFr}
                          onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Titre (EN)
                        </label>
                        <Input
                          value={form.titleEn}
                          onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Résumé (FR)
                        </label>
                        <Textarea
                          rows={2}
                          value={form.excerptFr}
                          onChange={(e) => setForm({ ...form, excerptFr: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Résumé (EN)
                        </label>
                        <Textarea
                          rows={2}
                          value={form.excerptEn}
                          onChange={(e) => setForm({ ...form, excerptEn: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Contenu (FR)
                        </label>
                        <Textarea
                          rows={6}
                          value={form.contentFr}
                          onChange={(e) => setForm({ ...form, contentFr: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Contenu (EN)
                        </label>
                        <Textarea
                          rows={6}
                          value={form.contentEn}
                          onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 bg-[var(--sos-blue-light)]/40 border border-[var(--sos-blue-light)] rounded-lg px-3 py-2">
                      <strong className="text-gray-800">Traduction automatique :</strong> remplissez uniquement le français
                      <em>ou</em> uniquement l&apos;anglais pour le titre, le résumé et le contenu — l&apos;autre langue sera générée à l&apos;enregistrement.
                      <br />
                      <strong className="text-gray-800">Images dans le texte :</strong> insérez{" "}
                      <code className="text-[11px] bg-white px-1 rounded">[[IMG1]]</code> …{" "}
                      <code className="text-[11px] bg-white px-1 rounded">[[IMG4]]</code> dans le contenu aux endroits souhaités, puis uploadez les photos ci-dessous (facultatif).
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Domaine
                        </label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                          {DOMAIN_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Statut
                        </label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={form.status}
                          onChange={(e) => setForm({ ...form, status: e.target.value as ArticleStatus })}
                        >
                          <option value="DRAFT">Brouillon</option>
                          <option value="PUBLISHED">Publié</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Image de couverture
                      </label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileChange(e.target.files?.[0])}
                      />
                      {uploadingImage && (
                        <p className="text-xs text-gray-500 mt-1">Upload en cours...</p>
                      )}
                      {form.image && (
                        <div className="mt-2 h-32 rounded-md overflow-hidden border border-gray-200">
                          <img src={form.image} alt="Aperçu couverture" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Images inline */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1.5">
                        <ImagePlus size={15} />
                        Images dans le texte (jusqu&apos;à 4 — [[IMG1]] … [[IMG4]])
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[0, 1, 2, 3].map((idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="relative h-24 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
                              {form.inlineImages[idx] ? (
                                <>
                                  <img src={form.inlineImages[idx]} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setForm((prev) => { const imgs = [...prev.inlineImages]; imgs[idx] = ""; return { ...prev, inlineImages: imgs } })}
                                    className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 hover:bg-red-50"
                                  >
                                    <X size={12} className="text-red-500" />
                                  </button>
                                </>
                              ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                  {uploadingInline[idx] ? (
                                    <Loader2 size={18} className="animate-spin text-gray-400" />
                                  ) : (
                                    <>
                                      <ImagePlus size={18} className="text-gray-300" />
                                      <span className="text-[10px] text-gray-400 mt-1">Photo {idx + 1}</span>
                                    </>
                                  )}
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleInlineImageUpload(idx, e.target.files?.[0])} />
                                </label>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <LayoutSettingsForm
                      value={form.layoutSettings}
                      onChange={(layoutSettings) => setForm({ ...form, layoutSettings })}
                    />

                    {error && <p className="text-[var(--sos-red)] text-sm">{error}</p>}
                    <div className="flex flex-wrap gap-3 justify-end pt-2">
                      <Button variant="outline" onClick={() => setShowForm(false)}>
                        Annuler
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="border-[var(--sos-blue)] text-[var(--sos-blue)]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Aperçu
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSave("DRAFT")}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Enregistrer en brouillon
                      </Button>
                      <Button
                        onClick={() => handleSave("PUBLISHED")}
                        disabled={saving}
                        className="bg-[var(--sos-blue)] text-white hover:bg-[var(--sos-blue-dark)]"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Publier
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <ContentPreviewModal
            open={showPreview}
            onClose={() => setShowPreview(false)}
            data={{
              titleFr: form.titleFr,
              titleEn: form.titleEn,
              excerptFr: form.excerptFr,
              excerptEn: form.excerptEn,
              bodyFr: form.contentFr,
              bodyEn: form.contentEn,
              image: form.image,
              inlineImages: form.inlineImages,
              layoutSettings: form.layoutSettings,
              metaFr: {
                categoryLabel: categoryLabel(form.category),
                statusLabel: form.status === "PUBLISHED" ? "Publié" : "Brouillon",
                statusVariant: form.status === "PUBLISHED" ? "published" : "draft",
              },
              metaEn: {
                categoryLabel: categoryLabel(form.category),
                statusLabel: form.status === "PUBLISHED" ? "Published" : "Draft",
                statusVariant: form.status === "PUBLISHED" ? "published" : "draft",
              },
            }}
          />

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p>
                {articles.length === 0
                  ? "Aucun article. Cliquez sur \"Nouvel article\" pour commencer."
                  : "Aucun article ne correspond à votre recherche."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                    <div className="p-4 bg-gradient-to-br from-[var(--sos-blue-light)] to-white border-b">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--sos-blue-dark)]">
                          {categoryLabel(article.category)}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 px-2 py-1 rounded-full text-xs font-medium",
                            article.status === "PUBLISHED"
                              ? "bg-[var(--sos-blue-light)] text-[var(--sos-blue-dark)]"
                              : "bg-gray-100 text-gray-600",
                          )}
                        >
                          {article.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                        {article.titleFr}
                      </h3>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {article.excerptFr}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{article.author?.name ?? "—"}</span>
                        <span>{article.views} vues</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openEdit(article)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublish(article)}
                          title={article.status === "PUBLISHED" ? "Dépublier" : "Publier"}
                        >
                          {article.status === "PUBLISHED" ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[var(--sos-red)] hover:bg-[var(--sos-red-light)]"
                          onClick={() => handleDelete(article.id)}
                        >
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
