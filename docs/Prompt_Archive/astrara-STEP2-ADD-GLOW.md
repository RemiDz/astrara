# Astrara — Step 2 of 2: Re-add Minimal Reading Animation to Restored Wheel

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

## PREREQUISITE

Step 1 must be complete. The wheel must be fully restored and displaying correctly at full size with no clipping. Verify this before proceeding. If the wheel is still clipped or broken, STOP and do not proceed.

---

## OBJECTIVE

Add MINIMAL reading integration to the restored AstroWheel3D. Only two things:
1. Subtle planet dim effect (reduce opacity of non-highlighted planets)
2. Subtle planet glow (small coloured halo around highlighted planet)

NO camera movement. NO aspect lines. Keep it simple and safe.

---

## STEP 1: Add readingAnimation prop to AstroWheel3DWrapper

In `src/components/AstroWheel/AstroWheel3DWrapper.tsx`, add to the Props interface:

```typescript
readingAnimation?: {
  isActive: boolean
  highlights: Array<{ bodyId: string; effect: string; color?: string; intensity: number }>
  dimOpacity: number
}
```

Pass it through to `<AstroWheel3D {...props} />`.

In `AstroWheel3D.tsx`, add the same prop to the `AstroWheel3DProps` interface.

---

## STEP 2: Add dim opacity to planets

In `AstroWheel3D.tsx`, find where planets are rendered in a `.map()` loop. For each `<PlanetOrb>`, calculate dim opacity:

```tsx
{planets.map((planet) => {
  const isHighlighted = readingAnimation?.isActive && readingAnimation.highlights.some(h => h.bodyId === planet.id)
  const dimOpacity = readingAnimation?.isActive
    ? (isHighlighted ? undefined : readingAnimation.dimOpacity)
    : undefined

  return (
    <PlanetOrb
      key={planet.id}
      planet={planet}
      // ... all existing props unchanged ...
      readingDimOpacity={dimOpacity}
    />
  )
})}
```

In the `PlanetOrb` component, find where the planet's main mesh material is defined. Add an optional `readingDimOpacity` prop:

```typescript
readingDimOpacity?: number  // Add to PlanetOrb props
```

When `readingDimOpacity` is a number (not undefined), multiply the material's opacity:

```tsx
// Inside PlanetOrb, on the main planet mesh material:
opacity={readingDimOpacity !== undefined ? readingDimOpacity : existingOpacity}
transparent={readingDimOpacity !== undefined ? true : existingTransparent}
```

When `readingDimOpacity` is `undefined`, change NOTHING about how the planet renders.

---

## STEP 3: Add a simple glow component

Create `src/features/cosmic-reading/animation/PlanetGlow.tsx`:

```tsx
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

// Reuse the same position calculation as the main wheel
function longitudeToPosition(longitude: number, radius: number): [number, number, number] {
  const rad = (longitude - 90) * (Math.PI / 180)
  return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius]
}

const R_PLANET = 1.5  // Must match the wheel's planet track radius

interface PlanetGlowProps {
  highlights: Array<{ bodyId: string; color?: string; intensity: number }>
  planets: PlanetPosition[]
}

export default function PlanetGlow({ highlights, planets }: PlanetGlowProps) {
  return (
    <>
      {highlights.map(h => {
        const planet = planets.find(p => p.id === h.bodyId)
        if (!planet) return null
        return (
          <GlowOrb
            key={h.bodyId}
            longitude={planet.eclipticLongitude}
            color={h.color || planet.colour}
            intensity={h.intensity}
          />
        )
      })}
    </>
  )
}

function GlowOrb({ longitude, color, intensity }: { longitude: number; color: string; intensity: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta
    if (ref.current) {
      const s = 0.18 + Math.sin(elapsed.current * 1.5) * 0.03
      ref.current.scale.setScalar(s)
    }
  })

  const pos = longitudeToPosition(longitude, R_PLANET)

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12 * intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
```

Note: The glow sphere geometry has `args={[1, 16, 16]}` (radius 1) and the SCALE is animated between 0.15 and 0.21 via `useFrame`. This means the actual rendered size is ~0.18 units — roughly matching planet size with a slight halo. Very subtle.

---

## STEP 4: Add PlanetGlow to the wheel scene

In `AstroWheel3D.tsx`, import PlanetGlow:

```typescript
import PlanetGlow from '@/features/cosmic-reading/animation/PlanetGlow'
```

Add it AFTER all existing scene content, BEFORE `<OrbitControls>`:

```tsx
{/* Subtle reading glow — only when reading is active */}
{readingAnimation?.isActive && readingAnimation.highlights.length > 0 && (
  <PlanetGlow
    highlights={readingAnimation.highlights}
    planets={planets}
  />
)}
```

That's it. No camera controller. No aspect lines. No ReadingCameraController. Just dim + glow.

---

## STEP 5: Wire readingAnimation from page.tsx

In page.tsx, update `ReadingAwareWheel` to pass reading animation again, but with a SIMPLIFIED shape (no camera, no aspect lines):

```tsx
function ReadingAwareWheel(props: React.ComponentProps<typeof AstroWheel3DWrapper>) {
  const animState = useReadingAnimation()
  
  const readingAnimation = useMemo(() => {
    if (!animState.isActive) return undefined
    return {
      isActive: true,
      highlights: Array.from(animState.highlights.entries()).map(([bodyId, h]) => ({
        bodyId,
        effect: h.effect,
        color: h.color,
        intensity: h.intensity,
      })),
      dimOpacity: animState.dimOpacity,
    }
  }, [animState])

  return <AstroWheel3DWrapper {...props} readingAnimation={readingAnimation} />
}
```

Note: No `onAnimationComplete` callback. The reading state machine's fallback timeout (from ReadingContext.tsx) handles phase transitions. Without a camera controller calling `onComplete`, the 1200ms fallback fires automatically.

---

## STEP 6: Verify

```bash
npm run build
```

Then deploy and verify:

### Wheel (must be perfect):
- [ ] Wheel displays at FULL SIZE — identical to before Cosmic Reading
- [ ] No clipping on any side
- [ ] No horizontal overflow
- [ ] Orbit, zoom, planet tap, sign tap all work
- [ ] Solar System View works
- [ ] Loading animation works

### Reading (should work with subtle effects):
- [ ] Start reading → non-highlighted planets dim to ~30% opacity
- [ ] Highlighted planet has a subtle coloured glow halo
- [ ] Glow gently pulses
- [ ] Next phase → dim/glow updates to new planet
- [ ] Exit reading → all planets return to full opacity, glow disappears
- [ ] No camera movement during reading (camera stays where user left it) — this is fine

### Zero regressions:
- [ ] Everything that worked before Step 1 still works
- [ ] Lithuanian translations work
- [ ] Phase transitions work
- [ ] Card content displays correctly

---

## DO NOT CHANGE the wheel container size, overflow, or Canvas wrapper styling. 
## DO NOT add camera movement or aspect lines.
## DO NOT modify any existing component's structure.

Git push: `git push origin master:main`
