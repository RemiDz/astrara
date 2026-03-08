# Astrara — Cosmic Reading: Phase A — Zodiac Profile + Button

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## MASTER ARCHITECTURE REFERENCE

This spec is Phase A of the Cosmic Reading feature. Before implementing, read the master architecture document at:

**`src/features/cosmic-reading/ARCHITECTURE.md`**

(Copy the master architecture .md file into this path before running this spec. It contains the full state machine, data model, animation contract, component hierarchy, and technical constraints.)

If the architecture doc is not present at that path, check the project root for `astrara-cosmic-reading-master-architecture.md` and copy it to `src/features/cosmic-reading/ARCHITECTURE.md`.

---

## PHASE A SCOPE

This phase creates:
1. Zodiac profile types and localStorage persistence
2. Zodiac Selector modal (onboarding)
3. "✦ Cosmic Reading" button in the view toggle row
4. Integration with existing birth data if available
5. i18n translation keys (EN + LT)

This phase does **NOT** touch:
- The Three.js / R3F scene
- The reading content engine
- The reading overlay / phase cards
- Any animations

---

## STEP 1: Create the feature directory structure

Create these empty directories:
```
src/features/cosmic-reading/
src/features/cosmic-reading/components/
src/features/cosmic-reading/content/
src/features/cosmic-reading/content/templates/
src/features/cosmic-reading/animation/
src/features/cosmic-reading/utils/
```

---

## STEP 2: Create types.ts

**File**: `src/features/cosmic-reading/types.ts`

Define these types (and ONLY these — do not redefine PlanetPosition or AspectData which already exist in `@/lib/astronomy`):

```typescript
export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export interface ZodiacProfile {
  sunSign: ZodiacSign
  birthDate?: string        // ISO date string, optional
  birthTime?: string        // HH:MM, optional
  birthLocation?: {
    lat: number
    lng: number
    name: string
  }
  createdAt: string         // ISO datetime
  updatedAt: string         // ISO datetime
}

// ReadingPhase, CosmicReading, PhaseAnimation types are also defined here
// but are NOT needed until Phase B/C. Add placeholder exports:
// export type ReadingPhase = {} // TODO Phase B
// export type CosmicReading = {} // TODO Phase B
// export type PhaseAnimation = {} // TODO Phase D
```

---

## STEP 3: Create zodiacHelpers.ts

**File**: `src/features/cosmic-reading/utils/zodiacHelpers.ts`

```typescript
import type { ZodiacSign } from '../types'

export const ZODIAC_SIGNS: Record<ZodiacSign, {
  symbol: string
  unicode: string
  element: 'fire' | 'earth' | 'air' | 'water'
  modality: 'cardinal' | 'fixed' | 'mutable'
  ruler: string
  dateRange: string
  colour: string
  startDegree: number
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
}

export const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
]

/** Derive Sun sign from ecliptic longitude (0-360°) */
export function signFromLongitude(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360
  const index = Math.floor(normalized / 30)
  return ZODIAC_ORDER[index]
}

/** Get Whole Sign house number (1-12) for a transit sign relative to user's Sun sign */
export function getHouseForTransit(userSunSign: ZodiacSign, transitSign: ZodiacSign): number {
  const sunIndex = ZODIAC_ORDER.indexOf(userSunSign)
  const transitIndex = ZODIAC_ORDER.indexOf(transitSign)
  return ((transitIndex - sunIndex + 12) % 12) + 1
}
```

---

## STEP 4: Create storage.ts

**File**: `src/features/cosmic-reading/utils/storage.ts`

This handles zodiac profile persistence and integrates with the existing `astrara-birth-data` localStorage key.

```typescript
import type { ZodiacProfile, ZodiacSign } from '../types'

const PROFILE_KEY = 'astrara_zodiac_profile'
const EXISTING_BIRTH_KEY = 'astrara-birth-data'

export function getZodiacProfile(): ZodiacProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    if (saved) return JSON.parse(saved) as ZodiacProfile
  } catch { /* ignore */ }
  return null
}

export function saveZodiacProfile(profile: ZodiacProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

/**
 * Check if the user has existing birth data from the birth chart feature.
 * Returns the stored birth date string if available, null otherwise.
 * The caller can use getPlanetPositions() from @/lib/astronomy to derive the Sun sign.
 */
export function getExistingBirthData(): {
  date: string
  time: string
  city: string
  lat: number
  lng: number
} | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(EXISTING_BIRTH_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

export function clearZodiacProfile(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PROFILE_KEY)
}
```

---

## STEP 5: Create ZodiacSelector.tsx

**File**: `src/features/cosmic-reading/components/ZodiacSelector.tsx`

A modal that lets users pick their Sun sign. Design must match the existing birth chart modal style (see page.tsx lines 633-817 for reference).

Key requirements:
- Full-screen overlay with blurred backdrop (same as existing birth modal)
- Glass card centred on screen
- Title: uses `t('reading.selectSign')` translation key
- 12 zodiac signs in a **4×3 grid** — each sign is a tappable card showing: symbol (large), sign name (below), date range (small, muted)
- Selected sign gets a highlighted border (purple glow, matching app accent)
- Below grid: subtle text link "Or use your birth chart for deeper precision" — if existing birth data found, auto-derive Sun sign and pre-select it
- "Continue ✦" button at bottom (disabled until sign selected)
- Close "✕" button top-right (same style as birth modal close button)
- Mobile handle bar at top (same as birth modal: `<div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />`)

**Styling constraints:**
- Background: `linear-gradient(180deg, rgba(13, 13, 26, 0.92) 0%, rgba(13, 13, 26, 0.97) 100%)`
- Border: `1px solid rgba(147, 197, 253, 0.06)`
- Backdrop filter: `blur(20px)` (both `-webkit-backdrop-filter` and `backdrop-filter`)
- Box shadow: `0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)`
- **DO NOT** put `transform: translateZ(0)`, `will-change: transform`, `overflow: hidden`, AND `isolation: isolate` together on the glass card — this breaks backdrop-filter.
- Use CSS `@keyframes` for entrance animation (slide up), NOT framer-motion
- All inputs: `-webkit-appearance: none`, `appearance: none`, `min-width: 0`

**Props:**
```typescript
interface ZodiacSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (profile: ZodiacProfile) => void
  initialSign?: ZodiacSign | null  // Pre-selected from existing birth data
}
```

**On "Continue ✦" tap:**
1. Create a `ZodiacProfile` object with the selected sign
2. Call `saveZodiacProfile(profile)` from storage.ts
3. Call `onSelect(profile)`
4. Modal closes

---

## STEP 6: Create CosmicReadingButton.tsx

**File**: `src/features/cosmic-reading/components/CosmicReadingButton.tsx`

A button that matches the existing Solar System View toggle button style exactly.

```typescript
interface CosmicReadingButtonProps {
  onClick: () => void
  disabled?: boolean
}
```

**Visual style** — must match this existing button class string:
```
"flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-sm transition-all duration-200 hover:bg-white/10 hover:text-white/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
```

**Content:**
```tsx
<span className="reading-shimmer">✦</span>
<span>{t('reading.cosmicReading')}</span>
```

**CSS shimmer on the ✦:**
Add a subtle CSS keyframe shimmer animation to the ✦ character. Define it in the component using a `<style>` tag or inline in the global CSS. Something like:
```css
@keyframes cosmicShimmer {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; text-shadow: 0 0 8px rgba(167, 139, 250, 0.6); }
}
.reading-shimmer {
  animation: cosmicShimmer 3s ease-in-out infinite;
}
```

---

## STEP 7: Add i18n translation keys

Find the existing translation files (likely in `src/i18n/` directory — check for files like `en.ts`, `lt.ts`, or a translations JSON). Add these new keys:

**English:**
```
'reading.cosmicReading': 'Cosmic Reading'
'reading.selectSign': 'What\'s your Sun sign?'
'reading.selectSignSubtitle': 'Personalise your cosmic reading'
'reading.useBirthChart': 'Or use your birth chart for deeper precision'
'reading.continue': 'Continue ✦'
'reading.next': 'Next ✦'
'reading.close': 'Close ✦'
'reading.forYou': 'For You'
'reading.summary': 'Today\'s Cosmic Theme'
'reading.tapToBegin': 'Tap to begin your reading'
```

**Lithuanian:**
```
'reading.cosmicReading': 'Kosminis Skaitymas'
'reading.selectSign': 'Koks jūsų Saulės ženklas?'
'reading.selectSignSubtitle': 'Personalizuokite savo kosminį skaitymą'
'reading.useBirthChart': 'Arba naudokite gimimo diagramą tikslesniam skaitymui'
'reading.continue': 'Tęsti ✦'
'reading.next': 'Toliau ✦'
'reading.close': 'Uždaryti ✦'
'reading.forYou': 'Jums'
'reading.summary': 'Šiandienos kosminė tema'
'reading.tapToBegin': 'Paspauskite, kad pradėtumėte skaitymą'
```

Also add translation keys for all 12 zodiac signs if they don't already exist (check `t('zodiac.aries')` etc. — they likely DO exist given the birth chart feature uses them).

---

## STEP 8: Integrate into page.tsx

Modify `src/app/page.tsx` to wire everything together.

### 8.1 New imports (add at top of file):

```typescript
import CosmicReadingButton from '@/features/cosmic-reading/components/CosmicReadingButton'
import ZodiacSelector from '@/features/cosmic-reading/components/ZodiacSelector'
import { getZodiacProfile, getExistingBirthData, saveZodiacProfile } from '@/features/cosmic-reading/utils/storage'
import { signFromLongitude } from '@/features/cosmic-reading/utils/zodiacHelpers'
import { getPlanetPositions } from '@/lib/astronomy'
import type { ZodiacProfile, ZodiacSign } from '@/features/cosmic-reading/types'
```

Note: `getPlanetPositions` may already be imported — check and avoid duplicate imports.

### 8.2 New state variables (add inside HomePage component, near other state):

```typescript
const [showZodiacSelector, setShowZodiacSelector] = useState(false)
const [zodiacProfile, setZodiacProfile] = useState<ZodiacProfile | null>(() => {
  return getZodiacProfile()
})
```

### 8.3 Derive initial sign from existing birth data (add a useEffect):

```typescript
// Auto-derive zodiac profile from existing birth chart data if no profile exists
useEffect(() => {
  if (zodiacProfile) return // Already have a profile
  const birthData = getExistingBirthData()
  if (!birthData) return

  try {
    const [year, month, day] = birthData.date.split('-').map(Number)
    const [hours, minutes] = birthData.time.split(':').map(Number)
    const birthDateTime = new Date(year, month - 1, day, hours, minutes)
    const planets = getPlanetPositions(birthDateTime, birthData.lat, birthData.lng)
    const sun = planets.find(p => p.id === 'sun')
    if (sun) {
      const profile: ZodiacProfile = {
        sunSign: sun.zodiacSign as ZodiacSign,
        birthDate: birthData.date,
        birthTime: birthData.time,
        birthLocation: { lat: birthData.lat, lng: birthData.lng, name: birthData.city },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      saveZodiacProfile(profile)
      setZodiacProfile(profile)
    }
  } catch { /* ignore — user can still manually pick sign */ }
}, [zodiacProfile])
```

### 8.4 Handler for Cosmic Reading button tap:

```typescript
const handleCosmicReadingTap = useCallback(() => {
  if (!zodiacProfile) {
    // No profile — show zodiac selector first
    setShowZodiacSelector(true)
  } else {
    // Profile exists — will trigger reading in Phase C
    // For now, just log/track
    trackEvent('cosmic-reading-tap')
    // TODO Phase C: setReadingActive(true) / dispatch START_READING
  }
}, [zodiacProfile])
```

### 8.5 Handler for zodiac profile selection:

```typescript
const handleZodiacSelect = useCallback((profile: ZodiacProfile) => {
  setZodiacProfile(profile)
  setShowZodiacSelector(false)
  trackEvent('zodiac-profile-set', { sign: profile.sunSign })
  // TODO Phase C: automatically start reading after profile set
}, [])
```

### 8.6 Modify the View Toggle row (around line 402-427):

**FIND this block:**
```tsx
{/* View Toggle — below wheel, above day nav */}
<div className="flex justify-center py-2">
  <button
    type="button"
    onClick={() => { ... }}
    ...
  >
    ...Solar System View / Astro Wheel View...
  </button>
</div>
```

**CHANGE the wrapping div to:**
```tsx
<div className="flex justify-center items-center gap-3 py-2">
```

**ADD before the existing button (inside the div):**
```tsx
{viewMode === 'geocentric' && (
  <CosmicReadingButton
    onClick={handleCosmicReadingTap}
    disabled={isTransitioning}
  />
)}
```

The existing Solar System View button remains completely untouched.

### 8.7 Add ZodiacSelector modal (near other modals, around line 630):

```tsx
{/* Zodiac Selector Modal */}
<ZodiacSelector
  isOpen={showZodiacSelector}
  onClose={() => setShowZodiacSelector(false)}
  onSelect={handleZodiacSelect}
  initialSign={zodiacProfile?.sunSign ?? null}
/>
```

---

## STEP 9: Verify

After implementing, verify:

1. `npm run build` completes without errors
2. In geocentric view: "✦ Cosmic Reading" button appears LEFT of "☉ Solar System View" button, same visual style
3. In heliocentric view: "✦ Cosmic Reading" button is hidden
4. Tapping "✦ Cosmic Reading" with no saved profile → Zodiac Selector modal opens
5. Zodiac Selector shows 12 signs in a 4×3 grid
6. Selecting a sign highlights it, enables "Continue ✦" button
7. Tapping "Continue ✦" saves profile to localStorage key `astrara_zodiac_profile` and closes modal
8. Tapping "✦ Cosmic Reading" again (with saved profile) → does NOT reopen modal (future: will start reading)
9. If user previously submitted birth chart data (key `astrara-birth-data` exists), the zodiac profile auto-derives and pre-populates
10. Language toggle works — all new UI text appears in both EN and LT
11. No visual regressions — existing wheel, day nav, cosmic weather, birth chart modal all unchanged
12. Mobile: modal has handle bar, responsive layout, no horizontal overflow
13. The ✦ on the Cosmic Reading button has a subtle shimmer animation

---

## TECHNICAL CONSTRAINTS

- **No framer-motion** in any new component. Use CSS transitions/keyframes only.
- **No `transform: translateZ(0)` + `will-change: transform` + `overflow: hidden` + `isolation: isolate`** together on glass cards.
- **iOS Safari inputs**: `-webkit-appearance: none`, `appearance: none`, `min-width: 0`.
- **All scrollbars hidden**: `::-webkit-scrollbar { display: none }`.
- **Git push**: `git push origin master:main` for Vercel deployment.
- Do NOT modify any Three.js / R3F components in this phase.
- Do NOT create reading content, state machine, or overlay components in this phase.
