import type { PlanetPosition, MoonData, AspectData } from './astronomy'

export interface PlanetInsight {
  oneLiner: string
  fullInsight: string
  practicalTip: string
  approxDuration: string
}

export interface AspectInsight {
  name: string
  symbol: string
  nature: string
  generalMeaning: string
}

export interface PlanetPairInsight {
  meaning: string
}

export interface SignInsight {
  whatItFeelsLike: string
  keywords: string[]
}

export interface PhaseInsight {
  meaning: string
  guidance: string
}

export function getPlanetInsight(
  planet: PlanetPosition,
  planetMeanings: Record<string, Record<string, PlanetInsight>>
): PlanetInsight | null {
  return planetMeanings[planet.id]?.[planet.zodiacSign] ?? null
}

export function getAspectInsight(
  aspect: AspectData,
  aspectMeanings: Record<string, AspectInsight>,
  planetPairAspects: Record<string, Record<string, string>>
): { general: AspectInsight | null; specific: string | null } {
  const general = aspectMeanings[aspect.type] ?? null
  const pairKey1 = `${aspect.planet1}-${aspect.planet2}`
  const pairKey2 = `${aspect.planet2}-${aspect.planet1}`
  const specific = planetPairAspects[pairKey1]?.[aspect.type]
    ?? planetPairAspects[pairKey2]?.[aspect.type]
    ?? null
  return { general, specific }
}

export function getMoonInsight(
  moon: MoonData,
  phaseMeanings: Record<string, PhaseInsight>
): PhaseInsight | null {
  const phaseKey = moon.phase.toLowerCase().replace(/\s+/g, '-')
  return phaseMeanings[phaseKey] ?? null
}
