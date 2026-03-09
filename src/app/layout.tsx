import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const dmMono = DM_Mono({
  variable: '--font-mono',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Astrara — Today's Cosmic Map",
  description: 'See the sky right now. Understand how planetary positions affect your day. A live astrological guide by Harmonic Waves.',
  keywords: 'astrology, planetary positions, cosmic weather, daily horoscope, birth chart, zodiac',
  openGraph: {
    title: 'Astrara — What does the sky say right now?',
    description: 'Live planetary positions and cosmic weather. Your daily astrological guide.',
    url: 'https://astrara.app',
    siteName: 'Astrara',
    type: 'website',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#07070F',
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} font-[family-name:var(--font-body)] antialiased`}>
        {children}
        {/* Plausible Analytics */}
        <Script
          src="https://plausible.io/js/pa-kP7NC2980l34MzdHVVVhR.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
        </Script>
      </body>
    </html>
  )
}
