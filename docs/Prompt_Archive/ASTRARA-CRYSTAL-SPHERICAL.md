# ASTRARA — Crystalline Core: Flat to Spherical Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

Only modify the Crystalline Core geometry distribution. Everything else stays the same.

---

## Problem

The sacred geometry pattern looks like a flat 2D disc spinning when it rotates. It has no depth — all geometry lies on a single plane.

## Solution

Distribute the existing circle/petal geometry layers across a **spherical surface** instead of a flat plane. The result should read as a volumetric 3D spherical light form, not a flat card spinning.

### How To Do It

1. Read the current Crystalline Core component and understand all the circle/petal/arc layers it draws
2. Instead of placing all layers on the XY plane at Z=0, wrap them around an invisible sphere:
   - Some circles remain on the front face (XY plane)
   - Some circles are tilted/rotated at 30°, 60°, 90° around the X and Y axes
   - Some circles wrap around to the sides and back of the sphere
   - Think of the harmonicwaves.app mandala pattern projected onto a transparent globe
3. For each circle/petal layer, apply a rotation matrix before placing it in the group — rotate different layers by different amounts around different axes to create depth
4. The overall radius of the sphere distribution should match the current pattern size — do not make it larger or smaller
5. Keep the EXACT SAME line materials, additive blending, element colours, opacity breathing, centre glow, rotation animation, floating, tap interaction, settings toggle, and all visibility conditions
6. The only change is the spatial distribution: flat plane → spherical surface

---

## Build Steps

1. Open `CrystallineCore.tsx`
2. Find where the circle/petal geometries are positioned
3. Instead of all at Z=0, distribute layers across a sphere by rotating each layer's sub-group at various angles
4. Test: when rotating, the form now reads as a 3D spherical volume of light geometry
5. Test: all other crystal behaviour unchanged (breathing, colour, tap, settings, visibility)
6. Test: ALL other app features still work
7. Run `npm run build`
8. **UPDATE `engine/ARCHITECTURE.md`** — note the spherical distribution
9. Commit: `fix: crystal geometry distributed spherically for 3D depth`
10. Push to **main** branch using `git push origin master:main`
