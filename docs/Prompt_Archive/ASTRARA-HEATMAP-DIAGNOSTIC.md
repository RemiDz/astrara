# ASTRARA — Zodiac Heat Map: Precise Diagnostic Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## ⚠️ DO NOT CHANGE THE BADGE SHAPE, SIZE, BORDER-RADIUS, OR FUNDAMENTAL STYLING

The last attempt broke the badge appearance by making them look sharp/wrong. This time:
- Do NOT change badge `border-radius` — keep it exactly as it currently is
- Do NOT change badge `padding`, `font-size`, or `width/height`
- Do NOT change badge `transform: scale()` — no size changes
- ONLY change: `background`, `borderColor`, `boxShadow` colours — nothing else on badges

---

## STEP 1: DIAGNOSE (DO THIS FIRST)

Before changing anything, run these diagnostics:

### 1A. Verify impact scores are calculating

In `AstroWheel3D.tsx`, find where `calculateZodiacImpact()` is called. Add this temporary log:

```typescript
console.log('=== ZODIAC IMPACT SCORES ===');
Object.entries(scores).forEach(([sign, score]) => {
  if (score > 0.1) console.log(`${sign}: ${(score * 10).toFixed(1)}/10`);
});
```

Check the browser console. You should see Pisces/Aquarius with high scores (many planets there today) and signs like Libra/Virgo with 0 or near-0.

If scores are ALL zero or the function isn't being called → fix the function call first.
If scores look correct → the problem is in rendering. Continue to Step 2.

### 1B. Verify materials are individual (not shared)

Find where the 12 zodiac segment meshes are created. Check if they each have their own material instance or share one. Log:

```typescript
console.log('Segment materials unique?', new Set(segmentMaterials).size === 12);
```

If they share a material, the heat map changes one material and all 12 segments look the same. Fix by cloning: `material = baseMaterial.clone()` for each segment.

### 1C. Verify useFrame is updating materials

In the `useFrame` callback that updates zodiac materials, add:

```typescript
// Temporary — remove after confirming it works
if (Math.random() < 0.001) { // log ~once per 16 seconds at 60fps
  console.log('Heat map update running. Pisces opacity:', piscesOpacity, 'emissive:', piscesEmissiveIntensity);
}
```

Remove all diagnostic logs after confirming the pipeline works.

---

## STEP 2: FIX 3D RING SEGMENTS

Based on ARCHITECTURE.md, the segments use `MeshPhysicalMaterial`. The problem is likely that `MeshPhysicalMaterial` emissive doesn't render brightly enough against the dark scene, even at intensity 1.0+.

### Fix: Switch hot segments to MeshBasicMaterial approach

For segments with score > 0.3, the emissive-only approach on PhysicalMaterial is too subtle. Instead:

The **outer glow meshes** (the additive blending `MeshBasicMaterial` behind each segment, documented at line 497) are the RIGHT approach for visibility. These should be the PRIMARY heat map visual, not a secondary effect.

Verify the outer glow meshes exist and are working:
- They should be 12 additional meshes behind the segments, scaled 1.05×
- `MeshBasicMaterial({ color: heatColor, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })`
- Opacity: `(score - 0.3) * 0.35` — meaning scores below 0.3 have zero glow (invisible), and score 1.0 has opacity 0.245

**The opacity is too low.** Change the glow opacity formula to be much more aggressive:

```typescript
// OLD (too subtle):
glowOpacity = (score - 0.3) * 0.35;

// NEW (visible):
glowOpacity = score < 0.2 ? 0 : (score - 0.2) * 0.6;
// Score 0.2 = 0 (invisible)
// Score 0.5 = 0.18
// Score 0.7 = 0.30
// Score 1.0 = 0.48
```

Also increase the glow mesh scale from 1.05 to **1.08** — slightly wider so it's visible as a distinct aura around the segment, not just thickening the segment itself.

### Also fix the segment material opacity:

The PhysicalMaterial opacity range of 0.04–0.44 sounds right on paper but may not be visible with the clearcoat/metalness properties fighting against it. Simplify: set a minimum base opacity of `0.06` for cold signs and ensure hot signs reach at least `0.25`:

```typescript
segmentMaterial.opacity = Math.max(0.06, 0.06 + score * 0.25) * zodiacOpacity;
```

---

## STEP 3: FIX ZODIAC BADGE STYLING (COLOURS ONLY)

The badges are updated via direct DOM refs in `useFrame`. Find this code.

**ONLY change colour properties. Do NOT touch size, shape, padding, border-radius, or transform.**

Apply these style changes based on score:

```typescript
const badge = badgeRefs[signIndex]; // however the DOM ref is accessed
if (!badge) return;

const score = currentScores[signName];

if (score > 0.6) {
  // HOT — red tint
  badge.style.backgroundColor = 'rgba(255, 68, 68, 0.2)';
  badge.style.borderColor = 'rgba(255, 68, 68, 0.5)';
  badge.style.boxShadow = '0 0 12px rgba(255, 68, 68, 0.3)';
} else if (score > 0.3) {
  // WARM — gold tint
  badge.style.backgroundColor = 'rgba(255, 215, 0, 0.12)';
  badge.style.borderColor = 'rgba(255, 215, 0, 0.35)';
  badge.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.15)';
} else {
  // COOL — default (restore original styling)
  badge.style.backgroundColor = ''; // clear to CSS default
  badge.style.borderColor = '';
  badge.style.boxShadow = 'none';
}
```

That's it for badges. Three colour tiers. No size changes. No shape changes. No transform changes. The gold/red tint on backgrounds and borders should be clearly visible against the default purple.

---

## STEP 4: VERIFY AND CLEAN UP

1. Remove all diagnostic `console.log` statements
2. Verify the heat map is visible by eye — hot signs should be OBVIOUSLY different
3. Verify badges look the same shape/size as before, just with colour tinting on hot signs
4. Verify cold signs look identical to how they looked before the heat map was added

---

## Build Steps

1. Add diagnostic logs (Step 1A, 1B, 1C)
2. Run the app and check browser console — verify scores calculate correctly
3. Verify materials are individual per segment — fix if shared
4. Verify useFrame is running material updates
5. Fix outer glow mesh opacity formula (more aggressive)
6. Fix outer glow mesh scale (1.05 → 1.08)
7. Fix segment base opacity formula
8. Fix badge DOM styling — ONLY background, borderColor, boxShadow — three tiers (hot/warm/cool)
9. Remove all diagnostic logs
10. Test: Pisces area (many planets) clearly glows warmer than Libra area (empty)
11. Test: badges for hot signs have gold/red tint, cold signs look default purple
12. Test: badge shape/size is UNCHANGED from before
13. Test: navigate days — heat map shifts
14. Test: zodiac taps still work
15. Test: ALL other features still work
16. Run `npm run build` — no errors
17. **UPDATE `engine/ARCHITECTURE.md`** — update the heat map opacity formulas
18. Commit: `fix: zodiac heat map — diagnostic + stronger glow + safe badge colours`
19. Push to **main** branch using `git push origin master:main`
