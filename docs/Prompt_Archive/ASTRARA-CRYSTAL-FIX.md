# ASTRARA — Crystalline Core Fix: Remove Toroid + Reposition Higher

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ CRITICAL: DO NOT BREAK EXISTING FEATURES

All existing features must continue working. This is a targeted modification to the Crystalline Core only.

---

## Fix 1: Remove Toroidal Field Form

The Toroidal Field form is being removed. The crystal now only has TWO forms:

- **Seed of Life** — shown when Water signs dominate
- **Icosahedron** — shown when Earth signs dominate

For Fire dominant and Air dominant (and any tie/default), use **Icosahedron** as the fallback.

### Steps:
- Delete `ToroidalField.tsx` (or remove the component entirely if it's inline)
- Remove all imports and references to ToroidalField from `CrystallineCore.tsx` (or wherever the form switching logic lives)
- Update the element → form mapping:
  - Fire → Icosahedron
  - Water → Seed of Life
  - Earth → Icosahedron
  - Air → Icosahedron
  - Tie/default → Icosahedron
- Update the hybrid/morphing Air state — instead of cycling through three forms, Air now just shows Icosahedron (no cycling needed)
- Update settings form override options to only show: `Auto (Element)` / `Seed of Life` / `Icosahedron`
- Update Lithuanian i18n labels accordingly — remove "Toroidinis laukas" option
- Update localStorage logic — if a user previously had `astrara_crystal_form: 'toroid'` stored, treat it as `'auto'`
- Clean up any unused imports, variables, or utility functions that only served the Toroid

---

## Fix 2: Reposition Crystal Much Higher

The crystal is currently sitting almost on top of the wheel — it's way too low and visually merges with the planets and zodiac badges. It needs to float significantly higher with clear empty space between the wheel and the crystal.

### Steps:
- Change the crystal group's Y position from its current value to `1.4` (test this first — if it's still too close to the wheel, increase to `1.6`)
- The floating hover animation should oscillate around this new Y position: `1.4 + 0.03 * Math.sin(time * 0.5)`
- Move the crystal's `PointLight` to match the new Y position
- Update the energy stream curves — the control points need adjusting so the arcs look graceful reaching the new height. The control point Y should be roughly halfway between the planet position and the crystal position, with a slight outward X/Z offset for curvature
- The tap target / invisible hit area must also move to the new position

---

## Verification

1. Test: crystal floats clearly above the wheel with visible gap
2. Test: only Seed of Life and Icosahedron forms appear (no Toroid)
3. Test: Fire dominant day → Icosahedron shown
4. Test: Water dominant day → Seed of Life shown
5. Test: settings only show Auto / Seed of Life / Icosahedron
6. Test: energy streams arc gracefully up to the new height
7. Test: tap on crystal still works at new position
8. Test: ALL other features still work
9. Run `npm run build` — no errors
10. **UPDATE `engine/ARCHITECTURE.md`** — reflect the removal of Toroidal Field and the new Y position
11. Commit: `fix: remove toroid form, reposition crystal higher above wheel`
12. Push to **main** branch using `git push origin master:main`
