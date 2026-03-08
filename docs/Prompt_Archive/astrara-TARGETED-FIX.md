# Astrara — Targeted Fix: Wheel Container Height + Glow

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## TWO FIXES. NOTHING ELSE.

---

## FIX 1: Reduce the wheel container height during Cosmic Reading

### The Problem

The wheel container is a square: `height: '95vw', maxHeight: '550px'`. On a 390px-wide iPhone, that's 370px tall. But the actual 3D wheel (a tilted ellipse) only fills the vertical centre of this square — roughly the middle 60%. The top ~20% and bottom ~20% are empty black space inside the Canvas. This creates the illusion of a "gap" between the header and the wheel, but it's actually empty space within the 3D scene's container.

### The Fix

When Cosmic Reading is active, reduce the container height to crop the empty space above and below the wheel. The wheel itself doesn't move or shrink — we just show less of the empty area around it.

In `src/components/AstroWheel/AstroWheel3D.tsx`, find the root container div of the exported `AstroWheel3D` component (the `export default function AstroWheel3D` near the bottom of the file). It has:

```tsx
<div
  className="relative w-full select-none"
  style={{
    height: '95vw',
    maxHeight: '550px',
    ...
  }}
>
```

This component needs to know if reading is active. It already receives `readingAnimation` as a prop. Use it:

```tsx
const isReadingMode = props.readingAnimation?.isActive === true

<div
  className="relative w-full select-none"
  style={{
    height: isReadingMode ? '65vw' : '95vw',
    maxHeight: isReadingMode ? '380px' : '550px',
    overflowX: 'hidden',
    overflowY: 'hidden',   // Clip the empty top/bottom of the 3D scene
    touchAction: 'none',
    background: 'transparent',
    transition: 'height 0.5s ease-out, max-height 0.5s ease-out',
    WebkitTapHighlightColor: 'transparent',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    outline: 'none',
  }}
>
```

Key changes:
- Height goes from `95vw` → `65vw` during reading (crops ~30% of empty space)
- maxHeight from `550px` → `380px`
- `overflowY: 'hidden'` clips the empty areas instead of showing them
- `transition` on height for smooth resizing when reading starts/ends

### Important: The Canvas inside must still fill the ORIGINAL size

The inner Canvas wrapper div currently has `style={{ ... width: '100%', height: '100%', position: 'absolute', inset: 0 }}`. When we shrink the outer container, the Canvas will shrink too, which would shrink the wheel.

To prevent this: make the Canvas wrapper maintain the ORIGINAL height and vertically centre within the smaller container:

```tsx
<div style={{
  opacity: sceneReady ? 1 : 0,
  width: '100%',
  height: '95vw',          // Keep original height
  maxHeight: '550px',       // Keep original max
  position: 'absolute',
  left: 0,
  top: '50%',              // Centre vertically in the cropped container
  transform: 'translateY(-50%)',
}}>
  <Canvas ...>
```

This way:
- The outer container crops to 65vw (hiding empty space)
- The Canvas stays at 95vw (wheel renders at full size)
- The Canvas is vertically centred, so the wheel (which sits in the middle) stays visible
- The empty top and bottom portions are clipped by the outer container's `overflow: hidden`

When reading exits, the outer container smoothly expands back to 95vw, revealing the full scene again.

**Note**: the `transform: 'translateY(-50%)'` on the Canvas wrapper is SAFE because it's on the wrapper div INSIDE the container, not on a parent of the Canvas. The Canvas element itself is not transformed.

---

## FIX 2: Fix the planet highlight glow

### If the giant white blob from the previous fix is still present:

In `src/features/cosmic-reading/animation/PlanetHighlight.tsx`, set these exact values for the glow mesh:

```typescript
// Glow sphere geometry — slightly larger than the planet
const glowScale = planetRadius * 1.8

// Glow material
<meshBasicMaterial
  color={glowColor}           // Planet's own colour, no brightening
  transparent={true}
  opacity={0.25}
  blending={THREE.AdditiveBlending}
  depthWrite={false}
  side={THREE.FrontSide}
/>
```

Remove:
- Any `emissiveIntensity` above 1.0 — set to `0.8` if using MeshStandardMaterial, or remove if using MeshBasicMaterial
- Any `baseColor.multiplyScalar()` calls — use the colour as-is
- Any secondary/outer glow mesh — only ONE glow per planet
- Any scale value above 2.0 on the glow sphere

Pulse animation:
```typescript
const pulseScale = 1.5 + Math.sin(elapsed * 1.5) * 0.2  // Gentle: 1.3x to 1.7x
```

### If the glow was already reverted to reasonable values, skip this fix.

---

## VERIFICATION

- [ ] During reading: the gap between header and wheel top is significantly reduced (the wheel appears much closer to the header)
- [ ] The wheel itself is the SAME SIZE as before — not shrunk
- [ ] The wheel is vertically centred in its container — not cut off at top or bottom
- [ ] When reading exits, the container smoothly expands and the full scene is visible again
- [ ] Planet glow is a soft halo, not a blob
- [ ] No horizontal overflow
- [ ] No regressions to wheel interaction, tooltips, or any other functionality

## DO NOT CHANGE ANYTHING ELSE

Do not modify ReadingOverlay, PhaseCard, transitions, buttons, translations, or camera. Only the two fixes above.

Git push: `git push origin master:main`
