import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
        <Analytics />
      </body>
    </html>
  )
}
