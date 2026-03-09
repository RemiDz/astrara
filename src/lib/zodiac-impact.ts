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

export function calculateZodiacImpact(
  planets: PlanetPosition[],
  aspects: AspectData[],
): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const s of ALL_SIGNS) scores[s] = 0

  // Planet presence (weighted)
  for (const planet of planets) {
    const sign = planet.zodiacSign
    if (!sign || !(sign in scores)) continue
    const weight =
      planet.id === 'sun' ? 3.0 :
      planet.id === 'moon' ? 2.5 :
      planet.id === 'mars' ? 2.0 :
      ['mercury', 'venus', 'jupiter', 'saturn'].includes(planet.id) ? 1.5 : 1.0
    scores[sign] += weight
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
    const aspectWeight =
      aspect.type === 'conjunction' ? 2.0 :
      aspect.type === 'opposition' ? 1.8 :
      aspect.type === 'square' ? 1.5 :
      aspect.type === 'trine' ? 1.0 : 0.8
    const boost = orbFactor * aspectWeight
    const s1 = planetSign[aspect.planet1]
    const s2 = planetSign[aspect.planet2]
    if (s1 && s1 in scores) scores[s1] += boost
    if (s2 && s2 in scores) scores[s2] += boost
  }

  // Ruling planet activity
  for (const [sign, ruler] of Object.entries(RULERS)) {
    for (const aspect of aspects) {
      if (aspect.orb > 5) continue
      if (aspect.planet1 === ruler || aspect.planet2 === ruler) {
        const orbFactor = Math.max(0, 1 - aspect.orb / 5)
        scores[sign] += orbFactor * 0.5
      }
    }
  }

  // Normalise to 0–1
  const max = Math.max(...Object.values(scores), 1)
  for (const sign of Object.keys(scores)) {
    scores[sign] = scores[sign] / max
  }

  return scores
}
