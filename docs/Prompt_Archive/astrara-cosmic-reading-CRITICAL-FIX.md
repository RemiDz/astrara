# Astrara — Cosmic Reading: CRITICAL FIX — Restore Wheel + Fix Reading Experience

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## PROBLEM SUMMARY

After implementing Cosmic Reading Phases A–E, the app has these critical regressions:

1. **Astro Wheel interaction broken** — user can't orbit/zoom/tap planets normally
2. **Loading screen animation broken** — the initial entrance animation affected
3. **Solar System View broken** — heliocentric mode planets not fitting screen, animation gone
4. **Reading overlay too visually dominant** — covers the entire wheel instead of a subtle bottom sheet
5. **Camera animation abrupt** — jumping between planets instead of smooth lerping
6. **Reading modal blocks the view** — text overlay covers planets entirely

The root cause is Phase D's camera controller and animation components conflicting with the existing camera system (TiltAnimator, CameraDistanceAnimator, HelioTiltAnimator, OrbitControls).

---

## APPROACH: ISOLATE AND FIX

We will NOT remove Phases A–E. The content engine, types, zodiac selector, and reading state machine are all fine. The problems are specifically in:

1. **ReadingCameraController.tsx** — fighting with existing camera controllers
2. **AstroWheel3D.tsx** — the way animation components were integrated
3. **ReadingOverlay.tsx** — visual design needs refinement
4. **page.tsx** — possible integration issues

---

## STEP 1: Diagnose the exact camera conflict

Examine `src/features/cosmic-reading/animation/ReadingCameraController.tsx`.

The existing AstroWheel3D.tsx has these camera controllers that ALL run simultaneously:
- `TiltAnimator` — runs the initial cinematic tilt after scene loads
- `CameraDistanceAnimator` — animates camera distance during geo↔helio transitions
- `HelioTiltAnimator` — adjusts tilt for helio view
- `OrbitControls` — user interaction (rotate, auto-rotate, damping)
- `RotationVelocityTracker` — tracks rotation velocity for sound

ReadingCameraController MUST NOT interfere with any of these when the reading is NOT active.

**Check ReadingCameraController.tsx for:**
- Does it modify camera position even when `isActive` is false?
- Does it disable OrbitControls and fail to re-enable them?
- Does it set camera position on every frame regardless of state?
- Does it conflict with the initial TiltAnimator entrance sequence?

---

## STEP 2: Fix ReadingCameraController.tsx

**File**: `src/features/cosmic-reading/animation/ReadingCameraController.tsx`

Rewrite this component with these strict rules:

### Rule 1: Do NOTHING when not active

```typescript
useFrame(() => {
  // CRITICAL: When not active, do absolutely nothing
  if (!isActive) return
  
  // ... all camera logic only when reading is active
})
```

### Rule 2: Save and restore camera state

When reading starts (`isActive` becomes true for the first time):
1. Save the current camera position, rotation, and OrbitControls target to refs
2. Disable OrbitControls (`controlsRef.current.enabled = false`)
3. Begin lerping to target planet

When reading ends (`isActive` becomes false):
1. Lerp camera back to the SAVED position (not a hardcoded default)
2. Re-enable OrbitControls
3. Call `controlsRef.current.update()` to resync OrbitControls with the restored camera state

```typescript
const savedCameraPos = useRef<THREE.Vector3 | null>(null)
const savedControlsTarget = useRef<THREE.Vector3 | null>(null)
const wasActive = useRef(false)
const restoring = useRef(false)

useFrame(() => {
  // ENTRY: reading just started
  if (isActive && !wasActive.current) {
    wasActive.current = true
    restoring.current = false
    savedCameraPos.current = camera.position.clone()
    savedControlsTarget.current = controlsRef.current?.target.clone() ?? new THREE.Vector3()
    if (controlsRef.current) controlsRef.current.enabled = false
  }
  
  // EXIT: reading just ended — begin restore
  if (!isActive && wasActive.current && !restoring.current) {
    restoring.current = true
  }
  
  // RESTORING: lerp back to saved position
  if (restoring.current && savedCameraPos.current) {
    camera.position.lerp(savedCameraPos.current, 0.05)
    const dist = camera.position.distanceTo(savedCameraPos.current)
    if (dist < 0.05) {
      camera.position.copy(savedCameraPos.current)
      if (controlsRef.current && savedControlsTarget.current) {
        controlsRef.current.target.copy(savedControlsTarget.current)
        controlsRef.current.enabled = true
        controlsRef.current.update()
      }
      wasActive.current = false
      restoring.current = false
      savedCameraPos.current = null
      savedControlsTarget.current = null
    }
    return // Don't do anything else while restoring
  }
  
  // ACTIVE: only run camera animation logic when reading is truly active
  if (!isActive) return
  
  // ... lerp to target planet position ...
})
```

### Rule 3: Smooth lerp, not jumping

The lerp factor must be SMALL for cinematic movement. Use `0.03` per frame, NOT `0.1` or higher. The camera should glide, not snap.

```typescript
const LERP_SPEED = 0.03
camera.position.lerp(targetPosition, LERP_SPEED)
```

### Rule 4: Camera target calculation

When targeting a planet, DON'T move the camera to the planet's position. Instead:
- Keep the camera at roughly its current distance from the wheel
- SHIFT the camera angle so the target planet is roughly centred in view
- Apply a SLIGHT zoom (move 10-15% closer, not dramatically)

The target position should be calculated as:
```typescript
// Get planet's position on the wheel
const planetPos = longitudeToPosition(planetLongitude, R_PLANET)

// Calculate a camera position that looks at this planet from a similar angle
// but slightly shifted — NOT at the planet itself
const camDir = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(0, 0, 0)).normalize()
const targetCamPos = camDir.multiplyScalar(currentDistance * (1 / zoom))
// Shift slightly toward the planet's angular position
```

### Rule 5: onComplete callback

Only call `onComplete()` ONCE when the camera reaches its target (distance < 0.1). Use a guard ref to prevent multiple calls.

---

## STEP 3: Fix the animation integration in AstroWheel3D.tsx

**File**: `src/components/AstroWheel/AstroWheel3D.tsx`

### 3a: Move ReadingCameraController BEFORE OrbitControls

Currently (line 1739-1746), ReadingCameraController renders AFTER OrbitControls. This can cause conflicts because OrbitControls overwrites camera changes on every frame.

Move it to render BEFORE OrbitControls in the JSX order. But more importantly, when reading is active, the OrbitControls should have `enabled={false}`. Modify OrbitControls:

```tsx
<OrbitControls
  ref={controlsRef}
  enableRotate
  enableZoom={false}
  enablePan={false}
  autoRotate={tiltDone && rotationSpeed > 0 && !isTransitioning && !(readingAnimation?.isActive)}
  autoRotateSpeed={viewMode === 'heliocentric' ? 0.08 : 0.3 * rotationSpeed}
  enableDamping
  dampingFactor={0.05}
  minPolarAngle={0.3}
  maxPolarAngle={2.8}
  minAzimuthAngle={-Infinity}
  maxAzimuthAngle={Infinity}
  rotateSpeed={0.5}
  enabled={!(readingAnimation?.isActive)}
/>
```

Key change: Added `enabled={!(readingAnimation?.isActive)}` and added `!(readingAnimation?.isActive)` to the `autoRotate` condition.

### 3b: Ensure initial entrance animation is not affected

The `sceneReady`, `entranceComplete`, `tiltStarted`, `tiltDone` sequence MUST NOT be interrupted by reading state. Since reading can only be started AFTER the wheel is visible and interactive, this should be fine — but verify that `readingAnimation` is not defined during initial load.

The reading can only start when:
1. The user taps "✦ Cosmic Reading" — which isn't even rendered until the wheel is visible
2. `astroData` is loaded (button is disabled otherwise)

So the entrance animation should never conflict. But add a safety check:

In the WheelScene function, before passing `readingAnimation` to any animation components:
```typescript
// Don't apply reading animation during initial entrance
const safeReadingAnimation = entranceComplete ? readingAnimation : undefined
```

Use `safeReadingAnimation` instead of `readingAnimation` throughout.

### 3c: Ensure helio view is not affected

Reading is only available in geocentric view (the CosmicReadingButton hides in helio mode). But reading state might persist if the user switches views during a reading. Add a check:

In AstroWheel3D's WheelScene:
```typescript
// Force-clear reading animation in heliocentric view
const effectiveReadingAnimation = viewMode === 'geocentric' ? safeReadingAnimation : undefined
```

### 3d: Fix planet dim opacity

Check that the `readingDimOpacity` prop on PlanetOrb is handled correctly:
- When `readingDimOpacity` is `undefined` → render planet at full opacity (normal)
- When `readingDimOpacity` is a number → multiply planet's material opacity

The issue might be that `readingDimOpacity` is being set to `0.3` even when no reading is active (because `readingAnimation` exists but `isActive` is false).

Fix:
```typescript
const dimOpacity = effectiveReadingAnimation?.isActive
  ? (isHighlighted ? 1 : effectiveReadingAnimation.dimOpacity)
  : undefined  // MUST be undefined, not a number, when reading is not active
```

---

## STEP 4: Fix ReadingOverlay.tsx visual design

**File**: `src/features/cosmic-reading/components/ReadingOverlay.tsx`

The current overlay uses `fixed inset-0` which covers the full screen. The gradient backdrop `from-black/30 via-transparent to-black/80` is too heavy.

### Fix the overlay to be a bottom sheet, not full-screen block

```tsx
return (
  <div className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-500 ${
    state.status === 'EXITING' ? 'opacity-0' : 'opacity-100'
  }`}>
    {/* Subtle vignette — does NOT block wheel interaction */}
    <div className="absolute inset-0 pointer-events-none" 
      style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
      }}
    />

    {/* Close button — this IS interactive */}
    <button
      onClick={exitReading}
      className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-black/60 transition-all active:scale-90 pointer-events-auto"
      aria-label="Close reading"
    >
      ✕
    </button>

    {/* Content area — BOTTOM SHEET that slides up */}
    <div className="absolute bottom-0 left-0 right-0 pointer-events-auto"
      style={{ maxHeight: '45vh' }}
    >
      {showSummary && currentReading ? (
        <ReadingSummaryCard
          summary={currentReading.summary}
          frequencyPhase={frequencyPhase}
          isVisible={isSummaryVisible}
        />
      ) : showCard && currentPhase ? (
        <PhaseCard
          phase={currentPhase}
          isVisible={isCardVisible}
          phaseIndex={currentPhaseIndex}
          totalPhases={totalPhases}
        />
      ) : null}

      {(isCardVisible || isSummaryVisible) && (
        <div className="mt-3 px-4 pb-6 max-w-lg mx-auto">
          <PhaseNavigation
            onNext={nextPhase}
            onExit={exitReading}
            isLastPhase={isLastPhase}
            isSummary={showSummary}
          />
        </div>
      )}
    </div>
  </div>
)
```

Key changes:
- Root overlay is `pointer-events-none` — wheel interaction passes through
- Only the close button and bottom content area are `pointer-events-auto`
- Backdrop is a subtle radial vignette, not a heavy gradient
- Bottom content max height is `45vh` (not `65vh`) — more wheel visible
- The wheel remains fully interactive ABOVE the reading card

### Fix PhaseCard.tsx max height

In `PhaseCard.tsx`, reduce the card's max height to keep it compact:
```tsx
<div className="max-h-[40vh] overflow-y-auto ... ">
```

Hide scrollbar:
```css
.phase-card-scroll::-webkit-scrollbar { display: none; }
.phase-card-scroll { scrollbar-width: none; }
```

---

## STEP 5: Fix page.tsx integration

Check `src/app/page.tsx` for these specific issues:

### 5a: ReadingProvider wrapping

Ensure `ReadingProvider` wraps the content correctly and `astroData` is passed. Check for null safety — `readingAstroData` should only be non-null when `astroData` is fully loaded.

### 5b: ReadingDim wrapper

Phase C added a `ReadingDim` component that wraps the view toggle and day navigation. Verify:
- It uses `pointer-events-none` and `opacity-30` ONLY when `isReadingActive` is true
- When `isReadingActive` is false, it renders children with full opacity and normal pointer-events
- It doesn't accidentally break the day navigation or view toggle

### 5c: readingAnimation prop passing

Verify that the `readingAnimation` prop passed to `AstroWheel3DWrapper` is:
- `undefined` when no reading is active (NOT an object with `isActive: false`)
- A properly serialised object when reading IS active

If it's always passing an object (even with `isActive: false`), the scene may be processing it unnecessarily. Change to:

```typescript
const readingAnimationProp = readingAnimState?.isActive ? readingAnimState : undefined
```

---

## STEP 6: Verify — CRITICAL CHECKLIST

Test EVERY item. Do NOT skip any.

### Normal app functionality (NO reading active):
- [ ] Wheel loads with entrance animation (scale from 0, staggered planets)
- [ ] Initial cinematic tilt animation plays
- [ ] Auto-rotation works
- [ ] User can orbit (drag to rotate)
- [ ] Planet tap shows tooltip
- [ ] Zodiac sign tap shows tooltip
- [ ] Aspect tap shows tooltip
- [ ] Yesterday/Today/Tomorrow navigation works
- [ ] Today button always shows "Today" text
- [ ] Solar System View toggle works
- [ ] Heliocentric view: planets positioned correctly, animation works, time controls work
- [ ] Switching back to geocentric: wheel returns to normal
- [ ] Audio toggle works
- [ ] Settings panel works
- [ ] About modal works
- [ ] Birth chart CTA and modal work
- [ ] Earth tap shows Earth panel

### Reading flow:
- [ ] "✦ Cosmic Reading" button visible in geocentric view, hidden in helio
- [ ] Tap button → zodiac selector appears (if no profile) OR reading starts
- [ ] Reading overlay: wheel VISIBLE above the card (top ~55% of screen)
- [ ] Wheel planets still visible during reading (dimmed but visible)
- [ ] Camera smoothly glides to focus on Moon (first phase)
- [ ] Phase card slides up from bottom, doesn't cover entire screen
- [ ] "Next ✦" → camera smoothly glides to Sun (second phase)
- [ ] Card transitions smoothly between phases
- [ ] Aspect phases: line draws between planets
- [ ] Progress dots update correctly
- [ ] Summary card shows theme + keywords
- [ ] "Close ✦" → camera smoothly returns to original position
- [ ] After close: wheel is fully interactive again (orbit, tap, etc.)
- [ ] After close: auto-rotation resumes
- [ ] "✕" close at any point: clean exit, wheel restored

### Edge cases:
- [ ] Start reading, then tap "✕" during camera movement → clean exit
- [ ] Start reading immediately after page load → no conflict with entrance animation
- [ ] Reading active, then browser resize → no layout break
- [ ] Mobile: reading card scrollable, no horizontal overflow

---

## TECHNICAL CONSTRAINTS

- **No framer-motion** in Cosmic Reading components
- **Do NOT refactor existing camera controllers** (TiltAnimator, CameraDistanceAnimator, etc.) — only modify how ReadingCameraController coexists with them
- **Do NOT change AstroWheel3D's component structure** — only adjust props, conditions, and the order of animation component rendering
- **Git push**: `git push origin master:main` for Vercel deployment
- **Glass card rule**: Do NOT combine `transform: translateZ(0)` + `will-change: transform` + `overflow: hidden` + `isolation: isolate`
- **iOS Safari**: `-webkit-appearance: none`, `appearance: none`, `min-width: 0` on inputs
- **All scrollbars hidden**
