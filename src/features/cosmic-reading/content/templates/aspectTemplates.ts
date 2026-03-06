import type { AspectType, ZodiacSign } from '../../types'
import { getHouseForTransit } from '../../utils/zodiacHelpers'
import { HOUSE_THEMES } from './houseTemplates'

// === ASPECT TYPE DESCRIPTIONS ===

export interface AspectTypeDescription {
  name: string
  energy: string
  nature: 'harmonious' | 'challenging' | 'neutral'
}

export const ASPECT_DESCRIPTIONS: Record<AspectType, AspectTypeDescription> = {
  conjunction:  { name: 'Conjunction',  energy: 'Fusion — energies merge and amplify',           nature: 'neutral' },
  sextile:      { name: 'Sextile',      energy: 'Opportunity — gentle support and creative flow', nature: 'harmonious' },
  square:       { name: 'Square',       energy: 'Tension — friction that demands action',         nature: 'challenging' },
  trine:        { name: 'Trine',        energy: 'Flow — natural ease and gifts',                  nature: 'harmonious' },
  opposition:   { name: 'Opposition',   energy: 'Polarity — awareness through contrast',          nature: 'challenging' },
}

// === PLANET ENERGY DESCRIPTIONS ===

export interface PlanetEnergy {
  name: string
  domain: string
  keywords: string[]
}

export const PLANET_ENERGIES: Record<string, PlanetEnergy> = {
  sun:     { name: 'The Sun',     domain: 'identity, vitality, and conscious will',         keywords: ['self', 'purpose', 'confidence'] },
  moon:    { name: 'The Moon',    domain: 'emotions, instincts, and inner needs',           keywords: ['feelings', 'comfort', 'intuition'] },
  mercury: { name: 'Mercury',     domain: 'communication, thought, and perception',         keywords: ['ideas', 'speech', 'learning'] },
  venus:   { name: 'Venus',       domain: 'love, beauty, and values',                       keywords: ['harmony', 'pleasure', 'connection'] },
  mars:    { name: 'Mars',        domain: 'drive, action, and desire',                      keywords: ['energy', 'courage', 'assertion'] },
  jupiter: { name: 'Jupiter',     domain: 'expansion, wisdom, and abundance',               keywords: ['growth', 'optimism', 'opportunity'] },
  saturn:  { name: 'Saturn',      domain: 'structure, discipline, and responsibility',      keywords: ['boundaries', 'lessons', 'maturity'] },
  uranus:  { name: 'Uranus',      domain: 'innovation, freedom, and sudden change',         keywords: ['awakening', 'rebellion', 'breakthrough'] },
  neptune: { name: 'Neptune',     domain: 'dreams, spirituality, and transcendence',        keywords: ['imagination', 'compassion', 'dissolution'] },
  pluto:   { name: 'Pluto',       domain: 'transformation, power, and deep renewal',        keywords: ['rebirth', 'intensity', 'shadow work'] },
}

// === SPECIAL-CASE HARDCODED ASPECT READINGS ===

const SPECIAL_ASPECTS: Record<string, string> = {
  'sun-conjunction-moon': 'The Sun and Moon unite in the sky — this is New Moon energy at its most potent. The conscious will and the emotional body fuse into a single impulse. This is a powerful moment for setting intentions that align your deepest feelings with your outward direction. Let instinct and purpose become one.',
  'sun-opposition-moon': 'The Sun and Moon stand opposite one another — the Full Moon illuminates everything. What has been growing in the dark now comes into full view. Emotions are heightened, truths are revealed, and the tension between what you want and what you need reaches its peak. Allow this clarity to guide your next steps.',
  'venus-conjunction-mars': 'Venus and Mars come together, merging desire with affection, passion with tenderness. This is one of the most sensual and creative alignments in the sky. Relationships feel magnetic, attraction is palpable, and the drive to connect — romantically, artistically, physically — is strong. Embrace what you truly want.',
  'mercury-square-saturn': 'Mercury squares Saturn, creating friction between the desire to communicate and a feeling of being blocked or misunderstood. Words may feel heavy, plans may hit delays, and self-doubt can creep into the mind. This is not a time to force ideas through — it is a time to think carefully, speak precisely, and trust that clarity will come with patience.',
  'jupiter-trine-sun': 'Jupiter forms a flowing trine to the Sun, opening a channel of confidence, optimism, and expansion. This is one of the most fortunate alignments of the year — a time when effort meets opportunity and doors seem to open of their own accord. Take bold steps, trust your vision, and allow abundance to find you.',
  'sun-trine-jupiter': 'Jupiter forms a flowing trine to the Sun, opening a channel of confidence, optimism, and expansion. This is one of the most fortunate alignments of the year — a time when effort meets opportunity and doors seem to open of their own accord. Take bold steps, trust your vision, and allow abundance to find you.',
}

// === COMPOSABLE ASPECT READING GENERATOR ===

export function generateAspectReading(
  planet1Id: string,
  planet2Id: string,
  aspectType: AspectType,
  orb: number
): string {
  // Check for special-case readings (both orderings)
  const key1 = `${planet1Id}-${aspectType}-${planet2Id}`
  const key2 = `${planet2Id}-${aspectType}-${planet1Id}`
  if (SPECIAL_ASPECTS[key1]) return SPECIAL_ASPECTS[key1]
  if (SPECIAL_ASPECTS[key2]) return SPECIAL_ASPECTS[key2]

  // Composable fallback
  const p1 = PLANET_ENERGIES[planet1Id]
  const p2 = PLANET_ENERGIES[planet2Id]
  const aspect = ASPECT_DESCRIPTIONS[aspectType]

  if (!p1 || !p2 || !aspect) {
    return `A notable aspect is forming in the sky between ${planet1Id} and ${planet2Id}, bringing a shift in energy worth paying attention to.`
  }

  const potency = orb < 2
    ? ' This aspect is especially potent today — the alignment is almost exact.'
    : ''

  const guidance: Record<AspectType, string> = {
    conjunction: `Allow these merged energies to work together rather than competing for attention.`,
    sextile: `Look for small openings and creative possibilities — this gentle support rewards those who engage with it.`,
    square: `Rather than resisting the friction, use it as fuel for meaningful change.`,
    trine: `This natural flow is a gift — receive it with gratitude and let it carry you forward.`,
    opposition: `Balance is the key — neither side holds the complete truth, but together they offer a fuller picture.`,
  }

  return `Today, ${p1.name} forms a ${aspect.name.toLowerCase()} with ${p2.name}. ${aspect.energy}. When the planet of ${p1.domain} meets the planet of ${p2.domain}, the result is a dynamic interplay that touches ${p1.keywords[0]}, ${p2.keywords[0]}, and the space between them. ${guidance[aspectType]}${potency}`
}

// === PERSONAL ASPECT READING (HOUSE-BASED) ===

function getHouseInteractionText(house1: number, house2: number, aspectType: AspectType): string {
  // Same house — concentrated energy
  if (house1 === house2) {
    const theme = HOUSE_THEMES[house1]
    return `This energy concentrates powerfully in your ${theme.area.toLowerCase()} — expect this area of life to feel especially activated and demand your full attention.`
  }

  // Key axis pairs
  const pair = [Math.min(house1, house2), Math.max(house1, house2)].join('-')
  const axisTexts: Record<string, Record<AspectType, string>> = {
    '1-7': {
      conjunction: 'Your sense of self and your closest partnership merge into a single focus. Who you are and who you are with become inseparable questions.',
      sextile: 'A gentle opening appears between your personal identity and your closest relationships. Small gestures of authenticity strengthen your bonds.',
      square: 'Tension between your personal needs and your partnership obligations demands creative resolution. Neither side can be ignored.',
      trine: 'Your sense of self and your relationships flow together naturally. Being authentically you strengthens rather than threatens your closest bonds.',
      opposition: 'The mirror of relationship shows you something important about yourself. What you see in your partner — admirable or frustrating — reflects something within.',
    },
    '2-8': {
      conjunction: 'Personal resources and shared depths merge. Financial or emotional investments require you to blend what is yours with what belongs to the relationship.',
      sextile: 'A small opportunity emerges to deepen your financial or emotional security through shared resources. Trust is building quietly.',
      square: 'Tension between what you own and what you share with others surfaces. Negotiations about money, intimacy, or vulnerability may feel charged.',
      trine: 'Material security and emotional depth flow together easily. Investments — financial or emotional — feel naturally supported.',
      opposition: 'The balance between personal possessions and shared resources needs recalibrating. What you hold tightly may need releasing, and what you share may need protecting.',
    },
    '4-10': {
      conjunction: 'Home life and career ambitions demand simultaneous attention. Finding a way to honour both your private roots and your public aspirations is the challenge.',
      sextile: 'A gentle connection forms between your domestic life and professional goals. Something at home supports your career, or a professional insight improves family life.',
      square: 'The pull between home responsibilities and career demands creates friction. Neither can be sacrificed for the other — integration is the only path.',
      trine: 'Your private life and public life support each other naturally. Professional success feels rooted in personal stability, and home life benefits from your achievements.',
      opposition: 'Family needs and career ambitions stand in stark contrast. Finding balance requires honest assessment of what truly matters most to you right now.',
    },
    '5-11': {
      conjunction: 'Personal creativity and collective vision unite. Your individual expression serves a larger purpose, and group energy fuels your creative fire.',
      sextile: 'A small creative opportunity arises through your social connections. What brings you joy aligns with what your community needs.',
      square: 'Tension between personal creative expression and group expectations surfaces. Your individual joy may not align with collective priorities — find a way to honour both.',
      trine: 'Your creative gifts flow naturally into community benefit. What you do for joy also serves others, and group energy inspires your personal expression.',
      opposition: 'The balance between personal pleasure and collective responsibility is highlighted. Your individual desires and your community commitments need reconciling.',
    },
  }

  if (axisTexts[pair]?.[aspectType]) {
    return axisTexts[pair][aspectType]
  }

  // General composable template for all other combinations
  const h1 = HOUSE_THEMES[house1]
  const h2 = HOUSE_THEMES[house2]
  const natureTexts: Record<string, string> = {
    harmonious: `This creates a supportive flow between these areas of your life — progress in one naturally benefits the other.`,
    challenging: `This creates productive tension between these areas, pushing you to find creative solutions that honour both.`,
    neutral: `These two areas of your life are merging their energies, creating a concentrated focus that demands your attention.`,
  }
  const aspectNature = ASPECT_DESCRIPTIONS[aspectType]?.nature ?? 'neutral'
  return `Your ${h1.area.toLowerCase()} and your ${h2.area.toLowerCase()} are in dynamic conversation. ${natureTexts[aspectNature]}`
}

export function generatePersonalAspectReading(
  planet1Id: string,
  planet1Sign: string,
  planet2Id: string,
  planet2Sign: string,
  aspectType: AspectType,
  userSunSign: string
): string {
  const house1 = getHouseForTransit(userSunSign as ZodiacSign, planet1Sign as ZodiacSign)
  const house2 = getHouseForTransit(userSunSign as ZodiacSign, planet2Sign as ZodiacSign)
  const h1Theme = HOUSE_THEMES[house1]
  const h2Theme = HOUSE_THEMES[house2]
  const aspectDesc = ASPECT_DESCRIPTIONS[aspectType]

  if (!h1Theme || !h2Theme || !aspectDesc) return ''

  const interactionText = getHouseInteractionText(house1, house2, aspectType)

  if (house1 === house2) {
    return `This ${aspectDesc.name.toLowerCase()} focuses on your ${h1Theme.area.toLowerCase()}. ${interactionText}`
  }

  return `This ${aspectDesc.name.toLowerCase()} connects your ${h1Theme.area.toLowerCase()} with your ${h2Theme.area.toLowerCase()}. ${interactionText}`
}
