# ASTRARA — Fix Autoplay Controls: Layout, Animation & Styling

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Three Problems to Fix

Read all current autoplay controls and heliocentric animation source files before making changes.

---

## Fix 1: Button Layout — Today in Centre

The Today button must be in the CENTRE of the control bar, with rewind buttons on the left and forward buttons on the right. Symmetrical layout:

```
┌──────────────────────────────────────────────────┐
│   ◀◀    ◀       Today       ▶    ▶▶             │
│   fast   back   [centre]   fwd   fast            │
│   back                            fwd            │
└──────────────────────────────────────────────────┘
```

Implementation:

```tsx
<div className="flex items-center justify-center gap-2">
  {/* Rewind group */}
  <button aria-label="Fast rewind">...</button>
  <button aria-label="Rewind">...</button>

  {/* Today — centre, slightly wider */}
  <button aria-label="Today" className="px-5 ...">Today</button>

  {/* Forward group */}
  <button aria-label="Forward">...</button>
  <button aria-label="Fast forward">...</button>
</div>
```

Remove the separate play/pause button. Instead, the behaviour works like this:
- Tap ◀ → starts rewinding 1 day per tick. Tap ◀ again → stops.
- Tap ▶ → starts playing forward 1 day per tick. Tap ▶ again → stops.
- Tap ◀◀ → starts fast rewinding 7 days per tick. Tap ◀◀ again → stops.
- Tap ▶▶ → starts fast forwarding 7 days per tick. Tap ▶▶ again → stops.
- Tap Today → stops all autoplay, resets to today.
- Tapping any direction while another is active → switches to the new direction.

This gives 5 buttons total: ◀◀  ◀  Today  ▶  ▶▶

---

## Fix 2: Smooth Animation Between Days

The planets are jumping from one position to the next instead of smoothly gliding. The animation between day changes must be fluid — planets should continuously glide.

### Reduce Interval, Increase Lerp Speed

Change the autoplay interval from 800ms to 500ms for normal speed and 300ms for fast speed. Increase the position lerp speed so planets complete their movement within the interval:

```typescript
const intervalMs = (autoplayDirection === 'forward-fast' || autoplayDirection === 'backward-fast') 
  ? 300   // fast: new position every 300ms
  : 500   // normal: new position every 500ms
```

### Faster Position Lerp

In the `useFrame` where planets interpolate between old and new positions, increase the lerp speed so movement completes in ~400ms:

```typescript
if (helioAnimProgress.current < 1) {
  helioAnimProgress.current = Math.min(1, helioAnimProgress.current + delta * 4.0)
  // Was 2.5, now 4.0 — completes in ~250ms instead of ~400ms
}
```

### Ensure Previous Position Is Captured BEFORE New Position Arrives

The critical fix: when a new date triggers new positions, the CURRENT interpolated position (not the target position) must become the starting point for the next animation. This prevents jumps:

```typescript
// When helioData changes:
useEffect(() => {
  if (viewMode === 'heliocentric') {
    // Capture where planets CURRENTLY ARE (interpolated), not where they were headed
    // Store current interpolated positions as the new "from" positions
    prevHelioData.current = getCurrentInterpolatedPositions() // or snapshot current refs
    helioAnimProgress.current = 0  // restart lerp from current visual position to new target
  }
}, [helioData])
```

If `getCurrentInterpolatedPositions()` is too complex, at minimum ensure `prevHelioData` captures the last target (which should be close to where planets visually are if the previous animation completed):

```typescript
useEffect(() => {
  if (viewMode === 'heliocentric' && Object.keys(helioData).length > 0) {
    // Store current target as next animation's starting point
    prevHelioData.current = { ...prevTargetHelioData.current }
    prevTargetHelioData.current = { ...helioData }
    helioAnimProgress.current = 0
  }
}, [helioData])
```

---

## Fix 3: Button Styling — Match App Aesthetic

The current buttons use basic text characters (◀◀, ▶, etc.) which look dated and break the app's cosmic aesthetic. Replace with clean custom SVG icons.

### Create SVG Icons Inline

Do NOT use emoji or text characters. Use inline SVG for crisp, scalable icons:

```tsx
// Chevron Left (single arrow — rewind)
function ChevronLeftIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

// Double Chevron Left (fast rewind)
function ChevronsLeftIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  )
}

// Chevron Right (single arrow — forward)
function ChevronRightIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// Double Chevron Right (fast forward)
function ChevronsRightIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  )
}
```

### Button Styling

All autoplay buttons should match Astrara's cosmic glass morphism aesthetic:

```tsx
function AutoplayButton({ 
  isActive, 
  onClick, 
  ariaLabel, 
  children 
}: { 
  isActive: boolean
  onClick: () => void
  ariaLabel: string
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        w-11 h-11 rounded-full flex items-center justify-center
        backdrop-blur-md transition-all duration-200 active:scale-90
        ${isActive 
          ? 'bg-white/15 border border-white/25 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]' 
          : 'bg-white/5 border border-white/8 text-white/45 hover:text-white/70 hover:bg-white/8'
        }
      `}
    >
      {children}
    </button>
  )
}
```

### Today Button Styling

```tsx
<button
  onClick={() => {
    setAutoplayDirection('stopped')
    setTargetDate(new Date())
  }}
  className="px-5 h-11 rounded-full flex items-center justify-center
             backdrop-blur-md bg-white/5 border border-white/8 
             text-white/60 text-sm font-medium
             hover:bg-white/10 hover:text-white/80
             active:scale-95 transition-all duration-200"
>
  Today
</button>
```

### Full Control Bar

```tsx
<div className="flex items-center justify-center gap-2.5">
  <AutoplayButton
    isActive={autoplayDirection === 'backward-fast'}
    onClick={() => setAutoplayDirection(prev => prev === 'backward-fast' ? 'stopped' : 'backward-fast')}
    ariaLabel="Fast rewind — 7 days per step"
  >
    <ChevronsLeftIcon />
  </AutoplayButton>

  <AutoplayButton
    isActive={autoplayDirection === 'backward'}
    onClick={() => setAutoplayDirection(prev => prev === 'backward' ? 'stopped' : 'backward')}
    ariaLabel="Rewind — 1 day per step"
  >
    <ChevronLeftIcon />
  </AutoplayButton>

  <button
    onClick={() => {
      setAutoplayDirection('stopped')
      setTargetDate(new Date())
    }}
    className="px-5 h-11 rounded-full flex items-center justify-center
               backdrop-blur-md bg-white/5 border border-white/8 
               text-white/60 text-sm font-medium
               hover:bg-white/10 hover:text-white/80
               active:scale-95 transition-all duration-200"
  >
    Today
  </button>

  <AutoplayButton
    isActive={autoplayDirection === 'forward'}
    onClick={() => setAutoplayDirection(prev => prev === 'forward' ? 'stopped' : 'forward')}
    ariaLabel="Forward — 1 day per step"
  >
    <ChevronRightIcon />
  </AutoplayButton>

  <AutoplayButton
    isActive={autoplayDirection === 'forward-fast'}
    onClick={() => setAutoplayDirection(prev => prev === 'forward-fast' ? 'stopped' : 'forward-fast')}
    ariaLabel="Fast forward — 7 days per step"
  >
    <ChevronsRightIcon />
  </AutoplayButton>
</div>
```

---

## Do NOT

- Do NOT change geocentric Yesterday/Today/Tomorrow buttons
- Do NOT change planet positions, sizes, or colours
- Do NOT change orbital rings or transition phases
- Do NOT change the toggle button between views
- Do NOT add any new features — only fix these three issues

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: button layout is symmetrical — ◀◀ ◀ Today ▶ ▶▶
3. Test: Today button is in the exact centre
4. Test: buttons use clean SVG chevron icons, not text characters
5. Test: active button has a subtle glow/highlight
6. Test: tap ▶ → planets glide smoothly day by day, NO jumping or flickering
7. Test: tap ▶▶ → planets sweep forward 7 days per tick, fluid motion
8. Test: tap ◀ → smooth backward motion
9. Test: tap Today → stops and returns to today
10. Test: tap active button again → stops autoplay
11. Test: switch to geocentric → autoplay stops, normal buttons show
12. Commit: `fix: autoplay layout, smooth animation, styled controls`
13. Push to `main`
