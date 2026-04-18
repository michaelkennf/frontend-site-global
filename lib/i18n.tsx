"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export type Language = "fr" | "en"

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      domains: "Nos domaines",
      work: "Nos actions",
      news: "Actualités",
      research: "Recherche",
      donate: "Faire un don",
      contact: "Contact",
    },
    hero: {
      headline: "Protéger les vies et renforcer la résilience des communautés",
      sub: "Global SOS est une organisation humanitaire à but non lucratif qui travaille à protéger les populations vulnérables, soulager les souffrances humaines et défendre la dignité de chaque personne.",
      learnMore: "En savoir plus",
      donate: "Faire un don",
    },
    about: {
      title: "À propos de Global SOS",
      description:
        "Global SOS est une organisation humanitaire à but non lucratif engagée à protéger les plus vulnérables, soulager les souffrances humaines et défendre la dignité de chaque personne.",
      whoWeAreTitle: "Qui sommes-nous ?",
      whoWeAreParagraphs: [
        "Global SOS est une organisation non gouvernementale à but non lucratif, fondée et ancrée à Bukavu, en République démocratique du Congo. Nous œuvrons aux côtés des communautés les plus exposées aux catastrophes, aux urgences sanitaires et aux effets du changement climatique.",
        "Notre action repose sur la proximité du terrain, la transparence et le respect des standards humanitaires : chaque intervention vise à renforcer la résilience locale tout en préservant la dignité et les droits de chaque personne.",
      ],
      homeAboutEyebrow: "Notre organisation",
      mission: "Mission",
      missionText:
        "Contribuer à la protection des vies à travers trois piliers principaux : la gestion des risques de catastrophes, la justice climatique et environnementale, et les urgences sanitaires.",
      vision: "Vision",
      visionText:
        "Un avenir où les communautés vivent en harmonie avec leur environnement et disposent des capacités nécessaires pour renforcer leur résilience aux chocs et aux crises.",
      values: "Valeurs",
      valuesList: ["Équité", "Respect", "Solidarité", "Transparence", "Confidentialité", "Empathie"],
      principles: "Principes fondamentaux",
      principlesList: ["Neutralité", "Impartialité", "Indépendance", "Humanité"],
    },
    areas: {
      title: "Domaines d'intervention",
      subtitle: "Trois axes principaux pour un impact durable",
      area1Title: "Gestion des risques de catastrophes",
      area1Desc: "Prévention, préparation et renforcement communautaire face aux catastrophes.",
      area1Items: ["Prévention et préparation communautaire", "Systèmes d'alerte précoce", "Renforcement des capacités locales", "Réduction des impacts"],
      area2Title: "Urgences sanitaires et promotion des DSSR",
      area2Desc: "Actions de santé préventive, accès aux services DSSR et protection des personnes vulnérables.",
      area2Items: ["Sensibilisation à la santé et prévention des épidémies", "Accès à la contraception", "Éducation sexuelle complète", "Lutte contre les violences basées sur le genre"],
      area3Title: "Justice climatique et environnementale",
      area3Desc: "Protection des écosystèmes et promotion de pratiques durables pour une équité climatique réelle.",
      area3Items: ["Sensibilisation sur la protection et la préservation de l'environnement", "Protection des écosystèmes", "Pratiques durables (recyclage, reboisement, etc.)", "Défense de l'équité climatique et environnementale"],
    },
    domainPages: {
      indexTitle: "Nos domaines d'intervention",
      indexSubtitle: "Trois axes stratégiques pour agir là où les besoins sont les plus critiques.",
      discover: "Découvrir",
      slugs: ["risques-catastrophes", "urgences-sanitaires", "justice-climatique"] as const,
      "risques-catastrophes": {
        title: "Gestion des risques de catastrophes",
        excerpt:
          "Prévention, préparation et renforcement communautaire face aux catastrophes pour réduire les vulnérabilités.",
        heroImage: "/images/domaines/gestion-risques.png",
        paragraphs: [
          "Les communautés les plus fragiles sont souvent les premières exposées aux chocs climatiques et catastrophes naturelles. Global SOS accompagne les populations pour mieux comprendre les risques et se préparer avant qu'une urgence ne survienne.",
          "Nous développons des systèmes d'alerte précoce, renforçons les capacités locales et organisons la préparation aux scénarios d'urgence avec les autorités et les organisations de base.",
          "Quand une catastrophe frappe, nous intervenons aux côtés des communautés pour réduire les impacts immédiats tout en préparant la résilience durable au lendemain de la crise.",
        ],
        gallery: [
          { src: "/images/carousel-children.jpg", alt: "Sensibilisation communautaire" },
          { src: "/images/carousel-sister.jpg", alt: "Solidarité entre habitants" },
        ],
      },
      "urgences-sanitaires": {
        title: "Urgences sanitaires et promotion des DSSR",
        excerpt:
          "Actions préventives, accès aux services essentiels et promotion de la santé sexuelle et reproductive.",
        heroImage: "/images/domaines/sante-dssr.png",
        paragraphs: [
          "Face aux épidémies, aux ruptures de soins et aux besoins non couverts, Global SOS déploie des actions de santé préventive et d'information adaptées au contexte local.",
          "Nous œuvrons pour un meilleur accès à la contraception, à l'éducation sexuelle complète et à la lutte contre les violences basées sur le genre, en partenariat avec les structures de santé.",
          "Chaque intervention intègre la dignité des personnes et la confidentialité des accompagnements, avec une attention particulière aux plus vulnérables.",
        ],
        gallery: [
          { src: "/images/carousel-farming.jpg", alt: "Actions sur le terrain" },
          { src: "/images/hero.png", alt: "Solidarité humanitaire" },
        ],
      },
      "justice-climatique": {
        title: "Justice climatique et environnementale",
        excerpt:
          "Protection des écosystèmes et promotion de pratiques durables pour une équité climatique réelle.",
        heroImage: "/images/domaines/justice-climat.png",
        paragraphs: [
          "Les impacts du changement climatique aggravent les inégalités. Notre action vise à faire entendre les voix des communautés les plus exposées et à promouvoir des solutions justes.",
          "Nous sensibilisons aux enjeux de préservation de l'environnement, soutenons le reboisement, le recyclage et les pratiques agricoles respectueuses des sols et de l'eau.",
          "Global SOS défend une transition écologique qui ne laisse personne de côté, en reliant protection de la nature et droits humains.",
        ],
        gallery: [
          { src: "/images/donate-bg.png", alt: "Engagement pour la planète" },
          { src: "/images/news-header.png", alt: "Mobilisation citoyenne" },
        ],
      },
    },
    stats: {
      title: "Notre impact",
      communities: "Communautés soutenues",
      trained: "Personnes formées",
      responses: "Réponses d'urgence",
      initiatives: "Initiatives environnementales",
    },
    activities: {
      title: "Actualités récentes",
      subtitle: "Suivez nos publications et nos retours depuis le terrain",
      viewAll: "Toutes les actualités",
    },
    news: {
      title: "Actualités",
      subtitle: "Restez informés de nos dernières nouvelles",
      readMore: "Lire la suite",
    },
    stories: {
      title: "Témoignages du terrain",
      subtitle: "Des histoires de résilience et d'espoir",
    },
    map: {
      title: "Zones d'intervention",
      subtitle: "Global SOS opère dans plusieurs régions du monde",
    },
    donate: {
      title: "Soutenez les communautés dans le besoin",
      subtitle: "Votre don peut changer des vies. Chaque contribution compte.",
      button: "Faire un don maintenant",
    },
    newsletter: {
      title: "Restez connectés",
      subtitle: "Inscrivez-vous à notre newsletter pour recevoir nos dernières nouvelles",
      placeholder: "Votre adresse email",
      button: "S'inscrire",
      success: "Merci pour votre inscription !",
    },
    contact: {
      title: "Contactez-nous",
      subtitle: "Nous sommes à votre écoute",
      name: "Nom complet",
      email: "Adresse email",
      subject: "Sujet",
      message: "Message",
      send: "Envoyer le message",
      address: "Adresse",
      phone: "Téléphone",
      emailLabel: "Email",
      success: "Votre message a été envoyé avec succès !",
    },
    footer: {
      description:
        "Organisation humanitaire engagée à protéger les plus vulnérables et défendre la dignité de chaque personne.",
      quickLinks: "Liens rapides",
      followUs: "Suivez-nous",
      contactUs: "Contactez-nous",
      rights: "Tous droits réservés.",
      tagline: "Ensemble pour un monde plus juste",
    },
    admin: {
      login: {
        title: "Administration Global SOS",
        subtitle: "Connectez-vous pour accéder au tableau de bord",
        email: "Email",
        password: "Mot de passe",
        button: "Se connecter",
        forgot: "Mot de passe oublié ?",
      },
      dashboard: {
        title: "Tableau de bord",
        welcome: "Bienvenue dans l'espace administration",
      },
      sidebar: {
        dashboard: "Tableau de bord",
        articles: "Articles",
        activities: "Activités",
        media: "Médiathèque",
        newsletter: "Newsletter",
        donations: "Dons",
        messages: "Messages",
        users: "Utilisateurs",
        settings: "Paramètres",
        logout: "Déconnexion",
      },
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      domains: "Our focus areas",
      work: "Our Work",
      news: "News & Activities",
      research: "Research",
      donate: "Donate",
      contact: "Contact",
    },
    hero: {
      headline: "Protecting Lives and Strengthening Community Resilience",
      sub: "Global SOS is a humanitarian nonprofit organization working to protect vulnerable populations, relieve human suffering and defend the dignity of every person.",
      learnMore: "Learn More",
      donate: "Donate",
    },
    about: {
      title: "About Global SOS",
      description:
        "Global SOS is a humanitarian nonprofit organization committed to protecting the most vulnerable, relieving human suffering and defending the dignity of every person.",
      whoWeAreTitle: "Who are we?",
      whoWeAreParagraphs: [
        "Global SOS is a nonprofit non-governmental organization, founded and rooted in Bukavu, Democratic Republic of the Congo. We work alongside communities most exposed to disasters, health emergencies and the impacts of climate change.",
        "Our approach combines field proximity, transparency and humanitarian standards: every programme aims to strengthen local resilience while upholding the dignity and rights of every person.",
      ],
      homeAboutEyebrow: "Our organization",
      mission: "Mission",
      missionText:
        "Contribute to the protection of lives through three main pillars: Disaster Risk Management, Climate and Environmental Justice, and Health Emergencies.",
      vision: "Vision",
      visionText:
        "A future where communities live in harmony with their environment and have the capacities necessary to strengthen their resilience to shocks and crises.",
      values: "Values",
      valuesList: ["Equity", "Respect", "Solidarity", "Transparency", "Confidentiality", "Empathy"],
      principles: "Core Principles",
      principlesList: ["Neutrality", "Impartiality", "Independence", "Humanity"],
    },
    areas: {
      title: "Areas of Intervention",
      subtitle: "Three main pillars for lasting impact",
      area1Title: "Disaster Risk Management",
      area1Desc: "Community prevention, preparedness, and local capacity strengthening against disasters.",
      area1Items: ["Community prevention and preparedness", "Early warning systems", "Strengthening local capacities", "Impact reduction"],
      area2Title: "Health Emergencies and SRHR Promotion",
      area2Desc: "Preventive health actions, SRHR access, and protection for vulnerable populations.",
      area2Items: ["Health awareness and epidemic prevention", "Access to contraception", "Comprehensive sexuality education", "Combating gender-based violence"],
      area3Title: "Climate and Environmental Justice",
      area3Desc: "Ecosystem protection and sustainable practices to advance climate and environmental equity.",
      area3Items: ["Awareness on environmental protection and preservation", "Ecosystem protection", "Sustainable practices (recycling, reforestation, etc.)", "Advocacy for climate and environmental equity"],
    },
    domainPages: {
      indexTitle: "Areas of intervention",
      indexSubtitle: "Three strategic pillars where needs are most acute.",
      discover: "Explore",
      slugs: ["risques-catastrophes", "urgences-sanitaires", "justice-climatique"] as const,
      "risques-catastrophes": {
        title: "Disaster risk management",
        excerpt:
          "Prevention, preparedness and community strengthening to reduce vulnerability to disasters.",
        heroImage: "/images/domaines/gestion-risques.png",
        paragraphs: [
          "The most fragile communities are often first exposed to climate shocks and natural disasters. Global SOS supports people to understand risks better and prepare before emergencies occur.",
          "We develop early warning systems, strengthen local capacities and organise preparedness alongside authorities and grassroots organisations.",
          "When disaster strikes, we stand with communities to reduce immediate impacts while building long-term resilience for recovery.",
        ],
        gallery: [
          { src: "/images/carousel-children.jpg", alt: "Community outreach" },
          { src: "/images/carousel-sister.jpg", alt: "Solidarity among residents" },
        ],
      },
      "urgences-sanitaires": {
        title: "Health emergencies and SRHR promotion",
        excerpt:
          "Preventive action, essential services and sexual and reproductive health and rights.",
        heroImage: "/images/domaines/sante-dssr.png",
        paragraphs: [
          "Facing epidemics, gaps in care and unmet needs, Global SOS rolls out preventive health actions and adapted information.",
          "We promote access to contraception, comprehensive sexuality education and efforts against gender-based violence with health structures.",
          "Every response upholds dignity and confidentiality, with particular attention to the most vulnerable.",
        ],
        gallery: [
          { src: "/images/carousel-farming.jpg", alt: "Field actions" },
          { src: "/images/hero.png", alt: "Humanitarian solidarity" },
        ],
      },
      "justice-climatique": {
        title: "Climate and environmental justice",
        excerpt:
          "Ecosystem protection and sustainable practices for real climate equity.",
        heroImage: "/images/domaines/justice-climat.png",
        paragraphs: [
          "Climate impacts deepen inequality. Our work amplifies the voices of communities most at risk and promotes fair solutions.",
          "We raise awareness on environmental preservation, support reforestation, recycling and farming practices that respect soils and water.",
          "Global SOS advocates an ecological transition that leaves no one behind, linking nature protection and human rights.",
        ],
        gallery: [
          { src: "/images/donate-bg.png", alt: "Commitment to the planet" },
          { src: "/images/news-header.png", alt: "Citizen mobilisation" },
        ],
      },
    },
    stats: {
      title: "Our Impact",
      communities: "Communities Supported",
      trained: "People Trained",
      responses: "Emergency Responses",
      initiatives: "Environmental Initiatives",
    },
    activities: {
      title: "Recent news",
      subtitle: "Updates and stories from our work on the ground",
      viewAll: "All news",
    },
    news: {
      title: "News",
      subtitle: "Stay informed about our latest news",
      readMore: "Read more",
    },
    stories: {
      title: "Field Stories",
      subtitle: "Stories of resilience and hope",
    },
    map: {
      title: "Intervention Zones",
      subtitle: "Global SOS operates in several regions of the world",
    },
    donate: {
      title: "Support Communities in Need",
      subtitle: "Your donation can change lives. Every contribution counts.",
      button: "Donate Now",
    },
    newsletter: {
      title: "Stay Connected",
      subtitle: "Subscribe to our newsletter to receive our latest news",
      placeholder: "Your email address",
      button: "Subscribe",
      success: "Thank you for subscribing!",
    },
    contact: {
      title: "Contact Us",
      subtitle: "We are here to listen",
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      address: "Address",
      phone: "Phone",
      emailLabel: "Email",
      success: "Your message has been sent successfully!",
    },
    footer: {
      description:
        "Humanitarian organization committed to protecting the most vulnerable and defending the dignity of every person.",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      contactUs: "Contact Us",
      rights: "All rights reserved.",
      tagline: "Together for a more just world",
    },
    admin: {
      login: {
        title: "Global SOS Administration",
        subtitle: "Sign in to access the dashboard",
        email: "Email",
        password: "Password",
        button: "Sign In",
        forgot: "Forgot password?",
      },
      dashboard: {
        title: "Dashboard",
        welcome: "Welcome to the administration area",
      },
      sidebar: {
        dashboard: "Dashboard",
        articles: "Articles",
        activities: "Activities",
        media: "Media Library",
        newsletter: "Newsletter",
        donations: "Donations",
        messages: "Messages",
        users: "Users",
        settings: "Settings",
        logout: "Log Out",
      },
    },
  },
}

type TranslationKeys = typeof translations.fr

interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: TranslationKeys
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("fr")
  const t = translations[lang]
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
