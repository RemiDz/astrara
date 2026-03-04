import { ZODIAC_SIGNS } from '@/lib/zodiac'
import type { PlanetPosition } from '@/lib/astronomy'

// Solfeggio frequencies mapped to zodiac signs
export const SIGN_FREQUENCIES: Record<string, number> = {
  aries:       396,
  taurus:      417,
  gemini:      528,
  cancer:      639,
  leo:         741,
  virgo:       852,
  libra:       639,
  scorpio:     174,
  sagittarius: 963,
  capricorn:   285,
  aquarius:    963,
  pisces:      852,
}

// Planet frequencies based on Hans Cousto's octave method
export const PLANET_FREQUENCIES: Record<string, number> = {
  sun:     126.22,
  moon:    210.42,
  mercury: 141.27,
  venus:   221.23,
  mars:    144.72,
  jupiter: 183.58,
  saturn:  147.85,
  uranus:  207.36,
  neptune: 211.44,
  pluto:   140.25,
}

export const BINAURAL_PRESETS: Record<string, { hz: number; label: string }> = {
  grounding:  { hz: 3.5,  label: 'Delta — deep rest' },
  calming:    { hz: 6.0,  label: 'Theta — meditation' },
  balanced:   { hz: 7.83, label: 'Schumann — Earth sync' },
  focused:    { hz: 10.0, label: 'Alpha — relaxed focus' },
  energising: { hz: 14.0, label: 'Low Beta — alertness' },
  creative:   { hz: 7.0,  label: 'Theta — imagination' },
}

export function getSignElement(signKey: string): string | null {
  const sign = ZODIAC_SIGNS.find(s => s.id === signKey)
  return sign?.element ?? null
}

export function getBinauralPreset(planets: PlanetPosition[]): { hz: number; label: string } {
  const moon = planets.find(p => p.id === 'moon')
  const moonSign = moon?.zodiacSign
  const element = moonSign ? getSignElement(moonSign) : null

  switch (element) {
    case 'fire':  return BINAURAL_PRESETS.energising
    case 'earth': return BINAURAL_PRESETS.grounding
    case 'air':   return BINAURAL_PRESETS.focused
    case 'water': return BINAURAL_PRESETS.calming
    default:      return BINAURAL_PRESETS.balanced
  }
}
