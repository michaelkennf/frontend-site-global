"use client"

import { I18nProvider } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ActivitiesSection } from "@/components/activities-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { PartnersSection } from "@/components/partners-section"
import { VideosSection } from "@/components/videos-section"
import { Footer } from "@/components/footer"
import { HeroRedDivider } from "@/components/hero-red-divider"

export default function HomePage() {
  return (
    <I18nProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <HeroRedDivider />
          <AboutSection />
          <ActivitiesSection />
          <VideosSection />
          <PartnersSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
