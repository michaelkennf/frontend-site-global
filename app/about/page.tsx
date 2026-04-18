"use client"

import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import { Target, Eye, Heart, Users, Globe, Shield, UserCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { teamApi, TeamMember } from "@/lib/api"
import { valueIcons } from "@/components/about-section"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { SITE_MEDIA } from "@/lib/site-media-keys"

function AboutContent() {
  const { t, lang } = useI18n()
  const headerMedia = useSiteMediaKeys([SITE_MEDIA.ABOUT_HEADER])[SITE_MEDIA.ABOUT_HEADER]
  const headerSrc = headerMedia?.url ?? "/images/about-header.jpg"
  const headerAlt =
    (lang === "fr" ? headerMedia?.altFr : headerMedia?.altEn)?.trim() || ""

  const principles = t.about.principlesList
  const values = t.about.valuesList

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamLoading, setTeamLoading] = useState(true)

  useEffect(() => {
    teamApi.getPublic()
      .then(setTeamMembers)
      .catch(() => setTeamMembers([]))
      .finally(() => setTeamLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "#0a1e46" }}>
          <div className="absolute inset-0">
            <Image
              src={headerSrc}
              alt={headerAlt}
              fill
              className="object-cover"
              sizes="100vw"
              style={{ objectPosition: "center 25%", opacity: 0.45 }}
              priority
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(10,30,70,0.55) 0%, rgba(10,30,70,0.75) 100%)" }}
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t.about.title}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t.about.description}
            </motion.p>
          </div>
        </section>

        <HeroRedDivider />

        {/* Qui sommes-nous */}
        <section className="py-16 md:py-24 bg-gray-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="rounded-3xl bg-white border border-gray-100 shadow-sm p-8 md:p-12 lg:p-14"
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sos-blue)] mb-5">
                <span className="h-px w-10 bg-[var(--sos-blue)]/35" aria-hidden />
                {lang === "fr" ? "Présentation" : "Introduction"}
              </span>
              <h2 className="font-serif font-black text-3xl md:text-4xl text-gray-900 mb-8 text-balance leading-tight">
                {t.about.whoWeAreTitle}
              </h2>
              <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
                {t.about.whoWeAreParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                className="bg-[var(--sos-blue-light)] rounded-2xl p-8 lg:p-10"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--sos-blue)] flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-serif font-bold text-2xl text-gray-900 mb-4">{t.about.mission}</h2>
                <p className="text-gray-600 leading-relaxed">{t.about.missionText}</p>
              </motion.div>

              <motion.div
                className="bg-[var(--sos-red-light)] rounded-2xl p-8 lg:p-10"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--sos-red)] flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-serif font-bold text-2xl text-gray-900 mb-4">{t.about.vision}</h2>
                <p className="text-gray-600 leading-relaxed">{t.about.visionText}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif font-black text-4xl text-gray-900 mb-4">{t.about.values}</h2>
              <div className="w-16 h-1 mx-auto rounded-full bg-[var(--sos-red)]" />
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {values.map((value, i) => {
                const vi = valueIcons[i] ?? valueIcons[0]
                const Icon = vi.icon
                return (
                  <motion.div
                    key={value}
                    className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: vi.bg }}
                    >
                      <Icon size={26} style={{ color: vi.color }} strokeWidth={1.8} />
                    </div>
                    <span className="font-bold text-gray-800 text-sm leading-snug">{value}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-20 bg-[var(--sos-blue)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif font-black text-4xl text-white mb-4">{t.about.principles}</h2>
              <div className="w-16 h-1 mx-auto rounded-full bg-[var(--sos-red)]" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((principle, i) => {
                const icons = [Shield, Users, Globe, Heart]
                const Icon = icons[i % icons.length]
                return (
                  <motion.div
                    key={principle}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Icon className="w-10 h-10 mx-auto mb-4 text-[var(--sos-red)]" />
                    <span className="font-bold text-white text-lg">{principle}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        {(teamLoading || teamMembers.length > 0) && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-14"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif font-black text-4xl text-gray-900 mb-4">
                  {lang === "fr" ? "Notre Équipe" : "Our Team"}
                </h2>
                <div className="w-16 h-1 mx-auto rounded-full bg-[var(--sos-blue)]" />
              </motion.div>

              {teamLoading ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="text-center animate-pulse">
                      <div className="w-40 h-40 mx-auto mb-5 rounded-full bg-gray-200" />
                      <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-24 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {teamMembers.map((member, i) => {
                    const name = lang === "fr" ? member.nameFr : member.nameEn
                    const role = lang === "fr" ? member.roleFr : member.roleEn
                    return (
                      <motion.div
                        key={member.id}
                        className="text-center group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="relative w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow bg-gray-100 flex items-center justify-center">
                          {member.image ? (
                            <Image src={member.image} alt={name} fill className="object-cover object-center" sizes="160px" />
                          ) : (
                            <UserCircle2 className="w-20 h-20 text-gray-300" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                        <p className="text-[var(--sos-blue)] text-sm font-medium">{role}</p>
                        {member.bio && (
                          <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto leading-relaxed">{member.bio}</p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function AboutPage() {
  return (
    <I18nProvider>
      <AboutContent />
    </I18nProvider>
  )
}
