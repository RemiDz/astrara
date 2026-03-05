import * as Astronomy from 'astronomy-engine'

// Fixed ring radii for solar system view (scene units)
// These are NOT real AU distances — they're evenly spaced for mobile screen readability
// The angular positions ARE real astronomical data
export const HELIO_RING_RADII: Record<string, number> = {
  Sun:     0,
  Mercury: 2.5,
  Venus:   4.0,
  Earth:   5.5,
  Mars:    7.0,
  Jupiter: 9.0,
  Saturn:  11.0,
  Uranus:  13.0,
  Neptune: 15.0,
  Pluto:   17.0,
}

export const MOON_ORBIT_OFFSET = 1.8

export interface HelioData {
  angleDeg: number       // true heliocentric longitude (degrees)
  ringRadius: number     // fixed scene radius for display
  sceneX: number         // pre-calculated scene X position
  sceneY: number         // pre-calculated scene Y position
}

// Map astronomy-engine body names to our planet names
const BODY_MAP: Record<string, Astronomy.Body> = {
  Mercury: Astronomy.Body.Mercury,
  Venus:   Astronomy.Body.Venus,
  Mars:    Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn:  Astronomy.Body.Saturn,
  Uranus:  Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune,
  Pluto:   Astronomy.Body.Pluto,
}

/**
 * Calculate heliocentric angle for a planet using astronomy-engine.
 * Returns the ecliptic longitude as seen from the Sun.
 */
function getHelioAngle(body: Astronomy.Body, date: Date): number {
  const vector = Astronomy.HelioVector(body, date)
  const angleDeg = Math.atan2(vector.y, vector.x) * (180 / Math.PI)
  // Normalise to 0–360
  return ((angleDeg % 360) + 360) % 360
}

/**
 * Calculate Earth's heliocentric angle.
 * Earth's helio position = inverse of Sun's geocentric position.
 */
function getEarthHelioAngle(date: Date): number {
  const sunGeo = Astronomy.GeoVector(Astronomy.Body.Sun, date, true)
  const angleDeg = Math.atan2(-sunGeo.y, -sunGeo.x) * (180 / Math.PI)
  return ((angleDeg % 360) + 360) % 360
}

/**
 * Calculate Moon's angle relative to Earth (for orbital display).
 */
function getMoonAngleFromEarth(date: Date): number {
  const moonGeo = Astronomy.GeoVector(Astronomy.Body.Moon, date, true)
  const angleDeg = Math.atan2(moonGeo.y, moonGeo.x) * (180 / Math.PI)
  return ((angleDeg % 360) + 360) % 360
}

/**
 * Convert angle + ring radius to scene coordinates.
 */
function toSceneCoords(angleDeg: number, radius: number): { x: number; y: number } {
  const angleRad = angleDeg * (Math.PI / 180)
  return {
    x: radius * Math.cos(angleRad),
    y: radius * Math.sin(angleRad),
  }
}

/**
 * Calculate all heliocentric data for all bodies for a given date.
 * Returns a Record keyed by planet name.
 */
export function calculateAllHelioData(date: Date): Record<string, HelioData> {
  const result: Record<string, HelioData> = {}

  // Sun is always at centre
  result.Sun = {
    angleDeg: 0,
    ringRadius: 0,
    sceneX: 0,
    sceneY: 0,
  }

  // Earth
  const earthAngle = getEarthHelioAngle(date)
  const earthRadius = HELIO_RING_RADII.Earth
  const earthCoords = toSceneCoords(earthAngle, earthRadius)
  result.Earth = {
    angleDeg: earthAngle,
    ringRadius: earthRadius,
    sceneX: earthCoords.x,
    sceneY: earthCoords.y,
  }

  // Moon — orbits around Earth's position
  const moonAngle = getMoonAngleFromEarth(date)
  const moonCoords = {
    x: earthCoords.x + MOON_ORBIT_OFFSET * Math.cos(moonAngle * Math.PI / 180),
    y: earthCoords.y + MOON_ORBIT_OFFSET * Math.sin(moonAngle * Math.PI / 180),
  }
  result.Moon = {
    angleDeg: moonAngle,
    ringRadius: MOON_ORBIT_OFFSET,
    sceneX: moonCoords.x,
    sceneY: moonCoords.y,
  }

  // All other planets
  for (const [name, body] of Object.entries(BODY_MAP)) {
    const angle = getHelioAngle(body, date)
    const radius = HELIO_RING_RADII[name]
    const coords = toSceneCoords(angle, radius)
    result[name] = {
      angleDeg: angle,
      ringRadius: radius,
      sceneX: coords.x,
      sceneY: coords.y,
    }
  }

  return result
}
