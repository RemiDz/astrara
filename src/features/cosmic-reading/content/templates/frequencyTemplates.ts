import type { CelestialBodyId } from '../../types'

export interface PlanetaryFrequency {
  hz: number
  name: string
  chakra: string
  description: string
  binaraLink: string
}

export const PLANETARY_FREQUENCIES: Record<CelestialBodyId, PlanetaryFrequency> = {
  sun:     { hz: 126.22, name: 'Sun Tone',     chakra: 'Solar Plexus', description: 'Vitality, confidence, core identity',         binaraLink: 'https://binara.app?freq=126.22' },
  moon:    { hz: 210.42, name: 'Moon Tone',     chakra: 'Sacral',       description: 'Emotions, intuition, inner rhythms',          binaraLink: 'https://binara.app?freq=210.42' },
  mercury: { hz: 141.27, name: 'Mercury Tone',  chakra: 'Throat',       description: 'Communication, thought, expression',          binaraLink: 'https://binara.app?freq=141.27' },
  venus:   { hz: 221.23, name: 'Venus Tone',    chakra: 'Heart',        description: 'Love, harmony, beauty, connection',           binaraLink: 'https://binara.app?freq=221.23' },
  mars:    { hz: 144.72, name: 'Mars Tone',     chakra: 'Root',         description: 'Drive, action, physical energy',              binaraLink: 'https://binara.app?freq=144.72' },
  jupiter: { hz: 183.58, name: 'Jupiter Tone',  chakra: 'Crown',        description: 'Expansion, wisdom, abundance',                binaraLink: 'https://binara.app?freq=183.58' },
  saturn:  { hz: 147.85, name: 'Saturn Tone',   chakra: 'Root',         description: 'Structure, discipline, boundaries',           binaraLink: 'https://binara.app?freq=147.85' },
  uranus:  { hz: 207.36, name: 'Uranus Tone',   chakra: 'Third Eye',    description: 'Innovation, awakening, sudden change',        binaraLink: 'https://binara.app?freq=207.36' },
  neptune: { hz: 211.44, name: 'Neptune Tone',  chakra: 'Crown',        description: 'Transcendence, dreams, spiritual connection', binaraLink: 'https://binara.app?freq=211.44' },
  pluto:   { hz: 140.25, name: 'Pluto Tone',    chakra: 'Root',         description: 'Transformation, rebirth, deep power',         binaraLink: 'https://binara.app?freq=140.25' },
}
