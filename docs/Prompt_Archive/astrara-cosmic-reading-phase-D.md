# Astrara — Cosmic Reading: Phase D — Cinematic Animations + Scene Integration

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## MASTER ARCHITECTURE REFERENCE

Before implementing, read the master architecture document at:
**`src/features/cosmic-reading/ARCHITECTURE.md`**

This spec implements Section 4 (Animation Contract). It builds on Phase A (zodiac selector), Phase B (content engine with PhaseAnimation directives embedded in each ReadingPhase), and Phase C (state machine, ReadingContext, overlay UI).

---

## PHASE D SCOPE

This phase creates:
1. `useReadingAnimation.ts` — hook for the R3F scene to consume animation directives from ReadingContext
2. `PlanetHighlight.tsx` — R3F component that renders glow/pulse effects on highlighted planets
3. `AspectLineOverlay.tsx` — R3F component that draws animated aspect lines between planets
4. `ReadingCameraController.tsx` — R3F component that smoothly overrides camera position during reading phases
5. Modifications to `AstroWheel3DWrapper` and internal planet components to accept and render highlight state
6. Replacement of Phase C's placeholder animation timeouts with real animation-complete callbacks
7. `onAnimationComplete` callback integration in ReadingContext

This phase does **NOT** touch:
- Template content (Phase B)
- Reading overlay layout, phase card design, or navigation (Phase C)
- The zodiac selector or storage (Phase A)

**Deliverable**: When a reading plays, planets glow and pulse, camera smoothly pans to focus on the relevant planet(s), aspect lines draw between connected planets, non-highlighted planets dim. Each animation completes and triggers the next state transition. Full cinematic experience.

---

## CRITICAL PRINCIPLE: ADDITIVE ONLY

The existing R3F scene has working planet components, orbit rings, zodiac signs, aspect visualisations, and a camera controller. These components MUST NOT be refactored or restructured. All animation behaviour is ADDITIVE:

- New components are ADDED to the Canvas alongside existing ones
- Existing planet components receive an OPTIONAL new prop for highlight state — when the prop is undefined or null, they render EXACTLY as before
- The existing camera controller continues to work — a separate ReadingCameraController overrides it ONLY during reading mode
- When reading exits, EVERYTHING returns to its pre-reading state

---

## STEP 1: Understand the existing scene structure

Before writing any code, examine these files to understand the R3F scene structure:

1. `src/components/AstroWheel/AstroWheel3DWrapper.tsx` — the wrapper that renders the R3F `<Canvas>`
2. The component inside it that renders individual planets (likely `AstroWheel3D.tsx` or similar — find it)
3. The camera controller (likely uses `@react-three/drei` OrbitControls or a custom controller)
4. How planets are positioned (they use ecliptic longitude to place planets on the wheel)

Take note of:
- How each planet mesh is rendered (what geometry, material, position)
- How the camera is set up (perspective vs orthographic, position, target)
- Whether planets are individual components or rendered in a loop
- The coordinate system used (where is 0° Aries, how ecliptic maps to 3D space)
- Any existing glow/emissive effects on planets

Document what you find before proceeding. This understanding is essential.

---

## STEP 2: Create useReadingAnimation.ts

**File**: `src/features/cosmic-reading/animation/useReadingAnimation.ts`

This hook bridges ReadingContext and the Three.js scene. It reads the current animation directives and returns processed values the scene can consume.

```typescript
import { useMemo } from 'react'
import { useReadingContext } from '../ReadingContext'
import type { PhaseAnimation, CelestialBodyId } from '../types'

interface ReadingAnimationState {
  isActive: boolean
  
  // Planet highlights — map of bodyId → highlight params
  highlights: Map<CelestialBodyId, {
    effect: 'pulse' | 'glow' | 'enlarge'
    color?: string
    intensity: number
  }>
  
  // Dim opacity for non-highlighted planets (0-1, 1 = normal, 0.3 = dimmed)
  dimOpacity: number
  
  // Camera override
  cameraTarget: CelestialBodyId | null
  cameraZoom: number          // 1.0 = default
  cameraTransitionMs: number
  
  // Aspect line
  aspectLine: {
    from: CelestialBodyId
    to: CelestialBodyId
    color: string
    style: 'solid' | 'dashed'
    animateDrawing: boolean
    drawDuration: number
  } | null
}

export function useReadingAnimation(): ReadingAnimationState {
  const { isReadingActive, currentPhase } = useReadingContext()
  
  return useMemo(() => {
    if (!isReadingActive || !currentPhase?.animation) {
      return {
        isActive: false,
        highlights: new Map(),
        dimOpacity: 1,
        cameraTarget: null,
        cameraZoom: 1,
        cameraTransitionMs: 1500,
        aspectLine: null,
      }
    }
    
    const anim = currentPhase.animation
    const highlights = new Map()
    
    if (anim.highlights) {
      for (const h of anim.highlights) {
        highlights.set(h.bodyId, {
          effect: h.effect,
          color: h.color,
          intensity: h.intensity ?? 0.8,
        })
      }
    }
    
    return {
      isActive: true,
      highlights,
      dimOpacity: anim.dimOthers !== false ? 0.3 : 1,
      cameraTarget: anim.camera?.target ?? null,
      cameraZoom: anim.camera?.zoom ?? 1,
      cameraTransitionMs: anim.camera?.transitionDuration ?? 1500,
      aspectLine: anim.aspectLine ? {
        from: anim.aspectLine.from,
        to: anim.aspectLine.to,
        color: anim.aspectLine.color,
        style: anim.aspectLine.style,
        animateDrawing: anim.aspectLine.animateDrawing,
        drawDuration: anim.aspectLine.drawDuration ?? 1000,
      } : null,
    }
  }, [isReadingActive, currentPhase])
}
```

---

## STEP 3: Create PlanetHighlight.tsx

**File**: `src/features/cosmic-reading/animation/PlanetHighlight.tsx`

An R3F component that renders glow/pulse effects on planets. This component sits INSIDE the Canvas and reads from the animation hook.

### Approach

There are two ways to highlight planets:

**Option A — Modify existing planet materials**: Add an emissive boost to existing planet meshes via a new prop. This is direct but requires modifying existing planet components.

**Option B — Overlay glow meshes**: Render separate transparent glow meshes at the same position as highlighted planets. This is fully additive — no existing components change.

**Use a HYBRID approach**:
- For the **dim effect** (non-highlighted planets): pass a `readingDimOpacity` prop to the existing planet wrapper. When not 1.0, multiply the planet's material opacity. When undefined, render normally.
- For the **glow/pulse effect**: render separate glow meshes in PlanetHighlight.tsx positioned at the highlighted planet's coordinates.

### Glow Mesh Implementation

For each highlighted planet:
1. Look up the planet's current 3D position from the scene (either via a shared positions ref, or by reading the planet's ecliptic longitude and computing the 3D position using the same formula the wheel uses)
2. Render a slightly larger sphere with:
   - Additive blending (`THREE.AdditiveBlending`)
   - Low opacity (0.15-0.3)
   - Color matching the planet's colour or the override colour from the directive
   - For `'pulse'` effect: animate the scale up/down using `useFrame` with a sine wave
   - For `'glow'` effect: steady glow with slight opacity breathing
   - For `'enlarge'` effect: scale the planet slightly larger (1.2x) with a smooth transition

### Animation Timing

The glow should fade IN over ~800ms when a phase starts, and fade OUT over ~400ms when transitioning. Use `useFrame` with lerping for smooth transitions. Track the previous animation state with `useRef` to detect changes.

### Position Synchronisation

The highlight glow mesh MUST be positioned exactly on top of the planet it's highlighting. To achieve this:
- Find how planets are positioned in the existing scene (they'll use ecliptic longitude → 3D coordinates on the wheel ellipse)
- Either expose planet positions via a shared ref/context, or replicate the position calculation
- The position formula is likely: map ecliptic longitude (0-360°) to a point on the tilted ellipse that represents the zodiac wheel

### Pulse Animation (useFrame)

```typescript
useFrame((_, delta) => {
  if (effect === 'pulse') {
    // Sine wave oscillation between scale 1.0 and 1.15
    pulseRef.current += delta * 2.5  // speed
    const scale = 1.0 + Math.sin(pulseRef.current) * 0.15
    meshRef.current.scale.setScalar(scale)
  }
})
```

---

## STEP 4: Create AspectLineOverlay.tsx

**File**: `src/features/cosmic-reading/animation/AspectLineOverlay.tsx`

Renders a glowing line between two planets when an aspect phase is active.

### Implementation

1. Read `aspectLine` from `useReadingAnimation()`
2. If null, render nothing
3. If present:
   - Get the 3D positions of both planets (same method as PlanetHighlight)
   - Render a line using `<line>` or `THREE.Line2` (for thickness control)
   - Color from the directive
   - If `animateDrawing` is true: animate the line drawing from planet1 to planet2 over `drawDuration` ms using a progress value (0→1) that controls how much of the line is visible (use `drawRange` on BufferGeometry or a custom shader)
   - If `style === 'dashed'`: use `THREE.LineDashedMaterial`
   - Add a subtle glow effect to the line (either via a wider semi-transparent line behind, or via postprocessing bloom if already enabled)

### Animated Line Drawing

The most visually impactful approach:
1. Create a `BufferGeometry` with points along the straight line between the two planets
2. Use `geometry.setDrawRange(0, count * progress)` where progress animates from 0 to 1
3. Animate progress in `useFrame` over the specified duration

### Fallback

If the line drawing animation proves too complex, a simpler approach is acceptable:
- Fade the line in over 600ms (opacity 0 → 0.6)
- No progressive drawing — the full line appears with a fade

---

## STEP 5: Create ReadingCameraController.tsx

**File**: `src/features/cosmic-reading/animation/ReadingCameraController.tsx`

An R3F component that smoothly overrides the camera position during reading phases.

### How it works

1. Read `cameraTarget`, `cameraZoom`, and `cameraTransitionMs` from `useReadingAnimation()`
2. When a target is specified:
   - Calculate the 3D position of the target planet
   - Smoothly lerp the camera position/lookAt toward a position that centres on that planet
   - Apply the zoom level (either by moving the camera closer or adjusting the FOV)
3. When the reading exits (isActive becomes false):
   - Smoothly lerp the camera back to its default position
4. When no target is specified (isActive is true but cameraTarget is null):
   - Keep the camera in its current/default position

### Integration with Existing Camera

The existing scene likely uses OrbitControls or a custom camera controller. During reading mode:
- **Disable** user camera interaction (orbit/pan/zoom) by setting OrbitControls enabled to false
- **Override** the camera position via useFrame lerping
- When reading exits, **re-enable** OrbitControls

Find how the existing camera is controlled and ensure ReadingCameraController doesn't fight with it. If OrbitControls is used:

```typescript
useFrame(() => {
  if (!controlsRef.current) return
  if (isActive && cameraTarget) {
    controlsRef.current.enabled = false
    // Lerp camera toward target position
    camera.position.lerp(targetPosition, 0.05)
    camera.lookAt(targetLookAt)
  } else if (!isActive) {
    // Lerp back to default
    camera.position.lerp(defaultPosition, 0.05)
    controlsRef.current.enabled = true
  }
})
```

### Getting a Reference to OrbitControls

If the existing camera controller doesn't expose a ref, you may need to:
- Find the OrbitControls component in the existing scene code
- Add a `ref` to it and expose it via context or a forwarded ref
- Or use `useThree()` to access the camera directly and control it without touching OrbitControls (just lerp camera.position and camera.lookAt)

### Camera Target Position Calculation

When targeting a planet:
- Don't zoom IN to the planet (that would break the wheel view)
- Instead, SHIFT the camera slightly to centre the target planet in view
- Apply a mild zoom (e.g., move camera 10-20% closer to the wheel)
- The planet should be roughly centre-screen with the rest of the wheel visible but the target planet clearly focal

---

## STEP 6: Modify AstroWheel3DWrapper to pass reading state into the scene

**File**: `src/components/AstroWheel/AstroWheel3DWrapper.tsx`

This is the key integration point. The wrapper renders the R3F `<Canvas>`. Inside the Canvas, reading animation components need access to ReadingContext.

### Important: React Context inside R3F Canvas

React Three Fiber's `<Canvas>` creates a separate React reconciler. **React Context from outside the Canvas does NOT automatically propagate inside it.**

Solutions (choose the simplest that works):

**Option A — Re-provide context inside Canvas**: In AstroWheel3DWrapper, import ReadingProvider and wrap the Canvas children. But this creates a new provider instance — NOT what we want.

**Option B — Pass data via props**: Pass the animation state as props to AstroWheel3DWrapper, which passes them into the Canvas children.

**Option C — Use R3F's built-in bridge**: `@react-three/fiber` and `@react-three/drei` provide utilities to bridge React context into the R3F tree. Check if the project uses any of these.

**Recommended approach (Option B)**: 
1. In page.tsx (or wherever AstroWheel3DWrapper is rendered), pass animation state as a prop
2. AstroWheel3DWrapper passes it into internal scene components
3. New animation components (PlanetHighlight, AspectLineOverlay, ReadingCameraController) receive animation data via props, not context

This avoids the context bridging problem entirely.

### Props to Add to AstroWheel3DWrapper

```typescript
// Add to existing props interface:
readingAnimation?: {
  isActive: boolean
  highlights: Array<{
    bodyId: string
    effect: 'pulse' | 'glow' | 'enlarge'
    color?: string
    intensity: number
  }>
  dimOpacity: number
  cameraTarget: string | null
  cameraZoom: number
  cameraTransitionMs: number
  aspectLine: {
    from: string
    to: string
    color: string
    style: 'solid' | 'dashed'
    animateDrawing: boolean
    drawDuration: number
  } | null
  onAnimationComplete?: () => void  // Callback when phase animation finishes
}
```

Use serialisable types (string instead of CelestialBodyId) to avoid import complexity in the existing component.

### Inside AstroWheel3DWrapper's Canvas

Add the three new animation components:

```tsx
<Canvas ...>
  {/* ... all existing scene content ... */}
  
  {/* Reading animation layer — renders on top */}
  {readingAnimation?.isActive && (
    <>
      <PlanetHighlight
        highlights={readingAnimation.highlights}
        dimOpacity={readingAnimation.dimOpacity}
        planetPositions={planetPositionsRef}  // Shared positions ref
      />
      <AspectLineOverlay
        aspectLine={readingAnimation.aspectLine}
        planetPositions={planetPositionsRef}
      />
      <ReadingCameraController
        isActive={readingAnimation.isActive}
        target={readingAnimation.cameraTarget}
        zoom={readingAnimation.cameraZoom}
        transitionMs={readingAnimation.cameraTransitionMs}
        planetPositions={planetPositionsRef}
        onComplete={readingAnimation.onAnimationComplete}
      />
    </>
  )}
</Canvas>
```

### Planet Position Sharing

The biggest technical challenge is giving the animation components access to current planet 3D positions. Options:

**Option A — Position ref**: The existing planet rendering code calculates 3D positions from ecliptic longitudes. Create a `useRef<Map<string, THREE.Vector3>>()` that the existing planet loop populates, and pass it to animation components.

**Option B — Recalculate**: The animation components independently calculate 3D positions from the same ecliptic longitude data. This duplicates logic but avoids modifying existing code.

**Option A is preferred** if it can be done with minimal changes to the existing planet rendering loop (just add a ref.current.set(planet.id, position) call).

---

## STEP 7: Modify existing planet rendering for dim effect

Find where individual planets are rendered in the R3F scene. Add a dim opacity effect:

- When `readingAnimation.isActive` is true AND a planet is NOT in the highlights list → reduce its opacity/emissive to `dimOpacity` (0.3)
- When a planet IS highlighted → render at full brightness (the glow overlay from PlanetHighlight handles the visual emphasis)
- When reading is not active → render everything normally (opacity 1.0)

**Implementation**: The simplest approach is to modify the planet mesh material's opacity. If planets use `MeshStandardMaterial`, set `material.opacity = dimOpacity` and `material.transparent = true` for dimmed planets.

Keep the modification MINIMAL — ideally just a conditional on the material opacity based on the passed prop.

---

## STEP 8: Wire animation into page.tsx and ReadingContext

### 8a. Pass animation data from ReadingContext to AstroWheel3DWrapper

In page.tsx, consume the reading animation state and pass it to the wheel:

```tsx
// Inside the ReadingProvider, create a component that bridges context to the wheel
function ReadingAnimationBridge() {
  const { isReadingActive, currentPhase, state } = useReadingContext()
  // ... compute animation state
  // ... pass to AstroWheel3DWrapper via a shared mechanism
}
```

Or more simply: have page.tsx pass the animation data as a prop. Since ReadingProvider wraps the component that renders AstroWheel3DWrapper, you need a bridge. The cleanest approach:

Create a small hook `useReadingAnimationProps()` that:
1. Reads from ReadingContext
2. Returns serialised animation data suitable for passing as props to AstroWheel3DWrapper
3. Includes the `onAnimationComplete` callback that dispatches to the state machine

### 8b. Replace Phase C placeholder timeouts

In ReadingContext.tsx, Phase C used `setTimeout` to auto-transition from PHASE_ANIMATING → PHASE_READING after 600ms. Now replace this:

- When `state.status === 'PHASE_ANIMATING'`, do NOT auto-dispatch `ANIMATION_COMPLETE` on a timer
- Instead, the `onAnimationComplete` callback passed to AstroWheel3DWrapper will be called by ReadingCameraController when the camera finishes its lerp transition
- ReadingCameraController should detect when the camera has reached its target position (lerp delta < 0.01) and call `onComplete()`
- This `onComplete()` dispatches `ANIMATION_COMPLETE` in the reading state machine

**Keep a fallback timeout**: If the animation doesn't complete within 3 seconds (e.g. a bug prevents the callback), auto-dispatch `ANIMATION_COMPLETE` as a safety net. This prevents the reading from getting stuck.

### 8c. PHASE_TRANSITIONING timing

The transition between phases (card exits, then new card enters) should:
1. Card slides down (CSS transition — 400ms)
2. Camera lerps to new target
3. New glow appears
4. Card slides up with new content
5. `ANIMATION_COMPLETE` dispatched

The transition timeout from Phase C (400ms) can remain for the card exit animation, but the `ANIMATION_COMPLETE` for the new phase should come from the camera reaching its new target.

---

## STEP 9: Animation Complete Detection

In `ReadingCameraController.tsx`, detect when the animation is "done":

```typescript
const [hasReachedTarget, setHasReachedTarget] = useState(false)
const prevTargetRef = useRef<string | null>(null)

useFrame(() => {
  // Detect target change → reset completion state
  if (target !== prevTargetRef.current) {
    prevTargetRef.current = target
    setHasReachedTarget(false)
  }
  
  if (!hasReachedTarget && target) {
    const distance = camera.position.distanceTo(targetPosition)
    if (distance < 0.05) {  // Close enough
      setHasReachedTarget(true)
      onComplete?.()  // Signal animation complete
    }
  }
  
  // Lerp camera
  if (target) {
    camera.position.lerp(targetPosition, lerpSpeed)
  }
})
```

For phases WITHOUT a camera target (e.g. frequency recommendation), call `onComplete()` after a short delay (800ms) to let the glow effect appear.

---

## STEP 10: Verify

After implementing, verify:

1. `npm run build` completes without errors
2. **Full cinematic reading flow**:
   - Start reading → first phase (Moon): camera smoothly shifts to centre on Moon, Moon gets a glow effect, other planets dim to 30% opacity
   - Tap "Next ✦" → card transitions, camera smoothly pans to next planet (Sun), Sun glows, Moon dims
   - Aspect phase: both involved planets glow, a line draws between them
   - Retrograde phase: all retrograde planets pulse simultaneously
   - Frequency phase: dominant planet glows with special emphasis
   - Summary → "Close ✦" → camera smoothly returns to default position, all planets return to full opacity, glow effects fade out
3. **Escape hatch**: Tap "✕" at any point → smooth exit animation (camera returns, glows fade, overlay closes)
4. **No scene regressions**: When reading is NOT active, the wheel looks and behaves EXACTLY as before — orbit, zoom, planet taps, sign taps, aspect lines, Solar System View toggle, helio time controls ALL work normally
5. **Camera interaction**: During reading, user cannot orbit/zoom/pan. After reading exits, full camera control is restored.
6. **Mobile performance**: Glow effects don't cause frame drops on mobile. If they do, reduce glow mesh geometry complexity or disable glow on mobile (check `window.innerWidth < 768`).
7. **Planet position accuracy**: Glow meshes are perfectly aligned with their planets — no offset or drift.
8. **Aspect line accuracy**: Line connects the correct two planets and doesn't clip through other elements.

---

## FALLBACK STRATEGY

If the animation integration proves too complex or causes regressions in the existing scene:

**Minimal fallback** — skip PlanetHighlight glow meshes and AspectLineOverlay. Instead:
1. Only implement the dim effect (modify planet material opacity) — this is low risk
2. Only implement the camera controller — this is additive
3. Skip glow and aspect lines for now — they can be added in a follow-up iteration

This still gives a cinematic feel (camera panning between planets, dimming effect) without the risk of breaking the scene.

---

## TECHNICAL CONSTRAINTS

- **No framer-motion.** All animations use Three.js native (`useFrame`, lerp, `THREE.MathUtils.lerp`).
- **No scene refactoring.** Existing components modified minimally (additive props only).
- **Additive only** — new R3F components sit alongside existing ones.
- **Git push**: `git push origin master:main` for Vercel deployment.
- **Performance**: Keep glow geometry simple (low poly sphere, not high-res). Use `AdditiveBlending` for glow. Minimise new draw calls.
- **Coordinate system**: Match the existing wheel's coordinate system exactly. Get positions from the same source/formula the existing planets use.
- **Camera lerp speed**: Use a lerp factor of ~0.03-0.05 per frame for smooth, cinematic camera movement. Not too fast, not too slow.
- **Cleanup**: When reading exits, ALL animation state must reset cleanly. No lingering glow meshes, no stuck dim opacity, no disabled controls.
