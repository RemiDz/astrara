# ASTRARA — Crystalline Core v5: Reference harmonicwaves.app Living Mandala

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## ⚠️ REPLACE THE EXISTING CRYSTALLINE CORE COMPLETELY

Delete ALL existing crystal components and start fresh. All other app features must continue working.

---

## STEP 1 — STUDY THE REFERENCE (DO THIS FIRST)

Before writing ANY code, you MUST read and fully understand the Living Mandala implementation from the harmonicwaves.app project:

```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\harmonicwaves.app
```

Search this project for:
- The main sacred geometry / mandala / orb visual component
- Any canvas, SVG, or Three.js rendering code that draws the animated geometric pattern
- The animation logic — how it breathes, rotates, pulses
- The colour system — how it glows, what colours it uses
- The sine wave / energy flow element that passes through the geometry

Read EVERY file related to this visual. Understand:
1. What geometric primitives are used (circles, arcs, lines, curves?)
2. How many layers are there?
3. What creates the ethereal, luminous quality?
4. How is the breathing/pulsing animation implemented?
5. What makes it look like a spirit and not a solid object?
6. What blending modes, opacities, and glow effects are used?

Take notes. You will replicate this EXACT aesthetic quality in Three.js / React Three Fiber for Astrara.

---

## STEP 2 — ADAPT FOR ASTRARA'S 3D SCENE

Once you fully understand the harmonicwaves.app mandala, recreate it as a component that lives inside Astrara's R3F Canvas scene. The form should:

- Float above the Astrara wheel centre at Y position `1.6`
- Match the EXACT visual quality, complexity, and ethereal feel of the harmonicwaves.app version — not a simplified or "inspired by" version, but the SAME level of detail and beauty
- Be oriented to face the camera with a very subtle tilt (~10° on X-axis)
- Slowly rotate
- Breathe / pulse in opacity and scale
- Glow with additive blending against the dark void background
- Shift its colour tint based on the dominant astrological element:
  - Fire: `#FF6B4A`
  - Earth: `#4ADE80`
  - Air: `#60A5FA`
  - Water: `#A78BFA`
  - Neutral/tie: `#C0C0D0`

If the harmonicwaves.app version uses 2D canvas or SVG rendering, you need to translate the same geometric construction and visual effects into Three.js line geometries, sprites, shaders, or whatever technique best reproduces the look within R3F.

---

## STEP 3 — ELEMENT DOMINANCE

Create `getDominantElement()` utility:

```typescript
function getDominantElement(planets): 'fire' | 'water' | 'earth' | 'air' | 'neutral' {
  const elementSigns = {
    fire: ['Aries', 'Leo', 'Sagittarius'],
    earth: ['Taurus', 'Virgo', 'Capricorn'],
    air: ['Gemini', 'Libra', 'Aquarius'],
    water: ['Cancer', 'Scorpio', 'Pisces'],
  };
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  
  for (const planet of planets) {
    for (const [element, signs] of Object.entries(elementSigns)) {
      if (signs.includes(planet.sign)) {
        counts[element] += (planet.name === 'Sun' || planet.name === 'Moon') ? 2 : 1;
      }
    }
  }
  
  const max = Math.max(...Object.values(counts));
  const winners = Object.entries(counts).filter(([_, v]) => v === max);
  return winners.length === 1 ? winners[0][0] : 'neutral';
}
```

Adapt to match actual data shape from `useAstroData`.

---

## STEP 4 — TAP INTERACTION

- Invisible sphere tap target (`radius: 0.3`, `visible: false`) using `useTapVsDrag`
- On tap: brief opacity/glow spike (600ms), then open bottom sheet overlay
- Overlay uses existing `Modal` / `GlassCard` styling
- Placeholder content:

**English:**
```
Title: "Cosmic Crystallisation"
Subtitle: "[Element] energy dominates today's sky"
Body: "[Count] celestial bodies channel their light through [element] signs today, crystallising a field of [element-quality]. The cosmos invites you to [element-guidance]."
```

**Lithuanian:**
```
Title: "Kosminė Kristalizacija"
Subtitle: "[Elementas] energija dominuoja danguje šiandien"
Body: "[Skaičius] dangaus kūnai nukreipia savo šviesą per [elementas] ženklus šiandien, kristalizuodami [elemento-savybė] lauką. Kosmosas kviečia jus [elemento-patarimas]."
```

(Full element-specific text from v2 spec — fire/earth/air/water qualities and guidance in both languages)

---

## STEP 5 — SETTINGS & VISIBILITY

- **Settings toggle**: "Crystalline Core" / "Kristalinė Šerdis" — add `crystalEnabled: boolean` to AstraraSettings, default `true`
- **During Cosmic Reading**: reduce all opacities to 40% of normal
- **During Heliocentric View**: fade out over 500ms, fade back on return
- **Before entrance complete**: hidden, then fade in after phase 6 (`entranceComplete=true`) with scale 0.5→1.0 over 800ms
- **When toggled off**: completely unmount

---

## STEP 6 — COMPONENT STRUCTURE

```
components/CrystallineCore/
  ├── CrystallineCore.tsx    — the sacred geometry form + all animation + visibility + tap
  └── CrystalMessage.tsx     — tap overlay bottom sheet
```

Two files maximum.

---

## Build Steps

1. **DELETE** all existing crystal components
2. **READ** the harmonicwaves.app source at `C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\harmonicwaves.app` — find and study the Living Mandala / sacred geometry visual component thoroughly
3. **UNDERSTAND** what makes it look ethereal — document the techniques (blending, layers, geometry count, animation approach)
4. **RECREATE** the same visual in R3F Three.js, positioned at Y=1.6 above the Astrara wheel
5. Add element-based colour tinting with smooth lerp transitions
6. Add `getDominantElement()` utility
7. Add tap interaction with `CrystalMessage.tsx` overlay
8. Add settings toggle to SettingsPanel
9. Wire up visibility conditions (entrance, reading, helio, settings)
10. Add i18n keys to en.json and lt.json
11. Test: the form above the wheel matches the harmonicwaves.app mandala aesthetic — ethereal, luminous, alive
12. Test: it does NOT look like a solid object, a dev bug, or a child's drawing
13. Test: element colours shift smoothly
14. Test: tap works, overlay opens
15. Test: settings toggle unmounts
16. Test: dims during reading, hides during helio
17. Test: ALL other features still work
18. Test: mobile 375px — visible, beautiful, tappable
19. Run `npm run build` — no errors
20. **UPDATE `engine/ARCHITECTURE.md`**
21. Commit: `feat: Crystalline Core v5 — ethereal sacred geometry (harmonicwaves.app reference)`
22. Push to **main** branch using `git push origin master:main`
