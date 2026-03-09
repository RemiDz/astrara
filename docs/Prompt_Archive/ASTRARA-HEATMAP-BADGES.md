# ASTRARA — Heat Map v4: Badges Only (Abandon Ring Segments)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

---

## New Strategy

STOP trying to make ring segments show the heat map. The ring segments are too thin, too far from camera, and material properties fight against visibility. 

Instead, make the heat map visible ONLY through the zodiac **badges** — the `<Html>` overlays that users actually look at. These are standard HTML elements where we have full control over background, border, shadow, and size.

### Step 1: Revert ring segments to their original appearance

Remove ALL heat map colour changes from the ring segment materials. Restore them to their original state from BEFORE the heat map feature was added — the default element colours, opacity 0.06-0.08, original metalness/clearcoat values. The ring should look exactly like it did before we started the heat map work.

Also remove the outer glow meshes if they were added for the heat map — they're not needed anymore.

### Step 2: Apply heat map to badges via React props (NOT useFrame DOM manipulation)

The previous approach of setting badge styles imperatively in `useFrame` via DOM refs clearly isn't working reliably. Switch to a **declarative React approach**: pass the impact score to each badge component as a prop, and let React handle the styling.

Find where zodiac badges are rendered in the JSX (the `<Html>` overlays with zodiac glyphs). Each badge should receive its impact score:

```tsx
// For each zodiac sign badge:
<Html center position={badgePosition}>
  <div 
    style={{
      ...existingBadgeStyles,
      ...getHeatMapStyles(impactScores[signName]),
    }}
    onClick={handleZodiacTap}
  >
    {zodiacGlyph}
  </div>
</Html>
```

### Step 3: The heat map style function

```typescript
function getHeatMapStyles(score: number): React.CSSProperties {
  if (score >= 0.7) {
    // INTENSE — red glow, pulsing animation
    return {
      backgroundColor: 'rgba(255, 68, 68, 0.3)',
      borderColor: 'rgba(255, 68, 68, 0.7)',
      boxShadow: '0 0 16px rgba(255, 68, 68, 0.5), 0 0 32px rgba(255, 68, 68, 0.2)',
      animation: 'heatPulse 2s ease-in-out infinite',
    };
  }
  if (score >= 0.4) {
    // HOT — orange glow
    return {
      backgroundColor: 'rgba(255, 140, 0, 0.25)',
      borderColor: 'rgba(255, 140, 0, 0.6)',
      boxShadow: '0 0 12px rgba(255, 140, 0, 0.4), 0 0 24px rgba(255, 140, 0, 0.15)',
    };
  }
  if (score >= 0.2) {
    // WARM — gold tint
    return {
      backgroundColor: 'rgba(255, 215, 0, 0.15)',
      borderColor: 'rgba(255, 215, 0, 0.45)',
      boxShadow: '0 0 8px rgba(255, 215, 0, 0.25)',
    };
  }
  // COOL — no changes, return empty to keep defaults
  return {};
}
```

### Step 4: Add pulse animation for intense signs

Add to `globals.css`:

```css
@keyframes heatPulse {
  0%, 100% {
    box-shadow: 0 0 16px rgba(255, 68, 68, 0.5), 0 0 32px rgba(255, 68, 68, 0.2);
  }
  50% {
    box-shadow: 0 0 22px rgba(255, 68, 68, 0.7), 0 0 40px rgba(255, 68, 68, 0.35);
  }
}
```

### Step 5: How to pass scores to badges

The impact scores are calculated in `page.tsx` via `calculateZodiacImpact()` and passed as a prop through the component tree:

```
page.tsx (calculates zodiacImpact) 
  → AstroWheel3DWrapper (passes zodiacImpact prop)
    → AstroWheel3D (receives zodiacImpact, uses it when rendering badges)
```

If `zodiacImpact` is not yet being passed as a prop to `AstroWheel3D`, add it. The scores should be a `Record<string, number>` mapping sign names to 0-1 scores.

Inside `AstroWheel3D`, where the zodiac glyph `<Html>` badges are rendered in the JSX loop, apply the `getHeatMapStyles()` based on the score for each sign.

### Step 6: Verify the approach works

This approach WILL work because:
- HTML `backgroundColor`, `borderColor`, `boxShadow` are fully standard CSS — no Three.js material quirks
- React declarative styling cannot be overwritten by useFrame or GeoFadeGroup
- The badges are the largest, most visible zodiac elements on the wheel
- Gold/orange/red glows on badges will be immediately obvious against the default purple

### Important: Do NOT change badge shape

Keep all existing badge properties unchanged:
- Same `border-radius`
- Same `padding`
- Same `font-size`
- Same `width` / `height`
- Same `transform` (no scale changes)

ONLY add/override: `backgroundColor`, `borderColor`, `boxShadow`, and optionally `animation`.

---

## Build Steps

1. Revert ALL ring segment materials to their pre-heat-map state (original element colours, original opacity, original metalness/clearcoat)
2. Remove outer glow meshes if they exist
3. Remove ALL imperative DOM manipulation of badge styles from useFrame (the old approach)
4. Ensure `zodiacImpact` scores are calculated in page.tsx and passed as prop to AstroWheel3D
5. Create `getHeatMapStyles()` function
6. Apply heat map styles declaratively to each badge in the JSX
7. Add `heatPulse` CSS keyframe animation to globals.css
8. Test: Pisces badge (high score) shows red/orange glow — OBVIOUSLY different from Libra (low score)
9. Test: badge shapes are IDENTICAL to before (same border-radius, padding, size)
10. Test: ring segments look like they did before heat map work started
11. Test: navigate days — badge colours update
12. Test: zodiac taps still work
13. Test: ALL other features still work
14. Run `npm run build` — no errors
15. **UPDATE `engine/ARCHITECTURE.md`** — document that heat map is badge-only, declarative React styling
16. Commit: `feat: zodiac heat map v4 — declarative badge styling (abandon ring segments)`
17. Push to **main** branch using `git push origin master:main`
