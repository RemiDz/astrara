# ASTRARA v2 — Iteration 3: Wheel Visual Overhaul + Tap Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

The 3D astro wheel is rendering but has four critical problems:
1. The wheel disc looks flat and cheap — simple colour stripes with no cinematic depth
2. The wheel overflows the screen / doesn't fit the viewport properly
3. Planet tap/click interaction is unreliable — takes many attempts to register
4. Planets are too small and hard to identify

Read all current source files before making changes. This iteration is ONLY about the wheel — don't touch anything else.

---

## Problem 1: Wheel Disc Has No Cinematic Character

The zodiac ring currently looks like flat coloured stripes on a disc. It needs to feel like a **mystical celestial instrument carved from light and glass** — something that belongs in a sci-fi film or an ancient observatory.

### Design Direction: Luminous Astrolabe

Think of it as a blend between:
- An antique brass astrolabe — precision rings, engraved markers, layered depth
- A holographic HUD — translucent, glowing edges, light leaking through
- The time-turner from Harry Potter — nested rings, ethereal shimmer

### Visual Upgrades to Apply

**A. Ring Material — Glass, Not Plastic**

Replace any basic `MeshStandardMaterial` or `MeshBasicMaterial` on the zodiac ring with a material that has depth:

```tsx
<meshPhysicalMaterial
  color="#1a1a2e"
  transparent
  opacity={0.3}
  roughness={0.1}
  metalness={0.8}
  clearcoat={1.0}
  clearcoatRoughness={0.1}
  envMapIntensity={0.5}
  side={THREE.DoubleSide}
/>
```

This creates a dark, glassy, semi-transparent ring that catches light beautifully. The zodiac segments should be differentiated NOT by filling the entire segment with colour, but by:
- A thin **glowing edge line** at each segment boundary (emissive line geometry)
- A subtle **gradient wash** of the element colour at ~8-12% opacity within each segment
- The element colour concentrated as a **glow at the outer edge** of each segment, fading inward

**B. Multiple Concentric Rings (Layered Depth)**

Instead of a single ring, create 3 nested rings to give the wheel depth and complexity:

```
Ring 1 (outermost, radius ~2.2): 
  - Zodiac sign glyphs and names
  - Thinnest ring (width ~0.15)
  - Most transparent (opacity 0.15)
  - Slow counter-rotation (opposite to main rotation) for parallax depth feel

Ring 2 (middle, radius ~1.9):
  - Degree markers (tick marks every 10° or 30°)
  - Element colour tinting per segment
  - Medium opacity (0.25)
  - Rotates with the main wheel

Ring 3 (innermost, radius ~1.6):
  - Planet orbital track — where planet orbs sit
  - Very subtle ring, almost just a thin glowing line
  - Opacity 0.1
  - Rotates with the main wheel
```

The layered rings with slightly different behaviours create visual richness and parallax depth.

**C. Glowing Edge Lines**

Every ring edge and segment divider should have a subtle glow:

```tsx
// Create a ring edge using a torus geometry with tiny tube radius
<mesh>
  <torusGeometry args={[2.2, 0.005, 8, 128]} />
  <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
</mesh>
```

Add similar thin torus lines at:
- Outer edge of Ring 1
- Inner edge of Ring 1 / Outer edge of Ring 2
- Inner edge of Ring 2 / Outer edge of Ring 3
- Inner edge of Ring 3
- Each 30° segment boundary (as thin line geometries from inner to outer radius)

The segment divider lines should be very subtle (opacity 0.1-0.15), creating structure without heaviness.

**D. Runic / Sacred Geometry Accent**

Add one more visual layer: a very subtle sacred geometry pattern at the centre of the wheel — a Metatron's cube, flower of life, or simple geometric mandala rendered as thin lines at ~5% opacity. This sits behind the planets but in front of the centre glow. It slowly rotates opposite to the main wheel direction. This adds the mystical character and visual depth without being distracting.

Implementation: create this as a simple set of `<Line>` geometries forming a geometric pattern, all at very low opacity.

**E. Ambient Particle Dust**

Add ~100 tiny particle dots floating slowly within the wheel's plane (between the inner ring and the centre). These are like luminous dust motes caught in the wheel's energy field. Very small (0.01 radius), very dim (opacity 0.1-0.2), drifting slowly in circular paths. This makes the wheel feel alive and three-dimensional.

**F. Outer Glow Halo**

Add a soft glow halo around the entire wheel — a large, very transparent circle/sprite behind everything:

```tsx
<sprite scale={[6, 6, 1]} position={[0, 0, -0.5]}>
  <spriteMaterial
    map={radialGradientTexture}  // create a radial gradient texture: white centre → transparent edge
    transparent
    opacity={0.06}
    blending={THREE.AdditiveBlending}
  />
</sprite>
```

This creates the subtle "this object is radiating energy" effect.

---

## Problem 2: Wheel Doesn't Fit the Screen

### Fix the Canvas Container

The wheel must fit comfortably within the mobile viewport with breathing room on all sides.

```tsx
// The canvas container
<div 
  className="relative w-full mx-auto"
  style={{ 
    height: 'min(80vw, 420px)',  // responsive: 80% of viewport width, max 420px
    maxWidth: 'min(80vw, 420px)', // keep it square
    touchAction: 'none',
  }}
>
  <Canvas
    camera={{ 
      position: [0, 0, 6],  // pull camera back enough to see full wheel
      fov: 40,               // narrower FOV = less distortion at edges
      near: 0.1,
      far: 100,
    }}
    gl={{ alpha: true, antialias: true }}
    style={{ background: 'transparent' }}
  >
    ...
  </Canvas>
</div>
```

### Camera Adjustments

- **Pull the camera back** — if the wheel clips the viewport, increase the z-position (try 6, 7, or 8)
- **Reduce FOV** — a narrower field of view (35-45°) reduces perspective distortion and makes the wheel appear more flat and readable, which is what you want for an information display
- **Test at 375px width** — the wheel must fit with at least 10% padding (breathing room) on each side
- The tilt angle of the wheel should be gentle — no more than 10-15° from face-on. Too much tilt makes the far side unreadable on mobile. Adjust `minPolarAngle` and `maxPolarAngle` in OrbitControls to keep the viewer roughly face-on:

```tsx
<OrbitControls
  minPolarAngle={Math.PI / 2.3}   // nearly face-on minimum
  maxPolarAngle={Math.PI / 1.8}   // slight tilt maximum
  // ... other settings unchanged
/>
```

---

## Problem 3: Planet Tap/Click is Unreliable

This is the most critical UX bug. If users can't tap planets reliably, the interactive feature is useless.

### Root Cause

The likely issue is a conflict between OrbitControls drag events and click/tap events on planet meshes. OrbitControls captures all pointer events on the canvas, so a tap (mousedown + mouseup) often gets interpreted as the start of a drag instead of a click.

### Solution: Custom Tap Detection Layer

Do NOT rely on Three.js raycasting alone for taps. Instead, implement a **hybrid approach**:

**Option A (Recommended): HTML Overlay Tap Targets**

Use drei's `<Html>` component to render invisible but tappable DOM elements positioned over each planet. These DOM elements sit above the Three.js canvas and receive native browser click/tap events with perfect reliability.

```tsx
// Inside the 3D scene, for each planet:
<group position={[planetX, planetY, planetZ]}>
  {/* Visual: the 3D orb */}
  <mesh>
    <sphereGeometry args={[0.1, 16, 16]} />
    <meshPhysicalMaterial ... />
  </mesh>
  
  {/* Tap target: invisible DOM overlay */}
  <Html center style={{ pointerEvents: 'auto' }}>
    <button
      onClick={(e) => {
        e.stopPropagation()
        onPlanetTap(planet)
      }}
      className="w-12 h-12 rounded-full cursor-pointer"
      style={{
        background: 'transparent',
        border: 'none',
        // Make tap area much larger than the visual orb
        // 48px minimum for comfortable mobile tapping
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={`View ${planet.name} details`}
    />
  </Html>
</group>
```

This approach:
- **Bypasses OrbitControls entirely** for planet taps (DOM events don't go through Three.js)
- Gives a **48×48px minimum tap target** (Apple's recommended minimum)
- Works perfectly on mobile with no ambiguity between tap and drag
- The invisible button sits exactly over the planet visual

**Important**: Set `pointerEvents: 'auto'` on the `<Html>` style AND make sure the canvas container doesn't have `pointer-events: none` on HTML overlays.

**Option B (Fallback): Raycasting with Drag Threshold**

If Option A causes layout issues with Html overlays, use raycasting but with smart tap detection:

```tsx
const pointerDownPos = useRef({ x: 0, y: 0 })
const pointerDownTime = useRef(0)

const handlePointerDown = (e) => {
  pointerDownPos.current = { x: e.clientX, y: e.clientY }
  pointerDownTime.current = Date.now()
}

const handlePointerUp = (e) => {
  const dx = e.clientX - pointerDownPos.current.x
  const dy = e.clientY - pointerDownPos.current.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const duration = Date.now() - pointerDownTime.current

  // Only register as a tap if pointer barely moved and was quick
  if (distance < 10 && duration < 300) {
    // Perform raycast at this position
    // Check intersection with planet meshes (use larger invisible spheres for hit testing)
  }
}
```

And critically: create **invisible hit-test spheres** around each planet that are 3-4x larger than the visible orb. The raycaster checks against these large invisible spheres, not the tiny visible ones:

```tsx
{/* Visible planet orb */}
<mesh>
  <sphereGeometry args={[0.08, 16, 16]} />
  <meshPhysicalMaterial ... />
</mesh>

{/* Invisible hit area — much larger */}
<mesh visible={false} onClick={() => onPlanetTap(planet)}>
  <sphereGeometry args={[0.25, 8, 8]} />
  <meshBasicMaterial transparent opacity={0} />
</mesh>
```

### Visual Feedback on Tap

When a planet IS successfully tapped, give immediate visual feedback so the user knows it registered:

```tsx
// Flash the planet brighter
const [isFlashing, setIsFlashing] = useState(false)

const handleTap = () => {
  setIsFlashing(true)
  setTimeout(() => setIsFlashing(false), 300)
  onPlanetTap(planet)
}

// In the material:
emissiveIntensity={isFlashing ? 3.0 : normalPulseValue}
```

Also briefly expand the planet's glow radius on tap — the orb should visually "pulse" to confirm the interaction.

---

## Problem 4: Planets Too Small and Hard to Identify

### Increase Planet Sizes

Current planets are likely 0.05-0.08 radius. Increase significantly:

```
Sun:           radius 0.18, glow spread 0.6   (largest — it's the Sun)
Moon:          radius 0.15, glow spread 0.5
Venus, Mars:   radius 0.12, glow spread 0.4
Mercury:       radius 0.10, glow spread 0.35
Jupiter:       radius 0.14, glow spread 0.45  (large planet)
Saturn:        radius 0.13, glow spread 0.45  (large planet)
Uranus:        radius 0.10, glow spread 0.35
Neptune:       radius 0.10, glow spread 0.35
Pluto:         radius 0.08, glow spread 0.3   (smallest)
```

### Make Planets Visually Distinct

Each planet should be immediately recognisable by colour AND visual treatment, not just a coloured dot:

**Sun** — Bright golden sphere with a warm radial glow halo. Slightly animated surface (use a noise-based shader or just animate emissive intensity with a faster pulse). It should feel like it's radiating heat.

**Moon** — Silvery-white sphere with a cool blue-white glow. Subtly different from other planets — perhaps slightly translucent or with a crescent shadow overlay that matches the actual current moon phase.

**Mercury** — Cyan/teal with a quick, jittery pulse (Mercury is fast — its animation should feel quick).

**Venus** — Warm pink with a soft, steady glow. Romantic, gentle pulse.

**Mars** — Deep red with a sharp, intense glow. Slightly faster pulse than average — Mars energy is assertive.

**Jupiter** — Rich orange/amber, largest glow spread. Feels expansive and warm.

**Saturn** — Grey-blue with a subtle ring (!) — add a tiny torus ring around Saturn's sphere. This is the most recognisable visual identifier. The ring can be very small and subtle but it immediately tells the user "that's Saturn."

**Uranus** — Electric teal, with an occasional bright flash/spark animation (Uranus = sudden change).

**Neptune** — Deep ocean blue with a dreamy, slow pulse. Feels misty.

**Pluto** — Dark purple, dimmest of all, smallest. Feels distant and mysterious.

### Planet Labels — Always Visible and Readable

Each planet must have a label that is:
- **Always visible** (not just on hover)
- Shows the **planet glyph + degree** (e.g. "☉ 14°")
- Positioned just below or beside the orb
- Uses a small, clean font (DM Sans, 11-12px)
- Has a **very subtle dark backdrop blur** behind the text so it's readable against any background:

```tsx
<Html center position={[0, -0.25, 0]} style={{ pointerEvents: 'none' }}>
  <div className="text-center whitespace-nowrap px-1.5 py-0.5 rounded-md"
       style={{
         fontSize: '11px',
         color: planet.colour,
         background: 'rgba(0,0,0,0.5)',
         backdropFilter: 'blur(4px)',
         textShadow: `0 0 8px ${planet.colour}40`,
       }}>
    {planet.glyph} {planet.degreeInSign}°
  </div>
</Html>
```

- Labels must **counter-rotate** to always be readable regardless of wheel rotation
- If two planets are very close together (within 5° longitude), offset their labels vertically so they don't overlap

---

## Performance Checklist

After implementing all changes:

1. Test on mobile viewport (375px) in Chrome DevTools with CPU throttling 4x
2. Target: 30+ FPS on mid-range devices
3. If bloom causes frame drops, reduce bloom intensity or disable on mobile:
   ```tsx
   const isMobile = window.innerWidth < 768
   {!isMobile && <Bloom ... />}
   ```
4. Use `React.memo` on all planet and ring sub-components
5. Geometry creation (spheres, torus) must happen ONCE, not on every render — use `useMemo`
6. Particle system: use `<Points>` from drei with `<PointMaterial>` instead of individual meshes

---

## Build Steps

1. Read all current wheel-related source files
2. Fix canvas container sizing and camera position (Problem 2 — do this first so you can see your other changes properly)
3. Implement the multi-ring design with glass materials (Problem 1)
4. Add sacred geometry accent, particles, outer halo glow (Problem 1)
5. Increase planet sizes and add distinct visual treatments (Problem 4)
6. Fix planet labels — always visible, backdrop blur, counter-rotate (Problem 4)
7. Implement HTML overlay tap targets for reliable planet interaction (Problem 3)
8. Add tap visual feedback (flash/pulse) (Problem 3)
9. Add Saturn's ring detail
10. Test the full interaction flow: auto-rotate → grab → spin → release with momentum → tap planet → detail panel opens
11. Test mobile performance, reduce effects if needed
12. Run `npm run build` — fix any errors
13. Commit: `feat: cinematic 3D wheel overhaul — glass rings, planet visibility, reliable tap interaction`
