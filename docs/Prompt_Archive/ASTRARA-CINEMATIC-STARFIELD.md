# ASTRARA — Cinematic Starfield & Immersive Universe

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

The current starfield background is basic random blinking dots that flash harshly. We're replacing it with a beautiful, layered cosmic environment that feels like gazing into deep space. The user gets a single toggle in settings: "Immersive Universe" — OFF gives a clean refined starfield, ON adds nebula clouds and galaxy depth.

Read all current starfield/background source files before making changes. Remove or fully replace the existing star implementation.

---

## 1. Architecture

Create a new component: `src/components/starfield/CosmicBackground.tsx`

This component renders BEHIND the astro wheel (lowest z-index / renderOrder). It must NOT interfere with wheel interaction, planet taps, or any UI elements.

The component reads a single boolean from settings/state: `immersiveUniverse` (default: `false`).

---

## 2. Star Layer System

### Layer 1 — Deep Field Stars (always visible)

These are the most distant stars — thousands of tiny pinpoints.

```typescript
const DEEP_STAR_COUNT = 1500

// Generate once, store in useMemo
const deepStars = useMemo(() => {
  const positions = new Float32Array(DEEP_STAR_COUNT * 3)
  const opacities = new Float32Array(DEEP_STAR_COUNT)
  const twinkleSpeeds = new Float32Array(DEEP_STAR_COUNT)
  const twinkleOffsets = new Float32Array(DEEP_STAR_COUNT)
  const sizes = new Float32Array(DEEP_STAR_COUNT)

  for (let i = 0; i < DEEP_STAR_COUNT; i++) {
    // Distribute on a large sphere shell around the scene
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 80 + Math.random() * 40  // far away

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    opacities[i] = 0.3 + Math.random() * 0.5
    twinkleSpeeds[i] = 0.15 + Math.random() * 0.35  // 3–8 second cycle
    twinkleOffsets[i] = Math.random() * Math.PI * 2  // random phase
    sizes[i] = 0.3 + Math.random() * 0.5
  }

  return { positions, opacities, twinkleSpeeds, twinkleOffsets, sizes }
}, [])
```

**Twinkle animation** — smooth sine wave, NOT on/off blinking:

```typescript
useFrame(({ clock }) => {
  const time = clock.elapsedTime
  const opacityAttr = pointsRef.current?.geometry.attributes.opacity

  if (!opacityAttr) return

  for (let i = 0; i < DEEP_STAR_COUNT; i++) {
    const base = deepStars.opacities[i]
    const speed = deepStars.twinkleSpeeds[i]
    const offset = deepStars.twinkleOffsets[i]
    // Smooth breathing: oscillates between 40% and 100% of base opacity
    opacityAttr.array[i] = base * (0.4 + 0.6 * (Math.sin(time * speed + offset) * 0.5 + 0.5))
  }

  opacityAttr.needsUpdate = true
})
```

**Material:** Use `Points` with a custom shader or `PointsMaterial` with vertex colours. Star colour should be mostly white with very subtle variation — 85% pure white, 10% warm (slight yellow/orange tint), 5% cool (slight blue tint). This mimics real star colour distribution.

```typescript
// Colour generation per star
const colour = new THREE.Color()
const roll = Math.random()
if (roll < 0.85) {
  colour.setHSL(0, 0, 0.9 + Math.random() * 0.1)       // white
} else if (roll < 0.95) {
  colour.setHSL(0.08 + Math.random() * 0.05, 0.3, 0.9)  // warm
} else {
  colour.setHSL(0.6 + Math.random() * 0.05, 0.3, 0.9)   // cool blue
}
```

### Layer 2 — Mid-field Stars (always visible)

Fewer, slightly brighter, slightly larger stars that add depth.

```typescript
const MID_STAR_COUNT = 400

// Same distribution but at closer radius (50–75)
// Sizes: 0.6–1.2
// Slower twinkle: 0.08–0.2 speed (5–12 second cycles)
// Higher base opacity: 0.5–0.8
```

### Layer 3 — Accent Stars (always visible)

A handful of notably bright stars with soft glow halos — these are the "landmark" stars that give the sky character.

```typescript
const ACCENT_STAR_COUNT = 20

// Radius: 40–70
// Each accent star is a small sprite (not a point) with a soft radial gradient texture
// Size: 1.5–3.0
// Very slow twinkle: 0.05–0.1 speed (10–20 second cycles)
// A few of these should have a faint cross-shaped diffraction spike effect
// Base opacity: 0.6–0.9
```

For the accent star sprite texture, generate programmatically using a canvas:

```typescript
function createStarSprite(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Soft radial glow
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}
```

---

## 3. Immersive Mode — Nebula Clouds (only when enabled)

When `immersiveUniverse` is `true`, add 3–4 large semi-transparent nebula sprites behind the star layers.

### Nebula Sprite Generation

Generate procedural nebula textures using canvas noise:

```typescript
function createNebulaTexture(
  hue: number,        // 0–1
  saturation: number,  // 0–1
  complexity: number   // 1–5
): THREE.Texture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Black base
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, size, size)

  // Layer multiple soft radial gradients at random positions
  for (let i = 0; i < complexity * 8; i++) {
    const x = size * 0.2 + Math.random() * size * 0.6
    const y = size * 0.2 + Math.random() * size * 0.6
    const radius = size * (0.15 + Math.random() * 0.35)

    const colour = new THREE.Color()
    colour.setHSL(
      hue + (Math.random() - 0.5) * 0.1,
      saturation * (0.5 + Math.random() * 0.5),
      0.3 + Math.random() * 0.2
    )

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, `rgba(${colour.r*255|0}, ${colour.g*255|0}, ${colour.b*255|0}, 0.15)`)
    gradient.addColorStop(0.5, `rgba(${colour.r*255|0}, ${colour.g*255|0}, ${colour.b*255|0}, 0.05)`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}
```

### Place 3–4 Nebula Sprites

```typescript
const nebulae = [
  { hue: 0.75, saturation: 0.6, x: -40, y: 20, z: -90, scale: 60, rotation: 0.3 },    // purple
  { hue: 0.55, saturation: 0.5, x: 35, y: -15, z: -85, scale: 50, rotation: -0.5 },    // teal
  { hue: 0.65, saturation: 0.4, x: 10, y: 30, z: -95, scale: 45, rotation: 0.8 },      // blue-purple
  { hue: 0.08, saturation: 0.3, x: -25, y: -25, z: -80, scale: 35, rotation: -0.2 },   // warm dust
]
```

Each nebula:
- Is a flat `PlaneGeometry` with the generated texture
- Faces the camera (billboard) OR is at a fixed angle looking natural
- Has `transparent: true`, `opacity: 0.4`, `blending: THREE.AdditiveBlending`
- Very slowly rotates: `rotation.z += delta * 0.005` (barely perceptible)
- Very slowly drifts position: `position.x += Math.sin(time * 0.02) * 0.01` (extremely subtle parallax)
- `depthWrite: false`, `depthTest: true`
- Render order BEHIND everything else

### Distant Galaxy Smudge (1–2)

Add 1–2 tiny elliptical galaxy sprites — these are much smaller than nebulae, just soft elongated smudges:

```typescript
function createGalaxyTexture(): THREE.Texture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size / 2  // elliptical
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(size/2, size/4, 0, size/2, size/4, size/3)
  gradient.addColorStop(0, 'rgba(255, 255, 240, 0.6)')
  gradient.addColorStop(0.3, 'rgba(200, 200, 255, 0.2)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size/2)

  return new THREE.CanvasTexture(canvas)
}
```

Place at `z: -100`, scale `4–8`, rotated at an angle. Very subtle — you almost have to look for them.

---

## 4. Immersive Mode Toggle

### Transition Animation

When the user toggles Immersive Universe:

**ON:** Nebulae and galaxies fade in over 3 seconds (opacity 0 → target). Star count doesn't change (all 3 star layers are always present).

**OFF:** Nebulae and galaxies fade out over 2 seconds (opacity → 0), then unmount.

Use a ref to track target opacity and lerp in `useFrame`:

```typescript
const nebulaOpacityTarget = immersiveUniverse ? 0.4 : 0
const currentNebulaOpacity = useRef(0)

useFrame((_, delta) => {
  currentNebulaOpacity.current += (nebulaOpacityTarget - currentNebulaOpacity.current) * delta * (immersiveUniverse ? 0.7 : 1.5)
  // Apply to all nebula materials
})
```

### Settings UI

Add a toggle to the existing settings panel/modal:

```
Immersive Universe          [toggle]
"Adds nebula clouds and distant galaxies to the cosmic background"
```

Store the preference in localStorage so it persists between sessions. Default: `false` (clean mode).

If no settings panel exists yet, add a minimal one accessible from the ⚙️ settings icon in the header.

---

## 5. Loading Sequence

Stars should be part of the wheel loading animation:

1. **Deep field stars** appear first — fade in from black during the first 500ms (this sets the cosmic stage before anything else)
2. **Mid-field stars** fade in 200–600ms
3. **Accent stars** bloom in 400–1000ms with a soft scale-up from 0
4. **Nebulae** (if immersive) fade in 800–2000ms — very slow, like cosmic fog rolling in
5. Then the normal wheel loading sequence begins (Earth ignites, rings ripple, etc.)

The starfield should be fully visible BEFORE the wheel starts building — it's the stage, not an afterthought.

---

## 6. Colour Palette

The overall cosmic background colour palette must complement Astrara's existing design:

- **Dominant:** Deep space black with very subtle blue-purple undertone
- **Nebula palette:** Muted purples (#2D1B4E at 15% opacity), deep teals (#1B3A4E at 12%), warm cosmic dust (#4E3B1B at 8%)
- **NO bright saturated nebula colours** — this isn't a Hubble photo, it's a subtle atmospheric backdrop
- Stars are predominantly white with the warm/cool distribution described above
- The overall effect should feel like looking at the night sky from a very dark location — not a sci-fi movie poster

---

## 7. Performance

This is critical — the starfield must not impact wheel interaction smoothness.

- All star positions computed once in `useMemo`, never recalculated
- Twinkle animation updates only the opacity buffer attribute, not positions
- Nebula textures generated once on mount, cached
- Total particle count: ~1920 points (1500 + 400 + 20) — well within budget
- Nebulae are just 4 textured planes — negligible
- `useFrame` callback for twinkle should skip frames if needed: only update every 2nd frame for deep stars (they're so small the difference is invisible)
- If device is low-performance (detect via `renderer.info.render.triangles` or frame rate dropping below 30fps), automatically reduce DEEP_STAR_COUNT to 800

### Frame Skip for Deep Stars

```typescript
const frameCount = useRef(0)

useFrame(({ clock }) => {
  frameCount.current++
  
  // Deep stars update every 2nd frame
  if (frameCount.current % 2 === 0) {
    updateDeepStarTwinkle(clock.elapsedTime)
  }
  
  // Mid and accent stars update every frame (fewer of them)
  updateMidStarTwinkle(clock.elapsedTime)
  updateAccentStarTwinkle(clock.elapsedTime)
})
```

---

## 8. Do NOT

- Do NOT make stars so bright they compete with planets on the wheel
- Do NOT add shooting stars or animated meteors — that's screensaver territory
- Do NOT use pre-made skybox textures — everything is procedural
- Do NOT make nebulae opaque enough to create visible shapes — they should be ambient fog
- Do NOT add parallax movement when the wheel rotates — the starfield is a fixed backdrop
- Do NOT touch any wheel elements, planet visuals, Earth Kp aura, or Sun flare glow
- Do NOT add any star/nebula elements inside the wheel's Three.js scene if it's separate — the starfield should be its own layer behind everything

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: page loads — stars fade in smoothly before wheel builds, no harsh flash
3. Test: star twinkle is smooth breathing, not on/off blinking
4. Test: accent stars have soft glow halos
5. Test: toggle Immersive Universe ON — nebulae and galaxies fade in smoothly over 3s
6. Test: toggle Immersive Universe OFF — nebulae fade out, clean starfield remains
7. Test: wheel interaction (drag, tap planets, swipe days) is still smooth with starfield active
8. Test: immersive mode on mobile — no frame rate drop below 30fps
9. Test: verify starfield doesn't interfere with any tap targets
10. Test: refresh page — starfield loads before wheel animation begins
11. Commit: `feat: cinematic starfield with immersive universe toggle`
12. Push to `main`
