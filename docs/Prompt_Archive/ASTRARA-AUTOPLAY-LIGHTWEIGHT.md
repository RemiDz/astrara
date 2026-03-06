# ASTRARA — Fix Autoplay: Lightweight Animation Loop

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## The Problem

During autoplay, every date tick triggers a full app state update — recalculating card content, insights, translations, NOAA data, and everything else. This causes heavy re-renders that make the planet animation stutter and jump instead of gliding smoothly.

## The Solution

Split the date into TWO separate states:

1. **`displayDate`** — the full app date that drives cards, insights, NOAA data, header text, and all heavy content. Only updates when autoplay STOPS or when the user manually taps a date button.

2. **`animationDate`** — a lightweight date that ONLY drives planet position calculations during autoplay. Updates every tick. Does NOT trigger card updates, insight recalculations, or any content re-renders.

Read all current date state, autoplay, heliocentric data, and planet position source files before making changes.

---

## Implementation

### Step 1: Add Animation Date State

Find where the current date state lives (likely `targetDate` or similar in `page.tsx`). Add a second date state:

```typescript
// This drives ALL app content — cards, insights, header, NOAA, everything
const [displayDate, setDisplayDate] = useState(new Date())

// This drives ONLY planet positions during autoplay — lightweight
const [animationDate, setAnimationDate] = useState(new Date())

// Track whether autoplay is active
const isAutoplayActive = autoplayDirection !== 'stopped'
```

### Step 2: Autoplay Only Updates animationDate

Change the autoplay interval to update ONLY `animationDate`, NOT the main display date:

```typescript
useEffect(() => {
  if (autoplayInterval.current) {
    clearInterval(autoplayInterval.current)
    autoplayInterval.current = null
  }

  if (autoplayDirection === 'stopped') return

  const daysPerTick = (autoplayDirection === 'forward-fast' || autoplayDirection === 'backward-fast') ? 7 : 1
  const direction = autoplayDirection.includes('backward') ? -1 : 1
  const intervalMs = (autoplayDirection === 'forward-fast' || autoplayDirection === 'backward-fast') ? 300 : 500

  autoplayInterval.current = setInterval(() => {
    // ONLY update animationDate — NOT displayDate
    setAnimationDate(prev => {
      const next = new Date(prev)
      next.setDate(next.getDate() + (daysPerTick * direction))
      return next
    })
  }, intervalMs)

  return () => {
    if (autoplayInterval.current) clearInterval(autoplayInterval.current)
  }
}, [autoplayDirection])
```

### Step 3: When Autoplay Stops — Sync displayDate

When autoplay stops (user taps pause, taps Today, taps active button again, or switches to geocentric), sync the full display date to wherever the animation landed:

```typescript
// Watch for autoplay stopping
useEffect(() => {
  if (autoplayDirection === 'stopped') {
    // Sync the full app date to the animation date
    setDisplayDate(new Date(animationDate))
  }
}, [autoplayDirection])

// Today button
const handleToday = () => {
  setAutoplayDirection('stopped')
  const now = new Date()
  setAnimationDate(now)
  setDisplayDate(now)
}
```

### Step 4: Heliocentric Positions Use animationDate During Autoplay

Find where `calculateAllHelioData(date)` is called. Change it to use `animationDate` when autoplay is active, and `displayDate` when not:

```typescript
// The date that drives planet positions
const planetDate = isAutoplayActive ? animationDate : displayDate

// Recalculate heliocentric positions when planetDate changes
const helioData = useMemo(() => {
  return calculateAllHelioData(planetDate)
}, [planetDate])
```

**IMPORTANT:** Use `useMemo` (not `useEffect` + `setState`) for the heliocentric data during autoplay. This avoids an extra async state update cycle and makes the position calculation synchronous with the render.

### Step 5: Geocentric Positions Also Use planetDate

If geocentric planet positions are also calculated from the date (they should be, for the day navigation feature), apply the same logic — use `planetDate` for position calculations:

```typescript
const geoPositions = useMemo(() => {
  return calculateGeoPositions(planetDate)
}, [planetDate])
```

### Step 6: Header Date Display During Autoplay

The header should show the ANIMATION date during autoplay so the user sees the date advancing:

```typescript
// In the header date line
const headerDate = isAutoplayActive ? animationDate : displayDate
// Format and display headerDate
```

This is lightweight — just formatting a date string, no heavy computation.

### Step 7: Cards and Content Use displayDate ONLY

All heavy content components (planet insight cards, cosmic weather, NOAA data, moon phase, sound frequencies, etc.) should ONLY read from `displayDate`. They must NOT re-render during autoplay:

```typescript
// Cards, insights, cosmic weather — all use displayDate
<PlanetCards date={displayDate} />
<CosmicWeather date={displayDate} />
<MoonPhase date={displayDate} />
```

These components will NOT update during autoplay. They only update when:
- Autoplay stops (displayDate syncs to animationDate)
- User manually taps Yesterday/Today/Tomorrow in geocentric view
- User taps Today in heliocentric view

### Step 8: Manual Date Navigation (Non-Autoplay)

When the user manually taps Yesterday/Tomorrow (geocentric) or taps a direction button once then stops, both dates should update together:

```typescript
const handleManualDateChange = (days: number) => {
  const next = new Date(displayDate)
  next.setDate(next.getDate() + days)
  setDisplayDate(next)
  setAnimationDate(next)
}
```

---

## Performance Summary

**During autoplay (every 300–500ms tick):**
- ✅ `animationDate` updates
- ✅ `helioData` recalculates (lightweight maths — just trig functions)
- ✅ Planet positions lerp to new targets
- ✅ Header date text updates
- ❌ Cards do NOT re-render
- ❌ Insights do NOT recalculate
- ❌ NOAA data does NOT refetch
- ❌ Sound frequencies do NOT update
- ❌ No heavy content work at all

**When autoplay stops:**
- ✅ `displayDate` syncs to `animationDate`
- ✅ ALL content updates once to the final date
- ✅ Cards, insights, cosmic weather all refresh

---

## Do NOT

- Do NOT change planet sizes, colours, or orbital rings
- Do NOT change button layout or styling (already fixed in previous iteration)
- Do NOT change transition phases between geocentric/heliocentric views
- Do NOT change geocentric view date navigation behaviour
- Do NOT remove any existing functionality

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: tap ▶ in heliocentric view → planets glide SMOOTHLY day by day, NO stuttering
3. Test: tap ▶▶ → planets sweep through time fluidly, no jank
4. Test: during autoplay, scroll down — cards are NOT updating (still showing the date when autoplay started)
5. Test: stop autoplay → cards and all content update to the current animation date
6. Test: tap Today → everything resets to today, cards update
7. Test: header date advances smoothly during autoplay
8. Test: geocentric Yesterday/Today/Tomorrow still works normally — both dates update together
9. Test: switch from heliocentric to geocentric during autoplay → autoplay stops, content syncs
10. Test: fast forward 30+ days then stop → cards show correct date content
11. Commit: `fix: lightweight autoplay animation — position-only updates, no content re-render`
12. Push to `main`
