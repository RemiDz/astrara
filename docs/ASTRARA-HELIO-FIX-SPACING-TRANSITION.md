# ASTRARA — Fix Heliocentric View: Ring Spacing & Transition Phasing

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ Two Critical Problems to Fix

Read all current heliocentric view, transition, and zodiac badge source files before making changes.

---

## Problem 1: Planets Fly Off Screen

The AU-based distance scaling (sqrt or linear) causes outer planets to fly far outside the mobile viewport while inner planets crush together in the centre. This is unfixable with any continuous scaling on a phone screen.

### Fix: Fixed Evenly-Spaced Rings

REMOVE all AU-based distance scaling logic — no `sqrt(distanceAU)`, no `log(distanceAU)`, no `distanceAU * scaleFactor`. Replace with fixed ring radii in scene units that guarantee every planet fits on screen.

Use these exact radii:

```typescript
const HELIO_RING_RADII: Record<string, number> = {
  Sun:     0,      // centre
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

const MOON_ORBIT_OFFSET = 1.0  // Moon orbits 1.0 scene units from Earth
```

### Update Position Calculation

The heliocentric ANGLE for each planet is still calculated from `astronomy-engine` — this is the accurate part. Only the RADIUS (distance from Sun) uses the fixed values:

```typescript
function getHelioScenePosition(planetName: string, helioAngleDeg: number): { x: number; y: number; z: number } {
  const radius = HELIO_RING_RADII[planetName] ?? 10
  const angleRad = helioAngleDeg * (Math.PI / 180)

  return {
    x: radius * Math.cos(angleRad),
    y: radius * Math.sin(angleRad),
    z: 0,
  }
}

// Moon position — offset from Earth
function getMoonHelioScenePosition(
  earthPos: { x: number; y: number; z: number },
  moonAngleDeg: number
): { x: number; y: number; z: number } {
  const angleRad = moonAngleDeg * (Math.PI / 180)
  return {
    x: earthPos.x + MOON_ORBIT_OFFSET * Math.cos(angleRad),
    y: earthPos.y + MOON_ORBIT_OFFSET * Math.sin(angleRad),
    z: 0,
  }
}
```

### Camera Adjustment for Heliocentric View

Adjust the camera so that a circle of radius 19 (Pluto at 17 + padding) fits fully within the viewport:

- Either pull the camera back: increase camera Z position by ~40% compared to geocentric view
- Or increase FOV by ~10-15 degrees
- Choose whichever approach produces a better result where ALL planets from Sun to Pluto are visible on a 375px wide screen with comfortable padding around the edges
- Lerp the camera smoothly during the transition — do NOT snap it

### Orbital Ring Radii

Update the orbital path rings to match the fixed radii:

```typescript
const orbitRings = Object.entries(HELIO_RING_RADII)
  .filter(([name]) => name !== 'Sun')  // no ring for the Sun
  .map(([name, radius]) => ({ name, radius }))
```

Also add one small ring around Earth at `MOON_ORBIT_OFFSET` radius for the Moon's orbit.

---

## Problem 2: Zodiac Signs Still Visible During Solar System View

The transition is currently playing everything simultaneously — zodiac signs are still showing while planets move. The phases MUST be sequential.

### Corrected Transition Timeline: GEOCENTRIC → HELIOCENTRIC

**Phase 1 (0–800ms): Clear the stage**
- Zodiac sign badges: fade opacity from 1 → 0
- Zodiac degree labels on planets (e.g., "23°"): fade opacity from 1 → 0
- Aspect lines: fade opacity from 1 → 0
- Zodiac outer ring and 30° division markings: fade opacity from 1 → 0
- "Home" label on Earth: fade opacity from 1 → 0
- NO planet movement during this phase — everything stays in geocentric positions

**Phase 2 (800–3000ms): The Great Rearrangement**
- Sun moves from its ecliptic position to centre (0, 0, 0)
- Earth moves from centre to its orbital ring position
- All other planets glide from geocentric positions to heliocentric ring positions
- Moon moves to its position orbiting Earth
- Camera pulls back smoothly to fit the wider solar system view
- Use smoothstep easing for cinematic feel, not linear

**Phase 3 (2200–3200ms): Heliocentric elements appear**
- Orbital path rings fade in from opacity 0 to their target opacity
- Moon orbit ring around Earth fades in
- Planet labels switch from degree format ("♂ 23°") to name format ("♂ Mars")
- Sun label "☉ Sun" fades in at centre

### Implementation Approach

Use a single transition progress value (0 → 1) but map different elements to different ranges:

```typescript
const progress = useRef(0)  // 0 = geocentric, 1 = heliocentric

useFrame((_, delta) => {
  if (!isTransitioning) return

  const target = viewMode === 'heliocentric' ? 1 : 0
  progress.current += (target - progress.current) * delta * 1.2

  // Phase 1: Zodiac fadeout (progress 0.0 → 0.25)
  const zodiacOpacity = 1 - Math.min(progress.current / 0.25, 1)

  // Phase 2: Planet movement (progress 0.25 → 0.85)
  const moveT = Math.max(0, Math.min((progress.current - 0.25) / 0.6, 1))
  const smoothMoveT = moveT * moveT * (3 - 2 * moveT)  // smoothstep

  // Phase 3: Helio elements appear (progress 0.7 → 1.0)
  const helioElementsOpacity = Math.max(0, Math.min((progress.current - 0.7) / 0.3, 1))

  // Apply zodiacOpacity to all zodiac badges, labels, aspect lines, rings
  // Apply smoothMoveT to lerp planet positions: geo + (helio - geo) * smoothMoveT
  // Apply helioElementsOpacity to orbital rings, sun label, moon orbit ring

  // Check if done
  if (Math.abs(progress.current - target) < 0.005) {
    progress.current = target
    setIsTransitioning(false)
  }
})
```

### Reverse Transition: HELIOCENTRIC → GEOCENTRIC

Same phases in reverse order:
1. Heliocentric elements (orbital rings, labels) fade out first
2. Planets glide back to geocentric positions, camera returns
3. Zodiac signs, degree labels, aspect lines fade back in last

---

## Do NOT

- Do NOT use any AU-based continuous scaling — use the fixed ring radii ONLY
- Do NOT change planet angles — the heliocentric angles from astronomy-engine are correct
- Do NOT change anything about the geocentric wheel view — it must remain identical
- Do NOT start planet movement before zodiac elements have fully faded out
- Do NOT touch planet colours, sizes, tap targets, detail panels, Earth Kp aura, or Sun corona
- Do NOT change the starfield or nebula background

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: geocentric wheel loads normally — completely unchanged
3. Test: tap toggle → zodiac elements fade out FIRST, THEN planets move, THEN orbital rings appear
4. Test: in heliocentric view, ALL planets visible on 375px mobile screen — nothing off screen
5. Test: Pluto is the outermost visible planet with comfortable padding from screen edge
6. Test: inner planets (Mercury, Venus, Earth, Mars) have clear visual separation — not crushed together
7. Test: Moon is visibly orbiting near Earth, not overlapping Earth
8. Test: tap toggle back → smooth reverse transition, zodiac wheel returns perfectly
9. Test: tap a planet in heliocentric view → detail panel opens correctly
10. Test: swipe to Yesterday in heliocentric view → planets move to new angular positions
11. Commit: `fix: heliocentric view — fixed ring spacing and sequential transition phases`
12. Push to `main`
