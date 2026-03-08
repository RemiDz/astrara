# Astrara — Cosmic Reading: Layout Fix V2 — Remove Wheel Shift + Fix Bottom Button

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## PROBLEMS

1. **Wheel shifting is broken** — the CSS translate approach causes the wheel to move erratically (shifts right, gets clipped by container, moves down on phase transitions). This approach is fundamentally flawed because the R3F Canvas does not respond well to parent container transforms.
2. **"Toliau ✦" button still hidden** — `env(safe-area-inset-bottom)` is either not being applied correctly or is insufficient for the Safari mobile bottom bar.

---

## FIX 1: REMOVE ALL WHEEL SHIFTING

The wheel shift was a bad idea — R3F Canvas containers don't play well with CSS transforms applied to parent elements. It causes the Three.js raycasting and coordinate system to go out of sync, which explains the horizontal drift and clipping.

### 1a. Find and remove the wheel shift

Search the codebase for any `translate-y`, `-translate-y`, `translateY`, or similar transform applied to the wheel container when reading is active. This was added in the previous UX fix spec. Remove it completely.

Specifically, look in:
- `page.tsx` — the `<div>` wrapping `<AstroWheel3DWrapper />`  (around the `py-4 relative` div)
- Any component that wraps the wheel and applies conditional transforms based on `isReadingActive`

**Restore the wheel container to its original, unconditional styling:**
```tsx
<div className="py-4 relative">
  <AstroWheel3DWrapper ... />
</div>
```

No conditional classes. No transforms. The wheel stays exactly where it always was.

### 1b. Remove any `transition-transform` classes on the wheel container

Remove any `transition-transform duration-700 ease-out` or similar that was added to the wheel wrapper.

---

## FIX 2: FIX THE BOTTOM BUTTON VISIBILITY

The "Toliau ✦" / "Next ✦" button must be fully visible and tappable on all mobile devices, including iPhones with the home indicator bar and Safari's bottom toolbar.

### 2a. Check viewport-fit=cover is set

In `src/app/layout.tsx`, verify the viewport meta includes `viewport-fit=cover`. In Next.js App Router, this is typically set via the `viewport` export:

```typescript
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',  // CRITICAL for env(safe-area-inset-bottom) to work
}
```

Or if using a `<meta>` tag directly:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

If `viewport-fit=cover` is NOT set, `env(safe-area-inset-bottom)` will always return `0px` and the fix won't work. This is the most likely reason the previous fix didn't work.

### 2b. Restructure ReadingOverlay bottom section

The issue is that the PhaseNavigation button sits inside a `max-h-[45vh]` container at `absolute bottom-0`, but the button itself gets pushed below the visible area by the card content above it.

**New approach**: Separate the card content from the navigation button. The button should be in a FIXED position at the very bottom of the screen, NOT inside the scrollable card area.

Update `ReadingOverlay.tsx`:

```tsx
return (
  <div className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-500 ${
    state.status === 'EXITING' ? 'opacity-0' : 'opacity-100'
  }`}>
    {/* Subtle vignette */}
    <div className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
      }}
    />

    {/* Card content area — sits above the fixed button */}
    <div className="absolute left-0 right-0 pointer-events-auto px-4"
      style={{
        bottom: 'calc(64px + env(safe-area-inset-bottom, 20px))',
        maxHeight: '45vh',
      }}
    >
      {showSummary && currentReading ? (
        <ReadingSummaryCard
          summary={currentReading.summary}
          frequencyPhase={frequencyPhase}
          isVisible={isSummaryVisible}
          onClose={exitReading}
        />
      ) : showCard && currentPhase ? (
        <PhaseCard
          phase={currentPhase}
          isVisible={isCardVisible}
          phaseIndex={currentPhaseIndex}
          totalPhases={totalPhases}
          onClose={exitReading}
        />
      ) : null}
    </div>

    {/* Navigation button — FIXED at very bottom, always visible */}
    {(isCardVisible || isSummaryVisible) && (
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto px-4"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 8px)',
        }}
      >
        <div className="max-w-lg mx-auto">
          <PhaseNavigation
            onNext={nextPhase}
            onExit={exitReading}
            isLastPhase={isLastPhase}
            isSummary={showSummary}
          />
        </div>
      </div>
    )}
  </div>
)
```

Key changes:
- The card content area is positioned ABOVE the button area (using `bottom: calc(64px + env(safe-area-inset-bottom, 20px))` — 64px for the button height + safe area)
- The navigation button is in a SEPARATE absolutely positioned container at `bottom: 0` with safe area padding
- The button is ALWAYS at the screen bottom, never pushed off by card content

### 2c. Fallback for browsers that don't support env()

Some older browsers don't support `env(safe-area-inset-bottom)`. Add a fallback:

```css
padding-bottom: 28px;  /* fallback */
padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 8px);  /* modern */
```

In Tailwind/JSX inline styles, you can do:

```tsx
style={{
  paddingBottom: 'max(28px, calc(env(safe-area-inset-bottom, 20px) + 8px))',
}}
```

### 2d. Ensure PhaseCard is scrollable within its constrained height

The card now has a smaller available area (since it sits above the button). Make sure:
- PhaseCard has `overflow-y-auto` with hidden scrollbar
- `max-h-[40vh]` or less on the card's scrollable content area
- Content that doesn't fit is scrollable, not clipped

---

## VERIFICATION

### Wheel stability:
- [ ] Wheel does NOT move/shift/translate when reading starts
- [ ] Wheel does NOT drift horizontally during reading
- [ ] Wheel stays in exact same position throughout entire reading flow
- [ ] Wheel does NOT get clipped by its container during reading
- [ ] Wheel returns to exact same state after reading closes

### Button visibility:
- [ ] "Next ✦" / "Toliau ✦" button is FULLY visible on iPhone (with home indicator)
- [ ] Button is FULLY visible on iPhone with Safari bottom toolbar showing
- [ ] Button is tappable — no dead zones
- [ ] Button stays at bottom of screen even when card content is long
- [ ] Button position does not change between reading phases

### Card layout:
- [ ] Card content is scrollable if it overflows
- [ ] Card does not overlap with the navigation button
- [ ] Close "✕" button inside card works correctly
- [ ] Progress dots visible at top of card

### No regressions:
- [ ] All normal app functionality works when reading is NOT active
- [ ] Lithuanian translations still work in reading cards
- [ ] Phase transitions still smooth
- [ ] Camera animations still work

---

## TECHNICAL CONSTRAINTS

- **Do NOT apply CSS transforms to the wheel container** — this breaks R3F raycasting
- **Do NOT use `translate-y` or `translateY` on any parent of the Canvas element**
- **Git push**: `git push origin master:main`
- **No framer-motion** in reading components
- **All scrollbars hidden**
