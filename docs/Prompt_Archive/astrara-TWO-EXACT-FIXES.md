# Astrara — Two Exact Fixes: Moon Glow Blob + Right Side Overflow

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## FIX 1: The planet highlight glow is STILL a giant blob

Open `src/features/cosmic-reading/animation/PlanetHighlight.tsx`.

The glow mesh for highlighted planets is far too large and opaque. The Moon currently looks like a giant white circle covering nearby planets.

**Find every glow mesh in this file and apply ALL of the following changes:**

A. Find the glow sphere geometry. Whatever the current `args` or `scale` value is for the glow sphere, change it so the glow radius is exactly `planetRadius * 1.4` — where `planetRadius` is the radius of the planet it's highlighting. The glow should be only slightly larger than the planet itself, not 2x or 3x.

B. Find the glow material. Replace whatever is there with exactly this:

```tsx
<meshBasicMaterial
  color={glowColor}
  transparent
  opacity={0.12}
  blending={THREE.AdditiveBlending}
  depthWrite={false}
/>
```

Opacity must be `0.12`. Not 0.25, not 0.4. `0.12`.

C. Find any pulse/scale animation in `useFrame`. The animated scale must stay between `1.3` and `1.5`:

```typescript
const s = 1.3 + Math.sin(elapsed * 1.5) * 0.1
```

D. Remove ANY secondary glow mesh, outer halo, or additional sprite. There must be only ONE mesh per highlighted planet.

E. Remove any `.multiplyScalar()` or colour brightening on the glow colour.

F. If using `MeshStandardMaterial` instead of `MeshBasicMaterial`, set `emissiveIntensity` to `0.3`. Not 0.8, not 1.5. `0.3`.

---

## FIX 2: Wheel overflows the right side of the screen

The 3D scene extends beyond the right edge of the mobile viewport.

Open `src/components/AstroWheel/AstroWheel3D.tsx`. Find the exported `AstroWheel3D` component at the bottom of the file.

The previous fix added a Canvas wrapper with `position: 'absolute'` and `transform: 'translateY(-50%)'` to vertically centre the canvas in the cropped container. This wrapper likely lacks a width constraint, causing it to overflow.

**Find that Canvas wrapper div and ensure it has these exact styles:**

```tsx
<div style={{
  opacity: sceneReady ? 1 : 0,
  width: '100%',
  height: '95vw',
  maxHeight: '550px',
  position: 'absolute',
  left: 0,
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  overflow: 'hidden',
}}>
```

Key additions: `right: 0` and `overflow: 'hidden'` on this inner wrapper. This constrains it to the parent's width and clips any overflow.

**Also ensure the OUTER container div has:**

```tsx
style={{
  ...existing styles...,
  overflowX: 'hidden',
  overflowY: 'hidden',
  position: 'relative',   // Needed for absolute child positioning
}}
```

If `position: 'relative'` is missing from the outer container, the absolutely positioned Canvas wrapper won't be constrained to it.

---

## VERIFICATION

- [ ] Moon (and all planet) highlights are a SUBTLE soft glow — slightly larger than the planet, semi-transparent, not a blob
- [ ] Planets near the highlighted planet are clearly visible, not obscured
- [ ] The wheel does not extend beyond the right edge of the screen
- [ ] No horizontal scrollbar on mobile
- [ ] Wheel interaction still works (orbit, tap, etc.)
- [ ] The wheel container height reduction from the previous fix still works

## DO NOT CHANGE ANYTHING ELSE

Git push: `git push origin master:main`
