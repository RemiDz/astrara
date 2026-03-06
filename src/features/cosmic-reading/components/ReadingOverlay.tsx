'use client'

import { useReadingContext } from '../ReadingContext'
import ZodiacSelector from './ZodiacSelector'
import PhaseCard from './PhaseCard'
import PhaseNavigation from './PhaseNavigation'
import ReadingSummaryCard from './ReadingSummaryCard'

export default function ReadingOverlay() {
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

  // During PREPARING or EXITING, show overlay with no card (fade effect)
  const showCard = state.status === 'PHASE_ANIMATING' || state.status === 'PHASE_READING' || state.status === 'PHASE_TRANSITIONING'
  const showSummary = state.status === 'SUMMARY'
  const isCardVisible = state.status === 'PHASE_READING'
  const isSummaryVisible = state.status === 'SUMMARY'

  const frequencyPhase = currentReading?.phases.find(p => p.type === 'frequency-recommendation')
  const isLastPhase = currentPhaseIndex >= totalPhases - 1

  return (
    <div
      className={`fixed inset-0 z-40 pointer-events-none reading-overlay-transition ${
        state.status === 'EXITING' ? 'reading-overlay-exit' : 'reading-overlay-enter'
      }`}
    >
      {/* Subtle vignette — does NOT block wheel interaction */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content area — BOTTOM SHEET that slides up */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-auto px-4"
        style={{
          maxHeight: '45vh',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        }}
      >
        {showSummary && currentReading ? (
          <ReadingSummaryCard
            summary={currentReading.summary}
            frequencyPhase={frequencyPhase}
            isVisible={isSummaryVisible}
            onClose={exitReading}
          />
        ) : showCard && currentPhase ? (
          <PhaseCard
            phase={currentPhase}
            isVisible={isCardVisible}
            phaseIndex={currentPhaseIndex}
            totalPhases={totalPhases}
            onClose={exitReading}
          />
        ) : null}

        {/* Navigation */}
        {(isCardVisible || isSummaryVisible) && (
          <div
            className="mt-3 max-w-lg mx-auto"
            style={{
              paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
            }}
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

      <style>{`
        .reading-overlay-transition {
          transition: opacity 500ms ease-out;
        }
        .reading-overlay-enter {
          opacity: 1;
        }
        .reading-overlay-exit {
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
