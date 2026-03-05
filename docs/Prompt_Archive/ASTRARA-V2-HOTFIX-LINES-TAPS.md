# ASTRARA v2 — Hotfix: Aspect Lines, Zodiac Tap, Container Highlight

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Three bugs to fix on the wheel. Read all current wheel-related source files before making changes.

---

## Bug 1: Aspect Lines Broken

The lines connecting planets (aspects) are visually broken — they appear to go to wrong positions, extend outside the wheel, or don't connect to the correct planets.

### Root Cause

The aspect lines are likely using stale or incorrectly transformed coordinates. When the wheel rotates, the planet positions in 3D space change, but the aspect lines may not be updating to match.

### Fix

Aspect lines must be drawn between the **actual current 3D world positions** of the planet meshes, NOT from the initial calculated positions.

```tsx
// Use refs on each planet group to get real-time world positions
const planetRefs = useRef<Record<string, THREE.Group>>({})

// For each planet in the scene:
<group 
  ref={(el) => { if (el) planetRefs.current[planet.name] = el }}
  position={[planetX, planetY, planetZ]}
>
  {/* planet mesh */}
</group>

// Aspect lines component — reads positions every frame
function AspectLines({ aspects, planetRefs }: Props) {
  const linesRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    // Update line positions from actual planet world positions each frame
    // This ensures lines follow planets during rotation
  })
  
  return (
    <group ref={linesRef}>
      {aspects.map((aspect, i) => {
        const p1Ref = planetRefs.current[aspect.planet1]
        const p2Ref = planetRefs.current[aspect.planet2]
        if (!p1Ref || !p2Ref) return null
        
        // Get world positions
        const pos1 = new THREE.Vector3()
        const pos2 = new THREE.Vector3()
        p1Ref.getWorldPosition(pos1)
        p2Ref.getWorldPosition(pos2)
        
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  pos1.x, pos1.y, pos1.z,
                  pos2.x, pos2.y, pos2.z,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color={aspect.colour} 
              transparent 
              opacity={0.25}
              linewidth={1}
            />
          </line>
        )
      })}
    </group>
  )
}
```

**Critical**: The aspect lines group must be **outside** the rotating wheel group — or if inside, their positions must be calculated in the same coordinate space as the planets. The simplest approach:

- Put aspect lines INSIDE the same parent `<group>` that contains the planets
- Use the LOCAL positions of the planets (not world positions) since they share the same parent
- This way when the parent group rotates, both planets AND their connecting lines rotate together

```tsx
<group ref={wheelGroupRef}>
  {/* All planets */}
  {planets.map(planet => <PlanetOrb key={planet.name} ... />)}
  
  {/* Aspect lines — INSIDE the same group as planets */}
  {aspects.map(aspect => {
    const p1Pos = getPlanetLocalPosition(aspect.planet1) // [x, y, z]
    const p2Pos = getPlanetLocalPosition(aspect.planet2)
    return (
      <Line
        key={`${aspect.planet1}-${aspect.planet2}`}
        points={[p1Pos, p2Pos]}
        color={aspect.colour}
        lineWidth={1}
        transparent
        opacity={0.2}
      />
    )
  })}
</group>
```

Using drei's `<Line>` component is the simplest approach. Make sure `points` is an array of two `[x, y, z]` arrays or Vector3 objects.

---

## Bug 2: Zodiac Sign Taps Not Working

Tapping zodiac sign badges on the wheel does not trigger any action.

### Root Cause

The zodiac sign badges are likely rendered as `<Html>` overlays with `pointerEvents: 'none'` (set for labels), or they don't have click handlers attached, or the OrbitControls is consuming the events.

### Fix

Every zodiac sign badge MUST be a clickable `<button>` inside an `<Html>` overlay with `pointerEvents: 'auto'`:

```tsx
{zodiacSigns.map((sign, index) => {
  const angle = (index * 30 + 15) * (Math.PI / 180) // centre of each 30° segment
  const radius = 2.2 // outer ring radius — adjust to match current wheel
  const x = radius * Math.cos(angle)
  const z = radius * Math.sin(angle)
  
  return (
    <group key={sign.name} position={[x, 0, z]}>
      <Html
        center
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'auto' }}  // CRITICAL — must be 'auto' not 'none'
        occlude={false}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onSignTap(sign)
          }}
          onPointerDown={(e) => e.stopPropagation()}  // prevent OrbitControls from capturing
          className="flex items-center justify-center select-none cursor-pointer
                     w-11 h-11 rounded-lg
                     active:scale-90 transition-transform duration-150"
          style={{
            background: `${sign.colour}15`,
            border: `1px solid ${sign.colour}30`,
            fontSize: '18px',
            color: sign.colour,
            textShadow: `0 0 12px ${sign.colour}60`,
          }}
        >
          {sign.glyph}
        </button>
      </Html>
    </group>
  )
})}
```

**Key details:**
- `style={{ pointerEvents: 'auto' }}` on the `<Html>` component — without this, clicks pass through to the canvas
- `e.stopPropagation()` on both `onClick` and `onPointerDown` — prevents the event from reaching OrbitControls
- `occlude={false}` — ensures the badge is always visible even if behind 3D geometry
- The `<button>` must have a minimum 44×44px tap area (`w-11 h-11`)

### What happens on tap

For now (until iteration 8 with full zodiac detail panels is implemented), show a simple alert or console log to verify taps work. If a basic detail panel already exists, wire it up:

```tsx
const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null)

const handleSignTap = (sign: ZodiacSign) => {
  setSelectedSign(sign)
  // Open detail panel / bottom sheet
}
```

---

## Bug 3: Entire Wheel Container Gets Highlighted on Tap

When tapping the wheel area, a browser selection highlight (blue/grey overlay) appears on the entire canvas container. This is the browser's default tap highlight behaviour.

### Fix

Add these CSS rules to the canvas container AND globally:

```css
/* In globals.css */
canvas,
canvas + div,  /* drei Html overlay container */
[data-engine],  /* Three.js canvas attribute */
.wheel-container {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  outline: none;
}
```

Also add directly on the canvas container div:

```tsx
<div 
  className="relative w-full select-none"
  style={{ 
    height: '95vw',
    maxHeight: '550px',
    overflow: 'visible',
    touchAction: 'none',
    WebkitTapHighlightColor: 'transparent',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    outline: 'none',
  }}
>
```

And add `tabIndex={-1}` to prevent the canvas from being focusable:

```tsx
<Canvas
  tabIndex={-1}
  style={{ 
    background: 'transparent',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
  }}
>
```

---

## Build Steps

1. Read current wheel component, aspect lines, and zodiac badge code
2. Fix aspect lines — ensure they're in the same group as planets and using correct coordinates
3. Fix zodiac sign taps — add pointerEvents: 'auto', stopPropagation, clickable buttons
4. Fix container highlight — add tap-highlight-color: transparent and user-select: none everywhere
5. Test: aspect lines correctly connect the right planets and stay connected during rotation
6. Test: tap each zodiac sign — verify tap registers (console.log or panel opens)
7. Test: tap/drag the wheel — no blue/grey highlight flashes
8. Test: planet taps still work alongside zodiac taps
9. Push to **main** branch (not master)
10. Run `npm run build`
11. Commit: `fix: aspect lines, zodiac sign taps, container highlight`
