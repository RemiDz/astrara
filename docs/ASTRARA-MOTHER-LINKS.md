# ASTRARA — Mother Shape: Animated Energy Links to Key Planets

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This ADDS animated connections from the Crystalline Core (mother shape) down to key planets on the wheel. All existing features must continue working. Do NOT modify the mother shape's geometry, rotation, heartbeat wave, or any other existing behaviour.

---

## Concept

The mother shape actively communicates with the most significant planets on the wheel through **curved animated energy links**. These are graceful arcs flowing from the mother shape downward to specific planets, with animated dashes travelling along the curve — showing the user at a glance which celestial bodies are most influential right now.

This is NOT connecting to all 10 planets. Maximum **2-3 connections** at any time — only the most significant ones. Clean, not cluttered.

---

## Which Planets to Connect

Use the existing `getKeyPlanet()` function (from the Cosmic Pulse spec) plus the aspect data to determine connections:

### Connection 1 (always present): Key Player
- The single most significant planet today (ingress > retrograde station > tightest aspect participant > Moon)
- This is the PRIMARY connection — brightest and most visible

### Connections 2-3 (conditional): Tightest Aspect Pair
- If there is a notable aspect today with orb < 3°, connect to BOTH planets in that aspect
- This shows the user the most active planetary conversation
- If the Key Player is already one of the aspect pair planets, you'll have 2 connections total (not 3)
- If there are no tight aspects, only the Key Player connection shows (1 connection)
- Maximum 3 connections ever visible at once

---

## The Curved Arc

Each connection is a **3D Quadratic Bézier curve** from the mother shape position down to the planet's position on the wheel.

### Curve Construction

```typescript
const start = motherShapePosition;  // [0, 1.6, 0] (or current Y)
const end = planetWorldPosition;    // the planet's 3D position on the wheel

// Control point: halfway between, but offset OUTWARD from centre
// This creates a graceful outward arc, not a straight drop
const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

// Offset the control point outward from the wheel centre (away from Y axis)
// This makes each arc curve outward gracefully
const outwardDirection = new THREE.Vector3(end.x, 0, end.z).normalize();
const controlPoint = midpoint.clone();
controlPoint.add(outwardDirection.multiplyScalar(0.3));
controlPoint.y = (start.y + end.y) / 2 + 0.2;  // lift slightly above midpoint
```

Sample the curve at **48 points** using `curve.getPoints(48)`.

### Dashed Animated Material

Use `THREE.LineDashedMaterial`:

```
LineDashedMaterial({
  color: planetColor,       // the planet's existing colour from the wheel
  transparent: true,
  opacity: connectionOpacity,  // varies by connection type (see below)
  dashSize: 0.04,
  gapSize: 0.03,
  blending: THREE.AdditiveBlending,
})
```

**CRITICAL**: After creating the `BufferGeometry` from curve points, you MUST call `geometry.computeLineDistances()` or the dashes will NOT render. This is a Three.js requirement for `LineDashedMaterial`.

### Dash Animation (Energy Flow)

In `useFrame`, animate the `dashOffset` to create flowing energy:

```typescript
material.dashOffset -= delta * 0.4;  // dashes flow from mother shape toward planet
```

This makes the dashes appear to travel along the curve downward — energy flowing from the cosmic intelligence into the planet. The speed should feel smooth and steady, not frantic.

### Opacity by Connection Type

- **Key Player connection**: `opacity: 0.25` — clearly visible but still ethereal
- **Aspect pair connections**: `opacity: 0.15` — fainter, secondary importance
- All connections pulse gently: `opacity * (0.8 + 0.2 * Math.sin(time * 1.5 + index))`

---

## Connection Lifecycle Animation

### When connections appear (page load or day change):

1. The arc draws itself in over 1 second: use `geometry.setDrawRange(0, count)` where `count` animates from 0 to 48
2. Simultaneously fade opacity from 0 to target value
3. Stagger multiple connections by 300ms each — Key Player first, then aspect pair

### When connections change (day navigation):

1. Old connections fade out over 600ms (opacity → 0)
2. Brief pause (200ms)
3. New connections draw in over 1 second (same draw-in animation)
4. The transition should feel like the mother shape is shifting its attention — releasing one planet and reaching for another

### When connections are active:

- Continuous dash flow animation
- Gentle opacity pulse
- The curve endpoint should track the planet's position in case the wheel is rotating — update the end position and rebuild the curve in `useFrame` if the planet has moved (but only rebuild geometry every ~10 frames for performance, not every frame)

---

## Interaction with Planet Glow

When a connection is active to a planet, that planet should have a very subtle additional glow or brightness boost to make it visually stand out on the wheel:

- Add `+0.3` to the planet's `emissiveIntensity` (or equivalent brightness property) when it's connected
- This makes the connected planets slightly brighter than unconnected ones — another intuitive visual hint
- Fade the brightness boost in/out with the connection lifecycle

Check how planet orbs are rendered in `AstroWheel3D.tsx` — find the mesh material for planet spheres and add a conditional emissive boost when that planet is in the active connections list.

---

## Visual Consistency with Aspect Beams

The Cosmic Reading already has `AspectBeam` components (curved dashed arcs between planets during reading phases). The mother shape connections should use a SIMILAR but DISTINCT visual style:

- **Similar**: curved Bézier, dashed, animated flow
- **Distinct**: thinner lines, lower opacity, additive blending (aspect beams are likely more opaque). The mother shape connections should feel like whispered threads of light, while aspect beams during reading are more dramatic

If the mother shape connections visually clash with AspectBeams during Cosmic Reading, reduce connection opacity to 50% during reading (same as the mother shape itself dims to 40%).

---

## Zodiac Badge Connection (optional enhancement)

If the Key Player planet is in a specific zodiac sign, and one of the aspect pair planets is in another sign, the corresponding zodiac sign badges on the wheel could also get a very subtle glow or border brightness. This creates a complete visual story: mother shape → arc → planet → zodiac sign. Only implement this if it doesn't add visual noise.

---

## Performance

- Maximum 3 Bézier curves with 48 points each = 144 vertices total — trivial
- `dashOffset` animation is a single float update per connection per frame
- Geometry rebuild for tracking rotating planets: throttle to every 10 frames
- When connections = 0 (no key planet somehow), render nothing
- When mother shape is toggled off in settings, connections are also unmounted

---

## Build Steps

1. Read how planet 3D positions are accessed in the wheel (the world positions of planet orb meshes)
2. Read the existing `getKeyPlanet()` function (or create it if not yet implemented from the Cosmic Pulse spec)
3. Read `notableAspects` from `useAstroData` to find the tightest aspect pair
4. Create an `EnergyLink` component: Bézier curve + dashed material + dash flow animation + draw-in/fade lifecycle
5. Create connection management logic in `CrystallineCore.tsx`: determine which planets to connect, manage lifecycle on day changes
6. Render 1-3 `EnergyLink` instances from the mother shape to the active planets
7. Add subtle emissive boost to connected planet orbs
8. Handle draw-in animation on appearance, fade-out on disconnection
9. Handle Cosmic Reading dimming (50% opacity on connections when reading is active)
10. Test: mother shape shows 1-3 curved arcs flowing to specific planets
11. Test: dashes animate along the curves (energy flowing downward)
12. Test: connected planets glow slightly brighter
13. Test: navigate days → old connections fade, new ones draw in
14. Test: only Key Player + tightest aspect pair are connected (not all 10 planets)
15. Test: during Cosmic Reading → connections dim to 50%
16. Test: mother shape toggled off → connections also disappear
17. Test: mobile 375px → connections visible and not cluttering the view
18. Test: ALL other features still work
19. Run `npm run build` — no errors
20. **UPDATE `engine/ARCHITECTURE.md`** — document the energy link system, connection logic, and lifecycle animations
21. Commit: `feat: mother shape animated energy links to key planets`
22. Push to **main** branch using `git push origin master:main`
