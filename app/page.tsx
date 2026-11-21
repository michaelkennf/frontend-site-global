"use client"

import { I18nProvider } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ArticlesSection } from "@/components/articles-section"
import { ActivitiesSection } from "@/components/activities-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { PartnersSection } from "@/components/partners-section"
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
          <ArticlesSection />
          <ActivitiesSection />
          <TestimonialsSection />
          <PartnersSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
