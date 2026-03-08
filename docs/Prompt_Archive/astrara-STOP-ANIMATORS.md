# Astrara — Stop Camera Animators During Reading

Do NOT ask for confirmation at any step. Just do it. Use ultrathink.

---

## The Problem

When reading starts, the camera moves to the correct position. But then existing camera animators (`TiltAnimator`, `RotationVelocityTracker`, auto-rotation, or the `HelioTiltAnimator`) continue running and overwrite the reading camera position, flattening the wheel to a horizontal tilt.

## The Fix

Every camera animator in AstroWheel3D.tsx must check if reading is active and SKIP its logic when it is.

---

## In `src/components/AstroWheel/AstroWheel3D.tsx`:

### 1. Pass `readingAnimation` to WheelScene

Check that `readingAnimation` is available inside the `WheelScene` function. It should be part of the props passed via `<WheelScene {...props} ...>`. Verify this is the case.

### 2. Find TiltAnimator

Search for `TiltAnimator` in the file. It's a component that animates the initial cinematic tilt after the scene loads. Find its `useFrame` block.

Add an early return when reading is active. TiltAnimator receives props — add `readingActive` as a prop, or access it from the parent. The simplest approach: add a prop.

Where TiltAnimator is used in the JSX:
```tsx
<TiltAnimator controlsRef={controlsRef} tiltStarted={tiltStarted} onTiltDone={handleTiltDone} />
```

Change to:
```tsx
<TiltAnimator controlsRef={controlsRef} tiltStarted={tiltStarted} onTiltDone={handleTiltDone} readingActive={readingAnimation?.isActive ?? false} />
```

Inside TiltAnimator's `useFrame`:
```typescript
useFrame(() => {
  if (readingActive) return  // Don't touch camera during reading
  // ... existing tilt logic
})
```

### 3. Find CameraDistanceAnimator

Search for `CameraDistanceAnimator`. Same treatment:

Where used:
```tsx
<CameraDistanceAnimator transitionProgress={transitionProgress} />
```

Change to:
```tsx
<CameraDistanceAnimator transitionProgress={transitionProgress} readingActive={readingAnimation?.isActive ?? false} />
```

Inside its `useFrame`:
```typescript
useFrame(() => {
  if (readingActive) return
  // ... existing logic
})
```

### 4. Find HelioTiltAnimator

Search for `HelioTiltAnimator`. Same treatment:

```tsx
<HelioTiltAnimator controlsRef={controlsRef} transitionProgress={transitionProgress} readingActive={readingAnimation?.isActive ?? false} />
```

Inside its `useFrame`:
```typescript
useFrame(() => {
  if (readingActive) return
  // ... existing logic
})
```

### 5. Find RotationVelocityTracker

Search for `RotationVelocityTracker`. Same treatment:

```tsx
<RotationVelocityTracker prevAzimuth={prevAzimuth} onRotationVelocity={onRotationVelocity} readingActive={readingAnimation?.isActive ?? false} />
```

Inside its `useFrame`:
```typescript
useFrame(() => {
  if (readingActive) return
  // ... existing logic
})
```

### 6. OrbitControls auto-rotate

Already handled — we set `autoRotate` to false during reading. Verify this is still in place:
```tsx
autoRotate={tiltDone && rotationSpeed > 0 && !isTransitioning && !(readingAnimation?.isActive)}
```

### 7. Any other useFrame blocks

Search the entire file for `useFrame`. For EVERY `useFrame` that modifies `camera.position`, `camera.rotation`, `controlsRef.current.target`, or calls `controlsRef.current.update()` — add the `readingActive` guard at the top.

Do NOT add the guard to useFrame blocks that animate planet positions, materials, scale, or non-camera things. Only camera-related useFrame blocks.

---

## VERIFICATION

- [ ] Reading starts → wheel moves to reading position and STAYS THERE
- [ ] Wheel does NOT tilt, rotate, or animate away from the reading position
- [ ] The view remains stable throughout the entire reading session
- [ ] After reading exits → wheel smoothly returns to its normal tilted view
- [ ] After exit → tilt, rotation, and all camera animations resume normally

## DO NOT CHANGE camera target values, container styles, or anything else.

Git push: `git push origin master:main`
