'use client'

import { useRef, useEffect } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { useReadingContext } from '../ReadingContext'
import type { ReadingPhase } from '../types'
import ZodiacSelector from './ZodiacSelector'
import PhaseNavigation from './PhaseNavigation'
import PhaseProgressBar from './PhaseProgressBar'
import { PLANET_DOMAINS } from '../content/templates/planetDomains'

const SIGN_NAMES_LT: Record<string, string> = {
  aries: 'Avinas', taurus: 'Jautis', gemini: 'Dvyniai', cancer: 'Vezys',
  leo: 'Liutas', virgo: 'Mergele', libra: 'Svarstykles', scorpio: 'Skorpionas',
  sagittarius: 'Saulys', capricorn: 'Oziaragis', aquarius: 'Vandenis', pisces: 'Zuvys',
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
    jumpToPhase,
    exitReading,
  } = useReadingContext()

  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll to top on phase change
  useEffect(() => {
    if (contentRef.current && state.status === 'PHASE_READING') {
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
  const showContent = showCard
  const contentOpacity = state.status === 'PHASE_READING' ? 1
    : state.status === 'PHASE_ANIMATING' ? 0.7
    : state.status === 'PHASE_TRANSITIONING' ? 0.3
    : 0
  const isLastPhase = currentPhaseIndex >= totalPhases - 1
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
          {/* Phase progress icons */}
          {showContent && currentReading && (
            <PhaseProgressBar
              phases={currentReading.phases}
              currentIndex={currentPhaseIndex}
              onJump={jumpToPhase}
            />
          )}

          {/* Scrollable content area — fades between phases, sheet stays open */}
          <div
            ref={contentRef}
            className="reading-content-scroll relative max-h-[38vh] overflow-y-auto p-5 pb-3 transition-opacity duration-300"
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

            {currentPhase ? (
              <PhaseContent
                phase={currentPhase}
                phaseIndex={currentPhaseIndex}
                totalPhases={totalPhases}
                t={t}
                lang={lang}
                signName={signName}
                keywords={currentPhase.type === 'summary' ? currentReading?.summary.keywords : undefined}
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

/* -- Inline phase content ------------------------------------------------- */

function PhaseContent({ phase, phaseIndex, totalPhases, t, lang, signName, keywords }: {
  phase: ReadingPhase
  phaseIndex: number
  totalPhases: number
  t: (key: string) => string
  lang: string
  signName: string | null
  keywords?: string[]
}) {
  const bodies = phase.celestialData.bodies ?? []

  return (
    <>
      {/* Title */}
      <div className="flex items-center gap-2 mb-1 pr-8">
        {phase.icon && <span className="text-lg">{phase.icon}</span>}
        <h3 className="text-base font-medium text-white/90">{phase.title}</h3>
      </div>

      {/* Plain name subtitle (Change 4A/4B) */}
      {phase.plainName && (
        <p className="text-xs text-white/50 mb-1 ml-7">{phase.plainName}</p>
      )}

      {/* Subtitle */}
      {phase.subtitle && (
        <p className="text-xs text-white/40 mb-3">{phase.subtitle}</p>
      )}

      {/* Keywords (summary phase only) */}
      {keywords && keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {keywords.map(kw => (
            <span key={kw} className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-white/40">
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Planet domains (Change 4C) — show for all detail phases with celestial bodies */}
      {phase.type !== 'summary' && bodies.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {bodies.map(bodyId => {
            const domain = PLANET_DOMAINS[bodyId]
            if (!domain) return null
            return (
              <span key={bodyId} className="text-[11px] text-white/40">
                {domain[lang as 'en' | 'lt'] ?? domain.en}
              </span>
            )
          })}
        </div>
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
