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
      className={`fixed inset-0 z-40 reading-overlay-transition ${
        state.status === 'EXITING' ? 'reading-overlay-exit' : 'reading-overlay-enter'
      }`}
    >
      {/* Backdrop — gradient lets wheel show through dimmed */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

      {/* Close button */}
      <button
        onClick={exitReading}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all active:scale-90"
        aria-label="Close reading"
      >
        ✕
      </button>

      {/* Content area — positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[65vh] px-4 pb-6">
        {showSummary && currentReading ? (
          <ReadingSummaryCard
            summary={currentReading.summary}
            frequencyPhase={frequencyPhase}
            isVisible={isSummaryVisible}
          />
        ) : showCard && currentPhase ? (
          <PhaseCard
            phase={currentPhase}
            isVisible={isCardVisible}
            phaseIndex={currentPhaseIndex}
            totalPhases={totalPhases}
          />
        ) : null}

        {/* Navigation — only show when card is visible or summary is showing */}
        {(isCardVisible || isSummaryVisible) && (
          <div className="mt-4 max-w-lg mx-auto">
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
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
