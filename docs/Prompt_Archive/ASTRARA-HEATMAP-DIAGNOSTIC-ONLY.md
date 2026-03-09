# ASTRARA — Zodiac Heat Map: DIAGNOSTIC ONLY (Do Not Fix Yet)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ THIS IS A DIAGNOSTIC TASK — DO NOT FIX ANYTHING

Do NOT change any visual code. Do NOT change any materials, colours, opacities, or badge styles. ONLY add diagnostic console.log statements, run the app, and report what you find.

---

## Task

The zodiac heat map is supposed to show visual differences between impacted and non-impacted signs, but NO difference is visible on the wheel. We need to find out WHY before attempting another fix.

Add the following diagnostic logs, run `npm run dev`, open the app in the browser, and report the console output.

---

## Diagnostic 1: Are impact scores being calculated?

Find where `calculateZodiacImpact()` is called (likely in `AstroWheel3D.tsx` or `page.tsx`).

Add immediately after the calculation:

```typescript
console.log('=== ZODIAC IMPACT DIAGNOSTIC ===');
console.log('Scores:', JSON.stringify(
  Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, (v * 10).toFixed(1)])
  )
));
console.log('Highest:', Object.entries(scores).sort((a, b) => b[1] - a[1])[0]);
console.log('Lowest:', Object.entries(scores).sort((a, b) => a[1] - b[1])[0]);
```

**Expected**: Pisces/Aquarius should show high scores (5+), empty signs should show 0 or near-0.

---

## Diagnostic 2: Are segment materials individual or shared?

Find where the 12 zodiac segment meshes are created. Add:

```typescript
// After all segment materials are created/assigned:
const allMats = []; // collect all 12 segment materials into this array
// ... (adapt to however they're stored — array, object, refs, etc.)
console.log('=== SEGMENT MATERIAL DIAGNOSTIC ===');
console.log('Total segment materials:', allMats.length);
console.log('Unique materials:', new Set(allMats).size);
console.log('Are they the same object?', allMats[0] === allMats[1]);
```

**Expected**: 12 materials, 12 unique. If unique count < 12, materials are shared and heat map changes affect ALL segments equally — this would explain the bug.

---

## Diagnostic 3: Is the useFrame heat map update running?

Find the `useFrame` callback that updates segment materials based on impact scores. Add a one-time log using a ref:

```typescript
const heatmapLoggedRef = useRef(false);

// Inside useFrame, at the start of the heat map update section:
if (!heatmapLoggedRef.current) {
  heatmapLoggedRef.current = true;
  console.log('=== HEATMAP USEFRAME DIAGNOSTIC ===');
  console.log('useFrame heat map code IS running');
  // Log the actual values being applied to one segment (e.g., Pisces = index for Pisces)
  console.log('Pisces target score:', targetScores['Pisces']);
  console.log('Pisces current score:', currentScores['Pisces']);
  console.log('Pisces opacity being set:', /* the opacity value */);
  console.log('Pisces emissive intensity being set:', /* the emissive value */);
}
```

If this log NEVER appears → the useFrame code is not running (maybe it's in a conditional block that's never true, or behind a flag).

---

## Diagnostic 4: Are outer glow meshes rendering?

Find the 12 outer glow meshes (additive blending `MeshBasicMaterial` behind segments). Add:

```typescript
console.log('=== GLOW MESH DIAGNOSTIC ===');
console.log('Glow meshes exist:', glowMeshes.length);
console.log('Glow mesh visible:', glowMeshes[0]?.visible);
console.log('Pisces glow opacity:', /* pisces glow material opacity */);
```

---

## Diagnostic 5: Are badge DOM refs valid?

Find where zodiac badge styles are updated via direct DOM refs in useFrame. Add a one-time log:

```typescript
if (!badgeLoggedRef.current) {
  badgeLoggedRef.current = true;
  console.log('=== BADGE DOM DIAGNOSTIC ===');
  console.log('Badge refs count:', badgeRefs.filter(Boolean).length);
  console.log('First badge ref:', badgeRefs[0]?.tagName, badgeRefs[0]?.className);
  console.log('Pisces badge current background:', badgeRefs[piscesIndex]?.style.backgroundColor);
}
```

---

## After Adding All Diagnostics

1. Run `npm run dev`
2. Open the app in browser
3. Open browser console (F12 → Console tab)
4. Wait for the wheel to fully load
5. Copy ALL diagnostic output from the console
6. Report the findings as a commit message or output

**Format your findings like this:**

```
DIAGNOSTIC RESULTS:
1. Scores calculating: YES/NO — [highest sign and score]
2. Materials unique: YES/NO — [count unique vs total]  
3. useFrame running: YES/NO — [Pisces opacity and emissive values]
4. Glow meshes exist: YES/NO — [count and Pisces opacity]
5. Badge refs valid: YES/NO — [count and current background]
```

---

## After Reporting

Remove ALL diagnostic console.log statements. Do NOT commit them. Do NOT push. Just report the findings and wait for the next instruction.
