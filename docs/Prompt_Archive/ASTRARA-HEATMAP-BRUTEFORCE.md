# ASTRARA — Heat Map: Brute Force Test + Label Visibility Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## PART A: BRUTE FORCE HEAT MAP TEST

Every previous attempt at the heat map has produced no visible change. Before trying anything else, we need a BRUTE FORCE test to confirm that we CAN make zodiac signs look different from each other.

### Test 1: Force one segment to be obviously different

In `AstroWheel3D.tsx`, find the Pisces segment material (index for Pisces in the ZODIAC_SIGNS array). In the `useFrame` hook, AFTER all other material updates, add a hard override:

```typescript
// BRUTE FORCE TEST — remove after confirming visibility
const piscesIndex = /* index of Pisces in the array */;
segmentMaterials[piscesIndex].color.set('#00ff00');  // bright green
segmentMaterials[piscesIndex].opacity = 0.8;
segmentMaterials[piscesIndex].emissive.set('#00ff00');
segmentMaterials[piscesIndex].emissiveIntensity = 2.0;
segmentMaterials[piscesIndex].metalness = 0;
segmentMaterials[piscesIndex].clearcoat = 0;
segmentMaterials[piscesIndex].roughness = 1;
segmentMaterials[piscesIndex].needsUpdate = true;
```

Run `npm run dev` and look at the wheel.

**If Pisces segment is bright green** → the material pipeline works, something in the heat map formula is still being subtle or overwritten. Continue to Step 2.

**If Pisces segment is NOT green** → something is overwriting AFTER our useFrame, or we're modifying the wrong material objects. In that case:

1. Log `segmentMaterials[piscesIndex].uuid` in our useFrame
2. In the same useFrame, traverse the scene and find ALL meshes in the OuterZodiacRing area, log their material UUIDs
3. Check if our material refs match the actual meshes in the scene graph — maybe R3F recreated the materials

### Test 2: Force one badge to be obviously different

In the same useFrame where badge DOM refs are updated, add:

```typescript
// BRUTE FORCE TEST — remove after confirming visibility
const piscesBadgeRef = /* however the Pisces badge DOM ref is accessed */;
if (piscesBadgeRef) {
  piscesBadgeRef.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
  piscesBadgeRef.style.borderColor = 'rgba(0, 255, 0, 1.0)';
  piscesBadgeRef.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
}
```

**If Pisces badge turns bright green** → DOM ref updates work, the heat map colour values are just too subtle.

**If Pisces badge does NOT turn green** → the DOM ref for that badge is wrong, null, or being overwritten by React re-renders (since badges are `<Html>` overlays, React might be re-rendering them and wiping inline styles).

### Step 2: Based on test results, implement the real fix

**If segment brute force WORKS:**
The materials respond to changes. The issue was that the heat map formula values were still too subtle or being partially overwritten. Apply the heat map using the same approach as the brute force test — set ALL properties explicitly (color, opacity, emissive, emissiveIntensity, metalness, clearcoat, roughness) based on the score, not just opacity and emissive. Reset metalness and clearcoat to near-zero for hot signs so the emissive colour actually shows through.

**If segment brute force FAILS:**
The material refs don't match the scene. This means R3F is creating its own materials from JSX props and ignoring our refs. The fix would be to use R3F's `ref` system on the `<meshPhysicalMaterial>` JSX element directly, OR switch to using `onBeforeRender` callbacks, OR use a completely different approach: render a SECOND set of overlay meshes specifically for the heat map (same geometry, positioned slightly in front, using simple `MeshBasicMaterial` with additive blending — guaranteed to work because there's no material property fighting).

**If badge brute force WORKS:**
Apply the three-tier colour system (cool=default, warm=gold, hot=red) using the same direct style assignment approach.

**If badge brute force FAILS:**
The `<Html>` overlays are being re-rendered by React, wiping the imperative style changes. Fix: pass the impact score as a prop/state to the badge component and apply styles declaratively in React (via className or style prop in the JSX), not imperatively in useFrame.

### Step 3: Remove brute force overrides and apply the real heat map

Once you know which approach works, implement the heat map properly:

**For segments** (if materials respond to direct assignment):
```typescript
const score = impactScores[signName];
const mat = segmentMaterials[i];

if (score > 0.5) {
  // HOT
  mat.color.set('#FF4444');
  mat.emissive.set('#FF4444');
  mat.emissiveIntensity = 0.8 + 0.2 * Math.sin(time * 3);
  mat.opacity = 0.35 * zodiacOpacity;
  mat.metalness = 0.02;
  mat.clearcoat = 0.05;
} else if (score > 0.25) {
  // WARM
  mat.color.set('#FFD700');
  mat.emissive.set('#FFD700');
  mat.emissiveIntensity = 0.4;
  mat.opacity = 0.18 * zodiacOpacity;
  mat.metalness = 0.1;
  mat.clearcoat = 0.2;
} else {
  // COOL — default appearance
  mat.color.set(elementColor);
  mat.emissive.set(elementColor);
  mat.emissiveIntensity = 0.05;
  mat.opacity = 0.06 * zodiacOpacity;
  mat.metalness = 0.15;
  mat.clearcoat = 0.3;
}
mat.needsUpdate = true;
```

**For badges** (if DOM refs respond):
```typescript
if (score > 0.5) {
  badge.style.backgroundColor = 'rgba(255, 68, 68, 0.25)';
  badge.style.borderColor = 'rgba(255, 68, 68, 0.6)';
  badge.style.boxShadow = '0 0 14px rgba(255, 68, 68, 0.35)';
} else if (score > 0.25) {
  badge.style.backgroundColor = 'rgba(255, 215, 0, 0.15)';
  badge.style.borderColor = 'rgba(255, 215, 0, 0.4)';
  badge.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.2)';
} else {
  badge.style.backgroundColor = '';
  badge.style.borderColor = '';
  badge.style.boxShadow = 'none';
}
```

---

## PART B: LABEL TEXT VISIBILITY

The floating label above the mother shape ("URANAS ĮEINA Į DVYNIUS") is too dark to read against the dark background.

### Fix

Find the `<Html>` label in `CrystallineCore.tsx`. Update the text styling:

```
OLD: color: rgba(255, 255, 255, 0.35)
NEW: color: rgba(255, 255, 255, 0.65)
```

Also increase the text-shadow glow:

```
OLD: text-shadow: 0 0 12px rgba(elementColor, 0.3)
NEW: text-shadow: 0 0 16px rgba(elementColor, 0.5), 0 0 30px rgba(elementColor, 0.2)
```

The double text-shadow creates a tighter bright glow plus a wider soft halo — making the text readable without being harsh.

If the label font-size is below 11px, increase to `12px`.

---

## Build Steps

1. Add brute force green test for Pisces segment material
2. Add brute force green test for Pisces badge DOM ref
3. Run `npm run dev` and check results
4. Based on results, implement the correct approach (see Step 2 above)
5. Remove all brute force test code
6. Apply the three-tier heat map (hot/warm/cool) to segments and badges
7. Fix label text opacity (0.35 → 0.65) and text-shadow
8. Test: hot signs (Pisces area) are VISIBLY different from cold signs (Libra area)
9. Test: label text above mother shape is clearly readable
10. Test: badge shapes UNCHANGED (no border-radius, size, or padding changes)
11. Test: ALL other features still work
12. Run `npm run build` — no errors
13. **UPDATE `engine/ARCHITECTURE.md`**
14. Commit: `fix: zodiac heat map brute force approach + label visibility`
15. Push to **main** branch using `git push origin master:main`
