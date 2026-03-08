# ASTRARA — Crystalline Core: Living 4D Energy Focal Point

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## ⚠️ CRITICAL: DO NOT BREAK EXISTING FEATURES

All existing features MUST continue working: wheel interactions, planet/zodiac taps, audio system, Cosmic Reading flow, aspect arcs, day navigation, settings panel, info modal, birth chart, heliocentric view, auto-rotation, starfield, glass rings, Earth model — EVERYTHING. This feature ADDS to the scene, it does not replace anything.

---

## Overview

A **living, responsive crystalline energy form** that hovers above the centre of the Astrara wheel (above the Earth model). It is the visual culmination of all planetary energies — every planet's force flows upward into this single focal point where they crystallise into one unified form.

The crystal's **shape shifts based on the dominant element** of the current planetary configuration. It breathes, pulses, rotates, and responds to the cosmic state. The user can tap it to receive the Ultimate Cosmic Message. It can be toggled on/off in settings.

---

## The Three Forms

### 1. TOROIDAL FIELD — Fire Element Dominant

When Fire signs (Aries, Leo, Sagittarius) hold the most planets.

**Geometry:**
- A torus shape (`THREE.TorusGeometry`) with `radius: 0.25`, `tube: 0.1`, `radialSegments: 32`, `tubularSegments: 64`
- Semi-transparent glass material: `MeshPhysicalMaterial` with `transmission: 0.6`, `thickness: 0.3`, `roughness: 0.1`, `metalness: 0.1`, `ior: 1.5`, `color: '#FF6B35'` (warm amber-orange)
- Counter-rotate on two axes simultaneously: Y-axis at `0.3 rad/s`, X-axis at `0.15 rad/s` — creates the hypnotic tumbling effect

**Particle Flow:**
- 40-60 small particle sprites flowing THROUGH the torus centre hole (the classic toroidal field flow pattern)
- Particles travel upward through the centre, arc outward over the top, flow down the outside, and re-enter at the bottom — a continuous loop
- Use `THREE.Points` with `THREE.BufferGeometry`, animate positions in `useFrame`
- Particle colour: warm gradient from `#FF6B35` (orange) at bottom to `#FFD700` (gold) at top
- Particle size: `0.008` with `THREE.PointsMaterial({ size: 0.008, transparent: true, blending: THREE.AdditiveBlending, sizeAttenuation: true })`
- Each particle has a slightly different speed for organic variation

### 2. SEED OF LIFE — Water Element Dominant

When Water signs (Cancer, Scorpio, Pisces) hold the most planets.

**Geometry:**
- 7 sphere wireframes (`THREE.SphereGeometry` with `widthSegments: 24`, `heightSegments: 24`) arranged in the Seed of Life pattern:
  - 1 centre sphere at `(0, 0, 0)` relative to the crystal group
  - 6 surrounding spheres at equal angles (`i * Math.PI * 2 / 6`), each offset by `radius` distance (use `radius: 0.15` for each sphere, offset distance: `0.15`)
- Render as wireframe: `MeshBasicMaterial({ wireframe: true, color: '#4D8DE8', transparent: true, opacity: 0.25 })`
- The overlap intersections are where the magic happens — add small glowing point lights or emissive spheres (`radius: 0.01`) at each of the 12 intersection points
- Intersection glow colour: `#B0E0FF` with pulsing opacity `0.4 + 0.4 * Math.sin(time * 2.5 + index)`

**Animation:**
- Slow rotation on Y-axis at `0.2 rad/s`
- Each of the 7 spheres breathes independently: scale oscillates `1.0 ± 0.05` with different phase offsets
- Intersection points pulse in a sequential pattern — like a wave of light rippling around the pattern

### 3. ICOSAHEDRON — Earth Element Dominant

When Earth signs (Taurus, Virgo, Capricorn) hold the most planets.

**Geometry:**
- `THREE.IcosahedronGeometry(0.22, 0)` — the raw 20-face platonic solid, detail level 0 for clean geometric faces
- Primary mesh: `MeshPhysicalMaterial` with `transmission: 0.5`, `thickness: 0.4`, `roughness: 0.05`, `metalness: 0.2`, `ior: 1.8`, `color: '#4DCCB0'` (teal-green)
- Wireframe overlay: a second slightly larger icosahedron (`scale: 1.05`) with `MeshBasicMaterial({ wireframe: true, color: '#4DCCB0', transparent: true, opacity: 0.4 })`

**Animation:**
- Slow rotation on Y-axis at `0.15 rad/s`, slight wobble on X-axis: `Math.sin(time * 0.3) * 0.1`
- **Vertex morphing:** every 8-10 seconds, randomly offset 3-4 vertices outward by `0.02-0.04` then smoothly lerp them back over 2 seconds. This creates the "living, breathing geometry" effect — like the form is shifting between dimensions. Use `geometry.attributes.position` — store original positions and animate offsets.
- Each face subtly shifts colour based on which planet's energy stream is strongest — use vertex colours or face-based UVs

### 4. HYBRID/MORPHING — Air Element Dominant or No Dominant Element

When Air signs (Gemini, Libra, Aquarius) dominate, OR when no single element has a clear majority.

**Implementation:**
- Cycle through all three forms on a 20-second rotation: Toroid → Seed → Icosahedron → Toroid...
- Transition between forms: over 2 seconds, fade current form out (opacity → 0, scale → 0.8), then fade new form in (opacity → 0, scale 0.8 → 1.0, opacity → 1)
- During transition, show a brief burst of particles dispersing outward then reconverging — representing Air's transformative, communicative nature
- Transition particle colour: `#C0B0FF` (light violet)

---

## Element Dominance Calculation

Create a utility function `getDominantElement()`:

```
1. Read all current planetary positions from the existing astro data (useAstroData or equivalent)
2. For each planet, determine which zodiac sign it's in
3. Map each sign to its element:
   - Fire: Aries, Leo, Sagittarius
   - Water: Cancer, Scorpio, Pisces
   - Earth: Taurus, Virgo, Capricorn
   - Air: Gemini, Libra, Aquarius
4. Count planets per element
5. Weight the count: Sun and Moon count as 2 each (luminaries are stronger), other planets count as 1
6. Return the element with the highest weighted count
7. If there's a tie between two or more elements, return 'air' (the hybrid/morphing state)
```

This function should be called reactively — when the day changes (user navigates Yesterday/Tomorrow), the crystal form should smoothly transition to match the new day's dominant element.

---

## Positioning

- The crystal group floats above the Earth model at the wheel centre
- Y position: `0.6` above the wheel plane (adjust if needed — it should be clearly above Earth but not leaving the visible area)
- Add a subtle hover animation: Y oscillates `±0.03` with `Math.sin(time * 0.5)` — gentle floating effect
- The crystal should NOT interfere with planet label positions or zodiac badges
- Scale: approximately `0.22-0.25` radius — medium and prominent, clearly visible focal point but not overwhelming the wheel

---

## Energy Streams (Planet → Crystal)

Thin luminous threads flowing from each planet position on the wheel upward into the crystal.

**Implementation:**
- For each of the planets currently on the wheel (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto), draw a curved line from the planet's 3D position to the crystal's position
- Use `THREE.QuadraticBezierCurve3` — control point offset sideways and upward to create a graceful arc (not a straight line)
- Material: `THREE.LineBasicMaterial({ color: planetColor, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })`
- Each stream's opacity subtly pulses: `0.1 + 0.08 * Math.sin(time * 1.5 + planetIndex * 0.7)`
- Stream colour matches the planet's existing colour on the wheel
- Streams should be VERY subtle — they're atmospheric, not distracting. Think gossamer threads, barely visible unless you look for them.
- When a planet is in its domicile or exaltation sign (strong dignity), its stream is slightly brighter (`opacity: 0.25`). This is optional — only implement if straightforward to detect from the existing data.

**Performance:**
- Only render streams when the crystal is visible (toggled on)
- Use a single merged geometry for all streams if possible, or limit to the 5 most prominent planets (Sun, Moon, Mercury, Venus, Mars) if 10 streams cause frame drops on mobile

---

## Tap Interaction

When the user taps the crystal:

### Visual Response
1. The crystal briefly pulses brighter (scale up to `1.15` and back over 400ms, emissive intensity spikes)
2. Energy streams momentarily flare (opacity jumps to `0.5` then fades back over 800ms)
3. A ring of light expands outward from the crystal (a flat ring geometry that scales up and fades — simple radial pulse effect)

### Content Response
- Open a bottom-sheet overlay (same style as planet/zodiac detail panels) showing the **Ultimate Cosmic Message**
- For now, use **placeholder template content** — we will implement the actual AI-generated or template-based content later
- Placeholder structure:
  ```
  Title: "Cosmic Crystallisation" / "Kosminė Kristalizacija" (LT)
  
  Subtitle: "The unified field speaks" / "Vieningo lauko žinia"
  
  Body: "The cosmic forces are currently crystallising through [dominant element] energy. 
  [Planet count] celestial bodies channel their light into this moment. 
  The universe invites you to [element-based guidance]."
  
  Element-based guidance:
  - Fire: "act with courage and trust your instincts"
  - Water: "honour your emotions and deepen your connections"  
  - Earth: "ground your vision into practical steps"
  - Air: "communicate your truth and stay open to new perspectives"
  ```
- Include the dominant element, planet count per element, and current date
- Style the overlay with the glass morphism card style, matching existing panels
- Add a close button (X) at the top right

### Tap Target
- The tap target should be generous — at least `0.4` radius invisible sphere around the crystal using `<Html>` overlay or R3F mesh onClick
- Make sure the tap does NOT interfere with Earth tap or wheel rotation

---

## Settings Integration

Add to the existing settings panel:

1. **Crystal Core toggle** — on/off switch, default ON for new users
   - Label: "Crystalline Core" / "Kristalinė šerdis" (LT)
   - When off: crystal, energy streams, and all related effects are completely unmounted (not just hidden — actually removed from the scene for performance)
   
2. **Crystal Form override** — only visible when Crystal Core is ON
   - Options: "Auto (Element)" / "Toroidal Field" / "Seed of Life" / "Icosahedron"
   - Default: "Auto (Element)"
   - When set to a specific form, that form is always shown regardless of dominant element
   - Labels in LT: "Automatinis (Elementas)" / "Toroidinis laukas" / "Gyvybės sėkla" / "Ikosaedras"

3. Store preferences in localStorage:
   - `astrara_crystal_enabled`: boolean (default true)
   - `astrara_crystal_form`: 'auto' | 'toroid' | 'seed' | 'icosa' (default 'auto')

---

## Transition Animations Between Forms

When the dominant element changes (day navigation) or user switches form in settings:

1. Current form fades out over 1 second (opacity → 0, scale → 0.85)
2. Brief particle burst at crystal position (20-30 particles exploding outward then fading over 500ms)
3. New form fades in over 1 second (scale 0.85 → 1.0, opacity 0 → 1)
4. Energy streams maintain — they connect to whatever form is active
5. Total transition time: ~2.5 seconds

---

## Interaction with Cosmic Reading

- During Cosmic Reading, the crystal remains visible (if toggled on) but becomes **less prominent** — reduce opacity to 50% and pause the vertex morphing / particle flow to reduce visual noise
- The reading's own animations (planet highlights, aspect arcs) take priority
- When the reading reaches the Summary phase, the crystal could pulse once as a visual punctuation — but this is optional, don't force it

---

## Interaction with Heliocentric View

- When user switches to heliocentric/solar system view, **hide the crystal entirely** — it only makes sense in the geocentric wheel context
- Fade out over 500ms when switching, fade back in when returning to wheel view

---

## Lighting

The crystal needs proper lighting to look good:
- Add a subtle `THREE.PointLight` at the crystal's position with `intensity: 0.3`, `distance: 2`, `color` matching the current form's element colour
- This light should cast a very faint glow on the Earth model below and on nearby wheel elements
- The light colour transitions smoothly when the form changes

---

## Component Structure

```
CrystallineCore/
  ├── CrystallineCore.tsx        — main component, handles visibility, form switching, element calculation
  ├── ToroidalField.tsx          — Fire form with particle flow
  ├── SeedOfLife.tsx             — Water form with intersection glows  
  ├── IcosahedronForm.tsx        — Earth form with vertex morphing
  ├── EnergyStreams.tsx          — planet-to-crystal connection arcs
  ├── CrystalTapOverlay.tsx      — the tap interaction overlay / bottom sheet
  └── crystalUtils.ts            — getDominantElement(), colour maps, transition helpers
```

Place this folder alongside the existing wheel components.

---

## Build Steps

1. Read the existing wheel scene graph to understand the component hierarchy and where to insert the crystal group
2. Read how planet positions are accessed (useAstroData or equivalent) — you'll need these for energy streams and element calculation
3. Read the existing settings panel to understand how to add new toggles
4. Create `crystalUtils.ts` with `getDominantElement()`, element-colour mapping, and form transition helpers
5. Create `ToroidalField.tsx` with torus geometry, glass material, and particle flow system
6. Create `SeedOfLife.tsx` with 7 wireframe spheres and intersection glow points
7. Create `IcosahedronForm.tsx` with glass icosahedron, wireframe overlay, and vertex morphing
8. Create `EnergyStreams.tsx` with curved lines from planet positions to crystal centre
9. Create `CrystallineCore.tsx` as the parent controller — handles form switching, transitions, floating animation, visibility
10. Create `CrystalTapOverlay.tsx` with placeholder Ultimate Message content (EN + LT)
11. Add the crystal to the main R3F scene — position above Earth
12. Add Crystal Core toggle and Form override to the settings panel
13. Add localStorage persistence for crystal preferences
14. Handle heliocentric view hiding
15. Handle Cosmic Reading opacity reduction
16. Add all i18n keys to both en.json and lt.json translation files
17. Test: crystal appears above wheel with correct form based on today's element dominance
18. Test: navigate to different days — crystal transitions between forms when element changes
19. Test: tap crystal — overlay opens with placeholder message
20. Test: toggle crystal off in settings — completely removed from scene
21. Test: override form in settings — correct form is forced
22. Test: energy streams visible from planets to crystal
23. Test: heliocentric view — crystal hidden
24. Test: Cosmic Reading — crystal dims but remains
25. Test: mobile viewport (375px) — crystal visible and tappable, no overlap with labels
26. Test: ALL existing features still work (planet taps, zodiac taps, audio, rotation, etc.)
27. Run `npm run build` — no errors
28. **UPDATE `engine/ARCHITECTURE.md`** — add Crystalline Core section documenting all new components, the element calculation logic, settings keys, and the three form types
29. Commit: `feat: Crystalline Core — living 4D energy focal point with element-based form shifting`
30. Push to **main** branch using `git push origin master:main`
