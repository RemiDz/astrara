# Astrara — Living Architecture Document

> Single source of truth for understanding how the app works, what depends on what, and the current state of every feature.

---

## 1. PROJECT OVERVIEW

**Astrara** is a real-time astrology companion web app that displays live planetary positions on an interactive 3D zodiac wheel, provides daily cosmic weather readings, sound healing frequencies, and Earth geomagnetic data. It supports geocentric (astrological wheel) and heliocentric (solar system) views with smooth animated transitions, a multi-phase "Cosmic Reading" experience, and bilingual content (English + Lithuanian).

| Property | Value |
|----------|-------|
| Domain | astrara.app |
| Framework | Next.js 16.1.6 |
| React | 19.2.3 |
| 3D Engine | Three.js 0.183.2 + React Three Fiber 9.5.0 |
| Language | TypeScript 5.x (strict mode) |
| Styling | Tailwind CSS 4.x |
| Hosting | Vercel |
| Analytics | Plausible (self-hosted script tag) |
| Repository | Single branch (`main`) |
| Deploy branch | `main` (auto-deploy via Vercel) |

---

## 2. FOLDER STRUCTURE

```
astrara.app/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── textures/earth.jpg     # Earth sphere texture
│   └── *.svg                  # Default Next.js icons
├── engine/
│   └── ARCHITECTURE.md        # This file
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (fonts, metadata, Plausible)
│   │   ├── page.tsx           # Main app page (~800 lines, all state)
│   │   ├── globals.css        # Global styles, glass morphism, animations
│   │   ├── about/             # Educational reference page
│   │   │   ├── page.tsx       # About page component
│   │   │   ├── content.ts     # Bilingual about content data
│   │   │   └── layout.tsx     # About layout (noindex)
│   │   ├── promo/             # Content Studio (horoscope generator)
│   │   │   ├── page.tsx       # Promo page with Claude API integration
│   │   │   └── layout.tsx     # Promo layout (noindex)
│   │   ├── birth-chart/
│   │   │   └── page.tsx       # Placeholder (Phase 2)
│   │   └── api/
│   │       ├── horoscope/route.ts       # Personal daily horoscope API
│   │       ├── horoscope-daily/route.ts # Universal daily reading API
│   │       └── horoscope-weekly/route.ts # Weekly horoscope API
│   ├── components/
│   │   ├── AstroWheel/
│   │   │   ├── AstroWheel3D.tsx         # Main 3D scene (~1900 lines)
│   │   │   ├── AstroWheel3DWrapper.tsx  # Error boundary + Suspense
│   │   │   ├── AstroWheel.tsx           # 2D SVG fallback wheel
│   │   │   ├── PlanetMarker.tsx         # 2D planet marker (SVG)
│   │   │   ├── WheelTooltip.tsx         # Detail panel for tapped items
│   │   │   └── ZodiacRing.tsx           # 2D zodiac ring (SVG)
│   │   ├── CosmicWeather/
│   │   │   ├── CosmicWeather.tsx        # Weather container
│   │   │   ├── AspectHighlight.tsx      # Aspect card
│   │   │   ├── MoonPhaseCard.tsx        # Moon phase card
│   │   │   └── PlanetCard.tsx           # Planet info card
│   │   ├── Header/Header.tsx            # App header
│   │   ├── SettingsPanel/SettingsPanel.tsx # Settings modal
│   │   ├── AboutModal/AboutModal.tsx    # About + Glossary modal
│   │   ├── EarthPanel/EarthPanel.tsx    # Earth data modal
│   │   ├── Starfield/
│   │   │   ├── CosmicBackground.tsx     # 3D starfield + nebulae
│   │   │   └── Starfield.tsx            # 2D canvas starfield
│   │   ├── CrystallineCore/
│   │   │   ├── CrystallineCore.tsx      # Main controller (form switching, visibility, tap)
│   │   │   ├── SeedOfLife.tsx           # Water form (7 wireframe spheres + glow)
│   │   │   ├── IcosahedronForm.tsx      # Default form (glass icosahedron + vertex morph)
│   │   │   ├── EnergyStreams.tsx         # Planet-to-crystal bezier arcs
│   │   │   ├── CrystalTapOverlay.tsx    # Bottom sheet with cosmic message
│   │   │   └── crystalUtils.ts          # getDominantElement(), element maps
│   │   ├── LanguageToggle.tsx           # EN/LT language switcher
│   │   ├── GlossaryTerm.tsx             # Inline glossary tooltip
│   │   └── ui/
│   │       ├── GlassCard.tsx            # Glass morphism card
│   │       ├── Modal.tsx                # Bottom sheet / side panel
│   │       └── Shimmer.tsx              # Loading shimmer
│   ├── features/
│   │   └── cosmic-reading/
│   │       ├── types.ts                 # Reading types & interfaces
│   │       ├── ReadingContext.tsx        # React context + state provider
│   │       ├── useReadingStateMachine.ts # State machine (useReducer)
│   │       ├── components/
│   │       │   ├── CosmicReadingButton.tsx
│   │       │   ├── PhaseCard.tsx
│   │       │   ├── PhaseNavigation.tsx
│   │       │   ├── PhaseProgressBar.tsx
│   │       │   ├── ReadingOverlay.tsx
│   │       │   ├── ReadingSummaryCard.tsx
│   │       │   └── ZodiacSelector.tsx
│   │       ├── animation/
│   │       │   ├── AspectBeam.tsx        # 3D curved dashed energy arcs
│   │       │   ├── AspectLineOverlay.tsx # Simple aspect line renderer
│   │       │   ├── PlanetGlow.tsx        # Glow spheres at planet positions
│   │       │   ├── PlanetHighlight.tsx   # Pulse/glow/enlarge effects
│   │       │   ├── ReadingCameraController.tsx # Camera focus on planets
│   │       │   └── useReadingAnimation.ts     # Animation state hook
│   │       ├── content/
│   │       │   ├── generateReading.ts   # Reading content generator
│   │       │   └── templates/
│   │       │       ├── aspectTemplates.ts
│   │       │       ├── frequencyTemplates.ts
│   │       │       ├── houseTemplates.ts
│   │       │       ├── moonTemplates.ts
│   │       │       ├── planetDeclensions.ts
│   │       │       ├── planetDomains.ts
│   │       │       ├── retrogradeTemplates.ts
│   │       │       └── sunTemplates.ts
│   │       └── utils/
│   │           ├── storage.ts           # localStorage for zodiac profile
│   │           └── zodiacHelpers.ts     # Sign data + house calculation
│   ├── audio/
│   │   ├── CosmicAudioEngine.ts         # Master audio orchestrator
│   │   ├── DroneLayer.ts               # Sub-bass drone + LFO
│   │   ├── BinauralLayer.ts            # Stereo binaural beats
│   │   ├── PlanetToneLayer.ts          # Planet/sign tap tones
│   │   ├── RotationSoundLayer.ts       # Wheel spin whoosh sound
│   │   ├── frequencies.ts             # Frequency mappings + presets
│   │   └── useCosmicAudio.ts          # React hook for audio control
│   ├── hooks/
│   │   ├── useAstroData.ts            # Planetary positions + aspects
│   │   ├── useEarthData.ts            # NOAA geomagnetic data
│   │   ├── useLocation.ts            # Geolocation + IP fallback
│   │   ├── useRealTime.ts            # Live clock
│   │   └── useTapVsDrag.ts           # Tap vs drag detection
│   ├── lib/
│   │   ├── astronomy.ts              # astronomy-engine wrapper
│   │   ├── aspects.ts                # Aspect calculation engine
│   │   ├── planets.ts                # Planet metadata (glyphs, colours)
│   │   ├── zodiac.ts                 # Zodiac sign metadata
│   │   ├── heliocentric.ts           # Heliocentric position calculation
│   │   ├── distance.ts              # AU → km/miles/light-travel
│   │   ├── insights.ts              # Insight accessor functions
│   │   ├── earth-data.ts            # NOAA API data fetcher
│   │   ├── earth-insights.ts        # Kp-based guidance text
│   │   ├── dateTitle.ts             # Date formatting (EN/LT)
│   │   └── location.ts             # Geolocation + Nominatim geocoding
│   ├── i18n/
│   │   ├── LanguageContext.tsx       # Language provider (EN/LT)
│   │   ├── useTranslation.ts        # t() function hook
│   │   ├── useContent.ts            # Content data hook
│   │   ├── translations/
│   │   │   ├── en.json              # English UI strings
│   │   │   └── lt.json              # Lithuanian UI strings
│   │   └── content/
│   │       ├── en/                   # English content
│   │       │   ├── about.ts
│   │       │   ├── aspect-meanings.ts
│   │       │   ├── phase-meanings.ts
│   │       │   ├── planet-meanings.ts  # ~97 KB (120 planet×sign combos)
│   │       │   └── sign-meanings.ts
│   │       └── lt/                   # Lithuanian content (parallel)
│   │           ├── about.ts
│   │           ├── aspect-meanings.ts
│   │           ├── phase-meanings.ts
│   │           ├── planet-meanings.ts
│   │           └── sign-meanings.ts
│   └── data/
│       └── glossary.ts              # Glossary terms (EN/LT)
├── package.json
├── tsconfig.json
├── next.config.ts                   # Empty (defaults)
├── postcss.config.mjs
├── eslint.config.mjs
└── .env.example                     # ANTHROPIC_API_KEY
```

---

## 3. DEPENDENCIES

### Core Framework

| Package | Version | Purpose in Astrara |
|---------|---------|-------------------|
| `next` | 16.1.6 | App framework, routing, API routes, SSR |
| `react` | 19.2.3 | UI component library |
| `react-dom` | 19.2.3 | DOM rendering |

### 3D / Rendering

| Package | Version | Purpose in Astrara |
|---------|---------|-------------------|
| `three` | 0.183.2 | 3D engine for zodiac wheel, starfield, planet spheres |
| `@react-three/fiber` | 9.5.0 | React renderer for Three.js (Canvas, useFrame, useThree) |
| `@react-three/drei` | 10.7.7 | R3F helpers: Html overlays, OrbitControls, Environment, useTexture |
| `@react-three/postprocessing` | 3.0.4 | Bloom effect (desktop only) |

### Data / Astronomy

| Package | Version | Purpose in Astrara |
|---------|---------|-------------------|
| `astronomy-engine` | 2.1.19 | Client-side geocentric + heliocentric position calculations |

### UI / Animation

| Package | Version | Purpose in Astrara |
|---------|---------|-------------------|
| `framer-motion` | 12.34.5 | Animation library (used in Cosmic Reading transitions) |
| `react-markdown` | 10.1.0 | Render AI-generated horoscope markdown on promo page |
| `remark-gfm` | 4.0.1 | GitHub-flavored markdown tables/lists in horoscope output |

### Dev Tools

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.x | Type checking (strict mode) |
| `tailwindcss` | 4.x | Utility-first CSS |
| `@tailwindcss/postcss` | 4.x | PostCSS plugin for Tailwind |
| `eslint` | 9.x | Linting |
| `eslint-config-next` | 16.1.6 | Next.js ESLint rules |
| `@types/node` | 20.x | Node.js type definitions |
| `@types/react` | 19.x | React type definitions |
| `@types/react-dom` | 19.x | ReactDOM type definitions |
| `@types/three` | 0.183.1 | Three.js type definitions |

---

## 4. PAGE ROUTES

| Route | Type | Access | Description |
|-------|------|--------|-------------|
| `/` | Page | Public | Main app — 3D zodiac wheel, cosmic weather, day navigation, birth chart input, Cosmic Reading |
| `/about` | Page | Public (noindex) | Educational reference — planets, signs, aspects, elements, frequency tables |
| `/promo` | Page | Hidden (noindex) | Content Studio — AI horoscope generator using Claude API |
| `/birth-chart` | Page | Public | Placeholder — "Coming in Phase 2" message |
| `/api/horoscope` | POST API | Internal | Personal daily horoscope by zodiac sign (Claude claude-sonnet-4-20250514) |
| `/api/horoscope-daily` | POST API | Internal | Universal daily cosmic reading (Claude claude-sonnet-4-20250514) |
| `/api/horoscope-weekly` | POST API | Internal | Weekly horoscope by zodiac sign (Claude claude-sonnet-4-20250514) |

---

## 5. CORE ARCHITECTURE

### App Initialisation Flow

```
layout.tsx (fonts, metadata, Plausible script)
  └─ page.tsx
      └─ LanguageProvider (i18n context)
          └─ GlossaryTooltipProvider (tooltip state)
              └─ HomePage (all app state)
                  └─ ReadingProvider (Cosmic Reading context)
                      ├─ CosmicBackground (3D starfield)
                      ├─ Header
                      ├─ AstroWheel3DWrapper → AstroWheel3D (3D Canvas)
                      ├─ Day Navigation / Helio Controls
                      ├─ CosmicWeather (cards)
                      ├─ Modals (Tooltip, Earth, About, Settings, Birth Chart)
                      └─ ReadingOverlay (Cosmic Reading)
```

### State Management

All state lives in `HomePage` component (`page.tsx`) using React hooks:

| State Category | Variables | Storage |
|---------------|-----------|---------|
| Date navigation | `dayOffset`, `customDate` | React state |
| UI panels | `tooltip`, `selectedPlanet`, `showBirthInput`, `showEarthPanel`, `showAbout`, `showSettings` | React state |
| View mode | `viewMode` ('geocentric'/'heliocentric'), `isTransitioning`, `showHelioLabels` | React state + localStorage |
| Settings | `settings` (AstraraSettings) | React state + localStorage (`astrara-settings`) |
| Birth chart | `birthDate`, `birthTime`, `birthCity`, `birthChartData` | React state + localStorage (`astrara-birth-data`) |
| Helio autoplay | `autoplayDirection`, animation refs | React state + refs |
| Audio | Managed by `useCosmicAudio` hook | localStorage (`astrara-audio`) |

**Context Providers:**
- `LanguageProvider` — Current language (EN/LT), persisted in `astrara-lang`
- `GlossaryTooltipProvider` — Global tooltip state (one tooltip at a time)
- `ReadingProvider` — Cosmic Reading state machine, current reading, phase navigation

### Data Flow

```
astronomy-engine (client-side)
  │
  ├─ useAstroData(date, lat, lng) → { planets, moon, aspects, notableAspects }
  │   ├─ getPlanetPositions() → PlanetPosition[] (10 bodies)
  │   ├─ getMoonData() → MoonData
  │   ├─ calculateAspects() → AspectData[]
  │   └─ getNotableAspects() → AspectData[] (orb < 3°, max 5)
  │
  ├─ calculateAllHelioData(date) → Record<string, HelioData>
  │
  └─ All data passed via props:
      page.tsx → AstroWheel3DWrapper → AstroWheel3D
      page.tsx → CosmicWeather → PlanetCard, MoonPhaseCard, AspectHighlight
      page.tsx → ReadingProvider → generateCosmicReading()
```

### i18n System

- **Languages:** English (en), Lithuanian (lt)
- **UI strings:** `src/i18n/translations/{en,lt}.json` — accessed via `useTranslation().t(key)`
- **Content data:** `src/i18n/content/{en,lt}/*.ts` — accessed via `useContent()` hook
- **Switching:** `LanguageToggle` component → `useLanguage().setLang()` → persisted in localStorage `astrara-lang`
- **Lithuanian grammar:** Planet declensions (5 cases) in `planetDeclensions.ts`; locative case zodiac names in translation files
- **Detection:** Browser language checked on first visit (`navigator.language.startsWith('lt')`)

### User Location

1. Browser Geolocation API (5s timeout, 10min cache)
2. Fallback: IP-based lookup via `ipapi.co/json` (3s timeout)
3. Fallback: London (51.5074, -0.1278)
4. Manual override via Settings panel (city search using Nominatim/OpenStreetMap)

---

## 6. THE ASTRO WHEEL (3D Scene)

### Component Hierarchy

```
<Canvas camera={[0, 1.5, 7]} fov={38}>
  <WheelScene>
    ├── Lighting
    │   ├── ambientLight (intensity=0.3)
    │   ├── directionalLight (position=[3,4,2], intensity=0.6)
    │   ├── pointLight (position=[0,-2,0], intensity=0.2)
    │   └── Environment preset="night"
    │
    ├── BackgroundParticles (200 stars, rotating)
    ├── OrbitingLight (shimmer on glass ring)
    │
    ├── Transition System
    │   ├── LabelOpacityAnimator
    │   ├── TransitionController (drives geo↔helio phases)
    │   ├── CameraDistanceAnimator (×8 zoom for helio)
    │   ├── HelioTiltAnimator (60°→near-top-down)
    │   └── ContinuousTimeAnimator (helio time-lapse)
    │
    ├── Main Group
    │   ├── EarthPositionAnimator
    │   │   └── EarthCentre
    │   │       ├── EarthSphereTextured (or Fallback)
    │   │       ├── EarthKpAura (Kp-responsive glow)
    │   │       ├── EarthTapTarget
    │   │       └── Label ("home")
    │   │
    │   ├── GeoFadeGroup (fades during helio transition)
    │   │   ├── OuterZodiacRing (12 segments + glyph buttons)
    │   │   ├── MiddleRing (decorative, degree markers)
    │   │   ├── InnerTrackRing
    │   │   └── InnerDust (80 particles)
    │   │
    │   ├── OrbitalRings (helio-only orbital paths)
    │   ├── MoonOrbitRing (helio-only, follows Earth)
    │   ├── PlanetOrb × 10 (sphere + label + glow + tap)
    │   ├── SunCoronaAnimated (sun glow, moves geo→centre)
    │   ├── PlanetPolygon (sacred geometry lines)
    │   ├── SunCentreLabel (helio "Sun" label)
    │   └── CrystallineCore (element-based crystal @ Y=1.4 + energy streams)
    │       ├── SeedOfLife / IcosahedronForm
    │       ├── Tap target (invisible sphere r=0.4)
    │       ├── PointLight (element-coloured)
    │       └── EnergyStreams (5 bezier arcs from planets)
    │
    ├── Reading Animations
    │   ├── PlanetGlow (highlight spheres)
    │   └── AspectBeam (curved dashed energy arcs)
    │
    ├── TiltAnimator (entrance tilt, phase 7)
    ├── RotationVelocityTracker
    ├── OrbitControls (auto-rotate, damping)
    └── ConditionalBloom (desktop only, width ≥ 768)
  </WheelScene>
</Canvas>
```

### Planetary Position Calculation

```typescript
// astronomy-engine → ecliptic longitude (0–360°)
// Mapped to 3D XZ plane:
rad = (longitude - 90) * Math.PI / 180
x = Math.cos(rad) * R_PLANET  // R_PLANET = 1.5
z = Math.sin(rad) * R_PLANET
y = 0 (+ offset if overlap detected)
```

- Overlap detection: planets within 8° get Y offset (0.15) and radius offset (0.12)
- Retrograde detection: comparing longitude vs. previous day

### Zodiac Sign Rendering

- 12 segments (30° wedges) between R_OUTER=2.2 and R_OUTER_INNER=2.05
- Each segment coloured by element (fire=#FF6B4A, earth=#4ADE80, air=#60A5FA, water=#A78BFA)
- Unicode glyph buttons rendered as R3F `<Html>` overlays at mid-radius
- Divider lines at 30° intervals
- Per-frame opacity updates via direct DOM refs (no React re-renders)

### Camera System

| Property | Value |
|----------|-------|
| Position | [0, 1.5, 7] |
| FOV | 38° |
| Near/Far | 0.1 / 100 |
| Controls | OrbitControls (drei) |
| Auto-rotate | Enabled after entrance tilt (speed=0.3) |
| Damping | 0.05 (geo), 0.08 (reading) |
| Polar limits | 0.3–2.8 rad (unlocked after tilt) |
| Zoom | Disabled |
| Pan | Disabled |

### Auto-Rotation

- Starts after entrance phase 8 (`tiltDone=true`)
- Speed: 0.3 (OrbitControls.autoRotateSpeed)
- Pauses during: modal open, planet tap, active reading
- Resumes after: modal close, tooltip dismiss
- **Keeps spinning during Cosmic Reading overlay** (recent fix)

### Tap Interaction

Uses `useTapVsDrag` hook to distinguish tap from drag:
- `moveThreshold`: 5px — if pointer moves more, it's a drag (wheel spin)
- `timeThreshold`: 300ms — long press treated as drag
- Does NOT call `stopPropagation` on pointer down (allows OrbitControls to receive events)
- **Planet tap**: Flash effect (emissiveIntensity spike to 3.0 for 300ms), opens tooltip
- **Zodiac tap**: Opens sign tooltip
- **Earth tap**: Opens Earth data panel
- **During Reading**: Planet/zodiac taps are disabled

### Aspect Rendering (Geocentric)

- Sacred geometry polygon: planets sorted by ecliptic longitude, connected by lines
- Radial lines from centre to each planet position (opacity=0.06)
- Polygon opacity pulses: `0.12 + sin(t) × 0.06`
- Aspect connections shown via Cosmic Reading's AspectBeam component

### Earth Model

- **Textured**: `/textures/earth.jpg` loaded via `useTexture` (SRGBColorSpace)
- **Fallback**: Procedural canvas texture (512×256) with painted continents, ocean gradient, polar ice, cloud wisps
- Rotates on Y-axis at 0.08 rad/frame
- **Kp Aura**: Dynamic glow sphere responding to geomagnetic Kp index (green→yellow→red→magenta)
  - Pulsing at storm-level Kp (speed varies 1–4 Hz)
  - Inner (scale 1.3) and outer (scale 1.8) aura layers

### Starfield / Background

- **BackgroundParticles**: 200 points in spherical distribution (radius 3.5–6.0), rotating slowly
- **InnerDust**: 80 particles in cylindrical distribution (radius 0.3–1.5)
- **OuterHalo**: Canvas-based radial gradient sprite (7×7 scale, opacity 0.08)
- **CosmicBackground** (separate Canvas): 1500 deep + 400 mid + 20 accent stars + optional 5 nebula clouds

### Glass Ring & Lighting

- **OrbitingLight**: Point light orbiting at R_OUTER+0.3, creates shimmer on ring surfaces
- **Ring materials**: meshPhysicalMaterial with metalness=0.6, clearcoat=1.0
- **Segment materials**: Low opacity (0.08–0.1), element-coloured emissive tint

### Loading Sequence (8 Phases)

| Phase | Time | Component | Animation |
|-------|------|-----------|-----------|
| 1 | 0–400ms | EarthCentre | Scale 0→1 |
| 2 | 400–800ms | MiddleRing, InnerTrackRing, InnerDust | Scale 0→1 |
| 3 | 600–1200ms | OuterZodiacRing | Scale 0→1, glyphs staggered |
| 4 | 1400–2400ms | PlanetOrb ×10 | Scale 0→1 (100ms between each) |
| 5 | 3000ms | SunCorona | Entrance fade (800ms) |
| 6 | 3000ms | — | `entranceComplete=true` flag |
| 7 | 3500ms | TiltAnimator | Polar angle → π/3 (60°) |
| 8 | After tilt | OrbitControls | Auto-rotation begins |

### Heliocentric Transition System

**TransitionController** drives a single `transitionProgress` ref (0=geo, 1=helio) at speed 1.5:

| Phase | Progress Range | Animation |
|-------|---------------|-----------|
| Phase 1 | 0–25% | Zodiac ring fades out (zodiacOpacity 1→0) |
| Phase 2 | 25–85% | Planets smoothly move to helio positions (smoothstep easing) |
| Phase 3 | 70–100% | Heliocentric elements fade in (orbital rings, labels, sun centre) |

**Additional Animators:**
- **CameraDistanceAnimator**: Scales camera distance ×8 for helio view
- **HelioTiltAnimator**: Camera tilt from 60° to near-top-down (last 15% of transition)
- **EarthPositionAnimator**: Moves Earth from centre to orbital position
- **SunCoronaAnimated**: Sun glow lerps from planet position to centre
- **ContinuousTimeAnimator**: Updates helio positions per-frame during autoplay

**Heliocentric Ring Radii** (scene units, evenly spaced for readability):
Mercury=2.5, Venus=4.0, Earth=5.5, Mars=7.0, Jupiter=9.0, Saturn=11.0, Uranus=13.0, Neptune=15.0, Pluto=17.0

**Heliocentric Scale Multipliers** (compensate for distance scaling):
Sun=6.0, Jupiter=11.0, Saturn=10.0, Uranus=8.0, Neptune=7.6, Earth=6.0, Venus=5.6, Mars=5.0, Mercury=4.0, Pluto=3.6, Moon=3.6

---

## 7. COSMIC READING SYSTEM

### State Machine

```
IDLE → START_READING
  ├─ (no profile) → ONBOARDING → COMPLETE_ONBOARDING → PREPARING
  └─ (has profile) → PREPARING
        ↓ (100ms)
      PHASE_ANIMATING → (camera reaches target or 1200ms fallback)
        ↓
      PHASE_READING → NEXT_PHASE
        ↓
      PHASE_TRANSITIONING → (150ms)
        ↓
      PHASE_ANIMATING (next phase, loop)
        ...
      Last phase + NEXT_PHASE → EXITING → (500ms) → IDLE
```

**Any state** can receive `EXIT_READING` → `EXITING` → `IDLE`

### ReadingContext

Provides via React Context:
- `state` — Current ReadingState (status + phaseIndex)
- `isReadingActive` — Boolean shorthand
- `currentReading` — CosmicReading object (phases, summary, metadata)
- `currentPhase` — Active ReadingPhase
- `zodiacProfile` — User's stored sun sign + birth data
- Navigation: `startReading()`, `nextPhase()`, `jumpToPhase(i)`, `exitReading()`
- `onAnimationComplete()` — Callback for 3D scene to signal camera arrival

### Content Generation

`generateCosmicReading(astroData, zodiacProfile?, lang, selectedDate)` produces 6–8 phases:

| Order | Phase Type | Content Source |
|-------|-----------|---------------|
| 0 | Summary | Compiled theme, keywords, overview |
| 1 | Moon Phase | MOON_PHASES + MOON_IN_SIGN templates |
| 2 | Sun Position | SUN_IN_SIGN templates |
| 3–5 | Notable Aspects (up to 3) | ASPECT_DESCRIPTIONS + PLANET_ENERGIES + SPECIAL_ASPECTS |
| 6 | Retrograde (if any) | RETROGRADE_READINGS per planet |
| 7 | Frequency Recommendation | PLANETARY_FREQUENCIES (Hz, chakra, Binara link) |

**Personalization**: If user has zodiac profile, readings include house-specific text using whole-sign house system (user's sun sign determines house 1).

**Bilingual**: All templates contain `{ en, lt }` objects. Lithuanian uses grammatically correct declensions via `PLANET_DECLENSIONS_LT`.

### Phase Cards

- Bottom sheet overlay (z-40) with glass morphism
- PhaseProgressBar: clickable icons for each phase type
- PhaseCard: scrollable content (max-h 40vh) with icon, title, subtitle, plain name, general reading, personal reading, frequency recommendation
- PhaseNavigation: "Next" button (purple gradient), "Close" on last phase
- Content opacity varies by state: 1.0 (PHASE_READING), 0.7 (PHASE_ANIMATING), 0.3 (PHASE_TRANSITIONING)
- Vignette overlay: radial gradient (transparent centre → black edges)

### Reading 3D Animations

- **ReadingCameraController**: Lerps camera toward highlighted planet (LERP_SPEED=0.08), fires onComplete when distance < 0.2
- **PlanetGlow**: Additive-blending spheres at planet positions (opacity = 0.12 × intensity)
- **PlanetHighlight**: Pulse/glow/enlarge effects with fade-in
- **AspectBeam**: Curved dashed energy arcs between two planets (Bezier curve, dual-layer: core + glow), draw-in animation (0–800ms) then continuous energy flow
- **ReadingWheelPadding**: Adjusts wheel container to make room for overlay
- **Wheel keeps auto-rotating** during reading (recent fix)

### Zodiac Selector

- Modal (z-50) with 4×3 grid of zodiac buttons
- Auto-derives sun sign from existing birth chart data if available
- Saves `ZodiacProfile` to localStorage (`astrara_zodiac_profile`)

---

## 7B. CRYSTALLINE CORE

### Overview

A living, responsive crystalline energy form hovering well above the wheel centre (Y=1.4) with clear visual separation from the planets and zodiac ring. Its shape shifts based on the dominant element. Users can tap it to receive a cosmic crystallisation message.

### Element Dominance Calculation

`getDominantElement(planets)` in `crystalUtils.ts`:
1. Maps each planet's zodiac sign to its element (fire/water/earth/air)
2. Sun and Moon count as weight 2 (luminaries), other planets weight 1
3. Returns the element with highest weighted count
4. Ties default to 'air'

### Two Crystal Forms

| Element | Form | Component | Geometry |
|---------|------|-----------|----------|
| Water | Seed of Life | `SeedOfLife.tsx` | 7 wireframe spheres in Seed of Life pattern + 12 intersection glow points |
| Fire / Earth / Air / Tie | Icosahedron | `IcosahedronForm.tsx` | Glass icosahedron (r=0.22) + wireframe overlay + vertex morphing every 8–10s |

### Energy Streams

`EnergyStreams.tsx` draws curved bezier arcs from the 5 most prominent planets (Sun, Moon, Mercury, Venus, Mars) to the crystal position. Each stream:
- Uses `THREE.QuadraticBezierCurve3` with upward-offset control point
- Additive blending, planet-coloured
- Pulsing opacity: `0.1 + 0.08 * sin(time * 1.5 + index * 0.7)`

### Tap Interaction

- Invisible sphere tap target (r=0.4) around crystal
- On tap: scale pulse (1→1.15→1 over 400ms)
- Opens `CrystalTapOverlay` bottom sheet with:
  - "Cosmic Crystallisation" title (EN/LT)
  - Dominant element analysis + planet counts per element
  - Element-based guidance message

### Visibility Rules

| Context | Behaviour |
|---------|-----------|
| Geocentric view | Fully visible |
| Heliocentric view | Faded out (hidden) — crystal only makes sense in geo context |
| Cosmic Reading active | Opacity reduced to 50%, remains visible |
| Crystal disabled in settings | Completely unmounted from scene |

### Settings

- **Crystal Core toggle**: on/off (default ON), stored in `crystalEnabled` within `astrara-settings`
- **Crystal Form override**: 'auto' / 'seed' / 'icosa' (default 'auto'), stored in `crystalForm`
- When 'auto', form follows dominant element calculation (water → seed, all others → icosa)
- 3 selectable buttons in Settings panel (only visible when crystal is enabled)
- Legacy 'toroid' values in localStorage are migrated to 'auto' on load

### Point Light

Element-coloured `PointLight` at crystal position (intensity=0.3, distance=2). Colour smoothly lerps when element changes.

---

## 8. AUDIO SYSTEM

### Architecture

```
CosmicAudioEngine (master orchestrator)
  ├── DroneLayer      → masterGain → destination
  ├── BinauralLayer   → masterGain → destination
  ├── PlanetToneLayer → masterGain → destination
  └── RotationSoundLayer → rotationGain → destination (independent)
```

### Audio Toggle

- Button in Header (sound icon)
- `useCosmicAudio` hook manages singleton `CosmicAudioEngine`
- Preference persisted in localStorage (`astrara-audio`: 'on'/'off')
- Master gain fades: 0→1 over 2s (start), current→0 over 2s (stop)
- First enable shows headphone hint toast (one-time, tracked in `astrara-audio-hint`)

### Drone Layer

5 sine oscillators at harmonic intervals, keyed to Moon's zodiac sign:

| Tier | Frequency | Volume | Purpose |
|------|-----------|--------|---------|
| 1 | root/4 | 0.15 | Sub-bass foundation |
| 2 | root/2 | 0.12 | Root tone |
| 3 | root/2 × 1.5 | 0.06 | Fifth harmonic |
| 4 | root | 0.04 | Octave brightness |
| 5 | root/2 × 1.002 | 0.05 | Detuned width |

- LFO: 0.08 Hz sine, gain 0.02 (one breath ≈ 12.5 seconds)
- Root frequency from SIGN_FREQUENCIES (Solfeggio: 174–963 Hz)

### Binaural Beats

- Carrier frequency: 210.42 Hz (Moon frequency)
- Beat frequency from Moon sign element:
  - Fire → 14 Hz (Low Beta, alertness)
  - Earth → 3.5 Hz (Delta, deep rest)
  - Air → 10 Hz (Alpha, relaxed focus)
  - Water → 6 Hz (Theta, meditation)
  - Default → 7.83 Hz (Schumann resonance)
- Left ear: carrier Hz, Right ear: carrier + beat Hz
- Stereo via ChannelMergerNode, volume 0.08 per channel

### Interactive Tones

**Planet tap**: 3 sine partials at fundamental + 2nd + 3rd harmonics, each with lowpass filter, quick attack (50ms), exponential decay (3s). Frequencies from Hans Cousto planetary octaves (e.g., Sun=126.22 Hz, Moon=210.42 Hz, Venus=221.23 Hz).

**Zodiac tap**: Element-specific multi-partial patterns:
- Fire: rising fifth (freq/4 + freq/4×1.5), 2s
- Earth: single sub-bass (freq/8), 3s
- Air: octave shimmer (freq/2 + freq), 1.5s
- Water: descending (freq/2 + freq/4), 2.5s

### Rotation Vortex Sound

Dual oscillator + filtered noise, all parameters velocity-mapped:

| Parameter | Min (stopped) | Max (full spin) |
|-----------|--------------|-----------------|
| Base oscillator | 30 Hz | 70 Hz |
| Sub oscillator | 15 Hz | 35 Hz |
| Noise filter | 80 Hz | 250 Hz |
| LFO rate | 1 Hz | 6 Hz |
| Volume | 0 | 0.14 |

- Noise: looping random buffer, bandpass (Q=6) + lowpass ceiling (300 Hz)
- Independent gain node (bypasses master mute, always routed to destination)

### Web Audio Autoplay

- AudioContext created lazily on first user interaction
- Context resumed if suspended (browser autoplay policy)
- No auto-play on page load

---

## 9. UI COMPONENTS & MODALS

### Header

- App title "ASTRARA" with tagline
- Formatted date (locale-aware: en-GB or lt-LT) with live time if today
- City/location display (truncated if long)
- Three action buttons: Sound toggle (pulse animation if on), About, Settings
- Date underlined in helio mode; click opens hidden date picker for date jumping

### Settings Panel

**Settings (AstraraSettings):**

| Setting | Type | Default | Range |
|---------|------|---------|-------|
| planetScale | number | 0.8 | 0.5–1.5 |
| rotationSpeed | number | 2.5 | 0–5 |
| rotationSoundEnabled | boolean | true | — |
| immersiveUniverse | boolean | false | — |
| crystalEnabled | boolean | true | — |
| crystalForm | CrystalFormOverride | 'auto' | 'auto'/'seed'/'icosa' |

- Location search with debounced Nominatim API
- Language dropdown (EN/LT with flags)
- Reset to defaults button
- Version display + Harmonic Waves link
- Stored in localStorage (`astrara-settings`)

### About Modal

Two tabs:
- **About**: Sections about the wheel, solar system view, insights, sound, Earth data; FAQ (8 items); ecosystem links
- **Glossary**: Searchable glossary filtered by term name/description; categories: Moon Phases, Aspects, Planets, Zodiac Signs; each term with symbol, name, description (bilingual)

### Birth Chart Modal

- Date, time, and city inputs
- City search with debounced Nominatim API (max 5 results)
- Calculates birth chart positions via `getPlanetPositions(date, lat, lng)`
- Calculates birth chart aspects via `calculateAspects(positions)`
- Persists to localStorage (`astrara-birth-data`)
- Not a full natal chart — shows positions and aspects for the birth moment

### Day Navigation (Geocentric)

- Yesterday / Today / Tomorrow buttons
- Hidden date input for custom date jumping
- "Back to Today" button when offset !== 0

### Helio Autoplay Controls

- Play/pause with direction controls (backward-fast, backward, forward, forward-fast)
- Speeds: 2 days/sec (normal), 14 days/sec (fast)
- Header date updates via requestAnimationFrame (no React re-renders)
- Exclusive to heliocentric view mode

### CosmicWeather

Container rendering:
- Moon phase card (phase name, emoji, illumination %, sign, meaning)
- Planet cards (×10: glyph, sign, degree, retrograde badge, domain, distance, insight)
- Notable aspects section (if any): planet pair cards with meaning and orb

### Earth Panel

Real-time Earth data from NOAA:
- Kp Index (0–9) with colour-coded bar + storm label
- Solar wind speed + density
- Magnetic field Bz component
- Solar flare class
- Schumann resonance (7.83 Hz base + harmonics)
- Body/Mind/Practice guidance based on Kp level
- External link to shumann.app

### View Toggle

- Button between wheel and day navigation
- Switches `viewMode` between 'geocentric' and 'heliocentric'
- Label visibility toggle (eye icon) for helio planet labels
- Persisted in localStorage (`astrara-helio-labels`)

---

## 10. STYLING SYSTEM

### Tailwind Configuration

- Tailwind CSS v4 with PostCSS plugin
- No custom tailwind.config — uses CSS-first configuration in `globals.css`

### CSS Variables

```css
--bg-deep: #07070F          /* Primary background */
--bg-surface: #0D0D1A       /* Card backgrounds */
--text-primary: rgba(255,255,255,0.90)
--text-secondary: rgba(255,255,255,0.55)
--text-muted: rgba(255,255,255,0.30)
--accent-purple: #8B5CF6
--accent-gold: #FFD700
--fire: #FF6B4A
--earth: #4ADE80
--air: #60A5FA
--water: #A78BFA
--glass-bg: rgba(255,255,255,0.03)
--glass-border: rgba(255,255,255,0.08)
--glass-hover: rgba(255,255,255,0.06)
```

### Glass Morphism

`.glass-card` class provides:
- Multi-layered box-shadow (8px 32px blur, inset highlights)
- Animated rotating border gradient (20s rotation)
- `::before` horizontal edge sweep (10s)
- `::after` dual gradient refract (16s)
- `.glass-tint`: backdrop-filter blur(16px) + saturate
- `.glass-border`: animated gradient border
- Float entrance animation (slides up 20px, 0.6s, staggered per nth-child)
- Breathing box-shadow pulse (10s)
- Hover: translateY(-2px) with enhanced glow

### Fonts

| Variable | Font | Weights | Usage |
|----------|------|---------|-------|
| `--font-display` | Cormorant Garamond | 400–700 | Headings, titles |
| `--font-body` | DM Sans | 400–700 | Body text, labels |
| `--font-mono` | DM Mono | 300–400 | Monospace elements, degrees |

Loaded via Next.js font optimisation (Google Fonts).

### Key Animations

| Name | Duration | Effect |
|------|----------|--------|
| `glass-cardFloat` | 0.6s | Slide up + fade in (staggered) |
| `glass-breathe` | 10s | Pulsing box-shadow |
| `pulse-glow` | — | Opacity 0.2–0.4 |
| `twinkle` | — | Opacity 0.3–1.0 |
| `shimmer` | 2s | Background position sweep |
| `slide-up` | 0.25s | Modal entrance |
| `glossaryFadeIn` | 0.15s | Tooltip fade in |

### Mobile / iOS Fixes

- `min-height: 100dvh` (dynamic viewport for iOS Safari)
- `max-scale: 1`, `user-scalable: false` (disable pinch zoom)
- `-webkit-user-select: none` globally (except inputs)
- `-webkit-overflow-scrolling: touch` for modals
- Scrollbar hidden via `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`
- Touch callout disabled
- Date input styled with `color-scheme: dark`

---

## 11. DATA & APIs

### astronomy-engine (Client-Side)

| Function Used | Purpose |
|--------------|---------|
| `Body.*` | Planet body constants |
| `GeoVector()` | Geocentric position (for distance) |
| `EclipticGeoMoon()` | Moon ecliptic longitude |
| `Ecliptic()` | Convert equatorial to ecliptic |
| `Equator()` | Equatorial coordinates |
| `SearchRiseSet()` | Rise/set times for observer |
| `MoonPhase()` | Moon phase angle |
| `SearchMoonPhase()` | Next lunation event |
| `Illumination()` | Moon illumination fraction |
| `HelioVector()` | Heliocentric position |
| `MakeTime()` | Date to AstroTime |

### NOAA / SWPC (Server-Side Fetch)

| Endpoint | Data | Refresh |
|----------|------|---------|
| `services.swpc.noaa.gov/products/noaa-planetary-k-index.json` | Kp index (3-hour) | 15 min |
| `services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json` | Solar wind speed + density | 15 min |
| `services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json` | Magnetic field Bz | 15 min |
| `services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json` | Solar X-ray flux | 15 min |

### Claude API (Promo Page Only)

| Route | Model | Max Tokens | Purpose |
|-------|-------|-----------|---------|
| `/api/horoscope` | claude-sonnet-4-20250514 | 1000 | Personal daily horoscope |
| `/api/horoscope-daily` | claude-sonnet-4-20250514 | 1000 | Universal daily reading |
| `/api/horoscope-weekly` | claude-sonnet-4-20250514 | 1000 | Weekly horoscope |

API key: `ANTHROPIC_API_KEY` environment variable (not committed, see `.env.example`).

### Geolocation APIs

| Service | Purpose | Timeout |
|---------|---------|---------|
| Browser Geolocation API | High-precision device location | 5s |
| ipapi.co/json | IP-based location fallback | 3s |
| Nominatim (OpenStreetMap) reverse | Lat/lng → city name | 3s |
| Nominatim (OpenStreetMap) search | City name → lat/lng (max 5) | 3s |

User-Agent for Nominatim: `"Astrara/2.0 (https://astrara.app)"`

### localStorage Keys

| Key | Contents |
|-----|----------|
| `astrara-settings` | AstraraSettings object (planetScale, rotationSpeed, rotationSoundEnabled, immersiveUniverse, crystalEnabled, crystalForm) |
| `astrara-lang` | Language ('en' or 'lt') |
| `astrara-audio` | Audio preference ('on' or 'off') |
| `astrara-audio-hint` | Headphone hint shown flag ('shown') |
| `astrara-helio-labels` | Helio label visibility ('true' or 'false') |
| `astrara-birth-data` | Birth chart inputs (date, time, city, lat, lng) |
| `astrara_zodiac_profile` | Cosmic Reading zodiac profile (sun sign, birth data, timestamps) |

---

## 12. PWA CONFIGURATION

### manifest.json

| Property | Value |
|----------|-------|
| name | "Astrara — Live Cosmic Intelligence" |
| short_name | "Astrara" |
| display | standalone |
| orientation | portrait-primary |
| background_color | #07070F |
| theme_color | #07070F |
| categories | lifestyle, education |
| icons | 192×192 PNG, 512×512 PNG |

### Service Worker

No service worker exists. No offline caching is implemented.

---

## 13. /promo CONTENT STUDIO

### Overview

Hidden page (noindex) for generating AI-powered horoscope content using Claude API. Primarily for marketing / social media content creation.

### Claude API Integration

- Model: `claude-sonnet-4-20250514`
- Max tokens: 1000 per request
- System prompt: warm, clear writing style; no jargon; specific planetary data
- Rate limiting: 5s minimum between generation requests

### Content Types

| Type | API Route | Input | Output Format |
|------|-----------|-------|--------------|
| Personal daily | `/api/horoscope` | Sign + positions + moon + earth + impact | Markdown (energy, sky, guidance, sound, one word) |
| Universal daily | `/api/horoscope-daily` | Positions + moon + earth + impact | Markdown (morning, sky, moon, earth, sound, invitation, one word) |
| Weekly | `/api/horoscope-weekly` | Sign + 7-day positions + movements | Markdown (theme, highlights, influences, guidance, sound, one word) |

### Social Captions

- Auto-generated impact summaries per zodiac sign
- Based on active aspects, retrograde planets, sign-specific transits
- Copy-to-clipboard functionality

---

## 14. /about REFERENCE PAGE

### Content Structure

1. **Celestial Bodies** — 10 planets with glyphs, domains, orbital periods, Cousto frequencies, chakras, sound healing guidance
2. **Zodiac Signs** — 12 signs with dates, element/modality, ruler, themes, body area, shadow side, sound healing, frequency
3. **Reading Guide** — 4-step guide to interpreting a daily chart
4. **Aspects** — 5 major aspects with angles, symbols, and descriptions
5. **Elements & Sound** — Fire/Earth/Air/Water with brainwave frequencies, instruments, healing frequencies
6. **Data Sources** — astronomy-engine, NOAA, Nominatim, Hans Cousto, Solfeggio
7. **Frequency Tables** — Cousto (10 planets) and Solfeggio (12 signs) with Hz, note, chakra, colour/quality
8. **Quick Reference** — Cheat sheet for daily reading

Desktop: sticky TOC sidebar. Mobile: collapsible TOC dropdown. All content bilingual (EN/LT).

---

## 15. KNOWN ISSUES & TECHNICAL DEBT

### TODO / FIXME Comments

None found in the codebase.

### Console Warnings / Errors

| File | Message | Context |
|------|---------|---------|
| `AstroWheel3DWrapper.tsx:66` | `console.warn('3D wheel failed, falling back to 2D')` | Error boundary fallback — expected behaviour |
| `useAstroData.ts:29` | `console.error('Astronomy calculation error')` | Catches astronomy-engine failures — graceful degradation |
| `earth-data.ts:87` | `console.error('Failed to fetch Earth data')` | NOAA API fetch failure — graceful degradation |
| `horoscope/route.ts:106` | `console.error('Horoscope generation error')` | Claude API failure — returns error response |
| `horoscope-daily/route.ts:108` | `console.error('Daily reading generation error')` | Claude API failure — returns error response |
| `horoscope-weekly/route.ts:103` | `console.error('Weekly horoscope generation error')` | Claude API failure — returns error response |

All are expected error handling — no bugs or incomplete features indicated.

### Incomplete Features

- `/birth-chart` page: Placeholder only — "Coming in Phase 2"
- No service worker or offline support despite PWA manifest
- PWA icons (`icon-192.png`, `icon-512.png`) referenced in manifest but not confirmed in public directory
- `next.config.ts` is empty — no custom webpack, image optimization, or headers configured

### Performance Considerations

- `planet-meanings.ts` content files are ~97 KB each (EN + LT) — loaded client-side
- AstroWheel3D.tsx is ~1900 lines — large single component (mitigated by memo and refs)
- Bloom effect disabled on mobile (width < 768px) for performance
- Background stars skip every other frame on deep/mid layers
- Direct DOM ref updates in useFrame avoid React reconciliation overhead

---

## 16. RECENT CHANGES LOG

### Last Updated: 2026-03-08

| Date | Commit | Change |
|------|--------|--------|
| 2026-03-08 | — | fix: remove toroid form, reposition crystal higher above wheel (Y=1.4) |
| 2026-03-08 | — | feat: Crystalline Core — living 4D energy focal point with element-based form shifting |
| 2026-03-08 | `92d2847` | fix: keep wheel auto-rotation spinning during Cosmic Reading overlay |
| 2026-03-08 | `75d116a` | feat: 3D curved dashed energy arc animations for aspect connections |
| 2026-03-07 | `2a83a44` | fix: animate wheel tilt to default 3D perspective when entering Cosmic Reading |
| 2026-03-07 | `90df42d` | fix: distinguish tap vs drag on planets and zodiac signs — allow wheel spin through interactive elements |
| 2026-03-07 | `81b3983` | fix: disable planet and zodiac taps during Cosmic Reading, auto-close open panels |

---

*This document should be updated whenever changes are made to Astrara. Add entries to the Recent Changes Log section with the date and description of what changed.*
