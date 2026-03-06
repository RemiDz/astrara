# ASTRARA — Restore Sacred Geometry Planet Polygon

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## What to Add

The planet polygon and radial lines were accidentally removed. Restore them. This is NOT the old aspect lines system (which connected specific planet PAIRS based on angular aspects like trines and sextiles — that created star/hexagram shapes). This is a DIFFERENT system.

Read all current wheel source files before making changes.

---

## 1. Planet Polygon — Sequential Connection

Sort ALL planets by their ecliptic longitude (0°–360°) and connect them in order with a single continuous closed shape. This creates an irregular polygon that changes shape daily — never a star or hexagram.

```typescript
// Get all planet positions, sort by ecliptic longitude
const sortedPlanets = [...allPlanets].sort((a, b) => a.longitude - b.longitude)

// Draw a closed polygon connecting them in longitude order:
// Planet at 3° → Planet at 15° → Planet at 23° → ... → back to first
```

### Polygon Outline

Draw a single closed line connecting all planets sequentially:

- `LineBasicMaterial` with `color: '#ffffff'`, `transparent: true`, `opacity: 0.12`
- `depthWrite: false`
- Updates every frame to follow planet positions (reads from planet refs or position data)
- Close the shape: last planet connects back to first planet

### Polygon Fill

Add a very subtle filled interior:

- `ShapeGeometry` from the polygon vertices
- `MeshBasicMaterial` with `color: '#8B5CF6'` (soft purple), `opacity: 0.03`
- `side: THREE.DoubleSide`, `depthWrite: false`
- Only recreate geometry when positions actually change (use position hash to detect changes)

---

## 2. Radial Lines — Planet to Earth

Draw faint lines from EACH planet to the Earth at the centre. These show each planet's energetic connection to Earth:

- One line per planet (10 lines total: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
- Each line uses that planet's accent colour at very low opacity (0.06)
- `LineBasicMaterial`, `transparent: true`, `depthWrite: false`
- Lines go from the planet's current position to Earth's position (centre of wheel)

---

## 3. Gentle Breathing Animation

The polygon outline should gently pulse:

```typescript
// In useFrame:
const pulse = Math.sin(clock.elapsedTime * 0.3 * Math.PI * 2) * 0.5 + 0.5
material.opacity = (0.12 + pulse * 0.06) * zodiacOpacity
// Oscillates between 0.12 and 0.18 opacity — very subtle
```

---

## 4. Visibility Rules

- The polygon and radial lines are ONLY visible in geocentric (astro wheel) view
- They fade out with `zodiacOpacity` during the heliocentric transition
- They fade back in when returning to geocentric view

---

## 5. Why This Never Creates a Star Shape

The old aspect lines connected SPECIFIC planet pairs (e.g., every planet 120° apart), which naturally formed triangles and hexagrams. 

This new polygon connects ALL planets in SEQUENTIAL longitude order. With 10 planets at irregular positions, this always creates an asymmetric 10-sided shape. It is geometrically impossible for this to form a regular star or hexagram because:
- It connects 10 points, not 6
- The points are at irregular angles
- The connection order follows longitude, not angular relationships

---

## Do NOT

- Do NOT recreate the old aspect line system (connecting pairs based on trine/sextile/square/opposition)
- Do NOT connect planets in any order other than sequential ecliptic longitude
- Do NOT make the polygon or radial lines bright — they must be subtle
- Do NOT change any other wheel elements

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: a closed polygon connects all planets in ecliptic order — irregular organic shape
3. Test: faint coloured radial lines connect each planet to Earth
4. Test: polygon gently pulses/breathes
5. Test: the shape is clearly NOT a star or hexagram — it's an irregular polygon
6. Test: polygon fades out in heliocentric view
7. Test: polygon fades back in when returning to geocentric view
8. Test: change date → polygon shape changes as planets shift
9. Commit: `feat: restore sacred geometry planet polygon and radial lines`
10. Push to `main`
