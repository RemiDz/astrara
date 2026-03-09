# ASTRARA — Heat Map: Runtime Verification

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## Task

The heat map fix (tagging materials with userData.heatMapManaged) did not produce visible results. We need to verify what's ACTUALLY happening at runtime — what are the final material values AFTER all useFrame hooks have run?

---

## Step 1: Add a LATE useFrame observer

Add a NEW useFrame hook at the TOP level of the scene (in WheelScene or similar — it must run AFTER both OuterZodiacRing and GeoFadeGroup). Use a high priority number to ensure it runs last:

```typescript
// Add this as a separate component placed AFTER GeoFadeGroup in the JSX tree
function HeatMapDebugger({ segmentMaterials, glowMaterials, scores }) {
  const loggedRef = useRef(false);
  
  useFrame(() => {
    if (loggedRef.current) return;
    // Wait 3 seconds for everything to settle
    if (performance.now() < 3000) return;
    loggedRef.current = true;
    
    console.log('=== FINAL MATERIAL STATE (after ALL useFrame hooks) ===');
    
    segmentMaterials.forEach((mat, i) => {
      const signName = ZODIAC_SIGNS[i]; // or however signs are indexed
      console.log(`${signName}: opacity=${mat.opacity.toFixed(3)}, emissiveIntensity=${mat.emissiveIntensity?.toFixed(3)}, emissive=${mat.emissive?.getHexString()}, heatMapManaged=${mat.userData?.heatMapManaged}`);
    });
    
    console.log('--- GLOW MATERIALS ---');
    glowMaterials.forEach((mat, i) => {
      const signName = ZODIAC_SIGNS[i];
      console.log(`${signName} glow: opacity=${mat.opacity.toFixed(3)}, visible=${mat.visible}, heatMapManaged=${mat.userData?.heatMapManaged}`);
    });
    
    console.log('--- IMPACT SCORES ---');
    console.log(JSON.stringify(scores));
  });
  
  return null;
}
```

Expose `segmentMaterials`, `glowMaterials`, and the computed `scores` to this component however makes sense (refs, props, context, etc.).

---

## Step 2: Run and report

Run `npm run dev`, open the app, wait 3+ seconds, check the console.

Report the FULL output. Specifically I need to know:

1. Are ALL 12 segment opacities identical? If yes → something is still overwriting them
2. Do ANY glow materials have opacity > 0? If all are 0 → still being zeroed
3. Are the heatMapManaged flags actually set on the materials?
4. Do the impact scores have variation? (Pisces should be high, Libra should be low)
5. Are emissiveIntensity values different between hot and cold signs?

---

## Step 3: If the problem is found

Based on what you find:

### If GeoFadeGroup is STILL overwriting (all opacities identical):
The `userData.heatMapManaged` check is not working. Instead of tagging materials, MOVE the segment meshes and glow meshes OUTSIDE of the GeoFadeGroup entirely. Place them as siblings, not children. OuterZodiacRing can still position them in the same location using the same coordinates — they just won't be inside GeoFadeGroup's traversal scope.

### If opacities ARE different but just too subtle:
Force-test with extreme values. Temporarily set the hottest sign's segment opacity to `0.9` and its glow opacity to `0.8`. If THAT is still invisible, the meshes aren't rendering at all (maybe they're behind something, or face culling, or wrong render order).

### If scores have no variation (all similar values):
The scoring function has a bug — all signs get similar scores. Check if planet.zodiacSign values match the sign names used in the scoring function (case sensitivity, 'Pisces' vs 'pisces' vs 'PISCES').

---

## Step 4: Implement the fix and verify

Whatever the root cause, fix it. Then add one final verification log that fires once at 5 seconds:

```typescript
console.log('HEAT MAP VERIFICATION:');
console.log('Highest opacity sign:', /* sign with highest segment opacity */);
console.log('Lowest opacity sign:', /* sign with lowest segment opacity */);
console.log('Opacity range:', lowestOpacity, '→', highestOpacity);
console.log('Glow visible count:', /* how many glow materials have opacity > 0.01 */);
```

The opacity range should be AT LEAST 0.04 → 0.25 (6x difference). If the range is less than 3x, the heat map won't be noticeable — increase the formula multipliers.

---

## Step 5: Clean up and commit

1. Remove ALL diagnostic logs
2. Verify visually: hot signs are OBVIOUSLY different from cold signs
3. Run `npm run build` — no errors
4. **UPDATE `engine/ARCHITECTURE.md`** — document the final working heat map implementation and any structural changes (e.g. meshes moved outside GeoFadeGroup)
5. Commit: `fix: zodiac heat map — resolve GeoFadeGroup opacity override`
6. Push to **main** branch using `git push origin master:main`
