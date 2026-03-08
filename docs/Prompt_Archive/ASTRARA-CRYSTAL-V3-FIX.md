# ASTRARA — Crystalline Core v3: Visual Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This replaces ONLY the crystal's visual rendering. All other features must continue working.

---

## Problem

The current crystal renders as a flat, opaque purple hexagon — the `MeshPhysicalMaterial` with `transmission` is not working in the current scene setup. It looks like a dev bug, not a feature.

## Solution

Replace the single-mesh approach with a **layered rendering technique** that creates a convincing glass crystal look WITHOUT relying on `transmission` or `thickness` properties (which require specific renderer/environment setup to work).

---

## New Crystal Rendering — Three Layers

### Layer 1: Solid Inner Core (the glow)

A slightly smaller icosahedron that provides the inner light:

```
Geometry: THREE.IcosahedronGeometry(0.12, 0)
Material: THREE.MeshBasicMaterial({
  color: elementColor,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
})
```

This is the "life" inside the crystal — a soft coloured glow. The additive blending makes it luminous against the dark background.

Animate `opacity`: `0.2 + 0.1 * Math.sin(time * 1.0)` — gentle breathing pulse.

### Layer 2: Glass Shell (the faceted surface)

The main visible icosahedron — uses `MeshStandardMaterial` (NOT Physical) for reliable rendering:

```
Geometry: THREE.IcosahedronGeometry(0.18, 0)
Material: THREE.MeshStandardMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.12,
  metalness: 0.8,
  roughness: 0.05,
  envMapIntensity: 2.0,
  side: THREE.DoubleSide,
})
```

This creates a barely-visible shell with sharp reflective facets. The high `metalness` + low `roughness` + high `envMapIntensity` makes each face catch environmental light differently as the crystal rotates — this is what creates the "glass catching light" effect.

**IMPORTANT**: For this to work, the scene MUST have an `<Environment>` component from `@react-three/drei`. Check if one already exists in the scene. If yes, great. If not, add `<Environment preset="night" />` inside the Canvas. Without it, the metalness/envMap has nothing to reflect and the crystal will look flat.

### Layer 3: Wireframe Edge Highlight

Ultra-thin wireframe overlay that defines the geometric edges:

```
Geometry: THREE.IcosahedronGeometry(0.181, 0)  — SLIGHTLY larger than Layer 2
Material: THREE.MeshBasicMaterial({
  color: elementColor,
  wireframe: true,
  transparent: true,
  opacity: 0.2,
})
```

This gives the crystal its geometric definition — you can clearly see the icosahedron edges glowing faintly in the element colour. Without this, the glass shell alone would be too subtle to read as a shape.

Animate `opacity`: `0.15 + 0.08 * Math.sin(time * 1.2)` — subtle edge breathing, slightly offset from the core pulse.

---

## All Three Layers in One Group

```tsx
<group position={[0, 1.6, 0]} ref={crystalRef}>
  {/* Layer 1: Inner glow core */}
  <mesh>
    <icosahedronGeometry args={[0.12, 0]} />
    <meshBasicMaterial ... />
  </mesh>
  
  {/* Layer 2: Glass shell */}
  <mesh>
    <icosahedronGeometry args={[0.18, 0]} />
    <meshStandardMaterial ... />
  </mesh>
  
  {/* Layer 3: Wireframe edges */}
  <mesh>
    <icosahedronGeometry args={[0.181, 0]} />
    <meshBasicMaterial wireframe ... />
  </mesh>
</group>
```

The group handles rotation and floating animation. Each layer animates its own opacity independently.

---

## Why This Works Reliably

- `MeshBasicMaterial` renders identically on every device and renderer — no environment dependency for the glow and wireframe
- `MeshStandardMaterial` with metalness/roughness is far more reliable than `MeshPhysicalMaterial` with transmission
- Additive blending on the inner core guarantees it glows against the dark background
- The three layers together create the illusion of a glass crystal with inner light, without needing actual ray-traced refraction

---

## Keep Everything Else From v2

All other logic from the previous spec remains unchanged:

- **Position**: Y = 1.6
- **Floating**: `Y + 0.025 * Math.sin(time * 0.6)`
- **Rotation**: Y-axis only, `0.12 rad/s`
- **Scale breathing**: `1.0 + 0.02 * Math.sin(time * 0.8)`
- **Element colour**: lerp over 1.5s when dominant element changes
- **Element calculation**: `getDominantElement()` — same logic (Sun/Moon weighted double)
- **Tap interaction**: same pulse response + CrystalMessage overlay
- **Settings toggle**: same — unmount when off
- **Visibility**: dim during reading (all layers to 50% of their normal opacity), hide during helio, appear after entrance
- **PointLight**: `intensity: 0.15`, `distance: 1.5`, colour matches element
- **Component files**: same two files — `CrystallineCore.tsx` + `CrystalMessage.tsx`

---

## Build Steps

1. Open the existing `CrystallineCore.tsx`
2. Replace the single mesh + MeshPhysicalMaterial with the three-layer approach described above
3. Make sure `<Environment preset="night" />` exists somewhere in the Canvas (check `AstroWheel3D.tsx` — if it's already there, don't add a duplicate)
4. Test: crystal should now show as a translucent geometric form with visible faceted edges and soft inner glow — NOT a flat opaque shape
5. Test: rotating slowly — light catches different facets as it turns
6. Test: element colour shifts smoothly when navigating days
7. Test: tap still works
8. Test: settings toggle still works
9. Test: all other features still work
10. Run `npm run build` — no errors
11. **UPDATE `engine/ARCHITECTURE.md`** — update the crystal material description to reflect the three-layer approach
12. Commit: `fix: crystal rendering — three-layer glass approach for reliable visual`
13. Push to **main** branch using `git push origin master:main`
