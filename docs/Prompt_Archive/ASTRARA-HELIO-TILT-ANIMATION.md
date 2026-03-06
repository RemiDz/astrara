# ASTRARA — Heliocentric Fix: View Tilt Animations

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

The astro wheel has a default tilt angle when it loads (approximately 35° — a slight 3D perspective). When switching to heliocentric solar system view, the final result should be a flat top-down 2D view. When switching back, it should return to the original tilt.

Read all current wheel, camera, and OrbitControls source files to find the exact default tilt angle before making changes.

---

## What to Do

### 1. Find the Default Geocentric Tilt

Search the code for the initial camera position or OrbitControls polar angle that creates the wheel's default 3D tilt on page load. It might be:
- A camera `position.y` value
- An OrbitControls `polarAngle` or `minPolarAngle` / `maxPolarAngle`
- A group `rotation.x` value

Whatever it is, note this as `GEO_TILT` — the angle to return to.

### 2. Add Tilt Animation to the Transition

**Going to heliocentric (solar system view):**

After Phase 3 of the existing transition (planets have settled, orbital rings visible), add a FINAL phase:

- **Phase 4 (transition progress 0.9–1.0):** Smoothly tilt the view from the current angle to perfectly flat top-down (0° tilt — looking straight down at the orbital plane)

If the tilt is controlled by camera position:
```typescript
// Lerp camera to top-down position
// Top-down means camera is directly above: position (0, height, 0) looking at (0, 0, 0)
```

If the tilt is controlled by OrbitControls polar angle:
```typescript
// Lerp polarAngle toward Math.PI / 2 (or 0, depending on convention) for flat top-down
```

If the tilt is controlled by a group rotation:
```typescript
// Lerp rotation.x toward 0 for flat view
```

The tilt animation should take approximately 800ms and use smooth easing — not linear. It happens at the END of the transition, after planets have finished moving.

**Going back to geocentric (astro wheel view):**

At the START of the reverse transition (before planets begin moving back):

- **Reverse Phase 0 (transition progress 1.0–0.9):** Smoothly tilt back from flat top-down to the original `GEO_TILT` angle

The tilt-back should complete BEFORE zodiac elements start fading in, so the wheel is at its proper perspective angle when the zodiac ring reappears.

### 3. Implementation

Add the tilt to the existing `useFrame` transition logic. Map it to the transition progress:

```typescript
useFrame(() => {
  const p = transitionProgress.current

  // ... existing phase calculations ...

  // Tilt calculation
  // p = 0: full geo tilt (GEO_TILT)
  // p = 1: flat top-down (HELIO_TILT = 0 or Math.PI/2 depending on convention)
  
  // Only tilt in the last 10% going forward, first 10% going back
  const tiltProgress = clamp01((p - 0.85) / 0.15)  // 0 at p=0.85, 1 at p=1.0
  const smoothTilt = smoothstep(tiltProgress)
  
  const currentTilt = GEO_TILT + (HELIO_TILT - GEO_TILT) * smoothTilt
  
  // Apply to whatever controls the tilt (camera, controls, or group rotation)
  // Example if it's a group rotation:
  // wheelGroup.rotation.x = currentTilt
  
  // Example if it's OrbitControls polar angle:
  // controls.setPolarAngle(currentTilt)
  
  // Example if it's camera position (orbiting around the scene):
  // camera.position.y = cameraDistance * Math.cos(currentTilt)
  // camera.position.z = cameraDistance * Math.sin(currentTilt)
  // camera.lookAt(0, 0, 0)
})
```

### 4. Lock Controls During Tilt

While the tilt animation is playing, temporarily prevent user drag from overriding the tilt. If using OrbitControls, either:
- Disable OrbitControls during the tilt portion of the transition
- Or set `minPolarAngle = maxPolarAngle = currentTilt` during tilt, then release after

---

## Do NOT

- Do NOT change any planet positions, sizes, or colours
- Do NOT change transition Phase 1–3 timing
- Do NOT change orbital rings, labels, or toggle button
- Do NOT change the default geocentric tilt on initial page load
- Do NOT change any geocentric wheel functionality

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: page loads — wheel has its normal 3D tilt (unchanged)
3. Test: toggle to heliocentric → planets move, THEN view slowly flattens to top-down 2D
4. Test: heliocentric view is perfectly flat — looking straight down at the orbital plane
5. Test: toggle back → view tilts back to 3D perspective FIRST, then zodiac fades in
6. Test: after returning to geocentric, the tilt angle matches the initial page load angle exactly
7. Test: drag/rotate still works after transition completes in both views
8. Commit: `feat: heliocentric tilts to flat 2D, geocentric returns to 3D perspective`
9. Push to `main`
