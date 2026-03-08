# ASTRARA — Crystalline Core v4: Ethereal Sacred Geometry Light Form

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## ⚠️ REPLACE THE EXISTING CRYSTALLINE CORE COMPLETELY

Delete ALL existing crystal components and start fresh. The solid icosahedron approach was wrong. All other app features must continue working.

---

## The Vision

The crystal is NOT a solid 3D object. It is an **ethereal sacred geometry pattern made of light** — thin luminous lines forming overlapping circles and petal shapes, floating above the wheel like a spirit or energy signature. Think of it as the universe's breath made visible through geometry.

**Reference**: The Living Mandala on harmonicwaves.app — overlapping circles forming a Flower of Life pattern with flowing energy through the centre. That exact aesthetic language, adapted to float above the Astrara wheel in 3D space.

It should feel like you could pass your hand through it. Not solid. Not material. Pure light geometry.

---

## Implementation: R3F Line-Based Sacred Geometry

This is rendered entirely with `THREE.Line` and `THREE.LineBasicMaterial` — no meshes, no solids, no physical materials. Just lines of light.

### The Pattern: Simplified Flower of Life

The pattern consists of **7 overlapping circles** arranged in the classic Seed of Life / Flower of Life formation:

1. One centre circle
2. Six circles arranged around it, each offset by the circle radius, at 60° intervals

Each circle is drawn as a line loop (not a filled shape) using `THREE.BufferGeometry` with points sampled around the circumference.

**Circle parameters:**
- Radius: `0.12` (scene units)
- Points per circle: `64` (smooth curves)
- Centre circle position: `(0, 0, 0)` relative to the group
- Surrounding circles: offset by `0.12` at angles `0°, 60°, 120°, 180°, 240°, 300°`

### How to Build Each Circle

```typescript
function createCircleGeometry(radius: number, segments: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}
```

Each circle is a `THREE.Line` (not `LineLoop` — use `Line` with the last point connecting back to the first).

### Material — Luminous Lines

```typescript
new THREE.LineBasicMaterial({
  color: elementColor,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
})
```

Key properties:
- **Additive blending** — this is what makes the overlapping areas glow brighter where circles intersect. Where two circles cross, the light adds up and creates natural bright points at intersections. This is the key visual effect.
- **Low base opacity (0.25)** — individual lines are subtle, intersections glow to ~0.5
- **Element colour** — shifts based on dominant element, same mapping as before:
  - Fire: `#FF6B4A`
  - Earth: `#4ADE80`
  - Air: `#60A5FA`
  - Water: `#A78BFA`
  - Neutral: `#C0C0D0`

### Centre Glow Point

A single tiny sprite or point at the dead centre of the pattern:

```typescript
// Small additive-blended sprite
new THREE.SpriteMaterial({
  color: elementColor,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
  map: createGlowTexture(), // small radial gradient texture, generated procedurally
})
```

The glow texture is a simple radial gradient: white centre fading to transparent edges, created with a canvas:

```typescript
function createGlowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.3)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
```

Scale the sprite to about `0.08` — a small, soft glow at the heart of the geometry.

---

## Orientation in 3D Space

The sacred geometry pattern is flat (2D geometry) but oriented in 3D space to face the camera:

- The pattern lies on the XY plane within its group
- The group is positioned at `[0, 1.6, 0]` (above the wheel centre)
- Add a **very subtle tilt** so it's not perfectly face-on: rotate the group on X-axis by about `0.15 radians` (~8.5°) — just enough to give a hint of 3D depth without losing the pattern readability
- The pattern should feel like it's hovering in space, slightly angled, catching the cosmic light

---

## Animation

### Slow Rotation
- Rotate the entire group on **Z-axis** (the axis perpendicular to the pattern face): `0.05 rad/s`
- This makes the whole Flower of Life pattern slowly spin — the overlapping areas create mesmerising shifting interference patterns as it rotates
- One full rotation every ~126 seconds — barely perceptible but hypnotic

### Breathing Opacity
- All circle materials pulse opacity together: `0.2 + 0.08 * Math.sin(time * 0.8)`
- The centre glow sprite pulses slightly offset: `0.4 + 0.15 * Math.sin(time * 1.0)`
- This creates a gentle breathing effect — the geometry fades in and out like a heartbeat

### Floating
- Y position oscillates: `1.6 + 0.02 * Math.sin(time * 0.5)`
- Very gentle. Barely there.

### Scale Breathing
- Whole group scale: `1.0 + 0.015 * Math.sin(time * 0.7)`
- Subtle expansion/contraction in sync with the opacity breathing

### Element Colour Transition
- When dominant element changes (day navigation), smoothly lerp all material colours over 1.5 seconds
- Use `THREE.Color.lerp()` in `useFrame` with a transition progress ref

---

## NO Additional Effects

- **NO wireframe overlays**
- **NO particles or particle systems**
- **NO energy stream lines from planets**
- **NO point lights** (the additive blending creates its own glow)
- **NO mesh objects of any kind**
- **NO MeshPhysicalMaterial, MeshStandardMaterial, or any mesh materials**
- Just lines. Just light. Just geometry.

---

## Tap Interaction

Same as before:
- Invisible sphere (`THREE.SphereGeometry(0.3)`, `visible: false`) at the group centre for tap detection
- Use `useTapVsDrag` hook
- On tap: briefly spike all circle opacities to `0.6` and centre glow to `0.9`, then fade back over 600ms
- Open `CrystalMessage.tsx` bottom sheet with placeholder content (same content as v2 spec — element-based cosmic crystallisation message in EN + LT)

---

## Settings, Visibility, Conditions

All same as v2:
- **Settings toggle**: "Crystalline Core" / "Kristalinė Šerdis" in SettingsPanel, `crystalEnabled` in AstraraSettings, default ON
- **During Cosmic Reading**: reduce all opacities to 40% of normal values
- **During Heliocentric View**: fade out (all opacities to 0 over 500ms), fade back on return to geocentric
- **Before entrance complete**: hidden, then fade in after phase 6 with scale 0.5→1.0 over 800ms
- **When toggled off**: completely unmount from scene

---

## Element Dominance Calculation

Same function as v2 — `getDominantElement()` using planet positions from `useAstroData`, Sun/Moon weighted double.

---

## Component Structure

```
components/CrystallineCore/
  ├── CrystallineCore.tsx    — the sacred geometry pattern, all animation, visibility, tap logic
  └── CrystalMessage.tsx     — tap overlay / bottom sheet (same as v2)
```

Keep it to two files. The geometry creation can be inline functions within CrystallineCore.

---

## Performance

- 7 line objects with 64 vertices each = 448 vertices total — trivially lightweight
- 1 sprite for centre glow
- `useFrame` updates: rotation (1 float), opacity (7 materials + 1 sprite), colour lerp (conditional), position Y (1 float)
- Zero textures except the tiny 64x64 procedural glow
- This is lighter than a single planet orb

---

## Build Steps

1. **DELETE** all existing crystal components completely (CrystallineCore folder contents, any crystal-related utilities)
2. Read how planet data is accessed from `useAstroData` for element calculation
3. Read existing settings panel pattern
4. Create `CrystallineCore.tsx`:
   a. Build 7 circle geometries in the Seed of Life arrangement
   b. Create `LineBasicMaterial` with additive blending for each
   c. Create centre glow sprite with procedural radial gradient texture
   d. Position group at Y=1.6 with slight X-tilt
   e. Animate: Z-rotation, opacity breathing, floating, scale breathing, colour lerping
   f. Add invisible tap sphere with useTapVsDrag
   g. Handle visibility conditions (entrance, reading, helio, settings)
5. Create `CrystalMessage.tsx` — placeholder content in EN + LT (reuse from v2 if it still exists)
6. Add crystal to main R3F scene
7. Add settings toggle
8. Add `crystalEnabled` to AstraraSettings
9. Add i18n keys to en.json and lt.json
10. Test: sacred geometry pattern appears as luminous overlapping circles above wheel
11. Test: intersections glow brighter than individual lines (additive blending working)
12. Test: pattern slowly rotates on Z-axis
13. Test: element colour shifts smoothly when navigating days
14. Test: tap → opacity spike + message overlay opens
15. Test: settings toggle → unmounts completely
16. Test: Cosmic Reading → pattern dims
17. Test: Heliocentric → pattern fades out
18. Test: does NOT interfere with Earth tap, planet taps, wheel rotation
19. Test: mobile 375px — visible, not too large, tappable
20. Test: ALL other features still work
21. Run `npm run build` — no errors
22. **UPDATE `engine/ARCHITECTURE.md`** — document the new ethereal line-based sacred geometry approach
23. Commit: `feat: Crystalline Core v4 — ethereal sacred geometry light form (Flower of Life)`
24. Push to **main** branch using `git push origin master:main`
