export interface ZodiacSign {
  id: string
  name: string
  glyph: string
  element: 'fire' | 'earth' | 'air' | 'water'
  modality: 'cardinal' | 'fixed' | 'mutable'
  colour: string
  dateRange: string
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', name: 'Aries', glyph: '\u2648', element: 'fire', modality: 'cardinal', colour: '#FF6B4A', dateRange: 'Mar 21 – Apr 19' },
  { id: 'taurus', name: 'Taurus', glyph: '\u2649', element: 'earth', modality: 'fixed', colour: '#4ADE80', dateRange: 'Apr 20 – May 20' },
  { id: 'gemini', name: 'Gemini', glyph: '\u264A', element: 'air', modality: 'mutable', colour: '#60A5FA', dateRange: 'May 21 – Jun 20' },
  { id: 'cancer', name: 'Cancer', glyph: '\u264B', element: 'water', modality: 'cardinal', colour: '#A78BFA', dateRange: 'Jun 21 – Jul 22' },
  { id: 'leo', name: 'Leo', glyph: '\u264C', element: 'fire', modality: 'fixed', colour: '#FF6B4A', dateRange: 'Jul 23 – Aug 22' },
  { id: 'virgo', name: 'Virgo', glyph: '\u264D', element: 'earth', modality: 'mutable', colour: '#4ADE80', dateRange: 'Aug 23 – Sep 22' },
  { id: 'libra', name: 'Libra', glyph: '\u264E', element: 'air', modality: 'cardinal', colour: '#60A5FA', dateRange: 'Sep 23 – Oct 22' },
  { id: 'scorpio', name: 'Scorpio', glyph: '\u264F', element: 'water', modality: 'fixed', colour: '#A78BFA', dateRange: 'Oct 23 – Nov 21' },
  { id: 'sagittarius', name: 'Sagittarius', glyph: '\u2650', element: 'fire', modality: 'mutable', colour: '#FF6B4A', dateRange: 'Nov 22 – Dec 21' },
  { id: 'capricorn', name: 'Capricorn', glyph: '\u2651', element: 'earth', modality: 'cardinal', colour: '#4ADE80', dateRange: 'Dec 22 – Jan 19' },
  { id: 'aquarius', name: 'Aquarius', glyph: '\u2652', element: 'air', modality: 'fixed', colour: '#60A5FA', dateRange: 'Jan 20 – Feb 18' },
  { id: 'pisces', name: 'Pisces', glyph: '\u2653', element: 'water', modality: 'mutable', colour: '#A78BFA', dateRange: 'Feb 19 – Mar 20' },
]

export const ELEMENT_COLOURS: Record<string, string> = {
  fire: '#FF6B4A',
  earth: '#4ADE80',
  air: '#60A5FA',
  water: '#A78BFA',
}

export function getSignFromLongitude(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360
  const index = Math.floor(normalized / 30)
  return ZODIAC_SIGNS[index]
}

export function getDegreeInSign(longitude: number): number {
  const normalized = ((longitude % 360) + 360) % 360
  return Math.floor(normalized % 30)
}
