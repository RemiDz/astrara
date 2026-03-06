# ASTRARA — Sacred Geometry: Planet Polygon Replacing Aspect Lines

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## What to Do

Remove the current aspect lines (the individual lines connecting planets that form star/hexagram shapes). Replace them with a single unified polygon that connects ALL planets sequentially by their ecliptic position around the wheel. This creates a unique sacred geometry shape that changes every day.

Read all current aspect line, planet position, and wheel source files before making changes.

---

## Step 1: Remove Existing Aspect Lines

Find and DELETE all aspect line rendering code. This includes:
- The aspect line meshes/geometries (lines connecting planet pairs)
- Any aspect calculation logic that determines which planets are in aspect (trine, sextile, square, opposition)
- Any aspect line materials, colours, or opacity settings

Keep the aspect DATA if it's used in detail panels (the interpretive text about aspects) — only remove the VISUAL lines on the wheel.

---

## Step 2: Create the Planet Polygon

### Sort Planets by Ecliptic Longitude

Take all planets currently on the wheel (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) and sort them by their ecliptic longitude (0°–360°):

```typescript
interface PlanetPoint {
  name: string
  longitude: number  // ecliptic longitude in degrees
  position: { x: number; y: number; z: number }  // current 3D scene position
  colour: string  // planet's accent colour
}

// Sort planets by ecliptic longitude to connect them sequentially
const sortedPlanets = [...allPlanets].sort((a, b) => a.longitude - b.longitude)
```

### Draw a Closed Polygon

Connect the sorted planets in order with a single continuous closed shape:

```typescript
function PlanetPolygon({ 
  planets, 
  zodiacOpacity  // polygon visible in geocentric view, fades with zodiac
}: { 
  planets: PlanetPoint[]
  zodiacOpacity: number 
}) {
  const lineRef = useRef<THREE.Line>(null)

  useFrame(() => {
    if (!lineRef.current || planets.length < 3) return

    const positions = new Float32Array((planets.length + 1) * 3)

    for (let i = 0; i < planets.length; i++) {
      positions[i * 3] = planets[i].position.x
      positions[i * 3 + 1] = planets[i].position.y
      positions[i * 3 + 2] = planets[i].position.z
    }

    // Close the polygon — connect last planet back to first
    positions[planets.length * 3] = planets[0].position.x
    positions[planets.length * 3 + 1] = planets[0].position.y
    positions[planets.length * 3 + 2] = planets[0].position.z

    const geom = lineRef.current.geometry
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.attributes.position.needsUpdate = true
  })

  if (planets.length < 3) return null

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={planets.length + 1}
          array={new Float32Array((planets.length + 1) * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.12 * zodiacOpacity}
        depthWrite={false}
      />
    </line>
  )
}
```

---

## Step 3: Add a Filled Semi-Transparent Interior

The polygon should have a subtle filled interior — not just an outline. This creates the sacred geometry "shape" feel:

```typescript
function PlanetPolygonFill({
  planets,
  zodiacOpacity
}: {
  planets: PlanetPoint[]
  zodiacOpacity: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current || planets.length < 3) return

    // Create shape from planet positions (2D projection for fill)
    const shape = new THREE.Shape()
    shape.moveTo(planets[0].position.x, planets[0].position.y)
    for (let i = 1; i < planets.length; i++) {
      shape.lineTo(planets[i].position.x, planets[i].position.y)
    }
    shape.closePath()

    // Replace geometry
    const newGeom = new THREE.ShapeGeometry(shape)
    meshRef.current.geometry.dispose()
    meshRef.current.geometry = newGeom
  })

  if (planets.length < 3) return null

  return (
    <mesh ref={meshRef}>
      <shapeGeometry />
      <meshBasicMaterial
        color="#8B5CF6"
        transparent
        opacity={0.03 * zodiacOpacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
```

The fill colour `#8B5CF6` (soft purple) is very subtle at 3% opacity — just enough to give the shape presence without obscuring anything. Adjust if needed.

---

## Step 4: Add Glow Lines from Each Vertex to Earth Centre

Draw faint radial lines from each polygon vertex (planet) to the Earth at the centre. These create a "web of connection" radiating inward:

```typescript
function RadialLines({
  planets,
  earthPosition,
  zodiacOpacity
}: {
  planets: PlanetPoint[]
  earthPosition: { x: number; y: number; z: number }
  zodiacOpacity: number
}) {
  return (
    <group>
      {planets.map((planet, i) => {
        const positions = new Float32Array([
          earthPosition.x, earthPosition.y, earthPosition.z,
          planet.position.x, planet.position.y, planet.position.z,
        ])

        return (
          <line key={planet.name}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={positions}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={planet.colour}
              transparent
              opacity={0.06 * zodiacOpacity}
              depthWrite={false}
            />
          </line>
        )
      })}
    </group>
  )
}
```

Each radial line uses the planet's own accent colour at very low opacity (6%) — creating a subtle coloured web that hints at each planet's energetic connection to Earth.

---

## Step 5: Subtle Pulse Synchronized to Soundscape

If the app's soundscape/drone frequency is accessible as a value, make the polygon's outline opacity gently pulse in sync:

```typescript
useFrame(({ clock }) => {
  if (!lineRef.current) return
  
  // Get the current drone frequency from app state/context
  // If not accessible, use a default gentle pulse at ~0.3Hz
  const pulseFreq = droneFrequency ? droneFrequency / 1000 : 0.3
  
  const pulse = Math.sin(clock.elapsedTime * pulseFreq * Math.PI * 2) * 0.5 + 0.5
  const baseOpacity = 0.12
  const material = lineRef.current.material as THREE.LineBasicMaterial
  material.opacity = (baseOpacity + pulse * 0.06) * zodiacOpacity
  // Oscillates between 0.12 and 0.18 — very subtle breathing
})
```

If accessing the drone frequency is too complex, just use a fixed gentle breathing at 0.2Hz (5 second cycle). The key is the polygon feels ALIVE, not static.

---

## Step 6: Update Positions on Date Change

The polygon must update when:
- The user swipes to Yesterday/Tomorrow
- Planets are in different ecliptic positions on different dates
- The polygon shape changes accordingly

Since the polygon reads planet positions from the scene (via planet refs or position data), this should happen automatically as planets move. Verify it works during day transitions.

---

## Step 7: Behaviour in Heliocentric View

In heliocentric (solar system) view, the polygon should FADE OUT along with other geocentric elements (Phase 1 of the transition, with `zodiacOpacity`). The sacred geometry polygon is a geocentric concept — it represents the planetary pattern as seen from Earth.

In heliocentric view, the orbital rings serve as the geometric visual instead.

---

## Step 8: Performance

- The polygon is just one `<line>` with ~11 vertices — negligible
- The filled shape is one `ShapeGeometry` — lightweight
- The radial lines are 10 simple two-vertex lines — negligible
- Geometry recreation in `useFrame` for the fill: creating a new `ShapeGeometry` every frame is wasteful. Instead, only recreate when planet positions have meaningfully changed:

```typescript
const lastPositionHash = useRef('')

useFrame(() => {
  // Create a simple hash of positions to detect changes
  const hash = planets.map(p => `${p.position.x.toFixed(2)},${p.position.y.toFixed(2)}`).join('|')
  
  if (hash === lastPositionHash.current) return  // no change, skip
  lastPositionHash.current = hash
  
  // Recreate shape geometry only when positions changed
  // ... shape creation code ...
})
```

This means the fill shape only updates when planets actually move (date change) — not every frame.

---

## Do NOT

- Do NOT keep any of the old aspect lines — remove them completely from the visual
- Do NOT remove aspect DATA used in detail panels (the interpretive text) — only the visual lines
- Do NOT make the polygon bright or attention-grabbing — it should be subtle sacred geometry
- Do NOT add the polygon in heliocentric view — geocentric only
- Do NOT change planet positions, sizes, colours, or any other visual elements
- Do NOT change the wheel rotation, zodiac signs, or loading animation

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: NO more individual aspect lines connecting planet pairs — completely gone
3. Test: a single closed polygon connects all planets sequentially by ecliptic longitude
4. Test: polygon has a very subtle purple filled interior
5. Test: faint radial lines connect each planet to Earth at centre
6. Test: polygon gently pulses/breathes — not static
7. Test: change date → polygon shape changes as planets shift positions
8. Test: polygon fades out during heliocentric transition (with zodiac elements)
9. Test: polygon fades back in when returning to geocentric view
10. Test: no hexagram or religious star shapes — just an organic asymmetric polygon
11. Test: on mobile — polygon doesn't interfere with planet taps
12. Commit: `feat: sacred geometry planet polygon replacing aspect lines`
13. Push to `main`
