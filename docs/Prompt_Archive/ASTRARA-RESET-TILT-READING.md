# Astrara — Fix: Reset Wheel Tilt to Default on Cosmic Reading Enter

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## ISSUE

If the user tilts the Astro Wheel to a flat 2D view (or any non-default angle) and then enters Cosmic Reading, the wheel stays stuck at that angle. In 2D view it overflows top and bottom, doesn't fit the viewport, and looks broken with the reading modal.

## EXPECTED BEHAVIOUR

When Cosmic Reading opens, the wheel should **smoothly animate** back to its default 3D tilted perspective (the same angle shown on first app load), regardless of where the user left it.

When Cosmic Reading closes, the wheel should **stay at the default tilt** (do NOT restore the user's previous custom angle — that would re-trigger the overflow problem if they return to reading).

## FIX

### Step 1: Identify the Default Camera/Polar Angle

Find what the default polar angle is when the app first loads. Search:

```bash
grep -rn "polarAngle\|minPolarAngle\|maxPolarAngle\|camera.position" src/
grep -rn "initialPosition\|defaultPosition\|DEFAULT_POLAR\|DEFAULT_CAMERA" src/
```

Store this as a constant if it isn't already:

```typescript
const DEFAULT_POLAR_ANGLE = /* whatever the initial tilt is, e.g. Math.PI / 3 or ~1.05 radians */;
```

### Step 2: Animate to Default on Reading Enter

When reading state transitions from `IDLE` to any active state, smoothly animate the camera's polar angle to the default value.

**Do NOT snap instantly** — use a smooth animation over ~800ms.

#### Option A: Animate via OrbitControls (Preferred)

If using drei's `<OrbitControls>`, you can animate the polar angle by lerping in `useFrame`:

```typescript
const controlsRef = useRef<OrbitControls>(null);
const isAnimatingToDefault = useRef(false);

// When reading activates:
useEffect(() => {
  if (isReadingActive) {
    isAnimatingToDefault.current = true;
  }
}, [isReadingActive]);

// In useFrame:
useFrame((_, delta) => {
  if (!controlsRef.current || !isAnimatingToDefault.current) return;
  
  const controls = controlsRef.current;
  const currentPolar = controls.getPolarAngle();
  const target = DEFAULT_POLAR_ANGLE;
  
  // Lerp toward target
  const speed = 3; // adjust for smoothness — higher = faster
  const newPolar = THREE.MathUtils.lerp(currentPolar, target, 1 - Math.exp(-speed * delta));
  
  // Apply by temporarily unlocking polar limits
  controls.minPolarAngle = newPolar;
  controls.maxPolarAngle = newPolar;
  controls.update();
  
  // Check if close enough to target
  if (Math.abs(newPolar - target) < 0.01) {
    // Snap to exact target and lock
    controls.minPolarAngle = target;
    controls.maxPolarAngle = target;
    controls.update();
    isAnimatingToDefault.current = false;
  }
});
```

#### Option B: Animate Camera Position Directly

If OrbitControls polar angle manipulation is tricky, you can instead animate the camera position on a spherical path:

```typescript
// Convert current camera position to spherical coordinates
// Lerp the phi (polar) component toward default
// Convert back to cartesian and set camera position
// Call controls.update()
```

**Use Option A first.** Only fall back to Option B if A causes issues.

### Step 3: Lock Polar Angle AFTER Animation Completes

The previous fix (horizontal spin during reading) already locks the polar angle. Make sure the lock happens AFTER the tilt animation finishes, not before — otherwise the animation fights the lock.

Sequence:
1. Reading activates
2. Start polar angle animation toward default (unlock polar temporarily)
3. Animation reaches target (~800ms)
4. Lock polar angle at default value (set min = max = DEFAULT_POLAR_ANGLE)
5. User can now spin horizontally only

### Step 4: Also Reset Azimuthal Angle (Optional but Recommended)

Consider also resetting the horizontal rotation to a default position so the reading always starts with the same "front-facing" view of the wheel. This ensures the Moon (first reading phase after summary) is always visible when the reading begins.

If implementing this, animate both polar AND azimuthal simultaneously:

```typescript
const DEFAULT_AZIMUTHAL_ANGLE = 0; // or whatever the initial rotation is

// Lerp azimuthal in the same useFrame callback
const currentAzimuthal = controls.getAzimuthalAngle();
const newAzimuthal = THREE.MathUtils.lerp(currentAzimuthal, DEFAULT_AZIMUTHAL_ANGLE, 1 - Math.exp(-speed * delta));
```

### Step 5: On Reading Exit

When reading closes, do NOT animate back to the user's previous angle. Just unlock the polar limits back to their normal range and let the user interact freely:

```typescript
// On reading exit:
controls.minPolarAngle = NORMAL_MIN_POLAR; // original app limits
controls.maxPolarAngle = NORMAL_MAX_POLAR;
// Azimuthal: already unrestricted
```

---

## TESTING

- [ ] Tilt wheel to full 2D (top-down) → enter Cosmic Reading → wheel smoothly animates to default 3D tilt (~800ms)
- [ ] Tilt wheel to extreme side angle → enter Cosmic Reading → wheel smoothly resets
- [ ] Wheel at default angle → enter Cosmic Reading → no visible jump (already correct)
- [ ] Animation is smooth, no snapping or jerking
- [ ] After animation: horizontal spin works, vertical tilt is locked (previous fix)
- [ ] Exit Cosmic Reading → can tilt wheel freely again
- [ ] Wheel shift-up (translateY fix) and tilt reset work together without conflict
- [ ] No camera jump or flash at the start of animation
- [ ] Test on mobile — animation runs at consistent speed
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: animate wheel tilt to default 3D perspective when entering Cosmic Reading"
git push origin master:main
```
