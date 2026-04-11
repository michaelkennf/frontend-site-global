"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AdminSidebar } from "@/components/admin-sidebar"
import { siteMediaApi, uploadsApi, type SiteMedia } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import {
  ImageIcon,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

const SECTION_LABELS: Record<string, string> = {
  "about-carousel": "Carousel — Page d'accueil (À propos)",
  "page-headers": "En-têtes de pages",
  general: "Général",
}

const SECTION_KEYS = Object.keys(SECTION_LABELS)

export default function MediaPage() {
  const router = useRouter()
  const [medias, setMedias] = useState<SiteMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingMedia, setEditingMedia] = useState<SiteMedia | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    key: "",
    url: "",
    altFr: "",
    altEn: "",
    section: "about-carousel",
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    if (!isAuthenticated()) router.push("/admin")
  }, [router])

  const load = async () => {
    setLoading(true)
    try {
      const data = await siteMediaApi.getAll()
      setMedias(data)
    } catch {
      setError("Impossible de charger les médias.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const notify = (msg: string, isErr = false) => {
    if (isErr) { setError(msg); setSuccess("") }
    else { setSuccess(msg); setError("") }
    setTimeout(() => { setError(""); setSuccess("") }, 4000)
  }

  const openCreate = () => {
    setEditingMedia(null)
    setForm({ key: "", url: "", altFr: "", altEn: "", section: "about-carousel", order: medias.length, isActive: true })
    setShowForm(true)
  }

  const openEdit = (m: SiteMedia) => {
    setEditingMedia(m)
    setForm({ key: m.key, url: m.url, altFr: m.altFr, altEn: m.altEn, section: m.section, order: m.order, isActive: m.isActive })
    setShowForm(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadsApi.uploadImage(file)
      setForm((f) => ({ ...f, url }))
    } catch {
      notify("Échec de l'upload", true)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingMedia) {
        const { key: _k, ...rest } = form
        await siteMediaApi.update(editingMedia.id, rest)
        notify("Image mise à jour avec succès.")
      } else {
        await siteMediaApi.create(form)
        notify("Image ajoutée avec succès.")
      }
      setShowForm(false)
      load()
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Erreur lors de la sauvegarde.", true)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette image ?")) return
    try {
      await siteMediaApi.delete(id)
      notify("Image supprimée.")
      load()
    } catch {
      notify("Erreur lors de la suppression.", true)
    }
  }

  const handleToggle = async (m: SiteMedia) => {
    try {
      await siteMediaApi.update(m.id, { isActive: !m.isActive })
      load()
    } catch {
      notify("Erreur lors de la mise à jour.", true)
    }
  }

  const handleOrder = async (m: SiteMedia, dir: "up" | "down") => {
    const newOrder = dir === "up" ? m.order - 1 : m.order + 1
    try {
      await siteMediaApi.update(m.id, { order: newOrder })
      load()
    } catch {
      notify("Erreur lors du réordonnancement.", true)
    }
  }

  const grouped = SECTION_KEYS.reduce<Record<string, SiteMedia[]>>((acc, key) => {
    acc[key] = medias.filter((m) => m.section === key).sort((a, b) => a.order - b.order)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Médiathèque</h1>
              <p className="text-gray-500 text-sm mt-1">
                Gérez les images du site (carousel, en-têtes de pages). Les images hero et fond de don ne sont pas modifiables ici.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={load}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm"
              >
                <RefreshCw size={16} /> Actualiser
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow"
                style={{ background: "#0057B8" }}
              >
                <Plus size={16} /> Ajouter une image
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Chargement…</div>
          ) : (
            <div className="space-y-10">
              {SECTION_KEYS.map((section) => (
                <div key={section}>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                    <ImageIcon size={14} />
                    {SECTION_LABELS[section]}
                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-normal">
                      {grouped[section].length} image{grouped[section].length !== 1 ? "s" : ""}
                    </span>
                  </h2>

                  {grouped[section].length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
                      Aucune image dans cette section.{" "}
                      <button
                        className="underline"
                        onClick={() => { openCreate(); setForm((f) => ({ ...f, section })) }}
                      >
                        Ajouter
                      </button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped[section].map((m, idx) => (
                        <div
                          key={m.id}
                          className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-opacity ${m.isActive ? "" : "opacity-50"}`}
                        >
                          {/* Preview */}
                          <div className="relative h-44 bg-gray-100">
                            <Image
                              src={m.url}
                              alt={m.altFr || m.key}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                            />
                            <div className="absolute top-2 left-2 flex gap-1">
                              {!m.isActive && (
                                <span className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full">
                                  Masquée
                                </span>
                              )}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                onClick={() => handleOrder(m, "up")}
                                disabled={idx === 0}
                                className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white disabled:opacity-30"
                                title="Monter"
                              >
                                <ArrowUp size={13} />
                              </button>
                              <button
                                onClick={() => handleOrder(m, "down")}
                                disabled={idx === grouped[section].length - 1}
                                className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white disabled:opacity-30"
                                title="Descendre"
                              >
                                <ArrowDown size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-4">
                            <p className="text-xs text-gray-400 mb-1 truncate font-mono">{m.key}</p>
                            <p className="font-semibold text-gray-800 text-sm truncate mb-0.5">{m.altFr || "—"}</p>
                            <p className="text-xs text-gray-400 truncate">{m.url}</p>

                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleToggle(m)}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border text-gray-600 hover:bg-gray-50"
                              >
                                {m.isActive ? <EyeOff size={12} /> : <Eye size={12} />}
                                {m.isActive ? "Masquer" : "Afficher"}
                              </button>
                              <button
                                onClick={() => openEdit(m)}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Pencil size={12} /> Modifier
                              </button>
                              <button
                                onClick={() => handleDelete(m.id)}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border text-red-600 border-red-200 hover:bg-red-50 ml-auto"
                              >
                                <Trash2 size={12} /> Suppr.
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">
                {editingMedia ? "Modifier l'image" : "Ajouter une image"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {!editingMedia && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clé unique <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.key}
                    onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                    placeholder="ex: carousel-5"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  value={form.section}
                  onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SECTION_KEYS.map((k) => (
                    <option key={k} value={k}>{SECTION_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de l&apos;image <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="/images/photo.jpg ou https://..."
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm flex items-center gap-1"
                  >
                    <Upload size={14} />
                    {uploading ? "…" : "Upload"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </div>
                {form.url && (
                  <div className="mt-2 relative h-32 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <Image
                      src={form.url}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                      sizes="400px"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3" }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texte alternatif (FR)</label>
                  <input
                    type="text"
                    value={form.altFr}
                    onChange={(e) => setForm((f) => ({ ...f, altFr: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description en français"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texte alternatif (EN)</label>
                  <input
                    type="text"
                    value={form.altEn}
                    onChange={(e) => setForm((f) => ({ ...f, altEn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description in English"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-white text-sm font-semibold"
                  style={{ background: "#0057B8" }}
                >
                  {editingMedia ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
