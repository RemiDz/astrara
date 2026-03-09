# ASTRARA — Zodiac Heat Map v6: Badge Background Colour Only

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ CRITICAL: REMOVE ALL PREVIOUS HEAT MAP VISUALS FIRST

Remove EVERYTHING added by previous heat map attempts:
- Remove any outer circles, rings, arcs, or glow meshes added around badges
- Remove any outer colour band ring geometry
- Remove any badge boxShadow or glow effects
- Remove any ring segment material overrides (restore original appearance)
- Keep ONLY: `calculateZodiacImpact()` function, zodiac modal impact score bar, and the scoring logic

The wheel must look EXACTLY like it did before any heat map work started, except for what this spec adds.

---

## THE CHANGE: Badge Background Colour

The zodiac badges already exist. They already have a background colour (purple). Simply change that background colour based on impact score. No new elements. No glow. No shadows. No circles. Nothing added to the scene.

### How Badges Are Rendered

From ARCHITECTURE.md: badges are R3F `<Html>` overlays with direct DOM ref updates in useFrame. However, previous useFrame DOM approaches failed silently. 

**Use DECLARATIVE React styling instead.** Pass the impact score to each badge and apply the colour via React props in the JSX.

### Find the Badge Rendering Code

In `AstroWheel3D.tsx`, find where the 12 zodiac glyph badges are rendered. They're `<Html>` overlays at mid-radius of the outer ring. Each has a `<div>` or `<button>` with the glyph character inside.

### Apply Background Colour Based on Score

For each badge, set the `style.backgroundColor` based on that sign's impact score:

```typescript
// Inside the zodiac badge rendering loop:
const score = zodiacImpact[signName]; // 0 to 1

let badgeBg: string;
if (score >= 0.7) {
  badgeBg = 'rgba(220, 50, 50, 0.45)';     // intense — red-tinted
} else if (score >= 0.4) {
  badgeBg = 'rgba(220, 130, 0, 0.40)';      // hot — orange-tinted
} else if (score >= 0.2) {
  badgeBg = 'rgba(200, 180, 50, 0.30)';     // warm — gold-tinted
} else {
  badgeBg = '';  // cool — keep whatever default exists
}

// In the JSX:
<div style={{
  ...existingBadgeStyles,
  ...(badgeBg ? { backgroundColor: badgeBg } : {}),
}}>
  {glyph}
</div>
```

### That's It

No borderColor change. No boxShadow. No size change. No new geometry. No glow. Just the background fill colour of the existing badge shifting from purple to warm tones.

### Passing Scores

If `zodiacImpact` is not yet available inside `AstroWheel3D` where badges are rendered:

1. Calculate in `page.tsx`: `const zodiacImpact = useMemo(() => calculateZodiacImpact(planets, aspects), [planets, aspects])`
2. Pass as prop: `<AstroWheel3DWrapper zodiacImpact={zodiacImpact} ... />`
3. Forward through wrapper to `AstroWheel3D`
4. Use in the badge rendering loop

### React Re-render Concern

If badge styles are applied via direct DOM refs in useFrame (imperative) and React re-renders wipe them, the colour won't stick. To avoid this:

**Option A (preferred):** Apply the colour in the JSX directly (declarative). The badge div receives `zodiacImpact[signName]` and computes its own backgroundColor. React controls the style — it can't be wiped.

**Option B (if badges are fully imperative):** Store the impact scores in a ref and apply the backgroundColor in the same useFrame where other badge DOM updates happen. Make sure it runs AFTER any style resets.

Try Option A first. If it doesn't work because the badges are rendered differently than expected, fall back to Option B.

---

## VERIFY BEFORE COMMITTING

Open the app in the browser. Look at the badges:
- Pisces badge should have a warm/red background instead of purple
- Libra badge should still be default purple
- If they ALL look the same → it didn't work → debug and fix before committing

---

## Build Steps

1. Remove ALL previous heat map visual additions (circles, rings, glows, segment overrides)
2. Ensure zodiacImpact scores are passed to where badges are rendered
3. Apply backgroundColor to each badge based on score — declarative React style
4. Test: hot sign badges are visibly amber/orange/red background
5. Test: cold sign badges are default purple
6. Test: NO new visual elements on the wheel (no circles, no rings, no glow)
7. Test: badge shape completely unchanged
8. Test: ALL other features still work
9. Run `npm run build`
10. **UPDATE `engine/ARCHITECTURE.md`**
11. Commit: `feat: zodiac heat map — badge background colour only`
12. Push to **main** branch using `git push origin master:main`
