"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Image as ImageIcon } from "lucide-react"
import { isAuthenticated } from "@/lib/auth"

export default function AdminMedia() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-gray-900">Médiathèque</h1>
              <p className="text-gray-500 mt-1">0 fichier</p>
            </div>
          </div>

          {/* Media Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[var(--sos-blue)]" />
                Tous les fichiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 py-6 text-center">
                Aucune image dans la médiathèque.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
