"use client"

import { useEffect, useState } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import { UserCircle2 } from "lucide-react"
import { teamApi, TeamMember } from "@/lib/api"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { useSiteMediaKeys } from "@/hooks/use-site-media-keys"
import { SITE_MEDIA } from "@/lib/site-media-keys"
import { resolveMediaUrl } from "@/lib/media-url"

function TeamContent() {
  const { lang } = useI18n()
  const headerMedia = useSiteMediaKeys([SITE_MEDIA.ABOUT_HEADER])[SITE_MEDIA.ABOUT_HEADER]
  const headerSrc = headerMedia?.url ?? "/images/hero image.png"
  const headerAlt =
    (lang === "fr" ? headerMedia?.altFr : headerMedia?.altEn)?.trim() || ""

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamLoading, setTeamLoading] = useState(true)

  useEffect(() => {
    teamApi
      .getPublic()
      .then(setTeamMembers)
      .catch(() => setTeamMembers([]))
      .finally(() => setTeamLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-white flex items-end min-h-screen">
          <div className="absolute inset-0">
            <Image
              key={headerSrc}
              src={headerSrc}
              alt={headerAlt}
              fill
              className="object-cover"
              sizes="100vw"
              style={{ objectPosition: "center 25%" }}
              priority
            />
          </div>
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16 md:pb-20">
            <motion.h1
              className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-white text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {lang === "fr" ? "Notre équipe" : "Our team"}
            </motion.h1>
          </div>
        </section>

        <HeroRedDivider />

        <section id="notre-equipe" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif font-black text-4xl text-gray-900 mb-4">
                {lang === "fr" ? "Notre équipe" : "Our team"}
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                {lang === "fr"
                  ? "Les personnes engagées au quotidien pour protéger les vies et renforcer la résilience des communautés."
                  : "The people committed every day to protecting lives and strengthening community resilience."}
              </p>
              <div className="w-16 h-1 mx-auto mt-5 rounded-full bg-[var(--sos-blue)]" />
            </motion.div>

            {teamLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="text-center animate-pulse">
                    <div className="w-40 h-40 mx-auto mb-5 rounded-full bg-gray-200" />
                    <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-24 mx-auto" />
                  </div>
                ))}
              </div>
            ) : teamMembers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {lang === "fr"
                  ? "L'équipe sera bientôt présentée ici."
                  : "The team will be presented here soon."}
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {teamMembers.map((member, i) => {
                  const name = lang === "fr" ? member.nameFr : member.nameEn
                  const role = lang === "fr" ? member.roleFr : member.roleEn
                  const photo = member.image?.trim() ? resolveMediaUrl(member.image) : ""
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
                        {photo ? (
                          <Image src={photo} alt={name} fill className="object-cover object-center" sizes="160px" />
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
      </main>
      <Footer />
    </div>
  )
}

export default function AboutTeamPage() {
  return (
    <I18nProvider>
      <TeamContent />
    </I18nProvider>
  )
}
