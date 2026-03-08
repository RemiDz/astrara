# Astrara — Cosmic Reading: UX Fix — Language, Positioning, Close Button

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## THREE FIXES IN THIS SPEC

1. Reading content not translating to Lithuanian
2. Reading modal positioning — button hidden behind phone bottom bar, wasted space above wheel
3. Close button overlapping settings icon — move inside modal

---

## FIX 1: Reading content must respect language selection

### Problem

When the app is switched to Lithuanian, the reading phase cards still show English text. The template files (`moonTemplates.ts`, `sunTemplates.ts`, `aspectTemplates.ts`, `retrogradeTemplates.ts`) contain only English content. The existing i18n system (`@/i18n/useTranslation` → `t('key')`) is used for UI labels but NOT for reading content.

### Solution

All reading template content needs bilingual support. There are two approaches:

**Option A — Dual-language templates**: Every template entry stores both `en` and `lt` text. The `generateCosmicReading()` function receives the current language and picks the correct text.

**Option B — Translation keys**: Store reading content as i18n keys and resolve them via `t()`.

**Use Option A** — it's self-contained and doesn't bloat the main translation files with hundreds of reading entries.

### Implementation

#### 1a. Update all template interfaces to be bilingual

In every template file, change string fields to `{ en: string; lt: string }`:

```typescript
// Before:
export interface MoonPhaseReading {
  general: string
  themeKeywords: string[]
}

// After:
export interface MoonPhaseReading {
  general: { en: string; lt: string }
  themeKeywords: { en: string[]; lt: string[] }
}
```

Apply this pattern to ALL template interfaces:
- `MoonPhaseReading` in moonTemplates.ts
- `MoonInSignReading` in moonTemplates.ts
- `SunInSignReading` in sunTemplates.ts
- `AspectTypeDescription` in aspectTemplates.ts (the `energy` field)
- `PlanetEnergy` in aspectTemplates.ts (the `domain` field, `keywords` field)
- `RetrogradeReading` in retrogradeTemplates.ts (`general`, `practiceAdvice` fields)
- Personal reading fields (`personalByHouse` entries)

Also update the `generateAspectReading()` and `generateRetrogradeSummary()` functions to accept a `lang` parameter and return the correct language.

#### 1b. Update all template DATA with Lithuanian translations

Write Lithuanian translations for ALL template entries. This is the bulk of the work:

**Moon phases** (8 entries): Translate the general reading text for each moon phase to Lithuanian.

**Moon in sign** (12 entries): Translate each Moon-in-sign general reading.

**Sun in sign** (12 entries): Translate each Sun-in-sign general reading.

**Aspect descriptions** (5 entries): Translate aspect energy descriptions.

**Planet energies** (10 entries): Translate planet domain descriptions.

**Retrograde readings** (8 entries): Translate general + practiceAdvice.

**Personal readings by house** (all personalByHouse entries across all template files): Translate every personal house reading.

**Lithuanian translation guidelines:**
- Use natural, flowing Lithuanian prose — not machine-translated
- Maintain the same warm, practitioner-friendly tone as the English
- Use "jūs" (formal you) consistently
- Astrological terms: keep planet names in Lithuanian (Mėnulis, Saulė, Merkurijus, Venera, Marsas, Jupiteris, Saturnas, Uranas, Neptūnas, Plutonas)
- Zodiac signs in Lithuanian: Avinas, Jautis, Dvyniai, Vėžys, Liūtas, Mergelė, Svarstyklės, Skorpionas, Šaulys, Ožiaragis, Vandenis, Žuvys
- Moon phases in Lithuanian: Jaunatis (New Moon), Priešpilnis (Waxing), Pilnatis (Full Moon), Delčia (Waning)
- House areas in Lithuanian — translate naturally (e.g. "Self & Identity" → "Tapatybė ir savimonė")

#### 1c. Update generateReading.ts to accept language

Modify `generateCosmicReading()` signature:

```typescript
export function generateCosmicReading(
  astroData: AstroDataInput,
  zodiacProfile?: ZodiacProfile | null,
  lang: 'en' | 'lt' = 'en'
): CosmicReading
```

Inside, when reading from templates, select the correct language:

```typescript
const moonPhaseData = MOON_PHASES[moonPhaseName]
const generalText = moonPhaseData.general[lang]
```

Apply this pattern throughout ALL template lookups in the file.

#### 1d. Pass language from ReadingContext

In `ReadingContext.tsx`, the provider needs access to the current language. Update:

```typescript
export function ReadingProvider({
  children,
  astroData,
  lang,
}: {
  children: React.ReactNode
  astroData: AstroDataForReading | null
  lang: 'en' | 'lt'
})
```

Pass `lang` to `generateCosmicReading()`:

```typescript
const reading = generateCosmicReading(astroData, zodiacProfile, lang)
```

#### 1e. Pass language from page.tsx

In page.tsx where `ReadingProvider` is rendered, pass the current language:

```tsx
const { lang } = useLanguage()

<ReadingProvider astroData={readingAstroData} lang={lang}>
```

#### 1f. Also translate static UI text in reading components

Check that these reading component strings use `t()` (they should from Phase C, but verify):
- Phase card title, subtitle
- "For You (Sign)" divider — the sign name should use `t('zodiac.scorpio')` etc.
- "Next ✦", "Close ✦", "Summary ✦" buttons
- Summary card title, frequency section labels
- Progress indicator text

#### 1g. Translate the summary theme and keywords

The summary `theme` (e.g. "Release & Reflect") and `keywords` must also be bilingual. Update `generateSummary()` to produce bilingual output or accept `lang`.

#### 1h. Translate house themes

In `houseTemplates.ts`, make house area names bilingual:

```typescript
export const HOUSE_THEMES: Record<number, {
  area: { en: string; lt: string }
  keywords: { en: string[]; lt: string[] }
}> = {
  1: { area: { en: 'Self & Identity', lt: 'Tapatybė ir savimonė' }, keywords: { en: [...], lt: [...] } },
  // ...
}
```

---

## FIX 2: Reading modal positioning — wheel shift + safe bottom padding

### Problem

The reading card and "Next ✦" button are cut off by the phone's bottom navigation bar / home indicator. There's also wasted vertical space between the page header and the top of the wheel.

### Solution: Shift wheel up + add safe area padding

#### 2a. When reading is active, shift the wheel upward

When reading mode starts, the wheel should translate upward to utilise the dead space above it. This gives more room for the reading card below.

In `page.tsx` or in the component that wraps the wheel, add a conditional CSS transform:

```tsx
<div className={`py-4 relative transition-transform duration-700 ease-out ${
  isReadingActive ? '-translate-y-[60px]' : 'translate-y-0'
}`}>
  <AstroWheel3DWrapper ... />
</div>
```

This slides the wheel up by 60px when reading is active, creating more space for the bottom card. The transition is smooth (700ms).

The value `60px` may need tuning — test on mobile. The goal is to reclaim the gap between the header and wheel top edge without pushing the wheel off-screen.

To access `isReadingActive` in the JSX, use the same approach as the `ReadingDim` wrapper — create a small context consumer component, or check if one already exists.

#### 2b. Add safe area bottom padding to the reading overlay

The "Next ✦" button needs to clear the phone's bottom bar (home indicator on iPhone, nav bar on Android). Use `env(safe-area-inset-bottom)`:

In `ReadingOverlay.tsx`, update the bottom content container:

```tsx
<div className="absolute bottom-0 left-0 right-0 pointer-events-auto"
  style={{ 
    maxHeight: '45vh',
    paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
  }}
>
```

Also update the PhaseNavigation wrapper:

```tsx
<div className="mt-3 px-4 max-w-lg mx-auto"
  style={{
    paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
  }}
>
```

#### 2c. Ensure the HTML viewport respects safe areas

Check `src/app/layout.tsx` (or the root layout) has the viewport meta tag with `viewport-fit=cover`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

If this is set via Next.js metadata, ensure it includes `viewport-fit=cover`. Without this, `env(safe-area-inset-bottom)` returns 0.

#### 2d. Reduce card content height if needed

If the card is still too tall on small phones, reduce `max-h-[40vh]` on PhaseCard to `max-h-[35vh]` and ensure overflow scrolling works.

---

## FIX 3: Move close button inside the reading modal card

### Problem

The close "✕" button is positioned at `absolute top-4 right-4` of the full-screen overlay, which overlaps with the settings gear icon in the page header.

### Solution: Move the close button inside the bottom sheet card area

Remove the close button from `ReadingOverlay.tsx`'s top area. Instead, add it to the top-right of the PhaseCard and ReadingSummaryCard components.

#### 3a. Update ReadingOverlay.tsx

Remove this block:
```tsx
{/* Close button */}
<button
  onClick={exitReading}
  className="absolute top-4 right-4 z-50 ..."
>
  ✕
</button>
```

Instead, pass `onClose={exitReading}` to PhaseCard and ReadingSummaryCard:

```tsx
{showCard && currentPhase ? (
  <PhaseCard
    phase={currentPhase}
    isVisible={isCardVisible}
    phaseIndex={currentPhaseIndex}
    totalPhases={totalPhases}
    onClose={exitReading}
  />
) : null}

{showSummary && currentReading ? (
  <ReadingSummaryCard
    summary={currentReading.summary}
    frequencyPhase={frequencyPhase}
    isVisible={isSummaryVisible}
    onClose={exitReading}
  />
) : null}
```

#### 3b. Update PhaseCard.tsx

Add `onClose` prop and render a close button inside the card, top-right:

```typescript
interface PhaseCardProps {
  phase: ReadingPhase
  isVisible: boolean
  phaseIndex: number
  totalPhases: number
  onClose?: () => void  // NEW
}
```

Inside the card JSX, add before the progress dots:

```tsx
<div className="relative">
  {/* Close button — top right of card */}
  {onClose && (
    <button
      onClick={onClose}
      className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all active:scale-90 z-10"
      aria-label="Close reading"
    >
      <span className="text-sm">✕</span>
    </button>
  )}
  
  {/* Progress dots */}
  <div className="flex items-center gap-1.5 mb-4">
    {/* ... dots ... */}
  </div>
  
  {/* ... rest of card content ... */}
</div>
```

#### 3c. Update ReadingSummaryCard.tsx

Same pattern — add `onClose` prop and render close button inside the card top-right.

---

## VERIFICATION

1. **Language**: Switch to Lithuanian → start a reading → ALL reading text (moon phase, sun, aspects, retrogrades, frequency, personal readings, summary theme, keywords) appears in Lithuanian
2. **Language**: Switch back to English → start a new reading → all text in English
3. **Positioning**: On mobile, the "Next ✦" / "Toliau ✦" button is fully visible above the phone's bottom bar
4. **Positioning**: When reading starts, wheel smoothly shifts up ~60px, creating more space for the card
5. **Positioning**: When reading closes, wheel smoothly returns to original position
6. **Close button**: No "✕" overlapping the settings icon in the header
7. **Close button**: "✕" appears inside the reading card, top-right corner
8. **Close button**: Tapping it exits the reading cleanly
9. **No regressions**: All normal app functionality works (wheel interaction, tooltips, day nav, helio view, settings, audio)

---

## TECHNICAL CONSTRAINTS

- **No framer-motion** in Cosmic Reading components
- **Git push**: `git push origin master:main` for Vercel deployment
- **Glass card rule**: Do NOT combine `transform: translateZ(0)` + `will-change: transform` + `overflow: hidden` + `isolation: isolate`
- **iOS Safari safe areas**: Use `env(safe-area-inset-bottom)` with `viewport-fit=cover`
- **All scrollbars hidden**
- Keep template files well-organised — Lithuanian text alongside English in the same data structure
