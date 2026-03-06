# ASTRARA — Solar System View: Heliocentric Toggle with Cinematic Transition

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ CRITICAL: Read Everything Before Writing Any Code

This is the most complex feature added to Astrara so far. It adds an alternate view mode where the astro wheel transforms into a real solar system map. READ ALL current source files for the wheel, planet positions, planet components, aspect lines, zodiac badges, orbital rings, Earth globe, Sun sphere, and any animation/loading code BEFORE making any changes.

**The #1 rule: Do NOT break the existing geocentric wheel.** The current wheel must continue to work exactly as it does today. You are ADDING a second view mode alongside it, not replacing it.

---

## Overview

A toggle button switches between two views:

**Geocentric View (default)** — The current astro wheel. Earth at centre, planets at ecliptic longitude positions around the zodiac. This is exactly what exists today. Change NOTHING about how this works.

**Heliocentric View (new)** — A solar system map. Sun at centre, planets positioned at their real orbital positions around the Sun, with compressed distance scaling for readability. Moon orbits Earth. Zodiac signs and aspect lines hidden. Orbital path rings shown.

The transition between views is a smooth cinematic animation (~3 seconds) where every element glides from one position to the other.

---

## 1. Calculate Heliocentric Positions

### Using astronomy-engine

The app already uses `astronomy-engine` for geocentric positions. Add heliocentric calculations alongside them — do NOT replace the existing geocentric calculations.

For each planet, calculate its heliocentric position (position relative to the Sun):

```typescript
import * as Astronomy from 'astronomy-engine'

interface HelioPosition {
  x: number          // heliocentric X in AU
  y: number          // heliocentric Y in AU
  z: number          // heliocentric Z in AU
  distanceAU: number // distance from Sun in AU
  angleDeg: number   // angle around the Sun in degrees (for 2D projection)
}

function getHeliocentricPosition(body: Astronomy.Body, date: Date): HelioPosition {
  // For planets (not Moon, not Sun)
  const vector = Astronomy.HelioVector(body, date)
  const distanceAU = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2)
  const angleDeg = Math.atan2(vector.y, vector.x) * (180 / Math.PI)

  return {
    x: vector.x,
    y: vector.y,
    z: vector.z,
    distanceAU,
    angleDeg,
  }
}

// For Earth specifically
function getEarthHelioPosition(date: Date): HelioPosition {
  // Earth's heliocentric position is the inverse of the Sun's geocentric position
  const sunGeo = Astronomy.GeoVector(Astronomy.Body.Sun, date, true)
  return {
    x: -sunGeo.x,
    y: -sunGeo.y,
    z: -sunGeo.z,
    distanceAU: Math.sqrt(sunGeo.x ** 2 + sunGeo.y ** 2 + sunGeo.z ** 2),
    angleDeg: Math.atan2(-sunGeo.y, -sunGeo.x) * (180 / Math.PI),
  }
}

// For the Moon — position relative to Earth, then offset by Earth's helio position
function getMoonHelioPosition(date: Date, earthHelio: HelioPosition): HelioPosition {
  const moonGeo = Astronomy.GeoVector(Astronomy.Body.Moon, date, true)
  return {
    x: earthHelio.x + moonGeo.x,
    y: earthHelio.y + moonGeo.y,
    z: earthHelio.z + moonGeo.z,
    distanceAU: earthHelio.distanceAU, // roughly same distance from Sun as Earth
    angleDeg: Math.atan2(
      earthHelio.y + moonGeo.y,
      earthHelio.x + moonGeo.x
    ) * (180 / Math.PI),
  }
}
```

### Sun in Heliocentric View
The Sun's heliocentric position is simply `{ x: 0, y: 0, z: 0 }` — it IS the centre.

### Calculate ALL positions for ALL bodies

On each date change (or on mount), calculate BOTH geocentric AND heliocentric positions for every body:

```typescript
interface PlanetPositions {
  geo: { x: number; y: number; z: number }  // current wheel position (3D scene coords)
  helio: { x: number; y: number; z: number } // solar system position (3D scene coords, after scaling)
}
```

---

## 2. Distance Scaling — CRITICAL FOR READABILITY

Real planetary distances are impossibly spread out for a screen. Use **square root scaling** to compress distances while preserving the relative ordering and feel:

```typescript
// Real mean orbital distances in AU
const ORBITAL_DISTANCES_AU: Record<string, number> = {
  Mercury: 0.387,
  Venus:   0.723,
  Earth:   1.000,
  Mars:    1.524,
  Jupiter: 5.203,
  Saturn:  9.537,
  Uranus:  19.191,
  Neptune: 30.069,
  Pluto:   39.482,
}

// Scale factor: maps AU distance to 3D scene units
// Adjust SCENE_SCALE so the outermost planet (Pluto) fits comfortably in the view
const SCENE_SCALE = 4.5  // tune this value so the wheel area is well-used

function auToSceneRadius(distanceAU: number): number {
  // Square root compression: preserves ordering, gives inner planets room
  return Math.sqrt(distanceAU) * SCENE_SCALE
}

// This gives approximate scene radii:
// Mercury: sqrt(0.387) * 4.5 ≈ 2.8
// Venus:   sqrt(0.723) * 4.5 ≈ 3.8
// Earth:   sqrt(1.000) * 4.5 ≈ 4.5
// Mars:    sqrt(1.524) * 4.5 ≈ 5.6
// Jupiter: sqrt(5.203) * 4.5 ≈ 10.3
// Saturn:  sqrt(9.537) * 4.5 ≈ 13.9
// Uranus:  sqrt(19.19) * 4.5 ≈ 19.7
// Neptune: sqrt(30.07) * 4.5 ≈ 24.7
// Pluto:   sqrt(39.48) * 4.5 ≈ 28.3
```

**IMPORTANT:** The SCENE_SCALE value must be tuned so that:
- The Sun at centre and Pluto at the edge both fit within the camera's view
- There is enough visual separation between inner planets (Mercury, Venus, Earth, Mars)
- The wheel doesn't need to be zoomed out so far that planets become tiny dots

You may need to adjust SCENE_SCALE and/or the camera position for heliocentric view. The camera might need to pull back slightly compared to the geocentric view.

### Convert Helio AU Positions to Scene Coordinates

```typescript
function helioToScene(helio: HelioPosition): { x: number; y: number; z: number } {
  const scaledRadius = auToSceneRadius(helio.distanceAU)
  const angleRad = helio.angleDeg * (Math.PI / 180)

  return {
    x: scaledRadius * Math.cos(angleRad),
    y: scaledRadius * Math.sin(angleRad),
    z: 0,  // flatten to 2D plane for clarity (real inclinations are tiny)
  }
}
```

We flatten to a 2D plane (z=0) because real orbital inclinations are only a few degrees and would add visual noise without insight. The solar system is essentially flat.

---

## 3. Moon Orbit Around Earth

In heliocentric view, the Moon should visibly orbit Earth. Since the Moon's real orbital distance (0.00257 AU) is invisible at solar system scale, we EXAGGERATE it:

```typescript
const MOON_ORBIT_VISUAL_RADIUS = 1.2  // scene units — enough to see clearly around Earth

function getMoonScenePosition(
  earthScenePos: { x: number; y: number; z: number },
  moonAngleFromEarth: number  // degrees, from astronomy-engine
): { x: number; y: number; z: number } {
  const angleRad = moonAngleFromEarth * (Math.PI / 180)
  return {
    x: earthScenePos.x + MOON_ORBIT_VISUAL_RADIUS * Math.cos(angleRad),
    y: earthScenePos.y + MOON_ORBIT_VISUAL_RADIUS * Math.sin(angleRad),
    z: 0,
  }
}
```

To get the Moon's angle relative to Earth, use:

```typescript
const moonGeo = Astronomy.GeoVector(Astronomy.Body.Moon, date, true)
const moonAngle = Math.atan2(moonGeo.y, moonGeo.x) * (180 / Math.PI)
```

Also draw a faint circular orbit path ring around Earth showing the Moon's orbit.

---

## 4. Orbital Path Rings

In heliocentric view, show faint circular orbit paths for each planet:

```typescript
// For each planet, draw a ring at its scaled orbital radius
const orbitRings = Object.entries(ORBITAL_DISTANCES_AU).map(([name, au]) => ({
  name,
  radius: auToSceneRadius(au),
}))
```

Each orbit ring:
- `RingGeometry` or `BufferGeometry` circle with ~128 segments
- `LineBasicMaterial` with `color: '#ffffff'`, `transparent: true`, `opacity: 0.06`
- Very subtle — just enough to show the orbital paths
- Flat on the z=0 plane
- Inner planets (Mercury–Mars) slightly brighter opacity (0.08) since they're closer together
- Outer planets slightly dimmer (0.04)

**These rings only exist in heliocentric view.** They fade in during the transition and fade out when switching back.

---

## 5. View State & Toggle Button

### State

```typescript
type ViewMode = 'geocentric' | 'heliocentric'

const [viewMode, setViewMode] = useState<ViewMode>('geocentric')
const [isTransitioning, setIsTransitioning] = useState(false)
```

### Toggle Button

Place a toggle button near the bottom of the wheel area, ABOVE the Yesterday/Today/Tomorrow navigation but below the wheel itself. Or place it floating at the bottom-right of the wheel.

**Button design:**

```
┌──────────────────────────┐
│  ☉ Solar System View     │   ← when in geocentric mode
└──────────────────────────┘

┌──────────────────────────┐
│  ✦ Astro Wheel View      │   ← when in heliocentric mode
└──────────────────────────┘
```

OR a simpler icon-only toggle:

- A small circular button (40×40px)
- Geocentric mode shows: a simple Sun icon (switch to solar system)
- Heliocentric mode shows: a zodiac wheel icon (switch to astro wheel)
- Subtle glass morphism background, consistent with app aesthetic
- `active:scale-90` tap feedback

The button should be clearly tappable but not dominate the UI. Position it where it won't interfere with wheel interaction.

### Disable During Transition

While `isTransitioning` is true:
- The toggle button shows a subtle loading/animating state
- Tapping it does nothing
- Planet detail panels cannot be opened (taps are ignored)
- Day navigation is disabled

---

## 6. The Cinematic Transition — GEOCENTRIC → HELIOCENTRIC

This is the centrepiece. Every element must animate smoothly. Use `useFrame` with lerping — NOT CSS transitions.

### Timeline (total ~3200ms)

**Phase 1: Fade Out Geocentric Elements (0–800ms)**
- Zodiac sign badges: fade opacity to 0, then hide
- Zodiac degree labels: fade opacity to 0
- Aspect lines: fade opacity to 0
- "Home" label on Earth: fade opacity to 0
- Zodiac ring markings (30° divisions): fade opacity to 0

**Phase 2: Ring Morph (400–1600ms)**
- The zodiac outer ring smoothly transforms into orbital path rings
- Approach: fade out the zodiac ring while simultaneously fading in the orbital path rings
- The orbital rings start at the zodiac ring's radius and scale to their correct orbital radii
- This creates a visual "expansion" effect — rings rippling outward from the wheel

**Phase 3: The Great Rearrangement (600–2800ms)**
- **Sun** moves from its current ecliptic position to the exact centre (0, 0, 0)
- **Earth** moves from the centre outward to its orbital position
- **All other planets** smoothly glide from their geocentric (ecliptic) positions to their heliocentric (orbital) positions
- **Moon** moves to its position orbiting Earth (with exaggerated radius)

Each planet's position is lerped in `useFrame`:

```typescript
// In each planet's component or a parent controller
const currentPos = useRef(new THREE.Vector3())
const targetPos = useRef(new THREE.Vector3())
const transitionProgress = useRef(0) // 0 = geocentric, 1 = heliocentric

useFrame((_, delta) => {
  if (isTransitioning) {
    // Advance progress toward target
    const target = viewMode === 'heliocentric' ? 1 : 0
    const speed = 0.8 // tune for ~2.5s total movement
    transitionProgress.current += (target - transitionProgress.current) * delta * speed

    // Smooth step for more cinematic ease
    const t = smoothstep(transitionProgress.current)

    // Lerp position
    const geoPos = planet.geoScenePosition
    const helioPos = planet.helioScenePosition

    currentPos.current.set(
      geoPos.x + (helioPos.x - geoPos.x) * t,
      geoPos.y + (helioPos.y - geoPos.y) * t,
      geoPos.z + (helioPos.z - geoPos.z) * t,
    )

    // Apply to mesh
    meshRef.current.position.copy(currentPos.current)

    // Check if transition complete
    if (Math.abs(transitionProgress.current - target) < 0.001) {
      transitionProgress.current = target
      // Signal transition complete (only from the controller, not per-planet)
    }
  }
})

// Attempt a nice ease function
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}
```

**Phase 4: Heliocentric Elements Appear (2200–3200ms)**
- Orbital path rings reach full (subtle) opacity
- Moon orbit ring around Earth fades in
- A small "☉" or "Sun" label fades in at the centre
- Planet labels adjust — in heliocentric view, show planet name + distance from Sun (e.g., "♂ Mars · 1.52 AU")
- "Home" label reappears on Earth at its new position

### Camera Adjustment

The camera may need to pull back slightly for heliocentric view since the solar system is wider than the zodiac wheel:

```typescript
useFrame(() => {
  if (isTransitioning) {
    const targetFov = viewMode === 'heliocentric' ? 65 : 55  // wider FOV for solar system
    // OR adjust camera position:
    const targetZ = viewMode === 'heliocentric' ? cameraZ * 1.3 : cameraZ
    // Lerp camera toward target
    camera.position.z += (targetZ - camera.position.z) * delta * 1.5
  }
})
```

Choose whichever approach (FOV or position) looks better. The goal is that all planets including Pluto are visible without scrolling in heliocentric view.

---

## 7. The Reverse Transition — HELIOCENTRIC → GEOCENTRIC

Exactly the reverse of the above:

1. Heliocentric elements fade out (orbital rings, Sun label, Moon orbit ring)
2. Planets glide from heliocentric positions back to geocentric positions
3. Sun moves from centre back to its ecliptic position
4. Earth returns to centre
5. Zodiac ring, signs, degree labels, aspect lines all fade back in
6. Camera returns to default position

Same lerping approach, same timing, played in reverse.

---

## 8. Interactions in Heliocentric View

### Planet Taps
Planet taps should still work in heliocentric view. The same detail panels open with the same content. The tap target hitboxes need to follow the planets to their new positions (this should happen automatically if the tap targets are children of the planet mesh groups).

### Day Navigation
Yesterday/Today/Tomorrow navigation should still work. When the user changes date in heliocentric view:
- Planets smoothly glide to their new heliocentric positions for that date (same as geocentric view animates between days)
- Orbital rings don't change (they represent mean orbits)

### Wheel Rotation/Drag
In heliocentric view, the user should still be able to rotate/tilt the solar system view with drag gestures. OrbitControls should work the same way.

### Earth Kp Aura
The Earth's Kp aura glow should follow Earth to its new position. It's a child of the Earth group, so this should happen automatically.

### Sun Corona
The Sun's flare corona should follow the Sun to the centre. Same logic — it's a child of the Sun group.

---

## 9. Heliocentric View Labels

In heliocentric view, update the planet labels (the small text next to each planet orb):

**Geocentric labels (existing):** `♂ 23°` (planet glyph + ecliptic degree)
**Heliocentric labels (new):** `♂ Mars` (planet glyph + name, no degree since ecliptic degrees don't apply in heliocentric view)

The label switch should happen during the transition — cross-fade between the two label styles.

Optionally, for planets that are close together (e.g., Venus and Mercury near the Sun), offset labels to prevent overlap. Use a simple collision detection:

```typescript
// After calculating all label positions, check for overlaps
// If two labels are within 2 scene units, offset the second one slightly
```

---

## 10. Accuracy Notes

**These positions must be astronomically accurate:**
- Planet angles around the Sun must match real heliocentric longitudes from astronomy-engine
- The relative distances must be correct (Mercury closest, Pluto furthest) even though the scale is compressed
- When the user swipes to a different date, positions must update correctly
- The Moon's position relative to Earth must use real lunar position data

**These elements are intentionally NOT accurate (for visual clarity):**
- Distance scaling uses square root compression, not linear
- Planet orb sizes do not represent real sizes (Jupiter would be a pixel)
- The Moon's orbital radius around Earth is exaggerated ~50× to be visible
- Orbital inclinations are flattened to 0° (everything on one plane)
- Orbital paths are shown as perfect circles at mean distance (real orbits are slightly elliptical)

This is fine. Every solar system visualisation makes these same choices.

---

## 11. Performance

- No new Three.js meshes are created during transition — all elements exist in both views, just repositioned
- Orbital ring geometries are created once in `useMemo`
- The transition lerping in `useFrame` is lightweight (just vector math per planet per frame)
- Nebula sprites (if immersive mode) stay in their background positions — they don't move
- Starfield stays fixed — it works as backdrop for both views
- After transition completes, `isTransitioning` is set to `false` and the `useFrame` transition logic stops running

---

## 12. Do NOT

- Do NOT restructure the existing geocentric wheel code — ADD heliocentric logic alongside it
- Do NOT remove or modify any existing planet data, calculations, or detail panels
- Do NOT change planet colours, sizes, or visual styling
- Do NOT add any new NOAA data fetching — this feature uses only astronomy-engine
- Do NOT make the orbital rings thick or bright — they must be barely visible
- Do NOT add realistic planet textures or surface detail — keep the current orb style
- Do NOT attempt to show realistic orbital eccentricity (ellipses) — circles are fine
- Do NOT add asteroid belts, comets, or any bodies not already in the app
- Do NOT break the existing loading animation sequence
- Do NOT touch the header, settings panel, starfield, or any non-wheel components

---

## 13. Testing Checklist

1. Run `npm run build` — fix ALL TypeScript errors
2. Test: default view loads as normal geocentric wheel — completely unchanged from before
3. Test: tap toggle → smooth transition to heliocentric view, all planets visible
4. Test: tap toggle again → smooth reverse transition back to geocentric wheel
5. Test: in heliocentric view, verify planet ordering from Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
6. Test: in heliocentric view, verify Moon is visibly orbiting near Earth
7. Test: in heliocentric view, tap a planet → detail panel opens correctly
8. Test: in heliocentric view, swipe to Yesterday → planets move to new positions smoothly
9. Test: in heliocentric view, Sun is at exact centre with its corona glow
10. Test: in heliocentric view, Earth has its Kp aura glow at its orbital position
11. Test: toggle between views rapidly 3 times → no glitches, no stuck states
12. Test: during transition animation, tap the toggle → nothing happens (disabled)
13. Test: verify orbital ring for Earth is at the correct relative distance
14. Test: on mobile (375px width) — all planets visible, toggle button accessible
15. Test: drag/rotate works in both views
16. Test: labels don't overlap badly in heliocentric view (especially inner planets)
17. Commit: `feat: heliocentric solar system view with cinematic transition toggle`
18. Push to `main`
