# ASTRARA — Heliocentric Rebuild Step 3: Polish & Orbital Rings

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Steps 1 and 2 are complete. The app now has:
- Heliocentric data layer (`src/lib/heliocentric.ts`) with fixed ring radii
- Working toggle button that switches between geocentric and heliocentric views
- Smooth planet movement animation with phased transitions
- Zodiac elements fade out before planets move
- Camera pulls back for heliocentric view

This step adds visual polish: orbital path rings, Moon orbit ring, label refinements, and content updates. Read all current wheel and heliocentric-related source files before making changes.

**CRITICAL: Do NOT change any transition timing, planet positions, or toggle logic from Step 2. Only ADD visual elements and polish.**

---

## 1. Orbital Path Rings

Add faint circular rings showing each planet's orbital path around the Sun. These ONLY appear in heliocentric view.

### Create Orbital Ring Component

```typescript
import { HELIO_RING_RADII } from '@/lib/heliocentric'

interface OrbitalRingsProps {
  helioOpacity: number  // from phase 3 of transition (0–1)
}

function OrbitalRings({ helioOpacity }: OrbitalRingsProps) {
  if (helioOpacity < 0.01) return null

  const rings = Object.entries(HELIO_RING_RADII)
    .filter(([name]) => name !== 'Sun')  // no ring at centre

  return (
    <group>
      {rings.map(([name, radius]) => (
        <mesh key={name} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={getOrbitalRingOpacity(name) * helioOpacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function getOrbitalRingOpacity(planetName: string): number {
  // Inner planets slightly more visible (closer together, need distinction)
  switch (planetName) {
    case 'Mercury': return 0.08
    case 'Venus':   return 0.08
    case 'Earth':   return 0.10  // slightly brighter — it's home
    case 'Mars':    return 0.08
    case 'Jupiter': return 0.06
    case 'Saturn':  return 0.06
    case 'Uranus':  return 0.05
    case 'Neptune': return 0.05
    case 'Pluto':   return 0.04
    default:        return 0.05
  }
}
```

### Ring Geometry Orientation

The rings must lie flat on the same plane as the planets. If the wheel scene uses X-Y as the planet plane:
- `rotation={[Math.PI / 2, 0, 0]}` rotates the ring from X-Z to X-Y plane
- Check which plane the planets actually move on and match the ring rotation accordingly
- TEST: each ring should pass through its planet's position — if it doesn't, the rotation is wrong

### Placement

Add `<OrbitalRings>` inside the same Three.js group as the planets, BEHIND them in render order:

```tsx
<group>
  <OrbitalRings helioOpacity={phaseValues.current.helioOpacity} />
  {/* ...existing planet meshes... */}
</group>
```

Set `renderOrder={-1}` on the ring materials if they appear in front of planets.

---

## 2. Moon Orbit Ring Around Earth

Add a small faint ring around Earth showing the Moon's orbital path. This only appears in heliocentric view.

```typescript
function MoonOrbitRing({ 
  earthPosition, 
  helioOpacity 
}: { 
  earthPosition: { x: number; y: number; z: number }
  helioOpacity: number 
}) {
  if (helioOpacity < 0.01) return null

  const MOON_ORBIT_RADIUS = 1.0  // matches MOON_ORBIT_OFFSET from heliocentric.ts

  return (
    <group position={[earthPosition.x, earthPosition.y, earthPosition.z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[MOON_ORBIT_RADIUS - 0.015, MOON_ORBIT_RADIUS + 0.015, 64]} />
        <meshBasicMaterial
          color="#C8C4DC"  // moonsilver colour from the ecosystem palette
          transparent
          opacity={0.12 * helioOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
```

**IMPORTANT:** The Moon orbit ring must be positioned at Earth's CURRENT interpolated position (not its geocentric or heliocentric position). This means it follows Earth during the transition animation. Get the Earth group's current position from its ref or from the interpolated position calculated in Step 2.

---

## 3. Label Collision Avoidance for Inner Planets

In heliocentric view, inner planets (Mercury, Venus, Earth, Mars) can have overlapping labels since they're relatively close together. Add simple offset logic:

```typescript
function getHelioLabelOffset(planetName: string, allPositions: Record<string, { x: number; y: number }>): { x: number; y: number } {
  // Default: label below and slightly right of the planet
  const defaultOffset = { x: 0.3, y: -0.5 }

  // Check if any nearby planet's label would overlap
  const myPos = allPositions[planetName]
  if (!myPos) return defaultOffset

  const nearbyPlanets = Object.entries(allPositions)
    .filter(([name]) => name !== planetName && name !== 'Sun')
    .filter(([_, pos]) => {
      const dist = Math.sqrt((pos.x - myPos.x) ** 2 + (pos.y - myPos.y) ** 2)
      return dist < 3.0  // within 3 scene units
    })

  if (nearbyPlanets.length === 0) return defaultOffset

  // If there are nearby planets, alternate label positions:
  // Place label on the OPPOSITE side from the nearest planet
  const nearest = nearbyPlanets.sort(([_, a], [__, b]) => {
    const dA = Math.sqrt((a.x - myPos.x) ** 2 + (a.y - myPos.y) ** 2)
    const dB = Math.sqrt((b.x - myPos.x) ** 2 + (b.y - myPos.y) ** 2)
    return dA - dB
  })[0]

  const nearPos = nearest[1]
  const dx = myPos.x - nearPos.x
  const dy = myPos.y - nearPos.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  // Push label away from nearest planet
  return {
    x: (dx / dist) * 0.6,
    y: (dy / dist) * 0.6,
  }
}
```

Apply this offset to the `<Html>` label position in heliocentric view only. In geocentric view, keep existing label positions unchanged.

This doesn't need to be perfect — just prevent the worst overlaps. If labels still overlap slightly for clustered planets, that's acceptable.

---

## 4. Planet Label Refinements

### Geocentric Labels (existing — do not change)
Format: `♂ 23°` (glyph + ecliptic degree)

### Heliocentric Labels (new)
Format: `♂ Mars` (glyph + planet name)

### Label Transition
The label text should cross-fade cleanly during the transition. Two approaches (choose the simpler one for the current code):

**Approach A — Single element, swap text:**
```typescript
const isHelio = phaseValues.current.smoothMoveT > 0.5
const labelText = isHelio ? `${glyph} ${name}` : `${glyph} ${degree}°`
```

**Approach B — Two overlapping elements, cross-fade:**
```typescript
<Html center>
  <div className="relative">
    <span style={{ opacity: zodiacOpacity, position: 'absolute' }}>
      {glyph} {degree}°
    </span>
    <span style={{ opacity: helioOpacity }}>
      {glyph} {name}
    </span>
  </div>
</Html>
```

Approach A is simpler and recommended unless it causes visual jarring.

### Label Styling in Heliocentric View
- Same font size and colour as geocentric labels
- White text with subtle text shadow for readability against starfield
- `text-shadow: 0 0 8px rgba(0,0,0,0.8)` to ensure legibility over orbital rings

---

## 5. Earth Kp Aura in Heliocentric View

Verify that the Earth Kp aura glow:
- Follows Earth to its orbital position during transition (it should, if it's a child of the Earth group)
- Is still visible and correct at the orbital position
- Does NOT interfere with the Moon orbit ring

If the aura clips or looks wrong at the new position, adjust its scale. It may need to be slightly smaller in heliocentric view since Earth is a less prominent element:

```typescript
const auraScale = viewMode === 'heliocentric' ? 0.8 : 1.0
// Lerp during transition
```

---

## 6. Sun Corona in Heliocentric View

Verify that the Sun corona glow:
- Follows the Sun to the centre position during transition
- Looks correct at the centre of the solar system
- Does NOT overlap or obscure nearby inner planet rings

The Sun corona should feel natural at the centre — it's the star, it should glow. If the corona is too large and overlaps Mercury's orbit ring, reduce its outer radius slightly in heliocentric view.

---

## 7. Starfield & Nebulae

Verify the starfield and nebulae (if immersive mode is on):
- Remain as a fixed backdrop in BOTH views — they do NOT move during transition
- Are still visible behind the solar system view (the camera pullback might reveal more of them)
- No changes needed — just verify nothing is broken

---

## 8. Remove Temporary Console.log

Find and remove the temporary `console.log('Heliocentric data test:', ...)` that was added in Step 1. It was only for verification.

---

## 9. Update the About/Info Page

Add a new section to the About/Info modal, AFTER the Astro Wheel section:

### New Section Content

**Heading:** ✦ Solar System View

**Text:**
```
Tap the toggle button below the wheel to transform the astro wheel into a live solar system map. The Sun moves to the centre and every planet takes its real angular position in orbit around it.

The angles are astronomically accurate — each planet is placed at its true heliocentric longitude, calculated using the same astronomical library that powers the wheel. The orbital ring spacing is simplified for your screen, but the angular relationships between planets are real.

The Moon is shown orbiting Earth at an exaggerated distance so you can see it clearly. In reality, the Moon's orbit is far too small to see at solar system scale.

Tap the button again to return to the astro wheel view, where Earth returns to the centre and the zodiac signs reappear.
```

---

## 10. Internationalisation

Add all new strings to both English and Lithuanian translation files (if i18n system exists):

**English:**
- "Solar System View"
- "Astro Wheel View"
- "☉ Sun" (label at centre in helio view)

**Lithuanian:**
- "Saulės sistemos vaizdas"
- "Astro rato vaizdas"
- "☉ Saulė"

---

## 11. Do NOT

- Do NOT change transition timing, phases, or progress logic from Step 2
- Do NOT change planet positions or ring radii from the heliocentric data layer
- Do NOT change the toggle button behaviour or placement
- Do NOT change the camera adjustment logic
- Do NOT make orbital rings bright or thick — they must be barely visible
- Do NOT add any new planets, asteroids, or bodies
- Do NOT add realistic orbital eccentricity (ellipses) — circles are correct
- Do NOT touch the header, settings panel, or any non-wheel components
- Do NOT add shooting stars, comets, or decorative animations

---

## Build & Deploy

1. Run `npm run build` — fix ALL TypeScript errors
2. Test: geocentric wheel loads normally — completely unchanged
3. Test: toggle to heliocentric → orbital path rings fade in as planets settle
4. Test: orbital rings are faint circles, each passing through its planet
5. Test: Moon orbit ring visible around Earth in heliocentric view
6. Test: Moon is positioned on its orbit ring near Earth
7. Test: inner planet labels (Mercury, Venus, Earth, Mars) don't badly overlap
8. Test: labels show planet names in heliocentric view ("♂ Mars")
9. Test: labels show degrees in geocentric view ("♂ 23°")
10. Test: toggle back to geocentric → orbital rings fade out, zodiac returns
11. Test: Earth Kp aura visible at Earth's orbital position
12. Test: Sun corona visible at centre in heliocentric view, not overlapping Mercury ring
13. Test: starfield/nebulae visible behind solar system
14. Test: console.log verification message is REMOVED
15. Test: About/Info page shows new Solar System View section
16. Test: on 375px mobile — everything visible, nothing clipped
17. Commit: `feat: heliocentric polish — orbital rings, moon orbit, label refinement`
18. Push to `main`
