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
      zones: "Nos zones d'intervention",
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
        "Global SOS est une organisation humanitaire sans but lucratif. Elle apporte une assistance urgente aux cris de détresse.",
      whoWeAreTitle: "Qui sommes-nous ?",
      whoWeAreParagraphs: [
        "Global SOS est une organisation humanitaire sans but lucratif.",
        "Elle apporte une assistance urgente aux cris de détresse.",
      ],
      homeAboutEyebrow: "Notre organisation",
      mission: "Mission",
      missionText:
        "Nous avons pour mission de contribuer à la protection des vies à travers trois piliers principaux : la gestion des risques de catastrophes ; la promotion de la justice climatique et environnementale ; les urgences sanitaires et la promotion des droits à la santé sexuelle et reproductive.",
      vision: "Vision",
      visionText:
        "Un avenir où les communautés vivent en harmonie avec leur environnement et disposent des capacités nécessaires pour renforcer leur résilience face aux chocs et crises pour un développement durable.",
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
      readArticles: "Voir les articles liés",
      actionsTitle: "Nos actions",
      slugs: ["risques-catastrophes", "urgences-sanitaires", "justice-climatique"] as const,
      "risques-catastrophes": {
        title: "Gestion des risques de catastrophes",
        excerpt:
          "Prévenir, atténuer et répondre aux catastrophes en renforçant la préparation et la résilience des communautés exposées.",
        heroImage: "/images/domaines/gestion-risques.png",
        lead:
          "La gestion des risques de catastrophes implique des stratégies et des politiques visant à prévenir, atténuer et répondre aux catastrophes naturelles, en intégrant des approches de préparation et de résilience.",
        paragraphs: [
          "Dans un contexte où le monde, et particulièrement la République Démocratique du Congo (RDC), est de plus en plus exposé aux aléas exacerbés notamment par les effets du changement climatique, il est impératif de renforcer la préparation et la résilience des communautés.",
          "Nous œuvrons directement sur le terrain pour le renforcement des capacités locales, en formant les populations aux premiers secours et en mettant en place des systèmes d'alerte précoce. Parallèlement, nous promouvons des solutions d'atténuation durables, telles que l'agriculture résiliente et la reforestation, pour protéger les communautés des aléas naturels.",
          "Notre action s'étend également au-delà du terrain, par le plaidoyer pour l'intégration de la gestion des risques dans les politiques publiques. Nous forgeons des partenariats stratégiques avec divers acteurs pour une coordination efficace et la mutualisation des ressources. Enfin, nous investissons dans l'innovation et la recherche appliquée afin de développer des outils et des méthodologies toujours plus efficaces pour anticiper, résister et se relever face aux catastrophes, construisant ainsi un avenir plus sûr et plus résilient pour tous en RDC.",
        ],
        actions: [
          "Identification des risques",
          "Cartographie des zones à risque et des populations vulnérables",
          "Installation des systèmes d'alerte précoce",
          "Formation et sensibilisation des communautés",
          "Préparation des plans d'urgence",
          "Renforcement des capacités locales",
          "Soutien à la reconstruction résiliente",
        ],
        gallery: [
          { src: "/images/domaines/gestion-risques.png", alt: "Sensibilisation communautaire" },
          { src: "/images/domaines/gestion-risques.png", alt: "Solidarité entre habitants" },
        ],
      },
      "urgences-sanitaires": {
        title: "Urgences sanitaires et promotion du droit à la santé sexuelle et reproductive (DSSR)",
        excerpt:
          "Réponse coordonnée aux urgences sanitaires et défense du droit à la santé sexuelle et reproductive pour les femmes et les filles.",
        heroImage: "/images/domaines/sante-dssr.png",
        lead:
          "Les urgences sanitaires sont des situations exceptionnelles mettant en danger la santé publique, nécessitant une réponse coordonnée et rapide des autorités sanitaires nationales et internationales.",
        paragraphs: [
          "Les urgences sanitaires peuvent être causées par des agents pathogènes, des catastrophes naturelles, des phénomènes climatiques ou des conflits armés, et présentent des risques sanitaires, sociaux et économiques majeurs. Elles incluent notamment les épidémies, les pandémies, les crises humanitaires et les catastrophes environnementales.",
          "Dans les contextes fragiles et sujets aux conflits, notamment en République Démocratique du Congo et particulièrement dans sa partie Est, l'accès à l'information liée aux urgences sanitaires et aux services de santé sexuelle et reproductive de qualité constitue souvent un défi majeur, alors que les besoins sont plus importants : les femmes et les filles sont plus fréquemment confrontées à la violence sexuelle et sexiste.",
          "Global SOS asbl milite pour l'accès aux services de santé sexuelle et reproductive comme droit des femmes, afin de limiter la mortalité et la morbidité maternelles.",
        ],
        actions: [
          "Sensibilisation à la santé et prévention des épidémies",
          "Promotion des comportements sanitaires appropriés",
          "Lutte et prévention des violences basées sur le genre",
          "Éducation sexuelle complète",
          "Information libre et éclairée sur la santé sexuelle et reproductive",
          "Garantie de l'accès aux services de SSR",
          "Lutte contre les stéréotypes et les stigmatisations liés à la santé et à la SSR",
        ],
        gallery: [
          { src: "/images/domaines/sante-dssr.png", alt: "Actions sur le terrain" },
          { src: "/images/domaines/sante-dssr.png", alt: "Solidarité humanitaire" },
        ],
      },
      "justice-climatique": {
        title: "Promotion de la justice climatique et environnementale",
        excerpt:
          "Lier la crise écologique aux droits humains pour une répartition équitable des charges, des bénéfices et de la résilience.",
        heroImage: "/images/domaines/justice-climat.png",
        lead:
          "La justice climatique et environnementale est un concept éthique, social et juridique qui lie la crise écologique aux droits humains, exigeant une répartition équitable des impacts, des coûts de transition et des bénéfices.",
        paragraphs: [
          "Elle vise à protéger les populations vulnérables qui subissent le plus de dommages (pollution, changement climatique, etc.) tout en étant moins responsables. La promotion de la justice environnementale et climatique est un impératif éthique et juridique visant à protéger les populations vulnérables et les écosystèmes, notamment face à l'exploitation minière et forestière et aux dérèglements climatiques.",
          "Elle garantit une répartition équitable des bénéfices et des charges, la participation des communautés locales aux décisions et l'accès à la justice pour réparer les dommages.",
          "Conscients de l'impact des changements climatiques et de la dégradation de l'environnement sur les communautés locales, Global SOS Asbl mène des actions qui visent à protéger les écosystèmes et à promouvoir des pratiques durables. Nous sensibilisons les populations à l'importance de la gestion responsable des déchets, à la protection de la biodiversité et à l'adoption de techniques agricoles adaptées aux variations climatiques.",
          "Au-delà de la sensibilisation, nous soutenons des initiatives concrètes qui permettent aux communautés de réduire leur empreinte environnementale et d'améliorer leur résilience face aux aléas climatiques. Nos interventions cherchent à créer un lien durable entre la protection de l'environnement, les urgences sanitaires et le bien-être des populations, démontrant que justice climatique et développement local durable peuvent aller de pair.",
        ],
        actions: [
          "Sensibilisation aux enjeux climatiques",
          "Plaidoyer pour des politiques justes",
          "Protection des ressources naturelles",
          "Promotion des techniques de gestion durable des déchets",
          "Mobilisation communautaire",
          "Documentation des injustices environnementales",
          "Défense des populations les plus exposées",
        ],
        gallery: [
          { src: "/images/domaines/justice-climat.png", alt: "Engagement pour la planète" },
          { src: "/images/domaines/justice-climat.png", alt: "Mobilisation citoyenne" },
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
      subtitle: "Articles, reportages et nouvelles depuis le terrain.",
      readMore: "Lire la suite",
      filterTitle: "Filtrer par domaine",
      filterAll: "Tous les articles",
      featured: "À la une",
      latest: "Derniers articles",
      empty: "Aucun article pour le moment.",
      readingMin: "min de lecture",
      shareTitle: "Partager cet article",
      backToList: "Retour aux actualités",
      relatedTitle: "Articles connexes",
    },
    stories: {
      title: "Témoignages du terrain",
      subtitle: "Des histoires de résilience et d'espoir",
    },
    zones: {
      titleOur: "Nos",
      titleRest: "zones d'intervention",
      body:
        "Le rayon d'activité de GLOBAL SOS couvre la province du Sud-Kivu. Il peut s'étendre sur tout le territoire national de la RDC et hors des frontières selon les besoins",
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
      zones: "Our intervention zones",
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
      readArticles: "Read related articles",
      actionsTitle: "Our actions",
      slugs: ["risques-catastrophes", "urgences-sanitaires", "justice-climatique"] as const,
      "risques-catastrophes": {
        title: "Disaster risk management",
        excerpt:
          "Preventing, mitigating and responding to disasters by strengthening preparedness and resilience in exposed communities.",
        heroImage: "/images/domaines/gestion-risques.png",
        lead:
          "Disaster risk management involves strategies and policies to prevent, mitigate and respond to natural disasters, integrating preparedness and resilience approaches.",
        paragraphs: [
          "In a context where the world, and particularly the Democratic Republic of the Congo (DRC), is increasingly exposed to hazards heightened by the effects of climate change, it is essential to strengthen the preparedness and resilience of communities.",
          "We work directly in the field to strengthen local capacities by training people in first aid and setting up early warning systems. At the same time, we promote sustainable mitigation solutions such as resilient agriculture and reforestation to protect communities from natural hazards.",
          "Our action also extends beyond the field, through advocacy for the integration of risk management into public policies. We forge strategic partnerships with various stakeholders for effective coordination and resource pooling. We also invest in innovation and applied research to develop ever more effective tools and methodologies to anticipate, withstand and recover from disasters, building a safer and more resilient future for all in the DRC.",
        ],
        actions: [
          "Risk identification",
          "Mapping of high-risk areas and vulnerable populations",
          "Setting up early warning systems",
          "Training and awareness for communities",
          "Emergency planning",
          "Strengthening local capacities",
          "Support to resilient reconstruction",
        ],
        gallery: [
          { src: "/images/domaines/gestion-risques.png", alt: "Community outreach" },
          { src: "/images/domaines/gestion-risques.png", alt: "Solidarity among residents" },
        ],
      },
      "urgences-sanitaires": {
        title: "Health emergencies and the right to sexual and reproductive health (SRHR)",
        excerpt:
          "Coordinated response to health emergencies and promotion of women's and girls' right to sexual and reproductive health.",
        heroImage: "/images/domaines/sante-dssr.png",
        lead:
          "Health emergencies are exceptional situations endangering public health and requiring a coordinated and rapid response from national and international health authorities.",
        paragraphs: [
          "Health emergencies can be caused by pathogens, natural disasters, climate phenomena or armed conflict, and pose major health, social and economic risks. They include epidemics, pandemics, humanitarian crises and environmental disasters.",
          "In fragile and conflict-affected contexts, particularly in the eastern part of the Democratic Republic of the Congo, access to information on health emergencies and to quality sexual and reproductive health services is often a major challenge — even though needs are higher because women and girls are more frequently exposed to sexual and gender-based violence.",
          "Global SOS asbl advocates for access to sexual and reproductive health services as a women's right, in order to reduce maternal mortality and morbidity.",
        ],
        actions: [
          "Health awareness and epidemic prevention",
          "Promotion of healthy behaviours",
          "Prevention of and response to gender-based violence",
          "Comprehensive sexuality education",
          "Free and informed information on sexual and reproductive health",
          "Guaranteed access to SRH services",
          "Combating stereotypes and stigma related to health and SRH",
        ],
        gallery: [
          { src: "/images/domaines/sante-dssr.png", alt: "Field actions" },
          { src: "/images/domaines/sante-dssr.png", alt: "Humanitarian solidarity" },
        ],
      },
      "justice-climatique": {
        title: "Promoting climate and environmental justice",
        excerpt:
          "Linking the ecological crisis to human rights, for a fair sharing of impacts, transition costs and benefits.",
        heroImage: "/images/domaines/justice-climat.png",
        lead:
          "Climate and environmental justice is an ethical, social and legal concept that links the ecological crisis to human rights, demanding a fair distribution of impacts, transition costs and benefits.",
        paragraphs: [
          "It seeks to protect vulnerable populations who suffer most from harm (pollution, climate change, etc.) while being least responsible for it. Promoting environmental and climate justice is an ethical and legal imperative to protect vulnerable populations and ecosystems, particularly in the face of mining and forestry exploitation and climate disruption.",
          "It guarantees a fair sharing of benefits and burdens, the participation of local communities in decisions, and access to justice to repair damage.",
          "Aware of the impact of climate change and environmental degradation on local communities, Global SOS Asbl carries out actions to protect ecosystems and promote sustainable practices. We raise awareness about responsible waste management, biodiversity protection and farming techniques adapted to climate variation.",
          "Beyond awareness, we support concrete initiatives that help communities reduce their environmental footprint and improve their resilience to climate hazards. Our work creates a lasting link between environmental protection, health emergencies and people's well-being, showing that climate justice and sustainable local development can go hand in hand.",
        ],
        actions: [
          "Awareness of climate issues",
          "Advocacy for fair policies",
          "Protection of natural resources",
          "Promotion of sustainable waste management",
          "Community mobilisation",
          "Documenting environmental injustices",
          "Defending the most exposed populations",
        ],
        gallery: [
          { src: "/images/domaines/justice-climat.png", alt: "Commitment to the planet" },
          { src: "/images/domaines/justice-climat.png", alt: "Citizen mobilisation" },
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
      subtitle: "Articles, stories and updates from the field.",
      readMore: "Read more",
      filterTitle: "Filter by area",
      filterAll: "All articles",
      featured: "Featured",
      latest: "Latest articles",
      empty: "No articles yet.",
      readingMin: "min read",
      shareTitle: "Share this article",
      backToList: "Back to news",
      relatedTitle: "Related articles",
    },
    stories: {
      title: "Field Stories",
      subtitle: "Stories of resilience and hope",
    },
    zones: {
      titleOur: "Our",
      titleRest: "intervention zones",
      body:
        "GLOBAL SOS's area of operation covers South Kivu province. It may extend across the entire national territory of the DRC and beyond borders as needed.",
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
