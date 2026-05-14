"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import Image from "next/image"
import { authApi, uploadsApi } from "@/lib/api"
import { isAuthenticated, getStoredUser, saveAuth } from "@/lib/auth"
import {
  User, Lock, Camera, Save, Loader2, CheckCircle,
  Eye, EyeOff, AlertCircle,
} from "lucide-react"

export default function AdminSettings() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [currentUser, setCurrentUser] = useState(getStoredUser())

  // Name
  const [name, setName] = useState("")
  const [nameSaving, setNameSaving] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const [nameError, setNameError] = useState("")

  // Password
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwdSaving, setPwdSaving] = useState(false)
  const [pwdSaved, setPwdSaved] = useState(false)
  const [pwdError, setPwdError] = useState("")

  // Avatar — init in useEffect to avoid SSR/hydration mismatch
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    const stored = getStoredUser()
    setCurrentUser(stored)
    setName(stored?.name ?? "")
    setAvatarUrl(stored?.avatar ?? "")
  }, [router])

  const initials = currentUser?.name
    ?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "??"

  async function handleSaveName() {
    if (!name.trim()) { setNameError("Le nom ne peut pas être vide"); return }
    setNameSaving(true); setNameError("")
    try {
      const updated = await authApi.updateProfile({ name: name.trim() })
      const token = localStorage.getItem("access_token") ?? ""
      saveAuth(token, { ...currentUser!, ...updated })
      setCurrentUser({ ...currentUser!, ...updated })
      window.dispatchEvent(new CustomEvent("user-updated"))
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 3000)
    } catch (err: any) {
      setNameError(err.message ?? "Erreur lors de la sauvegarde")
    } finally { setNameSaving(false) }
  }

  async function handleSavePassword() {
    if (!newPwd) { setPwdError("Le nouveau mot de passe est requis"); return }
    if (newPwd.length < 8) { setPwdError("Minimum 8 caractères"); return }
    if (newPwd !== confirmPwd) { setPwdError("Les mots de passe ne correspondent pas"); return }
    setPwdSaving(true); setPwdError("")
    try {
      await authApi.updateProfile({ password: newPwd })
      setPwdSaved(true)
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("")
      setTimeout(() => setPwdSaved(false), 3000)
    } catch (err: any) {
      setPwdError(err.message ?? "Erreur lors du changement de mot de passe")
    } finally { setPwdSaving(false) }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true); setAvatarError("")
    try {
      const url = await uploadsApi.uploadImage(file)
      const updated = await authApi.updateProfile({ avatar: url })
      const token = localStorage.getItem("access_token") ?? ""
      saveAuth(token, { ...currentUser!, ...updated })
      setCurrentUser({ ...currentUser!, ...updated })
      setAvatarUrl(url)
      window.dispatchEvent(new CustomEvent("user-updated"))
    } catch (err: any) {
      setAvatarError(err.message ?? "Erreur lors de l'upload")
    } finally {
      setAvatarUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl text-gray-900">Paramètres</h1>
            <p className="text-gray-500 mt-1">Gérez votre profil et vos informations personnelles</p>
          </div>

          <div className="space-y-6">

            {/* ── Photo de profil ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[var(--sos-blue)]" />
                Photo de profil
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[var(--sos-blue-light)]">
                      <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[var(--sos-blue)] flex items-center justify-center text-white text-2xl font-bold border-4 border-[var(--sos-blue-light)]">
                      {initials}
                    </div>
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={avatarUploading}
                    className="inline-flex items-center gap-2 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <Camera size={16} />
                    {avatarUploading ? "Envoi en cours…" : "Changer la photo"}
                  </button>
                  <p className="text-xs text-gray-400">JPG, PNG ou WebP — max 5 Mo</p>
                  {avatarError && (
                    <p className="text-xs text-[var(--sos-red)] flex items-center gap-1">
                      <AlertCircle size={12} /> {avatarError}
                    </p>
                  )}
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* ── Nom ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--sos-blue)]" />
                Nom affiché
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)] focus:border-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>
                {nameError && (
                  <p className="text-sm text-[var(--sos-red)] flex items-center gap-1">
                    <AlertCircle size={14} /> {nameError}
                  </p>
                )}
                <button
                  onClick={handleSaveName}
                  disabled={nameSaving || name === currentUser?.name}
                  className="inline-flex items-center gap-2 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  {nameSaving ? <Loader2 size={16} className="animate-spin" /> : nameSaved ? <CheckCircle size={16} /> : <Save size={16} />}
                  {nameSaved ? "Nom mis à jour !" : "Enregistrer"}
                </button>
              </div>
            </div>

            {/* ── Mot de passe ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--sos-blue)]" />
                Changer le mot de passe
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)] focus:border-transparent"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--sos-blue)] focus:border-transparent"
                    placeholder="Répétez le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pwdError && (
                  <p className="text-sm text-[var(--sos-red)] flex items-center gap-1">
                    <AlertCircle size={14} /> {pwdError}
                  </p>
                )}
                <button
                  onClick={handleSavePassword}
                  disabled={pwdSaving || !newPwd || !confirmPwd}
                  className="inline-flex items-center gap-2 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  {pwdSaving ? <Loader2 size={16} className="animate-spin" /> : pwdSaved ? <CheckCircle size={16} /> : <Lock size={16} />}
                  {pwdSaved ? "Mot de passe mis à jour !" : "Changer le mot de passe"}
                </button>
              </div>
            </div>

            {/* ── Infos lecture seule ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Informations du compte</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{currentUser?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">Rôle</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    currentUser?.role === "ADMIN"
                      ? "bg-[var(--sos-red-light)] text-[var(--sos-red)]"
                      : "bg-[var(--sos-blue-light)] text-[var(--sos-blue)]"
                  }`}>
                    {currentUser?.role === "ADMIN" ? "Administrateur" : "Gestionnaire"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
