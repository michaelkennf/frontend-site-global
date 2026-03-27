"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { teamApi, TeamMember, uploadsApi } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Plus, Pencil, Trash2, UserCircle2, GripVertical, Eye, EyeOff, X } from "lucide-react"

export default function AdminTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editMember, setEditMember] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const emptyForm = {
    nameFr: "", nameEn: "", roleFr: "", roleEn: "", bio: "", image: "", order: 0, isActive: true,
  }
  const [form, setForm] = useState(emptyForm)

  async function load() {
    try {
      const data = await teamApi.getAll()
      setMembers(data)
    } catch {
      setError("Impossible de charger les membres")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    load()
  }, [router])

  function openCreate() {
    setEditMember(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(m: TeamMember) {
    setEditMember(m)
    setForm({
      nameFr: m.nameFr, nameEn: m.nameEn, roleFr: m.roleFr, roleEn: m.roleEn,
      bio: m.bio ?? "", image: m.image ?? "", order: m.order, isActive: m.isActive,
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editMember) {
        await teamApi.update(editMember.id, form)
      } else {
        await teamApi.create(form)
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
      await teamApi.delete(id)
      setDeleteId(null)
      await load()
    } catch {
      setError("Erreur lors de la suppression")
    }
  }

  async function toggleActive(m: TeamMember) {
    try {
      await teamApi.update(m.id, { isActive: !m.isActive })
      await load()
    } catch {
      setError("Erreur lors de la mise à jour")
    }
  }

  async function handleImageFileChange(file?: File) {
    if (!file) return
    setUploadingImage(true)
    setError(null)
    try {
      const imageUrl = await uploadsApi.uploadImage(file)
      setForm((prev) => ({ ...prev, image: imageUrl }))
    } catch {
      setError("Erreur lors de l'upload de l'image")
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Équipe</h1>
            <p className="text-gray-500 text-sm mt-1">Gérer les membres de l'équipe affichés sur la page À Propos</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#0057B8] hover:bg-[#004A9E] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Ajouter un membre
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
                <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-24">
            <UserCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Aucun membre pour l'instant</p>
            <p className="text-gray-400 text-sm mt-1">Cliquez sur "Ajouter un membre" pour commencer</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <div key={m.id} className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${m.isActive ? "border-gray-200" : "border-gray-200 opacity-60"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <GripVertical size={16} className="text-gray-300" />
                    <span className="text-xs text-gray-400 font-mono">#{m.order}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(m)}
                      title={m.isActive ? "Masquer" : "Afficher"}
                      className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500"
                    >
                      {m.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      onClick={() => openEdit(m)}
                      className="p-1.5 rounded hover:bg-[var(--sos-blue-light)] transition-colors text-[var(--sos-blue)]"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(m.id)}
                      className="p-1.5 rounded hover:bg-red-50 transition-colors text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {m.image ? (
                      <img src={m.image} alt={m.nameFr} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle2 className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <p className="font-bold text-gray-900">{m.nameFr}</p>
                  <p className="text-sm text-gray-400 italic">{m.nameEn}</p>
                  <p className="text-sm font-medium text-[#0057B8] mt-1">{m.roleFr}</p>
                  <p className="text-xs text-gray-400">{m.roleEn}</p>
                  {m.bio && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{m.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal création / édition */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {editMember ? "Modifier le membre" : "Ajouter un membre"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom (FR) *</label>
                  <input
                    type="text" required value={form.nameFr}
                    onChange={e => setForm({ ...form, nameFr: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                    placeholder="Ex: Dr. Marie Kabongo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom (EN) *</label>
                  <input
                    type="text" required value={form.nameEn}
                    onChange={e => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                    placeholder="Ex: Dr. Marie Kabongo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle (FR) *</label>
                  <input
                    type="text" required value={form.roleFr}
                    onChange={e => setForm({ ...form, roleFr: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                    placeholder="Ex: Directrice Générale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle (EN) *</label>
                  <input
                    type="text" required value={form.roleEn}
                    onChange={e => setForm({ ...form, roleEn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                    placeholder="Ex: Executive Director"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageFileChange(e.target.files?.[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
                {uploadingImage && <p className="text-xs text-gray-500 mt-1">Upload en cours...</p>}
                {form.image && (
                  <div className="mt-2 relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                    <img src={form.image} alt="Aperçu membre" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biographie (optionnel)</label>
                <textarea
                  value={form.bio} rows={3}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8] resize-none"
                  placeholder="Courte description du membre..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                  <input
                    type="number" min={0} value={form.order}
                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox" checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0057B8]"
                    />
                    <span className="text-sm font-medium text-gray-700">Visible sur le site</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-[#0057B8] hover:bg-[#004A9E] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {saving ? "Enregistrement..." : editMember ? "Mettre à jour" : "Ajouter"}
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
            <p className="text-gray-500 text-sm mb-6">Cette action est irréversible. Le membre sera définitivement supprimé.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  )
}
