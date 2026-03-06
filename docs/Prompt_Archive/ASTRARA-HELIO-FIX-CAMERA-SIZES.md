# ASTRARA — Heliocentric Fix: Camera Pullback & Larger Planets

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Two Problems to Fix

Read all current wheel, camera, and planet mesh source files before making changes.

---

## Problem 1: Pluto Off Screen

Pluto's orbital ring (radius 17) is outside the camera's viewport on mobile. The camera needs to pull back further in heliocentric view.

### Fix

Find where the camera Z position (or FOV) is adjusted for heliocentric view. It was added in Step 2 as something like:

```typescript
const helioCameraZ = geoCameraZ * 1.6
```

Increase this multiplier until ALL orbital rings including Pluto (radius 17) fit on a 375px screen with comfortable padding. Try:

```typescript
const helioCameraZ = geoCameraZ * 2.2
```

If the camera uses FOV instead of Z position, increase the heliocentric FOV:

```typescript
const helioFOV = geoFOV + 20  // add 20 degrees for wider view
```

**The test is simple: Pluto must be fully visible with its label and some padding from the screen edge on a 375px wide mobile screen.** Adjust the multiplier until this is true. If 2.2× isn't enough, go to 2.5×. If it's too much and planets become tiny, try 2.0×.

The camera transition must still be smooth — lerp to the new position, do NOT snap.

---

## Problem 2: Planet Spheres Too Small

In heliocentric view, the planet orbs are barely visible — they look like tiny dots. The planets need to be larger in heliocentric view since the view is more zoomed out.

### Fix

Scale up ALL planet meshes when in heliocentric view. Each planet sphere should be **1.8× its current size** in heliocentric view.

Find where each planet's mesh or group has its scale set. Add a scale multiplier that lerps during the transition:

```typescript
// Inside the planet component or the animated position wrapper
const geoScale = 1.0        // current normal size
const helioScale = 1.8      // larger for solar system view

// Use smoothMoveT from the transition phases
const currentScale = geoScale + (helioScale - geoScale) * smoothMoveT

// Apply to the planet group
<group scale={[currentScale, currentScale, currentScale]}>
  {/* planet mesh, glow, aura etc */}
</group>
```

This means:
- In geocentric view: planets are their current size (unchanged)
- During transition: planets smoothly grow
- In heliocentric view: planets are 1.8× larger

**Apply this to ALL planets including Sun, Moon, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.**

**The Sun should scale LESS** since it's already the largest orb and it moves to the centre where it's prominent. Use `helioScale = 1.3` for the Sun only.

### Do NOT Change Geocentric Sizes

The scale multiplier must be `1.0` when `smoothMoveT` is `0` (geocentric view). The existing planet sizes in the astro wheel must remain exactly as they are.

---

## Do NOT

- Do NOT change any orbital ring radii or positions
- Do NOT change transition timing or phases
- Do NOT change planet colours or materials
- Do NOT change label positions or text
- Do NOT touch any geocentric wheel functionality
- Do NOT change the toggle button

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: geocentric wheel loads normally — planet sizes unchanged
3. Test: toggle to heliocentric → Pluto is now fully visible on 375px mobile screen
4. Test: ALL orbital rings visible within the viewport
5. Test: planets are clearly visible in heliocentric view — not tiny dots
6. Test: Sun is moderately larger at centre but not overwhelming
7. Test: planet sizes smoothly grow during transition
8. Test: toggle back → planets smoothly shrink back to original geocentric sizes
9. Test: tap planets in heliocentric view → detail panels still open correctly
10. Commit: `fix: heliocentric camera pullback for Pluto + larger planet sizes`
11. Push to `main`
