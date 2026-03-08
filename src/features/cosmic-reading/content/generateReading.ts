import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import type {
  ZodiacProfile,
  ZodiacSign,
  CelestialBodyId,
  AspectType,
  ReadingPhase,
  CosmicReading,
  PhaseAnimation,
} from '../types'
import { MOON_PHASES, MOON_IN_SIGN } from './templates/moonTemplates'
import { SUN_IN_SIGN } from './templates/sunTemplates'
import { generateAspectReading, ASPECT_DESCRIPTIONS, generatePersonalAspectReading } from './templates/aspectTemplates'
import { RETROGRADE_READINGS, generateRetrogradeSummary } from './templates/retrogradeTemplates'
import { PLANETARY_FREQUENCIES } from './templates/frequencyTemplates'
import { HOUSE_THEMES } from './templates/houseTemplates'
import { ZODIAC_SIGNS, getHouseForTransit } from '../utils/zodiacHelpers'

type Lang = 'en' | 'lt'

// === MOON PHASE THEME LOOKUP ===

const MOON_PHASE_THEMES: Record<string, { en: string; lt: string }> = {
  'New Moon':         { en: 'New Beginnings',      lt: 'Naujos pradžios' },
  'Waxing Crescent':  { en: 'Emerging Growth',     lt: 'Besiformuojantis augimas' },
  'First Quarter':    { en: 'Determined Action',    lt: 'Ryžtingas veiksmas' },
  'Waxing Gibbous':   { en: 'Patient Refinement',  lt: 'Kantrus tobulinimas' },
  'Full Moon':        { en: 'Illumination',         lt: 'Nušvitimas' },
  'Waning Gibbous':   { en: 'Grateful Reflection',  lt: 'Dėkingas apmąstymas' },
  'Last Quarter':     { en: 'Release & Surrender',  lt: 'Paleidimas ir atsidavimas' },
  'Waning Crescent':  { en: 'Stillness & Renewal',  lt: 'Tyla ir atsinaujinimas' },
}

// === MOON PHASE PLAIN NAMES (Change 4A) ===

const MOON_PHASE_PLAIN_NAMES: Record<string, { en: string; lt: string }> = {
  'New Moon':         { en: 'New Beginnings',        lt: 'Nauja Pradžia' },
  'Waxing Crescent':  { en: 'Building Momentum',     lt: 'Augantis Pagreitis' },
  'First Quarter':    { en: 'Taking Action',          lt: 'Veikimo Laikas' },
  'Waxing Gibbous':   { en: 'Refining & Perfecting',  lt: 'Tobulinimas' },
  'Full Moon':        { en: 'Peak Energy & Clarity',   lt: 'Pilna Energija' },
  'Waning Gibbous':   { en: 'Sharing & Teaching',      lt: 'Dalijimasis' },
  'Last Quarter':     { en: 'Releasing & Letting Go',  lt: 'Atleidimas' },
  'Waning Crescent':  { en: 'Rest & Reflection',       lt: 'Poilsis ir Apmąstymai' },
}

// === ASPECT PLAIN NAMES (Change 4B) ===

const ASPECT_PLAIN_NAMES: Record<string, { en: string; lt: string }> = {
  conjunction: { en: 'Merging Energies',       lt: 'Susijungimas' },
  sextile:     { en: 'Supportive Connection',  lt: 'Palaikantis Ryšys' },
  square:      { en: 'Creative Tension',       lt: 'Kūrybinė Įtampa' },
  trine:       { en: 'Natural Flow',           lt: 'Natūralus Srautas' },
  opposition:  { en: 'Balancing Act',          lt: 'Pusiausvyra' },
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// === ZODIAC SIGN NAME LOOKUP ===

const SIGN_NAMES_LT: Record<string, string> = {
  aries: 'Avinas', taurus: 'Jautis', gemini: 'Dvyniai', cancer: 'Vėžys',
  leo: 'Liūtas', virgo: 'Mergelė', libra: 'Svarstyklės', scorpio: 'Skorpionas',
  sagittarius: 'Šaulys', capricorn: 'Ožiaragis', aquarius: 'Vandenis', pisces: 'Žuvys',
}

const MOON_PHASE_NAMES_LT: Record<string, string> = {
  'New Moon': 'Jaunatis',
  'Waxing Crescent': 'Jaunėjantis pjautuvas',
  'First Quarter': 'Pirmasis ketvirtis',
  'Waxing Gibbous': 'Jaunėjantis kupranugaris',
  'Full Moon': 'Pilnatis',
  'Waning Gibbous': 'Senėjantis kupranugaris',
  'Last Quarter': 'Paskutinis ketvirtis',
  'Waning Crescent': 'Senėjantis pjautuvas',
}

const SIGN_LOCATIVE_LT: Record<string, string> = {
  aries: 'Avine', taurus: 'Jautyje', gemini: 'Dvyniuose', cancer: 'Vėžyje',
  leo: 'Liūte', virgo: 'Mergelėje', libra: 'Svarstyklėse', scorpio: 'Skorpione',
  sagittarius: 'Šaulyje', capricorn: 'Ožiaragyje', aquarius: 'Vandenyje', pisces: 'Žuvyse',
}

function signName(sign: string, lang: Lang): string {
  if (lang === 'lt') return SIGN_NAMES_LT[sign] ?? capitalize(sign)
  return capitalize(sign)
}

function signLocative(sign: string, lang: Lang): string {
  if (lang === 'lt') return SIGN_LOCATIVE_LT[sign] ?? (SIGN_NAMES_LT[sign] ?? capitalize(sign))
  return capitalize(sign)
}

function moonPhaseName(phase: string, lang: Lang): string {
  if (lang === 'lt') return MOON_PHASE_NAMES_LT[phase] ?? phase
  return phase
}

// === MAIN READING GENERATOR ===

export function generateCosmicReading(
  astroData: {
    planets: PlanetPosition[]
    moon: {
      phase: string
      illumination: number
      zodiacSign: string
      degreeInSign: number
    }
    notableAspects: AspectData[]
  },
  zodiacProfile?: ZodiacProfile | null,
  lang: Lang = 'en'
): CosmicReading {
  const phases: ReadingPhase[] = []
  const allKeywords: string[] = []

  // --- PHASE 1: Moon Phase ---
  const moonPhaseData = MOON_PHASES[astroData.moon.phase]
  const moonSignData = MOON_IN_SIGN[astroData.moon.zodiacSign as ZodiacSign]

  const moonGeneralReading = moonPhaseData && moonSignData
    ? `${moonPhaseData.general[lang]}\n\n${moonSignData.general[lang]}`
    : moonPhaseData?.general[lang] ?? moonSignData?.general[lang] ?? (lang === 'lt' ? 'Mėnulis tęsia savo kelionę per dangų.' : 'The Moon continues its journey through the sky.')

  const moonKeywords = [
    ...(moonPhaseData?.themeKeywords[lang] ?? []),
    ...(moonSignData?.themeKeywords[lang] ?? []),
  ]
  allKeywords.push(...moonKeywords)

  const moonPhaseTitle = moonPhaseName(astroData.moon.phase, lang)
  const moonSignCapitalised = signName(astroData.moon.zodiacSign, lang)

  // Moon personal reading
  let moonPersonalReading: string | undefined
  if (zodiacProfile) {
    const house = getHouseForTransit(zodiacProfile.sunSign, astroData.moon.zodiacSign as ZodiacSign)
    const personalData = moonSignData?.personalByHouse?.[house]
    moonPersonalReading = personalData ? personalData[lang] : undefined
  }

  const moonSignLocative = signLocative(astroData.moon.zodiacSign, lang)
  const moonSubtitle = lang === 'lt'
    ? `${moonPhaseName(astroData.moon.phase, lang)} ${moonSignLocative} · ${astroData.moon.degreeInSign}°`
    : `${astroData.moon.phase} in ${moonSignCapitalised} · ${astroData.moon.degreeInSign}°`

  phases.push({
    id: 'moon-phase',
    type: 'moon-phase',
    title: moonPhaseTitle,
    subtitle: moonSubtitle,
    icon: '☽',
    generalReading: moonGeneralReading,
    personalReading: moonPersonalReading,
    plainName: MOON_PHASE_PLAIN_NAMES[astroData.moon.phase]?.[lang],
    animation: {
      camera: { target: 'moon', zoom: 1.3 },
      highlights: [{ bodyId: 'moon', effect: 'glow', intensity: 0.9 }],
      dimOthers: true,
    },
    celestialData: {
      bodies: ['moon'],
      sign: astroData.moon.zodiacSign as ZodiacSign,
      degree: astroData.moon.degreeInSign,
    },
  })

  // --- PHASE 2: Sun Position ---
  const sun = astroData.planets.find(p => p.id === 'sun')
  if (sun) {
    const sunSignData = SUN_IN_SIGN[sun.zodiacSign as ZodiacSign]
    const sunKeywords = sunSignData?.themeKeywords[lang] ?? []
    allKeywords.push(...sunKeywords)

    const sunSignCapitalised = signName(sun.zodiacSign, lang)

    // Sun personal reading
    let sunPersonalReading: string | undefined
    if (zodiacProfile) {
      const house = getHouseForTransit(zodiacProfile.sunSign, sun.zodiacSign as ZodiacSign)
      const personalData = sunSignData?.personalByHouse?.[house]
      sunPersonalReading = personalData ? personalData[lang] : undefined
    }

    const sunTitle = lang === 'lt' ? 'Saulė šiandien' : 'The Sun Today'
    const sunSignLocative = signLocative(sun.zodiacSign, lang)
    const sunSubtitle = lang === 'lt'
      ? `Saulė ${sunSignLocative} · ${sun.degreeInSign}°`
      : `Sun in ${sunSignCapitalised} · ${sun.degreeInSign}°`

    phases.push({
      id: 'sun-position',
      type: 'sun-position',
      title: sunTitle,
      subtitle: sunSubtitle,
      icon: '☉',
      generalReading: sunSignData?.general[lang] ?? (lang === 'lt' ? 'Saulė tęsia savo metinę kelionę per zodiaką.' : 'The Sun continues its annual journey through the zodiac.'),
      personalReading: sunPersonalReading,
      animation: {
        camera: { target: 'sun', zoom: 1.2 },
        highlights: [{ bodyId: 'sun', effect: 'glow', intensity: 0.8 }],
        dimOthers: true,
      },
      celestialData: {
        bodies: ['sun'],
        sign: sun.zodiacSign as ZodiacSign,
        degree: sun.degreeInSign,
      },
    })
  }

  // --- PHASE 3: Notable Aspects (up to 3) ---
  const topAspects = astroData.notableAspects.slice(0, 3)
  for (const aspect of topAspects) {
    const aspectType = aspect.type as AspectType
    const aspectDesc = ASPECT_DESCRIPTIONS[aspectType]
    if (!aspectDesc) continue

    const reading = generateAspectReading(aspect.planet1, aspect.planet2, aspectType, aspect.orb, lang)
    allKeywords.push(aspectDesc.name[lang].toLowerCase())

    // Aspect personal reading
    let aspectPersonalReading: string | undefined
    if (zodiacProfile) {
      const p1 = astroData.planets.find(p => p.id === aspect.planet1)
      const p2 = astroData.planets.find(p => p.id === aspect.planet2)
      if (p1 && p2) {
        aspectPersonalReading = generatePersonalAspectReading(
          aspect.planet1,
          p1.zodiacSign,
          aspect.planet2,
          p2.zodiacSign,
          aspectType,
          zodiacProfile.sunSign,
          lang,
        )
      }
    }

    const animation: PhaseAnimation = {
      highlights: [
        { bodyId: aspect.planet1 as CelestialBodyId, effect: 'glow', intensity: 0.7 },
        { bodyId: aspect.planet2 as CelestialBodyId, effect: 'glow', intensity: 0.7 },
      ],
      aspectLine: {
        from: aspect.planet1 as CelestialBodyId,
        to: aspect.planet2 as CelestialBodyId,
        color: aspect.colour,
        style: aspectDesc.nature === 'harmonious' ? 'solid' : 'dashed',
        animateDrawing: true,
        drawDuration: 1000,
      },
      dimOthers: true,
    }

    phases.push({
      id: `aspect-${aspect.planet1}-${aspectType}-${aspect.planet2}`,
      type: 'planetary-aspect',
      title: `${aspectDesc.name[lang]}`,
      subtitle: `${aspect.planet1Glyph} ${aspect.symbol} ${aspect.planet2Glyph} · ${aspect.orb}° ${lang === 'lt' ? 'orbita' : 'orb'}`,
      icon: aspect.symbol,
      generalReading: reading,
      personalReading: aspectPersonalReading || undefined,
      plainName: ASPECT_PLAIN_NAMES[aspectType]?.[lang],
      animation,
      celestialData: {
        bodies: [aspect.planet1 as CelestialBodyId, aspect.planet2 as CelestialBodyId],
        aspect: aspectType,
      },
    })
  }

  // --- PHASE 4: Retrogrades (combined) ---
  const retrogradePlanets = astroData.planets.filter(p => p.isRetrograde)
  if (retrogradePlanets.length > 0) {
    const retroIds = retrogradePlanets.map(p => p.id)
    const summary = generateRetrogradeSummary(retroIds, lang)

    if (summary) {
      const retroHighlights = retrogradePlanets.map(p => ({
        bodyId: p.id as CelestialBodyId,
        effect: 'pulse' as const,
        intensity: 0.6,
      }))

      allKeywords.push(
        ...(lang === 'lt' ? ['retrogradas', 'peržiūra', 'apmąstymas'] : ['retrograde', 'review', 'reflection'])
      )

      // Retrograde personal reading — combine personal readings for each retrograde planet
      let retroPersonalReading: string | undefined
      if (zodiacProfile) {
        const personalParts = retrogradePlanets.map(planet => {
          const house = getHouseForTransit(zodiacProfile.sunSign, planet.zodiacSign as ZodiacSign)
          const retroData = RETROGRADE_READINGS[planet.id as CelestialBodyId]
          const personalData = retroData?.personalByHouse?.[house]
          return personalData ? personalData[lang] : ''
        }).filter(Boolean)
        if (personalParts.length > 0) {
          retroPersonalReading = personalParts.join(' ')
        }
      }

      const retroTitle = lang === 'lt' ? 'Retrogradų stebėjimas' : 'Retrograde Watch'

      phases.push({
        id: 'retrograde-summary',
        type: 'retrograde',
        title: retroTitle,
        subtitle: retrogradePlanets.map(p => `${p.glyph} ${p.name}`).join(' · '),
        icon: '℞',
        generalReading: summary,
        personalReading: retroPersonalReading,
        animation: {
          highlights: retroHighlights,
          dimOthers: true,
        },
        celestialData: {
          bodies: retroIds as CelestialBodyId[],
          retrograde: true,
        },
      })
    }
  }

  // --- PHASE 5: Frequency Recommendation ---
  const dominantPlanetId = getDominantPlanetId(astroData)
  const freq = PLANETARY_FREQUENCIES[dominantPlanetId]

  if (freq) {
    const dominantPlanet = astroData.planets.find(p => p.id === dominantPlanetId)
    const planetName = dominantPlanet?.name ?? capitalize(dominantPlanetId)

    allKeywords.push(
      ...(lang === 'lt' ? ['dažnis', 'garso gijimas'] : ['frequency', 'sound healing'])
    )

    // Frequency personal reading
    let freqPersonalReading: string | undefined
    if (zodiacProfile && dominantPlanet) {
      const house = getHouseForTransit(zodiacProfile.sunSign, dominantPlanet.zodiacSign as ZodiacSign)
      const houseTheme = HOUSE_THEMES[house]
      if (houseTheme) {
        freqPersonalReading = lang === 'lt'
          ? `Kaip ${signName(zodiacProfile.sunSign, lang)}, šis dažnis ypač rezonuoja su jūsų ${houseTheme.area[lang].toLowerCase()} sritimi. Apsvarstykite garso sesiją, orientuotą į ${houseTheme.keywords[lang].slice(0, 2).join(' ir ')}.`
          : `As a ${capitalize(zodiacProfile.sunSign)}, this frequency resonates particularly with your ${houseTheme.area[lang].toLowerCase()}. Consider a sound session focused on ${houseTheme.keywords[lang].slice(0, 2).join(' and ')}.`
      }
    }

    const freqTitle = lang === 'lt' ? 'Garso gijimas' : 'Sound Healing'
    const freqGeneralReading = lang === 'lt'
      ? `Šiandienos dominuojanti planetinė įtaka yra ${planetName}, rezonuojanti su ${freq.chakra[lang]} čakra. ${freq.name[lang]} ties ${freq.hz} Hz palaiko ${freq.description[lang].toLowerCase()}. Darbas su šiuo dažniu — per derinimo šakutes, dainuojančius dubenėlius ar binauralius ritmus — gali padėti jums prisiderinti prie dienos vyraujančios energijos.`
      : `Today's dominant planetary influence is ${planetName}, resonating with the ${freq.chakra[lang]} chakra. The ${freq.name[lang]} at ${freq.hz} Hz supports ${freq.description[lang].toLowerCase()}. Working with this frequency — through tuning forks, singing bowls, or binaural beats — can help you attune to the day's prevailing energy.`

    phases.push({
      id: 'frequency-recommendation',
      type: 'frequency-recommendation',
      title: freqTitle,
      subtitle: `${freq.name[lang]} · ${freq.hz} Hz`,
      icon: '🔔',
      generalReading: freqGeneralReading,
      personalReading: freqPersonalReading,
      animation: {
        camera: { target: dominantPlanetId, zoom: 1.2 },
        highlights: [{ bodyId: dominantPlanetId, effect: 'glow', color: '#A78BFA', intensity: 0.8 }],
        dimOthers: true,
        sceneEffect: { type: 'subtle-particles', intensity: 0.4 },
      },
      celestialData: {
        bodies: [dominantPlanetId],
      },
      frequencyRecommendation: {
        hz: freq.hz,
        name: freq.name[lang],
        description: freq.description[lang],
        appLink: freq.binaraLink,
      },
    })
  }

  // --- SUMMARY (generated from detail phases, then prepended as first phase) ---
  const summary = generateSummary(phases, astroData, allKeywords, lang, zodiacProfile)

  const summaryPhase: ReadingPhase = {
    id: 'summary-overview',
    type: 'summary',
    title: lang === 'lt' ? 'Šiandienos Kosminė Orbitė' : "Today's Cosmic Weather",
    subtitle: summary.theme,
    icon: '✦',
    generalReading: summary.generalSummary,
    personalReading: summary.personalSummary,
    animation: {
      dimOthers: false,
    },
    celestialData: {},
  }

  // Summary first, then detail phases
  const allPhases = [summaryPhase, ...phases]

  const now = new Date()
  return {
    id: `reading-${now.toISOString().split('T')[0]}-${Date.now()}`,
    date: now.toISOString().split('T')[0],
    generatedAt: now.toISOString(),
    phases: allPhases,
    summary,
    meta: {
      totalPhases: allPhases.length,
      estimatedReadingTime: Math.max(2, Math.ceil(allPhases.length * 0.7)),
      zodiacProfile: zodiacProfile ?? undefined,
    },
  }
}

// === HELPERS ===

function getDominantPlanetId(astroData: {
  planets: PlanetPosition[]
  moon: { zodiacSign: string }
  notableAspects: AspectData[]
}): CelestialBodyId {
  // Find the planet forming the tightest aspect
  if (astroData.notableAspects.length > 0) {
    const tightest = astroData.notableAspects.reduce((min, a) => a.orb < min.orb ? a : min, astroData.notableAspects[0])
    // Return the non-Sun/Moon planet if possible, otherwise planet1
    if (tightest.planet1 !== 'sun' && tightest.planet1 !== 'moon') return tightest.planet1 as CelestialBodyId
    if (tightest.planet2 !== 'sun' && tightest.planet2 !== 'moon') return tightest.planet2 as CelestialBodyId
    return tightest.planet1 as CelestialBodyId
  }

  // Fallback: Moon's sign ruler
  const moonSign = astroData.moon.zodiacSign as ZodiacSign
  const signInfo = ZODIAC_SIGNS[moonSign]
  if (signInfo) return signInfo.ruler as CelestialBodyId

  return 'moon'
}

// === PERSONAL ADVICE FOR SUMMARY ===

const HOUSE_ADVICE: Record<number, { en: string; lt: string }> = {
  1:  { en: 'Focus on yourself today — your energy and presence are amplified.', lt: 'Sutelkite dėmesį į save šiandien — jūsų energija ir buvimas yra sustiprinti.' },
  2:  { en: 'Financial awareness and a clear sense of your own worth are highlighted.', lt: 'Finansinis sąmoningumas ir aiškus savo vertės pojūtis yra paryškinti.' },
  3:  { en: 'Pay attention to conversations and the ideas flowing around you.', lt: 'Atkreipkite dėmesį į pokalbius ir aplink jus tekančias idėjas.' },
  4:  { en: 'Home and family matters deserve your attention and care.', lt: 'Namų ir šeimos reikalai nusipelno jūsų dėmesio ir rūpesčio.' },
  5:  { en: 'Follow what brings you joy — creative expression and pleasure are favoured.', lt: 'Sekite tuo, kas teikia džiaugsmą — kūrybinė raiška ir malonumas yra palankūs.' },
  6:  { en: 'Your daily routines and health habits are calling for attention.', lt: 'Jūsų kasdienės rutinos ir sveikatos įpročiai reikalauja dėmesio.' },
  7:  { en: 'Partnerships and close relationships take centre stage.', lt: 'Partnerystės ir artimi santykiai užima pagrindinę sceną.' },
  8:  { en: 'Deep emotional processing and shared resources need your awareness.', lt: 'Gilus emocinis apdorojimas ir bendri ištekliai reikalauja jūsų sąmoningumo.' },
  9:  { en: 'Expansion through learning, travel, or philosophical inquiry is calling.', lt: 'Plėtra per mokymąsi, keliones ar filosofinę paiešką kviečia.' },
  10: { en: 'Career and public reputation are highlighted — act with intention.', lt: 'Karjera ir viešoji reputacija yra paryškintos — veikite su ketinimu.' },
  11: { en: 'Community connections and your broader social vision are energised.', lt: 'Bendruomenės ryšiai ir jūsų platesnė socialinė vizija yra energizuoti.' },
  12: { en: 'Your inner world and spiritual life need quiet attention.', lt: 'Jūsų vidinis pasaulis ir dvasinis gyvenimas reikalauja tylaus dėmesio.' },
}

function getPersonalAdvice(sunSign: ZodiacSign, phases: ReadingPhase[], lang: Lang): string {
  const activatedHouses = new Set<number>()
  for (const phase of phases) {
    if (phase.celestialData.sign) {
      activatedHouses.add(getHouseForTransit(sunSign, phase.celestialData.sign))
    }
  }

  const houses = Array.from(activatedHouses).slice(0, 2)
  if (houses.length === 0) return ''

  const adviceParts = houses
    .map(h => HOUSE_ADVICE[h]?.[lang])
    .filter(Boolean)

  return adviceParts.join(' ')
}

function generateSummary(
  phases: ReadingPhase[],
  astroData: {
    moon: { phase: string; zodiacSign: string }
    planets: PlanetPosition[]
  },
  allKeywords: string[],
  lang: Lang,
  zodiacProfile?: ZodiacProfile | null
): CosmicReading['summary'] {
  const sun = astroData.planets.find(p => p.id === 'sun')
  const sunSign = sun?.zodiacSign ?? 'aries'
  const sunSignCapitalised = signName(sunSign, lang)
  const moonPhaseTheme = MOON_PHASE_THEMES[astroData.moon.phase]?.[lang] ?? (lang === 'lt' ? 'Kosminė tėkmė' : 'Cosmic Flow')
  const moonSignCapitalised = signName(astroData.moon.zodiacSign, lang)
  const moonSignLoc = signLocative(astroData.moon.zodiacSign, lang)

  const theme = lang === 'lt'
    ? `${moonPhaseTheme} · ${sunSignCapitalised} sezonas`
    : `${moonPhaseTheme} · ${sunSignCapitalised} Season`

  // Deduplicate and pick top keywords
  const uniqueKeywords = [...new Set(allKeywords)].slice(0, 5)

  // Count challenging vs harmonious aspects
  const aspectPhases = phases.filter(p => p.type === 'planetary-aspect')
  const hasRetrograde = phases.some(p => p.type === 'retrograde')

  const moonPhaseLocalized = moonPhaseName(astroData.moon.phase, lang)

  const moonPlain = MOON_PHASE_PLAIN_NAMES[astroData.moon.phase]?.[lang] ?? moonPhaseTheme

  let generalSummary = lang === 'lt'
    ? `Šiandien vyrauja ${moonPlain.toLowerCase()} energija, Mėnulis yra ${moonSignLoc}.`
    : `Today carries a ${moonPlain.toLowerCase()} energy, with the Moon moving through ${moonSignCapitalised}.`

  if (aspectPhases.length > 0) {
    generalSummary += lang === 'lt'
      ? ` ${aspectPhases.length} planetų ryš${aspectPhases.length > 1 ? 'iai prideda' : 'ys prideda'} dienai dinamikos.`
      : ` ${aspectPhases.length} planetary connection${aspectPhases.length > 1 ? 's add' : ' adds'} dynamic energy to the day.`
  }

  if (hasRetrograde) {
    generalSummary += lang === 'lt'
      ? ' Tai tinkamas laikas apmąstymui ir peržiūrai.'
      : ' This is a good time for reflection and review.'
  }

  generalSummary += lang === 'lt'
    ? ' Pasitikėkite savo vidiniu kompasu ir leiskite dienai tekėti.'
    : ' Trust your inner compass and let the day unfold.'

  // Personal summary
  let personalSummary: string | undefined
  if (zodiacProfile) {
    const activatedHouses = new Set<number>()
    for (const phase of phases) {
      if (phase.celestialData.sign) {
        activatedHouses.add(getHouseForTransit(zodiacProfile.sunSign, phase.celestialData.sign))
      }
    }

    const houseAreas = Array.from(activatedHouses)
      .slice(0, 3)
      .map(h => HOUSE_THEMES[h]?.area[lang].toLowerCase())
      .filter(Boolean)

    if (houseAreas.length > 0) {
      const advice = getPersonalAdvice(zodiacProfile.sunSign, phases, lang)
      const signDisplayName = signName(zodiacProfile.sunSign, lang)
      personalSummary = lang === 'lt'
        ? `Jums kaip ${signDisplayName}, šiandienos kosminė energija yra aktyviausia jūsų ${houseAreas.join(', ')} srityse. ${advice}`
        : `For you as a ${signDisplayName}, today's cosmic energy is most active in your ${houseAreas.join(', ')} areas. ${advice}`
    }
  }

  return {
    theme,
    keywords: uniqueKeywords,
    generalSummary,
    personalSummary,
  }
}
