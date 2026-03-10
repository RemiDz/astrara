// Transit Grid Types

export interface TransitAspect {
  type: string
  symbol: string
  target: string
  target_symbol: string
  interpretation: string
}

export interface PlanetaryBreakdown {
  planet: string
  symbol: string
  position: string
  aspects: TransitAspect[]
  impact_contribution: number
  category_effect: string
}

export interface CategoryReading {
  impact_score: number
  key_theme: string
  full_reading: string
  planetary_breakdown: PlanetaryBreakdown[]
  practical_guidance: string
  dates_to_watch: string[]
}

export interface MonthlySummary {
  impact_score: number
  dominant_theme: string
  full_reading: string
  key_players: string[]
  opportunities: string
  challenges: string
  interrelations: string
}

export interface MonthData {
  month: string
  monthKey: string // e.g. "2026-03"
  categories: {
    finance: CategoryReading
    relationships: CategoryReading
    career: CategoryReading
    health: CategoryReading
    spiritual: CategoryReading
    monthly_summary: MonthlySummary
  }
}

export interface OverviewCategory {
  impact_score: number
  year_trend: string
  peak_months: string[]
  trajectory: string
  key_events: string
  full_reading: string
}

export interface OverviewData {
  categories: {
    finance: OverviewCategory
    relationships: OverviewCategory
    career: OverviewCategory
    health: OverviewCategory
    spiritual: OverviewCategory
    grand_summary: {
      impact_score: number
      dominant_theme: string
      full_reading: string
      key_players: string[]
      peak_months: string[]
      trajectory: string
    }
  }
}

export type CategoryKey = 'finance' | 'relationships' | 'career' | 'health' | 'spiritual'

export const CATEGORY_KEYS: CategoryKey[] = ['finance', 'relationships', 'career', 'health', 'spiritual']

export const CATEGORY_ICONS: Record<CategoryKey | 'monthly_summary', string> = {
  finance: '💰',
  relationships: '💕',
  career: '🎯',
  health: '🌿',
  spiritual: '✨',
  monthly_summary: '📊',
}

export interface TransitDataForMonth {
  monthLabel: string
  monthKey: string
  positions_1st: TransitPosition[]
  positions_15th: TransitPosition[]
  aspects_1st: TransitAspectRaw[]
  aspects_15th: TransitAspectRaw[]
  ingresses: string[]
  retrogrades: string[]
  moonPhases: string[]
}

export interface TransitPosition {
  glyph: string
  name: string
  sign: string
  degree: number
  retrograde: boolean
}

export interface TransitAspectRaw {
  planet1: string
  planet1Glyph: string
  planet2: string
  planet2Glyph: string
  type: string
  symbol: string
  orb: number
  isApplying: boolean
}

export interface GridState {
  months: (MonthData | null)[]
  overview: OverviewData | null
  loading: boolean
  progress: number
  totalCalls: number
  error: string | null
}
