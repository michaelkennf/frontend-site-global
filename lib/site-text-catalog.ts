import { translations } from "@/lib/i18n"

export type SiteTextCatalogEntry = {
  section: string
  key: string
  label: string
  multiline: boolean
  defaultFr: string
  defaultEn: string
}

const fr = translations.fr
const en = translations.en

const DOMAIN_SLUGS = ["risques-catastrophes", "urgences-sanitaires", "justice-climatique"] as const

function domainEntries(): SiteTextCatalogEntry[] {
  const out: SiteTextCatalogEntry[] = []
  for (const slug of DOMAIN_SLUGS) {
    const dFr = fr.domainPages[slug]
    const dEn = en.domainPages[slug]
    const labelBase = slug.replace(/-/g, " ")
    out.push(
      {
        section: `domain-${slug}`,
        key: `domain.${slug}.title`,
        label: `Domaine (${labelBase}) — Titre`,
        multiline: false,
        defaultFr: dFr.title,
        defaultEn: dEn.title,
      },
      {
        section: `domain-${slug}`,
        key: `domain.${slug}.excerpt`,
        label: `Domaine (${labelBase}) — Chapô`,
        multiline: true,
        defaultFr: dFr.excerpt,
        defaultEn: dEn.excerpt,
      },
      {
        section: `domain-${slug}`,
        key: `domain.${slug}.lead`,
        label: `Domaine (${labelBase}) — Texte d'introduction`,
        multiline: true,
        defaultFr: dFr.lead,
        defaultEn: dEn.lead,
      },
      {
        section: `domain-${slug}`,
        key: `domain.${slug}.body`,
        label: `Domaine (${labelBase}) — Paragraphes (séparés par une ligne vide)`,
        multiline: true,
        defaultFr: dFr.paragraphs.join("\n\n"),
        defaultEn: dEn.paragraphs.join("\n\n"),
      },
    )
  }
  return out
}

/** Tous les textes éditables (clés alignées avec les fallbacks i18n). */
export const SITE_TEXT_CATALOG: SiteTextCatalogEntry[] = [
  // Navigation
  { section: "nav", key: "nav.home", label: "Menu — Accueil", multiline: false, defaultFr: fr.nav.home, defaultEn: en.nav.home },
  { section: "nav", key: "nav.about", label: "Menu — À propos", multiline: false, defaultFr: fr.nav.about, defaultEn: en.nav.about },
  { section: "nav", key: "nav.domains", label: "Menu — Domaines", multiline: false, defaultFr: fr.nav.domains, defaultEn: en.nav.domains },
  { section: "nav", key: "nav.work", label: "Menu — Nos actions", multiline: false, defaultFr: fr.nav.work, defaultEn: en.nav.work },
  { section: "nav", key: "nav.news", label: "Menu — Actualités", multiline: false, defaultFr: fr.nav.news, defaultEn: en.nav.news },
  { section: "nav", key: "nav.research", label: "Menu — Recherche", multiline: false, defaultFr: fr.nav.research, defaultEn: en.nav.research },
  { section: "nav", key: "nav.donate", label: "Menu — Don", multiline: false, defaultFr: fr.nav.donate, defaultEn: en.nav.donate },
  { section: "nav", key: "nav.contact", label: "Menu — Contact", multiline: false, defaultFr: fr.nav.contact, defaultEn: en.nav.contact },
  { section: "nav", key: "nav.zones", label: "Menu — Nos zones d'intervention", multiline: false, defaultFr: fr.nav.zones, defaultEn: en.nav.zones },
  { section: "zones", key: "zones.titleOur", label: "Zones — Titre (1re partie, ex. Nos)", multiline: false, defaultFr: fr.zones.titleOur, defaultEn: en.zones.titleOur },
  { section: "zones", key: "zones.titleRest", label: "Zones — Titre (suite)", multiline: false, defaultFr: fr.zones.titleRest, defaultEn: en.zones.titleRest },
  { section: "zones", key: "zones.body", label: "Zones — Texte principal", multiline: true, defaultFr: fr.zones.body, defaultEn: en.zones.body },
  // Hero & bloc à propos (accueil)
  { section: "hero", key: "hero.headline", label: "Accueil — Hero titre", multiline: false, defaultFr: fr.hero.headline, defaultEn: en.hero.headline },
  { section: "hero", key: "hero.subtitle", label: "Accueil — Hero sous-titre", multiline: true, defaultFr: fr.hero.sub, defaultEn: en.hero.sub },
  { section: "hero", key: "hero.learnMore", label: "Accueil — Hero bouton En savoir plus", multiline: false, defaultFr: fr.hero.learnMore, defaultEn: en.hero.learnMore },
  { section: "hero", key: "hero.donate", label: "Accueil — Hero bouton Don", multiline: false, defaultFr: fr.hero.donate, defaultEn: en.hero.donate },
  { section: "about", key: "about.homeAboutEyebrow", label: "Accueil — Surtitre (notre organisation)", multiline: false, defaultFr: fr.about.homeAboutEyebrow, defaultEn: en.about.homeAboutEyebrow },
  { section: "about", key: "about.title", label: "Accueil — Qui sommes-nous (titre)", multiline: false, defaultFr: fr.about.whoWeAreTitle, defaultEn: en.about.whoWeAreTitle },
  { section: "about", key: "about.description", label: "Accueil — Qui sommes-nous (texte)", multiline: true, defaultFr: fr.about.whoWeAreParagraphs.join("\n\n"), defaultEn: en.about.whoWeAreParagraphs.join("\n\n") },
  { section: "contact", key: "contact.title", label: "Page contact — Titre", multiline: false, defaultFr: fr.contact.title, defaultEn: en.contact.title },
  { section: "contact", key: "contact.subtitle", label: "Page contact — Sous-titre", multiline: true, defaultFr: fr.contact.subtitle, defaultEn: en.contact.subtitle },
  { section: "contact", key: "contact.address", label: "Page contact — Adresse", multiline: true, defaultFr: "Avenue Patrice Emery Lumumba,\nCommune d'Ibanda N°29\nBukavu, Sud-Kivu, RDC", defaultEn: "Avenue Patrice Emery Lumumba,\nCommune d'Ibanda N°29\nBukavu, Sud-Kivu, DRC" },
  { section: "footer", key: "footer.tagline", label: "Pied de page — Accroche", multiline: false, defaultFr: fr.footer.tagline, defaultEn: en.footer.tagline },
  { section: "footer", key: "footer.mission", label: "Pied de page — Texte mission (court)", multiline: true, defaultFr: fr.about.missionText, defaultEn: en.about.missionText },
  // Footer
  { section: "footer", key: "footer.description", label: "Pied de page — Description", multiline: true, defaultFr: fr.footer.description, defaultEn: en.footer.description },
  { section: "footer", key: "footer.quickLinks", label: "Pied de page — Titre liens rapides", multiline: false, defaultFr: fr.footer.quickLinks, defaultEn: en.footer.quickLinks },
  { section: "footer", key: "footer.followUs", label: "Pied de page — Suivez-nous", multiline: false, defaultFr: fr.footer.followUs, defaultEn: en.footer.followUs },
  { section: "footer", key: "footer.contactUs", label: "Pied de page — Contactez-nous", multiline: false, defaultFr: fr.footer.contactUs, defaultEn: en.footer.contactUs },
  { section: "footer", key: "footer.rights", label: "Pied de page — Mentions droits", multiline: false, defaultFr: fr.footer.rights, defaultEn: en.footer.rights },
  // Blocs page d'accueil
  { section: "areas", key: "areas.title", label: "Accueil — Domaines (titre)", multiline: false, defaultFr: fr.areas.title, defaultEn: en.areas.title },
  { section: "areas", key: "areas.subtitle", label: "Accueil — Domaines (sous-titre)", multiline: false, defaultFr: fr.areas.subtitle, defaultEn: en.areas.subtitle },
  { section: "areas", key: "areas.area1Title", label: "Accueil — Domaine 1 titre", multiline: false, defaultFr: fr.areas.area1Title, defaultEn: en.areas.area1Title },
  { section: "areas", key: "areas.area1Desc", label: "Accueil — Domaine 1 description", multiline: true, defaultFr: fr.areas.area1Desc, defaultEn: en.areas.area1Desc },
  { section: "areas", key: "areas.area2Title", label: "Accueil — Domaine 2 titre", multiline: false, defaultFr: fr.areas.area2Title, defaultEn: en.areas.area2Title },
  { section: "areas", key: "areas.area2Desc", label: "Accueil — Domaine 2 description", multiline: true, defaultFr: fr.areas.area2Desc, defaultEn: en.areas.area2Desc },
  { section: "areas", key: "areas.area3Title", label: "Accueil — Domaine 3 titre", multiline: false, defaultFr: fr.areas.area3Title, defaultEn: en.areas.area3Title },
  { section: "areas", key: "areas.area3Desc", label: "Accueil — Domaine 3 description", multiline: true, defaultFr: fr.areas.area3Desc, defaultEn: en.areas.area3Desc },
  { section: "activities", key: "activities.title", label: "Accueil — Actualités (titre)", multiline: false, defaultFr: fr.activities.title, defaultEn: en.activities.title },
  { section: "activities", key: "activities.subtitle", label: "Accueil — Actualités (sous-titre)", multiline: false, defaultFr: fr.activities.subtitle, defaultEn: en.activities.subtitle },
  { section: "activities", key: "activities.viewAll", label: "Accueil — Lien tout voir actualités", multiline: false, defaultFr: fr.activities.viewAll, defaultEn: en.activities.viewAll },
  { section: "news", key: "news.title", label: "Page actualités — Titre", multiline: false, defaultFr: fr.news.title, defaultEn: en.news.title },
  { section: "news", key: "news.subtitle", label: "Page actualités — Sous-titre", multiline: true, defaultFr: fr.news.subtitle, defaultEn: en.news.subtitle },
  { section: "news", key: "news.readMore", label: "Page actualités — Lire la suite", multiline: false, defaultFr: fr.news.readMore, defaultEn: en.news.readMore },
  { section: "news", key: "news.filterTitle", label: "Page actualités — Filtre titre", multiline: false, defaultFr: fr.news.filterTitle, defaultEn: en.news.filterTitle },
  { section: "news", key: "news.filterAll", label: "Page actualités — Filtre tout", multiline: false, defaultFr: fr.news.filterAll, defaultEn: en.news.filterAll },
  { section: "news", key: "news.featured", label: "Page actualités — À la une", multiline: false, defaultFr: fr.news.featured, defaultEn: en.news.featured },
  { section: "news", key: "news.latest", label: "Page actualités — Derniers articles", multiline: false, defaultFr: fr.news.latest, defaultEn: en.news.latest },
  { section: "news", key: "news.empty", label: "Page actualités — Vide", multiline: false, defaultFr: fr.news.empty, defaultEn: en.news.empty },
  { section: "news", key: "news.readingMin", label: "Page actualités — min de lecture", multiline: false, defaultFr: fr.news.readingMin, defaultEn: en.news.readingMin },
  { section: "news", key: "news.shareTitle", label: "Page actualités — Partager", multiline: false, defaultFr: fr.news.shareTitle, defaultEn: en.news.shareTitle },
  { section: "news", key: "news.backToList", label: "Page actualités — Retour liste", multiline: false, defaultFr: fr.news.backToList, defaultEn: en.news.backToList },
  { section: "news", key: "news.relatedTitle", label: "Page actualités — Articles connexes", multiline: false, defaultFr: fr.news.relatedTitle, defaultEn: en.news.relatedTitle },
  { section: "donate", key: "donate.title", label: "Page don — Titre hero", multiline: false, defaultFr: fr.donate.title, defaultEn: en.donate.title },
  { section: "donate", key: "donate.subtitle", label: "Page don — Sous-titre hero", multiline: true, defaultFr: fr.donate.subtitle, defaultEn: en.donate.subtitle },
  { section: "donate", key: "donate.button", label: "Page don — Bouton principal", multiline: false, defaultFr: fr.donate.button, defaultEn: en.donate.button },
  { section: "newsletter", key: "newsletter.title", label: "Newsletter — Titre", multiline: false, defaultFr: fr.newsletter.title, defaultEn: en.newsletter.title },
  { section: "newsletter", key: "newsletter.subtitle", label: "Newsletter — Sous-titre", multiline: true, defaultFr: fr.newsletter.subtitle, defaultEn: en.newsletter.subtitle },
  { section: "newsletter", key: "newsletter.placeholder", label: "Newsletter — Placeholder email", multiline: false, defaultFr: fr.newsletter.placeholder, defaultEn: en.newsletter.placeholder },
  { section: "newsletter", key: "newsletter.button", label: "Newsletter — Bouton", multiline: false, defaultFr: fr.newsletter.button, defaultEn: en.newsletter.button },
  { section: "newsletter", key: "newsletter.success", label: "Newsletter — Message succès", multiline: false, defaultFr: fr.newsletter.success, defaultEn: en.newsletter.success },
  { section: "contact", key: "contact.name", label: "Contact — Label nom", multiline: false, defaultFr: fr.contact.name, defaultEn: en.contact.name },
  { section: "contact", key: "contact.email", label: "Contact — Label email", multiline: false, defaultFr: fr.contact.email, defaultEn: en.contact.email },
  { section: "contact", key: "contact.subject", label: "Contact — Label sujet", multiline: false, defaultFr: fr.contact.subject, defaultEn: en.contact.subject },
  { section: "contact", key: "contact.message", label: "Contact — Label message", multiline: false, defaultFr: fr.contact.message, defaultEn: en.contact.message },
  { section: "contact", key: "contact.send", label: "Contact — Bouton envoyer", multiline: false, defaultFr: fr.contact.send, defaultEn: en.contact.send },
  { section: "contact", key: "contact.phone", label: "Contact — Label téléphone", multiline: false, defaultFr: fr.contact.phone, defaultEn: en.contact.phone },
  { section: "contact", key: "contact.success", label: "Contact — Message succès", multiline: false, defaultFr: fr.contact.success, defaultEn: en.contact.success },
  { section: "domain-index", key: "domainPages.indexTitle", label: "Page domaines — Titre", multiline: false, defaultFr: fr.domainPages.indexTitle, defaultEn: en.domainPages.indexTitle },
  { section: "domain-index", key: "domainPages.indexSubtitle", label: "Page domaines — Sous-titre", multiline: true, defaultFr: fr.domainPages.indexSubtitle, defaultEn: en.domainPages.indexSubtitle },
  { section: "domain-index", key: "domainPages.discover", label: "Page domaines — Découvrir", multiline: false, defaultFr: fr.domainPages.discover, defaultEn: en.domainPages.discover },
  { section: "domain-index", key: "domainPages.readArticles", label: "Page domaines — Voir articles", multiline: false, defaultFr: fr.domainPages.readArticles, defaultEn: en.domainPages.readArticles },
  { section: "domain-index", key: "domainPages.actionsTitle", label: "Page domaines — Nos actions", multiline: false, defaultFr: fr.domainPages.actionsTitle, defaultEn: en.domainPages.actionsTitle },
  ...domainEntries(),
]

export function catalogSectionsForTabs(): { id: string; label: string }[] {
  const seen = new Set<string>()
  const tabs: { id: string; label: string }[] = []
  for (const e of SITE_TEXT_CATALOG) {
    if (seen.has(e.section)) continue
    seen.add(e.section)
    tabs.push({ id: e.section, label: sectionLabel(e.section) })
  }
  return tabs
}

function sectionLabel(id: string): string {
  if (id.startsWith("domain-")) return `Domaine : ${id.replace("domain-", "")}`
  const map: Record<string, string> = {
    nav: "Navigation",
    hero: "Accueil — Hero",
    about: "Accueil — Qui sommes-nous",
    footer: "Pied de page",
    areas: "Accueil — Domaines",
    activities: "Accueil — Actualités",
    news: "Page actualités",
    donate: "Page don",
    newsletter: "Newsletter",
    contact: "Contact (formulaire)",
    zones: "Nos zones d'intervention",
    "domain-index": "Liste des domaines",
  }
  return map[id] ?? id
}
