# ASTRARA v2 — Wheel Interaction Addendum

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

**IMPORTANT**: This addendum MUST be applied together with the main `ASTRARA-V2-PHASE1-BUILD.md` spec. It replaces and expands the "Interactive Astro Wheel" section with detailed interaction behaviour.

---

## Astro Wheel — Full Interaction Specification

The wheel is the hero of Astrara. It must feel like a **physical object in space** — alive, tactile, explorable. Not a chart. Not a diagram. A living celestial instrument.

### Three Interaction Modes (simultaneous)

#### Mode 1: Passive — Auto-Rotation (Default)

When nobody is touching the wheel, it rotates slowly and continuously.

```
Speed: 1 full revolution per ~5 minutes (0.072° per second)
Direction: Counter-clockwise (matching actual sky movement)
Easing: Linear (constant, smooth, hypnotic)
```

This creates the "living, breathing" quality that makes it mesmerising for TikTok screen recordings and ambient display. The planets glow softly and pulse gently as they drift past.

#### Mode 2: Active — User-Controlled Rotation & Exploration

The moment a user **touches / clicks and drags** the wheel:

1. **Auto-rotation stops instantly** (no jarring snap — it just ceases)
2. The wheel becomes **freely draggable/rotatable** following the user's finger or cursor
3. Rotation follows touch/mouse position relative to the wheel centre (angular tracking):
   - Calculate the angle from wheel centre to touch point
   - On drag, calculate the new angle and rotate wheel by the delta
   - This gives natural, intuitive "grab and spin" physics
4. **Momentum / inertia**: When the user releases after a fast swipe:
   - The wheel continues spinning in the swipe direction
   - Gradually decelerates (ease-out over ~2-3 seconds)
   - Feels like spinning a real physical wheel
5. **Resume auto-rotation**: After the user stops interacting (no touch for 4 seconds and momentum has settled), auto-rotation gently fades back in over 1 second

Implementation approach:

```typescript
// Wheel state
const [rotation, setRotation] = useState(0)         // current angle in degrees
const [isDragging, setIsDragging] = useState(false)
const [velocity, setVelocity] = useState(0)          // angular velocity from momentum
const [lastInteraction, setLastInteraction] = useState(0) // timestamp
const autoRotationSpeed = 0.072 // degrees per second

// In animation frame loop:
useEffect(() => {
  let animationId: number
  
  const animate = () => {
    const now = Date.now()
    
    if (isDragging) {
      // User is actively dragging — rotation handled by drag handler
    } else if (Math.abs(velocity) > 0.01) {
      // Momentum phase — decelerate
      setRotation(prev => prev + velocity)
      setVelocity(prev => prev * 0.97) // friction coefficient
    } else if (now - lastInteraction > 4000) {
      // Auto-rotation — fade back in
      const timeSinceRelease = now - lastInteraction - 4000
      const fadeIn = Math.min(timeSinceRelease / 1000, 1) // 0→1 over 1 second
      setRotation(prev => prev + autoRotationSpeed * fadeIn * (16/1000))
    }
    
    animationId = requestAnimationFrame(animate)
  }
  
  animationId = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(animationId)
}, [isDragging, velocity, lastInteraction])

// Drag handler (works for both touch and mouse)
const handleDrag = (clientX: number, clientY: number) => {
  const wheelCenter = getWheelCenter() // centre of SVG element
  const angle = Math.atan2(clientY - wheelCenter.y, clientX - wheelCenter.x)
  const angleDeg = angle * (180 / Math.PI)
  const delta = angleDeg - prevAngle
  setRotation(prev => prev + delta)
  // Track velocity for momentum
  setVelocity(delta) // smoothed over last few frames
  prevAngle = angleDeg
}
```

**Touch events to handle:**
- `onTouchStart` / `onMouseDown` → begin drag, stop auto-rotation
- `onTouchMove` / `onMouseMove` → update rotation angle
- `onTouchEnd` / `onMouseUp` → release with momentum
- All touch events need `{ passive: false }` to prevent page scroll while interacting with wheel

#### Mode 3: Information — Tap to Explore

Distinct from dragging. A **tap** (touch down + touch up in roughly the same position, <200ms, <10px movement) triggers the detail panel.

**Hit detection priority** (check in order):
1. **Planet markers** — largest hit area (planet orb + 20px padding for fat finger tolerance)
2. **Aspect lines** — 16px wide hit zone around each line
3. **Zodiac sign segments** — the 30° arc segment of the outer ring

On tap:
- The tapped element **highlights** (brief bright pulse animation)
- A **bottom sheet** slides up from below (mobile) or a **side panel** slides in from right (desktop, >768px)
- The sheet/panel contains the detail content for that element (as spec'd in main build doc)
- **Dimming**: A subtle dark overlay appears behind the sheet but in front of the wheel, so the wheel is still partially visible
- **Dismiss**: Swipe down on the sheet handle, tap the dim overlay, or tap the ✕ button
- While the sheet is open, the wheel continues its behaviour (auto-rotate or momentum) — it doesn't freeze

### Zoom (Phase 1 — Optional Enhancement)

If build time allows, add pinch-to-zoom on mobile and scroll-wheel zoom on desktop:

```
Min zoom: 1.0× (full wheel visible)
Max zoom: 2.5× (close-up on a section)
Zoom centre: pinch midpoint or cursor position
Pan: When zoomed in, user can drag to pan around the wheel
Double-tap: Toggles between 1.0× and 1.5× zoom (quick zoom shortcut)
```

If zoom adds too much complexity for Phase 1, skip it and add in Phase 1.5. The drag/rotate interaction is the must-have.

---

## Wheel Visual Polish Details

### Planet Markers — Not Just Dots

Each planet marker should feel dimensional and alive:

```
┌──────────────────────────────────┐
│  Outer glow: 20px radial blur    │
│  in the planet's colour at 30%   │
│  opacity — creates atmosphere    │
│                                  │
│    ┌────────────────────┐        │
│    │ Inner orb: 12-16px │        │
│    │ solid circle with  │        │
│    │ radial gradient     │        │
│    │ (lighter centre)   │        │
│    └────────────────────┘        │
│                                  │
│  Label below: glyph + degree     │
│  e.g. "☉ 14°"                   │
│  Font: DM Sans, 11px            │
│  Colour: planet colour at 80%   │
└──────────────────────────────────┘
```

- Each orb has a subtle **breathing animation**: the glow slowly pulses (opacity 0.2 → 0.4 → 0.2 over 3-5 seconds), each planet on a slightly different cycle so they don't sync up
- **Retrograde indicator**: When a planet is retrograde, add a small `Rx` label or a subtle backwards-spinning ring around the orb
- **Planet size hierarchy**: Sun and Moon orbs are slightly larger (16px), inner planets 14px, outer planets 12px — reflects their astrological weight

### Zodiac Ring Segments

```
Each 30° segment:
- Background: element colour at 8-12% opacity
- Border between segments: 1px line at white 6% opacity
- Sign glyph centred in the arc: 16px, white at 50% opacity
- Sign name below glyph in small text: 9px, white at 25% opacity
- HOVER/active: segment brightens to 20% opacity, glyph to 80%
```

### Aspect Lines

```
- Default: 1px line, aspect colour at 25% opacity (subtle, not cluttered)
- Major aspects only in Phase 1: conjunction (0°), opposition (180°), 
  trine (120°), square (90°), sextile (60°)
- Applying aspects (getting more exact): slightly brighter (40% opacity)
- Separating aspects (moving apart): dimmer (15% opacity)
- When a planet is tapped: ONLY show aspects involving that planet,
  hide all others. This prevents visual clutter.
- Aspect lines have a very subtle pulse animation (opacity wobble)
```

### Centre of Wheel

```
- Subtle Astrara logo watermark at 5% opacity (or just the letter 'A')
- OR: a tiny dot representing Earth (since the chart is geocentric)
- Gentle radial gradient emanating from centre (creates depth)
```

---

## Wheel Responsiveness

### Mobile (< 768px)
```
Wheel diameter: 90vw (nearly full width)
Positioned: centred horizontally, with ~16px margin top
Touch: primary interaction method
Bottom sheet: slides up covering ~60% of screen height
Planet labels: may need to hide at default zoom, show on interaction
```

### Tablet (768px - 1024px)
```
Wheel diameter: 60vw
Positioned: centred or left-aligned with weather panel on right
Touch + mouse: both supported
Side panel: slides in from right, 40% width
```

### Desktop (> 1024px)
```
Wheel diameter: min(500px, 45vw)
Layout: Wheel on left, cosmic weather panel on right
Mouse: hover states on planets/signs, click to select
Side panel: always-visible sidebar that updates content on click
Wheel interaction: click and drag to rotate, scroll to zoom
```

---

## Performance Considerations

- **SVG, not Canvas** — the wheel MUST be SVG so individual elements (planets, signs, aspect lines) are real DOM nodes that can receive click/tap events and CSS hover states. Canvas would require manual hit-testing.
- **Transform for rotation** — rotate the entire SVG group via `transform: rotate(${angle}deg)` on a parent `<g>` element, NOT by recalculating every element's position. This is GPU-accelerated.
- **Counter-rotate labels** — planet labels and sign names must counter-rotate so text always reads upright regardless of wheel rotation: `transform: rotate(-${angle}deg)` on each label `<text>` element.
- **Throttle recalculations** — astronomy-engine calculations run once per minute (planets barely move), NOT on every frame. The animation loop only updates the rotation angle.
- **requestAnimationFrame** for all animations — no setInterval.
- **will-change: transform** on the wheel container for GPU compositing hint.

---

## Summary: What Makes This Wheel Special

1. **It's alive** — always slowly spinning, planets gently glowing
2. **It's tactile** — grab it, spin it, feel the momentum, let it settle
3. **It's informative** — tap anything and learn something, written for a 10-year-old
4. **It's accurate** — real ephemeris data, real planetary positions, verified against NASA
5. **It's cinematic** — the kind of thing you'd screen-record for TikTok or leave running on your wall

This is not a horoscope chart. It's a **living celestial instrument**.
