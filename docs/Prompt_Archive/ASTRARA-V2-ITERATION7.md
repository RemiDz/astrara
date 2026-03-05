# ASTRARA v2 — Iteration 7: Loading State + Wheel Entrance Animation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

When the page loads, users see an ugly grey/dark square container flash before the 3D wheel renders. This looks broken and unprofessional. The wheel then just pops in instantly with no ceremony. For a TikTok-ready app, the loading and entrance must be **cinematic and smooth**. Read all current source files before making changes.

---

## Problem 1: Ugly Square Container Flash on Load

The Three.js Canvas container is visible as an empty rectangle while WebGL initialises and the 3D scene loads. This takes 1-3 seconds depending on the device.

### Fix: Make the Container Invisible Until Ready

**Step 1**: The Canvas container div must have NO visible background, border, or outline. It should be completely invisible when empty:

```tsx
<div 
  className="relative w-full"
  style={{ 
    height: '95vw',
    maxHeight: '550px',
    touchAction: 'none',
    overflow: 'visible',
    // NO background colour, NO border, NO box-shadow
    // The container itself should be invisible
    background: 'transparent',
  }}
>
```

Remove any of these if present on the canvas container or its parents:
- `background` or `bg-` Tailwind classes (other than transparent)
- `border` classes
- `rounded-` classes (these imply a visible container)
- `shadow-` classes
- Any CSS that would make the empty container visible

**Step 2**: Hide the Canvas until the 3D scene is fully loaded. Use a state flag:

```tsx
const [sceneReady, setSceneReady] = useState(false)

<div style={{ 
  opacity: sceneReady ? 1 : 0,
  transition: 'none',  // don't fade here — the entrance animation handles it
}}>
  <Canvas
    onCreated={() => {
      // Scene is created but give it one extra frame to render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSceneReady(true)
        })
      })
    }}
    ...
  >
    ...
  </Canvas>
</div>
```

This ensures the container is completely invisible (opacity 0) until Three.js has fully initialised and rendered at least one frame. No grey square flash.

---

## Problem 2: Wheel Must Animate In Cinematically

Once the scene is ready, the wheel should **build itself** with a smooth, theatrical entrance — not just pop into existence. This is the "wow moment" when a user first opens Astrara or when someone screen-records for TikTok.

### Entrance Sequence (total duration: ~3 seconds)

The wheel assembles itself piece by piece, like a holographic projection powering on:

**Phase 1 (0ms–600ms): Centre Point Ignites**
- Earth appears first — a tiny point of light at the centre that expands to its full size
- Starts as a bright white dot, transitions to the Earth sphere
- A soft radial pulse of light emanates outward from the centre

```tsx
// Earth entrance
const earthScale = useSpring({
  from: { scale: 0 },
  to: { scale: 1 },
  delay: 0,
  config: { tension: 120, friction: 14 },
})
```

**Phase 2 (400ms–1200ms): Inner Ring Expands**
- The innermost ring draws itself outward from the centre like a ripple
- Starts at radius 0, smoothly expands to full radius
- A subtle glow trails the expanding ring edge

```tsx
// Ring entrance — scale from 0 to 1
const ringScale = useSpring({
  from: { scale: 0 },
  to: { scale: 1 },
  delay: 400,
  config: { tension: 80, friction: 18 },
})
```

**Phase 3 (800ms–1600ms): Zodiac Ring Materialises**
- The outer zodiac ring fades in while expanding slightly
- Each zodiac sign badge fades in with a staggered delay (one after another around the circle)
- ~80ms delay between each sign = 12 signs × 80ms = ~960ms total stagger

```tsx
// Staggered zodiac sign entrance
{zodiacSigns.map((sign, index) => (
  <ZodiacBadge
    key={sign.name}
    sign={sign}
    style={{
      opacity: sceneReady ? 1 : 0,
      transform: sceneReady ? 'scale(1)' : 'scale(0.5)',
      transition: `all 0.4s ease-out ${800 + index * 80}ms`,
    }}
  />
))}
```

**Phase 4 (1400ms–2400ms): Planets Appear**
- Each planet orb fades in one by one, from the Sun outward
- Each planet starts invisible and small, then blooms to full size with its glow
- Stagger: ~100ms between each planet
- Order: Sun → Moon → Mercury → Venus → Mars → Jupiter → Saturn → Uranus → Neptune → Pluto

```tsx
const PLANET_ORDER = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
                       'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

{planets.map((planet) => {
  const orderIndex = PLANET_ORDER.indexOf(planet.name)
  return (
    <PlanetOrb
      key={planet.name}
      planet={planet}
      entranceDelay={1400 + orderIndex * 100}
      sceneReady={sceneReady}
    />
  )
})}
```

Inside each PlanetOrb component:

```tsx
const [visible, setVisible] = useState(false)

useEffect(() => {
  if (sceneReady) {
    const timer = setTimeout(() => setVisible(true), entranceDelay)
    return () => clearTimeout(timer)
  }
}, [sceneReady, entranceDelay])

// In the render:
<group scale={visible ? 1 : 0}>
  <mesh>
    <sphereGeometry args={[radius, 16, 16]} />
    <meshPhysicalMaterial
      emissiveIntensity={visible ? normalPulse : 0}
      opacity={visible ? 1 : 0}
      transparent
    />
  </mesh>
</group>
```

Use `useFrame` to animate the scale smoothly instead of a hard toggle:

```tsx
const targetScale = visible ? 1 : 0
const currentScale = useRef(0)

useFrame((_, delta) => {
  currentScale.current += (targetScale - currentScale.current) * delta * 3
  groupRef.current.scale.setScalar(currentScale.current)
})
```

**Phase 5 (2200ms–3000ms): Aspect Lines Draw**
- Aspect lines draw themselves from one planet to another
- Each line starts from one end and extends to the other, like a laser beam connecting two points
- Stagger between lines: ~100ms
- Lines fade to their normal low opacity after fully drawn

```tsx
// Line drawing animation: animate the geometry points
// Start with both points at planet1 position, then move end point to planet2
const [lineProgress, setLineProgress] = useState(0)

useFrame((_, delta) => {
  if (visible && lineProgress < 1) {
    setLineProgress(prev => Math.min(prev + delta * 2, 1))
  }
})

const lineEnd = planet1Pos.clone().lerp(planet2Pos, lineProgress)

<Line
  points={[planet1Pos, lineEnd]}
  color={aspectColour}
  lineWidth={1}
  transparent
  opacity={0.25 * lineProgress}
/>
```

**Phase 6 (2800ms+): Auto-Rotation Begins**
- Only after the full entrance sequence completes, auto-rotation kicks in
- The wheel starts stationary during the build sequence, then gently begins to spin

```tsx
<OrbitControls
  autoRotate={sceneReady && entranceComplete}  // only auto-rotate after entrance
  ...
/>
```

Set `entranceComplete` to true after ~3000ms:

```tsx
useEffect(() => {
  if (sceneReady) {
    const timer = setTimeout(() => setEntranceComplete(true), 3000)
    return () => clearTimeout(timer)
  }
}, [sceneReady])
```

---

## Loading Indicator (Optional but Recommended)

While the scene loads (before Phase 1 begins), show a very subtle loading state in the wheel area — NOT a spinner or progress bar (too generic). Instead:

```tsx
{!sceneReady && (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
      Reading the stars...
    </div>
  </div>
)}
```

This text fades away as the wheel entrance begins. Keep it in the same i18n system:

**en.json:** `"loading.stars": "Reading the stars..."`
**lt.json:** `"loading.stars": "Skaitome žvaigždes..."`

---

## Performance Notes

- All entrance animations should use `useFrame` (Three.js render loop) for 3D elements, not CSS transitions — this keeps everything in sync at 60fps
- For `<Html>` overlay elements (zodiac badges, planet labels), CSS transitions are fine since they're DOM elements
- The entrance sequence only plays on **first load** and **page refresh** — NOT when switching days (Yesterday/Tomorrow/date picker). Day switching should smoothly animate planets to new positions but skip the full build sequence
- Use a ref or state flag to track whether the initial entrance has played

---

## Summary of the Experience

1. User opens astrara.app
2. They see the header, the starfield background, and a subtle "Reading the stars..." message
3. A point of light ignites at the centre → expands into Earth
4. Rings ripple outward from Earth
5. Zodiac signs materialise around the ring one by one
6. Planets bloom into existence, Sun first
7. Aspect lines draw themselves between planets
8. The wheel begins to slowly rotate
9. The cosmic weather cards below are ready to scroll

Total time: ~3 seconds. Feels cinematic. Perfect for screen recording.

---

## Build Steps

1. Read current Canvas/wheel component files
2. Remove any visible styling from the canvas container (background, border, rounded corners)
3. Add `sceneReady` state flag — hide canvas until Three.js has rendered first frame
4. Implement the phased entrance animation sequence (Earth → rings → signs → planets → aspect lines → rotation)
5. Add "Reading the stars..." loading text
6. Add i18n keys for loading text
7. Ensure day navigation (Yesterday/Tomorrow) does NOT replay the entrance — just smoothly moves planets
8. Test: page load shows NO grey square, just smooth cinematic entrance
9. Test on mobile — verify performance is acceptable during animation
10. Run `npm run build`
11. Commit: `feat: cinematic wheel entrance animation, clean loading state`
