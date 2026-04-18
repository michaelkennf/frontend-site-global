"use client"

import { useState, useEffect } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { donationsApi, DonationInfo } from "@/lib/api"
import Image from "next/image"
import {
  Smartphone,
  Building2,
  Heart,
  CheckCircle,
  Copy,
  AlertCircle,
  HandHeart,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { SITE_MEDIA } from "@/lib/site-media-keys"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
      title="Copier"
    >
      {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
    </button>
  )
}

function DonatePage() {
  const { lang } = useI18n()
  const heroBg = useSiteMediaKeys([SITE_MEDIA.DONATE_HERO_BG])[SITE_MEDIA.DONATE_HERO_BG]
  const heroSrc = heroBg?.url ?? "/images/donate-bg.png"
  const heroAlt =
    (lang === "fr" ? heroBg?.altFr : heroBg?.altEn)?.trim() || ""
  const [info, setInfo] = useState<DonationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    amount: "",
    method: "",
    notes: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const amounts = [10, 25, 50, 100, 250]

  useEffect(() => {
    donationsApi.getInfo().then(setInfo).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.method) {
      setError(lang === "fr" ? "Veuillez sélectionner une méthode de paiement." : "Please select a payment method.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await donationsApi.create({
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        amount: parseFloat(formData.amount),
        currency: "USD",
        method: formData.method,
        notes: formData.notes || undefined,
      })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de l'envoi")
    } finally {
      setSubmitting(false)
    }
  }

  const paymentMethods = info
    ? [
        {
          id: "mpesa",
          label: "M-Pesa",
          icon: "🟢",
          color: "#00a651",
          bg: "#e8f8f0",
          number: info.mpesaNumber,
          name: info.mpesaName,
        },
        {
          id: "airtel",
          label: "Airtel Money",
          icon: "🔴",
          color: "#e31e24",
          bg: "#fdeaea",
          number: info.airtelMoneyNumber,
          name: info.airtelMoneyName,
        },
        {
          id: "orange",
          label: "Orange Money",
          icon: "🟠",
          color: "#f97316",
          bg: "#fff3e0",
          number: info.orangeMoneyNumber,
          name: info.orangeMoneyName,
        },
        {
          id: "bank",
          label: lang === "fr" ? "Virement bancaire" : "Bank transfer",
          icon: "🏦",
          color: "var(--sos-blue)",
          bg: "#E6EFF9",
          number: info.bankAccountNumber,
          name: info.bankAccountName,
          extra: {
            bank: info.bankName,
            swift: info.bankSwift,
            iban: info.bankIban,
          },
        },
      ]
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "#0a1e46" }}>
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "rgba(10,30,70,0.72)" }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ background: "color-mix(in srgb, var(--sos-red) 18%, transparent)" }}
            >
              <HandHeart className="w-10 h-10 text-[var(--sos-red)]" />
            </motion.div>
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {lang === "fr" ? "Faire un don" : "Make a Donation"}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {info?.donationDescription ?? (lang === "fr"
                ? "Votre don soutient nos actions humanitaires à travers le monde. Chaque dollar compte."
                : "Your donation supports our humanitarian actions around the world. Every dollar counts.")}
            </motion.p>
          </div>
        </section>

        <HeroRedDivider />

        {/* Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto text-center bg-white rounded-2xl p-10 shadow-lg"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="font-serif font-bold text-2xl text-gray-900 mb-3">
                  {lang === "fr" ? "Merci pour votre don !" : "Thank you for your donation!"}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {lang === "fr"
                    ? "Votre intention de don a été enregistrée. Veuillez procéder au paiement via la méthode choisie en utilisant les informations ci-dessous."
                    : "Your donation intent has been recorded. Please proceed with payment via the chosen method using the information below."}
                </p>
                <Button
                  className="mt-6 bg-[var(--sos-blue)] text-white"
                  onClick={() => setSubmitted(false)}
                >
                  {lang === "fr" ? "Faire un autre don" : "Make another donation"}
                </Button>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Left: Payment info */}
                <div>
                  <h2 className="font-serif font-bold text-2xl text-gray-900 mb-6">
                    {lang === "fr" ? "Informations de paiement" : "Payment Information"}
                  </h2>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <motion.div
                          key={method.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{method.icon}</span>
                            <h3 className="font-bold text-gray-900">{method.label}</h3>
                          </div>
                          <div className="space-y-1.5 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-500 w-20">{lang === "fr" ? "Nom :" : "Name:"}</span>
                              <span className="font-semibold text-gray-900">{method.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-500 w-20">
                                {method.id === "bank" ? (lang === "fr" ? "Compte :" : "Account:") : (lang === "fr" ? "Numéro :" : "Number:")}
                              </span>
                              <span className="font-mono font-semibold text-gray-900">{method.number}</span>
                              <CopyButton text={method.number} />
                            </div>
                            {method.extra && (
                              <>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-gray-500 w-20">{lang === "fr" ? "Banque :" : "Bank:"}</span>
                                  <span>{method.extra.bank}</span>
                                </div>
                                {method.extra.swift && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-500 w-20">SWIFT :</span>
                                    <span className="font-mono">{method.extra.swift}</span>
                                    <CopyButton text={method.extra.swift} />
                                  </div>
                                )}
                                {method.extra.iban && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-500 w-20">IBAN :</span>
                                    <span className="font-mono">{method.extra.iban}</span>
                                    <CopyButton text={method.extra.iban} />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-[var(--sos-blue-light)] rounded-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-[var(--sos-blue)] shrink-0 mt-0.5" />
                    <p className="text-sm text-[var(--sos-blue-dark)] leading-relaxed">
                      {lang === "fr"
                        ? "Après votre transfert, veuillez remplir le formulaire à droite pour que nous puissions confirmer votre don. Mentionnez votre nom comme référence."
                        : "After your transfer, please fill out the form on the right so we can confirm your donation. Mention your name as the reference."}
                    </p>
                  </div>
                </div>

                {/* Right: Form */}
                <div>
                  <h2 className="font-serif font-bold text-2xl text-gray-900 mb-6">
                    {lang === "fr" ? "Enregistrer votre don" : "Register your donation"}
                  </h2>

                  <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-200 space-y-5">
                    {/* Amount */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        {lang === "fr" ? "Montant (USD $)" : "Amount (USD $)"}
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {amounts.map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => { setSelectedAmount(a); setFormData({ ...formData, amount: String(a) }) }}
                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                              selectedAmount === a
                                ? "bg-[var(--sos-red)] text-white border-[var(--sos-red)]"
                                : "border-gray-300 text-gray-700 hover:border-[var(--sos-red)] hover:text-[var(--sos-red)]"
                            }`}
                          >
                            ${a}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder={lang === "fr" ? "Autre montant..." : "Other amount..."}
                          value={formData.amount}
                          onChange={(e) => { setFormData({ ...formData, amount: e.target.value }); setSelectedAmount(null) }}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {lang === "fr" ? "Votre nom" : "Your name"}
                      </label>
                      <Input
                        placeholder={lang === "fr" ? "Nom complet" : "Full name"}
                        value={formData.donorName}
                        onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.donorEmail}
                        onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                        required
                      />
                    </div>

                    {/* Payment method */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {lang === "fr" ? "Méthode utilisée" : "Payment method used"}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["M-Pesa", "Airtel Money", "Orange Money", lang === "fr" ? "Virement bancaire" : "Bank transfer"].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setFormData({ ...formData, method: m })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              formData.method === m
                                ? "bg-[var(--sos-blue)] text-white border-[var(--sos-blue)]"
                                : "border-gray-200 text-gray-700 hover:border-[var(--sos-blue)]"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {lang === "fr" ? "Référence / Note (optionnel)" : "Reference / Note (optional)"}
                      </label>
                      <Input
                        placeholder={lang === "fr" ? "Ex: numéro de transaction..." : "Ex: transaction number..."}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    {error && (
                      <div className="flex gap-2 text-red-600 text-sm">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 bg-[var(--sos-red)] hover:bg-[var(--sos-red-dark)] text-white font-bold text-base"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {submitting
                        ? "..."
                        : lang === "fr" ? "Confirmer mon don" : "Confirm my donation"}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function DonatePageWrapper() {
  return (
    <I18nProvider>
      <DonatePage />
    </I18nProvider>
  )
}
