# ASTRARA — Heliocentric Fix: Realistic Planet Sizes & Screen Fit

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Three Problems to Fix

Read all current planet mesh, camera, and heliocentric-related source files before making changes.

---

## Problem 1: Planets Still Too Small

The current scale multiplier is not enough. Planets are nearly invisible in heliocentric view.

## Problem 2: Pluto's Ring Off Screen Again

The larger planet sizes are pushing Pluto's orbital ring outside the viewport. The camera or ring radii need adjusting.

## Problem 3: Unrealistic Relative Sizes

All planets currently use the same scale multiplier, which makes the Moon appear similar in size to Jupiter. The heliocentric view should give a ROUGH sense of relative planet sizes — not pixel-accurate, but Jupiter should clearly be the biggest, Mercury and Moon clearly the smallest.

---

## Solution: Per-Planet Heliocentric Scale Multipliers

Remove the single `helioScale` multiplier. Replace with individual scale multipliers per planet that create visually distinct, roughly proportional sizes.

These are NOT real diameter ratios (Jupiter is 40× Earth's diameter — that's impossible to show). These are curated display multipliers that give the RIGHT FEEL while keeping everything visible:

```typescript
const HELIO_SCALE_MULTIPLIERS: Record<string, number> = {
  Sun:     3.0,    // dominant but not overwhelming
  Jupiter: 5.5,    // clearly the largest planet
  Saturn:  5.0,    // second largest, close to Jupiter
  Uranus:  4.0,    // noticeably large
  Neptune: 3.8,    // similar to Uranus
  Earth:   3.0,    // our reference point
  Venus:   2.8,    // similar to Earth
  Mars:    2.5,    // smaller than Earth
  Mercury: 2.0,    // small
  Pluto:   1.8,    // tiny
  Moon:    1.8,    // tiny — smaller than Mercury
}
```

### Apply Per-Planet

Find where the planet scale is set during transition. Replace the single multiplier with the per-planet value:

```typescript
const planetName = planet.name  // or however the planet is identified
const geoScale = 1.0
const helioScale = HELIO_SCALE_MULTIPLIERS[planetName] ?? 3.0

const currentScale = geoScale + (helioScale - geoScale) * smoothMoveT

// Apply to planet group
groupRef.current.scale.setScalar(currentScale)
```

---

## Solution: Shrink Ring Radii So Everything Fits

The current `HELIO_RING_RADII` values put Pluto at radius 17, which is too wide for the camera to capture on mobile even with pullback.

**Do NOT change `src/lib/heliocentric.ts` ring radii** — those are used for position calculations. Instead, apply a global scale reduction to the ENTIRE heliocentric scene group so everything shrinks to fit.

### Approach: Scale the parent group

Wrap all heliocentric-positioned elements (planets + orbital rings) in a parent group. Scale this group down so Pluto's ring fits comfortably:

```typescript
// The parent group of all planets and orbital rings
// In geocentric view: scale 1.0
// In heliocentric view: scale 0.7 (shrinks the whole solar system to fit)
const sceneScale = 1.0 + (0.7 - 1.0) * smoothMoveT

<group scale={[sceneScale, sceneScale, sceneScale]}>
  {/* orbital rings */}
  {/* all planet groups */}
</group>
```

Adjust `0.7` as needed. The goal: Pluto's orbital ring has at least 20px of padding from the screen edge on a 375px mobile screen. If 0.7 doesn't work, try 0.6 or 0.65.

**IMPORTANT:** If using this approach, the per-planet `HELIO_SCALE_MULTIPLIERS` above already compensate — the planets scale UP while the scene scales DOWN, so planets end up clearly visible within a correctly-sized solar system.

### Alternative Approach: Camera Pullback

If the parent group scaling causes issues (e.g., breaks tap targets), instead increase the camera pullback:

```typescript
const helioCameraZ = geoCameraZ * 3.0  // or whatever value makes Pluto fit
```

Use whichever approach is cleaner. The critical test: ALL rings including Pluto visible on 375px screen.

---

## Do NOT

- Do NOT change `src/lib/heliocentric.ts` — the ring radii constants stay the same
- Do NOT change transition timing or phases
- Do NOT change planet colours or materials
- Do NOT change label positions or text content
- Do NOT change any geocentric wheel behaviour — in geocentric view all planets must be their original size
- Do NOT change the toggle button

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: geocentric wheel loads normally — all planet sizes unchanged from before
3. Test: toggle to heliocentric → ALL orbital rings including Pluto visible on 375px screen
4. Test: Jupiter is clearly the largest planet sphere
5. Test: Saturn is close to Jupiter in size
6. Test: Moon and Pluto are clearly the smallest spheres
7. Test: Mercury is smaller than Earth/Venus
8. Test: Sun is prominent at centre but not obscuring Mercury's orbit
9. Test: all planets are clearly visible — not tiny dots
10. Test: planet sizes smoothly animate during transition
11. Test: toggle back → all planets return to normal geocentric sizes
12. Test: tap planets in heliocentric → detail panels open correctly
13. Test: zoom/rotate still works in heliocentric view
14. Commit: `fix: per-planet heliocentric sizing with realistic proportions + screen fit`
15. Push to `main`
