import { PlanetPosition, Aspect, AspectType, MusicalInterval } from '@/types';
import { normalizeAngle } from '@/lib/utils';

interface AspectDefinition {
  type: AspectType;
  angle: number;
  orb: number;
  musicalInterval: MusicalInterval;
}

const ASPECT_DEFINITIONS: AspectDefinition[] = [
  { type: 'conjunction', angle: 0, orb: 8, musicalInterval: 'Unison' },
  { type: 'sextile', angle: 60, orb: 6, musicalInterval: 'Minor Third' },
  { type: 'square', angle: 90, orb: 8, musicalInterval: 'Perfect Fourth' },
  { type: 'trine', angle: 120, orb: 8, musicalInterval: 'Perfect Fifth' },
  { type: 'opposition', angle: 180, orb: 8, musicalInterval: 'Octave' },
];

export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const def of ASPECT_DEFINITIONS) {
        const orb = Math.abs(diff - def.angle);
        if (orb <= def.orb) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            type: def.type,
            angle: normalizeAngle(diff),
            orb,
            musicalInterval: def.musicalInterval,
          });
          break;
        }
      }
    }
  }

  return aspects;
}
