"use client"

import { useI18n } from "@/lib/i18n"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/profile.php?id=61587351878517",
    label: "Facebook",
    Icon: Facebook,
  },
  {
    href: "https://x.com/Globalsos_asbl",
    label: "X (Twitter)",
    Icon: Twitter,
  },
  {
    href: "https://www.linkedin.com/company/global-sos-asbl/",
    label: "LinkedIn",
    Icon: Linkedin,
  },
]

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="text-white" style={{ backgroundColor: "#0235D6" }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Global SOS"
                width={60}
                height={60}
                className="rounded-lg bg-white p-1"
              />
              <span className="font-serif text-xl font-bold">Global SOS</span>
            </Link>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.footer.description}
            </p>
            <p className="text-sm font-medium italic text-white/90">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-serif text-lg font-semibold">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 transition-colors hover:text-white">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 transition-colors hover:text-white">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white/80 transition-colors hover:text-white">
                  {t.nav.news}
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-white/80 transition-colors hover:text-white">
                  {t.nav.donate}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 transition-colors hover:text-white">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-serif text-lg font-semibold">{t.footer.contactUs}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sos-red)]" />
                <span className="text-white/80">
                  Avenue Patrice Emery Lumumba,<br />
                  Commune d'Ibanda N°29<br />
                  Bukavu, Sud-Kivu, RDC
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[var(--sos-red)]" />
                <a
                  href="mailto:contact@globalsos.org"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  contact@globalsos.org
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-serif text-lg font-semibold">{t.footer.followUs}</h4>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[var(--sos-red)]"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} Global SOS ASBL. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
