"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { useI18n, Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { t, lang, setLang } = useI18n()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.work, href: "/#work" },
    { label: t.nav.news, href: "/news" },
    { label: t.nav.contact, href: "/contact" },
  ]

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo.png"
                alt="Global SOS Logo"
                width={56}
                height={56}
                className="rounded-full object-cover w-14 h-14 group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <span className="font-serif font-bold text-xl" style={{ color: "#0057B8" }}>
                  Global
                </span>
                <span className="font-serif font-black text-xl" style={{ color: "#E31E24" }}>
                  {" "}SOS
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isScrolled
                      ? "text-gray-700 hover:text-[#0057B8] hover:bg-[var(--sos-blue-light)]"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side: Lang toggle + Donate */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language switcher */}
              <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/20">
                {(["fr", "en"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full transition-all uppercase",
                      lang === l
                        ? "bg-[#0057B8] text-white shadow"
                        : isScrolled
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
                className="bg-[#E31E24] hover:bg-[#b8171c] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow"
              >
                {t.nav.donate}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-md",
                isScrolled ? "text-gray-700" : "text-white"
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#0057B8] hover:bg-[var(--sos-blue-light)] rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {(["fr", "en"] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setMobileOpen(false) }}
                        className={cn(
                          "px-3 py-1.5 text-xs font-bold rounded-full uppercase transition-all",
                          lang === l
                            ? "bg-[#0057B8] text-white"
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
                    className="flex-1 text-center bg-[#E31E24] hover:bg-[#b8171c] text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
                  >
                    {t.nav.donate}
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
