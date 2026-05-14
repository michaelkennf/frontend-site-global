"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { useI18n, Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { DOMAIN_DISPLAY_ORDER } from "@/lib/domain-assets"
import { useSiteContent } from "@/hooks/use-site-content"

export function Navbar() {
  const { t, lang, setLang } = useI18n()
  const { c } = useSiteContent("nav", lang)
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [domainsOpen, setDomainsOpen] = useState(false)
  const [mobileDomainsOpen, setMobileDomainsOpen] = useState(false)
  const domainsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (domainsRef.current && !domainsRef.current.contains(event.target as Node)) {
        setDomainsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setDomainsOpen(false)
    setMobileOpen(false)
    setMobileDomainsOpen(false)
  }, [pathname])

  const navLinks = [
    { label: c("nav.home", t.nav.home), href: "/" },
    { label: c("nav.about", t.nav.about), href: "/about" },
    { label: c("nav.domains", t.nav.domains), href: "/domaines", hasDropdown: true },
    { label: c("nav.news", t.nav.news), href: "/news" },
    { label: c("nav.contact", t.nav.contact), href: "/contact" },
  ]

  const domainLinks = DOMAIN_DISPLAY_ORDER.map((slug) => ({
    slug,
    title: t.domainPages[slug].title,
    excerpt: t.domainPages[slug].excerpt,
  }))
  const useSolidNav = isScrolled || pathname !== "/"

  const linkActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/domaines") return pathname === "/domaines" || pathname.startsWith("/domaines/")
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          useSolidNav
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo SOS.png"
                alt="Global SOS Logo"
                width={56}
                height={56}
                className="rounded-full object-cover w-14 h-14 group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <span className="font-serif font-bold text-xl" style={{ color: "var(--sos-blue)" }}>
                  Global
                </span>
                <span className="font-serif font-black text-xl" style={{ color: "var(--sos-red)" }}>
                  {" "}SOS
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = linkActive(link.href)

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.href}
                      ref={domainsRef}
                      className="relative"
                      onMouseEnter={() => setDomainsOpen(true)}
                      onMouseLeave={() => setDomainsOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() => setDomainsOpen((v) => !v)}
                        className={cn(
                          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors border-b-2 border-transparent",
                          useSolidNav
                            ? active
                              ? "text-[var(--sos-red)] border-[var(--sos-red)] bg-transparent"
                              : "text-gray-700 hover:text-[var(--sos-blue)] hover:bg-[var(--sos-blue-light)]"
                            : active
                              ? "text-white border-[var(--sos-red)] bg-black/25"
                              : "text-white hover:text-white bg-black/20 hover:bg-black/35"
                        )}
                        aria-expanded={domainsOpen}
                        aria-haspopup="menu"
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={cn("transition-transform", domainsOpen && "rotate-180")}
                        />
                      </button>
                      <AnimatePresence>
                        {domainsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.18 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[22rem]"
                            role="menu"
                          >
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                              <Link
                                href="/domaines"
                                className="block px-5 py-3 bg-gradient-to-r from-[var(--sos-blue-light)] to-white border-b border-gray-100 text-sm font-bold text-[var(--sos-blue-dark)] hover:bg-[var(--sos-blue-light)] transition-colors"
                              >
                                {t.domainPages.indexTitle}
                              </Link>
                              <div className="py-2">
                                {domainLinks.map((d) => (
                                  <Link
                                    key={d.slug}
                                    href={`/domaines/${d.slug}`}
                                    className="block px-5 py-3 hover:bg-gray-50 transition-colors group"
                                    role="menuitem"
                                  >
                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-[var(--sos-red)] transition-colors mb-0.5">
                                      {d.title}
                                    </div>
                                    <div className="text-xs text-gray-500 leading-snug line-clamp-2">
                                      {d.excerpt}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors border-b-2 border-transparent",
                      useSolidNav
                        ? active
                          ? "text-[var(--sos-red)] border-[var(--sos-red)] bg-transparent"
                          : "text-gray-700 hover:text-[var(--sos-blue)] hover:bg-[var(--sos-blue-light)]"
                        : active
                          ? "text-white border-[var(--sos-red)] bg-black/25"
                          : "text-white hover:text-white bg-black/20 hover:bg-black/35"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <div className={cn(
                "flex items-center gap-1 rounded-full p-1",
                useSolidNav ? "border border-gray-200 bg-white" : "border border-white/20 bg-black/25"
              )}>
                {(["fr", "en"] as Language[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full transition-all uppercase",
                      lang === l
                        ? "bg-[var(--sos-red)] text-white"
                        : useSolidNav
                          ? "text-gray-600 hover:bg-gray-100"
                          : "text-white/80 hover:text-white"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Link
                href="/donate"
                className="bg-[var(--sos-red)] hover:bg-[var(--sos-red-dark)] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
              >
                {c("nav.donate", t.nav.donate)}
              </Link>
            </div>

            <button
              className={cn(
                "lg:hidden p-2 rounded-md",
                useSolidNav ? "text-gray-700" : "text-white bg-black/25"
              )}
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = linkActive(link.href)

                  if (link.hasDropdown) {
                    return (
                      <div key={link.href} className="flex flex-col">
                        <div className="flex items-stretch">
                          <Link
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors border-l-4",
                              active
                                ? "text-[var(--sos-red)] border-[var(--sos-red)] bg-[var(--sos-red-light)]"
                                : "text-gray-700 hover:text-[var(--sos-blue)] hover:bg-[var(--sos-blue-light)] border-transparent"
                            )}
                          >
                            {link.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setMobileDomainsOpen((v) => !v)}
                            className="px-3 text-gray-500 hover:text-[var(--sos-blue)] transition-colors"
                            aria-label="Toggle domains submenu"
                            aria-expanded={mobileDomainsOpen}
                          >
                            <ChevronDown
                              size={18}
                              className={cn("transition-transform", mobileDomainsOpen && "rotate-180")}
                            />
                          </button>
                        </div>
                        <AnimatePresence>
                          {mobileDomainsOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-3 pl-3 border-l border-gray-100 mt-1 mb-2 space-y-1"
                            >
                              {domainLinks.map((d) => (
                                <Link
                                  key={d.slug}
                                  href={`/domaines/${d.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-[var(--sos-red)] hover:bg-gray-50 rounded-md"
                                >
                                  {d.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "px-4 py-3 text-sm font-medium rounded-md transition-colors border-l-4",
                        active
                          ? "text-[var(--sos-red)] border-[var(--sos-red)] bg-[var(--sos-red-light)]"
                          : "text-gray-700 hover:text-[var(--sos-blue)] hover:bg-[var(--sos-blue-light)] border-transparent"
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {(["fr", "en"] as Language[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => { setLang(l); setMobileOpen(false) }}
                        className={cn(
                          "px-3 py-1.5 text-xs font-bold rounded-full uppercase transition-all",
                          lang === l
                            ? "bg-[var(--sos-red)] text-white"
                            : "text-gray-600 border border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <Link
                    href="/donate"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center bg-[var(--sos-red)] hover:bg-[var(--sos-red-dark)] text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
                  >
                    {c("nav.donate", t.nav.donate)}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
