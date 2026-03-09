# ASTRARA — Zodiac Heat Map: Force Visible Changes

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This ONLY fixes the zodiac heat map visibility. All other features must continue working.

---

## Problem

The zodiac heat map is not showing ANY visual difference on the wheel. Looking at the screenshot: Pisces has Sun, Saturn, Neptune, Mercury, and Mars all clustered in/near it — yet its badge and ring segment look identical to empty signs like Libra or Virgo. The heat map is either not being applied or the changes are too small to see.

---

## Debugging Steps (DO THESE FIRST)

1. Open `AstroWheel3D.tsx` and find where `calculateZodiacImpact()` is called
2. Add a `console.log('Zodiac Impact Scores:', scores)` to verify the scores are being calculated correctly
3. Check: is the score for Pisces/Aquarius high? Is the score for Libra/Virgo low?
4. Find where the scores are applied to the zodiac segment materials — verify the code is actually running
5. If the calculation is correct but visuals aren't changing, the problem is in the material application

---

## Fix: Two-Layer Visual Approach

The zodiac wheel has TWO visual elements per sign that users see:

### Layer 1: The Ring Segment (3D mesh)

Find the outer zodiac ring segments in `AstroWheel3D.tsx`. Each sign occupies a 30° wedge. Currently they all have the same low opacity element-coloured material.

**Apply these AGGRESSIVE changes based on impact score:**

```typescript
// For each zodiac sign segment mesh:
const score = impactScores[signName]; // 0 to 1

// OPACITY — huge range so the difference is unmissable
const segmentOpacity = 0.04 + score * 0.4;
// Score 0 = nearly invisible (0.04)
// Score 1 = very visible (0.44)

// EMISSIVE COLOUR — shift from element colour to heat colour
const heatColor = new THREE.Color();
if (score < 0.3) {
  // Cool — keep element colour
  heatColor.copy(elementColor);
} else if (score < 0.6) {
  // Warm — blend toward gold
  heatColor.copy(elementColor).lerp(new THREE.Color('#FFD700'), (score - 0.3) / 0.3);
} else {
  // Hot — blend toward red
  heatColor.set('#FFD700').lerp(new THREE.Color('#FF4444'), (score - 0.6) / 0.4);
}

// EMISSIVE INTENSITY — strong enough to visibly glow
const emissiveIntensity = 0.05 + score * 1.0;
// Score 0 = barely there (0.05)
// Score 1 = bright glow (1.05)

// Apply to material
segmentMaterial.opacity = segmentOpacity;
segmentMaterial.emissive = heatColor;
segmentMaterial.emissiveIntensity = emissiveIntensity;
segmentMaterial.needsUpdate = true;
```

**IMPORTANT**: Make sure `material.needsUpdate = true` is set after changes. Also check if materials are shared between segments — if all 12 segments share ONE material, the heat map can't work. Each segment MUST have its OWN material instance (use `.clone()` if they currently share).

### Layer 2: The Zodiac Badge (Html overlay)

The purple zodiac glyph badges rendered with `<Html>` from drei. These are the most visible element to users. They MUST reflect the heat map.

Find where zodiac badges are rendered. For each badge, apply dynamic inline styles based on the impact score:

```typescript
const score = impactScores[signName]; // 0 to 1

// Background colour shift
const badgeBg = score < 0.3
  ? 'rgba(168, 85, 247, 0.15)'           // default purple (cool)
  : score < 0.6
    ? `rgba(255, 215, 0, ${0.15 + score * 0.2})`  // gold (warm)
    : `rgba(255, 68, 68, ${0.2 + score * 0.25})`;  // red (hot)

// Border colour shift
const badgeBorder = score < 0.3
  ? 'rgba(168, 85, 247, 0.4)'            // default purple
  : score < 0.6
    ? `rgba(255, 215, 0, ${0.4 + score * 0.3})`   // gold
    : `rgba(255, 68, 68, ${0.5 + score * 0.3})`;   // red

// Glow shadow
const badgeShadow = score < 0.3
  ? 'none'
  : score < 0.6
    ? `0 0 10px rgba(255, 215, 0, ${score * 0.4})`
    : `0 0 14px rgba(255, 68, 68, ${score * 0.5})`;

// Badge scale — hot signs slightly larger
const badgeScale = 1.0 + score * 0.15;
// Score 0 = normal size
// Score 1 = 15% bigger

// Apply styles
style={{
  background: badgeBg,
  borderColor: badgeBorder,
  boxShadow: badgeShadow,
  transform: `scale(${badgeScale})`,
  transition: 'all 0.8s ease',
  // ... keep all existing styles for font, padding, border-radius etc.
}}
```

**The result**: 
- Cool signs (Libra, Virgo with no planets): small, default purple, no glow
- Warm signs (moderate activity): slightly larger, gold tinted, subtle gold glow
- Hot signs (Pisces with 5 planets): noticeably larger, red tinted, red glow halo

This difference should be IMPOSSIBLE to miss.

### Verifying the Badge Code

The zodiac badges are rendered using R3F `<Html>` overlays. Find them by searching for zodiac glyph characters (♈♉♊♋♌♍♎♏♐♑♒♓) or the zodiac sign badge rendering loop. The styles might be applied via:
- Inline `style` prop
- CSS classes
- Direct DOM manipulation via refs (the ARCHITECTURE.md mentions "Per-frame opacity updates via direct DOM refs")

If styles are applied via direct DOM refs in `useFrame`, you need to update the heat map colours in the same `useFrame` callback. If they're React-rendered, pass the impact scores as state/props.

---

## Passing Impact Scores

Make sure the `calculateZodiacImpact()` result is available where both the 3D segments AND the Html badges are rendered:

1. Calculate scores in the parent component or via `useMemo` wherever `astroData` is available
2. Pass scores to the zodiac segment rendering section
3. Pass scores to the zodiac badge rendering section
4. Recalculate when `astroData` changes (day navigation)

---

## Smooth Transitions

When day changes:
- Store previous scores and target scores
- Lerp in `useFrame` over 1 second
- Both segment materials AND badge styles should transition smoothly
- For badge styles: use CSS `transition: all 0.8s ease` (already included above)

---

## Build Steps

1. Add `console.log` to verify impact scores are calculated correctly
2. Check if zodiac segment materials are shared or individual — fix if shared
3. Apply AGGRESSIVE opacity + emissive changes to ring segments
4. Apply background + border + shadow + scale changes to zodiac badges
5. Ensure `material.needsUpdate = true` is called
6. Verify scores are passed correctly to both segment and badge rendering code
7. Test: Pisces (with many planets) should be OBVIOUSLY different from Libra (empty)
8. Test: the visual difference should be noticeable at first glance, not requiring careful comparison
9. Test: navigate to different days — heat map shifts
10. Test: zodiac taps still work on both hot and cold signs
11. Test: ALL other features still work
12. Run `npm run build` — no errors
13. **UPDATE `engine/ARCHITECTURE.md`**
14. Commit: `fix: zodiac heat map — aggressive visual changes for clear visibility`
15. Push to **main** branch using `git push origin master:main`
