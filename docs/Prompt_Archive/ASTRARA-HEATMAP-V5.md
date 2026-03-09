# ASTRARA — Heat Map v5: Badge Borders + Outer Colour Ring Band

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

---

## Step 1: Remove Previous Heat Map Attempts

Clean up ALL previous heat map visual code:
- Remove badge glow styles (backgroundColor, boxShadow changes) from both React props and any useFrame DOM manipulation
- Remove outer glow meshes (the additive blending MeshBasicMaterial meshes behind segments) if they exist
- Revert ring segment materials to their original pre-heat-map state (original element colours, original opacity, original metalness, original clearcoat)
- Keep the `calculateZodiacImpact()` function and scoring logic — that's correct and stays
- Keep the `heatPulse` CSS animation in globals.css — we'll reuse it
- The ring should look exactly like it did BEFORE any heat map work

---

## Step 2: Badge Borders (No Glow)

Change ONLY the `borderColor` of zodiac badges based on impact score. No background changes. No box-shadow. No size changes. No glow. Just the border colour.

Apply via React props (declarative), NOT useFrame DOM manipulation:

```typescript
function getHeatMapBorderColor(score: number): string {
  if (score >= 0.7) return 'rgba(255, 68, 68, 0.8)';     // INTENSE — red border
  if (score >= 0.4) return 'rgba(255, 140, 0, 0.7)';      // HOT — orange border
  if (score >= 0.2) return 'rgba(255, 215, 0, 0.6)';      // WARM — gold border
  return '';  // COOL — return empty string to keep default purple border
}
```

Apply to each badge's `style.borderColor` in the JSX where badges are rendered. If the return is empty string, don't override (keep the existing default).

That's it for badges. One CSS property. Clean.

---

## Step 3: Outer Colour Ring Band (New Geometry)

Create a NEW dedicated ring of 12 arc segments sitting just OUTSIDE the existing zodiac ring. This is a separate visual element — it does NOT modify the existing ring materials at all.

### Geometry

Each arc segment is a flat ring section (like a pizza slice of a donut):

```typescript
// For each of the 12 zodiac signs:
const innerRadius = 2.25;   // just outside R_OUTER (2.2) — tight against the existing ring
const outerRadius = 2.35;   // 0.1 scene units wide — thin visible band
const startAngle = signIndex * (Math.PI * 2 / 12);  // 30° per sign
const arcLength = Math.PI * 2 / 12;                   // 30° each

const geometry = new THREE.RingGeometry(
  innerRadius,
  outerRadius, 
  16,          // thetaSegments — enough for smooth arc
  1,           // phiSegments
  startAngle,
  arcLength
);
```

### Material — MeshBasicMaterial (guaranteed to show colour)

```typescript
const material = new THREE.MeshBasicMaterial({
  color: getHeatMapColor(score),
  transparent: true,
  opacity: getHeatMapOpacity(score),
  side: THREE.DoubleSide,    // visible from both sides when tilted
  depthWrite: false,         // don't interfere with depth buffer
});
```

Using `MeshBasicMaterial` is critical — it renders the EXACT colour you set. No metalness, no clearcoat, no environment reflections, no surprises. What you set is what you see.

### Colour and Opacity by Score

```typescript
function getHeatMapColor(score: number): string {
  if (score >= 0.7) return '#FF4444';   // INTENSE — red
  if (score >= 0.4) return '#FF8C00';   // HOT — orange  
  if (score >= 0.2) return '#FFD700';   // WARM — gold
  return '#000000';                      // COOL — black (invisible with opacity 0)
}

function getHeatMapOpacity(score: number): number {
  if (score >= 0.7) return 0.85;   // INTENSE — very visible
  if (score >= 0.4) return 0.60;   // HOT — clearly visible
  if (score >= 0.2) return 0.35;   // WARM — noticeable
  return 0;                         // COOL — invisible
}
```

### Placement in Scene

Add these 12 ring meshes inside the same group as the existing zodiac ring (GeoFadeGroup → OuterZodiacRing area), so they:
- Rotate with the wheel
- Fade during heliocentric transition (controlled by GeoFadeGroup's zodiacOpacity)
- Appear after the entrance animation

Position each mesh at `y = 0` (same plane as the wheel), rotation `x = -Math.PI / 2` (flat on the XZ plane, matching the existing ring orientation).

### Handle GeoFadeGroup Opacity

Since these meshes will be inside GeoFadeGroup, GeoFadeGroup will try to set their opacity. This is actually FINE for the colour band — we WANT them to fade during helio transition. But we need to make sure the base opacity is set correctly.

Tag these materials with `userData.heatBand = true`. In GeoFadeGroup's useFrame, when it encounters a material with `heatBand = true`, multiply by the heat map opacity instead of using the captured original:

```typescript
// In GeoFadeGroup useFrame:
if (mat.userData?.heatBand) {
  mat.opacity = mat.userData.heatOpacity * zodiacOpacity;
} else {
  mat.opacity = originalOpacity * zodiacOpacity;
}
```

Set `mat.userData.heatOpacity` when calculating scores (in OuterZodiacRing's useFrame or wherever scores are applied).

### Alternatively (simpler approach):

Place the colour band meshes OUTSIDE of GeoFadeGroup as siblings. Manually apply `zodiacOpacity` to them in their own useFrame. This avoids the GeoFadeGroup interaction entirely. Use whichever approach is cleaner.

### Update on Day Navigation

When impact scores change (day navigation), smoothly lerp the colour band material opacity and colour over 0.8 seconds. Use the same lerp-in-useFrame pattern already established for other transitions.

### Pulse for Intense Signs

For the score >= 0.7 (INTENSE) band segments, add a subtle opacity pulse:

```typescript
if (score >= 0.7) {
  bandMaterial.opacity = (0.75 + 0.1 * Math.sin(time * 2.5)) * zodiacOpacity;
}
```

---

## Step 4: Small Gap Between Band Segments

Leave a tiny gap between adjacent colour band segments so they read as individual sign indicators, not one continuous ring:

Reduce each segment's arc length by a small amount:

```typescript
const gap = 0.02; // radians — very small gap
const arcLength = (Math.PI * 2 / 12) - gap;
const startAngle = signIndex * (Math.PI * 2 / 12) + gap / 2;
```

This creates thin dark lines between segments, making it clear each colour block belongs to one sign.

---

## Summary of What Users See

- **Cool signs** (Libra, Virgo — no planets): default purple badge border, NO colour band visible
- **Warm signs** (moderate activity): gold badge border, faint gold band on outer ring
- **Hot signs** (high activity): orange badge border, visible orange band on outer ring
- **Intense signs** (Pisces with 5 planets): red badge border, bright pulsing red band on outer ring

Clean, intuitive, no visual noise added to the wheel itself.

---

## Build Steps

1. Remove ALL previous heat map visual code (badge glows, segment material overrides, glow meshes)
2. Revert ring segment materials to original state
3. Apply badge border-only colour via React props (`getHeatMapBorderColor`)
4. Create 12 new RingGeometry arcs just outside the zodiac ring
5. Apply MeshBasicMaterial with heat map colour and opacity per sign
6. Handle GeoFadeGroup interaction (either tag materials or place outside group)
7. Add small gaps between band segments
8. Add opacity pulse for intense signs (score >= 0.7)
9. Add smooth lerp transitions for day navigation changes
10. Test: Pisces area — red badge border + bright red outer band
11. Test: Libra area — default purple border + no outer band
12. Test: the outer colour band is CLEARLY visible from the default camera angle
13. Test: badge shapes completely unchanged (only borderColor differs)
14. Test: existing ring segments look exactly like they did before heat map work
15. Test: navigate days — colours update smoothly
16. Test: heliocentric transition — colour bands fade with zodiac ring
17. Test: ALL other features still work
18. Run `npm run build` — no errors
19. **UPDATE `engine/ARCHITECTURE.md`** — document the new heat map approach (badge borders + outer colour band with MeshBasicMaterial)
20. Commit: `feat: zodiac heat map v5 — badge borders + outer colour ring band`
21. Push to **main** branch using `git push origin master:main`
