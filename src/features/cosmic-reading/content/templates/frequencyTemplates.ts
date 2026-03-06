import type { CelestialBodyId } from '../../types'

export interface PlanetaryFrequency {
  hz: number
  name: { en: string; lt: string }
  chakra: { en: string; lt: string }
  description: { en: string; lt: string }
  binaraLink: string
}

export const PLANETARY_FREQUENCIES: Record<CelestialBodyId, PlanetaryFrequency> = {
  sun: {
    hz: 126.22,
    name: { en: 'Sun Tone', lt: 'Saulės tonas' },
    chakra: { en: 'Solar Plexus', lt: 'Saulės rezginys' },
    description: { en: 'Vitality, confidence, core identity', lt: 'Gyvybingumas, pasitikėjimas, vidinė tapatybė' },
    binaraLink: 'https://binara.app?freq=126.22',
  },
  moon: {
    hz: 210.42,
    name: { en: 'Moon Tone', lt: 'Mėnulio tonas' },
    chakra: { en: 'Sacral', lt: 'Kryžkaulio čakra' },
    description: { en: 'Emotions, intuition, inner rhythms', lt: 'Emocijos, intuicija, vidiniai ritmai' },
    binaraLink: 'https://binara.app?freq=210.42',
  },
  mercury: {
    hz: 141.27,
    name: { en: 'Mercury Tone', lt: 'Merkurijaus tonas' },
    chakra: { en: 'Throat', lt: 'Gerklės čakra' },
    description: { en: 'Communication, thought, expression', lt: 'Bendravimas, mintis, saviraiška' },
    binaraLink: 'https://binara.app?freq=141.27',
  },
  venus: {
    hz: 221.23,
    name: { en: 'Venus Tone', lt: 'Veneros tonas' },
    chakra: { en: 'Heart', lt: 'Širdies čakra' },
    description: { en: 'Love, harmony, beauty, connection', lt: 'Meilė, harmonija, grožis, ryšys' },
    binaraLink: 'https://binara.app?freq=221.23',
  },
  mars: {
    hz: 144.72,
    name: { en: 'Mars Tone', lt: 'Marso tonas' },
    chakra: { en: 'Root', lt: 'Šaknų čakra' },
    description: { en: 'Drive, action, physical energy', lt: 'Varomoji jėga, veiksmas, fizinė energija' },
    binaraLink: 'https://binara.app?freq=144.72',
  },
  jupiter: {
    hz: 183.58,
    name: { en: 'Jupiter Tone', lt: 'Jupiterio tonas' },
    chakra: { en: 'Crown', lt: 'Karūninė čakra' },
    description: { en: 'Expansion, wisdom, abundance', lt: 'Plėtra, išmintis, gausybė' },
    binaraLink: 'https://binara.app?freq=183.58',
  },
  saturn: {
    hz: 147.85,
    name: { en: 'Saturn Tone', lt: 'Saturno tonas' },
    chakra: { en: 'Root', lt: 'Šaknų čakra' },
    description: { en: 'Structure, discipline, boundaries', lt: 'Struktūra, disciplina, ribos' },
    binaraLink: 'https://binara.app?freq=147.85',
  },
  uranus: {
    hz: 207.36,
    name: { en: 'Uranus Tone', lt: 'Urano tonas' },
    chakra: { en: 'Third Eye', lt: 'Trečioji akis' },
    description: { en: 'Innovation, awakening, sudden change', lt: 'Inovacija, prabudimas, staigus pokytis' },
    binaraLink: 'https://binara.app?freq=207.36',
  },
  neptune: {
    hz: 211.44,
    name: { en: 'Neptune Tone', lt: 'Neptūno tonas' },
    chakra: { en: 'Crown', lt: 'Karūninė čakra' },
    description: { en: 'Transcendence, dreams, spiritual connection', lt: 'Transcendencija, svajonės, dvasinis ryšys' },
    binaraLink: 'https://binara.app?freq=211.44',
  },
  pluto: {
    hz: 140.25,
    name: { en: 'Pluto Tone', lt: 'Plutono tonas' },
    chakra: { en: 'Root', lt: 'Šaknų čakra' },
    description: { en: 'Transformation, rebirth, deep power', lt: 'Transformacija, atgimimas, gili jėga' },
    binaraLink: 'https://binara.app?freq=140.25',
  },
}
