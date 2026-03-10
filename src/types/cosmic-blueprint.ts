// Cosmic Blueprint Premium PDF — Narrative Types

export interface BlueprintCategoryNarrative {
  score: number
  narrative: string
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
}

export interface BlueprintYearOverview {
  opening: string
  major_themes: string
  peak_periods: string
  growth_trajectory: string
  closing_message: string
}

export interface BlueprintData {
  months: BlueprintMonthNarrative[]
  year_overview: BlueprintYearOverview | null
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
