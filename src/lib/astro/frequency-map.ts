import { PlanetName } from '@/types';

// Base frequencies per planet (Cousto Cosmic Octave - orbital periods octaved to audible range)
export const BASE_FREQUENCIES: Record<PlanetName, number> = {
  Sun: 126.22,
  Moon: 210.42,
  Mercury: 141.27,
  Venus: 221.23,
  Mars: 144.72,
  Jupiter: 183.58,
  Saturn: 147.85,
  Uranus: 207.36,
  Neptune: 211.44,
  Pluto: 140.25,
};

// Zodiac modulation: longitude 0-360 maps to multiplier 0.75-1.5
export function calculateFrequency(planet: PlanetName, longitude: number): number {
  const base = BASE_FREQUENCIES[planet];
  const multiplier = 0.75 + (longitude / 360) * 0.75;
  return base * multiplier;
}

// Planet waveforms
export const PLANET_WAVEFORMS: Record<PlanetName, OscillatorType> = {
  Sun: 'sine',
  Moon: 'triangle',
  Mercury: 'sine',
  Venus: 'triangle',
  Mars: 'square',
  Jupiter: 'sine',
  Saturn: 'sine',
  Uranus: 'sine',
  Neptune: 'triangle',
  Pluto: 'square',
};

// Planet volumes (Sun loudest, outer planets quietest)
export const PLANET_VOLUMES: Record<PlanetName, number> = {
  Sun: 0.15,
  Moon: 0.12,
  Mercury: 0.08,
  Venus: 0.10,
  Mars: 0.07,
  Jupiter: 0.09,
  Saturn: 0.06,
  Uranus: 0.04,
  Neptune: 0.04,
  Pluto: 0.03,
};

// LFO rates per planet for organic breathing
export const PLANET_LFO_RATES: Record<PlanetName, number> = {
  Sun: 0.1,
  Moon: 0.15,
  Mercury: 0.3,
  Venus: 0.2,
  Mars: 0.35,
  Jupiter: 0.12,
  Saturn: 0.1,
  Uranus: 0.25,
  Neptune: 0.18,
  Pluto: 0.4,
};

// Slight detuning per planet for warmth (in cents)
export const PLANET_DETUNE: Record<PlanetName, number> = {
  Sun: 0,
  Moon: 3,
  Mercury: -2,
  Venus: 5,
  Mars: -4,
  Jupiter: 2,
  Saturn: -3,
  Uranus: 6,
  Neptune: -5,
  Pluto: 4,
};
