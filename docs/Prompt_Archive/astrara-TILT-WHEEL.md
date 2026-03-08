# Astrara — Tilt Wheel Down: Adjust Camera Target

Do NOT ask for confirmation at any step. Just do it.

---

In `src/components/AstroWheel/AstroWheel3D.tsx`, find the reading mode camera code that was added in the previous fix. It has a `useFrame` block that lerps `cam.position.y` and `cam.position.z` during reading.

Add a line to also lerp the OrbitControls **target** Y position downward. This tilts the camera's gaze down, making the wheel fill the empty space above.

Find:
```typescript
if (readingCamActive) {
  // Lerp camera to reading position
  cam.position.y += (1.0 - cam.position.y) * 0.05
  cam.position.z += (6.5 - cam.position.z) * 0.05
  controlsRef.current.update()
}
```

Change to:
```typescript
if (readingCamActive) {
  // Lerp camera to reading position
  cam.position.y += (1.0 - cam.position.y) * 0.05
  cam.position.z += (6.5 - cam.position.z) * 0.05
  // Tilt view down — target Y goes negative so camera looks downward at wheel
  controlsRef.current.target.y += (-0.4 - controlsRef.current.target.y) * 0.05
  controlsRef.current.update()
}
```

Also save and restore the target Y. Find where `savedY` and `savedZ` are saved:
```typescript
if (readingCamActive && !readingCamRef.current.wasActive) {
  readingCamRef.current.wasActive = true
  readingCamRef.current.savedY = cam.position.y
  readingCamRef.current.savedZ = cam.position.z
}
```

Change to:
```typescript
if (readingCamActive && !readingCamRef.current.wasActive) {
  readingCamRef.current.wasActive = true
  readingCamRef.current.savedY = cam.position.y
  readingCamRef.current.savedZ = cam.position.z
  readingCamRef.current.savedTargetY = controlsRef.current.target.y
}
```

And in the restore block, also restore target Y:
```typescript
if (!readingCamActive && readingCamRef.current.wasActive) {
  const dy = Math.abs(cam.position.y - readingCamRef.current.savedY)
  const dz = Math.abs(cam.position.z - readingCamRef.current.savedZ)
  cam.position.y += (readingCamRef.current.savedY - cam.position.y) * 0.05
  cam.position.z += (readingCamRef.current.savedZ - cam.position.z) * 0.05
  controlsRef.current.target.y += (readingCamRef.current.savedTargetY - controlsRef.current.target.y) * 0.05
  controlsRef.current.update()
  if (dy < 0.05 && dz < 0.05) {
    cam.position.y = readingCamRef.current.savedY
    cam.position.z = readingCamRef.current.savedZ
    controlsRef.current.target.y = readingCamRef.current.savedTargetY
    readingCamRef.current.wasActive = false
    controlsRef.current.update()
  }
}
```

Update the ref type to include `savedTargetY`:
```typescript
const readingCamRef = useRef({ wasActive: false, savedY: 1.5, savedZ: 7, savedTargetY: 0 })
```

---

That's it. The key change is `controlsRef.current.target.y` lerping to `-0.4` during reading. If the tilt is too much, change `-0.4` to `-0.2`. If not enough, try `-0.6`.

Git push: `git push origin master:main`
