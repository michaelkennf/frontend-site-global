"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Edit, Trash2, Shield, User, X, Save, Loader2, AlertCircle } from "lucide-react"
import { usersApi, AdminUser } from "@/lib/api"
import { isAuthenticated, getStoredUser } from "@/lib/auth"

const emptyForm = { email: "", password: "", name: "", role: "GESTIONNAIRE" as "ADMIN" | "GESTIONNAIRE", isActive: true }

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const currentUser = getStoredUser()

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    if (currentUser?.role !== "ADMIN") { router.push("/admin/dashboard"); return }
    fetchUsers()
  }, [router])

  async function fetchUsers() {
    setLoading(true)
    try { setUsers(await usersApi.getAll()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  function openCreate() { setEditingId(null); setForm(emptyForm); setError(""); setShowForm(true) }

  function openEdit(u: AdminUser) {
    setEditingId(u.id)
    setForm({ email: u.email, name: u.name, role: u.role, isActive: u.isActive, password: "" })
    setError(""); setShowForm(true)
  }

  async function handleSave() {
    setSaving(true); setError("")
    try {
      if (editingId) {
        const data: any = { email: form.email, name: form.name, role: form.role, isActive: form.isActive }
        if (form.password) data.password = form.password
        await usersApi.update(editingId, data)
      } else {
        if (!form.password) { setError("Le mot de passe est requis"); setSaving(false); return }
        await usersApi.create({ ...form })
      }
      setShowForm(false); fetchUsers()
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (id === currentUser?.id) { alert("Vous ne pouvez pas supprimer votre propre compte."); return }
    if (!confirm("Supprimer cet utilisateur ?")) return
    try {
      await usersApi.delete(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err: any) { alert(err.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-gray-900">Utilisateurs</h1>
              <p className="text-gray-500 mt-1">Gérez les accès à l'administration</p>
            </div>
            <Button className="bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)]" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />Nouvel utilisateur
            </Button>
          </div>

          {/* Form Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl">{editingId ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</h2>
                    <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="space-y-4">
                    <div><label className="text-sm font-medium text-gray-700 mb-1 block">Nom complet</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Marie Kabongo" /></div>
                    <div><label className="text-sm font-medium text-gray-700 mb-1 block">Email</label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="marie@globalsos.org" /></div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Mot de passe {editingId ? "(laisser vide pour ne pas changer)" : ""}
                      </label>
                      <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Rôle</label>
                      <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
                        <option value="GESTIONNAIRE">Gestionnaire du site</option>
                        <option value="ADMIN">Administrateur</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Compte actif</label>
                    </div>
                    {error && <div className="flex gap-2 text-red-600 text-sm"><AlertCircle size={16} className="shrink-0 mt-0.5" />{error}</div>}
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--sos-blue)]" />
                Tous les utilisateurs ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                        <th className="pb-3 pr-4">Utilisateur</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Rôle</th>
                        <th className="pb-3 pr-4">Statut</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <motion.tr key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-gray-100 last:border-0">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[var(--sos-blue)] flex items-center justify-center text-white font-bold text-sm">
                                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-sm text-gray-500">{user.email}</td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-1">
                              {user.role === "ADMIN" ? <Shield className="w-4 h-4 text-[var(--sos-red)]" /> : <User className="w-4 h-4 text-gray-400" />}
                              <span className="text-sm text-gray-700">{user.role === "ADMIN" ? "Administrateur" : "Gestionnaire"}</span>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {user.isActive ? "Actif" : "Inactif"}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEdit(user)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit className="w-4 h-4 text-gray-500" /></button>
                              {user.id !== currentUser?.id && (
                                <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                              )}
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
