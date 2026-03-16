"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, CheckCircle } from "lucide-react"
import { newsletterApi } from "@/lib/api"

export function NewsletterSection() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")
    try {
      await newsletterApi.subscribe(email)
      setSubmitted(true)
      setEmail("")
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[var(--sos-blue-light)] py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl font-bold text-[var(--sos-blue)] md:text-4xl">
            {t.newsletter.title}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t.newsletter.subtitle}
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex items-center justify-center gap-2 text-green-600"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">{t.newsletter.success}</span>
            </motion.div>
          ) : (
            <>
              {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Input
                  type="email"
                  placeholder={t.newsletter.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 flex-1 border-[var(--sos-blue)]/30 bg-white text-base focus-visible:ring-[var(--sos-blue)]"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 bg-[var(--sos-red)] px-8 text-base font-semibold text-white hover:bg-[var(--sos-red-dark)]"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "..." : t.newsletter.button}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
