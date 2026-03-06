# ASTRARA — Heliocentric Rebuild Step 2: Toggle & Planet Movement

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Step 1 is complete. The app has:
- `src/lib/heliocentric.ts` with `calculateAllHelioData(date)` returning pre-calculated scene positions
- `helioData` state in `page.tsx` that recalculates on every date change
- `viewMode` state (`'geocentric' | 'heliocentric'`) currently unused

This step adds the toggle button and the animated transition between views. Read all current wheel, planet, zodiac badge, aspect line, and animation source files before making changes.

**CRITICAL RULE: The geocentric wheel must continue to work exactly as it does today when viewMode is 'geocentric'. Do NOT restructure existing components — only ADD conditional logic.**

---

## 1. Toggle Button

Add a toggle button positioned below the wheel but ABOVE the Yesterday/Today/Tomorrow navigation.

### Appearance

```tsx
<button
  onClick={() => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setViewMode(prev => prev === 'geocentric' ? 'heliocentric' : 'geocentric')
    }
  }}
  disabled={isTransitioning}
  className="flex items-center gap-2 px-5 py-2.5 rounded-full 
             border border-white/10 bg-white/5 backdrop-blur-sm
             text-white/70 text-sm transition-all duration-200
             hover:bg-white/10 hover:text-white/90
             active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {viewMode === 'geocentric' ? (
    <>
      <span>☉</span>
      <span>Solar System View</span>
    </>
  ) : (
    <>
      <span>✦</span>
      <span>Astro Wheel View</span>
    </>
  )}
</button>
```

### State

Add `isTransitioning` state alongside the existing `viewMode`:

```typescript
const [isTransitioning, setIsTransitioning] = useState(false)
```

Pass `viewMode`, `isTransitioning`, and `helioData` down to the wheel component as props.

---

## 2. Transition Progress System

Inside the wheel's main Three.js component (the one containing `useFrame`), add a transition progress tracker:

```typescript
const transitionProgress = useRef(0) // 0 = fully geocentric, 1 = fully heliocentric

useFrame((state, delta) => {
  // Only run transition logic when transitioning
  const target = viewMode === 'heliocentric' ? 1 : 0
  const diff = target - transitionProgress.current

  if (Math.abs(diff) > 0.003) {
    // Animate toward target
    transitionProgress.current += diff * delta * 1.5
    // Clamp
    transitionProgress.current = Math.max(0, Math.min(1, transitionProgress.current))
  } else if (isTransitioning) {
    // Snap to target and signal done
    transitionProgress.current = target
    // Call the parent's setIsTransitioning(false)
    // Use a callback prop or ref for this
    onTransitionComplete?.()
  }

  // Calculate sub-progress for each phase
  const p = transitionProgress.current

  // Phase 1: Zodiac fadeout/fadein (p: 0.0–0.25)
  const zodiacOpacity = 1 - clamp01(p / 0.25)

  // Phase 2: Planet movement (p: 0.25–0.85)  
  const moveT = clamp01((p - 0.25) / 0.6)
  const smoothMoveT = smoothstep(moveT)

  // Phase 3: Helio elements appear (p: 0.7–1.0)
  const helioOpacity = clamp01((p - 0.7) / 0.3)

  // Store these values in refs so child components can read them
  phaseValues.current = { zodiacOpacity, smoothMoveT, helioOpacity }
})

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}
```

**IMPORTANT:** The `onTransitionComplete` callback should call `setIsTransitioning(false)` in the parent. Pass it as a prop or use a ref callback.

---

## 3. Planet Position Lerping

Each planet mesh needs to interpolate between its geocentric position and its heliocentric position based on `smoothMoveT`.

### Find Where Planet Positions Are Applied

Find the code that sets each planet mesh's position in the Three.js scene. It likely looks something like:

```typescript
<group position={[planetGeoX, planetGeoY, planetGeoZ]}>
  {/* planet mesh, glow, label etc */}
</group>
```

### Modify to Lerp Between Positions

For each planet, calculate the interpolated position:

```typescript
// Get the heliocentric scene position for this planet from helioData
const helioPos = helioData[planetName]

// If helioPos exists and we're transitioning or in heliocentric view
const geoX = planetGeoX  // existing geocentric X
const geoY = planetGeoY  // existing geocentric Y  
const geoZ = planetGeoZ  // existing geocentric Z

const helioX = helioPos?.sceneX ?? geoX
const helioY = helioPos?.sceneY ?? geoY
const helioZ = 0  // heliocentric view is flat

// Interpolated position using smoothMoveT from the phase values
const currentX = geoX + (helioX - geoX) * smoothMoveT
const currentY = geoY + (helioY - geoY) * smoothMoveT
const currentZ = geoZ + (helioZ - geoZ) * smoothMoveT
```

**There are two approaches to apply this — choose the one that fits the current code structure:**

**Approach A: If planets are positioned via JSX props:**
Wrap each planet group in a parent that reads `smoothMoveT` from a ref/context and calculates the interpolated position each frame using `useFrame`:

```typescript
function AnimatedPlanetPosition({ 
  geoPosition, 
  helioPosition, 
  phaseValues, 
  children 
}: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    const t = phaseValues.current.smoothMoveT
    groupRef.current.position.set(
      geoPosition.x + (helioPosition.x - geoPosition.x) * t,
      geoPosition.y + (helioPosition.y - geoPosition.y) * t,
      geoPosition.z + (helioPosition.z - geoPosition.z) * t,
    )
  })

  return <group ref={groupRef}>{children}</group>
}
```

**Approach B: If planets are already positioned via refs in useFrame:**
Add the lerp calculation directly into the existing useFrame logic.

### Special Cases

**Sun:** 
- Geocentric position = its current ecliptic position on the wheel
- Heliocentric position = `{ x: 0, y: 0, z: 0 }` (centre)

**Earth:**
- Geocentric position = centre of the wheel (0, 0, 0) or wherever it currently sits
- Heliocentric position = `helioData.Earth.sceneX, helioData.Earth.sceneY, 0`

**Moon:**
- Geocentric position = its current ecliptic position on the wheel
- Heliocentric position = `helioData.Moon.sceneX, helioData.Moon.sceneY, 0` (near Earth)

---

## 4. Zodiac Elements: Fade Based on Phase 1

Find ALL zodiac-related visual elements and multiply their opacity by `zodiacOpacity`:

### Zodiac Sign Badges
Find the `<Html>` components that render zodiac sign glyphs around the wheel. Add opacity:

```typescript
<Html 
  center 
  style={{ 
    pointerEvents: zodiacOpacity > 0.1 ? 'auto' : 'none',
    opacity: zodiacOpacity,
    transition: 'none',  // we're controlling this per-frame, no CSS transition
  }}
>
```

### Zodiac Degree Labels on Planets
Find the degree labels (e.g., "23°") next to planet names. In heliocentric view these should fade out:

```typescript
style={{ opacity: zodiacOpacity }}
```

### Aspect Lines
Find the aspect line meshes/components. Multiply their material opacity by `zodiacOpacity`:

```typescript
<lineBasicMaterial
  color={aspect.colour}
  transparent
  opacity={aspect.baseOpacity * zodiacOpacity}
/>
```

### Zodiac Ring Markings
If there are 30° division marks or the outer zodiac ring, fade them too:

```typescript
material.opacity = baseRingOpacity * zodiacOpacity
```

### "Home" Label on Earth
Fade out during transition:

```typescript
style={{ opacity: zodiacOpacity }}
```

---

## 5. Heliocentric Labels: Appear Based on Phase 3

In heliocentric view, planet labels should show the planet NAME instead of the degree:

```typescript
// Choose label text based on transition phase
const labelText = helioOpacity > 0.5 
  ? `${planet.glyph} ${planet.name}`     // heliocentric: "♂ Mars"
  : `${planet.glyph} ${planet.degree}°`   // geocentric: "♂ 23°"
```

Cross-fade: the geocentric label fades out with `zodiacOpacity`, the heliocentric label fades in with `helioOpacity`. If they're the same text element, just swap the content when `helioOpacity` crosses 0.5.

### Sun Label at Centre
When in heliocentric view, show "☉ Sun" label at centre. Fade in with `helioOpacity`:

```typescript
{helioOpacity > 0.01 && (
  <Html center style={{ opacity: helioOpacity }}>
    <span className="text-white/70 text-xs">☉ Sun</span>
  </Html>
)}
```

### "Home" Label on Earth
In heliocentric view, show "Home" on Earth at its new orbital position. Fade in with `helioOpacity`:

```typescript
{helioOpacity > 0.01 && (
  <Html center style={{ opacity: helioOpacity }}>
    <span className="text-white/40 text-xs">Home</span>
  </Html>
)}
```

---

## 6. Camera Adjustment

The heliocentric view needs a wider field of view since the solar system spans a larger area than the zodiac wheel.

Smoothly adjust the camera during transition:

```typescript
useFrame((state) => {
  const p = transitionProgress.current

  // Camera pulls back for heliocentric view
  // Find the current camera Z position (or whatever axis the camera uses for distance)
  const geoCameraZ = DEFAULT_CAMERA_Z       // the current default camera position
  const helioCameraZ = geoCameraZ * 1.6     // pull back 60% for wider view

  const targetZ = geoCameraZ + (helioCameraZ - geoCameraZ) * p
  state.camera.position.z += (targetZ - state.camera.position.z) * 0.05

  state.camera.updateProjectionMatrix()
})
```

**Tune `helioCameraZ` so that a planet at ring radius 17 (Pluto) is visible with padding on a 375px screen.** If 1.6× pullback isn't enough, increase to 1.8× or 2.0×. If it's too much (planets become tiny), reduce to 1.4×.

---

## 7. Disable Interactions During Transition

While `isTransitioning` is true:

```typescript
// Disable planet taps
<Html style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}>

// Disable day navigation buttons
<button disabled={isTransitioning}>Yesterday</button>
<button disabled={isTransitioning}>Tomorrow</button>
```

---

## 8. Auto-Rotation

If the wheel has auto-rotation:
- In geocentric view: keep existing auto-rotation behaviour
- During transition: pause auto-rotation
- In heliocentric view: very slow rotation of the entire solar system (the whole scene group rotates around Y axis at ~0.5°/second) — or no rotation at all if it looks better static

---

## 9. What This Step Does NOT Include (Saved for Step 3)

- NO orbital path rings (the faint circles showing orbit paths)
- NO Moon orbit ring around Earth
- NO special Moon animation
- NO label collision avoidance
- NO info page updates
- NO i18n updates

These are polish items for Step 3. This step focuses ONLY on: toggle works, planets move correctly, zodiac fades out, heliocentric labels fade in, camera adjusts.

---

## Build & Deploy

1. Run `npm run build` — fix ALL TypeScript errors before proceeding
2. Test: app loads in geocentric view — completely normal, no changes from before
3. Test: toggle button is visible below the wheel
4. Test: tap toggle → Phase 1: zodiac signs, degree labels, and aspect lines fade out over ~0.8s
5. Test: tap toggle → Phase 2: AFTER zodiac fades, planets begin moving. Sun moves to centre, Earth moves outward, all planets glide to new positions
6. Test: tap toggle → Phase 3: planet labels show names ("♂ Mars") instead of degrees
7. Test: ALL planets visible on 375px mobile screen in heliocentric view — nothing off screen
8. Test: Sun is at the exact centre in heliocentric view
9. Test: Earth is at ring radius 5.5 scene units from Sun
10. Test: Pluto is the outermost planet, visible with padding from screen edge
11. Test: tap toggle again → everything reverses smoothly back to geocentric wheel
12. Test: tap a planet in heliocentric view → detail panel opens
13. Test: toggle rapidly 3× → no glitches, button disabled during transition
14. Test: change date in heliocentric view → planets move to new angular positions
15. Commit: `feat: heliocentric toggle — planet movement and zodiac transition`
16. Push to `main`
