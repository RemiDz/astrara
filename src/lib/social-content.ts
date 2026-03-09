import type { PlanetPosition, MoonData, AspectData } from './astronomy'
import { ZODIAC_SIGNS } from './zodiac'
import en from '@/i18n/translations/en.json'
import lt from '@/i18n/translations/lt.json'

type Lang = 'en' | 'lt'
const TR: Record<string, Record<string, string>> = { en, lt }

function tr(key: string, lang: Lang): string {
  return TR[lang]?.[key] ?? TR['en']?.[key] ?? key
}

function signName(signId: string, lang: Lang): string {
  return tr(`zodiac.${signId}`, lang)
}

function signLoc(signId: string, lang: Lang): string {
  if (lang === 'lt') return tr(`zodiac.${signId}.loc`, lang)
  return signName(signId, lang)
}

function pName(planetId: string, lang: Lang): string {
  return tr(`planet.${planetId}`, lang)
}

// ---------------------------------------------------------------------------
// Core analysis helpers
// ---------------------------------------------------------------------------

export function findMostDramaticTransit(
  positions: PlanetPosition[],
  aspects: AspectData[],
  lang: Lang,
): { hook: string; planet: string; description: string } {
  // 1. Retrograde planets (priority order)
  const retroPriority = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  for (const pid of retroPriority) {
    const p = positions.find(pos => pos.id === pid)
    if (p && p.isRetrograde) {
      const planet = pName(p.id, lang)
      const sign = lang === 'lt' ? signLoc(p.zodiacSign, lang) : signName(p.zodiacSign, lang)
      const desc = lang === 'en' ? `retrograde in ${sign}` : `retrograde ${sign}`
      return {
        hook: lang === 'en'
          ? `${planet} is retrograde in ${sign} right now. Here's what that actually means for you today \u{1F447}`
          : `${planet} dabar retrograde ${sign}. \u0160tai k\u0105 tai i\u0161 tikr\u0173j\u0173 rei\u0161kia tau \u0161iandien \u{1F447}`,
        planet,
        description: desc,
      }
    }
  }

  // 2. Planet just entered a sign (degree < 2)
  for (const p of positions) {
    if (p.id === 'moon' || p.id === 'sun') continue
    if (p.degreeInSign <= 1) {
      const planet = pName(p.id, lang)
      const sign = signName(p.zodiacSign, lang)
      return {
        hook: lang === 'en'
          ? `${planet} just entered ${sign}. Everything is about to shift \u{1F447}`
          : `${planet} k\u0105 tik \u012f\u0117jo \u012f ${sign}. Viskas keisis \u{1F447}`,
        planet,
        description: lang === 'en' ? `just entered ${sign}` : `\u012f\u0117jo \u012f ${sign}`,
      }
    }
  }

  // 3. Tight challenging aspect
  const tight = aspects.find(a => (a.type === 'square' || a.type === 'opposition') && a.orb < 2)
  if (tight) {
    const p1 = pName(tight.planet1, lang)
    const p2 = pName(tight.planet2, lang)
    const word = tight.type === 'square'
      ? (lang === 'en' ? 'square' : 'kvadrat\u016broje su')
      : (lang === 'en' ? 'opposition' : 'opozicijoje su')
    return {
      hook: lang === 'en'
        ? `${p1} is in ${word} with ${p2} right now. Here's what that actually means for you today \u{1F447}`
        : `${p1} dabar ${word} ${p2}. \u0160tai k\u0105 tai rei\u0161kia tau \u0161iandien \u{1F447}`,
      planet: p1,
      description: `${word} ${p2}`,
    }
  }

  // 4. Fallback: Sun
  const sun = positions.find(p => p.id === 'sun')!
  const sunSign = signName(sun.zodiacSign, lang)
  return {
    hook: lang === 'en'
      ? `The Sun is at ${sun.degreeInSign}\u00B0 ${sunSign}. Here's what the sky is telling you today \u{1F447}`
      : `Saul\u0117 yra ${sun.degreeInSign}\u00B0 ${sunSign}. \u0160tai k\u0105 dangus tau sako \u0161iandien \u{1F447}`,
    planet: pName('sun', lang),
    description: `${sun.degreeInSign}\u00B0 ${sunSign}`,
  }
}

export function getDayFeeling(aspects: AspectData[], lang: Lang): string {
  const tense = aspects.filter(a => a.type === 'square' || a.type === 'opposition').length
  const flowing = aspects.filter(a => a.type === 'trine' || a.type === 'sextile').length
  const idx = new Date().getDate() % 3

  if (tense > flowing + 2) {
    return (lang === 'en' ? ['intense', 'heavy', 'chaotic'] : ['intensyviai', 'sunkiai', 'chaoti\u0161kai'])[idx]
  }
  if (flowing > tense + 2) {
    return (lang === 'en' ? ['electric', 'expansive', 'flowing'] : ['elektri\u0161kai', 'pla\u010diai', 'skland\u017eiai'])[idx]
  }
  return (lang === 'en' ? ['intense', 'charged', 'meaningful'] : ['intensyviai', '\u012fkrautai', 'prasmingai'])[idx]
}

export function getTopAffectedSigns(
  positions: PlanetPosition[],
  aspects: AspectData[],
  count: number,
): string[] {
  const scores: Record<string, number> = {}
  for (const p of positions) {
    scores[p.zodiacSign] = (scores[p.zodiacSign] || 0) + 1
  }
  for (const a of aspects) {
    if (a.type === 'square' || a.type === 'opposition') {
      const p1 = positions.find(p => p.id === a.planet1)
      const p2 = positions.find(p => p.id === a.planet2)
      if (p1) scores[p1.zodiacSign] = (scores[p1.zodiacSign] || 0) + 2
      if (p2) scores[p2.zodiacSign] = (scores[p2.zodiacSign] || 0) + 2
    }
  }
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([signId]) => signId)
}

export function findChallengingAspect(aspects: AspectData[]): AspectData | null {
  const malefics = ['mars', 'saturn', 'pluto']
  const maleficAspect = aspects.find(a =>
    (a.type === 'square' || a.type === 'opposition') &&
    (malefics.includes(a.planet1) || malefics.includes(a.planet2))
  )
  if (maleficAspect) return maleficAspect
  return aspects.find(a => a.type === 'square' || a.type === 'opposition') || null
}

// ---------------------------------------------------------------------------
// Content generators
// ---------------------------------------------------------------------------

export function generateHooks(
  positions: PlanetPosition[],
  moonData: MoonData,
  aspects: AspectData[],
  lang: Lang,
): string[] {
  const hooks: string[] = []

  // 1. Most dramatic
  const dramatic = findMostDramaticTransit(positions, aspects, lang)
  hooks.push(dramatic.hook)

  // 2. Moon
  const mSign = lang === 'lt' ? signLoc(moonData.zodiacSign, lang) : signName(moonData.zodiacSign, lang)
  hooks.push(lang === 'en'
    ? `The Moon is in ${mSign} today and your energy is about to shift. Watch this \u{1F440}`
    : `M\u0117nulis \u0161iandien ${mSign} \u2013 tavo energija keisis. \u017Di\u016br\u0117k \u{1F440}`)

  // 3. POV
  const feeling = getDayFeeling(aspects, lang)
  hooks.push(lang === 'en'
    ? `POV: you check the actual sky and realise why today felt so ${feeling}`
    : `POV: pa\u017ei\u016bri \u012f tikr\u0105 dang\u0173 ir supranti, kod\u0117l \u0161iandien jau\u010diasi taip ${feeling}`)

  // 4. Sign callout
  const affected = getTopAffectedSigns(positions, aspects, 3)
  const names = affected.map(s => signName(s, lang)).join(', ')
  hooks.push(lang === 'en'
    ? `If you're a ${names} \u2014 pay attention to this \u26A0\uFE0F`
    : `Jei esi ${names} \u2014 atkreipk d\u0117mes\u012f \u26A0\uFE0F`)

  // 5. Educational
  hooks.push(lang === 'en'
    ? `This is what the planets are actually doing right now. Not horoscope fluff \u2014 real positions, calculated to the degree \u{1F30C}`
    : `\u0160tai k\u0105 planetos i\u0161 tikr\u0173j\u0173 daro dabar. Ne horoskop\u0173 tu\u0161tyb\u0117 \u2014 tikros pozicijos \u{1F30C}`)

  // 6. Challenging aspect
  const ch = findChallengingAspect(aspects)
  if (ch) {
    const p1 = pName(ch.planet1, lang)
    const p2 = pName(ch.planet2, lang)
    const aspectWord = ch.type === 'square'
      ? (lang === 'en' ? 'squares' : 'kvadrat\u016broje su')
      : (lang === 'en' ? 'opposes' : 'opozicijoje su')
    hooks.push(lang === 'en'
      ? `${p1} ${aspectWord} ${p2} today. Here's why you might be feeling off \u26A1`
      : `${p1} ${aspectWord} ${p2} \u0161iandien. \u0160tai kod\u0117l gali jaustis ne taip \u26A1`)
  }

  // 7. Curiosity gap
  hooks.push(lang === 'en'
    ? `The sky looks like THIS right now and nobody's talking about it`
    : `Dangus \u0161iuo metu atrodo TAIP, o niekas apie tai nekalba`)

  return hooks
}

export function generateReelCaption(
  positions: PlanetPosition[],
  moonData: MoonData,
  aspects: AspectData[],
  lang: Lang,
): string {
  const dramatic = findMostDramaticTransit(positions, aspects, lang)
  const sun = positions.find(p => p.id === 'sun')!
  const sunSign = signName(sun.zodiacSign, lang)
  const moonSign = signName(moonData.zodiacSign, lang)
  const illum = Math.round(moonData.illumination * 100)

  const body = lang === 'en'
    ? `${dramatic.planet} ${dramatic.description} \u2014 ${sunSign} season, Moon in ${moonSign} at ${illum}%.`
    + `\n\nReal planetary positions. Real-time. Free.`
    + `\n\u{1F517} astrara.app`
    : `${dramatic.planet} ${dramatic.description} \u2014 ${sunSign} sezonas, M\u0117nulis ${moonSign} ${illum}%.`
    + `\n\nTikros planet\u0173 pozicijos. Realiu laiku. Nemokamai.`
    + `\n\u{1F517} astrara.app`

  // Hashtags always English
  const sunId = sun.zodiacSign
  const tags = `#astrology #cosmicweather #${sunId}season #astrara #${moonData.phase.toLowerCase().replace(/\s+/g, '')}`

  return `${body}\n\n${tags}`
}

export function generatePostCaption(
  positions: PlanetPosition[],
  moonData: MoonData,
  aspects: AspectData[],
  lang: Lang,
): string {
  const sun = positions.find(p => p.id === 'sun')!
  const sunSign = signName(sun.zodiacSign, lang)
  const moonSign = signName(moonData.zodiacSign, lang)
  const illum = Math.round(moonData.illumination * 100)
  const affected = getTopAffectedSigns(positions, aspects, 3).map(s => signName(s, lang)).join(', ')
  const retros = positions.filter(p => p.isRetrograde)
  const challenging = findChallengingAspect(aspects)

  const dateStr = new Date().toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // Para 1: Sky overview
  let p1: string
  if (lang === 'en') {
    p1 = `\u2609 Today's sky \u00B7 ${dateStr}\n\n`
    p1 += positions.map(p => {
      const s = signName(p.zodiacSign, lang)
      return `${p.glyph} ${p.name} in ${s} ${p.degreeInSign}\u00B0${p.isRetrograde ? ' Rx' : ''}`
    }).join('\n')
    p1 += `\n\n${moonData.emoji} ${moonData.phase} \u00B7 ${illum}% illumination`
  } else {
    p1 = `\u2609 \u0160iandienos dangus \u00B7 ${dateStr}\n\n`
    p1 += positions.map(p => {
      const s = signName(p.zodiacSign, lang)
      return `${p.glyph} ${pName(p.id, lang)} \u2013 ${s} ${p.degreeInSign}\u00B0${p.isRetrograde ? ' Rx' : ''}`
    }).join('\n')
    p1 += `\n\n${moonData.emoji} ${moonData.phase} \u00B7 ${illum}%`
  }

  // Para 2: What it means
  let p2: string
  if (lang === 'en') {
    p2 = `Signs most affected today: ${affected}.`
    if (retros.length > 0) {
      p2 += ` ${retros.map(r => r.name).join(', ')} ${retros.length === 1 ? 'is' : 'are'} retrograde \u2014 double-check communications, contracts, and travel plans.`
    }
  } else {
    p2 = `Labiausiai paveikti \u017eenklai: ${affected}.`
    if (retros.length > 0) {
      p2 += ` ${retros.map(r => pName(r.id, lang)).join(', ')} retrograde \u2014 perkrinkite komunikacij\u0105, sutartis ir kelioni\u0173 planus.`
    }
  }

  // Para 3: Challenge / warning
  let p3: string
  if (challenging) {
    const cp1 = pName(challenging.planet1, lang)
    const cp2 = pName(challenging.planet2, lang)
    const aName = challenging.type === 'square'
      ? (lang === 'en' ? 'square' : 'kvadrat\u016bra')
      : (lang === 'en' ? 'opposition' : 'opozicija')
    p3 = lang === 'en'
      ? `\u26A0\uFE0F ${cp1}\u2013${cp2} ${aName} (${challenging.orb}\u00B0 orb) \u2014 tension is real today. Watch for impulsive decisions and unnecessary conflict.`
      : `\u26A0\uFE0F ${cp1}\u2013${cp2} ${aName} (${challenging.orb}\u00B0) \u2014 \u012ftampa \u0161iandien reali. Saugoki\u0117s impulsyvi\u0173 sprendim\u0173.`
  } else {
    p3 = lang === 'en'
      ? `A relatively clear sky today \u2014 good for planning and forward movement.`
      : `Gana ai\u0161kus dangus \u0161iandien \u2014 geras laikas planavimui.`
  }

  // CTA
  const cta = lang === 'en'
    ? `Real planetary positions calculated from NASA JPL data. Track the sky live \u2192 astrara.app`
    : `Tikros planet\u0173 pozicijos. Steb\u0117k dang\u0173 gyva \u2192 astrara.app`

  // Hashtags (always English)
  const sunId = sun.zodiacSign
  const moonPhaseTag = moonData.phase.toLowerCase().replace(/\s+/g, '')
  const retroTags = retros.map(r => `#${r.id}retrograde`).join(' ')
  const tags = `#astrology #cosmicweather #${sunId}season #${moonPhaseTag} #zodiac #dailyhoroscope #astrara #harmonicwaves ${retroTags}`.trim()

  return `${p1}\n\n${p2}\n\n${p3}\n\n${cta}\n\n${tags}`
}

export function generateStoryOverlays(
  positions: PlanetPosition[],
  moonData: MoonData,
  aspects: AspectData[],
  lang: Lang,
): string[] {
  const dateStr = new Date().toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-GB', {
    day: 'numeric', month: 'long',
  })
  const dramatic = findMostDramaticTransit(positions, aspects, lang)
  const challenging = findChallengingAspect(aspects)

  const slide1 = lang === 'en' ? `TODAY'S SKY \u00B7 ${dateStr}` : `\u0160IANDIENOS DANGUS \u00B7 ${dateStr}`

  const slide2 = `${dramatic.planet} ${dramatic.description}`

  let slide3: string
  if (challenging) {
    const cp1 = pName(challenging.planet1, lang)
    const cp2 = pName(challenging.planet2, lang)
    slide3 = lang === 'en'
      ? `\u26A0\uFE0F ${cp1} ${challenging.type === 'square' ? 'squares' : 'opposes'} ${cp2} \u2014 stay grounded`
      : `\u26A0\uFE0F ${cp1} ${challenging.type === 'square' ? 'kvadrat\u016broje su' : 'opozicijoje su'} ${cp2}`
  } else {
    slide3 = lang === 'en'
      ? `\u2728 Clear sky today \u2014 good energy for action`
      : `\u2728 Giedras dangus \u2014 gera energija veikti`
  }

  const slide4 = lang === 'en'
    ? `Track the planets live \u2192 astrara.app`
    : `Steb\u0117k planetas gyva \u2192 astrara.app`

  return [slide1, slide2, slide3, slide4]
}

export interface HashtagSet {
  id: string
  labelKey: string
  tags: string[]
}

export function generateHashtagSets(
  positions: PlanetPosition[],
  moonData: MoonData,
): HashtagSet[] {
  // 1. Trending (dynamic)
  const trending: string[] = ['#astrology', '#cosmicweather']
  const sunSign = positions.find(p => p.id === 'sun')?.zodiacSign
  if (sunSign) trending.push(`#${sunSign}season`)
  const retros = positions.filter(p => p.isRetrograde)
  for (const r of retros) trending.push(`#${r.id}retrograde`)
  const phaseTag = moonData.phase.toLowerCase().replace(/\s+/g, '')
  trending.push(`#${phaseTag}`)
  trending.push(`#moonin${moonData.zodiacSign}`)
  if (moonData.phase === 'Full Moon') trending.push('#fullmoon')
  if (moonData.phase === 'New Moon') trending.push('#newmoon')

  // 2. Evergreen
  const evergreen = [
    '#astrology', '#zodiac', '#horoscope', '#spirituality',
    '#planets', '#cosmicenergy', '#zodiacsigns', '#dailyhoroscope',
  ]

  // 3. Sound healing
  const soundHealing = [
    '#soundhealing', '#frequencies', '#432hz', '#singingbowls',
    '#astrology', '#cosmicsound', '#harmonicwaves', '#astrara',
  ]

  // 4. TikTok growth
  const tiktok = [
    '#astrologytok', '#spiritualtok', '#fyp', '#viral',
    '#zodiacsigns', '#dailyhoroscope', '#witchtok', '#manifestation',
  ]

  return [
    { id: 'trending', labelKey: 'social.trendingToday', tags: trending },
    { id: 'evergreen', labelKey: 'social.evergreen', tags: evergreen },
    { id: 'soundhealing', labelKey: 'social.soundHealing', tags: soundHealing },
    { id: 'tiktok', labelKey: 'social.tiktokGrowth', tags: tiktok },
  ]
}
