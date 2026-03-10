import type { PlanetPosition, AspectData } from './astronomy'

const RULERS: Record<string, string> = {
  aries: 'mars', taurus: 'venus', gemini: 'mercury', cancer: 'moon',
  leo: 'sun', virgo: 'mercury', libra: 'venus', scorpio: 'pluto',
  sagittarius: 'jupiter', capricorn: 'saturn', aquarius: 'uranus', pisces: 'neptune',
}

const ALL_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
]

function planetWeight(id: string): number {
  return id === 'sun' ? 3.0
    : id === 'moon' ? 2.5
    : id === 'mars' ? 2.0
    : ['mercury', 'venus', 'jupiter', 'saturn'].includes(id) ? 1.5
    : 1.0
}

function aspectWeight(type: string): number {
  return type === 'conjunction' ? 2.0
    : type === 'opposition' ? 1.8
    : type === 'square' ? 1.5
    : type === 'trine' ? 1.0
    : 0.8
}

// --- Simple scores (used by wheel glyphs) ---

export function calculateZodiacImpact(
  planets: PlanetPosition[],
  aspects: AspectData[],
): Record<string, number> {
  const detailed = calculateZodiacImpactDetailed(planets, aspects)
  const scores: Record<string, number> = {}
  for (const [sign, detail] of Object.entries(detailed)) {
    scores[sign] = detail.score
  }
  return scores
}

// --- Detailed breakdown (used by sign modal) ---

export interface ImpactContribution {
  type: 'planet' | 'aspect' | 'ruler'
  value: number
  planetId?: string
  aspectType?: string
  planet1?: string
  planet2?: string
}

export interface SignImpactDetail {
  score: number   // normalised 0–1
  raw: number     // raw score before normalisation
  contributions: ImpactContribution[]
}

export function calculateZodiacImpactDetailed(
  planets: PlanetPosition[],
  aspects: AspectData[],
): Record<string, SignImpactDetail> {
  const result: Record<string, SignImpactDetail> = {}
  for (const s of ALL_SIGNS) result[s] = { score: 0, raw: 0, contributions: [] }

  // Planet presence (weighted)
  for (const planet of planets) {
    const sign = planet.zodiacSign
    if (!sign || !(sign in result)) continue
    const w = planetWeight(planet.id)
    result[sign].raw += w
    result[sign].contributions.push({ type: 'planet', value: w, planetId: planet.id })
  }

  // Build planet→sign lookup for aspect scoring
  const planetSign: Record<string, string> = {}
  for (const p of planets) {
    if (p.zodiacSign) planetSign[p.id] = p.zodiacSign
  }

  // Aspect involvement
  for (const aspect of aspects) {
    if (aspect.orb > 5) continue
    const orbFactor = Math.max(0, 1 - aspect.orb / 5)
    const boost = orbFactor * aspectWeight(aspect.type)
    const s1 = planetSign[aspect.planet1]
    const s2 = planetSign[aspect.planet2]
    const entry: ImpactContribution = {
      type: 'aspect', value: boost,
      aspectType: aspect.type, planet1: aspect.planet1, planet2: aspect.planet2,
    }
    if (s1 && s1 in result) {
      result[s1].raw += boost
      result[s1].contributions.push({ ...entry })
    }
    if (s2 && s2 in result) {
      result[s2].raw += boost
      result[s2].contributions.push({ ...entry })
    }
  }

  // Ruling planet activity
  for (const [sign, ruler] of Object.entries(RULERS)) {
    for (const aspect of aspects) {
      if (aspect.orb > 5) continue
      if (aspect.planet1 === ruler || aspect.planet2 === ruler) {
        const orbFactor = Math.max(0, 1 - aspect.orb / 5)
        const bonus = orbFactor * 0.5
        result[sign].raw += bonus
        result[sign].contributions.push({ type: 'ruler', value: bonus, planetId: ruler })
      }
    }
  }

  // Normalise to 0–1
  const max = Math.max(...Object.values(result).map(r => r.raw), 1)
  for (const sign of Object.keys(result)) {
    result[sign].score = result[sign].raw / max
  }

  return result
}
