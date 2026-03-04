import type { PlanetPosition, AspectData } from './astronomy'

interface AspectDef {
  name: string
  symbol: string
  angle: number
  colour: string
}

const ASPECT_TYPES: AspectDef[] = [
  { name: 'conjunction', symbol: '☌', angle: 0, colour: '#FFFFFF' },
  { name: 'sextile', symbol: '⚹', angle: 60, colour: '#60A5FA' },
  { name: 'square', symbol: '□', angle: 90, colour: '#FF4444' },
  { name: 'trine', symbol: '△', angle: 120, colour: '#4ADE80' },
  { name: 'opposition', symbol: '☍', angle: 180, colour: '#FF8C00' },
]

function getOrb(p1: string, p2: string, aspectName: string): number {
  const luminaries = ['sun', 'moon']
  const isLuminary = luminaries.includes(p1) || luminaries.includes(p2)

  if (aspectName === 'conjunction' || aspectName === 'opposition') {
    return isLuminary ? 10 : 8
  }
  if (aspectName === 'trine' || aspectName === 'square') {
    return isLuminary ? 8 : 6
  }
  return isLuminary ? 6 : 4
}

function angleDiff(a: number, b: number): number {
  let diff = Math.abs(a - b) % 360
  if (diff > 180) diff = 360 - diff
  return diff
}

export function calculateAspects(positions: PlanetPosition[]): AspectData[] {
  const aspects: AspectData[] = []

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i]
      const p2 = positions[j]
      const diff = angleDiff(p1.eclipticLongitude, p2.eclipticLongitude)

      for (const aspect of ASPECT_TYPES) {
        const maxOrb = getOrb(p1.id, p2.id, aspect.name)
        const orb = Math.abs(diff - aspect.angle)

        if (orb <= maxOrb) {
          // Check if applying or separating
          const isApplying = checkIfApplying(p1, p2, aspect.angle)

          aspects.push({
            planet1: p1.id,
            planet2: p2.id,
            planet1Glyph: p1.glyph,
            planet2Glyph: p2.glyph,
            type: aspect.name,
            symbol: aspect.symbol,
            angle: aspect.angle,
            orb: Math.round(orb * 10) / 10,
            isApplying,
            colour: aspect.colour,
          })
          break // Only the tightest aspect between a pair
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb)
}

function checkIfApplying(p1: PlanetPosition, p2: PlanetPosition, targetAngle: number): boolean {
  const currentDiff = angleDiff(p1.eclipticLongitude, p2.eclipticLongitude)
  return Math.abs(currentDiff - targetAngle) > 0.5 ? currentDiff < targetAngle + 0.5 : false
}

export function getNotableAspects(aspects: AspectData[]): AspectData[] {
  // Return aspects with orb < 3 degrees (tight aspects)
  return aspects.filter(a => a.orb < 3).slice(0, 5)
}
