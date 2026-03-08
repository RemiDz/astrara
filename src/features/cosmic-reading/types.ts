export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export interface ZodiacProfile {
  sunSign: ZodiacSign
  birthDate?: string        // ISO date string, optional
  birthTime?: string        // HH:MM, optional
  birthLocation?: {
    lat: number
    lng: number
    name: string
  }
  createdAt: string         // ISO datetime
  updatedAt: string         // ISO datetime
}

// === CELESTIAL BODY & ASPECT TYPES ===

export type CelestialBodyId =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'

export type AspectType =
  | 'conjunction'     // 0°
  | 'sextile'         // 60°
  | 'square'          // 90°
  | 'trine'           // 120°
  | 'opposition'      // 180°

export type PhaseType =
  | 'moon-phase'
  | 'sun-position'
  | 'planetary-aspect'
  | 'retrograde'
  | 'planetary-highlight'
  | 'frequency-recommendation'
  | 'summary'

// === ANIMATION DIRECTIVES (consumed by Phase D — define shape now) ===

export interface PhaseAnimation {
  camera?: {
    target?: CelestialBodyId
    zoom?: number                // 1.0 = default, 1.5 = closer
    transitionDuration?: number  // ms, default 1500
  }
  highlights?: {
    bodyId: CelestialBodyId
    effect: 'pulse' | 'glow' | 'enlarge'
    color?: string
    intensity?: number           // 0-1, default 0.8
  }[]
  aspectLine?: {
    from: CelestialBodyId
    to: CelestialBodyId
    color: string
    style: 'solid' | 'dashed'
    animateDrawing: boolean
    drawDuration?: number        // ms, default 1000
  }
  dimOthers?: boolean            // default true
  sceneEffect?: {
    type: 'vignette' | 'subtle-particles' | 'none'
    intensity?: number
  }
}

// === READING PHASE ===

export interface ReadingPhase {
  id: string                     // e.g. 'moon-phase', 'sun-sign', 'aspect-mars-venus'
  type: PhaseType
  title: string                  // e.g. "Moon Phase", "The Sun Today"
  subtitle?: string              // e.g. "Waning Gibbous in Libra · 23°"
  icon?: string                  // Emoji or glyph

  // Content
  generalReading: string         // Universal reading text (always shown)
  personalReading?: string       // Sign-specific reading (shown if zodiac profile exists)
  plainName?: string             // Plain-English subtitle for jargon terms (e.g. "Sharing & Teaching" for Waning Gibbous)

  // Animation directives — consumed by Three.js scene in Phase D
  animation: PhaseAnimation

  // Metadata
  celestialData: {
    bodies?: CelestialBodyId[]
    sign?: ZodiacSign
    degree?: number
    aspect?: AspectType
    retrograde?: boolean
  }

  // Sound healing tie-in
  frequencyRecommendation?: {
    hz: number
    name: string
    description: string
    appLink?: string
  }
}

// === COMPLETE READING ===

export interface CosmicReading {
  id: string
  date: string                   // ISO date
  generatedAt: string            // ISO datetime
  phases: ReadingPhase[]
  summary: {
    theme: string                // e.g. "Release & Reflect"
    keywords: string[]
    generalSummary: string
    personalSummary?: string
  }
  meta: {
    totalPhases: number
    estimatedReadingTime: number // Minutes
    zodiacProfile?: ZodiacProfile
  }
}
