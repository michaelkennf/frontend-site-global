import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
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
    icon: [
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: ['/favicon.png'],
    apple: ['/apple-touch-icon.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
