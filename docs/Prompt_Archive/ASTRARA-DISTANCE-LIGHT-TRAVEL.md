# ASTRARA — Add Real-Time Distance & Light Travel Time to Planet Cards

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Astrara already uses `astronomy-engine` to calculate planetary positions. This library also returns the distance from Earth to each body in AU (astronomical units). We need to surface this data in every planet detail card as two new data points: real distance (km + miles) and light travel time.

Read all current planet card / detail panel components before making changes.

---

## 1. Create a Distance Utility

Create a new utility file: `src/lib/distance.ts`

```typescript
// 1 AU in kilometres
const AU_TO_KM = 149_597_870.7

// Speed of light in km/s
const SPEED_OF_LIGHT_KMS = 299_792.458

// 1 km in miles
const KM_TO_MILES = 0.621371

export interface DistanceData {
  km: number
  miles: number
  lightTravelSeconds: number
  formattedKm: string
  formattedMiles: string
  formattedLightTravel: string
}

export function calculateDistance(distanceAU: number): DistanceData {
  const km = distanceAU * AU_TO_KM
  const miles = km * KM_TO_MILES
  const lightTravelSeconds = km / SPEED_OF_LIGHT_KMS

  return {
    km,
    miles,
    lightTravelSeconds,
    formattedKm: formatDistance(km),
    formattedMiles: formatDistance(miles),
    formattedLightTravel: formatLightTravel(lightTravelSeconds),
  }
}

function formatDistance(value: number): string {
  if (value < 1_000) return `${Math.round(value)}`
  if (value < 1_000_000) return `${(value / 1_000).toFixed(1)}k`
  if (value < 1_000_000_000) return `${numberWithCommas(Math.round(value / 1_000) * 1_000)}`
  return `${(value / 1_000_000_000).toFixed(2)} billion`
}

// e.g. 384400000 → "384,400,000"
function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function formatLightTravel(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)} seconds`
  }
  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.round(totalSeconds % 60)
    return seconds > 0 ? `${minutes} min ${seconds} sec` : `${minutes} min`
  }
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.round((totalSeconds % 3600) / 60)
  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`
}
```

---

## 2. Get Distance from astronomy-engine

In the existing code where planetary positions are calculated (likely using `Astronomy.GeoVector()` or `Astronomy.HelioVector()` + conversion), the distance in AU is already available.

Find where planet positions are computed. The function `Astronomy.GeoVector(body, date, true)` returns `{ x, y, z }` — the distance in AU is:

```typescript
import * as Astronomy from 'astronomy-engine'

const vector = Astronomy.GeoVector(body, date, true)
const distanceAU = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2)
```

Alternatively, if the code uses `Astronomy.Equator()` or `Astronomy.Ecliptic()`, the `.dist` property is already in AU.

**For the Moon specifically**, use:

```typescript
const moonDist = Astronomy.GeoVector(Astronomy.Body.Moon, date, true)
const moonAU = Math.sqrt(moonDist.x ** 2 + moonDist.y ** 2 + moonDist.z ** 2)
```

**For the Sun:**

```typescript
const sunDist = Astronomy.GeoVector(Astronomy.Body.Sun, date, true)
const sunAU = Math.sqrt(sunDist.x ** 2 + sunDist.y ** 2 + sunDist.z ** 2)
```

Add the `distanceAU` value to whatever data structure is passed to the planet detail cards. Every planet object should now carry its distance.

---

## 3. Add Distance Display to Planet Detail Cards

Find the planet detail panel / card / bottom sheet component. Add a new section AFTER the planet's sign and degree info but BEFORE the interpretation text.

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│  ☽ MOON in Capricorn at 7°             │
│                                         │
│  ── Distance from Earth ──────────────  │
│                                         │
│  📏  394,821 km · 245,335 mi           │
│  💡  1.3 seconds at the speed of light  │
│                                         │
│  ── Insight ──────────────────────────  │
│                                         │
│  "Emotions seek structure and           │
│   discipline today..."                  │
│                                         │
└─────────────────────────────────────────┘
```

### Styling

- Use the same glass morphism card style as existing content sections
- The section should have a subtle top border or divider, consistent with existing card dividers
- Distance values in a slightly larger/brighter font weight than body text
- "km" and "mi" shown side by side on one line, separated by a middle dot ` · `
- Light travel time on a second line
- Use a subtle icon or emoji prefix: a ruler/straightedge icon for distance, a light/photon icon for light travel
- Both lines should use the planet's accent colour for the numeric values
- The label "Distance from Earth" should be styled like existing section subheadings in the card

### Responsive

- On narrow screens, if both km and miles don't fit on one line, stack them:
  ```
  394,821 km
  245,335 mi
  ```
- Light travel time always on its own line

---

## 4. Special Handling

### Moon
- The Moon's distance changes noticeably day to day (356,500 km at perigee to 406,700 km at apogee)
- Add a subtle label when the Moon is near perigee (<360,000 km): show small text "Near perigee (closest)" in a muted colour
- Add a subtle label when the Moon is near apogee (>404,000 km): show small text "Near apogee (furthest)" in a muted colour

### Sun
- Show the Sun's distance which varies between ~147M km (perihelion, January) and ~152M km (aphelion, July)

### All Planets
- Every planet card gets this treatment — Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
- Values update when the user swipes to a different date

---

## 5. Update the About/Info Section

In the Q&A / About section, add a new entry:

**Question:** "Are the distances shown real?"

**Answer:** "Yes. The distance from Earth to each planet is calculated in real time using the same astronomical library that powers the wheel. These distances change constantly as the planets orbit — the Moon alone varies by about 50,000 km between its closest and furthest points each month. The light travel time shows how long a beam of light would take to cross that distance, giving you an intuitive sense of the vast scale of our solar system."

---

## 6. Internationalisation

If the app uses i18n translation files, add all new strings to both English and Lithuanian:

**English:**
- "Distance from Earth"
- "at the speed of light"
- "Near perigee (closest)"
- "Near apogee (furthest)"
- "seconds"
- "min"
- "sec"
- "hr"

**Lithuanian:**
- "Atstumas nuo Žemės"
- "šviesos greičiu"
- "Artėja perigėjus (arčiausiai)"
- "Artėja apogėjus (toliausiai)"
- "sekundės"
- "min"
- "sek"
- "val"

If no i18n system exists, just use English strings.

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: open any planet card and verify distance + light travel time appear
3. Test: swipe to a different day — verify values update
4. Test: check Moon card shows perigee/apogee label when applicable
5. Test: verify formatting looks correct for small distances (Moon ~384k km) and large distances (Pluto ~5+ billion km)
6. Commit: `feat: add real-time distance and light travel time to all planet cards`
7. Push to `main`
