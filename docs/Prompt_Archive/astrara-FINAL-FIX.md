# Astrara — FINAL FIX: Wheel Position, Empty Space, Highlights, Transition Speed

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## FOUR ISSUES — FIX EACH ONE PRECISELY

---

## ISSUE 1: Wheel clipped on the right side of mobile screen

The Astro Wheel is overflowing the right edge of the viewport during Cosmic Reading.

### Diagnosis

Open the browser dev tools on the deployed site (or use `document.documentElement.scrollWidth > document.documentElement.clientWidth` in console to confirm horizontal overflow). Then use the element inspector to find which element is wider than the viewport.

The most likely culprit: the `<div>` wrapping the `<Canvas>` in AstroWheel3D.tsx has `style={{ overflow: 'visible' }}` (line ~1786 of AstroWheel3D.tsx). During normal use this is fine, but when combined with the reading overlay fixed positioning, it causes overflow.

### Fix

In `src/components/AstroWheel/AstroWheel3D.tsx`, find the root container div of the AstroWheel3D component (the export default function at the bottom of the file). It currently has:

```tsx
style={{
  height: '95vw',
  maxHeight: '550px',
  overflow: 'visible',  // ← THIS causes the right-side overflow
  ...
}}
```

Change `overflow: 'visible'` to `overflow: 'hidden'` ONLY on the x-axis. Since inline styles don't support `overflow-x` separately in a clean way, change to:

```tsx
style={{
  height: '95vw',
  maxHeight: '550px',
  overflowX: 'hidden',
  overflowY: 'visible',
  touchAction: 'none',
  background: 'transparent',
  WebkitTapHighlightColor: 'transparent',
  WebkitUserSelect: 'none',
  userSelect: 'none',
  outline: 'none',
}}
```

Also, in `page.tsx`, make sure the page root div has `overflow-x-hidden`:

```tsx
<div className="min-h-screen relative overflow-x-hidden">
```

---

## ISSUE 2: Massive empty space between header and wheel top

There is a large gap (~80-100px) of empty black space between the "ASTRARA" header row and where the wheel's top edge begins. This space is completely wasted during Cosmic Reading.

### Diagnosis

This gap comes from multiple sources stacked together:
1. The `<main>` tag may have `pt-*` padding
2. The wheel wrapper div has padding (`pt-0 pb-0` or `pt-1 pb-4` depending on previous fixes)
3. The Header component itself may have bottom margin/padding
4. The hidden controls (view toggle, day nav) may still occupy space via CSS even when hidden (e.g. if using `opacity-0` instead of `display: none`)

### Fix

Run this diagnostic first — in the browser dev tools, inspect the vertical stack from the bottom of the header to the top of the Canvas element. Note every element and its computed margin/padding. Then eliminate all unnecessary spacing.

Specifically check and fix these:

**A. The `<main>` tag in page.tsx:**
```tsx
// Current (probably):
<main className="max-w-5xl mx-auto px-4 pb-12">

// If reading is active, remove all top padding from main:
<main className={`max-w-5xl mx-auto px-4 pb-12 ${isReadingActive ? 'pt-0' : ''}`}>
```

**B. The wheel wrapper div:**
```tsx
// Must be pt-0 during reading:
<div className={`relative ${isReadingActive ? 'pt-0 pb-0' : 'pt-1 pb-4'}`}>
```

**C. The stacked layout div wrapping the wheel section:**
Look for any `<div>` between `<main>` and the wheel wrapper that adds spacing. The page.tsx has a structure like:
```tsx
<main>
  <div>  ← This wrapper — check for padding/margin
    <div className="py-4 relative">  ← Wheel wrapper
      <AstroWheel3DWrapper />
```

Remove or zero-out any `py-*`, `pt-*`, `mt-*`, `gap-*` on intermediate wrappers when reading is active.

**D. The ReadingDim / hidden controls:**
Make absolutely sure the hidden controls use `display: none` (via `hidden` class or `return null`), NOT `opacity-0` or `invisible`. These CSS properties hide visually but the elements still take up layout space:

```tsx
// WRONG — still takes space:
<div className={isReadingActive ? 'opacity-0 pointer-events-none' : ''}>
<div className={isReadingActive ? 'invisible' : ''}>

// RIGHT — removed from layout:
{!isReadingActive && (
  <div>...</div>
)}

// Also right:
<div className={isReadingActive ? 'hidden' : ''}>
```

**E. The Header component compact mode:**
Verify that when `compact={true}` (or whatever prop controls it during reading), the hidden subtitle and date lines are truly removed from layout (not just invisible). Check the Header component source.

---

## ISSUE 3: Planet highlight barely visible — too subtle

The planet glow/highlight during reading phases is so faint that users don't notice which planet the reading is about. This makes the cinematic reading feel low quality.

### Fix

Open `src/features/cosmic-reading/animation/PlanetHighlight.tsx`.

**A. Increase glow intensity:**

Find where the glow mesh material is created. The opacity and emissive intensity need to be MUCH stronger:

```typescript
// Current (too subtle):
opacity={0.15}  // or similar low value
emissiveIntensity={0.3}  // or similar

// Fix — make it OBVIOUS:
opacity={0.4}
emissiveIntensity={1.5}
```

**B. Increase glow mesh scale:**

The glow sphere should be significantly larger than the planet — at least 2x the planet radius:

```typescript
// Current (probably):
scale={1.2}  // barely larger than the planet

// Fix:
scale={2.5}  // clearly visible halo around the planet
```

**C. Make the pulse effect more dramatic:**

If using a pulse animation (sine wave on scale), increase the amplitude:

```typescript
// Current:
const scale = 1.0 + Math.sin(time) * 0.15  // subtle

// Fix:
const scale = 2.0 + Math.sin(time * 2) * 0.5  // clearly pulsing, faster
```

**D. Use a brighter, more saturated glow colour:**

If the glow uses the planet's own colour, it may blend in and be invisible. Use a BRIGHTER version:

```typescript
// Instead of using the planet's colour directly:
const glowColor = highlightColor || planetColor

// Boost it — create a lighter, more saturated version:
const baseColor = new THREE.Color(highlightColor || planetColor)
baseColor.multiplyScalar(2.0)  // Brighten
```

Or use a consistent highlight colour like a warm white-purple glow (`#c4b5fd`) that stands out against the dark background.

**E. Add a secondary larger, softer glow ring:**

For maximum visibility, render TWO glow meshes per highlighted planet:
1. Inner glow: scale 2x, opacity 0.4, bright colour
2. Outer glow: scale 3.5x, opacity 0.15, same colour, creates a soft halo

---

## ISSUE 4: Long wait between phases — reading text takes too long to appear

When user taps "Next ✦", there's a long delay staring at an empty/faded card before the next reading text appears. The state machine transitions (PHASE_READING → PHASE_TRANSITIONING → PHASE_ANIMATING → PHASE_READING) have accumulated delays that make the flow feel sluggish.

### Fix

Open `src/features/cosmic-reading/ReadingContext.tsx` and find the auto-transition timeouts.

**A. Reduce PHASE_TRANSITIONING timeout:**

```typescript
case 'PHASE_TRANSITIONING':
  // Current (probably 400ms) — too slow
  // Fix: 150ms — just enough for content fade
  timerRef.current = setTimeout(() => dispatch({ type: 'ANIMATION_COMPLETE' }), 150)
  break
```

**B. Reduce the PHASE_ANIMATING fallback timeout:**

```typescript
case 'PHASE_ANIMATING':
  // Current fallback: 3000ms — way too long to wait
  // Fix: 1200ms fallback — if camera doesn't reach target in 1.2s, just show the card
  timerRef.current = setTimeout(() => {
    if (!animCompleteGuard.current) {
      animCompleteGuard.current = true
      dispatch({ type: 'ANIMATION_COMPLETE' })
    }
  }, 1200)
  break
```

**C. Reduce PREPARING timeout:**

```typescript
case 'PREPARING':
  // Current: 400ms — unnecessary delay before first phase
  // Fix: 100ms — almost instant
  timerRef.current = setTimeout(() => dispatch({ type: 'PREPARING_COMPLETE' }), 100)
  break
```

**D. Make the ReadingCameraController faster:**

In `src/features/cosmic-reading/animation/ReadingCameraController.tsx`, increase the camera lerp speed so it reaches its target faster:

```typescript
// Current lerp speed (probably):
const LERP_SPEED = 0.03  // slow, cinematic

// Fix — faster but still smooth:
const LERP_SPEED = 0.08  // reaches target in ~1 second instead of ~3
```

Also, increase the "close enough" threshold for triggering `onComplete`:

```typescript
// Current:
if (distance < 0.05) { onComplete?.() }

// Fix — trigger sooner:
if (distance < 0.2) { onComplete?.() }
```

**E. Show content immediately at reduced opacity during PHASE_ANIMATING:**

The text content should appear as soon as the phase starts (at reduced opacity), not wait until the camera animation finishes. This way the user can start reading while the camera is still moving.

In ReadingOverlay.tsx, update the content opacity logic:

```typescript
const contentOpacity = state.status === 'PHASE_READING' ? 1
  : state.status === 'PHASE_ANIMATING' ? 0.7  // Show content early at 70%
  : state.status === 'PHASE_TRANSITIONING' ? 0.3
  : 0
```

This means: tap "Next" → text fades to 30% (150ms) → new text appears at 70% immediately → camera finishes → text goes to 100%. The user never stares at an empty card.

---

## VERIFICATION

- [ ] Wheel is fully within the mobile viewport — no right-side clipping
- [ ] Zero (or near-zero) empty space between header and wheel during reading
- [ ] Planet highlights are clearly visible — obvious glowing halo around the active planet
- [ ] Tapping "Next ✦" → new reading text appears within ~0.5 seconds (not 2-3 seconds)
- [ ] Text is visible (at 70% opacity) even while camera is still moving
- [ ] Card never fully disappears between phases
- [ ] All normal app functionality works when reading is not active
- [ ] No horizontal scroll on any device

---

## TECHNICAL CONSTRAINTS

- Do NOT apply CSS transforms to the wheel container
- Do NOT change the wheel's height/maxHeight values (95vw / 550px)
- No framer-motion
- Git push: `git push origin master:main`
