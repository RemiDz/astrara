import * as Astronomy from 'astronomy-engine'
import { getPlanetPositions, getMoonData } from './astronomy'
import { calculateAspects } from './aspects'
import { ZODIAC_SIGNS } from './zodiac'
import type { TransitDataForMonth, TransitPosition, TransitAspectRaw } from '@/types/transit-grid'
import type { RitualCalendarMonth, RitualCalendarEvent } from '@/types/cosmic-blueprint'

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

// ═══════════════════════════════════════════════════════════════════════════
// Ritual Calendar — Eclipse, Moon Phase, Retrograde Station, Season data
// ═══════════════════════════════════════════════════════════════════════════

const RETRO_BODIES: Astronomy.Body[] = [
  'Mercury' as Astronomy.Body,
  'Venus' as Astronomy.Body,
  'Mars' as Astronomy.Body,
  'Jupiter' as Astronomy.Body,
  'Saturn' as Astronomy.Body,
  'Uranus' as Astronomy.Body,
  'Neptune' as Astronomy.Body,
  'Pluto' as Astronomy.Body,
]

function checkRetro(body: Astronomy.Body, date: Date): boolean {
  const now = Astronomy.EclipticLongitude(body, date)
  const tomorrow = new Date(date.getTime() + 86400000)
  const next = Astronomy.EclipticLongitude(body, tomorrow)
  let diff = next - now
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff < 0
}

export function computeRitualCalendarData(
  monthDates: { year: number; month: number }[],
): RitualCalendarMonth[] {
  if (monthDates.length === 0) return []

  const startDate = new Date(monthDates[0].year, monthDates[0].month, 1)
  const lastMd = monthDates[monthDates.length - 1]
  const endDate = new Date(lastMd.year, lastMd.month + 1, 0, 23, 59, 59)

  // Pre-compute solar eclipses for the full period
  const solarEclipses: { date: Date; kind: string }[] = []
  try {
    let se = Astronomy.SearchGlobalSolarEclipse(startDate)
    while (se && se.peak.date <= endDate) {
      solarEclipses.push({ date: se.peak.date, kind: se.kind })
      se = Astronomy.NextGlobalSolarEclipse(se.peak)
    }
  } catch { /* eclipse search can fail at boundaries */ }

  // Pre-compute lunar eclipses
  const lunarEclipses: { date: Date; kind: string }[] = []
  try {
    let le = Astronomy.SearchLunarEclipse(startDate)
    while (le && le.peak.date <= endDate) {
      // Only include partial+ (skip penumbral which is barely visible)
      if (le.kind !== 'penumbral') {
        lunarEclipses.push({ date: le.peak.date, kind: le.kind })
      }
      le = Astronomy.NextLunarEclipse(le.peak)
    }
  } catch { /* */ }

  // Pre-compute seasons for relevant years
  const seasons: { date: Date; label: string }[] = []
  const years = new Set(monthDates.map(md => md.year))
  for (const yr of years) {
    try {
      const s = Astronomy.Seasons(yr)
      seasons.push(
        { date: s.mar_equinox.date, label: 'Spring Equinox' },
        { date: s.jun_solstice.date, label: 'Summer Solstice' },
        { date: s.sep_equinox.date, label: 'Autumn Equinox' },
        { date: s.dec_solstice.date, label: 'Winter Solstice' },
      )
    } catch { /* */ }
  }

  const result: RitualCalendarMonth[] = []

  for (const { year, month } of monthDates) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()
    const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    const events: RitualCalendarEvent[] = []

    // ─── Moon phases ───
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59)

    // New moons
    try {
      let nm = Astronomy.SearchMoonPhase(0, monthStart, 35)
      while (nm && nm.date <= monthEnd) {
        if (nm.date.getMonth() === month && nm.date.getFullYear() === year) {
          events.push({ day: nm.date.getDate(), type: 'moon_phase', label: 'New Moon' })
        }
        const nextStart = new Date(nm.date.getTime() + 86400000 * 2)
        if (nextStart > monthEnd) break
        nm = Astronomy.SearchMoonPhase(0, nextStart, 35)
      }
    } catch { /* */ }

    // Full moons
    try {
      let fm = Astronomy.SearchMoonPhase(180, monthStart, 35)
      while (fm && fm.date <= monthEnd) {
        if (fm.date.getMonth() === month && fm.date.getFullYear() === year) {
          events.push({ day: fm.date.getDate(), type: 'moon_phase', label: 'Full Moon' })
        }
        const nextStart = new Date(fm.date.getTime() + 86400000 * 2)
        if (nextStart > monthEnd) break
        fm = Astronomy.SearchMoonPhase(180, nextStart, 35)
      }
    } catch { /* */ }

    // ─── Eclipses ───
    for (const ec of solarEclipses) {
      if (ec.date.getFullYear() === year && ec.date.getMonth() === month) {
        events.push({ day: ec.date.getDate(), type: 'eclipse', label: 'Solar Eclipse' })
      }
    }
    for (const ec of lunarEclipses) {
      if (ec.date.getFullYear() === year && ec.date.getMonth() === month) {
        events.push({ day: ec.date.getDate(), type: 'eclipse', label: 'Lunar Eclipse' })
      }
    }

    // ─── Retrograde stations (check weekly, refine when change detected) ───
    for (const body of RETRO_BODIES) {
      const bodyName = body as string
      let prevRetro = checkRetro(body, new Date(year, month, 1, 12))

      // Check every 3 days for efficiency, then refine
      for (let day = 4; day <= daysInMonth; day += 3) {
        const curRetro = checkRetro(body, new Date(year, month, day, 12))
        if (curRetro !== prevRetro) {
          // Refine to exact day
          let exactDay = day - 2
          for (let d = day - 2; d <= day; d++) {
            if (d < 1) continue
            const r = checkRetro(body, new Date(year, month, d, 12))
            if (r !== prevRetro) { exactDay = d; break }
          }
          events.push({
            day: exactDay,
            type: 'retrograde_station',
            label: curRetro ? `${bodyName} stations retrograde` : `${bodyName} stations direct`,
          })
        }
        prevRetro = curRetro
      }
    }

    // ─── Seasons ───
    for (const s of seasons) {
      if (s.date.getFullYear() === year && s.date.getMonth() === month) {
        events.push({ day: s.date.getDate(), type: 'season', label: s.label })
      }
    }

    // ─── Significant tight aspects (orb < 1.5°) ───
    const pos15 = getPlanetPositions(new Date(year, month, 15, 12), 0, 0)
    const aspects = calculateAspects(pos15)
    const tightAspects = aspects.filter(a => a.orb < 1.5)
    for (const a of tightAspects.slice(0, 4)) {
      const isBeneficial = ['conjunction', 'trine', 'sextile'].includes(a.type)
      events.push({
        day: 15,
        type: isBeneficial ? 'beneficial_aspect' : 'challenging_aspect',
        label: `${a.planet1Glyph} ${a.symbol} ${a.planet2Glyph}`,
      })
    }

    result.push({ monthLabel, year, month, daysInMonth, firstDayOfWeek, events })
  }

  return result
}

// ═══════════════════════════════════════════════════════════════════════════
// Eclipse & Retrograde Summary — text for API prompt
// ═══════════════════════════════════════════════════════════════════════════

export function computeEclipseRetroSummary(
  monthDates: { year: number; month: number }[],
): string {
  if (monthDates.length === 0) return ''

  const startDate = new Date(monthDates[0].year, monthDates[0].month, 1)
  const lastMd = monthDates[monthDates.length - 1]
  const endDate = new Date(lastMd.year, lastMd.month + 1, 0, 23, 59, 59)

  const lines: string[] = []

  // Solar eclipses
  try {
    let se = Astronomy.SearchGlobalSolarEclipse(startDate)
    while (se && se.peak.date <= endDate) {
      const d = se.peak.date
      const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      // Get sun position at eclipse time to find zodiac sign
      const sunPos = Astronomy.SunPosition(d)
      const sign = ZODIAC_SIGNS.find(z => {
        const idx = ZODIAC_SIGNS.indexOf(z)
        const startDeg = idx * 30
        return sunPos.elon >= startDeg && sunPos.elon < startDeg + 30
      })
      lines.push(`Solar Eclipse (${se.kind}) on ${dateStr} in ${sign?.name ?? 'unknown'}`)
      se = Astronomy.NextGlobalSolarEclipse(se.peak)
    }
  } catch { /* */ }

  // Lunar eclipses
  try {
    let le = Astronomy.SearchLunarEclipse(startDate)
    while (le && le.peak.date <= endDate) {
      if (le.kind !== 'penumbral') {
        const d = le.peak.date
        const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        const moonPos = Astronomy.EclipticGeoMoon(d)
        const sign = ZODIAC_SIGNS.find(z => {
          const idx = ZODIAC_SIGNS.indexOf(z)
          const startDeg = idx * 30
          return moonPos.lon >= startDeg && moonPos.lon < startDeg + 30
        })
        lines.push(`Lunar Eclipse (${le.kind}) on ${dateStr} in ${sign?.name ?? 'unknown'}`)
      }
      le = Astronomy.NextLunarEclipse(le.peak)
    }
  } catch { /* */ }

  // Major retrograde periods
  for (const body of RETRO_BODIES) {
    const bodyName = body as string
    let inRetro = false
    let retroStart = ''

    for (let i = 0; i < monthDates.length; i++) {
      const { year, month } = monthDates[i]
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      for (let day = 1; day <= daysInMonth; day += 3) {
        const isRx = checkRetro(body, new Date(year, month, day, 12))
        if (isRx && !inRetro) {
          retroStart = new Date(year, month, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          inRetro = true
        } else if (!isRx && inRetro) {
          const retroEnd = new Date(year, month, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          lines.push(`${bodyName} Retrograde: ${retroStart} — ${retroEnd}`)
          inRetro = false
        }
      }
    }
    if (inRetro) {
      lines.push(`${bodyName} Retrograde: from ${retroStart} (ongoing)`)
    }
  }

  return lines.join('\n')
}
