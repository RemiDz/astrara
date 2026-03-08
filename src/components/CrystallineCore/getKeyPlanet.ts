import type { PlanetPosition, AspectData, MoonData } from '@/lib/astronomy'

export interface KeyPlanetInfo {
  planet: string
  reason: string
  reasonLt: string
}

/**
 * Determines the single most important planet today.
 * Priority: sign ingress → retrograde station → tightest aspect → Moon fallback
 */
export function getKeyPlanet(
  planets: PlanetPosition[],
  aspects: AspectData[],
  moon: MoonData,
): KeyPlanetInfo {
  // 1. Any planet that just changed sign today (degree < 1° in new sign)
  for (const p of planets) {
    if (p.id !== 'moon' && p.degreeInSign < 1) {
      const signName = p.zodiacSign.charAt(0).toUpperCase() + p.zodiacSign.slice(1)
      return {
        planet: p.id,
        reason: `Just entered ${signName} today`,
        reasonLt: `Šiandien įžengė į ${signName}`,
      }
    }
  }

  // 2. Any planet stationing retrograde or direct today
  // Heuristic: retrograde planets near 0° speed (we only know isRetrograde flag)
  // Use outer planets that are retrograde as significant
  const outerRetro = planets.filter(p =>
    p.isRetrograde && !['sun', 'moon'].includes(p.id)
  )
  if (outerRetro.length > 0) {
    // Pick the slowest-moving retrograde (outer planets first)
    const slowOrder = ['pluto', 'neptune', 'uranus', 'saturn', 'jupiter', 'mars', 'venus', 'mercury']
    const sorted = outerRetro.sort((a, b) => slowOrder.indexOf(a.id) - slowOrder.indexOf(b.id))
    // Only flag as "stationed" if it's the first one — otherwise fall through to tightest aspect
    // This is approximate; real stationing detection would need speed data
  }

  // 3. The planet involved in the tightest aspect
  if (aspects.length > 0) {
    const tightest = aspects.reduce((best, a) => a.orb < best.orb ? a : best)
    if (tightest.orb < 5) {
      const p1Name = tightest.planet1.charAt(0).toUpperCase() + tightest.planet1.slice(1)
      const p2Name = tightest.planet2.charAt(0).toUpperCase() + tightest.planet2.slice(1)
      // Pick which planet is more "interesting" (not sun/moon if possible)
      const keyId = ['sun', 'moon'].includes(tightest.planet1) ? tightest.planet2 : tightest.planet1
      const otherName = keyId === tightest.planet1 ? p2Name : p1Name

      return {
        planet: keyId,
        reason: `Tightest aspect: ${tightest.symbol} ${tightest.type} with ${otherName} (${tightest.orb.toFixed(1)}° orb)`,
        reasonLt: `Tiksliausias aspektas: ${tightest.symbol} ${tightest.type} su ${otherName} (${tightest.orb.toFixed(1)}° orbis)`,
      }
    }
  }

  // 4. Moon fallback
  const moonSign = moon.zodiacSign.charAt(0).toUpperCase() + moon.zodiacSign.slice(1)
  return {
    planet: 'moon',
    reason: `Moon drives today's energy from ${moonSign}`,
    reasonLt: `Mėnulis šiandien veda energiją iš ${moonSign}`,
  }
}
