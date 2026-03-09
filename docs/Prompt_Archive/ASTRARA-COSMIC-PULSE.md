# ASTRARA — Cosmic Pulse: Dashboard Modal + Daily Compass

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This adds two things: (1) a compass behaviour to the existing Crystalline Core, and (2) a rich visual modal when tapped. All existing features must continue working.

---

## PART A: DAILY COMPASS BEHAVIOUR

### Concept

The Crystalline Core sacred geometry form subtly orients itself toward the most significant planet of the day. It acts as a visual compass saying "look here — this is what matters today."

### Determining the Key Planet

Create a function `getKeyPlanet(planets, aspects, moon)` that picks the single most important planet today, using this priority:

1. **Any planet that just changed sign today** (ingress) — highest priority, rare event
2. **Any planet stationing retrograde or direct today** — very significant
3. **The planet involved in the tightest aspect** (smallest orb) — the most active interaction
4. **The Moon** — if nothing else is remarkable, the Moon is always the daily driver

The function returns `{ planet: string, reason: string, reasonLt: string }`.

### Visual Compass Effect

Once the key planet is determined:

- Find that planet's position on the wheel (its 3D coordinates from the existing planet rendering)
- The Crystalline Core group should have a very subtle **tilt toward that planet** — rotate the group slightly (max 15°) so it appears to lean/orient toward the key planet's direction
- This tilt is relative to the wheel centre — calculate the angle from centre to the planet's XZ position and apply a small rotation
- The tilt should smoothly animate when the key planet changes (day navigation)
- Keep the existing Z-axis rotation — the compass tilt is layered on top, not replacing it

### Subtle Visual Connector (optional, implement if it looks good)

A single very faint line (`opacity: 0.06`, additive blending) from the crystal down toward the key planet. Almost invisible — just a whisper of connection. If it adds visual noise, skip it entirely.

---

## PART B: COSMIC PULSE MODAL — Visual KPI Dashboard

When the user taps the Crystalline Core, open a full-height bottom sheet modal (same pattern as existing modals) containing a **visual dashboard of cosmic KPIs**. This is NOT a text-based reading — every data point is a beautiful, colourful visual widget.

### Modal Header

```
Title: "Cosmic Pulse" / "Kosminis Pulsas" (LT)
Subtitle: formatted date (use existing dateTitle utility)
```

Styled with Cormorant Garamond display font, matching existing modal headers.

### KPI Layout

Use a scrollable vertical layout. Each KPI section is a compact visual card with the glass-card styling. Pack them tightly — this should feel information-dense but beautiful, like a spacecraft control panel with the Astrara aesthetic.

---

### KPI 1: DOMINANT ENERGY — Element Balance Ring

A **circular donut chart** showing the distribution of planets across the four elements. This is the hero visual at the top of the modal.

**Implementation:**
- SVG donut chart (use `stroke-dasharray` and `stroke-dashoffset` on `<circle>` elements)
- 4 segments coloured by element:
  - Fire: `#FF6B4A`
  - Earth: `#4ADE80`
  - Air: `#60A5FA`
  - Water: `#A78BFA`
- Segment size proportional to weighted planet count (Sun/Moon = 2, others = 1)
- Centre of the donut shows: the dominant element icon and name
  - Fire: 🔥 or a flame-like SVG
  - Earth: a leaf/mountain SVG
  - Air: a wind/swirl SVG
  - Water: a wave/droplet SVG
- Below the donut: one sentence about what this means
  - Fire dominant: "The sky burns with directed will. Action carries momentum today."
  - Earth dominant: "The cosmos grounds into form. Practical steps bear fruit today."
  - Air dominant: "Ideas flow freely. Communication and connection are amplified."
  - Water dominant: "Emotional currents run deep. Intuition is your compass today."
  - (Lithuanian translations for each)
- Width: full modal width, height: about 160px

### KPI 2: KEY PLAYER — Highlighted Planet Card

The most significant planet today (from the compass calculation), shown as a standout card.

**Implementation:**
- Larger than the regular CosmicWeather planet cards
- Planet glyph (large, white) with the planet's colour as a subtle background glow
- Planet name + current sign + degree
- **Why it matters today** — the `reason` from `getKeyPlanet()`:
  - "Tightest aspect: ☍ Opposition with Saturn (0.8° orb)" 
  - "Just entered Pisces today"
  - "Stationed retrograde today"
  - "Moon drives today's energy from Pisces"
- The planet's Cousto frequency: e.g. "210.42 Hz"
- The planet's associated chakra
- Colour-coded border matching the planet's element

### KPI 3: COSMIC INTENSITY — Activity Score

An overall "how active is the sky today" score from 1-10, shown as a visual gauge.

**Implementation:**
- Semi-circular gauge (half-circle arc) with gradient from cool blue (1) through green (4-5) through amber (7) to red-hot (10)
- A needle/indicator pointing to the score
- Large number in the centre of the arc
- Score calculation:
  ```
  base = number of active aspects (orb < 5°)
  + 2 for each aspect with orb < 1° (exact aspects are powerful)
  + 2 for each retrograde planet
  + 1 for full moon or new moon
  + 1 for any sign ingress today
  Normalise to 1-10 scale (cap at 10)
  ```
- Below the gauge: a one-word intensity label
  - 1-2: "Stillness" / "Ramybė"
  - 3-4: "Gentle" / "Švelnu"
  - 5-6: "Active" / "Aktyvu"
  - 7-8: "Intense" / "Intensyvu"
  - 9-10: "Powerful" / "Galinga"

### KPI 4: EARTH GEOMAGNETIC — Kp Index Visual

Real-time Kp index displayed as a beautiful colour-coded bar.

**Implementation:**
- Horizontal bar divided into segments (0-9), each segment coloured:
  - 0-1: `#4ADE80` (green — quiet)
  - 2-3: `#60A5FA` (blue — unsettled)
  - 4-5: `#FFD700` (gold — active)
  - 6-7: `#FF8C00` (orange — storm)
  - 8-9: `#FF4444` (red — severe storm)
- A glowing indicator/marker on the current Kp value
- Current Kp number displayed large next to the bar
- Storm level label: "Quiet" / "Unsettled" / "Active Storm" / "Severe Storm"
- Lithuanian labels: "Ramu" / "Nestabilu" / "Aktyvi audra" / "Stipri audra"
- Below: brief body/mind guidance based on Kp level (reuse text from existing EarthPanel if available):
  - Low Kp: "Clear field for sensitive work"
  - High Kp: "Ground before deep sessions"
- **Data source**: use the existing `useEarthData` hook — the data is already being fetched in the app

### KPI 5: SCHUMANN RESONANCE — Frequency Display

The Earth's fundamental frequency (7.83 Hz) with harmonics.

**Implementation:**
- A visual sine wave representation (SVG path) showing the 7.83 Hz base
- Display the base frequency prominently: "7.83 Hz"
- Show harmonic series below: 14.3 Hz, 20.8 Hz, 27.3 Hz, 33.8 Hz (these are the known Schumann harmonics)
- Each harmonic as a smaller, fainter wave nested below the main one
- Colour: use a gradient from `#4ADE80` (Earth green) to `#60A5FA` (Air blue)
- Note: Schumann is relatively constant — this KPI is informational/educational rather than live-changing. The visual beauty is the value here.
- Label: "Earth's Heartbeat" / "Žemės Širdies Ritmas"

### KPI 6: SOLAR ACTIVITY — Sun Weather

Current solar conditions from NOAA data.

**Implementation:**
- Three mini gauges or value displays in a row:
  1. **Solar Wind Speed**: km/s value with colour coding
     - < 400: `#4ADE80` green (calm)
     - 400-600: `#FFD700` gold (moderate)
     - > 600: `#FF6B4A` red (fast)
  2. **Solar Flare Class**: letter grade (A, B, C, M, X) with colour
     - A/B: `#4ADE80` green (quiet)
     - C: `#FFD700` gold (minor)
     - M: `#FF8C00` orange (moderate)
     - X: `#FF4444` red (major)
  3. **Magnetic Field Bz**: nT value with colour
     - Positive (northward): `#4ADE80` green (stable)
     - Negative (southward): `#FF6B4A` red (geomagnetically active)
- Each displayed as a compact card with the value large and coloured, label small below
- Label: "Solar Activity" / "Saulės Aktyvumas"
- **Data source**: use the existing `useEarthData` hook

### KPI 7: ASPECT MAP — Active Connections

A compact visual showing today's active aspects.

**Implementation:**
- For each notable aspect (max 5, from `notableAspects` in astro data):
  - Show: Planet A glyph → aspect symbol → Planet B glyph
  - Orb in degrees (coloured by tightness: < 1° = bright white, 1-3° = medium, 3-5° = faint)
  - Aspect type colour coding:
    - Conjunction ☌: `#FFD700` gold
    - Sextile ⚹: `#4DCCB0` teal
    - Square □: `#FF6B4A` red
    - Trine △: `#60A5FA` blue
    - Opposition ☍: `#A78BFA` purple
- Compact row per aspect, no more than 5 rows
- If no notable aspects: "Clear sky — no major planetary conversations today" / "Giedras dangus — šiandien jokių svarbių planetinių pokalbių"
- Label: "Planetary Aspects" / "Planetų Aspektai"

---

## MODAL STYLING

- Use the existing glass-card styling for each KPI section
- Background: the standard modal background with glass morphism
- Each KPI card: `background: rgba(255,255,255,0.03)`, `border: 1px solid rgba(255,255,255,0.06)`, `border-radius: 12px`
- Spacing between cards: `12px`
- Modal is scrollable vertically
- Close button (X) top-right, matching existing modals
- Smooth entrance animation: cards stagger in from bottom (same as glass-card float animation, 100ms stagger between cards)

---

## RENDERING THE KPI VISUALS

All KPI visuals (donut chart, gauge, sine wave, bars) should be rendered as **inline SVG** within React components. Do NOT use any external charting library — keep it lightweight with hand-crafted SVGs. The app already uses framer-motion for animations, which can be used for entrance effects.

SVG guidelines:
- Use `viewBox` for responsive scaling
- Colours from the CSS variables defined in globals.css
- Text in SVGs uses the app's font variables (`--font-body`, `--font-mono`)
- All text content must support EN/LT via `useTranslation`

---

## DATA ACCESS

The modal needs data from two existing hooks:

1. **`useAstroData`** — planets, moon, aspects, notableAspects
   - This is already available in the page and passed via props
   - Pass it down to CrystallineCore → CrystalMessage

2. **`useEarthData`** — Kp index, solar wind, Bz, X-ray flux
   - This is already fetched in the app
   - Pass the earth data down to CrystalMessage
   - If earth data is loading or unavailable, show shimmer placeholders for KPIs 4-6

Check how these hooks are currently used in `page.tsx` and follow the same data-passing pattern. Do NOT create duplicate API calls.

---

## COMPONENT STRUCTURE UPDATE

```
components/CrystallineCore/
  ├── CrystallineCore.tsx        — sacred geometry form + compass tilt + tap trigger
  ├── CrystalMessage.tsx         — the modal container + layout
  └── kpis/
      ├── ElementBalance.tsx     — donut chart (KPI 1)
      ├── KeyPlayer.tsx          — highlighted planet card (KPI 2)
      ├── CosmicIntensity.tsx    — semi-circular gauge (KPI 3)
      ├── KpIndex.tsx            — Kp bar visual (KPI 4)
      ├── SchumannResonance.tsx  — sine wave display (KPI 5)
      ├── SolarActivity.tsx      — three mini gauges (KPI 6)
      └── AspectMap.tsx          — aspect list (KPI 7)
```

---

## i18n

Add ALL labels, descriptions, element meanings, intensity words, storm levels, and guidance text to both `en.json` and `lt.json`. Every string visible to the user must be translatable.

---

## Build Steps

1. Read existing data hooks (`useAstroData`, `useEarthData`) to understand available data and how it's passed through the component tree
2. Read existing modal/panel patterns for styling consistency
3. Create `getKeyPlanet()` utility function
4. Add compass tilt behaviour to `CrystallineCore.tsx` — subtle lean toward key planet
5. Create the 7 KPI components with SVG visuals
6. Create `CrystalMessage.tsx` as the modal container arranging all KPIs
7. Wire up: crystal tap → open CrystalMessage modal with all data passed in
8. Pass `astroData` and `earthData` through to the crystal components (follow existing prop-passing patterns)
9. Add all i18n keys to en.json and lt.json
10. Test: tap crystal → modal opens with all 7 KPI sections visible
11. Test: element donut shows correct distribution for today
12. Test: Kp bar shows current value from NOAA data
13. Test: solar activity shows current wind/flare/Bz values
14. Test: aspect map shows today's notable aspects
15. Test: intensity gauge shows reasonable score
16. Test: compass tilt points crystal toward key planet
17. Test: navigate days → all KPIs update, compass shifts
18. Test: switch to Lithuanian → all text translates
19. Test: mobile 375px — modal scrolls smoothly, KPIs readable
20. Test: ALL other features still work
21. Run `npm run build` — no errors
22. **UPDATE `engine/ARCHITECTURE.md`** — document the Cosmic Pulse modal, all KPI components, data flow, compass behaviour, and getKeyPlanet logic
23. Commit: `feat: Cosmic Pulse dashboard modal with visual KPIs + daily compass`
24. Push to **main** branch using `git push origin master:main`
