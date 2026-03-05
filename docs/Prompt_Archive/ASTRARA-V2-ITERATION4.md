# ASTRARA v2 — Iteration 4: Wheel Container & Rotation Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Two critical bugs from the last iteration need fixing. Read the current wheel component files before making changes.

---

## Bug 1: Wheel Clipped by Container

The 3D wheel is being cut off on the sides by its container. You can see the zodiac sign badges on the left and right edges getting cropped.

### Root Cause

The Canvas container has `overflow: hidden` (either explicitly or via a parent with constrained dimensions), and/or the container is too small relative to the wheel's rendered size.

### Fix

**Step 1**: Find the `<div>` wrapping the `<Canvas>` component. Remove ANY of these if present:
- `overflow: hidden`
- `overflow: clip`
- `border-radius` on the canvas container (this causes clipping on rounded corners)
- Explicit `width`/`height` that's too small

**Step 2**: Make the canvas container **full-width and generous in height**, with overflow visible:

```tsx
<div 
  className="relative w-full"
  style={{ 
    height: '95vw',           // generous height — nearly square on mobile
    maxHeight: '550px',       // cap on larger screens
    overflow: 'visible',      // CRITICAL: never clip the 3D scene
    touchAction: 'none',
  }}
>
  <Canvas
    camera={{ 
      position: [0, 1.5, 7],   // pulled back further, slightly above
      fov: 38,                  // narrow FOV for less edge distortion
    }}
    gl={{ alpha: true, antialias: true }}
    style={{ 
      background: 'transparent',
      overflow: 'visible',
    }}
  >
    ...
  </Canvas>
</div>
```

**Step 3**: Also check parent elements. Walk up the DOM tree from the canvas container and ensure NO ancestor has `overflow: hidden` that would clip the canvas. Common culprits:
- A layout wrapper with `overflow-hidden` Tailwind class
- A `<main>` or `<section>` with overflow constraints
- The page container itself

**Step 4**: If the wheel content (zodiac badges, planet labels) extends outside the 3D geometry bounds via `<Html>` drei overlays, these DOM elements can get clipped by the canvas container even if the 3D content wouldn't be. The fix: apply `overflow: visible` to the canvas container AND use `zIndexRange={[100, 0]}` on `<Html>` elements so they render above other page content.

---

## Bug 2: Wheel Rotation Over-Constrained

The previous iteration's OrbitControls settings locked the polar angle too tightly, so the user can only tilt the wheel very slightly up and down. The wheel should be **freely rotatable** in all directions — the user should be able to grab it and spin it around like a globe.

### Fix OrbitControls

```tsx
<OrbitControls
  enableRotate={true}
  enableZoom={false}          // keep zoom disabled for now
  enablePan={false}           // no panning — keep wheel centred
  
  autoRotate={true}           // slow auto-spin when idle
  autoRotateSpeed={0.3}       // gentle speed
  
  enableDamping={true}        // momentum on release
  dampingFactor={0.05}        // smooth deceleration
  
  // REMOVE or significantly widen polar angle constraints:
  minPolarAngle={0.3}         // allow almost full top-down view (about 17°)
  maxPolarAngle={2.8}         // allow almost full bottom-up view (about 160°)
  
  // Allow full horizontal rotation (azimuth) — NO constraints:
  minAzimuthAngle={-Infinity}
  maxAzimuthAngle={Infinity}
  
  // Smooth rotation speed
  rotateSpeed={0.5}           // slightly slower than default for precision
/>
```

### What this achieves:
- **Full 360° horizontal rotation** — user can spin the wheel freely left/right, like a potter's wheel
- **Wide vertical tilt** — user can look at the wheel from above, from the side, from slightly below
- **Auto-rotation still works** — wheel spins gently when untouched
- **Momentum/inertia** — flick to spin, it decelerates naturally
- **No panning or zooming** — the wheel stays centred in frame, you can only rotate it

### The experience should feel like:
1. Page loads → wheel slowly auto-rotates (mesmerising)
2. User touches/grabs → auto-rotation pauses, wheel follows finger/mouse
3. User flicks → wheel spins freely with momentum, gradually slows down
4. User lets go for ~3 seconds → auto-rotation gently resumes
5. User taps a planet (short press, no drag) → detail panel opens

---

## Additional: Ensure 3D Labels Don't Clip

The `<Html>` overlays from drei (zodiac sign badges, planet labels) render as actual DOM elements positioned over the canvas. These MUST NOT be clipped:

```tsx
<Html
  center
  distanceFactor={undefined}     // don't scale with distance
  zIndexRange={[100, 0]}          // ensure they render above other DOM
  style={{ 
    pointerEvents: 'none',        // for labels (not tap targets)
    overflow: 'visible',
  }}
  // Prevent occlusion (labels hiding behind geometry):
  occlude={false}
>
  ...
</Html>
```

For the planet TAP TARGET overlays (the invisible clickable buttons), keep `pointerEvents: 'auto'`.

---

## Build Steps

1. Read the current wheel component and its parent layout
2. Fix the canvas container — remove overflow clipping, increase dimensions
3. Check all parent elements for overflow hidden
4. Fix OrbitControls — widen rotation constraints as specified above
5. Verify Html overlays have overflow visible and correct zIndexRange
6. Test: can you freely rotate the wheel in all directions?
7. Test: are all zodiac badges and planet labels visible without clipping?
8. Test: does planet tap still work reliably?
9. Test on mobile viewport (375px) — wheel fits with no cropping
10. Run `npm run build`
11. Commit: `fix: wheel container overflow clipping and rotation constraints`
