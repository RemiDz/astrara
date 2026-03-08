# Astrara — Fix Wasted Space: Reframe Camera During Reading

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## ONE FIX ONLY

When Cosmic Reading is active, adjust the 3D camera to frame the wheel tighter — eliminating the empty space above the wheel. When reading exits, smoothly restore the camera to its original position.

This is a Three.js camera change INSIDE the Canvas. No CSS changes. No container changes. No overflow changes.

---

## Create `src/features/cosmic-reading/animation/ReadingCameraFramer.tsx`:

```tsx
'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  isActive: boolean
}

// During reading, reposition camera to frame the wheel higher in view
// This eliminates the empty black space above the wheel
const READING_CAMERA_POS = new THREE.Vector3(0, 0.5, 6.2)   // Lower Y = wheel appears higher, closer Z = slight zoom
const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 1.5, 7)      // Must match the Canvas camera prop

export default function ReadingCameraFramer({ isActive }: Props) {
  const { camera } = useThree()
  const savedPos = useRef<THREE.Vector3 | null>(null)
  const wasActive = useRef(false)

  useFrame(() => {
    // Just started reading — save current camera position
    if (isActive && !wasActive.current) {
      wasActive.current = true
      savedPos.current = camera.position.clone()
    }

    // Just stopped reading — begin restoring
    if (!isActive && wasActive.current) {
      // Keep lerping back until close enough
      const target = savedPos.current || DEFAULT_CAMERA_POS
      camera.position.lerp(target, 0.06)
      if (camera.position.distanceTo(target) < 0.05) {
        camera.position.copy(target)
        wasActive.current = false
        savedPos.current = null
      }
      return
    }

    // During reading — lerp toward the tighter framing position
    if (isActive) {
      camera.position.lerp(READING_CAMERA_POS, 0.04)
    }
  })

  return null
}
```

**Key values:**
- Default camera: `[0, 1.5, 7]` with `fov: 38` — this is what the Canvas camera prop is set to
- Reading camera: `[0, 0.5, 6.2]` — Y drops from 1.5 to 0.5 (wheel appears higher), Z drops from 7 to 6.2 (slight zoom in)
- Lerp speed: 0.04 (smooth, takes ~1 second)

These values may need tuning. If the wheel still has too much space above, reduce Y further (try 0.3). If it's too zoomed, increase Z (try 6.5).

---

## Add ReadingCameraFramer to AstroWheel3D.tsx:

Add the import at the top:
```typescript
import ReadingCameraFramer from '@/features/cosmic-reading/animation/ReadingCameraFramer'
```

Add the component inside the Canvas scene, BEFORE `<OrbitControls>`. Find where the existing reading glow component is rendered (`<PlanetGlow>`) and add it nearby:

```tsx
{/* Reading camera framing — shifts camera to eliminate empty space above wheel */}
<ReadingCameraFramer isActive={readingAnimation?.isActive ?? false} />
```

**Also: disable OrbitControls during reading** so the user's touch doesn't fight the camera reframing. Find the `<OrbitControls>` component and add `enabled`:

```tsx
<OrbitControls
  ref={controlsRef}
  enableRotate
  enableZoom={false}
  enablePan={false}
  autoRotate={tiltDone && rotationSpeed > 0 && !isTransitioning && !(readingAnimation?.isActive)}
  autoRotateSpeed={viewMode === 'heliocentric' ? 0.08 : 0.3 * rotationSpeed}
  enabled={!(readingAnimation?.isActive)}
  // ... rest of existing props unchanged
/>
```

Two additions to OrbitControls:
1. `enabled={!(readingAnimation?.isActive)}` — disables orbit during reading
2. Add `!(readingAnimation?.isActive)` to the `autoRotate` condition — stops auto-rotation during reading

---

## VERIFICATION

- [ ] During reading: the wheel appears HIGHER in the frame — significantly less empty space above
- [ ] During reading: the wheel is slightly zoomed in (fills more of the visible area)
- [ ] The camera transition is smooth (not a jump)
- [ ] When reading exits: camera smoothly returns to its original position
- [ ] After exit: orbit, auto-rotation, and all wheel interaction works normally
- [ ] Wheel is NOT clipped on any side
- [ ] No CSS or container changes were made

## DO NOT CHANGE anything about the wheel container, overflow, or Canvas wrapper.

Git push: `git push origin master:main`
