# Astrara — Cosmic Reading: Phase C — Reading UI + State Machine

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## MASTER ARCHITECTURE REFERENCE

Before implementing, read the master architecture document at:
**`src/features/cosmic-reading/ARCHITECTURE.md`**

This spec implements Section 2 (State Machine), Section 4.2 (ReadingContext), and Section 7.3–7.5 (UI Design). It builds on Phase A (zodiac selector, button, storage) and Phase B (content engine, templates, types).

---

## PHASE C SCOPE

This phase creates:
1. `useReadingStateMachine.ts` — the state machine reducer and hook
2. `ReadingContext.tsx` — React Context provider wrapping the state machine + reading generation
3. `ReadingOverlay.tsx` — full-screen overlay container
4. `PhaseCard.tsx` — glass card showing reading text per phase
5. `PhaseNavigation.tsx` — progress dots + "Next ✦" / "Close ✦" buttons
6. `ReadingSummaryCard.tsx` — final summary card with theme, keywords, frequency link
7. Integration into `page.tsx` — wiring the context, connecting the button, rendering overlays

This phase does **NOT** touch:
- The Three.js / R3F scene (no planet highlighting, no camera movement — the wheel is a static backdrop)
- Template content (Phase B is complete)
- Animation directives (defined in types but not consumed yet — that's Phase D)

**Deliverable**: User taps "✦ Cosmic Reading" → zodiac selector (if needed) → reading overlay opens → phases step through one by one with "Next ✦" → summary card → "Close ✦" returns to idle. The wheel is visible behind the overlay but does not animate.

---

## STEP 1: Create useReadingStateMachine.ts

**File**: `src/features/cosmic-reading/useReadingStateMachine.ts`

### 1a. State Type

```typescript
export type ReadingState =
  | { status: 'IDLE' }
  | { status: 'ONBOARDING' }
  | { status: 'PREPARING'; phaseIndex: 0 }
  | { status: 'PHASE_ANIMATING'; phaseIndex: number }
  | { status: 'PHASE_READING'; phaseIndex: number }
  | { status: 'PHASE_TRANSITIONING'; phaseIndex: number }
  | { status: 'SUMMARY' }
  | { status: 'EXITING' }
```

### 1b. Action Type

```typescript
export type ReadingAction =
  | { type: 'START_READING' }
  | { type: 'SHOW_ONBOARDING' }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'DISMISS_ONBOARDING' }
  | { type: 'PREPARING_COMPLETE' }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'NEXT_PHASE'; totalPhases: number }
  | { type: 'EXIT_READING' }
  | { type: 'EXIT_COMPLETE' }
```

### 1c. Reducer

```typescript
function readingReducer(state: ReadingState, action: ReadingAction): ReadingState
```

Transition rules (enforce these EXACTLY — invalid transitions return state unchanged, no crashes):

```
IDLE + START_READING           → PREPARING { phaseIndex: 0 }
IDLE + SHOW_ONBOARDING         → ONBOARDING

ONBOARDING + COMPLETE_ONBOARDING → PREPARING { phaseIndex: 0 }
ONBOARDING + DISMISS_ONBOARDING  → IDLE

PREPARING + PREPARING_COMPLETE   → PHASE_ANIMATING { phaseIndex: 0 }

PHASE_ANIMATING + ANIMATION_COMPLETE → PHASE_READING { same phaseIndex }

PHASE_READING + NEXT_PHASE (if phaseIndex < totalPhases - 1) → PHASE_TRANSITIONING { same phaseIndex }
PHASE_READING + NEXT_PHASE (if phaseIndex >= totalPhases - 1) → SUMMARY

PHASE_TRANSITIONING + ANIMATION_COMPLETE → PHASE_ANIMATING { phaseIndex + 1 }

SUMMARY + EXIT_READING         → EXITING

EXITING + EXIT_COMPLETE        → IDLE

// Escape hatch — from ANY non-IDLE state:
ANY + EXIT_READING             → EXITING
```

### 1d. Hook

```typescript
export function useReadingStateMachine() {
  const [state, dispatch] = useReducer(readingReducer, { status: 'IDLE' })
  return { state, dispatch }
}
```

---

## STEP 2: Create ReadingContext.tsx

**File**: `src/features/cosmic-reading/ReadingContext.tsx`

A React Context that wraps:
- The state machine
- The generated `CosmicReading` object
- The zodiac profile
- Convenience methods for the UI to call

### 2a. Context Shape

```typescript
interface ReadingContextValue {
  // State
  state: ReadingState
  isReadingActive: boolean          // state.status !== 'IDLE'
  currentReading: CosmicReading | null
  currentPhase: ReadingPhase | null // phases[state.phaseIndex] when in a phase state
  currentPhaseIndex: number         // -1 when not in a phase
  totalPhases: number

  // Zodiac profile
  zodiacProfile: ZodiacProfile | null
  setZodiacProfile: (profile: ZodiacProfile) => void

  // Actions — these are the ONLY way UI components trigger state changes
  startReading: () => void          // Checks for profile, shows onboarding or starts
  completeOnboarding: (profile: ZodiacProfile) => void
  dismissOnboarding: () => void
  nextPhase: () => void
  exitReading: () => void
}
```

### 2b. Provider Implementation

```typescript
export function ReadingProvider({ children, astroData }: { children: React.ReactNode, astroData: AstroDataForReading | null })
```

**CRITICAL**: The provider needs `astroData` as a prop — this comes from the existing `useAstroData` hook in page.tsx. Define the input type to match what page.tsx provides:

```typescript
// This matches the shape returned by useAstroData in page.tsx
interface AstroDataForReading {
  planets: PlanetPosition[]
  moon: {
    phase: string
    illumination: number
    zodiacSign: string
    degreeInSign: number
  }
  notableAspects: AspectData[]
}
```

Import `PlanetPosition` and `AspectData` from `@/lib/astronomy`.

Inside the provider:

1. Use `useReadingStateMachine()` for state management
2. Store `zodiacProfile` in state, initialised from `getZodiacProfile()` (storage.ts from Phase A)
3. When `startReading()` is called:
   - If no zodiacProfile → dispatch `SHOW_ONBOARDING`
   - If profile exists AND astroData is available → generate reading via `generateCosmicReading(astroData, zodiacProfile)`, store it in state, then dispatch `START_READING`
4. When `completeOnboarding(profile)` is called:
   - Save profile, set state, dispatch `COMPLETE_ONBOARDING`
   - Then generate the reading (same as above) since we now have a profile
5. Derive `currentPhase` from `currentReading.phases[state.phaseIndex]` when state has a `phaseIndex`

**Auto-transitions** (use `useEffect`):
- When state becomes `PREPARING` → after a 400ms delay (brief fade-in moment), dispatch `PREPARING_COMPLETE`
- When state becomes `PHASE_ANIMATING` → since Phase C has no actual animations yet, immediately dispatch `ANIMATION_COMPLETE` after 600ms (simulates animation time — Phase D will replace this with real animation callbacks)
- When state becomes `PHASE_TRANSITIONING` → after 400ms, dispatch `ANIMATION_COMPLETE` (triggers next phase)
- When state becomes `EXITING` → after 500ms, dispatch `EXIT_COMPLETE`

These timeouts give the CSS transitions time to play. In Phase D, the PHASE_ANIMATING timeout will be replaced by actual Three.js animation completion callbacks.

---

## STEP 3: Create PhaseCard.tsx

**File**: `src/features/cosmic-reading/components/PhaseCard.tsx`

The glass card that displays reading content for the current phase.

### Props

```typescript
interface PhaseCardProps {
  phase: ReadingPhase
  isVisible: boolean          // Controls CSS entrance/exit
  phaseIndex: number
  totalPhases: number
}
```

### Layout (matches Section 7.3 of architecture doc)

```
┌──────────────────────────────────────────┐
│ ● ● ● ○ ○ ○                             │  ← Progress dots
│                                          │
│ 🌙 Moon Phase                           │  ← Icon + title
│ Waning Gibbous in Libra · 23°            │  ← Subtitle (from phase.subtitle)
│                                          │
│ [generalReading text flows here...]      │  ← General reading paragraph
│                                          │
│ ── For You (Scorpio) ──                 │  ← Personal section divider (only if personalReading exists)
│ [personalReading text...]               │  ← Personal reading paragraph
│                                          │
│ 🎵 221.23 Hz — Venus Tone              │  ← Frequency recommendation (only if present)
│    Open in Binara →                      │  ← Link to Binara app
│                                          │
└──────────────────────────────────────────┘
```

### Styling

- Glass morphism card: same style as existing CosmicWeather cards and the birth chart modal
- Background: `rgba(13, 13, 26, 0.92)` with `backdrop-filter: blur(20px)`
- Border: `1px solid rgba(147, 197, 253, 0.06)`
- **DO NOT** combine `transform: translateZ(0)` + `will-change: transform` + `overflow: hidden` + `isolation: isolate` on this card
- Rounded corners: `rounded-2xl`
- Padding: `p-6`
- Max height: `max-h-[60vh]` with `overflow-y-auto`
- Hide scrollbar: add `::-webkit-scrollbar { display: none }` and `scrollbar-width: none`

### Progress Dots

Render `totalPhases` dots. Current phase dot is filled (white/90), completed dots are filled (white/30), upcoming dots are outlined (white/10). Use small circles, e.g.:

```tsx
{Array.from({ length: totalPhases }).map((_, i) => (
  <div
    key={i}
    className={`w-2 h-2 rounded-full transition-all duration-300 ${
      i === phaseIndex ? 'bg-white/90 scale-110' :
      i < phaseIndex ? 'bg-white/30' :
      'bg-white/10'
    }`}
  />
))}
```

### Text Rendering

- Phase title: `text-lg font-[family-name:var(--font-display)] text-white/90`
- Subtitle: `text-xs text-white/40`
- General reading: `text-sm text-white/70 leading-relaxed`
- Personal section divider: `text-[10px] uppercase tracking-widest text-white/30` centred with horizontal lines
- Personal reading: `text-sm text-white/60 leading-relaxed italic`
- Frequency block: subtle highlighted box with `bg-white/3 rounded-xl p-3`

### CSS Transitions (entrance/exit)

Use CSS classes controlled by `isVisible` prop:
- Enter: slide up from bottom + fade in (transform: translateY(20px) → translateY(0), opacity: 0 → 1)
- Exit: slide down + fade out
- Duration: 400ms ease-out
- **No framer-motion.**

---

## STEP 4: Create PhaseNavigation.tsx

**File**: `src/features/cosmic-reading/components/PhaseNavigation.tsx`

### Props

```typescript
interface PhaseNavigationProps {
  onNext: () => void
  onExit: () => void
  isLastPhase: boolean
  isSummary: boolean
}
```

### Rendering

- If `isSummary`: show "Close ✦" button only
- If `isLastPhase`: show "Summary ✦" button (calls onNext which transitions to SUMMARY)
- Otherwise: show "Next ✦" button

### Button Style

Same style as the "Continue ✦" button in the Zodiac Selector — a gradient pill:
```
"w-full py-3.5 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 select-none"
```

---

## STEP 5: Create ReadingSummaryCard.tsx

**File**: `src/features/cosmic-reading/components/ReadingSummaryCard.tsx`

### Props

```typescript
interface ReadingSummaryCardProps {
  summary: CosmicReading['summary']
  frequencyPhase?: ReadingPhase    // The frequency recommendation phase (for the Binara link)
  isVisible: boolean
}
```

### Layout

```
┌──────────────────────────────────────────┐
│                                          │
│        ✦ Today's Cosmic Theme            │  ← Title
│           Release & Reflect              │  ← Theme name (large, prominent)
│                                          │
│  [intuition]  [balance]  [creativity]    │  ← Keyword tags (pill badges)
│                                          │
│  [generalSummary paragraph...]           │  ← Summary text
│                                          │
│  ── Your Frequency ──                   │  ← Frequency section (if available)
│  🎵 221.23 Hz — Venus Tone             │
│     Heart-centred resonance              │
│     [Open in Binara →]                   │  ← External link
│                                          │
└──────────────────────────────────────────┘
```

### Keyword Tags

Render as small pill badges:
```tsx
<div className="flex flex-wrap justify-center gap-2">
  {summary.keywords.map(kw => (
    <span key={kw} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/50">
      {kw}
    </span>
  ))}
</div>
```

### Styling

Same glass card style as PhaseCard. Same CSS entrance transition.

---

## STEP 6: Create ReadingOverlay.tsx

**File**: `src/features/cosmic-reading/components/ReadingOverlay.tsx`

This is the container component that orchestrates the reading experience. It renders on top of the wheel as a fixed-position overlay.

### What it does

1. Consumes `ReadingContext` via `useReadingContext()`
2. When `isReadingActive` is true, renders the overlay
3. Shows the close "✕" button top-right
4. Renders either `PhaseCard` or `ReadingSummaryCard` depending on state
5. Renders `PhaseNavigation` at the bottom
6. Applies visual treatment to the page behind (dimming)

### Structure

```tsx
// Only renders when isReadingActive is true
if (!isReadingActive) return null

return (
  <div className="fixed inset-0 z-40">
    {/* Backdrop — semi-transparent dark overlay on the upper portion */}
    {/* This lets the wheel show through but dimmed */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

    {/* Close button — top right */}
    <button
      onClick={exitReading}
      className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all active:scale-90"
      aria-label="Close reading"
    >
      ✕
    </button>

    {/* Content area — positioned at bottom of screen */}
    <div className="absolute bottom-0 left-0 right-0 max-h-[65vh] px-4 pb-6">
      {state.status === 'SUMMARY' ? (
        <ReadingSummaryCard ... />
      ) : currentPhase ? (
        <PhaseCard ... />
      ) : null}

      <div className="mt-4">
        <PhaseNavigation ... />
      </div>
    </div>
  </div>
)
```

### Visual Treatment

The overlay must NOT block the wheel entirely — the user should see the Astro Wheel dimmed behind the reading card. This creates the "stage" effect described in the architecture doc:
- Top ~40% of screen: wheel visible through a subtle dark gradient
- Bottom ~60% of screen: reading card slides up from bottom
- The gradient transition between wheel and card should feel seamless

### Z-index Layering

- ReadingOverlay: `z-40`
- Close button inside overlay: `z-50`
- This must sit ABOVE the wheel but BELOW any existing tooltip (WheelTooltip currently renders — check its z-index and ensure it doesn't conflict)

---

## STEP 7: Integrate into page.tsx

This is the most complex integration step. Work carefully.

### 7a. Import changes

Add at top of page.tsx:

```typescript
import { ReadingProvider, useReadingContext } from '@/features/cosmic-reading/ReadingContext'
import ReadingOverlay from '@/features/cosmic-reading/components/ReadingOverlay'
```

### 7b. Wrap HomePage content with ReadingProvider

The `ReadingProvider` needs `astroData` from the existing `useAstroData` hook. Wrap the main content inside `HomePage`:

```tsx
function HomePage() {
  // ... all existing hooks and state ...
  const astroData = useAstroData(targetDate, lat, lng)

  // Prepare astroData for ReadingProvider (only the fields it needs)
  const readingAstroData = useMemo(() => {
    if (!astroData) return null
    return {
      planets: astroData.planets,
      moon: astroData.moon,
      notableAspects: astroData.notableAspects,
    }
  }, [astroData])

  return (
    <ReadingProvider astroData={readingAstroData}>
      <HomePageInner />   {/* Move all the existing JSX into a child component that can useReadingContext */}
    </ReadingProvider>
  )
}
```

**IMPORTANT**: The reading context needs to be accessible inside the JSX that renders the button and overlay. There are two approaches:

**Option A (preferred)**: Split the JSX into a child component `HomePageInner` that calls `useReadingContext()` and renders everything. The existing state stays in `HomePage` and is passed via props or a second context.

**Option B**: Don't split — instead, pass a ref or callback from ReadingProvider that page.tsx can call. The ReadingOverlay consumes context directly.

**Choose Option B** to minimize refactoring. The approach:
- Keep all existing page.tsx code exactly as-is
- `ReadingProvider` wraps the return JSX (NOT the hooks)
- `ReadingOverlay` is a self-contained component that reads from context
- `CosmicReadingButton` needs access to `startReading()` from context

Since `CosmicReadingButton` is rendered inside the provider's children, it CAN access context. Modify `CosmicReadingButton` to optionally accept an `onClick` prop OR internally call `useReadingContext().startReading`. Choose the prop approach for simplicity — the `handleCosmicReadingTap` in page.tsx (from Phase A) will be updated to call into the reading context.

### 7c. Connect the Cosmic Reading button

Update the `handleCosmicReadingTap` from Phase A. The simplest approach is to create a small bridge component or use a ref:

Actually, the cleanest approach: make `ReadingOverlay` and the button both consume context, but the button's onClick just calls `startReading()` from context. Update `CosmicReadingButton` to accept an `onClick` prop (it already does from Phase A). In page.tsx, change `handleCosmicReadingTap` to call into context.

But since `handleCosmicReadingTap` is defined OUTSIDE the ReadingProvider (it's in HomePage before the return), it can't call useReadingContext(). 

**Solution**: Create a small wrapper component:

```tsx
function CosmicReadingButtonConnected({ disabled }: { disabled?: boolean }) {
  const { startReading } = useReadingContext()
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={startReading}
      disabled={disabled}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-sm transition-all duration-200 hover:bg-white/10 hover:text-white/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="reading-shimmer">✦</span>
      <span>{t('reading.cosmicReading')}</span>
    </button>
  )
}
```

Or more simply: update the existing `CosmicReadingButton` component to internally import and call `useReadingContext()`. This is the cleanest approach since it keeps page.tsx minimal.

### 7d. Render ReadingOverlay

Add `<ReadingOverlay />` inside the ReadingProvider, after the main content:

```tsx
<ReadingProvider astroData={readingAstroData}>
  <div className="min-h-screen relative">
    {/* ... all existing content ... */}
  </div>
  <ReadingOverlay />
</ReadingProvider>
```

### 7e. Handle the ZodiacSelector integration

Phase A already has `showZodiacSelector` state and `handleZodiacSelect` in page.tsx. Now that ReadingContext manages onboarding, we need to bridge them.

**Approach**: ReadingContext manages the onboarding state internally (ONBOARDING state in the machine). The `ZodiacSelector` component should be rendered by `ReadingOverlay` (or by a sibling component inside the provider) and controlled by the reading state, NOT by the old `showZodiacSelector` state in page.tsx.

Update the flow:
1. Remove (or keep as fallback) the standalone `showZodiacSelector` state from page.tsx
2. In `ReadingOverlay` (or a new `ReadingModals` component), render `ZodiacSelector` when `state.status === 'ONBOARDING'`
3. On zodiac selection: call `completeOnboarding(profile)` from context
4. On dismiss: call `dismissOnboarding()` from context

This centralises all reading-related modals within the reading system.

### 7f. Dim existing controls during reading

When `isReadingActive` is true, the date navigation and Solar System View button should fade out. Apply conditional opacity:

Find the View Toggle div and wrap the Solar System View button with a conditional class:

```tsx
<div className={`flex justify-center items-center gap-3 py-2 transition-opacity duration-300 ${isReadingActive ? 'opacity-30 pointer-events-none' : ''}`}>
```

Similarly for the day navigation section.

To access `isReadingActive` in page.tsx's JSX, either:
- Use the wrapper component approach from 7c
- Or create a simple hook consumer component that wraps these sections

The simplest: create a `useReadingActive` hook that just returns the boolean from context, and use it in small wrapper components around the sections that need to dim.

---

## STEP 8: Add remaining i18n keys

Check that these translation keys exist (some were added in Phase A, add any missing):

**English:**
```
'reading.summaryTitle': 'Today\'s Cosmic Theme'
'reading.yourFrequency': 'Your Frequency'
'reading.openInBinara': 'Open in Binara'
'reading.forYouSign': 'For You ({sign})'   // where {sign} is replaced dynamically
'reading.phaseOf': '{current} of {total}'   // e.g. "2 of 6"
```

**Lithuanian:**
```
'reading.summaryTitle': 'Šiandienos kosminė tema'
'reading.yourFrequency': 'Jūsų dažnis'
'reading.openInBinara': 'Atidaryti Binara'
'reading.forYouSign': 'Jums ({sign})'
'reading.phaseOf': '{current} iš {total}'
```

---

## STEP 9: Verify

After implementing, verify:

1. `npm run build` completes without errors
2. **Full reading flow** works end-to-end:
   - Tap "✦ Cosmic Reading" with no profile → Zodiac Selector appears (from ReadingContext ONBOARDING state)
   - Select a sign → reading generates and first phase appears
   - Phase card shows: progress dots, icon, title, subtitle, general reading text
   - Tap "Next ✦" → transitions to next phase (with brief CSS transition between cards)
   - Progress through all phases → "Summary ✦" on last phase
   - Summary card shows: theme title, keyword pills, summary text, frequency recommendation with Binara link
   - Tap "Close ✦" → overlay exits, returns to normal wheel view
3. Tap "✦ Cosmic Reading" with existing profile → skips selector, goes straight to reading
4. Tap "✕" close button at any point during reading → exits cleanly to IDLE
5. **No visual regressions**: wheel, day nav, cosmic weather, birth chart modal, tooltips all work normally when reading is NOT active
6. During reading: day nav and Solar System View button are dimmed (opacity: 0.3, pointer-events: none)
7. The wheel is visible behind the overlay (dimmed through gradient backdrop)
8. Mobile: reading card doesn't overflow, scrollable if content is long, no horizontal overflow
9. Language toggle: all reading text keys work in both EN and LT
10. **Z-index**: reading overlay doesn't conflict with WheelTooltip or other modals
11. If `astroData` is null (still loading), the Cosmic Reading button should be disabled

---

## TECHNICAL CONSTRAINTS

- **No framer-motion** in any new component. CSS transitions/keyframes only.
- **No `transform: translateZ(0)` + `will-change: transform` + `overflow: hidden` + `isolation: isolate`** together on glass cards — breaks `backdrop-filter`.
- **iOS Safari**: `-webkit-appearance: none`, `appearance: none`, `min-width: 0` on any inputs.
- **All scrollbars hidden**.
- **Void-black background** elements.
- **Git push**: `git push origin master:main` for Vercel deployment.
- Do NOT modify any Three.js / R3F components in this phase.
- Do NOT modify template content from Phase B.
- The auto-transition timeouts (400ms, 600ms, 500ms) are temporary placeholders. Phase D will replace the PHASE_ANIMATING timeout with real animation callbacks.
