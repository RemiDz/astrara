# ASTRARA — Heat Map: Correct Colour Logic + Label Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

---

## Problem 1: Heat Map Colours Are Wrong

The ring segments now respond to material changes (confirmed working), but the colours are showing ELEMENT base colours (fire red, earth green, etc.) instead of INTENSITY-based colours. The heat map should show a SINGLE colour gradient based on impact score — NOT different colours per element.

### The correct colour system:

ALL signs should use the SAME colour gradient based on their impact score, regardless of their element:

```
Score 0 - 0.2:   DEFAULT — keep the existing element colour at very low opacity
                  This is the "cold" state — looks like the wheel always looked before
                  
Score 0.2 - 0.5:  WARM — golden amber glow
                  Segment colour: #FFD700 (gold)
                  
Score 0.5 - 0.8:  HOT — orange glow  
                  Segment colour: #FF8C00 (orange)
                  
Score 0.8 - 1.0:  INTENSE — red-hot glow
                  Segment colour: #FF4444 (red)
```

The point is: a user sees gold/orange/red segments and knows "something is happening there" — regardless of whether it's a fire, earth, air, or water sign. The element colours should only show on COLD signs (score < 0.2) as the subtle default.

### Fix the segment material update code:

Find the useFrame code that sets segment material properties. Replace the colour logic:

```typescript
const score = currentScores[signName]; // 0 to 1
const mat = segmentMaterials[i];

if (score >= 0.8) {
  // INTENSE — red hot
  mat.color.setHex(0xFF4444);
  mat.emissive.setHex(0xFF4444);
  mat.emissiveIntensity = 1.2 + 0.3 * Math.sin(time * 3.0);  // strong pulse
  mat.opacity = 0.40 * zodiacOpacity;
  mat.metalness = 0.02;
  mat.clearcoat = 0.05;
} else if (score >= 0.5) {
  // HOT — orange
  mat.color.setHex(0xFF8C00);
  mat.emissive.setHex(0xFF8C00);
  mat.emissiveIntensity = 0.7 + 0.15 * Math.sin(time * 2.5);
  mat.opacity = 0.28 * zodiacOpacity;
  mat.metalness = 0.05;
  mat.clearcoat = 0.1;
} else if (score >= 0.2) {
  // WARM — gold
  mat.color.setHex(0xFFD700);
  mat.emissive.setHex(0xFFD700);
  mat.emissiveIntensity = 0.4;
  mat.opacity = 0.16 * zodiacOpacity;
  mat.metalness = 0.1;
  mat.clearcoat = 0.2;
} else {
  // COLD — default element colour, barely visible
  mat.color.set(elementColors[signElement]);
  mat.emissive.set(elementColors[signElement]);
  mat.emissiveIntensity = 0.05;
  mat.opacity = 0.06 * zodiacOpacity;
  mat.metalness = 0.15;
  mat.clearcoat = 0.3;
}
```

### Fix the glow mesh colours too:

The glow meshes behind segments should match the same colour system:

```typescript
if (score >= 0.8) {
  glowMat.color.setHex(0xFF4444);
  glowMat.opacity = 0.5 * zodiacOpacity;
} else if (score >= 0.5) {
  glowMat.color.setHex(0xFF8C00);
  glowMat.opacity = 0.3 * zodiacOpacity;
} else if (score >= 0.2) {
  glowMat.color.setHex(0xFFD700);
  glowMat.opacity = 0.12 * zodiacOpacity;
} else {
  glowMat.opacity = 0;  // invisible for cold signs
}
```

### Fix badge colours to match:

The badge DOM styling should use the SAME colour system:

```typescript
if (score >= 0.8) {
  badge.style.backgroundColor = 'rgba(255, 68, 68, 0.25)';
  badge.style.borderColor = 'rgba(255, 68, 68, 0.6)';
  badge.style.boxShadow = '0 0 14px rgba(255, 68, 68, 0.35)';
} else if (score >= 0.5) {
  badge.style.backgroundColor = 'rgba(255, 140, 0, 0.2)';
  badge.style.borderColor = 'rgba(255, 140, 0, 0.5)';
  badge.style.boxShadow = '0 0 12px rgba(255, 140, 0, 0.25)';
} else if (score >= 0.2) {
  badge.style.backgroundColor = 'rgba(255, 215, 0, 0.12)';
  badge.style.borderColor = 'rgba(255, 215, 0, 0.35)';
  badge.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.15)';
} else {
  // COLD — restore defaults (clear inline overrides)
  badge.style.backgroundColor = '';
  badge.style.borderColor = '';
  badge.style.boxShadow = 'none';
}
```

### Remove any brute force test code

If any of the bright green test overrides from the previous spec are still in the code, remove them.

---

## Problem 2: Label Text Still Too Dark

The floating label above the mother shape was NOT fixed in the last update. Fix it now.

Find the `<Html>` element in `CrystallineCore.tsx` that renders the label text (e.g. "URANUS ENTERS GEMINI"). Update its inline styles:

### Current (too dark):
```
color: rgba(255, 255, 255, 0.35)
```

### New (readable):
```css
color: rgba(255, 255, 255, 0.7)
font-size: 12px
letter-spacing: 3px
text-shadow: 0 0 12px rgba(elementColor, 0.5), 0 0 28px rgba(elementColor, 0.25)
```

The text should be clearly readable but still ethereal — not bold, not harsh, but definitely visible against the dark background. The double text-shadow creates a tight bright glow plus a wider ambient halo.

If the label currently uses a smaller font-size than 12px, increase it to 12px.

---

## Build Steps

1. Remove any remaining brute force test code (bright green overrides)
2. Replace segment material colour logic with the intensity-based system (cold→gold→orange→red)
3. Replace glow mesh colour logic to match
4. Replace badge DOM colour logic to match
5. Fix label text: opacity 0.35 → 0.7, add double text-shadow, ensure font-size 12px
6. Test: signs with high impact scores show gold/orange/red — NOT element colours
7. Test: signs with low impact scores show default dim appearance
8. Test: Pisces area (score ~10/10) should be clearly red/orange
9. Test: empty signs (score ~1/10) should be dim default
10. Test: label text above mother shape is clearly readable
11. Test: navigate days — colours shift based on new scores
12. Test: badge shapes UNCHANGED
13. Test: ALL other features still work
14. Run `npm run build` — no errors
15. **UPDATE `engine/ARCHITECTURE.md`**
16. Commit: `fix: heat map intensity colours (gold→orange→red) + label visibility`
17. Push to **main** branch using `git push origin master:main`
