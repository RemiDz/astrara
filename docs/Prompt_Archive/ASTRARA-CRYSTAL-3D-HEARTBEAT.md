# ASTRARA — Crystalline Core: Remove Flat Centre + Add Heartbeat + Independent Rotation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

Only modify the Crystalline Core component. Everything else stays the same.

---

## Problem 1: Flat 2D Centre

The sacred geometry form has a flat vertical plane of geometry in the centre that makes the whole thing look 2D when rotating. The surrounding spherical elements look 3D, but the centre kills the illusion.

### Fix

Find the centre-most geometry layers (the circles/petals that sit on a single flat plane at the core of the form). These need to be redistributed:

- Take the flat centre geometry and split it across MULTIPLE planes at different angles — rotate copies at 60° and 120° around the Y-axis so there's no single flat face visible from any viewing angle
- Every layer of geometry should be on a different rotational plane — when the form rotates, there should be NO angle where it collapses into a flat line
- Think of it like nested gyroscope rings — every ring at a different angle, no two on the same plane

---

## Problem 2: Missing Heartbeat Wave

The harmonicwaves.app Living Mandala has a flowing sine wave that passes horizontally through the centre of the geometry — like a cosmic heartbeat or energy pulse. This is missing from the Astrara version.

### Fix

**Reference the harmonicwaves.app source code** at:
```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\harmonicwaves.app
```

Find the sine wave / heartbeat element in the Living Mandala component. Study how it's drawn and animated — the wave shape, amplitude, frequency, colour, opacity, animation speed.

Recreate this heartbeat wave in the Astrara Crystalline Core:

- A flowing sine wave that passes horizontally through the centre of the sacred geometry form
- The wave should be animated — it should flow/travel continuously (animate the phase offset so the wave appears to move through the form)
- Use `THREE.Line` with `THREE.BufferGeometry` — sample the sine curve at ~100 points
- Material: `LineBasicMaterial` with additive blending, same element colour as the rest of the form, slightly higher opacity than the geometry circles (maybe `0.35-0.45`) so it reads as the brightest element — the heartbeat
- The wave amplitude should roughly match the radius of the central geometry
- Animate the wave by shifting the phase in `useFrame`: `x offset += delta * speed`
- The wave should also breathe — amplitude gently oscillates with the same breathing cycle as the rest of the form
- Position the wave on the XZ plane (horizontal through the form centre) so it has 3D presence when the form rotates — NOT on a flat vertical plane

---

## Problem 3: Rotation Linked to Wheel

Currently the Crystalline Core rotates with the wheel's auto-rotation (via OrbitControls). It should rotate independently — slower, more powerful, like it has its own gravity.

### Fix

- The Crystalline Core group must NOT be a child of any group that is affected by OrbitControls auto-rotation or wheel rotation
- Give the Crystalline Core its OWN rotation in `useFrame`, completely independent:
  - Y-axis rotation: `0.03 rad/s` (one full rotation every ~210 seconds — very slow, majestic)
  - This is significantly slower than the wheel's auto-rotation speed (which is `0.3` autoRotateSpeed)
- The crystal should appear to float above the wheel with its own independent motion — the wheel spins underneath while the crystal turns at its own pace
- The camera orbit (from OrbitControls) will still affect the viewing angle of the crystal, which is correct — the user orbiting the scene should see the crystal from different angles. But the crystal's self-rotation is independent from the wheel's self-rotation.

**Implementation approach:**
- Make sure the CrystallineCore group's rotation is set directly in `useFrame` using `ref.current.rotation.y += delta * 0.03`
- If the crystal is currently inside a parent group that gets rotated by OrbitControls auto-rotate, move it to be a sibling at the scene root level (but still positioned at `[0, 1.6, 0]`)
- OR counteract the parent rotation by applying the inverse — but moving it to scene root is cleaner

---

## Build Steps

1. Open `CrystallineCore.tsx`
2. Fix the flat centre — redistribute centre geometry across multiple rotational planes (60° and 120° Y-axis offsets)
3. Read the harmonicwaves.app source to study the heartbeat sine wave
4. Add the heartbeat sine wave through the centre of the form — horizontal, animated, flowing
5. Decouple the crystal's rotation from the wheel — ensure it rotates independently at `0.03 rad/s`
6. Test: rotate the view around — the crystal should look 3D from EVERY angle, no flat collapse
7. Test: the heartbeat wave is visible flowing through the centre
8. Test: the crystal rotates visibly slower than the wheel underneath
9. Test: all other crystal behaviour unchanged (breathing, colour, tap, compass, settings, visibility)
10. Test: ALL other app features still work
11. Run `npm run build`
12. **UPDATE `engine/ARCHITECTURE.md`** — note the spherical distribution fix, heartbeat wave, and independent rotation
13. Commit: `fix: crystal fully 3D, add heartbeat wave, independent rotation`
14. Push to **main** branch using `git push origin master:main`
