import type { ZodiacSign } from '../types'

export const ZODIAC_SIGNS: Record<ZodiacSign, {
  symbol: string
  unicode: string
  element: 'fire' | 'earth' | 'air' | 'water'
  modality: 'cardinal' | 'fixed' | 'mutable'
  ruler: string
  dateRange: string
  colour: string
  startDegree: number
}> = {
  aries:       { symbol: '♈', unicode: '\u2648', element: 'fire',  modality: 'cardinal', ruler: 'mars',    dateRange: 'Mar 21 – Apr 19',  colour: '#FF4444', startDegree: 0 },
  taurus:      { symbol: '♉', unicode: '\u2649', element: 'earth', modality: 'fixed',    ruler: 'venus',   dateRange: 'Apr 20 – May 20',  colour: '#4CAF50', startDegree: 30 },
  gemini:      { symbol: '♊', unicode: '\u264A', element: 'air',   modality: 'mutable',  ruler: 'mercury', dateRange: 'May 21 – Jun 20',  colour: '#FFEB3B', startDegree: 60 },
  cancer:      { symbol: '♋', unicode: '\u264B', element: 'water', modality: 'cardinal', ruler: 'moon',    dateRange: 'Jun 21 – Jul 22',  colour: '#B0BEC5', startDegree: 90 },
  leo:         { symbol: '♌', unicode: '\u264C', element: 'fire',  modality: 'fixed',    ruler: 'sun',     dateRange: 'Jul 23 – Aug 22',  colour: '#FF9800', startDegree: 120 },
  virgo:       { symbol: '♍', unicode: '\u264D', element: 'earth', modality: 'mutable',  ruler: 'mercury', dateRange: 'Aug 23 – Sep 22',  colour: '#8D6E63', startDegree: 150 },
  libra:       { symbol: '♎', unicode: '\u264E', element: 'air',   modality: 'cardinal', ruler: 'venus',   dateRange: 'Sep 23 – Oct 22',  colour: '#E91E8C', startDegree: 180 },
  scorpio:     { symbol: '♏', unicode: '\u264F', element: 'water', modality: 'fixed',    ruler: 'pluto',   dateRange: 'Oct 23 – Nov 21',  colour: '#880E4F', startDegree: 210 },
  sagittarius: { symbol: '♐', unicode: '\u2650', element: 'fire',  modality: 'mutable',  ruler: 'jupiter', dateRange: 'Nov 22 – Dec 21',  colour: '#9C27B0', startDegree: 240 },
  capricorn:   { symbol: '♑', unicode: '\u2651', element: 'earth', modality: 'cardinal', ruler: 'saturn',  dateRange: 'Dec 22 – Jan 19',  colour: '#455A64', startDegree: 270 },
  aquarius:    { symbol: '♒', unicode: '\u2652', element: 'air',   modality: 'fixed',    ruler: 'uranus',  dateRange: 'Jan 20 – Feb 18',  colour: '#00BCD4', startDegree: 300 },
  pisces:      { symbol: '♓', unicode: '\u2653', element: 'water', modality: 'mutable',  ruler: 'neptune', dateRange: 'Feb 19 – Mar 20',  colour: '#7E57C2', startDegree: 330 },
}

export const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
]

/** Derive Sun sign from ecliptic longitude (0-360°) */
export function signFromLongitude(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360
  const index = Math.floor(normalized / 30)
  return ZODIAC_ORDER[index]
}

/** Get Whole Sign house number (1-12) for a transit sign relative to user's Sun sign */
export function getHouseForTransit(userSunSign: ZodiacSign, transitSign: ZodiacSign): number {
  const sunIndex = ZODIAC_ORDER.indexOf(userSunSign)
  const transitIndex = ZODIAC_ORDER.indexOf(transitSign)
  return ((transitIndex - sunIndex + 12) % 12) + 1
}
