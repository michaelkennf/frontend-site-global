import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Montserrat } from 'next/font/google'
import { LOGO_SRC } from '@/lib/brand'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Global SOS ASBL — Organisation Humanitaire | Bukavu, Sud-Kivu',
  description:
    'Global SOS ASBL est une organisation humanitaire et à but non lucratif basée à Bukavu, Sud-Kivu, RDC. Engagée à protéger les plus vulnérables, soulager les souffrances humaines et défendre la dignité de chaque personne.',
  generator: 'Next.js',
  keywords: ['humanitarian', 'NGO', 'global sos', 'humanitaire', 'aide', 'urgence', 'Bukavu', 'Sud-Kivu', 'RDC', 'Congo', 'ASBL'],
  authors: [{ name: 'Global SOS ASBL' }],
  icons: {
    icon: [{ url: LOGO_SRC, type: 'image/png' }],
    shortcut: [LOGO_SRC],
    apple: [LOGO_SRC],
  },
}

export const viewport: Viewport = {
  themeColor: '#20B7E6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        {process.env.NODE_ENV === 'development' && (
          <Script id="dev-unregister-sw" strategy="beforeInteractive">
            {`(function(){if(typeof navigator!=='undefined'&&navigator.serviceWorker){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister();});});}})();`}
          </Script>
        )}
        {children}
      </body>
    </html>
  )
}
