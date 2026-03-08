# Astrara — Fix: Reading Camera Must Control Full Position

Do NOT ask for confirmation at any step. Just do it. Use ultrathink.

---

## The Problem

The reading camera code (line 1639-1644) only lerps `cam.position.y` and `cam.position.z`, leaving `cam.position.x` unchanged. When `CameraDistanceAnimator` resumes after reading (it uses `camera.position.normalize().multiplyScalar()`), it recalculates the entire position vector from the modified Y/Z values, causing X to drift and the wheel to appear shifted/wider.

## The Fix

The reading camera must save and restore the COMPLETE camera position (x, y, z) and lerp ALL THREE components.

---

## In `src/components/AstroWheel/AstroWheel3D.tsx`:

Find the reading camera block (around line 1624-1662). Replace the ENTIRE block with:

```typescript
// Reading mode camera reframing — manipulate through OrbitControls' own object
const readingCamActive = readingAnimation?.isActive ?? false
const readingCamRef = useRef({
  wasActive: false,
  savedPos: new THREE.Vector3(0, 1.5, 7),
  savedTarget: new THREE.Vector3(0, 0, 0),
})

useFrame(() => {
  if (!controlsRef.current) return
  const cam = controlsRef.current.object

  // Just entered reading — save full camera state
  if (readingCamActive && !readingCamRef.current.wasActive) {
    readingCamRef.current.wasActive = true
    readingCamRef.current.savedPos.copy(cam.position)
    readingCamRef.current.savedTarget.copy(controlsRef.current.target)
  }

  // During reading — lerp to reading framing
  if (readingCamActive) {
    // Target camera position: same X as saved (keep centred), lower Y (wheel higher), same Z
    const targetPos = readingCamRef.current.savedPos.clone()
    targetPos.y = readingCamRef.current.savedPos.y - 0.5  // Shift camera down = wheel appears higher
    
    cam.position.lerp(targetPos, 0.05)
    
    // Tilt view: target looks slightly lower
    const targetLookAt = readingCamRef.current.savedTarget.clone()
    targetLookAt.y = readingCamRef.current.savedTarget.y - 0.4
    
    controlsRef.current.target.lerp(targetLookAt, 0.05)
    controlsRef.current.update()
  }

  // Exiting reading — lerp back to saved state
  if (!readingCamActive && readingCamRef.current.wasActive) {
    cam.position.lerp(readingCamRef.current.savedPos, 0.05)
    controlsRef.current.target.lerp(readingCamRef.current.savedTarget, 0.05)
    controlsRef.current.update()
    
    if (cam.position.distanceTo(readingCamRef.current.savedPos) < 0.05) {
      cam.position.copy(readingCamRef.current.savedPos)
      controlsRef.current.target.copy(readingCamRef.current.savedTarget)
      readingCamRef.current.wasActive = false
      controlsRef.current.update()
    }
  }
})
```

Key differences from the old code:
1. Saves FULL position as `THREE.Vector3` (not just Y and Z numbers)
2. Target camera position is calculated RELATIVE to saved position (`savedPos.y - 0.5`) — preserves X
3. Uses `cam.position.lerp(targetPos)` which lerps all three components together
4. Uses `controlsRef.current.target.lerp()` for smooth target transition
5. Restore uses `distanceTo` on full vector, restores with `.copy()`

The reading camera shifts down by 0.5 units from wherever it currently is, and tilts the look-at target down by 0.4 units. This makes the wheel appear higher without changing X or the overall distance.

---

## VERIFICATION

- [ ] During reading: wheel shifts up to fill empty space — no empty gap above
- [ ] During reading: wheel stays CENTRED horizontally — no left/right drift
- [ ] During reading: wheel does NOT expand wider than the screen
- [ ] Camera transition is smooth
- [ ] After reading exits: wheel returns to exact original position and angle
- [ ] After exit: orbit, auto-rotation work normally
- [ ] Solar System View still works

## DO NOT CHANGE anything else in the file.

Git push: `git push origin master:main`
