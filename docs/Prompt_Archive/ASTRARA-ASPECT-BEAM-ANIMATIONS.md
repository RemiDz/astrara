# Astrara — Cosmic Reading Phase D: Animated Aspect Beam Connections

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## CONTEXT

During Cosmic Reading's Aspect phase, two planets involved in an aspect currently just become brighter while others dim. This upgrade adds animated energy beams between connected planets that visually communicate the nature of the aspect. The beam style differs based on aspect type — harmonious aspects flow, tense aspects crackle.

**Reference the master architecture document at:**
`src/features/cosmic-reading/ARCHITECTURE.md`

This spec covers ONLY the aspect phase animation enhancement. Do NOT modify other phase animations (Moon, Sun, Summary, Frequency).

---

## ANIMATION SEQUENCE

When an aspect phase begins:

### Step 1: Stage Set (0–300ms)
- ALL planets that are NOT involved in the current aspect dim to **20% opacity**
- The two involved planets remain at full brightness
- Use eased opacity transition (ease-out, 300ms)

### Step 2: Planet Pulse (300–700ms)
- Both involved planets pulse: scale 1.0 → 1.3 → 1.0 with a glow intensity increase
- Glow: radial gradient expanding outward from each planet, using the planet's own colour
- Pulse is synchronised — both planets pulse at the same time

### Step 3: Beam Draw (700–1300ms)
- An energy beam draws itself from Planet A to Planet B
- The beam follows the **straight line** between the two planets through the wheel interior (NOT along the zodiac ring arc)
- Draw animation: beam starts as a point at Planet A and extends toward Planet B over 600ms
- When beam reaches Planet B, a small light burst occurs at the arrival point (100ms flash)

### Step 4: Synchronised Pulse (1300–1600ms)
- Both planets pulse once together (scale 1.0 → 1.15 → 1.0)
- The beam pulses in brightness simultaneously
- This signals "connection established"

### Step 5: Idle Shimmer (1600ms → until user taps Next)
- Beam stays visible with a subtle animated shimmer:
  - A light particle slowly travels back and forth along the beam (3s loop)
  - Beam opacity gently oscillates between 60% and 100% (2s cycle)
  - Both planets maintain a soft pulsing glow (slow, 4s cycle)
- This keeps the wheel feeling alive while the user reads the card

### Step 6: Exit (user taps Next — 400ms)
- Beam fades out (opacity → 0, 400ms ease-in)
- Dimmed planets restore to normal opacity (400ms)
- Involved planets' extra glow fades (400ms)
- All transitions happen simultaneously

---

## BEAM VISUAL STYLES BY ASPECT TYPE

Each aspect type has a distinct beam style that communicates its energy:

### Conjunction (☌) — Merging Energies
- **No beam** — planets are at the same position
- Instead: a shared expanding glow ring around both planets
- Ring: planet colour blend, expands from 0 to 2x planet radius, pulses
- Both planets pulse in unison more intensely than other aspects

### Sextile (⚹) — Supportive Connection
- **Beam style:** Soft, flowing, gentle
- **Colour:** `#88BBFF` (soft blue-white)
- **Width:** 1.5px core + 6px soft glow
- **Opacity:** 50% core, 15% glow
- **Shimmer:** Gentle, slow-moving light particle (4s loop)
- **Feel:** Like a calm stream of light

### Square (□) — Creative Tension
- **Beam style:** Jagged, flickering, electric
- **Colour:** `#FF6B4A` (red-orange)
- **Width:** 1px core + 8px intermittent glow
- **Opacity:** 70% core, flickers between 10% and 30% glow
- **Shimmer:** Irregular crackle — randomised opacity pulses along the beam (use noise-based flickering, NOT uniform oscillation)
- **Feel:** Like contained lightning or a tense electrical arc
- **Implementation:** Use a vertex-displaced line or multiple short segments with randomised y-offsets (±2-3px perpendicular to beam direction) that re-randomise every 200ms

### Trine (△) — Natural Flow
- **Beam style:** Bright, smooth, confident
- **Colour:** `#4ADE80` → `#FFD700` gradient (green to gold, flowing along beam direction)
- **Width:** 2px core + 10px warm glow
- **Opacity:** 80% core, 25% glow
- **Shimmer:** Smooth, confident light particle (2.5s loop) — the brightest and most beautiful beam
- **Feel:** Like a golden river of light

### Opposition (☍) — Balancing Act
- **Beam style:** Dual-pulse, stretching through centre
- **Colour:** `#A78BFA` → `#FF8C00` gradient (purple to amber, one colour per end)
- **Width:** 1.5px core + 8px dual-tone glow
- **Opacity:** 60% core, 20% glow
- **Shimmer:** TWO light particles travelling from opposite ends toward the centre, meeting in the middle, then reversing (3s loop)
- **Feel:** Like a tug-of-war, energy pushing from both sides

---

## THREE.JS IMPLEMENTATION

### Where to Build

Create or extend files in:
```
src/features/cosmic-reading/animation/
├── AspectBeam.tsx              # R3F component: the beam itself
├── AspectBeamShader.ts         # Custom shader material for beam effects (optional — see below)
└── useAspectAnimation.ts       # Hook controlling the aspect animation sequence
```

### Beam Geometry Approach

**Recommended: Line2 from drei or custom BufferGeometry**

For smooth, variable-width beams with glow:

```typescript
// Core beam: a thin line between two 3D positions
// Glow beam: a wider, semi-transparent plane billboard-aligned to camera

// Planet positions are already available from the existing wheel
// Access them from the same data source the planet meshes use
```

**Option A — Simple (use this first):**
- Core beam: `<Line>` from `@react-three/drei` between planet positions
- Glow: Second `<Line>` with wider lineWidth and lower opacity
- Shimmer: Animated uniform in a custom ShaderMaterial controlling a travelling bright spot

**Option B — Advanced (if Option A looks too basic):**
- Beam as a flat `PlaneGeometry` stretched between the two planet positions, billboard-aligned
- Custom fragment shader with:
  - Base colour/gradient
  - Animated UV-based travelling light particle
  - Noise-based displacement for Square aspect type
  - Opacity falloff at edges

Start with **Option A**. Only move to Option B if the visual quality isn't sufficient.

### Shimmer Animation

The travelling light particle effect on the beam:

```typescript
// In useFrame callback:
const shimmerPosition = (Math.sin(clock.elapsedTime * speed) + 1) / 2; // 0 to 1, oscillating

// Pass shimmerPosition as a uniform to the beam material
// In the shader/material: brighten the beam at the UV position matching shimmerPosition
```

For the Square aspect's crackle effect:
```typescript
// Randomise vertex offsets perpendicular to the beam direction
// Update every 150-200ms (not every frame — that would look like vibration, not crackle)
const timer = useRef(0);
useFrame((_, delta) => {
  timer.current += delta;
  if (timer.current > 0.18) {
    timer.current = 0;
    // Regenerate random offsets for beam vertices
  }
});
```

### Planet Glow Enhancement

During aspect animation, the two involved planets need enhanced glow:

```typescript
// Add a sprite or point light at each involved planet's position
// Colour: planet's own colour
// Intensity: animated (pulse cycle)
// Size: 1.5x planet radius

// Use <Sprite> with an additive-blended radial gradient texture
// Or use <pointLight> with animated intensity
```

### Integration with Reading State Machine

The animation hook must listen to the reading state:

```typescript
function useAspectAnimation(readingState, currentPhase) {
  // Only activate when:
  // 1. readingState === 'PHASE_ANIMATING' or 'PHASE_READING'
  // 2. currentPhase.type === 'aspects'
  
  // Extract from currentPhase:
  // - planet1Id, planet2Id (which planets to connect)
  // - aspectType ('conjunction' | 'sextile' | 'square' | 'trine' | 'opposition')
  
  // On phase enter (PHASE_ANIMATING):
  //   1. Start the 6-step animation sequence
  //   2. After step 4 completes, dispatch ANIMATION_COMPLETE to advance to PHASE_READING
  
  // On phase exit (user taps Next → PHASE_TRANSITIONING):
  //   1. Play exit animation (step 6)
  //   2. Clean up
}
```

### Getting Planet 3D Positions

The beam needs to know where the two planets are in 3D space. The existing wheel already positions planets — find where planet meshes get their positions and expose those coordinates.

Options:
- If planets use `useRef` on their mesh, expose refs via context
- If positions are calculated in a data hook, reuse that calculation
- If needed, create a shared `planetPositionsRef` that the wheel updates and the beam reads

Search for how planet positions are currently set:
```bash
grep -rn "position" src/components/*Planet* src/components/*planet*
grep -rn "planetPos\|planetPosition\|orbitRadius" src/
```

---

## HANDLING MULTIPLE ASPECTS IN ONE PHASE

If the Aspects phase includes multiple aspects (e.g., 3 sextiles), each aspect gets its own sub-step within the phase:

1. First aspect beam draws → user reads card → taps Next
2. First beam fades → second aspect beam draws → user reads → taps Next
3. Continue until all aspects shown
4. Move to next phase (Retrogrades or Frequency)

**Check how the current phase system handles multiple aspects.** If aspects are already split into individual phase entries (one per aspect), this works automatically. If they're grouped into one phase, the animation hook needs to track a sub-index within the aspect phase.

---

## PERFORMANCE CONSIDERATIONS

- Beams are simple geometry — no performance concern
- Glow sprites are lightweight — one per involved planet
- Shimmer animation runs in `useFrame` — keep calculations minimal
- Square crackle only updates every ~180ms, not every frame
- Dispose of beam geometry and materials on phase exit to prevent memory leaks
- Test on mobile — if glow effects cause frame drops, reduce glow sprite resolution or remove the outer glow layer on mobile (keep core beam only)

---

## TESTING

- [ ] Sextile aspect: soft blue flowing beam between two planets
- [ ] Trine aspect: bright gold-green beam, the most visually impressive
- [ ] Square aspect: jagged red-orange crackling beam
- [ ] Opposition aspect: dual-pulse purple-amber beam through centre
- [ ] Conjunction aspect: shared glow ring, no beam
- [ ] Non-involved planets dim to ~20% during aspect animation
- [ ] Beam draws from planet A to planet B (not instant)
- [ ] Shimmer particle travels along beam during idle state
- [ ] Beam fades on Next tap, planets restore to normal
- [ ] Multiple aspects play sequentially (if applicable)
- [ ] Animation works on both mobile and desktop
- [ ] No frame rate drops on mobile during beam animation
- [ ] No memory leaks — check that beams are disposed on phase exit
- [ ] Cosmic Reading still works end-to-end with new animations
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "feat: animated aspect beams in Cosmic Reading — styled by aspect type with shimmer effects"
git push origin master:main
```
