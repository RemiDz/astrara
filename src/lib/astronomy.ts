import * as Astronomy from 'astronomy-engine'
import { getSignFromLongitude, getDegreeInSign } from './zodiac'
import { PLANETS as PLANET_META } from './planets'

export interface PlanetPosition {
  id: string
  name: string
  glyph: string
  eclipticLongitude: number
  zodiacSign: string
  signGlyph: string
  degreeInSign: number
  isRetrograde: boolean
  distanceAU: number
  riseTime: Date | null
  setTime: Date | null
  colour: string
  size: number
}

export interface AspectData {
  planet1: string
  planet2: string
  planet1Glyph: string
  planet2Glyph: string
  type: string
  symbol: string
  angle: number
  orb: number
  isApplying: boolean
  colour: string
}

export interface MoonData {
  phase: string
  illumination: number
  zodiacSign: string
  signGlyph: string
  degreeInSign: number
  age: number
  nextFullMoon: Date | null
  nextNewMoon: Date | null
  emoji: string
}

const ASTRO_BODIES: { body: Astronomy.Body; id: string }[] = [
  { body: 'Sun' as Astronomy.Body, id: 'sun' },
  { body: 'Moon' as Astronomy.Body, id: 'moon' },
  { body: 'Mercury' as Astronomy.Body, id: 'mercury' },
  { body: 'Venus' as Astronomy.Body, id: 'venus' },
  { body: 'Mars' as Astronomy.Body, id: 'mars' },
  { body: 'Jupiter' as Astronomy.Body, id: 'jupiter' },
  { body: 'Saturn' as Astronomy.Body, id: 'saturn' },
  { body: 'Uranus' as Astronomy.Body, id: 'uranus' },
  { body: 'Neptune' as Astronomy.Body, id: 'neptune' },
  { body: 'Pluto' as Astronomy.Body, id: 'pluto' },
]

function getEclipticLongitude(body: Astronomy.Body, date: Date): number {
  if (body === ('Sun' as Astronomy.Body)) {
    const sunPos = Astronomy.SunPosition(date)
    return sunPos.elon
  }
  if (body === ('Moon' as Astronomy.Body)) {
    const moonPos = Astronomy.EclipticGeoMoon(date)
    return moonPos.lon
  }
  // Use GEOCENTRIC ecliptic longitude for natal astrology (not heliocentric).
  // Astronomy.EclipticLongitude returns heliocentric which is wrong for inner planets.
  const geo = Astronomy.GeoVector(body, date, true)
  const obliq = 23.4393 * Math.PI / 180 // J2000 mean obliquity
  const yEcl = geo.y * Math.cos(obliq) + geo.z * Math.sin(obliq)
  let lon = Math.atan2(yEcl, geo.x) * 180 / Math.PI
  if (lon < 0) lon += 360
  return lon
}

function getDistanceAU(body: Astronomy.Body, date: Date): number {
  const vector = Astronomy.GeoVector(body, date, true)
  return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2)
}

function checkRetrograde(body: Astronomy.Body, date: Date): boolean {
  if (body === ('Sun' as Astronomy.Body) || body === ('Moon' as Astronomy.Body)) return false
  const now = getEclipticLongitude(body, date)
  const tomorrow = new Date(date.getTime() + 86400000)
  const next = getEclipticLongitude(body, tomorrow)
  let diff = next - now
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff < 0
}

export function getPlanetPositions(date: Date, lat: number, lng: number): PlanetPosition[] {
  const observer = new Astronomy.Observer(lat, lng, 0)

  return ASTRO_BODIES.map(({ body, id }) => {
    const meta = PLANET_META.find(p => p.id === id)!
    const longitude = getEclipticLongitude(body, date)
    const sign = getSignFromLongitude(longitude)
    const degree = getDegreeInSign(longitude)
    const isRetrograde = checkRetrograde(body, date)
    const distanceAU = getDistanceAU(body, date)

    let riseTime: Date | null = null
    let setTime: Date | null = null
    try {
      const rise = Astronomy.SearchRiseSet(body, observer, +1, date, 1)
      riseTime = rise ? rise.date : null
    } catch { /* no rise */ }
    try {
      const set = Astronomy.SearchRiseSet(body, observer, -1, date, 1)
      setTime = set ? set.date : null
    } catch { /* no set */ }

    return {
      id,
      name: meta.name,
      glyph: meta.glyph,
      eclipticLongitude: longitude,
      zodiacSign: sign.id,
      signGlyph: sign.glyph,
      degreeInSign: degree,
      isRetrograde,
      distanceAU,
      riseTime,
      setTime,
      colour: meta.colour,
      size: meta.size,
    }
  })
}

export function getMoonData(date: Date): MoonData {
  const moonPos = Astronomy.EclipticGeoMoon(date)
  const longitude = moonPos.lon
  const sign = getSignFromLongitude(longitude)
  const degree = getDegreeInSign(longitude)

  const moonIllum = Astronomy.Illumination('Moon' as Astronomy.Body, date)
  const illumination = moonIllum.phase_fraction

  const moonPhaseAngle = Astronomy.MoonPhase(date)
  const { phase, emoji } = getMoonPhaseName(moonPhaseAngle)

  const age = moonPhaseAngle / 12.19 // approximate days

  let nextFullMoon: Date | null = null
  let nextNewMoon: Date | null = null
  try {
    const full = Astronomy.SearchMoonPhase(180, date, 30)
    nextFullMoon = full ? full.date : null
  } catch { /* */ }
  try {
    const newM = Astronomy.SearchMoonPhase(0, date, 30)
    nextNewMoon = newM ? newM.date : null
  } catch { /* */ }

  return {
    phase,
    illumination,
    zodiacSign: sign.id,
    signGlyph: sign.glyph,
    degreeInSign: degree,
    age: Math.round(age * 10) / 10,
    nextFullMoon,
    nextNewMoon,
    emoji,
  }
}

function getMoonPhaseName(angle: number): { phase: string; emoji: string } {
  if (angle < 22.5) return { phase: 'New Moon', emoji: '🌑' }
  if (angle < 67.5) return { phase: 'Waxing Crescent', emoji: '🌒' }
  if (angle < 112.5) return { phase: 'First Quarter', emoji: '🌓' }
  if (angle < 157.5) return { phase: 'Waxing Gibbous', emoji: '🌔' }
  if (angle < 202.5) return { phase: 'Full Moon', emoji: '🌕' }
  if (angle < 247.5) return { phase: 'Waning Gibbous', emoji: '🌖' }
  if (angle < 292.5) return { phase: 'Last Quarter', emoji: '🌗' }
  if (angle < 337.5) return { phase: 'Waning Crescent', emoji: '🌘' }
  return { phase: 'New Moon', emoji: '🌑' }
}
