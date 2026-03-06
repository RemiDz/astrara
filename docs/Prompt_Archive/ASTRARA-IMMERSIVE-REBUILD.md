# ASTRARA — Rebuild Immersive Universe: Realistic Deep Space

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

The current Immersive Universe mode looks terrible — visible squares, unrealistic colour blobs, ugly nebula shapes. DELETE everything related to the current immersive universe implementation (nebula sprites, galaxy textures, all canvas-generated textures) and rebuild from scratch.

Read all current starfield and immersive universe source files before making changes.

---

## Step 1: Delete Current Nebula/Galaxy Implementation

Remove ALL of the following:
- All nebula sprite meshes and their generated canvas textures
- All galaxy sprite meshes
- Any `PlaneGeometry` or `Sprite` used for nebula/galaxy effects
- Any `createNebulaTexture` or `createGalaxyTexture` functions

Keep the THREE star layers (deep field, mid-field, accent stars) — those are fine.

---

## Step 2: Rebuild Nebulae as Particle Clouds

Instead of flat textured planes (which always look fake), create nebulae from THOUSANDS of tiny semi-transparent particles arranged in soft cloud formations. This is how professional space visualisations work.

### Nebula Cloud Component

Each nebula is a `Points` cloud with particles distributed in a 3D gaussian/elliptical cluster:

```typescript
interface NebulaConfig {
  centreX: number
  centreY: number
  centreZ: number
  spreadX: number    // width of the cloud
  spreadY: number    // height of the cloud
  spreadZ: number    // depth of the cloud
  particleCount: number
  colour1: string    // primary colour
  colour2: string    // secondary colour (for variation)
  maxOpacity: number
}

function NebulaCloud({ config, visible }: { config: NebulaConfig; visible: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const targetOpacity = useRef(0)

  const { positions, colours, sizes } = useMemo(() => {
    const count = config.particleCount
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)

    const c1 = new THREE.Color(config.colour1)
    const c2 = new THREE.Color(config.colour2)

    for (let i = 0; i < count; i++) {
      // Gaussian distribution — most particles near centre, fewer at edges
      const gaussianRandom = () => {
        let u = 0, v = 0
        while (u === 0) u = Math.random()
        while (v === 0) v = Math.random()
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
      }

      pos[i * 3] = config.centreX + gaussianRandom() * config.spreadX
      pos[i * 3 + 1] = config.centreY + gaussianRandom() * config.spreadY
      pos[i * 3 + 2] = config.centreZ + gaussianRandom() * config.spreadZ

      // Blend between two colours with random variation
      const blend = Math.random()
      const mixed = c1.clone().lerp(c2, blend)
      col[i * 3] = mixed.r
      col[i * 3 + 1] = mixed.g
      col[i * 3 + 2] = mixed.b

      // Larger particles near centre, smaller at edges
      const distFromCentre = Math.abs(gaussianRandom())
      siz[i] = Math.max(0.3, 2.0 - distFromCentre * 0.5)
    }

    return { positions: pos, colours: col, sizes: siz }
  }, [])

  // Fade in/out
  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const target = visible ? config.maxOpacity : 0
    targetOpacity.current += (target - targetOpacity.current) * delta * 0.7
    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = targetOpacity.current
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={config.particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={config.particleCount} array={colours} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
```

### Create a Soft Circular Particle Texture

For softer-looking particles instead of hard squares, generate a small radial gradient texture:

```typescript
const nebulaParticleTexture = useMemo(() => {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)')
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}, [])

// Add to the material:
<pointsMaterial
  map={nebulaParticleTexture}
  size={1.5}
  vertexColors
  transparent
  opacity={0}
  depthWrite={false}
  blending={THREE.AdditiveBlending}
  sizeAttenuation
/>
```

---

## Step 3: Place 4–5 Nebula Clouds

Position them FAR behind the wheel (large negative Z values) so they're deep in the background:

```typescript
const NEBULA_CONFIGS: NebulaConfig[] = [
  {
    // Large purple-blue cloud — upper left
    centreX: -50, centreY: 30, centreZ: -120,
    spreadX: 25, spreadY: 18, spreadZ: 8,
    particleCount: 800,
    colour1: '#1e1040',   // deep purple
    colour2: '#0d1f3c',   // dark blue
    maxOpacity: 0.35,
  },
  {
    // Teal-cyan wisp — upper right
    centreX: 40, centreY: 25, centreZ: -110,
    spreadX: 15, spreadY: 20, spreadZ: 6,
    particleCount: 500,
    colour1: '#0a2a2a',   // deep teal
    colour2: '#0d1f3c',   // dark blue
    maxOpacity: 0.25,
  },
  {
    // Warm dust — lower centre
    centreX: 5, centreY: -35, centreZ: -130,
    spreadX: 30, spreadY: 12, spreadZ: 10,
    particleCount: 600,
    colour1: '#2a1a0a',   // warm brown
    colour2: '#1a0a1a',   // dark mauve
    maxOpacity: 0.20,
  },
  {
    // Faint blue haze — centre background
    centreX: 0, centreY: 0, centreZ: -140,
    spreadX: 40, spreadY: 30, spreadZ: 15,
    particleCount: 1000,
    colour1: '#0a0a20',   // very dark blue
    colour2: '#100a18',   // very dark purple
    maxOpacity: 0.15,
  },
  {
    // Small bright accent — far right
    centreX: 55, centreY: -10, centreZ: -100,
    spreadX: 8, spreadY: 10, spreadZ: 5,
    particleCount: 300,
    colour1: '#1a0a2a',   // dark violet
    colour2: '#0a1a2a',   // dark teal
    maxOpacity: 0.30,
  },
]
```

### CRITICAL: Colour Palette Rules

The nebula colours must be VERY dark and desaturated. This is deep space, not a Hubble poster:

- NO bright purples, pinks, or blues
- NO saturated colours of any kind
- Every colour should be almost black with just a HINT of hue
- RGB values should all be below 50 (out of 255)
- The overall effect should be: "wait, is that a nebula or am I imagining it?" — barely perceptible clouds that add depth without drawing attention

Think of it like looking at the Milky Way from a dark sky location — you see faint, ghostly clouds, not colourful explosions.

---

## Step 4: Very Slow Drift Animation

Each nebula cloud should drift EXTREMELY slowly — barely perceptible movement that gives the background a sense of life:

```typescript
useFrame(({ clock }) => {
  if (!pointsRef.current) return
  // Drift the entire cloud position very slowly
  const t = clock.elapsedTime
  pointsRef.current.position.x = config.centreX + Math.sin(t * 0.008) * 0.5
  pointsRef.current.position.y = config.centreY + Math.cos(t * 0.006) * 0.3
})
```

Speed `0.008` means one full cycle takes ~785 seconds (~13 minutes). The movement is so slow you'd only notice it if you stared at one spot for minutes. This is intentional.

---

## Step 5: Immersive Universe Toggle

- When `immersiveUniverse` is OFF: all nebula clouds have `visible={false}` → they fade out over 3 seconds
- When `immersiveUniverse` is ON: all nebula clouds have `visible={true}` → they fade in over 3 seconds
- The three star layers (deep, mid, accent) are ALWAYS visible regardless of toggle — only nebulae are toggled

---

## Step 6: Performance

- Total particles across all 5 clouds: ~3200 — well within budget
- All positions computed once in `useMemo`
- `useFrame` per cloud: one opacity lerp + two position offsets — minimal
- `AdditiveBlending` + `sizeAttenuation` for natural depth
- `depthWrite: false` prevents z-fighting
- Particles far behind the wheel (z: -100 to -140) so they never interfere with interaction

---

## Do NOT

- Do NOT use flat plane textures or sprites for nebulae — particles only
- Do NOT use bright or saturated colours — everything must be very dark
- Do NOT make nebulae visible when immersive mode is off
- Do NOT create visible edges, squares, or boundaries
- Do NOT touch the three star layers — keep them as they are
- Do NOT touch the wheel, planets, rings, or any other elements
- Do NOT make the nebulae so bright they distract from the wheel

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: immersive OFF → only stars visible, no nebulae
3. Test: immersive ON → nebulae fade in over 3 seconds
4. Test: nebulae are barely visible — dark ghostly clouds, NOT colourful blobs
5. Test: NO visible squares, rectangles, or hard edges anywhere
6. Test: nebulae are clearly behind the wheel — no overlap with planets
7. Test: very slow drift is perceptible only if you watch carefully
8. Test: immersive OFF → nebulae fade out smoothly
9. Test: performance on mobile — no frame drops
10. Test: the overall effect feels like real deep space — subtle and atmospheric
11. Commit: `feat: rebuild immersive universe — particle cloud nebulae`
12. Push to `main`
