"use client"

import { I18nProvider } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { AreasSection } from "@/components/areas-section"
import { ActivitiesSection } from "@/components/activities-section"
import { NewsSection } from "@/components/news-section"
import { DonateSection } from "@/components/donate-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { PartnersSection } from "@/components/partners-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <I18nProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <AboutSection />
          <StatsSection />
          <AreasSection />
          <ActivitiesSection />
          <NewsSection />
          <DonateSection />
          <PartnersSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
