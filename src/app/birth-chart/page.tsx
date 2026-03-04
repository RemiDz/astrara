'use client'

import Link from 'next/link'
import { LanguageProvider } from '@/i18n/LanguageContext'
import Starfield from '@/components/Starfield/Starfield'
import GlassCard from '@/components/ui/GlassCard'

function BirthChartPage() {
  return (
    <div className="min-h-screen relative">
      <Starfield />
      <div className="relative z-10 max-w-md mx-auto px-4 py-12 text-center">
        <Link
          href="/"
          className="inline-block mb-8 text-sm hover:text-white transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Back to Astrara
        </Link>

        <GlassCard>
          <div className="text-5xl mb-4">☽</div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-3 text-white">
            Personal Birth Chart
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Your unique cosmic blueprint — calculated from the exact sky at the moment you were born.
            Ascendant, houses, natal aspects, and personalised insights.
          </p>
          <div
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--accent-purple)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            Coming in Phase 2
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <LanguageProvider>
      <BirthChartPage />
    </LanguageProvider>
  )
}
