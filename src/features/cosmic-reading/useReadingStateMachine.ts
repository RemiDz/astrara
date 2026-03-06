import { useReducer } from 'react'

// === STATE ===

export type ReadingState =
  | { status: 'IDLE' }
  | { status: 'ONBOARDING' }
  | { status: 'PREPARING'; phaseIndex: 0 }
  | { status: 'PHASE_ANIMATING'; phaseIndex: number }
  | { status: 'PHASE_READING'; phaseIndex: number }
  | { status: 'PHASE_TRANSITIONING'; phaseIndex: number }
  | { status: 'SUMMARY' }
  | { status: 'EXITING' }

// === ACTIONS ===

export type ReadingAction =
  | { type: 'START_READING' }
  | { type: 'SHOW_ONBOARDING' }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'DISMISS_ONBOARDING' }
  | { type: 'PREPARING_COMPLETE' }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'NEXT_PHASE'; totalPhases: number }
  | { type: 'EXIT_READING' }
  | { type: 'EXIT_COMPLETE' }

// === REDUCER ===

function readingReducer(state: ReadingState, action: ReadingAction): ReadingState {
  // Escape hatch — EXIT_READING from any non-IDLE state
  if (action.type === 'EXIT_READING' && state.status !== 'IDLE') {
    return { status: 'EXITING' }
  }

  switch (state.status) {
    case 'IDLE':
      if (action.type === 'START_READING') return { status: 'PREPARING', phaseIndex: 0 }
      if (action.type === 'SHOW_ONBOARDING') return { status: 'ONBOARDING' }
      return state

    case 'ONBOARDING':
      if (action.type === 'COMPLETE_ONBOARDING') return { status: 'PREPARING', phaseIndex: 0 }
      if (action.type === 'DISMISS_ONBOARDING') return { status: 'IDLE' }
      return state

    case 'PREPARING':
      if (action.type === 'PREPARING_COMPLETE') return { status: 'PHASE_ANIMATING', phaseIndex: 0 }
      return state

    case 'PHASE_ANIMATING':
      if (action.type === 'ANIMATION_COMPLETE') return { status: 'PHASE_READING', phaseIndex: state.phaseIndex }
      return state

    case 'PHASE_READING':
      if (action.type === 'NEXT_PHASE') {
        if (state.phaseIndex >= action.totalPhases - 1) return { status: 'SUMMARY' }
        return { status: 'PHASE_TRANSITIONING', phaseIndex: state.phaseIndex }
      }
      return state

    case 'PHASE_TRANSITIONING':
      if (action.type === 'ANIMATION_COMPLETE') return { status: 'PHASE_ANIMATING', phaseIndex: state.phaseIndex + 1 }
      return state

    case 'SUMMARY':
      // EXIT_READING handled by escape hatch above
      return state

    case 'EXITING':
      if (action.type === 'EXIT_COMPLETE') return { status: 'IDLE' }
      return state

    default:
      return state
  }
}

// === HOOK ===

export function useReadingStateMachine() {
  const [state, dispatch] = useReducer(readingReducer, { status: 'IDLE' })
  return { state, dispatch }
}
