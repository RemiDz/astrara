'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import { getPlanetPositions } from '@/lib/astronomy'
import type { ZodiacProfile, ZodiacSign, ReadingPhase, CosmicReading } from './types'
import { useReadingStateMachine, type ReadingState } from './useReadingStateMachine'
import { getZodiacProfile, saveZodiacProfile, getExistingBirthData } from './utils/storage'
import { generateCosmicReading } from './content/generateReading'

// === ASTRO DATA INPUT SHAPE ===

export interface AstroDataForReading {
  planets: PlanetPosition[]
  moon: {
    phase: string
    illumination: number
    zodiacSign: string
    degreeInSign: number
  }
  notableAspects: AspectData[]
}

// === CONTEXT SHAPE ===

interface ReadingContextValue {
  state: ReadingState
  isReadingActive: boolean
  currentReading: CosmicReading | null
  currentPhase: ReadingPhase | null
  currentPhaseIndex: number
  totalPhases: number

  zodiacProfile: ZodiacProfile | null
  setZodiacProfile: (profile: ZodiacProfile) => void

  startReading: () => void
  completeOnboarding: (profile: ZodiacProfile) => void
  dismissOnboarding: () => void
  nextPhase: () => void
  exitReading: () => void
  onAnimationComplete: () => void
}

const ReadingContext = createContext<ReadingContextValue | null>(null)

export function useReadingContext(): ReadingContextValue {
  const ctx = useContext(ReadingContext)
  if (!ctx) throw new Error('useReadingContext must be used within a ReadingProvider')
  return ctx
}

// === PROVIDER ===

export function ReadingProvider({
  children,
  astroData,
}: {
  children: React.ReactNode
  astroData: AstroDataForReading | null
}) {
  const { state, dispatch } = useReadingStateMachine()
  const [currentReading, setCurrentReading] = useState<CosmicReading | null>(null)
  const [zodiacProfile, setZodiacProfileState] = useState<ZodiacProfile | null>(() => getZodiacProfile())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-derive zodiac profile from existing birth chart data
  useEffect(() => {
    if (zodiacProfile) return
    const birthData = getExistingBirthData()
    if (!birthData) return
    try {
      const [year, month, day] = birthData.date.split('-').map(Number)
      const [hours, minutes] = birthData.time.split(':').map(Number)
      const birthDateTime = new Date(year, month - 1, day, hours, minutes)
      const planets = getPlanetPositions(birthDateTime, birthData.lat, birthData.lng)
      const sun = planets.find(p => p.id === 'sun')
      if (sun) {
        const profile: ZodiacProfile = {
          sunSign: sun.zodiacSign as ZodiacSign,
          birthDate: birthData.date,
          birthTime: birthData.time,
          birthLocation: { lat: birthData.lat, lng: birthData.lng, name: birthData.city },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        saveZodiacProfile(profile)
        setZodiacProfileState(profile)
      }
    } catch { /* ignore */ }
  }, [zodiacProfile])

  const setZodiacProfile = useCallback((profile: ZodiacProfile) => {
    saveZodiacProfile(profile)
    setZodiacProfileState(profile)
  }, [])

  // Generate reading helper
  const generateReading = useCallback(() => {
    if (!astroData) return
    const reading = generateCosmicReading(astroData, zodiacProfile)
    setCurrentReading(reading)
  }, [astroData, zodiacProfile])

  // === ACTIONS ===

  const startReading = useCallback(() => {
    if (!zodiacProfile) {
      dispatch({ type: 'SHOW_ONBOARDING' })
    } else {
      generateReading()
      dispatch({ type: 'START_READING' })
    }
  }, [zodiacProfile, generateReading, dispatch])

  const completeOnboarding = useCallback((profile: ZodiacProfile) => {
    setZodiacProfile(profile)
    // Generate reading with the new profile
    if (astroData) {
      const reading = generateCosmicReading(astroData, profile)
      setCurrentReading(reading)
    }
    dispatch({ type: 'COMPLETE_ONBOARDING' })
  }, [setZodiacProfile, astroData, dispatch])

  const dismissOnboarding = useCallback(() => {
    dispatch({ type: 'DISMISS_ONBOARDING' })
  }, [dispatch])

  const nextPhase = useCallback(() => {
    const total = currentReading?.phases.length ?? 0
    dispatch({ type: 'NEXT_PHASE', totalPhases: total })
  }, [currentReading, dispatch])

  const exitReading = useCallback(() => {
    dispatch({ type: 'EXIT_READING' })
  }, [dispatch])

  // Callback for animation components to signal completion
  const animCompleteGuard = useRef(false)
  const onAnimationComplete = useCallback(() => {
    if (animCompleteGuard.current) return
    animCompleteGuard.current = true
    dispatch({ type: 'ANIMATION_COMPLETE' })
  }, [dispatch])

  // Reset guard when phase changes
  useEffect(() => {
    animCompleteGuard.current = false
  }, [state.status, 'phaseIndex' in state ? state.phaseIndex : -1])

  // === AUTO-TRANSITIONS ===

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    switch (state.status) {
      case 'PREPARING':
        timerRef.current = setTimeout(() => dispatch({ type: 'PREPARING_COMPLETE' }), 400)
        break
      case 'PHASE_ANIMATING':
        // 3-second fallback — primary trigger is onAnimationComplete from camera controller
        timerRef.current = setTimeout(() => {
          if (!animCompleteGuard.current) {
            animCompleteGuard.current = true
            dispatch({ type: 'ANIMATION_COMPLETE' })
          }
        }, 3000)
        break
      case 'PHASE_TRANSITIONING':
        timerRef.current = setTimeout(() => dispatch({ type: 'ANIMATION_COMPLETE' }), 400)
        break
      case 'EXITING':
        timerRef.current = setTimeout(() => {
          dispatch({ type: 'EXIT_COMPLETE' })
          setCurrentReading(null)
        }, 500)
        break
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [state.status, 'phaseIndex' in state ? state.phaseIndex : -1, dispatch])

  // === DERIVED VALUES ===

  const isReadingActive = state.status !== 'IDLE'
  const currentPhaseIndex = 'phaseIndex' in state ? state.phaseIndex : -1
  const currentPhase = currentReading && currentPhaseIndex >= 0
    ? currentReading.phases[currentPhaseIndex] ?? null
    : null
  const totalPhases = currentReading?.phases.length ?? 0

  return (
    <ReadingContext.Provider
      value={{
        state,
        isReadingActive,
        currentReading,
        currentPhase,
        currentPhaseIndex,
        totalPhases,
        zodiacProfile,
        setZodiacProfile,
        startReading,
        completeOnboarding,
        dismissOnboarding,
        nextPhase,
        exitReading,
        onAnimationComplete,
      }}
    >
      {children}
    </ReadingContext.Provider>
  )
}
