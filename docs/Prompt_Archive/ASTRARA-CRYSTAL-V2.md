# ASTRARA — Crystalline Core v2: Single Glass Icosahedron

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ CRITICAL: REPLACE THE EXISTING CRYSTALLINE CORE

The current Crystalline Core implementation (Seed of Life wireframes, Toroidal Field, energy stream lines, etc.) must be **completely removed and replaced** with this new clean implementation. Delete all existing crystal-related components (ToroidalField, SeedOfLife, IcosahedronForm, EnergyStreams, CrystalTapOverlay, crystalUtils, and the CrystallineCore parent). Start fresh.

All other existing features MUST continue working.

---

## Overview

A single, elegant **glass icosahedron** floating above the centre of the Astrara wheel. It is a pristine geometric gemstone — semi-transparent, slowly rotating, gently breathing with inner light. Its inner glow colour shifts based on the dominant astrological element. That's it. Nothing else. No wireframes, no particles, no energy stream lines, no visual noise.

This crystal follows the same design language as the rest of Astrara: **whispered elegance, not visual noise**.

---

## The Form

### Geometry

- `THREE.IcosahedronGeometry(0.18, 0)` — detail level 0 gives the clean 20-face platonic solid with sharp geometric facets
- This is intentionally small-medium — prominent enough to be a clear focal point, not so large it dominates the wheel

### Material — Glass Gemstone

Use `MeshPhysicalMaterial` to create a realistic glass crystal look. This matches the existing glass ring aesthetic already in the scene:

```
MeshPhysicalMaterial({
  color: elementColor,           // shifts by dominant element (see below)
  transmission: 0.85,            // highly transparent — you can see through it
  thickness: 0.5,                // refraction depth
  roughness: 0.05,               // very smooth, catches light sharply
  metalness: 0.05,               // barely metallic, mostly dielectric
  ior: 2.0,                      // high refraction — diamond-like light bending
  clearcoat: 1.0,                // glossy surface layer (matches wheel rings)
  clearcoatRoughness: 0.05,      // clean reflections
  envMapIntensity: 1.5,          // picks up environment reflections
  transparent: true,
  opacity: 0.9,
  side: THREE.DoubleSide,        // visible from all angles
})
```

The `<Environment preset="night">` that already exists in the scene will provide the reflections. If it's not present, add it — the crystal NEEDS environment reflections to look like glass, not plastic.

### Element Colour Mapping

The crystal's `color` property shifts based on the dominant astrological element. Use the EXACT element colours already defined in the app's design system:

```
Fire  → #FF6B4A  (warm coral-red)
Earth → #4ADE80  (green)
Air   → #60A5FA  (blue)
Water → #A78BFA  (purple-violet)
```

When no element clearly dominates (tie), use a neutral: `#C0C0D0` (silver — matches the app's structural palette).

**Colour transition**: When the dominant element changes (day navigation), smoothly lerp the material colour over 1.5 seconds using `THREE.Color.lerp()` in `useFrame`. Do NOT abruptly switch.

### Element Dominance Calculation

Create a simple utility function:

```typescript
function getDominantElement(planets: PlanetPosition[]): 'fire' | 'water' | 'earth' | 'air' | 'neutral' {
  const elementSigns = {
    fire: ['Aries', 'Leo', 'Sagittarius'],
    earth: ['Taurus', 'Virgo', 'Capricorn'],
    air: ['Gemini', 'Libra', 'Aquarius'],
    water: ['Cancer', 'Scorpio', 'Pisces'],
  };
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  
  for (const planet of planets) {
    const sign = planet.sign; // however the sign is accessed in the existing data
    for (const [element, signs] of Object.entries(elementSigns)) {
      if (signs.includes(sign)) {
        // Sun and Moon count double
        counts[element] += (planet.name === 'Sun' || planet.name === 'Moon') ? 2 : 1;
      }
    }
  }
  
  const max = Math.max(...Object.values(counts));
  const winners = Object.entries(counts).filter(([_, v]) => v === max);
  
  return winners.length === 1 ? winners[0][0] : 'neutral';
}
```

Read how planet positions are structured from `useAstroData` — adapt the function to match the actual data shape.

---

## Position

- The crystal group's Y position: **1.6** above the wheel plane (well above the Earth and all planets, with clear visible space between wheel and crystal)
- Floating hover: Y oscillates `1.6 + 0.025 * Math.sin(time * 0.6)` — gentle, slow, barely perceptible
- X and Z: `0, 0` — dead centre above the wheel

---

## Animation

Keep it minimal and hypnotic:

### Rotation
- Y-axis only: `0.12 rad/s` — very slow, one full rotation every ~52 seconds
- No wobble, no tumbling, no secondary axes. Just clean, steady rotation. The facets catching light as it turns creates enough visual interest.

### Breathing
- Scale oscillates: `1.0 + 0.02 * Math.sin(time * 0.8)` — barely perceptible size pulse
- This is the same 12.5-second breathing cycle used by the drone layer LFO — subtle synchronicity

### Inner Glow
- `emissive` property set to the same element colour as the base colour
- `emissiveIntensity` oscillates: `0.15 + 0.1 * Math.sin(time * 1.0)` — gentle inner pulsing
- This is the "life" inside the crystal — a soft warm glow, not a bright beacon

---

## Lighting

- Add ONE subtle `THREE.PointLight` at the crystal's position:
  - `intensity: 0.15`
  - `distance: 1.5`
  - `color`: same as current element colour
  - `decay: 2`
- This casts a faint tinted glow on the space around the crystal — visible in the dark void but not illuminating the wheel below
- The light colour should lerp in sync with the crystal's colour transitions

---

## Tap Interaction

When the user taps the crystal:

### Visual Response (subtle)
1. Scale briefly pulses to `1.12` and back over 400ms (ease-out-in)
2. `emissiveIntensity` spikes to `0.6` then fades back to normal over 600ms
3. That's it — no particle bursts, no expanding rings, no drama

### Content Response
- Open a bottom-sheet overlay using the same `Modal` component and `GlassCard` styling used throughout the app
- **Placeholder content for now** (we'll build the real content engine later):

**English:**
```
Title: "Cosmic Crystallisation"
Subtitle: "[Element] energy dominates today's sky"

Body:
"[Count] celestial bodies channel their light through [element] signs today, 
crystallising a field of [element-quality]. The cosmos invites you to 
[element-guidance]."

Element qualities:
- Fire: "courage and directed will"
- Earth: "stability and grounded presence"
- Air: "clarity and open communication"
- Water: "depth and emotional attunement"

Element guidance:
- Fire: "act decisively and trust your instincts"
- Earth: "ground your vision into practical steps"  
- Air: "speak your truth and stay curious"
- Water: "honour your feelings and deepen your connections"
```

**Lithuanian:**
```
Title: "Kosminė Kristalizacija"
Subtitle: "[Elementas] energija dominuoja danguje šiandien"

Body:
"[Skaičius] dangaus kūnai nukreipia savo šviesą per [elementas] ženklus šiandien, 
kristalizuodami [elemento-savybė] lauką. Kosmosas kviečia jus 
[elemento-patarimas]."

Element savybės:
- Ugnis: "drąsos ir nukreiptos valios"
- Žemė: "stabilumo ir įžemintos buvimo būsenos"
- Oras: "aiškumo ir atviro bendravimo"
- Vanduo: "gelmės ir emocinio suderinimo"

Element patarimai:
- Ugnis: "veikti ryžtingai ir pasitikėti savo instinktais"
- Žemė: "įžeminti savo viziją praktiniais žingsniais"
- Oras: "kalbėti savo tiesą ir likti smalsiems"
- Vanduo: "gerbti savo jausmus ir gilinti ryšius"
```

- Use `useTranslation` and `useLanguage` from the existing i18n system
- Include the current date formatted via the existing `dateTitle` utility
- Close button (X) top-right, matching other modal styling

### Tap Target
- Invisible sphere mesh around the crystal: `THREE.SphereGeometry(0.35)` with `MeshBasicMaterial({ visible: false })`
- Use the same `useTapVsDrag` hook from the existing codebase to distinguish tap from drag
- Make sure it does NOT interfere with Earth tap below or wheel drag/rotation

---

## Settings Integration

Add to the existing `SettingsPanel.tsx`:

**One toggle only:**
- Label: "Crystalline Core" / "Kristalinė Šerdis" (LT)
- Toggle on/off, default: ON
- When off: the crystal component is completely unmounted from the scene (not just invisible — unmounted for performance)
- Store in localStorage: `astrara_crystal_enabled` (boolean, default `true`)

**No form selector** — there's only one form now, so no need to choose.

Read the existing settings pattern — it uses an `AstraraSettings` object stored in `astrara-settings` localStorage key. Add `crystalEnabled: boolean` to this object rather than creating a separate key, to keep it consistent.

---

## Conditional Visibility

### During Cosmic Reading
- Reduce crystal opacity to `0.4` and `emissiveIntensity` to `0.05`
- The reading's own animations take visual priority
- Crystal keeps rotating but is dimmed into the background

### During Heliocentric View
- **Hide completely** — fade opacity to 0 over 500ms when transitioning to helio, fade back in when returning to geocentric
- The crystal only makes sense in the geocentric wheel context

### Before Entrance Animation Completes
- Crystal should only appear AFTER the loading sequence phase 6 (`entranceComplete=true`)
- Fade in with scale `0.5 → 1.0` and opacity `0 → 0.9` over 800ms
- This is the crystal's own entrance — it materialises after the wheel is built

---

## Component Structure

Keep it simple — as few files as possible:

```
components/CrystallineCore/
  ├── CrystallineCore.tsx    — the whole thing: mesh, material, animation, tap, visibility logic
  └── CrystalMessage.tsx     — the tap overlay / bottom sheet with placeholder content
```

Plus a small utility either in the same file or in `lib/`:
- `getDominantElement()` function

That's it. Two files maximum. Do not over-engineer this.

---

## Performance

- The icosahedron is 20 faces — trivially lightweight
- One point light is negligible
- `useFrame` updates are: rotation (1 float), scale (1 float), emissive (1 float), colour lerp (conditional). Minimal.
- Unmount entirely when toggled off — zero cost when disabled

---

## Build Steps

1. **DELETE** all existing Crystalline Core components (ToroidalField, SeedOfLife, IcosahedronForm, EnergyStreams, CrystalTapOverlay, crystalUtils, and the old CrystallineCore parent component)
2. Read how planet data is accessed from `useAstroData` — you need planet signs for element calculation
3. Read the existing settings panel and localStorage pattern
4. Read the existing Modal / GlassCard components for the tap overlay
5. Create `getDominantElement()` utility
6. Create `CrystallineCore.tsx` — single glass icosahedron with all animation, visibility, and tap logic
7. Create `CrystalMessage.tsx` — placeholder content overlay in EN + LT
8. Add the crystal to the main R3F scene, positioned at Y=1.6 above centre
9. Add the settings toggle to SettingsPanel
10. Add `crystalEnabled` to the AstraraSettings type and localStorage
11. Wire up visibility conditions: entrance, reading dimming, helio hiding
12. Add all i18n keys to both en.json and lt.json
13. Test: crystal appears after entrance animation as a clean glass form
14. Test: crystal slowly rotates and breathes with inner glow
15. Test: navigate days — crystal colour smoothly shifts with element changes
16. Test: tap crystal — overlay opens with correct element-based message
17. Test: tap crystal — visual pulse response (scale + emissive spike)
18. Test: toggle off in settings — crystal completely disappears
19. Test: Cosmic Reading — crystal dims to 40% opacity
20. Test: heliocentric view — crystal fades out, returns on geo view
21. Test: crystal does NOT interfere with Earth tap, planet taps, or wheel rotation
22. Test: mobile viewport (375px) — crystal visible, tappable, positioned correctly
23. Test: ALL other features still work
24. Run `npm run build` — no errors, no warnings
25. **UPDATE `engine/ARCHITECTURE.md`** — replace the old Crystalline Core documentation with the new single-icosahedron implementation. Document: component files, material properties, element calculation, settings key, visibility conditions, animation parameters.
26. Commit: `feat: Crystalline Core v2 — single glass icosahedron with element-based inner glow`
27. Push to **main** branch using `git push origin master:main`
