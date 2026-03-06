# Astrara — Cosmic Reading: Phase B — Content Engine + Template Library

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## MASTER ARCHITECTURE REFERENCE

Before implementing, read the master architecture document at:
**`src/features/cosmic-reading/ARCHITECTURE.md`**

This spec implements Section 3 (Data Model), Section 5 (Content Engine), and the template library. It builds on Phase A which created the types, zodiac helpers, and storage utils.

---

## PHASE B SCOPE

This phase creates:
1. Full `ReadingPhase`, `CosmicReading`, `PhaseAnimation` type definitions in `types.ts`
2. Template files for Moon, Sun, aspects, retrogrades, houses, and frequencies
3. The `generateReading()` function that consumes existing `useAstroData` output
4. A console-testable pure-function reading engine — no UI changes

This phase does **NOT** touch:
- Any UI components or page.tsx
- The Three.js / R3F scene
- The reading overlay / state machine (Phase C)
- Any animations (Phase D)

---

## STEP 1: Expand types.ts with full ReadingPhase and CosmicReading types

**File**: `src/features/cosmic-reading/types.ts`

Replace the placeholder types from Phase A with the full definitions. Keep the existing `ZodiacSign` and `ZodiacProfile` types untouched. Add:

```typescript
// === CELESTIAL BODY & ASPECT TYPES ===

export type CelestialBodyId =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'

export type AspectType =
  | 'conjunction'     // 0°
  | 'sextile'         // 60°
  | 'square'          // 90°
  | 'trine'           // 120°
  | 'opposition'      // 180°

export type PhaseType =
  | 'moon-phase'
  | 'sun-position'
  | 'planetary-aspect'
  | 'retrograde'
  | 'planetary-highlight'
  | 'frequency-recommendation'
  | 'summary'

// === ANIMATION DIRECTIVES (consumed by Phase D — define shape now) ===

export interface PhaseAnimation {
  camera?: {
    target?: CelestialBodyId
    zoom?: number                // 1.0 = default, 1.5 = closer
    transitionDuration?: number  // ms, default 1500
  }
  highlights?: {
    bodyId: CelestialBodyId
    effect: 'pulse' | 'glow' | 'enlarge'
    color?: string
    intensity?: number           // 0-1, default 0.8
  }[]
  aspectLine?: {
    from: CelestialBodyId
    to: CelestialBodyId
    color: string
    style: 'solid' | 'dashed'
    animateDrawing: boolean
    drawDuration?: number        // ms, default 1000
  }
  dimOthers?: boolean            // default true
  sceneEffect?: {
    type: 'vignette' | 'subtle-particles' | 'none'
    intensity?: number
  }
}

// === READING PHASE ===

export interface ReadingPhase {
  id: string                     // e.g. 'moon-phase', 'sun-sign', 'aspect-mars-venus'
  type: PhaseType
  title: string                  // e.g. "Moon Phase", "The Sun Today"
  subtitle?: string              // e.g. "Waning Gibbous in Libra · 23°"
  icon?: string                  // Emoji or glyph

  // Content
  generalReading: string         // Universal reading text (always shown)
  personalReading?: string       // Sign-specific reading (shown if zodiac profile exists)

  // Animation directives — consumed by Three.js scene in Phase D
  animation: PhaseAnimation

  // Metadata
  celestialData: {
    bodies?: CelestialBodyId[]
    sign?: ZodiacSign
    degree?: number
    aspect?: AspectType
    retrograde?: boolean
  }

  // Sound healing tie-in
  frequencyRecommendation?: {
    hz: number
    name: string
    description: string
    appLink?: string
  }
}

// === COMPLETE READING ===

export interface CosmicReading {
  id: string
  date: string                   // ISO date
  generatedAt: string            // ISO datetime
  phases: ReadingPhase[]
  summary: {
    theme: string                // e.g. "Release & Reflect"
    keywords: string[]
    generalSummary: string
    personalSummary?: string
  }
  meta: {
    totalPhases: number
    estimatedReadingTime: number // Minutes
    zodiacProfile?: ZodiacProfile
  }
}
```

---

## STEP 2: Create frequencyTemplates.ts

**File**: `src/features/cosmic-reading/content/templates/frequencyTemplates.ts`

Planetary frequencies based on Hans Cousto octave calculations. These link to the Harmonic Waves ecosystem (Binara app).

```typescript
import type { CelestialBodyId } from '../../types'

export interface PlanetaryFrequency {
  hz: number
  name: string
  chakra: string
  description: string
  binaraLink: string
}

export const PLANETARY_FREQUENCIES: Record<CelestialBodyId, PlanetaryFrequency> = {
  sun:     { hz: 126.22, name: 'Sun Tone',     chakra: 'Solar Plexus', description: 'Vitality, confidence, core identity',         binaraLink: 'https://binara.app?freq=126.22' },
  moon:    { hz: 210.42, name: 'Moon Tone',     chakra: 'Sacral',       description: 'Emotions, intuition, inner rhythms',          binaraLink: 'https://binara.app?freq=210.42' },
  mercury: { hz: 141.27, name: 'Mercury Tone',  chakra: 'Throat',       description: 'Communication, thought, expression',          binaraLink: 'https://binara.app?freq=141.27' },
  venus:   { hz: 221.23, name: 'Venus Tone',    chakra: 'Heart',        description: 'Love, harmony, beauty, connection',           binaraLink: 'https://binara.app?freq=221.23' },
  mars:    { hz: 144.72, name: 'Mars Tone',     chakra: 'Root',         description: 'Drive, action, physical energy',              binaraLink: 'https://binara.app?freq=144.72' },
  jupiter: { hz: 183.58, name: 'Jupiter Tone',  chakra: 'Crown',        description: 'Expansion, wisdom, abundance',                binaraLink: 'https://binara.app?freq=183.58' },
  saturn:  { hz: 147.85, name: 'Saturn Tone',   chakra: 'Root',         description: 'Structure, discipline, boundaries',           binaraLink: 'https://binara.app?freq=147.85' },
  uranus:  { hz: 207.36, name: 'Uranus Tone',   chakra: 'Third Eye',    description: 'Innovation, awakening, sudden change',        binaraLink: 'https://binara.app?freq=207.36' },
  neptune: { hz: 211.44, name: 'Neptune Tone',  chakra: 'Crown',        description: 'Transcendence, dreams, spiritual connection', binaraLink: 'https://binara.app?freq=211.44' },
  pluto:   { hz: 140.25, name: 'Pluto Tone',    chakra: 'Root',         description: 'Transformation, rebirth, deep power',         binaraLink: 'https://binara.app?freq=140.25' },
}
```

---

## STEP 3: Create houseTemplates.ts

**File**: `src/features/cosmic-reading/content/templates/houseTemplates.ts`

The 12 house meanings — used across all personal reading phases to contextualise which life area a transit activates.

```typescript
export interface HouseTheme {
  area: string
  keywords: string[]
}

export const HOUSE_THEMES: Record<number, HouseTheme> = {
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
}
```

---

## STEP 4: Create moonTemplates.ts

**File**: `src/features/cosmic-reading/content/templates/moonTemplates.ts`

This is the largest template file. It needs:

### 4a. Moon Phase Readings (8 phases)

```typescript
import type { ZodiacSign } from '../../types'

export interface MoonPhaseReading {
  general: string
  themeKeywords: string[]
}

export const MOON_PHASES: Record<string, MoonPhaseReading> = { ... }
```

The 8 phases to cover (match the phase names the existing `useAstroData` hook returns — check `astroData.moon.phase` string format and match exactly):
- **New Moon**: Fresh starts, intention setting, planting seeds. Theme: beginnings.
- **Waxing Crescent**: Building momentum, taking first steps, emerging clarity. Theme: growth.
- **First Quarter**: Action, decisions, overcoming obstacles. Theme: determination.
- **Waxing Gibbous**: Refinement, patience, trust the process. Theme: perseverance.
- **Full Moon**: Culmination, illumination, heightened emotions. Theme: revelation.
- **Waning Gibbous** (Disseminating): Sharing wisdom, gratitude, teaching. Theme: generosity.
- **Last Quarter** (Third Quarter): Release, forgiveness, letting go. Theme: surrender.
- **Waning Crescent** (Balsamic): Rest, reflection, preparation for renewal. Theme: stillness.

Write 3-4 sentences per phase. The language should be warm, accessible to non-astrologers, and practitioner-friendly (imagine a sound healer reading this to a client). Avoid jargon. Speak in terms of energy, feeling, and practical guidance.

### 4b. Moon-in-Sign Readings (12 signs)

```typescript
export interface MoonInSignReading {
  general: string
  themeKeywords: string[]
}

export const MOON_IN_SIGN: Record<ZodiacSign, MoonInSignReading> = { ... }
```

Write 2-3 sentences per sign describing the emotional/energetic quality when the Moon transits that sign. Keep it universal (not personalised — personalisation comes from house overlays in Phase E).

Examples of the tone and style to use:
- Moon in Aries: "The Moon in Aries ignites emotional spontaneity. Bold feelings rise to the surface — this is a time to act on instinct rather than overthink. Emotional courage is available to all."
- Moon in Libra: "The Moon in Libra seeks harmony and balance. Relationships take centre stage — this is a time for meaningful conversations, compromise, and appreciating beauty in your surroundings."

Write ALL 12 signs with this quality of prose.

---

## STEP 5: Create sunTemplates.ts

**File**: `src/features/cosmic-reading/content/templates/sunTemplates.ts`

```typescript
import type { ZodiacSign } from '../../types'

export interface SunInSignReading {
  general: string
  themeKeywords: string[]
}

export const SUN_IN_SIGN: Record<ZodiacSign, SunInSignReading> = { ... }
```

Write 3-4 sentences per sign describing the collective energy when the Sun transits that sign. Focus on themes of identity, vitality, and conscious direction. Same warm, accessible tone.

Example:
- Sun in Pisces: "The Sun in Pisces dissolves boundaries between the seen and unseen. Intuition is heightened, creativity flows freely, and compassion comes naturally. This is a season for dreaming, healing, and connecting to something greater than yourself."

Write ALL 12 signs.

---

## STEP 6: Create aspectTemplates.ts

**File**: `src/features/cosmic-reading/content/templates/aspectTemplates.ts`

This needs readings for the 5 major aspect types, contextualised by which planets are involved.

### 6a. Aspect Type Descriptions

```typescript
import type { AspectType } from '../../types'

export interface AspectTypeDescription {
  name: string
  energy: string        // One-line energy description
  nature: 'harmonious' | 'challenging' | 'neutral'
}

export const ASPECT_DESCRIPTIONS: Record<AspectType, AspectTypeDescription> = {
  conjunction:  { name: 'Conjunction',  energy: 'Fusion — energies merge and amplify',           nature: 'neutral' },
  sextile:      { name: 'Sextile',     energy: 'Opportunity — gentle support and creative flow', nature: 'harmonious' },
  square:       { name: 'Square',      energy: 'Tension — friction that demands action',         nature: 'challenging' },
  trine:        { name: 'Trine',       energy: 'Flow — natural ease and gifts',                  nature: 'harmonious' },
  opposition:   { name: 'Opposition',  energy: 'Polarity — awareness through contrast',          nature: 'challenging' },
}
```

### 6b. Planet Energy Descriptions

```typescript
export interface PlanetEnergy {
  name: string
  domain: string          // What this planet governs
  keywords: string[]
}

export const PLANET_ENERGIES: Record<string, PlanetEnergy> = {
  sun:     { name: 'The Sun',     domain: 'identity, vitality, and conscious will',         keywords: ['self', 'purpose', 'confidence'] },
  moon:    { name: 'The Moon',    domain: 'emotions, instincts, and inner needs',           keywords: ['feelings', 'comfort', 'intuition'] },
  mercury: { name: 'Mercury',     domain: 'communication, thought, and perception',         keywords: ['ideas', 'speech', 'learning'] },
  venus:   { name: 'Venus',       domain: 'love, beauty, and values',                       keywords: ['harmony', 'pleasure', 'connection'] },
  mars:    { name: 'Mars',        domain: 'drive, action, and desire',                      keywords: ['energy', 'courage', 'assertion'] },
  jupiter: { name: 'Jupiter',     domain: 'expansion, wisdom, and abundance',               keywords: ['growth', 'optimism', 'opportunity'] },
  saturn:  { name: 'Saturn',      domain: 'structure, discipline, and responsibility',      keywords: ['boundaries', 'lessons', 'maturity'] },
  uranus:  { name: 'Uranus',      domain: 'innovation, freedom, and sudden change',         keywords: ['awakening', 'rebellion', 'breakthrough'] },
  neptune: { name: 'Neptune',     domain: 'dreams, spirituality, and transcendence',        keywords: ['imagination', 'compassion', 'dissolution'] },
  pluto:   { name: 'Pluto',       domain: 'transformation, power, and deep renewal',        keywords: ['rebirth', 'intensity', 'shadow work'] },
}
```

### 6c. Aspect Reading Generator Function

Instead of writing a unique reading for every planet pair × every aspect type (that would be 45 pairs × 5 aspects = 225 combinations), create a **composable generator function**:

```typescript
export function generateAspectReading(
  planet1Id: string,
  planet2Id: string,
  aspectType: AspectType,
  orb: number
): string { ... }
```

This function should:
1. Look up both planet energies from `PLANET_ENERGIES`
2. Look up the aspect description from `ASPECT_DESCRIPTIONS`
3. Compose a 3-4 sentence reading that:
   - Names both planets and the aspect type
   - Describes what happens when these two planetary energies interact through this geometric relationship
   - Gives practical guidance
   - Notes if the aspect is tight (orb < 2°) meaning it's especially potent

Use template literals to compose. The tone should be: "Today, [Planet1 name] forms a [aspect] with [Planet2 name]. [Aspect energy description]. [What this means in practice]. [Guidance]."

Write at least **5 hardcoded special-case readings** for the most commonly occurring and impactful aspects:
- Sun conjunct Moon (New Moon energy)
- Sun opposition Moon (Full Moon energy)
- Venus conjunct Mars (passion + desire)
- Mercury square Saturn (communication challenges)
- Jupiter trine Sun (expansion + confidence)

For all other combinations, use the composable generator.

---

## STEP 7: Create retrogradeTemplates.ts

**File**: `src/features/cosmic-reading/content/templates/retrogradeTemplates.ts`

```typescript
import type { CelestialBodyId } from '../../types'

export interface RetrogradeReading {
  general: string
  practiceAdvice: string  // What to do during this retrograde
}

export const RETROGRADE_READINGS: Record<CelestialBodyId, RetrogradeReading> = { ... }
```

Write readings for all 10 bodies (even though Sun and Moon don't technically go retrograde — include them with a note that they don't retrograde, so the code handles gracefully if data is unexpected). Focus on the 7 that actually retrograde: Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.

Each entry needs:
- `general`: 2-3 sentences on what this retrograde means energetically
- `practiceAdvice`: 1-2 sentences of practical guidance (e.g. "Review contracts before signing", "Revisit old creative projects")

Mercury retrograde should be the most detailed since it's the most well-known and frequently occurring.

Also create a summary function:

```typescript
export function generateRetrogradeSummary(retrogradeBodyIds: string[]): string { ... }
```

This takes an array of retrograde planet IDs and returns a combined summary paragraph. If multiple planets are retrograde, it should note the collective theme (e.g. "With both Saturn and Pluto in retrograde, deep structural transformation is underway...").

---

## STEP 8: Create generateReading.ts — The Main Engine

**File**: `src/features/cosmic-reading/content/generateReading.ts`

This is the core function that brings everything together. It takes the output of the existing `useAstroData` hook and an optional `ZodiacProfile`, and returns a complete `CosmicReading` object.

### 8a. Input Interface

```typescript
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
```

**CRITICAL**: Import `PlanetPosition` and `AspectData` from `@/lib/astronomy` — these already exist. Do NOT redefine them. Check the exact export names in that file and match them.

The function signature:

```typescript
export function generateCosmicReading(
  astroData: {
    planets: PlanetPosition[]
    moon: {
      phase: string
      illumination: number
      zodiacSign: string
      degreeInSign: number
    }
    notableAspects: AspectData[]
  },
  zodiacProfile?: ZodiacProfile | null
): CosmicReading
```

### 8b. Phase Generation Order

1. **Moon Phase** — always included, always first
   - Use `astroData.moon.phase` to look up from `MOON_PHASES`
   - Use `astroData.moon.zodiacSign` to look up from `MOON_IN_SIGN`
   - Combine both into the `generalReading` text
   - `subtitle`: e.g. "Waning Gibbous in Libra · 23°"
   - `animation`: `{ camera: { target: 'moon', zoom: 1.3 }, highlights: [{ bodyId: 'moon', effect: 'glow', intensity: 0.9 }], dimOthers: true }`

2. **Sun Position** — always included, second
   - Find Sun in `astroData.planets` (id === 'sun')
   - Use Sun's `zodiacSign` to look up from `SUN_IN_SIGN`
   - `animation`: `{ camera: { target: 'sun', zoom: 1.2 }, highlights: [{ bodyId: 'sun', effect: 'glow', intensity: 0.8 }], dimOthers: true }`

3. **Notable Aspects** — dynamic, 0-3 phases
   - Take `astroData.notableAspects.slice(0, 3)`
   - For each, use `generateAspectReading()` from aspectTemplates
   - `animation`: Both planets highlight, aspect line draws between them
   - `animation.aspectLine.color`: use the aspect's existing `colour` property from `AspectData`

4. **Retrogrades** — dynamic, 0-1 phase
   - Filter `astroData.planets.filter(p => p.isRetrograde)`
   - If any found, create ONE combined retrograde phase using `generateRetrogradeSummary()`
   - `animation`: All retrograde planets highlight simultaneously with a slow pulse

5. **Frequency Recommendation** — always included, always last before summary
   - Determine the "dominant" planet: the planet forming the tightest aspect today, or the Moon's ruler if no tight aspects
   - Look up from `PLANETARY_FREQUENCIES`
   - Include `frequencyRecommendation` field with `hz`, `name`, `description`, `appLink`
   - `generalReading`: Describe the recommended frequency and why it's relevant today
   - `animation`: The dominant planet highlights with a special glow

### 8c. Summary Generation

After all phases, generate the summary:

```typescript
function generateSummary(
  phases: ReadingPhase[],
  zodiacProfile?: ZodiacProfile | null
): CosmicReading['summary']
```

- `theme`: Derive from the Moon phase + Sun sign combination. E.g. "Release & Reflect" for Waning Gibbous + Pisces Sun. Create a lookup of theme names for each Moon phase.
- `keywords`: Collect the top 4-5 themeKeywords from across all phases (deduplicated).
- `generalSummary`: 2-3 sentence wrap-up synthesising the overall cosmic weather.
- `personalSummary`: Leave as `undefined` for now — Phase E adds this.

### 8d. Phase ID Convention

Use these ID patterns so Phase C and D can target them:
- `'moon-phase'`
- `'sun-position'`
- `'aspect-{planet1}-{type}-{planet2}'` (e.g. `'aspect-mars-conjunction-venus'`)
- `'retrograde-summary'`
- `'frequency-recommendation'`

---

## STEP 9: Verify

After implementing, verify:

1. `npm run build` completes without errors — no type mismatches, no missing imports
2. The `generateCosmicReading()` function can be called with mock data and returns a valid `CosmicReading` object
3. All template files export their data correctly (no typos in keys, all 12 signs covered in every sign-based template)
4. The aspect reading generator handles all 5 aspect types
5. The retrograde template handles the case where 0 planets are retrograde (no phase generated) and 3+ planets retrograde (combined summary)
6. Frequency recommendation always produces a valid phase with a Binara link
7. The summary `theme` and `keywords` are populated
8. NO changes to page.tsx, no changes to any UI components, no changes to the Three.js scene

### Quick Console Test

Add a temporary test at the bottom of `generateReading.ts` (remove before committing):

```typescript
// TEMPORARY TEST — remove before commit
if (typeof window !== 'undefined' && (window as any).__TEST_READING__) {
  const mockAstroData = {
    planets: [
      { id: 'sun', zodiacSign: 'pisces', degreeInSign: 16, isRetrograde: false, glyph: '☉', colour: '#FFD700', eclipticLongitude: 346, name: 'Sun', signGlyph: '♓' },
      { id: 'moon', zodiacSign: 'libra', degreeInSign: 23, isRetrograde: false, glyph: '☽', colour: '#C0C0C0', eclipticLongitude: 203, name: 'Moon', signGlyph: '♎' },
      { id: 'mars', zodiacSign: 'cancer', degreeInSign: 23, isRetrograde: false, glyph: '♂', colour: '#FF4444', eclipticLongitude: 113, name: 'Mars', signGlyph: '♋' },
      { id: 'saturn', zodiacSign: 'pisces', degreeInSign: 4, isRetrograde: true, glyph: '♄', colour: '#8B7355', eclipticLongitude: 334, name: 'Saturn', signGlyph: '♓' },
    ] as any[],
    moon: { phase: 'Waning Gibbous', illumination: 0.9, zodiacSign: 'libra', degreeInSign: 23 },
    notableAspects: [
      { planet1: 'sun', planet2: 'saturn', type: 'conjunction', orb: 2, planet1Glyph: '☉', planet2Glyph: '♄', symbol: '☌', colour: '#FFD700' },
    ] as any[],
  }
  console.log('TEST READING:', generateCosmicReading(mockAstroData))
}
```

---

## CONTENT QUALITY GUIDELINES

All template text must follow these principles:

1. **Accessible to non-astrologers** — no unexplained jargon. Say "the Moon's energy feels restless and action-oriented" not "the lunar transit squares your natal Mars".
2. **Practitioner-friendly** — sound healers, yoga teachers, and wellness coaches will read this to clients. The language should feel like gentle guidance, not a textbook.
3. **Warm but not fluffy** — grounded, specific, useful. Not vague platitudes. Give people something they can act on or reflect about.
4. **Present tense, second person where appropriate** — "You may feel..." or "This is a time to..." or "Emotions run deep today."
5. **British English spelling** — favour, colour, centre, practise (verb), etc.
6. **2-4 sentences per reading block** — concise but substantive. Not a wall of text.
7. **No exclamation marks** — calm, considered tone.

---

## TECHNICAL CONSTRAINTS

- **No UI changes** in this phase. Pure logic and data only.
- **Import existing types** from `@/lib/astronomy` — check exact export names before importing.
- **No external API calls** — all content is template-based.
- **No framer-motion** usage (not relevant to this phase but noted for consistency).
- **Git push**: `git push origin master:main` for Vercel deployment.
- All files go in `src/features/cosmic-reading/content/` and `src/features/cosmic-reading/content/templates/`.
