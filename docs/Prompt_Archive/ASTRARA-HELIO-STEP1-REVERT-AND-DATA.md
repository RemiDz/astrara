# ASTRARA — Revert Heliocentric View & Rebuild Step 1: Data Layer Only

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## PHASE A: REVERT — Restore Working Astro Wheel

### What to Remove

Remove ALL code added for the heliocentric/solar system view feature. This includes:

1. The "Solar System View" / "Astro Wheel View" toggle button — DELETE entirely
2. Any `viewMode` state (`'geocentric' | 'heliocentric'`) — DELETE
3. Any `isTransitioning` state — DELETE
4. Any heliocentric position calculations (`HelioVector`, `getHeliocentricPosition`, `helioToScene`, etc.) — DELETE
5. Any `HELIO_RING_RADII` or distance scaling constants — DELETE
6. Any orbital path ring components or geometries — DELETE
7. Any transition animation logic (progress lerping, phase timing, smoothstep) — DELETE
8. Any Moon orbit offset or exaggerated Moon position logic — DELETE
9. Any label switching logic (degree format vs name format) — DELETE
10. Any camera adjustment logic for heliocentric view — DELETE

### What to KEEP (do NOT touch these)

- The geocentric astro wheel — all planet positions, zodiac signs, aspect lines
- Earth Kp aura glow
- Sun corona flare glow  
- Planet distance and light travel time on cards
- The new header layout (three icons right-aligned)
- The settings panel (location, language, immersive universe)
- The cinematic starfield
- The loading animation sequence
- All planet tap targets and detail panels
- Day navigation (Yesterday/Today/Tomorrow)
- All NOAA data fetching (Kp index, X-ray flux)
- Sound/soundscape functionality

### Verify After Revert

Run `npm run build` and confirm:
- The app loads with the geocentric astro wheel exactly as before
- All planets are visible with correct positions
- Zodiac signs show correctly around the wheel
- Aspect lines connect planets correctly
- Earth Kp aura glows
- Sun corona responds to solar activity
- Planet cards show distance and light travel time
- Settings panel works (location, language, immersive universe)
- Sound toggle works
- No console errors

Commit: `revert: remove broken heliocentric view — preparing clean rebuild`
Push to `main`

**STOP HERE. Do not proceed to Phase B until the revert is confirmed working.**

---

## PHASE B: Rebuild Step 1 — Data Layer Only (NO UI CHANGES)

This phase ONLY adds data calculations. It does NOT add any buttons, transitions, animations, visual changes, or new components. The app should look and behave IDENTICALLY after this phase — the only difference is that heliocentric position data is now available in state.

### 1. Create a New Utility File

Create `src/lib/heliocentric.ts` — a pure data utility with zero UI dependencies:

```typescript
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

export const MOON_ORBIT_OFFSET = 1.0

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
```

### 2. Add Heliocentric Data to Existing Planet State

Find where the app calculates geocentric planet positions (likely on mount and when the date changes). In that same location, ALSO call `calculateAllHelioData(date)` and store the result alongside the geocentric data.

The exact approach depends on the current state management:

**If using React state/context:**
```typescript
const [helioData, setHelioData] = useState<Record<string, HelioData>>({})

// In the same useEffect that calculates geocentric positions:
useEffect(() => {
  // ... existing geocentric calculations ...
  
  // ADD: calculate heliocentric data
  const helio = calculateAllHelioData(currentDate)
  setHelioData(helio)
}, [currentDate])
```

**If using zustand or other state manager:**
Add a `helioData` field to the store and update it alongside geocentric data.

### 3. Add viewMode State (But Do NOT Render Anything Different)

Add the state variable that will later control the view, but do NOT use it anywhere in rendering yet:

```typescript
type ViewMode = 'geocentric' | 'heliocentric'
const [viewMode, setViewMode] = useState<ViewMode>('geocentric')
```

This just needs to exist in state. It will be wired up in Step 2.

### 4. Verify Data Integrity

Add a temporary `console.log` that runs once on mount to verify the heliocentric data looks correct:

```typescript
useEffect(() => {
  const testData = calculateAllHelioData(new Date())
  console.log('Heliocentric data test:', {
    sunAtCentre: testData.Sun.sceneX === 0 && testData.Sun.sceneY === 0,
    earthRadius: testData.Earth.ringRadius,
    earthAngle: testData.Earth.angleDeg.toFixed(1),
    plutoRadius: testData.Pluto.ringRadius,
    plutoAngle: testData.Pluto.angleDeg.toFixed(1),
    moonNearEarth: Math.abs(testData.Moon.sceneX - testData.Earth.sceneX) < 2,
    allPlanetsPresent: Object.keys(testData).length === 11,  // Sun + Earth + Moon + 8 planets
  })
}, [])
```

This console.log will be removed in Step 3 (polish). For now it confirms the data layer works.

---

## What This Step Does NOT Include

- NO toggle button
- NO transition animation
- NO visual changes whatsoever
- NO orbital rings
- NO label changes
- NO camera adjustments
- The app looks and behaves 100% identically to before this step

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: app loads normally, geocentric wheel works exactly as before
3. Test: open browser console — verify "Heliocentric data test" log shows all `true` values and sensible angles
4. Test: change date (Yesterday/Tomorrow) — no errors, wheel works normally
5. Test: all existing features work (planet taps, detail panels, sound, settings, Kp aura, Sun corona)
6. Commit: `feat: heliocentric data layer — calculations ready, no UI changes yet`
7. Push to `main`
