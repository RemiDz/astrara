import { getPlanetPositions, getMoonData } from './astronomy'
import { calculateAspects } from './aspects'
import { ZODIAC_SIGNS } from './zodiac'
import type { TransitDataForMonth, TransitPosition, TransitAspectRaw } from '@/types/transit-grid'

function formatPosition(p: { glyph: string; name: string; zodiacSign: string; degreeInSign: number; isRetrograde: boolean }): TransitPosition {
  const sign = ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)
  return {
    glyph: p.glyph,
    name: p.name,
    sign: sign?.name ?? p.zodiacSign,
    degree: p.degreeInSign,
    retrograde: p.isRetrograde,
  }
}

function formatAspect(a: { planet1: string; planet1Glyph: string; planet2: string; planet2Glyph: string; type: string; symbol: string; orb: number; isApplying: boolean }): TransitAspectRaw {
  return {
    planet1: a.planet1,
    planet1Glyph: a.planet1Glyph,
    planet2: a.planet2,
    planet2Glyph: a.planet2Glyph,
    type: a.type,
    symbol: a.symbol,
    orb: Math.round(a.orb * 100) / 100,
    isApplying: a.isApplying,
  }
}

function getMoonPhaseEvents(year: number, month: number): string[] {
  const phases: string[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12)
    const moon = getMoonData(date)

    // Check for near-exact new/full moon
    if (moon.phase === 'New Moon') {
      const monthName = date.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })
      phases.push(`New Moon on ${monthName} in ${ZODIAC_SIGNS.find(z => z.id === moon.zodiacSign)?.name ?? moon.zodiacSign}`)
    } else if (moon.phase === 'Full Moon') {
      const monthName = date.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })
      phases.push(`Full Moon on ${monthName} in ${ZODIAC_SIGNS.find(z => z.id === moon.zodiacSign)?.name ?? moon.zodiacSign}`)
    }
  }

  return phases
}

export function computeMonthTransitData(year: number, month: number): TransitDataForMonth {
  const date1st = new Date(year, month, 1, 12)
  const date15th = new Date(year, month, 15, 12)
  const dateLast = new Date(year, month + 1, 0, 12)

  // Planet positions for 1st and 15th
  const pos1st = getPlanetPositions(date1st, 0, 0)
  const pos15th = getPlanetPositions(date15th, 0, 0)
  const posLast = getPlanetPositions(dateLast, 0, 0)

  // Aspects
  const aspects1st = calculateAspects(pos1st)
  const aspects15th = calculateAspects(pos15th)

  // Detect sign ingresses (planet changes sign from 1st to last day)
  const ingresses: string[] = []
  for (let i = 0; i < pos1st.length; i++) {
    if (pos1st[i].zodiacSign !== posLast[i].zodiacSign) {
      const signName = ZODIAC_SIGNS.find(z => z.id === posLast[i].zodiacSign)?.name ?? posLast[i].zodiacSign
      ingresses.push(`${pos1st[i].name} enters ${signName}`)
    }
  }

  // Detect retrograde stations (status changes between 1st and 15th or 15th and last)
  const retrogrades: string[] = []
  for (let i = 0; i < pos1st.length; i++) {
    if (pos1st[i].isRetrograde !== pos15th[i].isRetrograde) {
      const action = pos15th[i].isRetrograde ? 'stations retrograde' : 'stations direct'
      retrogrades.push(`${pos1st[i].name} ${action}`)
    } else if (pos15th[i].isRetrograde !== posLast[i].isRetrograde) {
      const action = posLast[i].isRetrograde ? 'stations retrograde' : 'stations direct'
      retrogrades.push(`${pos15th[i].name} ${action}`)
    }
    // Also note if a planet is retrograde throughout the month
    if (pos1st[i].isRetrograde && pos15th[i].isRetrograde && posLast[i].isRetrograde) {
      retrogrades.push(`${pos1st[i].name} retrograde throughout`)
    }
  }

  // Moon phases
  const moonPhases = getMoonPhaseEvents(year, month)

  const monthLabel = date1st.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`

  return {
    monthLabel,
    monthKey,
    positions_1st: pos1st.map(formatPosition),
    positions_15th: pos15th.map(formatPosition),
    aspects_1st: aspects1st.map(formatAspect),
    aspects_15th: aspects15th.map(formatAspect),
    ingresses,
    retrogrades: [...new Set(retrogrades)], // deduplicate
    moonPhases,
  }
}

export function computeAllMonthsTransitData(): TransitDataForMonth[] {
  const now = new Date()
  const months: TransitDataForMonth[] = []

  for (let i = 0; i < 12; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
    months.push(computeMonthTransitData(targetDate.getFullYear(), targetDate.getMonth()))
  }

  return months
}
