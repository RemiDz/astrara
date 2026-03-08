# ASTRARA — Aspect Line Animation Upgrade: 3D Curved Dashed Energy Arcs

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ CRITICAL: DO NOT BREAK EXISTING FEATURES

All existing wheel interactions, planet taps, zodiac taps, audio, reading flow, camera animations, day navigation, settings panel, info modal, and all other features MUST continue working after this change. This ONLY modifies how aspect connections between planets are visually rendered during the Cosmic Reading aspect phases.

---

## Context

During the Cosmic Reading flow, when the reading reaches an Aspect phase (e.g. Sextile, Trine, Square, Opposition, Conjunction), the app highlights two planets and draws a connection line between them. Currently this is a **flat straight line** — visually boring and basic. 

We want to replace it with a **3D curved, dashed, animated energy arc** that feels like a pulse of cosmic energy flowing between the two connected planets. This should be cinematic and captivating.

---

## Visual Design

### The Curve Shape

- Use a **Quadratic Bézier curve** (`THREE.QuadraticBezierCurve3`) between Planet A position and Planet B position
- The **control point** (middle of the curve) should be lifted **perpendicular to the wheel plane** (positive Y in your scene) by a distance proportional to the gap between the two planets — roughly `0.3 × distance(A, B)` — so the arc has visible height and depth when viewed from the tilted camera angle
- Sample the curve into **64 points** using `curve.getPoints(64)` for smooth rendering
- The curve should feel like a graceful arc rising above the wheel, not a flat bend

### Dashed Line Material

- Use `THREE.LineDashedMaterial` with:
  - `dashSize: 0.06`
  - `gapSize: 0.04`
  - `linewidth: 1` (note: linewidth >1 only works on some renderers, but set it anyway)
  - `transparent: true`
  - `opacity`: animated (see below)
  - `color`: determined by aspect type (see colour mapping below)

### Colour by Aspect Type

Map aspect types to colours that convey their astrological meaning:

```
Conjunction  → #E8D44D (gold/yellow — fusion, intensity)
Sextile      → #4DCCB0 (teal/soft green — opportunity, harmony)
Square       → #E85D4D (warm red — tension, challenge)  
Trine        → #4D8DE8 (soft blue — flow, grace)
Opposition   → #B04DE8 (purple — polarity, awareness)
Quincunx     → #E8A94D (amber — adjustment, mystery)
```

If the aspect type doesn't match any of these, default to `#FFFFFF` at 60% opacity.

---

## Animation Sequence

When an aspect phase begins during the Cosmic Reading, the animation plays in this sequence:

### Step 1: Draw-in (0 → 800ms)

The dashed curve progressively reveals itself from Planet A towards Planet B, like a trail being drawn through space.

**Implementation approach:**
- Create the full 64-point curve geometry upfront
- Use `bufferGeometry.setDrawRange(0, count)` where `count` animates from `0` to `64` over 800ms using an ease-out timing (`t * (2 - t)`)
- This creates the effect of the curve "growing" from source to destination
- Simultaneously animate opacity from `0` to `1` over the first 400ms

### Step 2: Energy Flow (800ms → hold until phase ends)

Once the full curve is drawn, animate the `dashOffset` to create a flowing/pulsing effect — dashes appear to travel along the curve from A to B continuously.

**Implementation:**
- In the `useFrame` loop, continuously decrement `material.dashOffset` by `delta * 0.5` (adjust speed to feel smooth, not frantic)
- This makes the dashes appear to flow along the curve like energy pulses
- Add a subtle **opacity pulse**: `opacity = 0.7 + 0.3 * Math.sin(elapsed * 2.0)` — the whole arc gently breathes brighter and dimmer

### Step 3: Fade-out (when phase transitions)

When the reading moves to the next phase:
- Animate opacity from current value to `0` over 500ms
- Simultaneously animate the control point Y downward (arc flattens and fades)
- Remove the curve mesh after fade completes

---

## Glow Effect

To make the arc feel like light transmission rather than just a line:

- Render the curve **twice**: once as the dashed line (primary), and once as a slightly wider, more transparent, non-dashed line behind it (glow layer)
- Glow layer: same curve geometry, `THREE.LineBasicMaterial` with same colour but `opacity: 0.15`, `transparent: true`, no dashes
- The glow layer follows the same draw-in and fade-out animation but is always softer
- If performance is a concern on mobile, make the glow layer optional (skip it if `navigator.hardwareConcurrency < 4`)

---

## React Three Fiber Implementation

Create a new component: `AspectArc.tsx` (or integrate into existing aspect rendering component).

```tsx
// Pseudo-structure — adapt to actual codebase patterns

interface AspectArcProps {
  planetA: THREE.Vector3;    // world position of planet A
  planetB: THREE.Vector3;    // world position of planet B
  aspectType: string;        // 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | etc.
  isActive: boolean;         // true when this aspect phase is showing
  onFadeComplete?: () => void;
}
```

Key implementation notes:

1. **Get planet positions from the existing wheel data** — do NOT recalculate positions. Read them from whatever source the current straight-line aspect renderer uses.

2. **Compute the control point:**
   ```ts
   const midpoint = new THREE.Vector3().addVectors(planetA, planetB).multiplyScalar(0.5);
   const distance = planetA.distanceTo(planetB);
   const controlPoint = midpoint.clone();
   controlPoint.y += distance * 0.3; // lift above wheel plane
   ```

3. **Rebuild curve when planet positions change** (e.g. if user changes day during reading — unlikely but be safe). Use `useMemo` with planetA/planetB as deps.

4. **useFrame for animation:**
   - Track `elapsedRef` for draw-in timing
   - Track `dashOffsetRef` for continuous flow
   - Track `fadeRef` for fade-out
   - Use `THREE.MathUtils.lerp` for smooth transitions

5. **Compute line distances** — IMPORTANT: after creating the `THREE.BufferGeometry` from the curve points, you MUST call `geometry.computeLineDistances()` or the dashes will not render. This is a common Three.js gotcha with `LineDashedMaterial`.

6. **Dispose properly** — in the cleanup/unmount, dispose geometry and materials to prevent memory leaks.

---

## Integration with Cosmic Reading Flow

Find where the current straight-line aspect connection is rendered during reading phases. Replace it with the `AspectArc` component. The trigger should be:

- When the reading state machine enters an ASPECT phase → set `isActive={true}` on the AspectArc with the correct planet pair and aspect type
- When transitioning to the next phase → the arc's internal fade-out triggers, then it unmounts

If the current implementation doesn't clearly separate "aspect phase" rendering, look for where the straight line between planets is drawn and replace that geometry/mesh with this curved arc approach.

---

## Multiple Simultaneous Aspects

If a single reading phase shows multiple aspects at once (e.g. "Sun Sextile Moon AND Mars Trine Jupiter"), each pair gets its own `AspectArc` instance. Stagger their draw-in animations by 300ms each so they appear sequentially rather than all at once — more cinematic.

---

## Performance Notes

- 64-point curves are lightweight — no performance concern
- The `useFrame` animation is just updating `dashOffset` (a single float) and optionally opacity — negligible cost
- Glow layer doubles the draw calls per arc but these are simple line geometries — fine on mobile
- Dispose geometries on unmount

---

## Build Steps

1. Read ALL current aspect rendering code in the reading flow — understand how planet positions are accessed and how the current straight lines are drawn
2. Create the `AspectArc` component (or equivalent) with curve generation, dashed material, draw-in animation, flow animation, and fade-out
3. Add the glow layer (secondary transparent line behind the dashed line)
4. Add colour mapping by aspect type
5. Replace the current straight-line rendering with the new arc component
6. Handle staggered animation for multiple simultaneous aspects
7. Test: enter Cosmic Reading → navigate to an aspect phase → verify curved dashed arc appears with draw-in animation
8. Test: verify dashes flow along the curve continuously
9. Test: verify arc fades out smoothly when moving to next phase
10. Test: verify different aspect types show different colours
11. Test: verify on mobile viewport (375px) — arcs render correctly and performantly
12. Test: verify ALL other features still work (wheel interaction, planet taps, audio, settings, etc.)
13. Run `npm run build` — no errors
14. Commit: `feat: 3D curved dashed energy arc animations for aspect connections`
15. Push to **main** branch using `git push origin master:main`
