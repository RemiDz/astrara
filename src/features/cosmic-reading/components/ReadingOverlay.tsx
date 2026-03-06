'use client'

import { useRef, useEffect } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { useReadingContext } from '../ReadingContext'
import type { ReadingPhase, CosmicReading } from '../types'
import ZodiacSelector from './ZodiacSelector'
import PhaseNavigation from './PhaseNavigation'

const SIGN_NAMES_LT: Record<string, string> = {
  aries: 'Avinas', taurus: 'Jautis', gemini: 'Dvyniai', cancer: 'Vėžys',
  leo: 'Liūtas', virgo: 'Mergelė', libra: 'Svarstyklės', scorpio: 'Skorpionas',
  sagittarius: 'Šaulys', capricorn: 'Ožiaragis', aquarius: 'Vandenis', pisces: 'Žuvys',
}

export default function ReadingOverlay() {
  const { t, lang } = useTranslation()
  const {
    state,
    isReadingActive,
    currentReading,
    currentPhase,
    currentPhaseIndex,
    totalPhases,
    zodiacProfile,
    completeOnboarding,
    dismissOnboarding,
    nextPhase,
    exitReading,
  } = useReadingContext()

  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll to top on phase change
  useEffect(() => {
    if (contentRef.current && (state.status === 'PHASE_READING' || state.status === 'SUMMARY')) {
      contentRef.current.scrollTop = 0
    }
  }, [state.status, currentPhaseIndex])

  // Zodiac Selector for ONBOARDING state
  if (state.status === 'ONBOARDING') {
    return (
      <ZodiacSelector
        isOpen={true}
        onClose={dismissOnboarding}
        onSelect={completeOnboarding}
        initialSign={zodiacProfile?.sunSign ?? null}
      />
    )
  }

  if (!isReadingActive) return null

  const showCard = state.status === 'PHASE_ANIMATING' || state.status === 'PHASE_READING' || state.status === 'PHASE_TRANSITIONING'
  const showSummary = state.status === 'SUMMARY'
  const showContent = showCard || showSummary
  const contentOpacity = state.status === 'PHASE_READING' || state.status === 'SUMMARY' ? 1
    : state.status === 'PHASE_ANIMATING' ? 0.7
    : state.status === 'PHASE_TRANSITIONING' ? 0.3
    : 0
  const isLastPhase = currentPhaseIndex >= totalPhases - 1
  const frequencyPhase = currentReading?.phases.find(p => p.type === 'frequency-recommendation')
  const isExiting = state.status === 'EXITING'

  const signName = zodiacProfile?.sunSign
    ? lang === 'lt'
      ? SIGN_NAMES_LT[zodiacProfile.sunSign] ?? zodiacProfile.sunSign.charAt(0).toUpperCase() + zodiacProfile.sunSign.slice(1)
      : zodiacProfile.sunSign.charAt(0).toUpperCase() + zodiacProfile.sunSign.slice(1)
    : null

  // PREPARING: just vignette, no bottom sheet yet
  if (state.status === 'PREPARING') {
    return (
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)' }}
        />
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-500 ${
      isExiting ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)' }}
      />

      {/* Unified bottom sheet — card + button in single container */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <div className="mx-3 rounded-t-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.94) 0%, rgba(10, 10, 20, 0.98) 100%)',
            border: '1px solid rgba(147, 197, 253, 0.08)',
            borderBottom: 'none',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
          }}
        >
          {/* Scrollable content area — fades between phases, sheet stays open */}
          <div
            ref={contentRef}
            className="reading-content-scroll relative max-h-[45vh] overflow-y-auto p-5 pb-3 transition-opacity duration-300"
            style={{ scrollbarWidth: 'none', opacity: contentOpacity }}
          >
            {/* Close button */}
            <button
              onClick={exitReading}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all active:scale-90 z-10"
              aria-label="Close reading"
            >
              <span className="text-xs leading-none">&#x2715;</span>
            </button>

            {showSummary && currentReading ? (
              <SummaryContent
                summary={currentReading.summary}
                frequencyPhase={frequencyPhase}
                t={t}
                lang={lang}
                signName={signName}
              />
            ) : currentPhase ? (
              <PhaseContent
                phase={currentPhase}
                phaseIndex={currentPhaseIndex}
                totalPhases={totalPhases}
                t={t}
                lang={lang}
                signName={signName}
              />
            ) : null}
          </div>

          {/* Navigation button — seamlessly below content, no gap */}
          {showContent && (
            <div className="px-5 pt-2 border-t border-white/5"
              style={{ paddingBottom: 'max(16px, calc(env(safe-area-inset-bottom, 12px) + 8px))' }}
            >
              <PhaseNavigation
                onNext={nextPhase}
                onExit={exitReading}
                isLastPhase={isLastPhase}
                isSummary={showSummary}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .reading-content-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

/* ── Inline phase content ─────────────────────────────────────────── */

function PhaseContent({ phase, phaseIndex, totalPhases, t, lang, signName }: {
  phase: ReadingPhase
  phaseIndex: number
  totalPhases: number
  t: (key: string) => string
  lang: string
  signName: string | null
}) {
  return (
    <>
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-3 pr-8">
        {Array.from({ length: totalPhases }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            i === phaseIndex ? 'bg-white/80 scale-125' : i < phaseIndex ? 'bg-white/25' : 'bg-white/10'
          }`} />
        ))}
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        {phase.icon && <span className="text-lg">{phase.icon}</span>}
        <h3 className="text-base font-medium text-white/90">{phase.title}</h3>
      </div>

      {/* Subtitle */}
      {phase.subtitle && (
        <p className="text-xs text-white/40 mb-3">{phase.subtitle}</p>
      )}

      {/* General reading */}
      <p className="text-sm text-white/70 leading-relaxed mb-3">{phase.generalReading}</p>

      {/* Personal reading */}
      {phase.personalReading && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9px] uppercase tracking-widest text-white/25">
              {signName ? `${t('reading.forYou')} (${signName})` : t('reading.forYou')}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p className="text-sm text-white/60 leading-relaxed italic">{phase.personalReading}</p>
        </>
      )}

      {/* Frequency recommendation */}
      {phase.frequencyRecommendation && (
        <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🔔</span>
            <span className="text-xs text-white/50">
              {phase.frequencyRecommendation.hz} Hz — {phase.frequencyRecommendation.name}
            </span>
          </div>
          <p className="text-[10px] text-white/30">{phase.frequencyRecommendation.description}</p>
          {phase.frequencyRecommendation.appLink && (
            <a href={phase.frequencyRecommendation.appLink} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-purple-300/50 hover:text-purple-300/80 mt-1 inline-block">
              {t('reading.openInBinara')} →
            </a>
          )}
        </div>
      )}
    </>
  )
}

/* ── Inline summary content ───────────────────────────────────────── */

function SummaryContent({ summary, frequencyPhase, t, lang, signName }: {
  summary: CosmicReading['summary']
  frequencyPhase?: ReadingPhase
  t: (key: string) => string
  lang: string
  signName: string | null
}) {
  const freq = frequencyPhase?.frequencyRecommendation

  return (
    <>
      <div className="text-center mb-3 pr-6">
        <div className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
          ✦ {t('reading.summaryTitle')}
        </div>
        <h3 className="text-lg font-[family-name:var(--font-display)] text-white/90">{summary.theme}</h3>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {summary.keywords.map(kw => (
          <span key={kw} className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-white/40">
            {kw}
          </span>
        ))}
      </div>

      <p className="text-sm text-white/60 leading-relaxed text-center">{summary.generalSummary}</p>

      {summary.personalSummary && (
        <>
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9px] uppercase tracking-widest text-white/25">
              {signName ? `${t('reading.forYou')} (${signName})` : t('reading.forYou')}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p className="text-sm text-white/45 leading-relaxed italic text-center">{summary.personalSummary}</p>
        </>
      )}

      {freq && (
        <>
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9px] uppercase tracking-widest text-white/25">{t('reading.yourFrequency')}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-sm">🔔</span>
              <span className="text-sm text-white/60">{freq.hz} Hz — {freq.name}</span>
            </div>
            <p className="text-[10px] text-white/30">{freq.description}</p>
            {freq.appLink && (
              <a href={freq.appLink} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-purple-300/50 hover:text-purple-300/80 mt-1 inline-block">
                {t('reading.openInBinara')} →
              </a>
            )}
          </div>
        </>
      )}
    </>
  )
}
