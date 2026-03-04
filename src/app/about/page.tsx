'use client'

import Link from 'next/link'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import Starfield from '@/components/Starfield/Starfield'
import GlassCard from '@/components/ui/GlassCard'

function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen relative">
      <Starfield />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-block mb-8 text-sm hover:text-white transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Back to Astrara
        </Link>

        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-8 text-white">
          {t('about.title')}
        </h1>

        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-3 text-white">
              Real Astronomy, Real Positions
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Astrara calculates planetary positions using the same astronomical algorithms verified
              against NASA&apos;s JPL Horizons system. Every planet you see on the wheel is in its real
              position in the sky right now — accurate to less than one arc-minute. No APIs, no
              guesswork. Pure mathematics running directly in your browser.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-3 text-white">
              The Zodiac Wheel
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The ecliptic — the Sun&apos;s apparent path across the sky — is divided into twelve
              30-degree segments, each named after a constellation. When we say &quot;the Sun is in
              Pisces,&quot; we mean the Sun&apos;s ecliptic longitude falls between 330° and 360°.
              This is the same coordinate system astronomers use — astrology simply adds layers
              of meaning to the mathematics.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-3 text-white">
              Aspects
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              When two planets form specific angular relationships — 0° (conjunction), 60°
              (sextile), 90° (square), 120° (trine), or 180° (opposition) — astrologers call
              these &quot;aspects.&quot; Each carries a different quality: trines flow easily, squares
              create productive tension, and conjunctions amplify everything.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-3 text-white">
              Privacy
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Astrara runs entirely in your browser. Your location is only used locally to
              calculate rise and set times — it&apos;s never sent to any server. We use Plausible
              for privacy-respecting analytics (no cookies, no personal data). Your cosmic
              journey is yours alone.
            </p>
          </GlassCard>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Part of{' '}
            <a
              href="https://harmonicwaves.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: 'var(--accent-purple)' }}
            >
              Harmonic Waves
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <LanguageProvider>
      <AboutPage />
    </LanguageProvider>
  )
}
