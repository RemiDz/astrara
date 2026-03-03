import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Astrara — Your Cosmic Frequency Portrait',
  description: 'Enter your birth details to hear the music of your stars. Each planet becomes a frequency, and their relationships create harmonics unique to you.',
  openGraph: {
    title: 'Astrara — Your Cosmic Frequency Portrait',
    description: 'Discover your unique cosmic sound based on the exact planetary positions at the moment of your birth.',
    siteName: 'Astrara',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astrara — Your Cosmic Frequency Portrait',
    description: 'Discover your unique cosmic sound.',
  },
};

export const viewport: Viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          defer
          data-domain="astrara.app"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className="min-h-screen bg-[#04040A]">
        <LanguageProvider>
          <Header />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
