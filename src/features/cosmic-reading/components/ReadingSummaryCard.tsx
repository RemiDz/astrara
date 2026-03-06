'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { CosmicReading, ReadingPhase } from '../types'
import { useReadingContext } from '../ReadingContext'

interface ReadingSummaryCardProps {
  summary: CosmicReading['summary']
  frequencyPhase?: ReadingPhase
  isVisible: boolean
}

export default function ReadingSummaryCard({ summary, frequencyPhase, isVisible }: ReadingSummaryCardProps) {
  const { t } = useTranslation()
  const { zodiacProfile } = useReadingContext()
  const signName = zodiacProfile?.sunSign
    ? zodiacProfile.sunSign.charAt(0).toUpperCase() + zodiacProfile.sunSign.slice(1)
    : null
  const freq = frequencyPhase?.frequencyRecommendation

  return (
    <div
      className={`phase-card-transition ${isVisible ? 'phase-card-visible' : 'phase-card-hidden'}`}
    >
      <div
        className="rounded-2xl p-6 max-h-[60vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.92) 0%, rgba(13, 13, 26, 0.97) 100%)',
          border: '1px solid rgba(147, 197, 253, 0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
          scrollbarWidth: 'none',
        }}
      >
        {/* Title */}
        <div className="text-center mb-2">
          <span className="text-lg reading-shimmer">✦</span>
          <h3 className="text-sm uppercase tracking-widest text-white/40 mt-1">
            {t('reading.summaryTitle')}
          </h3>
        </div>

        {/* Theme name */}
        <h2 className="text-xl font-[family-name:var(--font-display)] text-white/90 text-center mb-4">
          {summary.theme}
        </h2>

        {/* Keyword tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {summary.keywords.map(kw => (
            <span key={kw} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/50">
              {kw}
            </span>
          ))}
        </div>

        {/* Summary text */}
        <p className="text-sm text-white/70 leading-relaxed text-center mb-5">
          {summary.generalSummary}
        </p>

        {/* Personal summary */}
        {summary.personalSummary && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-white/30">
                {signName ? `${t('reading.forYou')} (${signName})` : t('reading.forYou')}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed italic text-center mb-5">
              {summary.personalSummary}
            </p>
          </>
        )}

        {/* Frequency section */}
        {freq && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-white/30">
                {t('reading.yourFrequency')}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-sm">🔔</span>
                <span className="text-sm text-white/80">
                  {freq.hz} Hz — {freq.name}
                </span>
              </div>
              <p className="text-xs text-white/40 mb-2">{freq.description}</p>
              {freq.appLink && (
                <a
                  href={freq.appLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-300/60 hover:text-purple-300/90 transition-colors"
                >
                  {t('reading.openInBinara')} →
                </a>
              )}
            </div>
          </>
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
        @keyframes cosmicShimmer {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; text-shadow: 0 0 8px rgba(167, 139, 250, 0.6); }
        }
        .reading-shimmer {
          animation: cosmicShimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
