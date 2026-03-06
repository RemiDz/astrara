# ASTRARA — Fix Date Change Flicker & Add Solar System Autoplay

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Part 1: Fix Planet Flicker on Date Change

### The Problem

When the user taps Yesterday/Tomorrow in heliocentric (solar system) view, all planets and their labels visually flicker — they briefly jump or disappear then reappear.

### Root Cause

When the date changes, new positions are calculated and the planet meshes receive new position values all at once. This causes a single-frame jump. The labels (Html overlays) may also unmount and remount, causing a flash.

### Fix: Animate Between Old and New Positions

When the date changes in heliocentric view, planets should SMOOTHLY glide from their old positions to their new positions — not snap instantly.

**Step 1:** Store the previous heliocentric positions in a ref:

```typescript
const prevHelioData = useRef<Record<string, HelioData>>({})
const helioAnimProgress = useRef(1) // 1 = fully at current positions

// When helioData changes (date change):
useEffect(() => {
  if (viewMode === 'heliocentric' && Object.keys(prevHelioData.current).length > 0) {
    // New positions arrived — start animating from old to new
    helioAnimProgress.current = 0
  }
  // After capturing, update prev to current for next change
  return () => {
    prevHelioData.current = { ...helioData }
  }
}, [helioData])
```

**Step 2:** In `useFrame`, lerp from prev to current positions:

```typescript
useFrame((_, delta) => {
  if (helioAnimProgress.current < 1) {
    helioAnimProgress.current = Math.min(1, helioAnimProgress.current + delta * 2.5)
    // ~400ms to reach new positions — fast but smooth
  }
})

// When calculating planet position in heliocentric view:
// Instead of using helioData directly, interpolate:
const t = smoothstep(helioAnimProgress.current)
const prevPos = prevHelioData.current[planetName]
const newPos = helioData[planetName]

if (prevPos && newPos && t < 1) {
  const animatedX = prevPos.sceneX + (newPos.sceneX - prevPos.sceneX) * t
  const animatedY = prevPos.sceneY + (newPos.sceneY - prevPos.sceneY) * t
  // Use animatedX, animatedY
} else {
  // Use newPos directly (no prev data or animation complete)
}
```

**Step 3:** Ensure labels do NOT unmount/remount on date change. Labels should update their text content in place — not be conditionally rendered based on data that changes every date. If labels are inside a `{helioData && ...}` conditional, make sure `helioData` is never briefly null/empty during date transitions.

---

## Part 2: Autoplay Time Controls

Add play/pause buttons that automatically advance (or rewind) the date, animating the solar system through time.

### New Controls — Only Visible in Heliocentric View

Replace or augment the Yesterday/Today/Tomorrow buttons when in heliocentric view:

```
Geocentric view (unchanged):
┌──────────────────────────────────────────────┐
│  ← Yesterday      Today      Tomorrow →      │
└──────────────────────────────────────────────┘

Heliocentric view (new):
┌──────────────────────────────────────────────┐
│  ◀◀  ◀  ⏸/▶  ▶  ▶▶         Today           │
└──────────────────────────────────────────────┘
```

### Button Functions

- **◀◀ (Fast Rewind):** Autoplay backward, advancing 7 days per tick
- **◀ (Rewind):** Autoplay backward, advancing 1 day per tick
- **⏸ Pause / ▶ Play Forward:** Toggle. When playing forward, advance 1 day per tick
- **▶▶ (Fast Forward):** Autoplay forward, advancing 7 days per tick
- **Today:** Reset to today's date and stop autoplay

### Autoplay Logic

```typescript
const [autoplayDirection, setAutoplayDirection] = useState<'backward-fast' | 'backward' | 'stopped' | 'forward' | 'forward-fast'>('stopped')
const autoplayInterval = useRef<NodeJS.Timeout | null>(null)

useEffect(() => {
  // Clear any existing interval
  if (autoplayInterval.current) {
    clearInterval(autoplayInterval.current)
    autoplayInterval.current = null
  }

  if (autoplayDirection === 'stopped') return

  const daysPerTick = (autoplayDirection === 'forward-fast' || autoplayDirection === 'backward-fast') ? 7 : 1
  const direction = autoplayDirection.includes('backward') ? -1 : 1
  const intervalMs = 800  // time between each tick — fast enough to feel animated, slow enough to see movement

  autoplayInterval.current = setInterval(() => {
    setTargetDate(prev => {
      const next = new Date(prev)
      next.setDate(next.getDate() + (daysPerTick * direction))
      return next
    })
  }, intervalMs)

  return () => {
    if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current)
    }
  }
}, [autoplayDirection])

// Stop autoplay when switching back to geocentric view
useEffect(() => {
  if (viewMode === 'geocentric') {
    setAutoplayDirection('stopped')
  }
}, [viewMode])
```

### Button Styling

Match the existing Yesterday/Today/Tomorrow button style — rounded pill buttons with glass morphism:

```tsx
{viewMode === 'heliocentric' ? (
  <div className="flex items-center gap-2">
    <button
      onClick={() => setAutoplayDirection(prev => prev === 'backward-fast' ? 'stopped' : 'backward-fast')}
      className={`w-10 h-10 rounded-full flex items-center justify-center
                  border transition-all duration-200 active:scale-90
                  ${autoplayDirection === 'backward-fast' 
                    ? 'border-white/30 bg-white/15 text-white' 
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white/80'}`}
      aria-label="Fast rewind"
    >
      ◀◀
    </button>

    <button
      onClick={() => setAutoplayDirection(prev => prev === 'backward' ? 'stopped' : 'backward')}
      className={`w-10 h-10 rounded-full flex items-center justify-center
                  border transition-all duration-200 active:scale-90
                  ${autoplayDirection === 'backward' 
                    ? 'border-white/30 bg-white/15 text-white' 
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white/80'}`}
      aria-label="Rewind"
    >
      ◀
    </button>

    <button
      onClick={() => setAutoplayDirection(prev => prev === 'stopped' ? 'forward' : 'stopped')}
      className={`w-10 h-10 rounded-full flex items-center justify-center
                  border transition-all duration-200 active:scale-90
                  ${autoplayDirection !== 'stopped' 
                    ? 'border-white/30 bg-white/15 text-white' 
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white/80'}`}
      aria-label={autoplayDirection !== 'stopped' ? 'Pause' : 'Play'}
    >
      {autoplayDirection !== 'stopped' ? '⏸' : '▶'}
    </button>

    <button
      onClick={() => setAutoplayDirection(prev => prev === 'forward' ? 'stopped' : 'forward')}
      className={`w-10 h-10 rounded-full flex items-center justify-center
                  border transition-all duration-200 active:scale-90
                  ${autoplayDirection === 'forward' 
                    ? 'border-white/30 bg-white/15 text-white' 
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white/80'}`}
      aria-label="Forward"
    >
      ▶
    </button>

    <button
      onClick={() => setAutoplayDirection(prev => prev === 'forward-fast' ? 'stopped' : 'forward-fast')}
      className={`w-10 h-10 rounded-full flex items-center justify-center
                  border transition-all duration-200 active:scale-90
                  ${autoplayDirection === 'forward-fast' 
                    ? 'border-white/30 bg-white/15 text-white' 
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white/80'}`}
      aria-label="Fast forward"
    >
      ▶▶
    </button>

    <button
      onClick={() => {
        setAutoplayDirection('stopped')
        setTargetDate(new Date())
      }}
      className="px-4 h-10 rounded-full flex items-center justify-center
                 border border-white/10 bg-white/5 text-white/60 
                 hover:text-white/80 transition-all duration-200 active:scale-95
                 text-sm"
    >
      Today
    </button>
  </div>
) : (
  // Existing Yesterday/Today/Tomorrow buttons — completely unchanged
  <div>...</div>
)}
```

### Date Display Update

The header date line should update in real time as autoplay advances. It already shows the current `targetDate`, so this should work automatically. Verify the date text updates smoothly without flicker.

### Active Button Highlight

The currently active autoplay direction button should be visually highlighted (brighter border and background as shown above). When the user taps an already-active direction button, it stops autoplay (toggles to 'stopped').

### Use Icons Not Text Characters

If the app uses lucide-react or another icon library, use proper icons instead of text characters:
- ◀◀ → `SkipBack` or `ChevronsLeft`
- ◀ → `ChevronLeft`  
- ▶ → `Play` / ⏸ → `Pause`
- ▶ → `ChevronRight`
- ▶▶ → `SkipForward` or `ChevronsRight`

If no icon library is available, the text characters are fine.

---

## Do NOT

- Do NOT change any geocentric view navigation — Yesterday/Today/Tomorrow buttons stay exactly as they are
- Do NOT change heliocentric transition timing or planet positions
- Do NOT change orbital rings, planet sizes, or colours
- Do NOT show autoplay controls in geocentric view
- Do NOT allow autoplay to continue when switching back to geocentric view

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: in heliocentric view, tap Tomorrow → planets glide smoothly to new positions, NO flicker
3. Test: tap Yesterday → smooth glide, no flicker
4. Test: tap forward play ▶ → date advances by 1 day every ~800ms, planets animate smoothly between each day
5. Test: tap fast forward ▶▶ → date advances by 7 days per tick, planets sweep through time
6. Test: tap rewind ◀ → date goes backward smoothly
7. Test: tap fast rewind ◀◀ → date rewinds by 7 days per tick
8. Test: tap pause ⏸ → autoplay stops at current date
9. Test: tap Today → resets to today, autoplay stops
10. Test: tap an active direction button again → stops autoplay (toggle behaviour)
11. Test: switch to geocentric view → autoplay stops automatically
12. Test: geocentric Yesterday/Today/Tomorrow buttons still work normally — unchanged
13. Test: header date updates in real time during autoplay
14. Commit: `feat: fix date flicker + autoplay time controls for solar system view`
15. Push to `main`
