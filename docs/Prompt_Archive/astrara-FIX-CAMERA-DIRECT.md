# Astrara — Fix Camera: Direct Approach

Do NOT ask for confirmation at any step. Just do it. Use ultrathink.

---

## The Problem

ReadingCameraFramer's lerp is not working — likely because OrbitControls is overwriting the camera position every frame, even when `enabled={false}` (OrbitControls can still update the camera in some versions of drei).

## The Fix

Delete ReadingCameraFramer entirely. Instead, handle camera reframing directly inside the existing OrbitControls by changing its **target** and the **camera position** together.

---

## Step 1: Delete ReadingCameraFramer

Delete the file `src/features/cosmic-reading/animation/ReadingCameraFramer.tsx`.

In `src/components/AstroWheel/AstroWheel3D.tsx`:
- Remove the import: `import ReadingCameraFramer from '@/features/cosmic-reading/animation/ReadingCameraFramer'`
- Remove the usage: `<ReadingCameraFramer isActive={readingAnimation?.isActive ?? false} />`

## Step 2: Handle camera in WheelScene directly

In `AstroWheel3D.tsx`, find the `WheelScene` function component (the large function that contains all the scene content and returns the JSX with `<OrbitControls>`).

Add this code INSIDE WheelScene, before the return statement:

```typescript
// Reading mode camera reframing
const readingCamActive = readingAnimation?.isActive ?? false
const readingCamRef = useRef({ wasActive: false, savedY: 1.5, savedZ: 7 })

useFrame(() => {
  if (!controlsRef.current) return
  const cam = controlsRef.current.object
  
  if (readingCamActive && !readingCamRef.current.wasActive) {
    // Just entered reading — save current camera state
    readingCamRef.current.wasActive = true
    readingCamRef.current.savedY = cam.position.y
    readingCamRef.current.savedZ = cam.position.z
  }
  
  if (readingCamActive) {
    // Lerp camera to reading position
    cam.position.y += (1.0 - cam.position.y) * 0.05
    cam.position.z += (6.5 - cam.position.z) * 0.05
    controlsRef.current.update()
  }
  
  if (!readingCamActive && readingCamRef.current.wasActive) {
    // Lerp back to saved position
    const dy = Math.abs(cam.position.y - readingCamRef.current.savedY)
    const dz = Math.abs(cam.position.z - readingCamRef.current.savedZ)
    cam.position.y += (readingCamRef.current.savedY - cam.position.y) * 0.05
    cam.position.z += (readingCamRef.current.savedZ - cam.position.z) * 0.05
    controlsRef.current.update()
    if (dy < 0.05 && dz < 0.05) {
      cam.position.y = readingCamRef.current.savedY
      cam.position.z = readingCamRef.current.savedZ
      readingCamRef.current.wasActive = false
      controlsRef.current.update()
    }
  }
})
```

This manipulates the camera through OrbitControls' own `.object` reference, then calls `controlsRef.current.update()` — this is the correct way to move the camera when OrbitControls is present. OrbitControls won't fight back because we're updating through its own API.

**Target values:** Y=1.0 (down from default 1.5 — wheel shifts up moderately), Z=6.5 (slightly closer — subtle zoom). Adjust these two numbers if needed.

## Step 3: Make sure controlsRef exists

Verify that `controlsRef` is already defined in WheelScene as a ref to OrbitControls:

```typescript
const controlsRef = useRef<any>(null)  // or similar
```

And that `<OrbitControls ref={controlsRef} ...>` passes the ref. This should already be the case from the existing code.

## Step 4: Keep OrbitControls disabled during reading

The existing changes to OrbitControls should still be in place:
```tsx
enabled={!(readingAnimation?.isActive)}
```

This prevents the user from orbiting during reading, but OrbitControls still tracks the camera internally.

---

## VERIFICATION

- [ ] During reading: wheel shifts up slightly — less empty space above
- [ ] During reading: wheel is NOT cut off on any side
- [ ] Camera transition is smooth (not a jump)
- [ ] After reading exits: camera smoothly returns to original position
- [ ] After exit: orbit and auto-rotation work normally
- [ ] No CSS or container changes made

## DO NOT CHANGE anything else.

Git push: `git push origin master:main`
