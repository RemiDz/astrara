# ASTRARA — Heliocentric Fix: Labels & Ring Visibility

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Three Fixes

---

## Fix 1: Duplicate Sun Label

The Sun is showing two text labels in heliocentric view. Find ALL places where a Sun label is rendered and remove the duplicate. There should be only ONE label showing "☉ Sun" (or the translated equivalent) at the centre. Check both `AstroWheel3D.tsx` and any child components — likely one label comes from the `SunCentreLabel` component and another from the general planet label logic.

---

## Fix 2: Moon Label — Icon Only

The Moon's text label "☽ Moon" overlaps with Earth's "Home" label in heliocentric view. 

Fix: In heliocentric view, the Moon label should show ONLY the glyph `☽` with NO text name after it. 

Do NOT change the Moon's geocentric label — that stays as it currently is.

---

## Fix 3: Orbital Rings Too Faint

Double ALL orbital ring opacity values:

```
Mercury: 0.08 → 0.16
Venus:   0.08 → 0.16
Earth:   0.10 → 0.20
Mars:    0.08 → 0.16
Jupiter: 0.06 → 0.12
Saturn:  0.06 → 0.12
Uranus:  0.05 → 0.10
Neptune: 0.05 → 0.10
Pluto:   0.04 → 0.08
Moon orbit ring: 0.12 → 0.24
```

---

## Do NOT change anything else.

## Build & Deploy

1. Run `npm run build`
2. Test: only ONE Sun label at centre in heliocentric view
3. Test: Moon shows only ☽ glyph, no "Moon" text, in heliocentric view
4. Test: orbital rings clearly visible against the dark background
5. Commit: `fix: duplicate sun label, moon icon only, brighter orbital rings`
6. Push to `main`
