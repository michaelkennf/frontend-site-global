"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { videosApi, SiteVideo } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { parseYoutubeId, youtubeThumbnailUrl } from "@/lib/youtube"
import { Plus, Pencil, Trash2, Video, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"

export default function AdminVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<SiteVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editVideo, setEditVideo] = useState<SiteVideo | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const emptyForm = {
    youtubeUrl: "",
    titleFr: "",
    titleEn: "",
    order: 0,
    isActive: true,
  }
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
      setVideos(await videosApi.getAll())
    } catch {
      setError("Impossible de charger les vidéos")
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditVideo(null)
    setForm({ ...emptyForm, order: videos.length })
    setShowModal(true)
  }

  function openEdit(v: SiteVideo) {
    setEditVideo(v)
    setForm({
      youtubeUrl: v.youtubeUrl,
      titleFr: v.titleFr,
      titleEn: v.titleEn,
      order: v.order,
      isActive: v.isActive,
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!parseYoutubeId(form.youtubeUrl)) {
      setError("Lien YouTube invalide")
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (editVideo) {
        await videosApi.update(editVideo.id, form)
      } else {
        await videosApi.create(form)
      }
      setShowModal(false)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await videosApi.delete(id)
      setDeleteId(null)
      await load()
    } catch {
      setError("Erreur lors de la suppression")
    }
  }

  async function toggleActive(v: SiteVideo) {
    try {
      await videosApi.update(v.id, { isActive: !v.isActive })
      await load()
    } catch {
      setError("Erreur lors de la mise à jour")
    }
  }

  const previewId = parseYoutubeId(form.youtubeUrl)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-gray-900 flex items-center gap-2">
                <Video className="w-8 h-8 text-[var(--sos-blue)]" />
                Vidéos YouTube
              </h1>
              <p className="text-gray-500 mt-1">
                Ajoutez des liens YouTube affichés sur la page d&apos;accueil
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] text-white font-semibold px-4 py-2.5 rounded-lg"
            >
              <Plus size={18} />
              Ajouter une vidéo
            </button>
          </div>

          {error && (
            <div className="mb-6 text-sm text-[var(--sos-red)] bg-[var(--sos-red-light)] border border-[var(--sos-red)]/30 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>Aucune vidéo. Cliquez sur &quot;Ajouter une vidéo&quot;.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {videos.map((v) => {
                const vid = parseYoutubeId(v.youtubeUrl)
                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <div className="relative aspect-video bg-gray-100">
                      {vid ? (
                        <Image
                          src={youtubeThumbnailUrl(vid)}
                          alt={v.titleFr || "Vidéo"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          Lien invalide
                        </div>
                      )}
                      {!v.isActive && (
                        <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded">
                          Masquée
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {v.titleFr || v.titleEn || "Sans titre"}
                      </p>
                      <p className="text-xs text-gray-400 truncate mb-4">{v.youtubeUrl}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(v)}
                          className="flex-1 inline-flex items-center justify-center gap-1 text-sm border rounded-lg py-2 hover:bg-gray-50"
                        >
                          <Pencil size={14} />
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleActive(v)}
                          className="p-2 border rounded-lg hover:bg-gray-50"
                          title={v.isActive ? "Masquer" : "Afficher"}
                        >
                          {v.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(v.id)}
                          className="p-2 border rounded-lg text-[var(--sos-red)] hover:bg-[var(--sos-red-light)]"
                        >
                          <Trash2 size={16} />
                        </button>
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
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-bold text-xl">
              {editVideo ? "Modifier la vidéo" : "Nouvelle vidéo YouTube"}
            </h2>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Lien YouTube *
              </label>
              <input
                type="url"
                required
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            {previewId && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={youtubeThumbnailUrl(previewId)}
                  alt="Aperçu"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Titre (FR) — optionnel
              </label>
              <input
                type="text"
                value={form.titleFr}
                onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Titre (EN) — optionnel
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Ordre d&apos;affichage
              </label>
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-[var(--sos-blue)] text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <p className="mb-4">Supprimer cette vidéo ?</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-[var(--sos-red)] text-white rounded-lg text-sm"
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
