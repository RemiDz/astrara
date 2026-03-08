# Astrara — Cosmic Reading: Comprehensive UX Overhaul

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## SIX ISSUES TO FIX

1. Wasted space above the wheel (between header and wheel top)
2. Wheel expanding outside mobile screen during reading
3. Visible gap between reading card and Next button
4. Reading card covering too much of the wheel
5. Card fully closes and reopens between phases (jarring)
6. Lithuanian button text wrapping and making buttons oversized

---

## FIX 1 + 2 + 4: Redesign reading layout — compact wheel + smaller card

The core problem is that the reading card takes up too much vertical space, AND the wheel doesn't shrink to accommodate it. We cannot CSS-transform the wheel container (breaks R3F). Instead, we scale the wheel DOWN when reading is active by adjusting its container HEIGHT — the Canvas will naturally adapt.

### 1a. Reduce wheel container height during reading

In `page.tsx`, find the div that wraps `AstroWheel3DWrapper`. It currently has:
```tsx
style={{ height: '95vw', maxHeight: '550px' }}
```

(This is either on the wrapper div or inside AstroWheel3D.tsx's export div.)

When reading is active, reduce this height to make the wheel smaller:

```tsx
const wheelHeight = isReadingActive ? 'min(55vw, 300px)' : 'min(95vw, 550px)'
```

This needs to be passed as a prop or applied via a wrapper. Since the height is set inside `AstroWheel3D.tsx` (line 1781-1792 in the file we reviewed), the cleanest approach is:

**Add a `compact` prop to AstroWheel3DWrapper and AstroWheel3D:**

```typescript
// Add to Props interface:
compact?: boolean
```

In `AstroWheel3D.tsx`, the export component's container div (around line 1780):

```tsx
<div
  className="relative w-full select-none"
  style={{
    height: compact ? 'min(55vw, 300px)' : '95vw',
    maxHeight: compact ? '300px' : '550px',
    overflow: 'visible',
    touchAction: 'none',
    background: 'transparent',
    transition: 'height 0.6s ease-out, max-height 0.6s ease-out',
    // ... keep existing styles
  }}
>
```

The CSS `transition` on height makes the shrink/grow smooth. The R3F Canvas inside will auto-resize because it uses `width: '100%', height: '100%'` on its container.

In `page.tsx`, pass the prop:
```tsx
<AstroWheel3DWrapper
  {...existingProps}
  compact={isReadingActive}
/>
```

To access `isReadingActive` where the wheel is rendered, use the existing ReadingDim pattern or a small context consumer.

### 1b. Remove the gap between header and wheel

The wasted space above the wheel is likely from `py-4` padding on the wheel container and/or margin on `<main>`. When reading is active, reduce this:

Find the div wrapping the wheel (around `<div className="py-4 relative">`). Make the padding conditional:

```tsx
<div className={`relative ${isReadingActive ? 'py-1' : 'py-4'}`} style={{ transition: 'padding 0.4s ease-out' }}>
```

Also check if `<Header />` or `<main>` has padding/margin that creates the gap, and reduce it during reading if so.

### 1c. Do NOT apply CSS transforms to the wheel container

Reiterating: no `translate`, `scale`, or `transform` on the wheel's parent div. Only change `height`, `maxHeight`, and `padding` — these are safe for R3F.

---

## FIX 3: Remove gap between card and Next button

### Problem
The card and the navigation button are in separate absolutely-positioned containers with a visible gap between them showing the app background.

### Solution: Put them back in a single container with a continuous background

```tsx
{/* Single bottom sheet container — card + button together */}
<div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
  <div className="mx-4 rounded-t-2xl overflow-hidden"
    style={{
      background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.95) 0%, rgba(13, 13, 26, 0.98) 100%)',
      border: '1px solid rgba(147, 197, 253, 0.06)',
      borderBottom: 'none',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4)',
    }}
  >
    {/* Scrollable card content */}
    <div className="max-h-[35vh] overflow-y-auto p-5 pb-3 phase-card-scroll">
      {/* Close button — top right inside card */}
      {/* Progress dots */}
      {/* Phase content OR Summary content */}
    </div>

    {/* Navigation button — inside same container, below content */}
    <div className="px-5 pt-2"
      style={{
        paddingBottom: 'max(20px, calc(env(safe-area-inset-bottom, 12px) + 12px))',
      }}
    >
      <PhaseNavigation ... />
    </div>
  </div>
</div>
```

Key points:
- Card content and button are inside ONE visual container with continuous background
- The container has `rounded-t-2xl` (rounded top corners only, flat bottom that extends to screen edge)
- No gap — the glass background flows seamlessly from content to button
- Safe area padding is on the button section inside the container
- Card content scrolls independently, button stays fixed below it

### Update ReadingOverlay.tsx completely:

```tsx
export default function ReadingOverlay() {
  const {
    state, isReadingActive, currentReading, currentPhase,
    currentPhaseIndex, totalPhases, zodiacProfile,
    completeOnboarding, dismissOnboarding, nextPhase, exitReading,
  } = useReadingContext()

  if (state.status === 'ONBOARDING') {
    return (
      <ZodiacSelector
        isOpen={true}
        onClose={dismissOnboarding}
        onSelect={completeOnboarding}
        initialSign={zodiacProfile?.sunSign ?? null}
      />
    )
  }

  if (!isReadingActive) return null

  const showCard = state.status === 'PHASE_ANIMATING' || state.status === 'PHASE_READING' || state.status === 'PHASE_TRANSITIONING'
  const showSummary = state.status === 'SUMMARY'
  const isCardVisible = state.status === 'PHASE_READING'
  const isSummaryVisible = state.status === 'SUMMARY'
  const isLastPhase = currentPhaseIndex >= totalPhases - 1
  const frequencyPhase = currentReading?.phases.find(p => p.type === 'frequency-recommendation')
  const showContent = showCard || showSummary

  if (!showContent) return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)' }}
      />
    </div>
  )

  return (
    <div className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-500 ${
      state.status === 'EXITING' ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Subtle vignette — does not block interaction */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)' }}
      />

      {/* Bottom sheet — single unified container */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <div className="mx-3 rounded-t-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.94) 0%, rgba(10, 10, 20, 0.98) 100%)',
            border: '1px solid rgba(147, 197, 253, 0.08)',
            borderBottom: 'none',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
          }}
        >
          {/* Scrollable content area */}
          <div className="relative max-h-[32vh] overflow-y-auto p-5 pb-3"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`.ro-scroll::-webkit-scrollbar { display: none; }`}</style>

            {/* Close button inside card */}
            <button
              onClick={exitReading}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-white/30 hover:text-white/60 transition-all active:scale-90 z-10"
              aria-label="Close reading"
            >
              <span className="text-xs">✕</span>
            </button>

            {showSummary && currentReading ? (
              <SummaryContent summary={currentReading.summary} frequencyPhase={frequencyPhase} />
            ) : currentPhase ? (
              <PhaseContent
                phase={currentPhase}
                phaseIndex={currentPhaseIndex}
                totalPhases={totalPhases}
              />
            ) : null}
          </div>

          {/* Navigation button — seamlessly below content */}
          {(isCardVisible || isSummaryVisible) && (
            <div className="px-5 pt-2 border-t border-white/5"
              style={{
                paddingBottom: 'max(16px, calc(env(safe-area-inset-bottom, 12px) + 8px))',
              }}
            >
              <PhaseNavigation
                onNext={nextPhase}
                onExit={exitReading}
                isLastPhase={isLastPhase}
                isSummary={showSummary}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**NOTE**: This redesign means the phase content rendering moves INTO ReadingOverlay directly, rather than delegating to PhaseCard.tsx and ReadingSummaryCard.tsx as separate full-card components. Create two simple inline content components:

```tsx
function PhaseContent({ phase, phaseIndex, totalPhases }: { phase: ReadingPhase; phaseIndex: number; totalPhases: number }) {
  return (
    <>
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-3 pr-8">
        {Array.from({ length: totalPhases }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            i === phaseIndex ? 'bg-white/80 scale-125' : i < phaseIndex ? 'bg-white/25' : 'bg-white/8'
          }`} />
        ))}
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        {phase.icon && <span className="text-lg">{phase.icon}</span>}
        <h3 className="text-base font-medium text-white/90">{phase.title}</h3>
      </div>

      {/* Subtitle */}
      {phase.subtitle && (
        <p className="text-xs text-white/35 mb-3">{phase.subtitle}</p>
      )}

      {/* General reading */}
      <p className="text-sm text-white/65 leading-relaxed mb-3">{phase.generalReading}</p>

      {/* Personal reading */}
      {phase.personalReading && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[9px] uppercase tracking-widest text-white/25">For You</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
          <p className="text-sm text-white/50 leading-relaxed italic">{phase.personalReading}</p>
        </>
      )}

      {/* Frequency recommendation */}
      {phase.frequencyRecommendation && (
        <div className="mt-3 p-3 rounded-xl bg-white/3 border border-white/5">
          <div className="text-xs text-white/50">
            🎵 {phase.frequencyRecommendation.hz} Hz — {phase.frequencyRecommendation.name}
          </div>
          {phase.frequencyRecommendation.appLink && (
            <a href={phase.frequencyRecommendation.appLink} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-purple-300/50 hover:text-purple-300/80 mt-1 inline-block">
              Open in Binara →
            </a>
          )}
        </div>
      )}
    </>
  )
}

function SummaryContent({ summary, frequencyPhase }: { summary: CosmicReading['summary']; frequencyPhase?: ReadingPhase }) {
  return (
    <>
      <div className="text-center mb-3">
        <div className="text-white/30 text-[10px] uppercase tracking-widest mb-1">✦ Today's Cosmic Theme</div>
        <h3 className="text-lg font-medium text-white/90">{summary.theme}</h3>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {summary.keywords.map(kw => (
          <span key={kw} className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/4 border border-white/8 text-white/40">
            {kw}
          </span>
        ))}
      </div>

      <p className="text-sm text-white/60 leading-relaxed">{summary.generalSummary}</p>

      {summary.personalSummary && (
        <p className="text-sm text-white/45 leading-relaxed italic mt-2">{summary.personalSummary}</p>
      )}

      {frequencyPhase?.frequencyRecommendation && (
        <div className="mt-3 p-3 rounded-xl bg-white/3 border border-white/5 text-center">
          <div className="text-[10px] uppercase tracking-widest text-white/25 mb-1">Your Frequency</div>
          <div className="text-sm text-white/60">
            🎵 {frequencyPhase.frequencyRecommendation.hz} Hz — {frequencyPhase.frequencyRecommendation.name}
          </div>
          <div className="text-xs text-white/35 mt-0.5">{frequencyPhase.frequencyRecommendation.description}</div>
          {frequencyPhase.frequencyRecommendation.appLink && (
            <a href={frequencyPhase.frequencyRecommendation.appLink} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-purple-300/50 hover:text-purple-300/80 mt-2 inline-block">
              Open in Binara →
            </a>
          )}
        </div>
      )}
    </>
  )
}
```

These render inside the unified bottom sheet. No separate card components needed — keeps the glass background continuous.

---

## FIX 5: Smooth phase transitions — NO close/reopen

### Problem
When user taps "Next ✦", the entire modal closes (fade out) then reopens (fade in) for the next phase. This is disorienting.

### Solution: Keep the bottom sheet open — only transition the CONTENT inside it

The bottom sheet container stays fixed and visible throughout the entire reading. Only the content area inside it fades/transitions between phases.

In ReadingOverlay, the outer container should NOT have any opacity transitions tied to phase changes. The `PHASE_TRANSITIONING` state should only affect the inner content:

```tsx
{/* Content area with per-phase transition */}
<div className={`relative max-h-[32vh] overflow-y-auto p-5 pb-3 transition-opacity duration-300 ${
  state.status === 'PHASE_TRANSITIONING' || state.status === 'PHASE_ANIMATING' ? 'opacity-0' : 'opacity-100'
}`}
  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
>
```

The flow:
1. User taps "Next ✦"
2. State → PHASE_TRANSITIONING: inner content fades to `opacity-0` (300ms)
3. State → PHASE_ANIMATING: content updates to next phase (still `opacity-0`)
4. State → PHASE_READING: content fades to `opacity-1` (300ms)

The bottom sheet container stays fully visible with its glass background the entire time. Only the text content cross-fades. This feels like page-turning, not window-closing.

Also ensure the `transition-opacity duration-500` and `opacity-0` for `EXITING` state is ONLY on the root overlay div, not on the bottom sheet or its children.

### Also: Scroll to top on phase change

When new phase content appears, scroll the content area to the top:

```typescript
const contentRef = useRef<HTMLDivElement>(null)

// When phase changes, scroll to top
useEffect(() => {
  if (contentRef.current && state.status === 'PHASE_READING') {
    contentRef.current.scrollTop = 0
  }
}, [state.status, currentPhaseIndex])
```

Apply `ref={contentRef}` to the scrollable content div.

---

## FIX 6: Lithuanian button text wrapping

### Problem
"Kosminis Skaitymas" and "Saulės sistemos vaizdas" are too long for the button pills, causing text to wrap to two lines and doubling the button height.

### Solution: Use abbreviated text for Lithuanian + make buttons responsive

#### 6a. Add short translation keys

In the i18n translation files, add shorter versions:

**English** (no change needed — already short):
```
'reading.cosmicReadingShort': 'Cosmic Reading'
'helio.solarSystemViewShort': 'Solar System View'
```

**Lithuanian** (abbreviated):
```
'reading.cosmicReadingShort': 'Kosminis'
'helio.solarSystemViewShort': 'Saulės sistema'
```

Wait — even better: check if we can just use `text-xs` or `text-[11px]` to fit the existing text. But "Kosminis Skaitymas" is 19 characters and "Saulės sistemos vaizdas" is 24 characters. These won't fit in a pill button on a 375px wide phone at `text-sm`.

**Better approach: Use icons + shorter text:**

```
EN: "✦ Cosmic Reading"      → stays as-is
LT: "✦ Kosminis"            → drop "Skaitymas"

EN: "☉ Solar System View"   → stays as-is  
LT: "☉ Saulės sistema"      → drop "vaizdas"
```

#### 6b. Update translation keys

Add new short keys or modify existing ones:

```
'reading.cosmicReading': 'Cosmic Reading' (en) / 'Kosminis' (lt)
'helio.solarSystemView': 'Solar System View' (en) / 'Saulės sistema' (lt)
'helio.astroWheelView': 'Astro Wheel View' (en) / 'Astro ratas' (lt)
```

OR if you don't want to change the existing keys (they might be used elsewhere), create mobile-specific short keys and use them in the buttons.

#### 6c. Make buttons use truncation as fallback

Add `whitespace-nowrap` and `overflow-hidden text-ellipsis` to both buttons so text NEVER wraps:

For the Cosmic Reading button (in CosmicReadingButton.tsx or wherever it's rendered):
```tsx
<button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-xs whitespace-nowrap transition-all duration-200 hover:bg-white/10 hover:text-white/90 active:scale-95">
```

Note: changed `text-sm` to `text-xs` and `px-5` to `px-4` for tighter fit.

For the Solar System View button (in page.tsx, around line 404-426):
```tsx
<button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-xs whitespace-nowrap transition-all duration-200 hover:bg-white/10 hover:text-white/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
```

Same changes: `text-xs`, `px-4`, `whitespace-nowrap`.

#### 6d. Test both languages fit on 375px width

After making these changes, verify on a 375px wide screen (iPhone SE / iPhone mini) that both buttons fit side-by-side without wrapping or overflow.

---

## VERIFICATION

### Layout:
- [ ] Wheel shrinks smoothly when reading starts (height transition)
- [ ] Wheel grows back to full size when reading ends
- [ ] No horizontal overflow or clipping of the wheel during reading
- [ ] Gap above wheel is reduced during reading (padding change)
- [ ] Reading card is a unified bottom sheet (card + button, no gap between them)
- [ ] Card content max height is ~32vh — leaves plenty of wheel visible
- [ ] "Next ✦" button always visible above phone bottom bar

### Phase transitions:
- [ ] Bottom sheet stays OPEN between phases (does not close/reopen)
- [ ] Only the text content fades out/in between phases (cross-fade)
- [ ] Content scrolls to top when new phase appears
- [ ] Smooth, not jarring

### Buttons:
- [ ] Lithuanian buttons fit on one line (no text wrapping)
- [ ] English buttons fit on one line
- [ ] Both buttons visible side-by-side on smallest iPhone (375px)
- [ ] Text is legible at the smaller size

### Everything else:
- [ ] Normal app works perfectly when reading is NOT active
- [ ] Wheel interaction restored after reading closes
- [ ] Lithuanian translations still work in reading content
- [ ] Camera animations still work
- [ ] Close ✕ inside card works
- [ ] Progress dots update correctly

---

## TECHNICAL CONSTRAINTS

- **Do NOT use CSS `transform` on the wheel container** — only `height`, `maxHeight`, `padding` are safe
- **The height transition on the wheel container must use CSS `transition` property**, not framer-motion
- **Git push**: `git push origin master:main`
- **No framer-motion** in reading components
- **All scrollbars hidden** (`::-webkit-scrollbar { display: none }` + `scrollbar-width: none`)
- **Glass card**: Do NOT combine `transform: translateZ(0)` + `will-change: transform` + `overflow: hidden` + `isolation: isolate`
