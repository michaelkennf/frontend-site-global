"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"
import { login, isAuthenticated } from "@/lib/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })

  useEffect(() => {
    if (isAuthenticated()) router.push("/admin/dashboard")
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(formData.email, formData.password)
      router.push("/admin/dashboard")
    } catch (err: any) {
      setError(err.message ?? "Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--sos-blue)]">
        <Image src="/images/hero.jpg" alt="Global SOS" fill className="object-cover opacity-30" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Image src="/images/logo.jpeg" alt="Global SOS Logo" width={100} height={100} className="mb-8 rounded-xl" />
          <h1 className="font-serif font-black text-4xl mb-4">Global SOS</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Espace administration pour la gestion du contenu, des dons et des communications.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Image src="/images/logo.jpeg" alt="Global SOS Logo" width={60} height={60} className="rounded-lg" />
            <div>
              <span className="font-serif font-bold text-xl text-[var(--sos-blue)]">Global</span>
              <span className="font-serif font-black text-xl text-[var(--sos-red)]"> SOS</span>
            </div>
          </div>

          <h2 className="font-serif font-bold text-3xl text-gray-900 mb-2">Administration</h2>
          <p className="text-gray-500 mb-8">Connectez-vous pour accéder au tableau de bord</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  required
                  placeholder="admin@globalsos.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)] text-white font-bold"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-500">
              <strong>Admin :</strong> admin@globalsos.org / Admin@2026!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
