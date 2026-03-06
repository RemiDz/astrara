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

// === MOON PHASE THEME LOOKUP ===

const MOON_PHASE_THEMES: Record<string, string> = {
  'New Moon':         'New Beginnings',
  'Waxing Crescent':  'Emerging Growth',
  'First Quarter':    'Determined Action',
  'Waxing Gibbous':   'Patient Refinement',
  'Full Moon':        'Illumination',
  'Waning Gibbous':   'Grateful Reflection',
  'Last Quarter':     'Release & Surrender',
  'Waning Crescent':  'Stillness & Renewal',
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
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
  zodiacProfile?: ZodiacProfile | null
): CosmicReading {
  const phases: ReadingPhase[] = []
  const allKeywords: string[] = []

  // --- PHASE 1: Moon Phase ---
  const moonPhaseData = MOON_PHASES[astroData.moon.phase]
  const moonSignData = MOON_IN_SIGN[astroData.moon.zodiacSign as ZodiacSign]

  const moonGeneralReading = moonPhaseData && moonSignData
    ? `${moonPhaseData.general}\n\n${moonSignData.general}`
    : moonPhaseData?.general ?? moonSignData?.general ?? 'The Moon continues its journey through the sky.'

  const moonKeywords = [
    ...(moonPhaseData?.themeKeywords ?? []),
    ...(moonSignData?.themeKeywords ?? []),
  ]
  allKeywords.push(...moonKeywords)

  const moonPhaseTitle = astroData.moon.phase
  const moonSignCapitalised = capitalize(astroData.moon.zodiacSign)

  // Moon personal reading
  let moonPersonalReading: string | undefined
  if (zodiacProfile) {
    const house = getHouseForTransit(zodiacProfile.sunSign, astroData.moon.zodiacSign as ZodiacSign)
    moonPersonalReading = moonSignData?.personalByHouse?.[house]
  }

  phases.push({
    id: 'moon-phase',
    type: 'moon-phase',
    title: moonPhaseTitle,
    subtitle: `${astroData.moon.phase} in ${moonSignCapitalised} · ${astroData.moon.degreeInSign}°`,
    icon: '☽',
    generalReading: moonGeneralReading,
    personalReading: moonPersonalReading,
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
    const sunKeywords = sunSignData?.themeKeywords ?? []
    allKeywords.push(...sunKeywords)

    const sunSignCapitalised = capitalize(sun.zodiacSign)

    // Sun personal reading
    let sunPersonalReading: string | undefined
    if (zodiacProfile) {
      const house = getHouseForTransit(zodiacProfile.sunSign, sun.zodiacSign as ZodiacSign)
      sunPersonalReading = sunSignData?.personalByHouse?.[house]
    }

    phases.push({
      id: 'sun-position',
      type: 'sun-position',
      title: 'The Sun Today',
      subtitle: `Sun in ${sunSignCapitalised} · ${sun.degreeInSign}°`,
      icon: '☉',
      generalReading: sunSignData?.general ?? 'The Sun continues its annual journey through the zodiac.',
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

    const reading = generateAspectReading(aspect.planet1, aspect.planet2, aspectType, aspect.orb)
    allKeywords.push(aspectDesc.name.toLowerCase())

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
      title: `${aspectDesc.name}`,
      subtitle: `${aspect.planet1Glyph} ${aspect.symbol} ${aspect.planet2Glyph} · ${aspect.orb}° orb`,
      icon: aspect.symbol,
      generalReading: reading,
      personalReading: aspectPersonalReading || undefined,
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
    const summary = generateRetrogradeSummary(retroIds)

    if (summary) {
      const retroHighlights = retrogradePlanets.map(p => ({
        bodyId: p.id as CelestialBodyId,
        effect: 'pulse' as const,
        intensity: 0.6,
      }))

      allKeywords.push('retrograde', 'review', 'reflection')

      // Retrograde personal reading — combine personal readings for each retrograde planet
      let retroPersonalReading: string | undefined
      if (zodiacProfile) {
        const personalParts = retrogradePlanets.map(planet => {
          const house = getHouseForTransit(zodiacProfile.sunSign, planet.zodiacSign as ZodiacSign)
          const retroData = RETROGRADE_READINGS[planet.id as CelestialBodyId]
          return retroData?.personalByHouse?.[house] ?? ''
        }).filter(Boolean)
        if (personalParts.length > 0) {
          retroPersonalReading = personalParts.join(' ')
        }
      }

      phases.push({
        id: 'retrograde-summary',
        type: 'retrograde',
        title: 'Retrograde Watch',
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

    allKeywords.push('frequency', 'sound healing')

    // Frequency personal reading
    let freqPersonalReading: string | undefined
    if (zodiacProfile && dominantPlanet) {
      const house = getHouseForTransit(zodiacProfile.sunSign, dominantPlanet.zodiacSign as ZodiacSign)
      const houseTheme = HOUSE_THEMES[house]
      if (houseTheme) {
        freqPersonalReading = `As a ${capitalize(zodiacProfile.sunSign)}, this frequency resonates particularly with your ${houseTheme.area.toLowerCase()}. Consider a sound session focused on ${houseTheme.keywords.slice(0, 2).join(' and ')}.`
      }
    }

    phases.push({
      id: 'frequency-recommendation',
      type: 'frequency-recommendation',
      title: 'Sound Healing',
      subtitle: `${freq.name} · ${freq.hz} Hz`,
      icon: '🔔',
      generalReading: `Today's dominant planetary influence is ${planetName}, resonating with the ${freq.chakra} chakra. The ${freq.name} at ${freq.hz} Hz supports ${freq.description.toLowerCase()}. Working with this frequency — through tuning forks, singing bowls, or binaural beats — can help you attune to the day's prevailing energy.`,
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
        name: freq.name,
        description: freq.description,
        appLink: freq.binaraLink,
      },
    })
  }

  // --- SUMMARY ---
  const summary = generateSummary(phases, astroData, allKeywords, zodiacProfile)

  const now = new Date()
  return {
    id: `reading-${now.toISOString().split('T')[0]}-${Date.now()}`,
    date: now.toISOString().split('T')[0],
    generatedAt: now.toISOString(),
    phases,
    summary,
    meta: {
      totalPhases: phases.length,
      estimatedReadingTime: Math.max(2, Math.ceil(phases.length * 0.7)),
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

const HOUSE_ADVICE: Record<number, string> = {
  1: 'Focus on yourself today — your energy and presence are amplified.',
  2: 'Financial awareness and a clear sense of your own worth are highlighted.',
  3: 'Pay attention to conversations and the ideas flowing around you.',
  4: 'Home and family matters deserve your attention and care.',
  5: 'Follow what brings you joy — creative expression and pleasure are favoured.',
  6: 'Your daily routines and health habits are calling for attention.',
  7: 'Partnerships and close relationships take centre stage.',
  8: 'Deep emotional processing and shared resources need your awareness.',
  9: 'Expansion through learning, travel, or philosophical inquiry is calling.',
  10: 'Career and public reputation are highlighted — act with intention.',
  11: 'Community connections and your broader social vision are energised.',
  12: 'Your inner world and spiritual life need quiet attention.',
}

function getPersonalAdvice(sunSign: ZodiacSign, phases: ReadingPhase[]): string {
  const activatedHouses = new Set<number>()
  for (const phase of phases) {
    if (phase.celestialData.sign) {
      activatedHouses.add(getHouseForTransit(sunSign, phase.celestialData.sign))
    }
  }

  const houses = Array.from(activatedHouses).slice(0, 2)
  if (houses.length === 0) return ''

  const adviceParts = houses
    .map(h => HOUSE_ADVICE[h])
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
  zodiacProfile?: ZodiacProfile | null
): CosmicReading['summary'] {
  const sun = astroData.planets.find(p => p.id === 'sun')
  const sunSign = sun?.zodiacSign ?? 'aries'
  const sunSignCapitalised = capitalize(sunSign)
  const moonPhaseTheme = MOON_PHASE_THEMES[astroData.moon.phase] ?? 'Cosmic Flow'
  const moonSignCapitalised = capitalize(astroData.moon.zodiacSign)

  const theme = `${moonPhaseTheme} · ${sunSignCapitalised} Season`

  // Deduplicate and pick top keywords
  const uniqueKeywords = [...new Set(allKeywords)].slice(0, 5)

  // Count challenging vs harmonious aspects
  const aspectPhases = phases.filter(p => p.type === 'planetary-aspect')
  const hasRetrograde = phases.some(p => p.type === 'retrograde')

  let generalSummary = `Today's cosmic weather is shaped by a ${astroData.moon.phase} in ${moonSignCapitalised} and the Sun in ${sunSignCapitalised}.`

  if (aspectPhases.length > 0) {
    generalSummary += ` ${aspectPhases.length} notable aspect${aspectPhases.length > 1 ? 's' : ''} ${aspectPhases.length > 1 ? 'colour' : 'colours'} the day with dynamic planetary conversations.`
  }

  if (hasRetrograde) {
    generalSummary += ' Retrograde energy invites reflection and review alongside forward movement.'
  }

  generalSummary += ' Listen to what the sky is saying — and trust your own inner compass.'

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
      .map(h => HOUSE_THEMES[h]?.area.toLowerCase())
      .filter(Boolean)

    if (houseAreas.length > 0) {
      const advice = getPersonalAdvice(zodiacProfile.sunSign, phases)
      personalSummary = `For you as a ${capitalize(zodiacProfile.sunSign)}, today's cosmic energy is most active in your ${houseAreas.join(', ')} areas. ${advice}`
    }
  }

  return {
    theme,
    keywords: uniqueKeywords,
    generalSummary,
    personalSummary,
  }
}
