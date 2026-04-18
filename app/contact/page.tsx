"use client"

import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Send, CheckCircle, Facebook, Twitter, Linkedin } from "lucide-react"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { SITE_MEDIA } from "@/lib/site-media-keys"

function ContactContent() {
  const { t, lang } = useI18n()
  const headerMedia = useSiteMediaKeys([SITE_MEDIA.CONTACT_HEADER])[SITE_MEDIA.CONTACT_HEADER]
  const headerSrc = headerMedia?.url ?? "/images/hero.png"
  const headerAlt =
    (lang === "fr" ? headerMedia?.altFr : headerMedia?.altEn)?.trim() || ""
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { messagesApi } = await import("@/lib/api")
    try {
      await messagesApi.send(formData)
      setSubmitted(true)
    } catch (err: any) {
      alert(err.message ?? "Erreur lors de l'envoi du message")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "#0a1e46" }}>
          <div className="absolute inset-0">
            <Image src={headerSrc} alt={headerAlt} fill className="object-cover object-center opacity-20" sizes="100vw" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t.contact.title}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t.contact.subtitle}
            </motion.p>
          </div>
        </section>

        <HeroRedDivider />

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif font-bold text-3xl text-gray-900 mb-8">
                  {lang === "fr" ? "Nos coordonnées" : "Our Contact Information"}
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--sos-blue-light)] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--sos-blue)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t.contact.address}</h3>
                      <p className="text-gray-600">
                        Avenue Patrice Emery Lumumba,<br />
                        Commune d'Ibanda N°29<br />
                        Bukavu, Sud-Kivu, RDC
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--sos-blue-light)] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[var(--sos-blue)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t.contact.emailLabel}</h3>
                      <a
                        href="mailto:contact@globalsos.org?subject=Contact%20Global%20SOS"
                        className="text-gray-600 hover:text-[var(--sos-blue)] transition-colors underline-offset-2 hover:underline font-medium"
                      >
                        contact@globalsos.org
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t.footer.followUs}</h3>
                  <div className="flex gap-3">
                    {[
                      { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61587351878517", label: "Facebook" },
                      { Icon: Twitter, href: "https://x.com/Globalsos_asbl", label: "X (Twitter)" },
                      { Icon: Linkedin, href: "https://www.linkedin.com/company/global-sos-asbl/", label: "LinkedIn" },
                    ].map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[var(--sos-blue)] hover:text-white transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="mt-10 rounded-2xl overflow-hidden h-64 bg-gray-100 relative">
                  <Image
                    src={headerSrc}
                    alt={headerAlt || (lang === "fr" ? "Localisation Global SOS" : "Global SOS location")}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gray-50 rounded-2xl p-8 lg:p-10">
                  <h2 className="font-serif font-bold text-3xl text-gray-900 mb-8">
                    {lang === "fr" ? "Envoyez-nous un message" : "Send us a message"}
                  </h2>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {lang === "fr" ? "Message envoyé !" : "Message sent!"}
                      </h3>
                      <p className="text-gray-600">{t.contact.success}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contact.name}
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contact.email}
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contact.subject}
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="h-12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contact.message}
                        </label>
                        <Textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-[var(--sos-red)] hover:bg-[var(--sos-red-dark)] text-white font-bold"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {t.contact.send}
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function ContactPage() {
  return (
    <I18nProvider>
      <ContactContent />
    </I18nProvider>
  )
}
