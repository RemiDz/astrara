# ASTRARA — Badge Colour Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## STEP 1: REMOVE EVERYTHING

Remove ALL heat map visual code added in every previous attempt. This includes:
- Any glow effects, halos, circles, rings around badges
- Any outer ring band geometry
- Any outer glow meshes
- Any boxShadow on badges
- Any badge scale/size changes
- Any segment material colour overrides
- Any MeshBasicMaterial glow layers

Remove it ALL. The wheel must look exactly like it did before ANY heat map work started. The ONLY things to keep are:
- `calculateZodiacImpact()` function in `src/lib/zodiac-impact.ts`
- The impact score bar in the zodiac tap modal (WheelTooltip)
- The zodiacImpact prop being passed through the component tree

---

## STEP 2: FIND THE BADGE BACKGROUND

In `AstroWheel3D.tsx`, find where the zodiac glyph badges are created. They are `<Html>` overlays. Each badge has a `<div>` or `<button>` element.

That element has a `backgroundColor` CSS property set somewhere — either inline style, or via a CSS class. Find it. Log the current value:

```
console.log('Current badge background:', currentBackgroundColor);
```

It's probably something like `rgba(168, 85, 247, 0.15)` or similar purple.

---

## STEP 3: CHANGE ONLY THAT ONE PROPERTY

Replace the single `backgroundColor` value with a value that depends on the impact score for that sign. Nothing else changes.

```typescript
// The ONLY change — replace the existing static backgroundColor with:
const score = zodiacImpact?.[signId] ?? 0;

const backgroundColor = score >= 0.7
  ? 'rgba(220, 50, 50, 0.35)'      // red
  : score >= 0.4
    ? 'rgba(220, 140, 0, 0.30)'    // orange  
    : score >= 0.2
      ? 'rgba(200, 175, 50, 0.25)' // gold
      : 'rgba(168, 85, 247, 0.15)'; // default purple (the original value — adjust to match actual current value)
```

Apply this as the `backgroundColor` in the same place the current static value is set.

## WHAT NOT TO DO

- Do NOT add `boxShadow`
- Do NOT add any glow or halo
- Do NOT add any new HTML elements
- Do NOT add any new Three.js meshes or geometry
- Do NOT change `borderColor`
- Do NOT change `borderRadius`
- Do NOT change `padding`, `width`, `height`, `fontSize`
- Do NOT change `transform` or `scale`
- Do NOT add any CSS animations
- ONLY change `backgroundColor` — ONE property, ONE line of code

---

## STEP 4: VERIFY

Open the app. Look at the badges.
- Pisces badge background: should be reddish/orange instead of purple
- Libra badge background: should be default purple
- If ALL badges are the same colour → the score is not reaching the badge rendering code → debug the prop chain
- If badges have glow/halo/shadow → you added something you shouldn't have → remove it

---

## Build Steps

1. Remove ALL previous heat map visuals (everything)
2. Find the exact line where badge backgroundColor is set
3. Replace that ONE value with the score-based conditional
4. Verify: hot badges have warm background, cold badges have purple background
5. Verify: NO glow, NO shadow, NO halos, NO new elements anywhere
6. Run `npm run build`
7. **UPDATE `engine/ARCHITECTURE.md`**
8. Commit: `feat: zodiac badge background colour by impact score`
9. Push to **main** branch using `git push origin master:main`
