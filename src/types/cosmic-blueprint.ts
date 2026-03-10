// Cosmic Blueprint Premium PDF — Narrative Types

export interface BlueprintCategoryNarrative {
  score: number
  narrative: string
  sonic_rx?: string // Sound healing prescription for this category
}

export interface BlueprintMonthNarrative {
  month: string // e.g. "March 2026"
  overall_score: number
  opening: string
  finance: BlueprintCategoryNarrative
  relationships: BlueprintCategoryNarrative
  career: BlueprintCategoryNarrative
  health: BlueprintCategoryNarrative
  spiritual: BlueprintCategoryNarrative
  month_synthesis: string
  month_sonic_focus?: string // Primary sound healing focus for the month
  affirmation?: string // Monthly affirmation/mantra
}

export interface BlueprintEclipseRetroEvent {
  name: string
  date: string
  type: 'eclipse_solar' | 'eclipse_lunar' | 'retrograde'
  narrative: string
  sonic_rx: string
}

export interface BlueprintEclipseRetroData {
  intro: string
  events: BlueprintEclipseRetroEvent[]
}

export interface BlueprintYearOverview {
  opening: string
  major_themes: string
  peak_periods: string
  growth_trajectory: string
  closing_message: string
  eclipses_and_retrogrades?: BlueprintEclipseRetroData
}

// Ritual Calendar types (pure computation, no AI)
export interface RitualCalendarEvent {
  day: number
  type: 'beneficial_aspect' | 'challenging_aspect' | 'retrograde_station' | 'moon_phase' | 'eclipse' | 'season'
  label: string
}

export interface RitualCalendarMonth {
  monthLabel: string
  year: number
  month: number // 0-indexed
  daysInMonth: number
  firstDayOfWeek: number // 0=Sun, 1=Mon, etc
  events: RitualCalendarEvent[]
}

export interface BlueprintData {
  months: BlueprintMonthNarrative[]
  year_overview: BlueprintYearOverview | null
  ritualCalendar?: RitualCalendarMonth[]
  clientName: string
  birthDate: string
  birthTime: string
  language: 'en' | 'lt'
  generatedAt: number
}

export type BlueprintCategoryKey = 'finance' | 'relationships' | 'career' | 'health' | 'spiritual'

export const BLUEPRINT_CATEGORY_KEYS: BlueprintCategoryKey[] = [
  'finance', 'relationships', 'career', 'health', 'spiritual',
]

// Planet → Sound Healing mapping (Hans Cousto's cosmic octave)
export const PLANET_FREQUENCIES: Record<string, { hz: number; chakra: string; instrument: string; note: string }> = {
  Sun: { hz: 126.22, chakra: 'Solar Plexus', instrument: 'Crystal singing bowl (E note)', note: 'E' },
  Moon: { hz: 210.42, chakra: 'Sacral', instrument: 'Crystal singing bowl (G# note)', note: 'G#' },
  Mercury: { hz: 141.27, chakra: 'Throat', instrument: 'Tuning fork, Tibetan bells', note: 'C#' },
  Venus: { hz: 221.23, chakra: 'Heart', instrument: 'Crystal singing bowl (A note)', note: 'A' },
  Mars: { hz: 144.72, chakra: 'Root', instrument: 'Djembe, frame drum', note: 'D' },
  Jupiter: { hz: 183.58, chakra: 'Crown', instrument: 'Gong, monochord', note: 'F#' },
  Saturn: { hz: 147.85, chakra: 'Root', instrument: 'Monochord, didgeridoo', note: 'D' },
  Uranus: { hz: 207.36, chakra: 'Third Eye', instrument: 'Tuning fork, crystal bowl', note: 'G#' },
  Neptune: { hz: 211.44, chakra: 'Third Eye', instrument: 'Ocean drum, singing bowl', note: 'G#' },
  Pluto: { hz: 140.25, chakra: 'Root', instrument: 'Gong, Tibetan bowl', note: 'C#' },
}
