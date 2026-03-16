"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Trash2, Check, Clock, User, Loader2 } from "lucide-react"
import { messagesApi, Message } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"

export default function AdminMessages() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin"); return }
    fetchMessages()
  }, [router])

  async function fetchMessages() {
    setLoading(true)
    try { setMessages(await messagesApi.getAll()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleMarkRead(msg: Message) {
    if (msg.read) return
    try {
      await messagesApi.markRead(msg.id)
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m))
      setSelected({ ...msg, read: true })
    } catch (e) { console.error(e) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce message ?")) return
    try {
      await messagesApi.delete(id)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (e) { console.error(e) }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl text-gray-900">Messages</h1>
            <p className="text-gray-500 mt-1">{unreadCount} message{unreadCount !== 1 ? "s" : ""} non lu{unreadCount !== 1 ? "s" : ""}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[var(--sos-blue)]" />
                  Boîte de réception
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">Aucun message</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {messages.map((message, i) => (
                      <motion.button
                        key={message.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { setSelected(message); handleMarkRead(message) }}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selected?.id === message.id ? "bg-blue-50" : ""} ${!message.read ? "bg-blue-50/50" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${!message.read ? "bg-[var(--sos-blue)]" : "bg-gray-200"}`}>
                            <User className={`w-4 h-4 ${!message.read ? "text-white" : "text-gray-500"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`font-medium truncate text-sm ${!message.read ? "text-gray-900" : "text-gray-600"}`}>{message.name}</span>
                              <span className="text-xs text-gray-400 shrink-0">{new Date(message.createdAt).toLocaleDateString("fr-FR")}</span>
                            </div>
                            <p className={`text-xs truncate ${!message.read ? "text-gray-700" : "text-gray-500"}`}>{message.subject}</p>
                          </div>
                          {!message.read && <div className="w-2 h-2 rounded-full bg-[var(--sos-red)] shrink-0 mt-1.5" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              {selected ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{selected.subject}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <User className="w-4 h-4" />{selected.name}
                          <span className="text-gray-300">|</span>
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${selected.email}`} className="text-[var(--sos-blue)] hover:underline">{selected.email}</a>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(selected.createdAt).toLocaleString("fr-FR")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                    <div className="flex gap-3 mt-8">
                      <Button asChild className="bg-[var(--sos-blue)] hover:bg-[var(--sos-blue-dark)]">
                        <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}>
                          <Mail className="w-4 h-4 mr-2" />Répondre
                        </a>
                      </Button>
                      {!selected.read && (
                        <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleMarkRead(selected)}>
                          <Check className="w-4 h-4 mr-2" />Marquer comme lu
                        </Button>
                      )}
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDelete(selected.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <MessageSquare className="w-12 h-12 mb-4" />
                  <p>Sélectionnez un message pour le lire</p>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
