export interface PlanetMeta {
  id: string
  name: string
  glyph: string
  colour: string
  size: number
}

export const PLANETS: PlanetMeta[] = [
  { id: 'sun', name: 'Sun', glyph: '\u2609', colour: '#FFD700', size: 16 },
  { id: 'moon', name: 'Moon', glyph: '\u263D', colour: '#C0C0C0', size: 16 },
  { id: 'mercury', name: 'Mercury', glyph: '\u263F', colour: '#00E5FF', size: 14 },
  { id: 'venus', name: 'Venus', glyph: '\u2640', colour: '#FF69B4', size: 14 },
  { id: 'mars', name: 'Mars', glyph: '\u2642', colour: '#FF4444', size: 14 },
  { id: 'jupiter', name: 'Jupiter', glyph: '\u2643', colour: '#FF8C00', size: 12 },
  { id: 'saturn', name: 'Saturn', glyph: '\u2644', colour: '#778899', size: 12 },
  { id: 'uranus', name: 'Uranus', glyph: '\u2645', colour: '#00CED1', size: 12 },
  { id: 'neptune', name: 'Neptune', glyph: '\u2646', colour: '#4169E1', size: 12 },
  { id: 'pluto', name: 'Pluto', glyph: '\u2647', colour: '#8B008B', size: 12 },
]

export function getPlanetMeta(id: string): PlanetMeta | undefined {
  return PLANETS.find(p => p.id === id)
}
