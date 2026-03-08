# ASTRARA — Cosmic Reading: Master Architecture Document

> **Purpose**: This is the single source of truth for the Cosmic Reading feature. Every CC phase spec MUST reference this document. No structural decisions should be made outside of it. CC must not deviate from the patterns, interfaces, data shapes, or component boundaries defined here.

---

## 0. EXISTING CODEBASE REFERENCE

This section documents the actual current architecture so CC understands what it's building on top of.

### 0.1 Tech Stack (from package.json)

- **Next.js 16.1.6** (App Router, `'use client'` pages)
- **React 19.2.3** / **React DOM 19.2.3**
- **Three.js 0.183.2** via **@react-three/fiber 9.5.0** + **@react-three/drei 10.7.7**
- **@react-three/postprocessing 3.0.4**
- **astronomy-engine 2.1.19**
- **framer-motion 12.34.5** ← NOTE: already installed in the project. The "no framer-motion" rule applies to NEW Cosmic Reading components only. Do NOT use framer-motion in any Cosmic Reading code. Use CSS transitions.
- **Tailwind CSS v4** (CSS-based config via `@tailwindcss/postcss`, no tailwind.config.js)
- **react-markdown + remark-gfm** (for rendered markdown content)
- **TypeScript 5**

### 0.2 Key Existing Modules (import paths from page.tsx)

| Import | What It Does |
|--------|-------------|
| `@/i18n/LanguageContext` | `LanguageProvider` + `useLanguage` — provides `lang` ('en' / 'lt') |
| `@/i18n/useTranslation` | `useTranslation` → `t('key')` for all UI strings |
| `@/hooks/useRealTime` | Returns `now` (Date), updates every 60s |
| `@/hooks/useLocation` | Returns `{ location, loading, setLocation }` — user's geolocation |
| `@/hooks/useAstroData` | Returns `{ planets, aspects, moon, notableAspects }` for given date/lat/lng |
| `@/hooks/useEarthData` | Returns `{ earthData, loading }` — kpIndex, solarFlare data |
| `@/audio/useCosmicAudio` | Audio system — planet/sign tap sounds, rotation sound |
| `@/lib/astronomy` | `getPlanetPositions()` → `PlanetPosition[]`, `AspectData` types |
| `@/lib/heliocentric` | `calculateAllHelioData()` for Solar System View |
| `@/lib/aspects` | `calculateAspects()` from planet positions |
| `@/lib/location` | `searchCity()` for birth city autocomplete |
| `@/components/AstroWheel/AstroWheel3DWrapper` | Main R3F wheel — accepts planets, aspects, settings, view mode |
| `@/components/AstroWheel/WheelTooltip` | Planet/sign/aspect detail popover |
| `@/components/CosmicWeather/CosmicWeather` | Below-wheel cosmic weather cards (moon, aspects, etc.) |
| `@/components/EarthPanel/EarthPanel` | Earth data slide-out panel |
| `@/components/Header/Header` | Top header with date, audio, settings buttons |
| `@/components/AboutModal/AboutModal` | About overlay |
| `@/components/SettingsPanel/SettingsPanel` | Settings panel (planet scale, rotation speed, immersive universe, rotation sound) |
| `@/components/ui/Shimmer` | Loading skeleton |

### 0.3 Existing State in page.tsx (HomePage component)

Key state variables the reading system must coexist with:

```
dayOffset (number)              — day offset from today
customDate (Date | null)        — custom date override
viewMode ('geocentric' | 'heliocentric') — current view
isTransitioning (boolean)       — view transition in progress
tooltip (TooltipData)           — planet/sign/aspect tooltip
selectedPlanet (string | null)  — highlighted planet
settings (AstraraSettings)      — user settings (planetScale, rotationSpeed, etc.)
showBirthInput (boolean)        — birth chart modal visibility
birthDate / birthTime / etc.    — birth chart form state
autoplayDirection (AutoplayDir) — helio view time controls
animationTimeRef / animationSpeedRef — helio continuous time animation
```

### 0.4 Existing UI Layout (top to bottom)

```
<CosmicBackground />                    ← Starfield / immersive universe bg
<Header />                              ← Date, audio toggle, about, settings
<main>
  <AstroWheel3DWrapper />               ← The R3F Canvas (3D wheel)
  [Helio label toggle button]           ← Conditional, helio view only
  [View Toggle row]                     ← Single "Solar System View" / "Astro Wheel View" button, centred
  [Day Navigation]                      ← Yesterday/Today/Tomorrow (geocentric) OR time scrub (helio)
  [Birth Chart CTA]                     ← "✦ Discover Your Cosmic Portrait →" link
  <CosmicWeather />                     ← Moon phase card, aspect cards, etc.
  <footer />
</main>
<WheelTooltip />                        ← Detail popover (fixed position)
<EarthPanel />                          ← Slide-out panel
<AboutModal />                          ← About overlay
<SettingsPanel />                       ← Settings overlay
[Birth Details Modal]                   ← Birth chart input form (modal)
```

### 0.5 Critical: The View Toggle Button Row (line 402-427)

Currently this is a single `<div className="flex justify-center py-2">` containing ONE button that toggles between "☉ Solar System View" and "✦ Astro Wheel View". The Cosmic Reading button will be ADDED to this same flex container, to the LEFT of the existing toggle button.

### 0.6 Critical: useAstroData Already Provides What We Need

`useAstroData(targetDate, lat, lng)` returns `planets` (PlanetPosition[]), `aspects` (AspectData[]), `moon`, and `notableAspects`. The content engine should consume this EXISTING data rather than recalculating from scratch. The `PlanetPosition` type from `@/lib/astronomy` already includes `zodiacSign`, `degreeInSign`, `isRetrograde`, `glyph`, `signGlyph`, `colour`, etc.

### 0.7 Critical: Birth Chart Data Already Exists

The app already has a birth chart modal with date/time/city input, planet position calculation, and aspect display. The zodiac profile for Cosmic Reading should REUSE the existing `astrara-birth-data` localStorage key if present, and the Zodiac Selector can offer a "quick pick" (Sun sign only) OR link to the existing birth chart flow for full precision.

---

## 1. FEATURE OVERVIEW

### 1.1 What It Is

Cosmic Reading is a phase-by-phase, animated, cinematic transit reading that plays out directly on the existing Astro Wheel. The wheel becomes a stage — planets highlight, camera shifts, aspect lines draw — while glass-card overlays present interpretive text the user reads at their own pace.

### 1.2 Two Reading Modes

| Mode | Input Required | Content | Tier |
|------|---------------|---------|------|
| **General Reading** | None | Universal transit themes — what the sky is doing today | Free |
| **Personal Reading** | Sun sign OR birth date | General + per-sign house-based interpretation for each phase | Pro (future) |

### 1.3 User Journey

```
User lands on Astrara
  → Sees Astro Wheel (existing)
  → Sees "✦ Cosmic Reading" button (new, left of "Solar System View")
  → Taps it
  → IF no zodiac profile saved:
      → Zodiac Selector modal appears
      → User picks Sun sign (quick) OR enters birth date (precise)
      → Profile saved to localStorage
  → Reading Mode activates
  → Phase 1 plays (animation + card)
  → User reads, taps "Next ✦"
  → Phase 2 plays...
  → ... continues through all phases
  → Summary phase
  → User taps "Close" or it auto-returns
  → Wheel returns to idle state
```

---

## 2. STATE MACHINE

This is the core control system. Everything — animations, UI overlays, camera behaviour — is driven by this state machine.

### 2.1 States

```typescript
type ReadingState =
  | { status: 'IDLE' }                                          // Normal wheel operation
  | { status: 'ONBOARDING' }                                    // Zodiac selector modal open
  | { status: 'PREPARING'; phaseIndex: 0 }                      // Brief transition into reading mode
  | { status: 'PHASE_ANIMATING'; phaseIndex: number }           // Animation playing for current phase
  | { status: 'PHASE_READING'; phaseIndex: number }             // Animation complete, card visible, waiting for user
  | { status: 'PHASE_TRANSITIONING'; phaseIndex: number }       // Animating out before next phase
  | { status: 'SUMMARY' }                                       // All phases done, summary card shown
  | { status: 'EXITING' }                                       // Returning wheel to idle state
```

### 2.2 Transitions

```
IDLE → ONBOARDING                    (user taps "Cosmic Reading" + no profile saved)
IDLE → PREPARING                     (user taps "Cosmic Reading" + profile exists)
ONBOARDING → PREPARING               (user saves zodiac profile)
ONBOARDING → IDLE                    (user dismisses modal)
PREPARING → PHASE_ANIMATING          (auto, after brief fade/dim)
PHASE_ANIMATING → PHASE_READING      (auto, when animation completes)
PHASE_READING → PHASE_TRANSITIONING  (user taps "Next ✦")
PHASE_TRANSITIONING → PHASE_ANIMATING (auto, phaseIndex increments)
PHASE_READING → SUMMARY              (user taps "Next ✦" on final phase)
SUMMARY → EXITING                    (user taps "Close ✦")
EXITING → IDLE                       (auto, after exit animation)

// Escape hatch — available in ANY reading state:
ANY_READING_STATE → EXITING          (user taps "✕" close button)
```

### 2.3 State Machine Implementation

```typescript
// File: src/features/cosmic-reading/useReadingStateMachine.ts

import { useReducer, useCallback } from 'react';

interface ReadingAction =
  | { type: 'START_READING' }
  | { type: 'SHOW_ONBOARDING' }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'DISMISS_ONBOARDING' }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'NEXT_PHASE' }
  | { type: 'EXIT_READING' }
  | { type: 'EXIT_COMPLETE' }

// Reducer enforces valid transitions only.
// Invalid transitions are silently ignored — no crashes.
```

---

## 3. DATA MODEL

### 3.1 Zodiac Profile (User Input)

```typescript
// File: src/features/cosmic-reading/types.ts

interface ZodiacProfile {
  sunSign: ZodiacSign;            // Always present
  birthDate?: string;             // ISO date string, optional (enables precise house calc)
  birthTime?: string;             // HH:MM, optional (future: enables Ascendant calc)
  birthLocation?: {               // Optional (future: enables precise house calc)
    lat: number;
    lng: number;
    name: string;
  };
  createdAt: string;              // ISO datetime
  updatedAt: string;              // ISO datetime
}

type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';
```

**Storage**: `localStorage` key `astrara_zodiac_profile`. JSON stringified.

### 3.2 Reading Phase Schema

Every reading phase — regardless of whether it's Moon, Sun, aspect, or summary — conforms to this single schema. This allows the reading engine, animation controller, and UI renderer to be fully decoupled.

```typescript
// File: src/features/cosmic-reading/types.ts

interface ReadingPhase {
  id: string;                      // e.g. 'moon-phase', 'sun-sign', 'aspect-mars-venus'
  type: PhaseType;
  title: string;                   // e.g. "Moon Phase", "The Sun Today", "Mars meets Venus"
  icon?: string;                   // Emoji or icon identifier

  // Content
  generalReading: string;          // Universal reading text (always shown)
  personalReading?: string;        // Sign-specific reading (shown if zodiac profile exists)

  // Animation directives — consumed by the Three.js scene
  animation: PhaseAnimation;

  // Metadata
  celestialData: {
    bodies?: CelestialBodyId[];    // Which planets are involved
    sign?: ZodiacSign;             // Zodiac sign context (e.g. Moon in Libra)
    degree?: number;               // Degree position
    aspect?: AspectType;           // If this phase is about an aspect
    retrograde?: boolean;          // Is the primary body retrograde
  };

  // Sound healing tie-in (Harmonic Waves ecosystem link)
  frequencyRecommendation?: {
    hz: number;                    // e.g. 221.23
    name: string;                  // e.g. "Venus Frequency"
    description: string;           // e.g. "Heart-centred resonance"
    appLink?: string;              // e.g. "https://binara.app?freq=221.23"
  };
}

type PhaseType =
  | 'moon-phase'
  | 'sun-position'
  | 'planetary-aspect'
  | 'retrograde'
  | 'planetary-highlight'
  | 'frequency-recommendation'
  | 'summary';

type CelestialBodyId =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

type AspectType =
  | 'conjunction'     // 0°
  | 'sextile'         // 60°
  | 'square'          // 90°
  | 'trine'           // 120°
  | 'opposition';     // 180°
```

### 3.3 Complete Reading Structure

```typescript
interface CosmicReading {
  id: string;                       // Unique reading ID
  date: string;                     // ISO date
  generatedAt: string;              // ISO datetime
  phases: ReadingPhase[];           // Ordered array of phases
  summary: {
    theme: string;                  // e.g. "Release & Reflect"
    keywords: string[];             // e.g. ["intuition", "balance", "creativity"]
    generalSummary: string;         // Wrap-up paragraph
    personalSummary?: string;       // Sign-specific wrap-up
  };
  meta: {
    totalPhases: number;
    estimatedReadingTime: number;   // Minutes
    zodiacProfile?: ZodiacProfile;  // Snapshot of profile used
  };
}
```

### 3.4 Whole Sign House System (for Personal Readings)

For Sun-sign-based personal readings (without birth time), we use the **Whole Sign House System**. This is standard astrological practice for horoscope-style readings:

```typescript
// The user's Sun sign = their 1st house
// Each subsequent sign = next house number
// Example: Sun in Scorpio → Scorpio = 1st house, Sagittarius = 2nd, Capricorn = 3rd, etc.

function getHouseForTransit(userSunSign: ZodiacSign, transitSign: ZodiacSign): number {
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  const sunIndex = signs.indexOf(userSunSign);
  const transitIndex = signs.indexOf(transitSign);
  return ((transitIndex - sunIndex + 12) % 12) + 1;  // 1-indexed house number
}

// House meanings (for reading text generation):
const HOUSE_THEMES: Record<number, { area: string; keywords: string[] }> = {
  1:  { area: 'Self & Identity',              keywords: ['appearance', 'new beginnings', 'personal energy'] },
  2:  { area: 'Finances & Values',            keywords: ['money', 'self-worth', 'material security'] },
  3:  { area: 'Communication & Learning',     keywords: ['conversations', 'short trips', 'siblings', 'ideas'] },
  4:  { area: 'Home & Family',                keywords: ['roots', 'emotional foundation', 'private life'] },
  5:  { area: 'Creativity & Joy',             keywords: ['romance', 'children', 'self-expression', 'play'] },
  6:  { area: 'Health & Daily Routine',       keywords: ['wellness', 'work habits', 'service', 'healing'] },
  7:  { area: 'Relationships & Partnerships', keywords: ['one-on-one connections', 'marriage', 'collaboration'] },
  8:  { area: 'Transformation & Depth',       keywords: ['shared resources', 'intimacy', 'rebirth', 'mystery'] },
  9:  { area: 'Exploration & Wisdom',         keywords: ['travel', 'philosophy', 'higher learning', 'expansion'] },
  10: { area: 'Career & Public Image',        keywords: ['ambition', 'reputation', 'achievement', 'authority'] },
  11: { area: 'Community & Vision',           keywords: ['friendships', 'groups', 'hopes', 'humanitarian goals'] },
  12: { area: 'Spirituality & Surrender',     keywords: ['solitude', 'subconscious', 'rest', 'transcendence'] },
};
```

---

## 4. ANIMATION CONTRACT

This is the critical interface between the reading system and the existing Three.js / React Three Fiber scene. **The reading system NEVER directly manipulates Three.js objects.** It communicates exclusively through this contract.

### 4.1 Animation Directive Shape

```typescript
// File: src/features/cosmic-reading/types.ts

interface PhaseAnimation {
  // Camera control
  camera?: {
    target?: CelestialBodyId;      // Camera looks at this body
    zoom?: number;                 // Zoom level (1.0 = default, 1.5 = closer)
    transitionDuration?: number;   // ms, defaults to 1500
  };

  // Planet highlighting
  highlights?: {
    bodyId: CelestialBodyId;
    effect: 'pulse' | 'glow' | 'enlarge';
    color?: string;                // Override glow colour
    intensity?: number;            // 0-1, defaults to 0.8
  }[];

  // Aspect line drawing (for planetary aspect phases)
  aspectLine?: {
    from: CelestialBodyId;
    to: CelestialBodyId;
    color: string;
    style: 'solid' | 'dashed';
    animateDrawing: boolean;       // If true, line draws progressively
    drawDuration?: number;         // ms, defaults to 1000
  };

  // Dim non-highlighted bodies
  dimOthers?: boolean;             // Defaults to true — non-highlighted planets dim to 30% opacity

  // Scene-wide effects
  sceneEffect?: {
    type: 'vignette' | 'subtle-particles' | 'none';
    intensity?: number;
  };
}
```

### 4.2 How the Wheel Consumes Directives

The existing wheel scene receives animation directives via React Context — NOT through prop drilling.

```typescript
// File: src/features/cosmic-reading/ReadingContext.tsx

interface ReadingContextValue {
  state: ReadingState;
  currentPhase: ReadingPhase | null;
  currentAnimation: PhaseAnimation | null;
  isReadingActive: boolean;         // Convenience: state.status !== 'IDLE'

  // Controls (consumed by UI)
  startReading: () => void;
  nextPhase: () => void;
  exitReading: () => void;

  // Zodiac profile
  zodiacProfile: ZodiacProfile | null;
  setZodiacProfile: (profile: ZodiacProfile) => void;
}
```

**Inside the Three.js scene**, a hook reads from this context:

```typescript
// Used inside the R3F Canvas — reads animation directives reactively
function useReadingAnimation() {
  const { currentAnimation, isReadingActive } = useReadingContext();
  // Returns processed values the scene can use:
  // - which bodies to highlight (with their effect params)
  // - camera target position
  // - aspect line geometry
  // - dim opacity for non-highlighted bodies
  // When isReadingActive is false, returns all defaults (no highlights, default camera, no lines)
}
```

### 4.3 Critical Constraint: No Scene Refactoring

The existing planet components, orbit rings, zodiac signs, and camera controller MUST NOT be refactored. The animation system works by:

1. **Adding** a highlight layer (glow mesh / emissive material boost) to each planet component, controlled by a `highlightState` prop derived from context.
2. **Adding** an optional `AspectLineOverlay` component to the scene that renders aspect lines when directives request them.
3. **Wrapping** the existing camera controller with a reading-mode override that smoothly transitions to directive-specified positions, then hands control back when reading exits.

No existing component signatures change. New behaviour is additive only.

---

## 5. CONTENT ENGINE

### 5.1 Template-Based Generation (Phase A–E)

For the initial implementation, all reading content is generated from templates. No AI API calls required.

**CRITICAL**: The content engine consumes data from the EXISTING `useAstroData` hook, which already returns `planets` (PlanetPosition[]), `aspects` (AspectData[]), `moon`, and `notableAspects`. Do NOT recalculate planetary positions — use what's already computed.

```typescript
// File: src/features/cosmic-reading/content/generateReading.ts

import type { PlanetPosition, AspectData } from '@/lib/astronomy'

interface AstroDataInput {
  planets: PlanetPosition[];       // From existing useAstroData hook
  aspects: AspectData[];           // From existing useAstroData hook
  moon: {                          // From existing useAstroData hook
    phase: string;
    illumination: number;
    zodiacSign: string;
    degreeInSign: number;
  };
  notableAspects: AspectData[];    // From existing useAstroData hook
}

function generateCosmicReading(
  astroData: AstroDataInput,
  zodiacProfile?: ZodiacProfile
): CosmicReading {
  const phases: ReadingPhase[] = [];

  // 1. Always: Moon Phase
  phases.push(generateMoonPhase(astroData.moon, astroData.planets, zodiacProfile));

  // 2. Always: Sun Position
  const sun = astroData.planets.find(p => p.id === 'sun')!;
  phases.push(generateSunPhase(sun, zodiacProfile));

  // 3. Dynamic: Major Aspects (use existing notableAspects, max 3)
  for (const aspect of astroData.notableAspects.slice(0, 3)) {
    phases.push(generateAspectPhase(aspect, zodiacProfile));
  }

  // 4. Dynamic: Retrogrades (filter planets where isRetrograde === true)
  const retrogrades = astroData.planets.filter(p => p.isRetrograde);
  if (retrogrades.length > 0) {
    phases.push(generateRetrogradeSummaryPhase(retrogrades, zodiacProfile));
  }

  // 5. Always: Frequency Recommendation (Harmonic Waves tie-in)
  phases.push(generateFrequencyPhase(astroData));

  return {
    id: `reading-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    generatedAt: new Date().toISOString(),
    phases,
    summary: generateSummary(phases, zodiacProfile),
    meta: {
      totalPhases: phases.length,
      estimatedReadingTime: Math.ceil(phases.length * 1.5),
      zodiacProfile: zodiacProfile ?? undefined,
    },
  };
}
```

### 5.2 Existing Data Types (from @/lib/astronomy — DO NOT REDEFINE)

The existing `PlanetPosition` type already provides everything the content engine needs:

```typescript
// These types ALREADY EXIST in @/lib/astronomy — DO NOT create new versions
// PlanetPosition includes:
//   id: string              — e.g. 'sun', 'moon', 'mars'
//   name: string            — e.g. 'Sun', 'Moon', 'Mars'
//   glyph: string           — planet symbol
//   signGlyph: string       — zodiac sign symbol
//   zodiacSign: string      — e.g. 'pisces', 'libra'
//   degreeInSign: number    — 0-29
//   eclipticLongitude: number — 0-360
//   isRetrograde: boolean
//   colour: string          — hex colour

// AspectData includes:
//   planet1: string, planet2: string
//   planet1Glyph: string, planet2Glyph: string
//   type: string            — 'conjunction', 'trine', 'square', etc.
//   symbol: string          — aspect symbol
//   orb: number             — degrees from exact
//   colour: string

// The content engine imports and uses these types directly.
// Only the ReadingPhase and CosmicReading types (Section 3) are new.
```

### 5.2b Aspect Significance Ranking (for selecting which to include)

### 5.3 Template Library Structure

```typescript
// File: src/features/cosmic-reading/content/templates/

// templates/moonTemplates.ts     — Moon phase + Moon-in-sign readings
// templates/sunTemplates.ts      — Sun-in-sign readings
// templates/aspectTemplates.ts   — Aspect interpretations per planet pair
// templates/retrogradeTemplates.ts — Retrograde interpretations per planet
// templates/houseTemplates.ts    — How transits affect each house (for personal readings)
// templates/frequencyTemplates.ts — Planetary frequency mappings

// Each template file exports a lookup map:
// Example from moonTemplates.ts:

export const MOON_IN_SIGN: Record<ZodiacSign, {
  general: string;
  themeKeywords: string[];
  personalByHouse: Record<number, string>;  // House number → personal reading text
}> = {
  aries: {
    general: "The Moon in Aries ignites emotional spontaneity. Bold feelings rise to the surface — this is a time to act on instinct rather than overthink. Emotional courage is available to all.",
    themeKeywords: ['initiative', 'courage', 'impulse', 'fresh starts'],
    personalByHouse: {
      1: "With the Aries Moon lighting up your 1st house of Self, you may feel an unusual surge of personal confidence. Trust your instincts about who you are and what you want.",
      2: "The Aries Moon activates your 2nd house of Finances. An impulsive purchase could tempt you — channel this energy into bold financial moves you've been postponing.",
      // ... houses 3-12
    },
  },
  // ... all 12 signs
};
```

### 5.4 Planetary Frequency Mapping (Harmonic Waves Integration)

Based on the planetary frequency tradition (Hans Cousto octave calculations):

```typescript
export const PLANETARY_FREQUENCIES: Record<CelestialBodyId, {
  hz: number;
  name: string;
  chakra: string;
  description: string;
  binariLink: string;
}> = {
  sun:     { hz: 126.22, name: 'Sun Tone',     chakra: 'Solar Plexus', description: 'Vitality, confidence, core identity',          binariLink: 'https://binara.app?freq=126.22' },
  moon:    { hz: 210.42, name: 'Moon Tone',    chakra: 'Sacral',       description: 'Emotions, intuition, inner rhythms',           binariLink: 'https://binara.app?freq=210.42' },
  mercury: { hz: 141.27, name: 'Mercury Tone', chakra: 'Throat',       description: 'Communication, thought, expression',           binariLink: 'https://binara.app?freq=141.27' },
  venus:   { hz: 221.23, name: 'Venus Tone',   chakra: 'Heart',        description: 'Love, harmony, beauty, connection',            binariLink: 'https://binara.app?freq=221.23' },
  mars:    { hz: 144.72, name: 'Mars Tone',    chakra: 'Root',         description: 'Drive, action, physical energy',               binariLink: 'https://binara.app?freq=144.72' },
  jupiter: { hz: 183.58, name: 'Jupiter Tone', chakra: 'Crown',        description: 'Expansion, wisdom, abundance',                 binariLink: 'https://binara.app?freq=183.58' },
  saturn:  { hz: 147.85, name: 'Saturn Tone',  chakra: 'Root',         description: 'Structure, discipline, boundaries',            binariLink: 'https://binara.app?freq=147.85' },
  uranus:  { hz: 207.36, name: 'Uranus Tone',  chakra: 'Third Eye',    description: 'Innovation, awakening, sudden change',         binariLink: 'https://binara.app?freq=207.36' },
  neptune: { hz: 211.44, name: 'Neptune Tone', chakra: 'Crown',        description: 'Transcendence, dreams, spiritual connection',  binariLink: 'https://binara.app?freq=211.44' },
  pluto:   { hz: 140.25, name: 'Pluto Tone',   chakra: 'Root',         description: 'Transformation, rebirth, deep power',          binariLink: 'https://binara.app?freq=140.25' },
};
```

---

## 6. COMPONENT ARCHITECTURE

### 6.1 New File Structure

```
src/features/cosmic-reading/
├── types.ts                          # New TypeScript interfaces (ReadingPhase, CosmicReading, ZodiacProfile, PhaseAnimation)
├── ReadingContext.tsx                 # React Context provider + state machine
├── useReadingStateMachine.ts         # State machine reducer + hook
│
├── components/
│   ├── CosmicReadingButton.tsx       # "✦ Cosmic Reading" button (geocentric view only)
│   ├── ZodiacSelector.tsx            # Onboarding modal (sign picker + optional birth date link)
│   ├── ReadingOverlay.tsx            # Full-screen overlay container during reading
│   ├── PhaseCard.tsx                 # Glass card showing reading text for current phase
│   ├── PhaseNavigation.tsx           # "Next ✦" / "Close ✦" / progress dots
│   └── ReadingSummaryCard.tsx        # Summary card at end of reading
│
├── content/
│   ├── generateReading.ts            # Main reading generator — consumes useAstroData output
│   └── templates/
│       ├── moonTemplates.ts          # Moon phase + Moon-in-sign readings (general + per-house)
│       ├── sunTemplates.ts           # Sun-in-sign readings (general + per-house)
│       ├── aspectTemplates.ts        # Aspect interpretations per planet pair + type
│       ├── retrogradeTemplates.ts    # Retrograde interpretations per planet
│       ├── houseTemplates.ts         # House theme descriptions (shared reference)
│       └── frequencyTemplates.ts     # Planetary frequency mappings (Harmonic Waves tie-in)
│
├── animation/                        # Phase D only — do not create until Phase D
│   ├── useReadingAnimation.ts        # Hook for Three.js scene to consume directives
│   ├── PlanetHighlight.tsx           # R3F component: glow/pulse overlay on planets
│   ├── AspectLineOverlay.tsx         # R3F component: draws aspect lines between planets
│   └── ReadingCameraController.tsx   # Wraps existing camera with reading-mode overrides
│
└── utils/
    ├── zodiacHelpers.ts              # Sign ↔ degree conversion, house calculation, sign data
    └── storage.ts                    # localStorage wrapper for zodiac profile + integration with existing astrara-birth-data
```

**NOTE**: There is NO `planetaryState.ts` or `aspectCalculator.ts` — the existing `useAstroData` hook and `@/lib/aspects` already handle all astronomical calculations. The content engine takes their output directly.

### 6.2 Component Hierarchy (mapped to actual page.tsx)

```
<Page>
  <LanguageProvider>                                ← EXISTING (page.tsx line 824)
    <ReadingProvider>                               ← NEW: wraps HomePage
      <HomePage>
        <CosmicBackground />                        ← EXISTING: untouched
        <Header />                                  ← EXISTING: untouched
        <main>
          <AstroWheel3DWrapper                      ← EXISTING: internal mods in Phase D only
            planets={astroData.planets}
            aspects={astroData.aspects}
            ... existing props ...
            readingAnimation={fromContext}           ← NEW PROP (Phase D): animation directives
          />

          {/* View Toggle Row — MODIFIED (line 402-427) */}
          <div className="flex justify-center items-center gap-3 py-2">
            <CosmicReadingButton />                 ← NEW (Phase A)
            <ExistingSolarSystemToggle />            ← EXISTING: untouched
          </div>

          {/* Day Navigation */}                     ← EXISTING: untouched (line 429-543)
          {/* Birth Chart CTA */}                    ← EXISTING: untouched (line 545-554)

          <CosmicWeather />                          ← EXISTING: untouched
          <footer />                                 ← EXISTING: untouched
        </main>

        <WheelTooltip />                             ← EXISTING: untouched
        <EarthPanel />                               ← EXISTING: untouched
        <AboutModal />                               ← EXISTING: untouched
        <SettingsPanel />                            ← EXISTING: untouched

        {/* NEW — Cosmic Reading overlays */}
        <ZodiacSelector />                           ← NEW (Phase A): modal
        <ReadingOverlay>                             ← NEW (Phase C): full reading experience
          <PhaseCard />
          <PhaseNavigation />
          <ReadingSummaryCard />
        </ReadingOverlay>
      </HomePage>
    </ReadingProvider>
  </LanguageProvider>
</Page>
```

### 6.3 What Gets Modified vs. What's New

| Component | Status | Change |
|-----------|--------|--------|
| `page.tsx` HomePage | **MODIFIED** | Wrap with `<ReadingProvider>`, add `<CosmicReadingButton>` to view toggle row, add `<ZodiacSelector>` + `<ReadingOverlay>` modals |
| View Toggle `<div>` (line 403) | **MODIFIED** | Add gap, insert `CosmicReadingButton` before existing toggle button |
| `AstroWheel3DWrapper` | **MODIFIED (Phase D only)** | Accept optional `readingAnimation` prop to pass through to internal scene components |
| Internal planet components in R3F | **MODIFIED (Phase D only)** | Accept optional highlight state. When undefined, render exactly as before |
| Existing camera controller | **UNTOUCHED** | Reading camera is a separate additive component |
| `CosmicWeather`, `Header`, all other components | **UNTOUCHED** | No changes |
| All new reading components | **NEW** | See file structure in Section 6.1 |

### 6.4 Integration with Existing Birth Chart Data

The app already stores birth data in `localStorage` key `astrara-birth-data` (JSON with date, time, city, lat, lng). The Cosmic Reading zodiac profile system should:

1. On first launch, check if `astrara-birth-data` exists in localStorage.
2. If it does, extract the Sun sign from the stored birth date using `getPlanetPositions()` from `@/lib/astronomy` and pre-populate the zodiac profile.
3. If it doesn't, show the Zodiac Selector modal for quick Sun sign selection.
4. The zodiac profile (`astrara_zodiac_profile`) is a SEPARATE localStorage key — it stores the derived Sun sign and optionally links back to full birth data.

### 6.5 Integration with Existing i18n System

All new user-facing strings MUST be added to the existing translation system (`@/i18n/`). New translation keys should follow the existing pattern:

```typescript
// Example new keys to add:
'reading.cosmicReading'          // "Cosmic Reading" / "Kosminis Skaitymas"
'reading.next'                   // "Next ✦"
'reading.close'                  // "Close ✦"
'reading.forYou'                 // "For You"
'reading.summary'                // "Summary"
'reading.selectSign'             // "What's your Sun sign?"
'reading.enterBirthDate'         // "Or enter your birth date for a deeper reading"
'reading.continue'               // "Continue ✦"
// ... etc for all phase titles, house descriptions
```

---

## 7. UI DESIGN SPECIFICATIONS

### 7.1 Button Row Layout — Modification of Existing View Toggle

The existing View Toggle (line 402-427 in page.tsx) is currently:

```tsx
{/* View Toggle — below wheel, above day nav */}
<div className="flex justify-center py-2">
  <button> ... Solar System View / Astro Wheel View ... </button>
</div>
```

**Change to:**

```tsx
{/* View Toggle + Cosmic Reading — below wheel, above day nav */}
<div className="flex justify-center items-center gap-3 py-2">
  <CosmicReadingButton />                          {/* NEW — left side */}
  <button> ... Solar System View / Astro Wheel View ... </button>  {/* EXISTING — unchanged */}
</div>
```

- The Cosmic Reading button is ONLY visible in geocentric view (it doesn't apply to heliocentric).
- When `viewMode === 'heliocentric'`, the Cosmic Reading button hides, leaving only the existing toggle.
- Both buttons share the same visual style: `rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-sm`.
- `CosmicReadingButton` has a subtle CSS shimmer on the ✦ icon (keyframe animation, no framer-motion).

### 7.2 Zodiac Selector Modal

- **Trigger**: First tap on "Cosmic Reading" when no profile exists.
- **Layout**: Full-screen overlay with glass card centre.
- **Content**:
  - Title: "What's your Sun sign?"
  - 12 zodiac sign icons in a 4×3 grid, each tappable.
  - Below grid: "Or enter your birth date for a deeper reading" → expandable date picker.
  - "Continue ✦" button (disabled until sign selected).
- **Design**: Void-black backdrop with blur, glass card, zodiac icons in their traditional colours.
- **No framer-motion.** Use CSS transitions (opacity, transform) for entrance/exit.

### 7.3 Phase Card (Reading Overlay)

- **Position**: Slides up from bottom of screen over the wheel. Wheel remains visible above the card (approximately 60% wheel, 40% card on mobile).
- **Glass morphism**: Same style as existing Moon Phase card.
- **Content layout**:
  ```
  ┌──────────────────────────────────┐
  │ ● ● ● ○ ○ ○                     │  ← Progress dots (current phase highlighted)
  │                                  │
  │ 🌙 Moon Phase                   │  ← Phase icon + title
  │ Waning Gibbous in Libra · 23°    │  ← Celestial data subtitle
  │                                  │
  │ [General reading text paragraph   │
  │  flows here naturally...]        │
  │                                  │
  │ ── For You (Scorpio) ──         │  ← Personal section (if profile exists)
  │ [Personal reading text...]       │
  │                                  │
  │              [Next ✦]            │  ← Navigation button
  └──────────────────────────────────┘
  ```
- **Scrollable** if content exceeds card height.
- **CSS transitions** for card entrance (slide up) and exit (slide down).

### 7.4 Summary Card

- Same glass card style.
- Shows: Theme title, keyword tags, summary paragraphs (general + personal).
- Frequency recommendation with link to Binara/relevant app.
- "Close ✦" button returns to idle.

### 7.5 Reading Mode Visual Treatment

While reading is active:
- Date navigation (Yesterday/Today/Tomorrow) **fades out** (pointer-events: none, opacity: 0.3).
- Solar System View button **fades out**.
- A subtle vignette darkens the screen edges.
- The "✕" close button appears top-right of the overlay.

---

## 8. ASPECT CALCULATION LOGIC

### 8.1 How Aspects Are Detected

```typescript
// File: src/features/cosmic-reading/content/aspectCalculator.ts

const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
};

const ASPECT_ORBS: Record<AspectType, number> = {
  conjunction: 8,
  sextile: 6,
  square: 8,
  trine: 8,
  opposition: 8,
};

// Check all unique planet pairs (excluding Earth)
// For each pair, calculate angular separation on ecliptic
// If separation is within orb of any aspect angle, record it
// Sort by tightest orb first (most exact aspects are most significant)
// Return top 3 for reading inclusion
```

### 8.2 Aspect Significance Ranking

For selecting which aspects to include in a reading:

1. **Luminaries involved** (Sun/Moon aspects rank highest)
2. **Tightest orb** (closer to exact = more potent)
3. **Hard aspects first** (conjunction > opposition > square > trine > sextile)
4. **Slow planet involvement** (Saturn, Jupiter aspects more significant than Mercury, Venus)

---

## 9. BUILD PHASES (CC Spec Extraction Guide)

Each phase below becomes a separate CC spec file. Each spec MUST open with the auto-accept directive and reference this master architecture document.

### Phase A: Foundation — Zodiac Profile + Button Layout
**Scope**: `ZodiacSelector`, `CosmicReadingButton`, button row modification, localStorage persistence, `ZodiacProfile` type, `storage.ts`.
**Does NOT touch**: Three.js scene, reading content, animations.
**Deliverable**: User can set their Sun sign, it persists, new button appears in row.

### Phase B: Content Engine — Reading Generator + Templates
**Scope**: `generateReading.ts`, `planetaryState.ts`, `aspectCalculator.ts`, all template files, `types.ts` (ReadingPhase, CosmicReading shapes).
**Does NOT touch**: Any UI components, Three.js scene, animations.
**Deliverable**: A pure function that takes the current date/time and optional zodiac profile, returns a fully structured `CosmicReading` object. Testable via console.

### Phase C: Reading UI — Overlay, Phase Cards, Navigation
**Scope**: `ReadingContext.tsx`, `useReadingStateMachine.ts`, `ReadingOverlay.tsx`, `PhaseCard.tsx`, `PhaseNavigation.tsx`, `ReadingSummaryCard.tsx`.
**Does NOT touch**: Three.js scene (no animation yet — cards appear but no planet highlighting).
**Deliverable**: User can tap "Cosmic Reading", step through phases with Next, see reading text, reach summary, close. Wheel is static behind the overlay.

### Phase D: Cinematic Animations — Scene Integration
**Scope**: `useReadingAnimation.ts`, `PlanetHighlight.tsx`, `AspectLineOverlay.tsx`, `ReadingCameraController.tsx`. Modifications to existing planet components (add `highlightState` prop).
**Does NOT touch**: Reading content, template text, UI overlay layout.
**Deliverable**: When reading plays, planets highlight, camera moves, aspect lines draw. Full cinematic experience.

### Phase E: Personal Readings — House-Based Interpretations
**Scope**: `houseTemplates.ts` (full 12×12 matrix — 12 signs × 12 houses), personal reading text generation in `generateReading.ts`, "For You" section in `PhaseCard.tsx`.
**Does NOT touch**: Three.js scene, animation system, state machine.
**Deliverable**: Users with a zodiac profile see personalised house-based reading text in each phase card.

---

## 10. TECHNICAL CONSTRAINTS & RULES

1. **No framer-motion.** All animations use CSS transitions or Three.js native (useFrame, lerp, springs via @react-three/drei).
2. **No scene refactoring.** Existing R3F components are modified minimally (additive props only).
3. **Git push**: `git push origin master:main` for Vercel deployment.
4. **iOS Safari**: All new inputs must include `-webkit-appearance: none`, `appearance: none`, `min-width: 0`.
5. **Glass card transparency**: Do NOT use `transform: translateZ(0)`, `will-change: transform`, `overflow: hidden`, `isolation: isolate` together on glass cards — this breaks `backdrop-filter`.
6. **All scrollbars hidden** (`::-webkit-scrollbar { display: none }`).
7. **Void-black background** (`#000000` or equivalent).
8. **No external API calls** for content in Phases A–E. Template-based only.
9. **EN/LT language support**: All new user-facing strings must go through the existing i18n system (if present) or be structured for future localisation.
10. **PWA compatibility**: New features must work offline once the app shell is cached.

---

## 11. FUTURE ENHANCEMENTS (Post Phase E — NOT for CC yet)

These are documented for architectural awareness but are NOT to be implemented in Phases A–E:

- **AI-generated readings** via Claude API — pass planetary state, receive narrative prose.
- **Birth time + Ascendant** — enables true house system (Placidus), much deeper personalisation.
- **Reading history** — save past readings, track cosmic themes over time.
- **Audio narration** — text-to-speech or pre-recorded narration for each phase.
- **Share reading** — generate a beautiful image/card for social sharing.
- **Ambient sound** — subtle cosmic background audio during reading (tie-in with Sonarus).
- **Pro tier gating** — personal readings behind LemonSqueezy paywall.

---

## APPENDIX A: Zodiac Sign Reference Data

```typescript
export const ZODIAC_SIGNS: Record<ZodiacSign, {
  symbol: string;
  unicode: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  ruler: CelestialBodyId;
  dateRange: string;           // Display only, e.g. "Mar 21 – Apr 19"
  colour: string;              // Hex colour for UI
  startDegree: number;         // Ecliptic longitude where sign begins
}> = {
  aries:       { symbol: '♈', unicode: '\u2648', element: 'fire',  modality: 'cardinal', ruler: 'mars',    dateRange: 'Mar 21 – Apr 19',  colour: '#FF4444', startDegree: 0 },
  taurus:      { symbol: '♉', unicode: '\u2649', element: 'earth', modality: 'fixed',    ruler: 'venus',   dateRange: 'Apr 20 – May 20',  colour: '#4CAF50', startDegree: 30 },
  gemini:      { symbol: '♊', unicode: '\u264A', element: 'air',   modality: 'mutable',  ruler: 'mercury', dateRange: 'May 21 – Jun 20',  colour: '#FFEB3B', startDegree: 60 },
  cancer:      { symbol: '♋', unicode: '\u264B', element: 'water', modality: 'cardinal', ruler: 'moon',    dateRange: 'Jun 21 – Jul 22',  colour: '#B0BEC5', startDegree: 90 },
  leo:         { symbol: '♌', unicode: '\u264C', element: 'fire',  modality: 'fixed',    ruler: 'sun',     dateRange: 'Jul 23 – Aug 22',  colour: '#FF9800', startDegree: 120 },
  virgo:       { symbol: '♍', unicode: '\u264D', element: 'earth', modality: 'mutable',  ruler: 'mercury', dateRange: 'Aug 23 – Sep 22',  colour: '#8D6E63', startDegree: 150 },
  libra:       { symbol: '♎', unicode: '\u264E', element: 'air',   modality: 'cardinal', ruler: 'venus',   dateRange: 'Sep 23 – Oct 22',  colour: '#E91E8C', startDegree: 180 },
  scorpio:     { symbol: '♏', unicode: '\u264F', element: 'water', modality: 'fixed',    ruler: 'pluto',   dateRange: 'Oct 23 – Nov 21',  colour: '#880E4F', startDegree: 210 },
  sagittarius: { symbol: '♐', unicode: '\u2650', element: 'fire',  modality: 'mutable',  ruler: 'jupiter', dateRange: 'Nov 22 – Dec 21',  colour: '#9C27B0', startDegree: 240 },
  capricorn:   { symbol: '♑', unicode: '\u2651', element: 'earth', modality: 'cardinal', ruler: 'saturn',  dateRange: 'Dec 22 – Jan 19',  colour: '#455A64', startDegree: 270 },
  aquarius:    { symbol: '♒', unicode: '\u2652', element: 'air',   modality: 'fixed',    ruler: 'uranus',  dateRange: 'Jan 20 – Feb 18',  colour: '#00BCD4', startDegree: 300 },
  pisces:      { symbol: '♓', unicode: '\u2653', element: 'water', modality: 'mutable',  ruler: 'neptune', dateRange: 'Feb 19 – Mar 20',  colour: '#7E57C2', startDegree: 330 },
};
```

---

*End of Master Architecture Document. All CC phase specs derive from this document.*
