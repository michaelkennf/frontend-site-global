"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { testimonialsApi, Testimonial, uploadsApi } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Plus, Pencil, Trash2, MessageSquareQuote, Eye, EyeOff, X, GripVertical } from "lucide-react"
import Image from "next/image"
import { resolveMediaUrl } from "@/lib/media-url"

export default function AdminTestimonialsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const emptyForm = { name: "", quote: "", photo: "", order: 0, isActive: true }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }
    load()
  }, [router])

  async function load() {
    try {
      setItems(await testimonialsApi.getAll())
    } catch {
      setError("Impossible de charger les témoignages")
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditItem(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(t: Testimonial) {
    setEditItem(t)
    setForm({
      name: t.name,
      quote: t.quote,
      photo: t.photo ?? "",
      order: t.order,
      isActive: t.isActive,
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editItem) {
        await testimonialsApi.update(editItem.id, form)
      } else {
        await testimonialsApi.create(form)
      }
      setShowModal(false)
      await load()
    } catch {
      setError("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await testimonialsApi.delete(id)
      setDeleteId(null)
      await load()
    } catch {
      setError("Erreur lors de la suppression")
    }
  }

  async function toggleActive(t: Testimonial) {
    try {
      await testimonialsApi.update(t.id, { isActive: !t.isActive })
      await load()
    } catch {
      setError("Erreur lors de la mise à jour")
    }
  }

  async function handlePhotoChange(file?: File) {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const photoUrl = await uploadsApi.uploadImage(file)
      setForm((prev) => ({ ...prev, photo: photoUrl }))
    } catch {
      setError("Erreur lors de l'upload de la photo")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Témoignages</h1>
              <p className="text-gray-500 text-sm mt-1">
                Gérer les témoignages affichés en panorama sur la page d&apos;accueil
              </p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Ajouter un témoignage
            </button>
          </div>

          {error && (
            <div className="bg-[var(--sos-red-light)] border border-[var(--sos-red)] text-[var(--sos-red)] px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              {error}
              <button type="button" onClick={() => setError(null)}>
                <X size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-xl p-6 animate-pulse h-40" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <MessageSquareQuote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucun témoignage pour l&apos;instant</p>
              <p className="text-gray-400 text-sm mt-1">Cliquez sur &quot;Ajouter un témoignage&quot; pour commencer</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {items.map((t) => {
                const photo = t.photo?.trim() ? resolveMediaUrl(t.photo) : ""
                return (
                  <div
                    key={t.id}
                    className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${t.isActive ? "border-gray-200" : "border-gray-200 opacity-60"}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <GripVertical size={15} />
                        <span className="text-xs font-mono">#{t.order}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleActive(t)}
                          title={t.isActive ? "Masquer" : "Afficher"}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                        >
                          {t.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded hover:bg-[var(--sos-blue-light)] text-[var(--sos-blue)]"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(t.id)}
                          className="p-1.5 rounded hover:bg-[var(--sos-red-light)] text-[var(--sos-red)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {photo ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-100">
                          <Image src={photo} alt={t.name} fill className="object-cover" sizes="64px" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[var(--sos-blue-light)] flex items-center justify-center shrink-0 text-[var(--sos-blue)] font-bold">
                          {t.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900">{t.name}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{t.quote}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editItem ? "Modifier le témoignage" : "Ajouter un témoignage"}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la personne *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)]"
                  placeholder="Ex: Marie K."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Témoignage *</label>
                <textarea
                  required
                  value={form.quote}
                  rows={4}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)] resize-none"
                  placeholder="Texte du témoignage..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)]"
                />
                {uploading && <p className="text-xs text-gray-500 mt-1">Upload en cours...</p>}
                {form.photo && (
                  <div className="mt-2 relative w-20 h-20 rounded-full overflow-hidden border bg-gray-50">
                    <Image
                      src={resolveMediaUrl(form.photo)}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                  <input
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)]"
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Visible sur le site</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg"
                >
                  {saving ? "Enregistrement..." : editItem ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 text-sm mb-6">Ce témoignage sera définitivement supprimé.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-[var(--sos-red)] hover:bg-[var(--sos-red-dark)] text-white font-semibold py-2.5 rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
