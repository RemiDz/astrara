import type { PlanetPosition } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'

export type ElementType = 'fire' | 'water' | 'earth' | 'air'
export type CrystalForm = 'seed' | 'icosa'
export type CrystalFormOverride = 'auto' | 'seed' | 'icosa'

const SIGN_TO_ELEMENT: Record<string, ElementType> = {}
ZODIAC_SIGNS.forEach((s) => {
  SIGN_TO_ELEMENT[s.id] = s.element as ElementType
})

const LUMINARIES = new Set(['sun', 'moon'])

export function getDominantElement(planets: PlanetPosition[]): ElementType {
  const counts: Record<ElementType, number> = { fire: 0, water: 0, earth: 0, air: 0 }

  for (const planet of planets) {
    const element = SIGN_TO_ELEMENT[planet.zodiacSign]
    if (!element) continue
    const weight = LUMINARIES.has(planet.id) ? 2 : 1
    counts[element] += weight
  }

  let maxCount = 0
  let dominant: ElementType = 'air'
  let tieCount = 0

  for (const el of ['fire', 'water', 'earth', 'air'] as ElementType[]) {
    if (counts[el] > maxCount) {
      maxCount = counts[el]
      dominant = el
      tieCount = 1
    } else if (counts[el] === maxCount) {
      tieCount++
    }
  }

  // Tie → air (morph)
  if (tieCount > 1) return 'air'
  return dominant
}

export function elementToForm(element: ElementType): CrystalForm {
  switch (element) {
    case 'water': return 'seed'
    default: return 'icosa' // fire, earth, air, tie → icosahedron
  }
}

export function getActiveForm(override: CrystalFormOverride, planets: PlanetPosition[]): CrystalForm {
  if (override === 'auto') return elementToForm(getDominantElement(planets))
  // Migrate legacy 'toroid' override to 'auto'
  if ((override as string) === 'toroid') return elementToForm(getDominantElement(planets))
  return override
}

export const ELEMENT_COLOURS: Record<ElementType, string> = {
  fire: '#FF6B35',
  water: '#4D8DE8',
  earth: '#4DCCB0',
  air: '#C0B0FF',
}

export function getElementCounts(planets: PlanetPosition[]): Record<ElementType, number> {
  const counts: Record<ElementType, number> = { fire: 0, water: 0, earth: 0, air: 0 }
  for (const planet of planets) {
    const element = SIGN_TO_ELEMENT[planet.zodiacSign]
    if (element) counts[element]++
  }
  return counts
}
