# ASTRARA — Autoplay: Continuous Time Interpolation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## The Problem

The current autoplay uses a tick-based system: every 300–500ms, the date jumps by 1 or 7 days, and planets lerp to the new position. This creates visible stop-start stuttering regardless of lerp speed. The fundamental approach is wrong.

## The Solution

Replace the interval-based tick system with CONTINUOUS time advancement inside `useFrame`. Instead of jumping between discrete dates, advance a floating-point timestamp every single frame (60fps) and calculate planet positions for that exact fractional moment in time.

This means planets move continuously — no ticks, no stops, no lerping between positions. They're always at the exact correct position for the current fractional time.

---

## Step 1: Replace Autoplay State

Remove the `setInterval`-based autoplay entirely. Delete the interval, the `animationDate` state updates inside the interval, and any lerping between old/new heliocentric positions.

Replace with a single ref that tracks the current animation timestamp as a floating-point number:

```typescript
// The animation time as milliseconds since epoch — a continuous floating-point value
const animationTime = useRef(Date.now())

// Speed: how many milliseconds of real time pass per millisecond of animation time
// 0 = paused
// positive = forward
// negative = backward
const animationSpeed = useRef(0)

// Speed presets (days per second of real time)
const SPEED_NORMAL = 2      // 2 days per second
const SPEED_FAST = 14        // 14 days per second (2 weeks per second)

// Convert days-per-second to ms-per-ms multiplier
// 1 day = 86400000ms. At 2 days/second: 2 * 86400000 / 1000 = 172800 ms per ms
function daysPerSecondToMultiplier(daysPerSec: number): number {
  return daysPerSec * 86400000 / 1000
}
```

## Step 2: Update animationTime Every Frame

Inside the main wheel `useFrame`, continuously advance `animationTime`:

```typescript
useFrame((state, delta) => {
  // delta is in seconds
  if (animationSpeed.current !== 0) {
    const msAdvance = animationSpeed.current * delta * 1000
    animationTime.current += msAdvance
  }

  // ... rest of useFrame
})
```

This runs at 60fps. Every frame, the time advances by a tiny fractional amount. No ticks, no intervals, no jumps.

## Step 3: Calculate Positions Directly from animationTime

Instead of pre-calculating heliocentric data and storing it in state, calculate positions INLINE every frame from `animationTime.current`:

```typescript
import * as Astronomy from 'astronomy-engine'
import { HELIO_RING_RADII } from '@/lib/heliocentric'

// Inside useFrame:
const currentDate = new Date(animationTime.current)

// For each planet, calculate its heliocentric angle RIGHT NOW
function getHelioAngleNow(body: Astronomy.Body, date: Date): number {
  const vector = Astronomy.HelioVector(body, date)
  return Math.atan2(vector.y, vector.x)  // radians
}

// Then position each planet:
const mercuryAngle = getHelioAngleNow(Astronomy.Body.Mercury, currentDate)
const mercuryRadius = HELIO_RING_RADII.Mercury
const mercuryX = mercuryRadius * Math.cos(mercuryAngle)
const mercuryY = mercuryRadius * Math.sin(mercuryAngle)
// Apply directly to mesh: mercuryRef.current.position.set(mercuryX, mercuryY, 0)
```

**PERFORMANCE CONCERN:** `Astronomy.HelioVector()` involves trigonometric calculations. Calling it for 10 bodies × 60fps = 600 calls/second. This SHOULD be fine — astronomy-engine is designed for this and the calculations are pure maths (no network, no DOM). But if there is any frame drop, reduce to calculating every 2nd frame and interpolating positions between calculations.

### Optimised Approach — Calculate Every 3rd Frame, Interpolate Between

```typescript
const calcFrameCount = useRef(0)
const prevPositions = useRef<Record<string, { x: number; y: number }>>({})
const nextPositions = useRef<Record<string, { x: number; y: number }>>({})
const interpT = useRef(0)

useFrame((state, delta) => {
  if (animationSpeed.current === 0) return

  // Advance time
  animationTime.current += animationSpeed.current * delta * 1000
  calcFrameCount.current++

  if (calcFrameCount.current % 3 === 0) {
    // Every 3rd frame: do full calculation
    prevPositions.current = { ...nextPositions.current }
    
    const date = new Date(animationTime.current)
    // Calculate all planet positions
    nextPositions.current = calculateAllPositionsForDate(date)
    interpT.current = 0
  } else {
    // Intermediate frames: interpolate
    interpT.current = Math.min(1, interpT.current + 0.34) // 3 frames to reach 1.0
  }

  // Apply interpolated positions to all planet meshes
  const t = interpT.current
  for (const [name, ref] of Object.entries(planetRefs.current)) {
    const prev = prevPositions.current[name]
    const next = nextPositions.current[name]
    if (prev && next && ref) {
      ref.position.set(
        prev.x + (next.x - prev.x) * t,
        prev.y + (next.y - prev.y) * t,
        0
      )
    }
  }
})
```

Use whichever approach (every frame or every 3rd frame with interpolation) runs smoothly on mobile. Try every frame first — if it stutters, switch to the optimised version.

### Helper Function — Calculate All Positions for a Date

```typescript
function calculateAllPositionsForDate(date: Date): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}

  // Sun at centre
  positions.Sun = { x: 0, y: 0 }

  // Earth
  const sunGeo = Astronomy.GeoVector(Astronomy.Body.Sun, date, true)
  const earthAngle = Math.atan2(-sunGeo.y, -sunGeo.x)
  const earthR = HELIO_RING_RADII.Earth
  positions.Earth = { x: earthR * Math.cos(earthAngle), y: earthR * Math.sin(earthAngle) }

  // Moon
  const moonGeo = Astronomy.GeoVector(Astronomy.Body.Moon, date, true)
  const moonAngle = Math.atan2(moonGeo.y, moonGeo.x)
  const MOON_OFFSET = 1.0
  positions.Moon = {
    x: positions.Earth.x + MOON_OFFSET * Math.cos(moonAngle),
    y: positions.Earth.y + MOON_OFFSET * Math.sin(moonAngle),
  }

  // All other planets
  const bodies: [string, Astronomy.Body][] = [
    ['Mercury', Astronomy.Body.Mercury],
    ['Venus', Astronomy.Body.Venus],
    ['Mars', Astronomy.Body.Mars],
    ['Jupiter', Astronomy.Body.Jupiter],
    ['Saturn', Astronomy.Body.Saturn],
    ['Uranus', Astronomy.Body.Uranus],
    ['Neptune', Astronomy.Body.Neptune],
    ['Pluto', Astronomy.Body.Pluto],
  ]

  for (const [name, body] of bodies) {
    const vector = Astronomy.HelioVector(body, date)
    const angle = Math.atan2(vector.y, vector.x)
    const radius = HELIO_RING_RADII[name]
    positions[name] = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
  }

  return positions
}
```

## Step 4: Update Button Handlers

```typescript
// Button handlers — just set the speed, useFrame does the rest
const handleFastRewind = () => {
  const newSpeed = -daysPerSecondToMultiplier(SPEED_FAST)
  animationSpeed.current = animationSpeed.current === newSpeed ? 0 : newSpeed
  setAutoplayDirection(prev => prev === 'backward-fast' ? 'stopped' : 'backward-fast')
}

const handleRewind = () => {
  const newSpeed = -daysPerSecondToMultiplier(SPEED_NORMAL)
  animationSpeed.current = animationSpeed.current === newSpeed ? 0 : newSpeed
  setAutoplayDirection(prev => prev === 'backward' ? 'stopped' : 'backward')
}

const handleForward = () => {
  const newSpeed = daysPerSecondToMultiplier(SPEED_NORMAL)
  animationSpeed.current = animationSpeed.current === newSpeed ? 0 : newSpeed
  setAutoplayDirection(prev => prev === 'forward' ? 'stopped' : 'forward')
}

const handleFastForward = () => {
  const newSpeed = daysPerSecondToMultiplier(SPEED_FAST)
  animationSpeed.current = animationSpeed.current === newSpeed ? 0 : newSpeed
  setAutoplayDirection(prev => prev === 'forward-fast' ? 'stopped' : 'forward-fast')
}

const handleToday = () => {
  animationSpeed.current = 0
  animationTime.current = Date.now()
  setAutoplayDirection('stopped')
  setDisplayDate(new Date())
}
```

## Step 5: Sync displayDate When Autoplay Stops

When speed becomes 0 (any stop action), sync the full app date:

```typescript
// In the button handlers, when stopping:
if (stoppingAutoplay) {
  animationSpeed.current = 0
  setDisplayDate(new Date(animationTime.current))
  setAutoplayDirection('stopped')
}
```

## Step 6: Header Date During Autoplay

Update the header date display from `animationTime` during autoplay. But do NOT use React state for this during animation — it would cause re-renders. Instead, update the DOM directly:

```typescript
const headerDateRef = useRef<HTMLSpanElement>(null)

useFrame(() => {
  if (animationSpeed.current !== 0 && headerDateRef.current) {
    const d = new Date(animationTime.current)
    headerDateRef.current.textContent = formatDate(d) // your existing date formatter
  }
})

// In JSX:
<span ref={headerDateRef}>{formatDate(displayDate)}</span>
```

This updates the header text every frame via direct DOM manipulation — zero React re-renders.

## Step 7: Sync animationTime When Not Autoplaying

When the user manually changes dates (geocentric Yesterday/Tomorrow, or tapping Today), sync `animationTime`:

```typescript
// When displayDate changes manually:
useEffect(() => {
  if (autoplayDirection === 'stopped') {
    animationTime.current = displayDate.getTime()
  }
}, [displayDate])
```

## Step 8: Remove Old Tick-Based Code

Delete:
- The `setInterval`-based autoplay logic
- The `animationDate` state (if it was separate from `displayDate`)
- The `prevHelioData` / `helioAnimProgress` lerping system
- Any `intervalMs` constants

The entire animation is now driven by `useFrame` + `animationTime` + `animationSpeed`. No intervals, no state updates during animation, no lerping between discrete positions.

---

## Do NOT

- Do NOT change button layout or styling (already fixed)
- Do NOT change planet sizes, colours, or orbital rings
- Do NOT change the geocentric/heliocentric transition animation
- Do NOT change geocentric view behaviour
- Do NOT use React state updates inside the animation loop — only refs and direct DOM manipulation
- Do NOT remove the `displayDate` state — it still drives all content when autoplay is stopped

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: tap ▶ → planets move CONTINUOUSLY AND SMOOTHLY with zero stops or stuttering
3. Test: tap ▶▶ → planets sweep through time faster, still perfectly smooth
4. Test: tap ◀ → smooth continuous backward motion
5. Test: tap ◀◀ → fast smooth backward motion
6. Test: inner planets (Mercury, Venus) visibly move faster than outer planets (Neptune, Pluto) — this is astronomically correct!
7. Test: Moon visibly orbits around Earth during animation
8. Test: header date advances smoothly during playback
9. Test: stop autoplay → cards and content update to final date
10. Test: tap Today → everything resets smoothly
11. Test: no frame drops on mobile during animation (check with browser dev tools if possible)
12. Test: geocentric date navigation still works normally
13. Commit: `feat: continuous time interpolation for perfectly smooth solar system animation`
14. Push to `main`
