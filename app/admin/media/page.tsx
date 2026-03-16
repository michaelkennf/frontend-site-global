"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Trash2, Download } from "lucide-react"
import Image from "next/image"

const mediaFiles = [
  { id: 1, name: "hero.jpg", size: "1.2 MB", date: "15 Mars 2026", src: "/images/hero.jpg" },
  { id: 2, name: "about.jpg", size: "890 KB", date: "14 Mars 2026", src: "/images/about.jpg" },
  { id: 3, name: "activity1.jpg", size: "756 KB", date: "13 Mars 2026", src: "/images/activity1.jpg" },
  { id: 4, name: "activity2.jpg", size: "923 KB", date: "12 Mars 2026", src: "/images/activity2.jpg" },
  { id: 5, name: "activity3.jpg", size: "845 KB", date: "11 Mars 2026", src: "/images/activity3.jpg" },
  { id: 6, name: "donate.jpg", size: "1.1 MB", date: "10 Mars 2026", src: "/images/donate.jpg" },
]

export default function AdminMedia() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_authenticated")
    if (!isAuth) {
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
              <p className="text-gray-500 mt-1">{mediaFiles.length} fichiers</p>
            </div>
            <Button className="bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)]">
              <Upload className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>

          {/* Upload Zone */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[var(--sos-blue)] transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  Glissez-déposez vos fichiers ici ou cliquez pour parcourir
                </p>
                <p className="text-sm text-gray-400">PNG, JPG, GIF jusqu'à 10MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Media Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[var(--sos-blue)]" />
                Tous les fichiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {mediaFiles.map((file, i) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={file.src}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                          <Download className="w-4 h-4 text-gray-700" />
                        </button>
                        <button className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
