export interface City {
  name: string;
  lat: number;
  lng: number;
}

export interface PlanetPosition {
  planet: PlanetName;
  longitude: number;
  sign: ZodiacSign;
  degree: number;
  frequency: number;
}

export interface Aspect {
  planet1: PlanetName;
  planet2: PlanetName;
  type: AspectType;
  angle: number;
  orb: number;
  musicalInterval: MusicalInterval;
}

export interface BirthChart {
  planets: PlanetPosition[];
  aspects: Aspect[];
  dominantPlanet: PlanetPosition;
  date: string;
  time: string;
  lat: number;
  lng: number;
  location: string;
}

export type PlanetName =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type AspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';

export type MusicalInterval = 'Unison' | 'Minor Third' | 'Perfect Fourth' | 'Perfect Fifth' | 'Octave';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const PLANET_SYMBOLS: Record<PlanetName, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄',
  Uranus: '⛢', Neptune: '♆', Pluto: '⯓',
};

export const PLANET_NAMES: PlanetName[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
];

export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water';

export const ZODIAC_ELEMENTS: Record<ZodiacSign, ZodiacElement> = {
  Aries: 'fire', Taurus: 'earth', Gemini: 'air', Cancer: 'water',
  Leo: 'fire', Virgo: 'earth', Libra: 'air', Scorpio: 'water',
  Sagittarius: 'fire', Capricorn: 'earth', Aquarius: 'air', Pisces: 'water',
};
