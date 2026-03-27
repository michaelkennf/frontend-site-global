"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { partnersApi, Partner, uploadsApi } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Plus, Pencil, Trash2, Handshake, Eye, EyeOff, Globe, X, GripVertical } from "lucide-react"
import Image from "next/image"

export default function AdminPartnersPage() {
  const router = useRouter()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editPartner, setEditPartner] = useState<Partner | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const emptyForm = { name: "", logo: "", website: "", description: "", order: 0, isActive: true }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    load()
  }, [router])

  async function load() {
    try {
      setPartners(await partnersApi.getAll())
    } catch {
      setError("Impossible de charger les partenaires")
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditPartner(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(p: Partner) {
    setEditPartner(p)
    setForm({ name: p.name, logo: p.logo ?? "", website: p.website ?? "", description: p.description ?? "", order: p.order, isActive: p.isActive })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editPartner) {
        await partnersApi.update(editPartner.id, form)
      } else {
        await partnersApi.create(form)
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
      await partnersApi.delete(id)
      setDeleteId(null)
      await load()
    } catch {
      setError("Erreur lors de la suppression")
    }
  }

  async function toggleActive(p: Partner) {
    try {
      await partnersApi.update(p.id, { isActive: !p.isActive })
      await load()
    } catch {
      setError("Erreur lors de la mise à jour")
    }
  }

  async function handleLogoFileChange(file?: File) {
    if (!file) return
    setUploadingLogo(true)
    setError(null)
    try {
      const logoUrl = await uploadsApi.uploadImage(file)
      setForm((prev) => ({ ...prev, logo: logoUrl }))
    } catch {
      setError("Erreur lors de l'upload du logo")
    } finally {
      setUploadingLogo(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Partenaires</h1>
              <p className="text-gray-500 text-sm mt-1">Gérer les partenaires affichés sur la page d'accueil</p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-[#0057B8] hover:bg-[#004A9E] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Ajouter un partenaire
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              {error}
              <button onClick={() => setError(null)}><X size={16} /></button>
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="w-24 h-14 bg-gray-200 rounded mx-auto mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-24">
              <Handshake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucun partenaire pour l'instant</p>
              <p className="text-gray-400 text-sm mt-1">Cliquez sur "Ajouter un partenaire" pour commencer</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {partners.map((p) => (
                <div key={p.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${p.isActive ? "border-gray-200" : "border-gray-200 opacity-60"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <GripVertical size={15} />
                      <span className="text-xs font-mono">#{p.order}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleActive(p)} title={p.isActive ? "Masquer" : "Afficher"} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        {p.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-[var(--sos-blue-light)] text-[var(--sos-blue)]">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 text-center">
                    {p.logo ? (
                      <div className="relative w-32 h-16">
                        <Image src={p.logo} alt={p.name} fill className="object-contain" sizes="128px" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#E6EFF9] flex items-center justify-center">
                        <Handshake size={22} style={{ color: "#0057B8" }} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{p.name}</p>
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#0057B8] hover:underline mt-0.5">
                          <Globe size={11} />{p.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      {p.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editPartner ? "Modifier le partenaire" : "Ajouter un partenaire"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du partenaire *</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                  placeholder="Ex: YARH DRC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleLogoFileChange(e.target.files?.[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
                {uploadingLogo && <p className="text-xs text-gray-500 mt-1">Upload en cours...</p>}
                {form.logo && (
                  <div className="mt-2 relative w-full h-16 bg-gray-50 rounded-lg border overflow-hidden">
                    <Image src={form.logo} alt="Aperçu" fill className="object-contain p-2" sizes="384px" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                <input
                  type="url" value={form.website}
                  onChange={e => setForm({ ...form, website: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                  placeholder="https://www.example.org"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                <textarea
                  value={form.description} rows={2}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8] resize-none"
                  placeholder="Courte description du partenaire..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                  <input
                    type="number" min={0} value={form.order}
                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Visible sur le site</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#0057B8] hover:bg-[#004A9E] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg">
                  {saving ? "Enregistrement..." : editPartner ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 text-sm mb-6">Ce partenaire sera définitivement supprimé du site.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
