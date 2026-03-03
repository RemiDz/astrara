import * as Astronomy from 'astronomy-engine';
import { BirthChart, PlanetPosition, PlanetName, ZodiacSign, ZODIAC_SIGNS, PLANET_NAMES } from '@/types';
import { calculateFrequency } from './frequency-map';
import { calculateAspects } from './aspects';

const ASTRONOMY_BODIES: Record<string, Astronomy.Body> = {
  Sun: Astronomy.Body.Sun,
  Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune,
  Pluto: Astronomy.Body.Pluto,
};

function getEclipticLongitude(planet: PlanetName, time: Astronomy.AstroTime): number {
  if (planet === 'Sun') {
    return Astronomy.SunPosition(time).elon;
  }
  if (planet === 'Moon') {
    return Astronomy.EclipticGeoMoon(time).lon;
  }
  return Astronomy.EclipticLongitude(ASTRONOMY_BODIES[planet], time);
}

function longitudeToSign(longitude: number): { sign: ZodiacSign; degree: number } {
  const signIndex = Math.floor(longitude / 30);
  const degree = longitude % 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: parseFloat(degree.toFixed(1)),
  };
}

export function calculateBirthChart(
  dateStr: string,
  timeStr: string,
  lat: number,
  lng: number,
  location: string
): BirthChart {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const time = Astronomy.MakeTime(date);

  const planets: PlanetPosition[] = PLANET_NAMES.map((planet) => {
    const longitude = getEclipticLongitude(planet, time);
    const { sign, degree } = longitudeToSign(longitude);
    const frequency = calculateFrequency(planet, longitude);

    return { planet, longitude, sign, degree, frequency };
  });

  const aspects = calculateAspects(planets);

  // Dominant planet: highest frequency (loudest in the cosmic signature)
  const dominantPlanet = planets.reduce((prev, curr) =>
    curr.frequency > prev.frequency ? curr : prev
  );

  return {
    planets,
    aspects,
    dominantPlanet,
    date: dateStr,
    time: timeStr,
    lat,
    lng,
    location,
  };
}
