'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import { useAstroData } from '@/hooks/useAstroData'
import LearnHeader from '@/components/Learn/LearnHeader'
import LearnWheel from '@/components/Learn/LearnWheel'
import BriefingPanel from '@/components/Learn/BriefingPanel'
import LearningTabs from '@/components/Learn/LearningTabs'

// Default location: London
const DEFAULT_LAT = 51.5074
const DEFAULT_LNG = -0.1278

export default function LearnPage() {
  return (
    <LanguageProvider>
      <LearnPageInner />
    </LanguageProvider>
  )
}

function LearnPageInner() {
  const { t } = useTranslation()
  const now = useMemo(() => new Date(), [])
  const astroData = useAstroData(now, DEFAULT_LAT, DEFAULT_LNG)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'general' | 'mychart'>('general')
  const wheelRef = useRef<HTMLDivElement>(null)

  const hasBirthData = useMemo(() => {
    if (typeof window === 'undefined') return false
    try {
      return !!(localStorage.getItem('astrara-birth-data') || localStorage.getItem('astrara_zodiac_profile'))
    } catch {
      return false
    }
  }, [])

  const handlePlanetTap = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id))
  }, [])

  const handleSignTap = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id))
  }, [])

  const handleBriefingPlanetTap = useCallback((id: string) => {
    setSelectedId(id)
    wheelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  if (!astroData) {
    return (
      <div className="min-h-screen bg-[#05050F] flex items-center justify-center">
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          {t('loading.stars')}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05050F] text-white/80">
      <LearnHeader />

      {/* Mode toggle */}
      <div className="flex justify-center gap-2 px-4 mt-4 mb-6">
        <button
          type="button"
          onClick={() => setMode('general')}
          className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer ${
            mode === 'general'
              ? 'bg-purple-500/20 text-purple-300'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          {t('learn.modeGeneral')}
        </button>
        <button
          type="button"
          onClick={() => setMode('mychart')}
          className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer ${
            mode === 'mychart'
              ? 'bg-purple-500/20 text-purple-300'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          {t('learn.modeMyChart')}
        </button>
      </div>

      {mode === 'mychart' && !hasBirthData ? (
        <div className="px-4 mb-6">
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl border p-6 text-center"
              style={{
                background: 'rgba(255,255,255,0.025)',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-[13px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                {t('learn.enterBirth')}
              </p>
              <a
                href="/"
                className="inline-block px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200"
                style={{ background: 'var(--accent-purple)', color: 'white' }}
              >
                {t('learn.enterBirthButton')}
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 2D SVG Wheel */}
          <div ref={wheelRef}>
            <LearnWheel
              planets={astroData.planets}
              aspects={astroData.aspects}
              selectedId={selectedId}
              onPlanetTap={handlePlanetTap}
              onSignTap={handleSignTap}
            />
          </div>

          {/* Briefing Panel */}
          <BriefingPanel
            planets={astroData.planets}
            aspects={astroData.aspects}
            displayDate={now}
            onPlanetTap={handleBriefingPlanetTap}
          />
        </>
      )}

      {/* Learning Tabs */}
      <LearningTabs />

      {/* Footer */}
      <footer className="text-center py-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('footer.partOf')}{' '}
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
      </footer>
    </div>
  )
}
