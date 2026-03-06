'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { ReadingPhase } from '../types'
import { useReadingContext } from '../ReadingContext'

interface PhaseCardProps {
  phase: ReadingPhase
  isVisible: boolean
  phaseIndex: number
  totalPhases: number
  onClose?: () => void
}

const SIGN_NAMES_LT: Record<string, string> = {
  aries: 'Avinas', taurus: 'Jautis', gemini: 'Dvyniai', cancer: 'Vėžys',
  leo: 'Liūtas', virgo: 'Mergelė', libra: 'Svarstyklės', scorpio: 'Skorpionas',
  sagittarius: 'Šaulys', capricorn: 'Ožiaragis', aquarius: 'Vandenis', pisces: 'Žuvys',
}

export default function PhaseCard({ phase, isVisible, phaseIndex, totalPhases, onClose }: PhaseCardProps) {
  const { t, lang } = useTranslation()
  const { zodiacProfile } = useReadingContext()
  const signName = zodiacProfile?.sunSign
    ? lang === 'lt'
      ? SIGN_NAMES_LT[zodiacProfile.sunSign] ?? zodiacProfile.sunSign.charAt(0).toUpperCase() + zodiacProfile.sunSign.slice(1)
      : zodiacProfile.sunSign.charAt(0).toUpperCase() + zodiacProfile.sunSign.slice(1)
    : null

  return (
    <div
      className={`phase-card-transition ${isVisible ? 'phase-card-visible' : 'phase-card-hidden'}`}
    >
      <div
        className="relative rounded-2xl p-6 max-h-[40vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.92) 0%, rgba(13, 13, 26, 0.97) 100%)',
          border: '1px solid rgba(147, 197, 253, 0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
          scrollbarWidth: 'none',
        }}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all active:scale-90 z-10"
            aria-label="Close reading"
          >
            <span className="text-xs leading-none">&#x2715;</span>
          </button>
        )}

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {Array.from({ length: totalPhases }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === phaseIndex ? 'bg-white/90 scale-110' :
                i < phaseIndex ? 'bg-white/30' :
                'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Icon + Title */}
        <div className="text-center mb-1">
          {phase.icon && <span className="text-2xl mr-2">{phase.icon}</span>}
          <h3 className="text-lg font-[family-name:var(--font-display)] text-white/90 inline">
            {phase.title}
          </h3>
        </div>

        {/* Subtitle */}
        {phase.subtitle && (
          <p className="text-xs text-white/40 text-center mb-4">{phase.subtitle}</p>
        )}

        {/* General reading */}
        <div className="text-sm text-white/70 leading-relaxed whitespace-pre-line mb-4">
          {phase.generalReading}
        </div>

        {/* Personal reading */}
        {phase.personalReading && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-white/30">
                {signName ? `${t('reading.forYou')} (${signName})` : t('reading.forYou')}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="text-sm text-white/60 leading-relaxed italic mb-4">
              {phase.personalReading}
            </div>
          </>
        )}

        {/* Frequency recommendation */}
        {phase.frequencyRecommendation && (
          <div className="rounded-xl p-3 mt-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🔔</span>
              <span className="text-sm text-white/80">
                {phase.frequencyRecommendation.hz} Hz — {phase.frequencyRecommendation.name}
              </span>
            </div>
            <p className="text-xs text-white/40 mb-2">{phase.frequencyRecommendation.description}</p>
            {phase.frequencyRecommendation.appLink && (
              <a
                href={phase.frequencyRecommendation.appLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-300/60 hover:text-purple-300/90 transition-colors"
              >
                {t('reading.openInBinara')} →
              </a>
            )}
          </div>
        )}
      </div>

      <style>{`
        .phase-card-transition {
          transition: opacity 400ms ease-out, transform 400ms ease-out;
        }
        .phase-card-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .phase-card-hidden {
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
        }
        .phase-card-transition ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
