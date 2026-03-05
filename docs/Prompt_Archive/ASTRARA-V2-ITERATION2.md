# ASTRARA v2 — Iteration 2: Scrollbar, 3D Wheel, Day Navigation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Astrara Phase 1 is live and working. This iteration addresses three specific improvements. Read all existing source files first to understand the current structure before making changes.

---

## 1. Remove Scrollbar — Native App Feel

The app should feel like a native mobile application, not a website. Scrollbars are visually distracting and break the immersion.

### Implementation

In `globals.css`, add:

```css
/* Hide scrollbar across all browsers while keeping scroll functional */
html, body {
  overflow-y: auto;
  scrollbar-width: none;          /* Firefox */
  -ms-overflow-style: none;       /* IE/Edge */
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;                  /* Chrome, Safari, Opera */
}

/* Apply to any other scrollable containers in the app */
*::-webkit-scrollbar {
  display: none;
}

* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
```

The page should still scroll normally — just no visible scrollbar anywhere. Test on both the main page scroll and any horizontally scrollable card rows.

---

## 2. Upgrade Astro Wheel to 3D — The Hero Element

The current 2D SVG wheel works but needs to become a **stunning 3D celestial instrument** that stops people mid-scroll. This is the single most important visual element in the app — it's what gets screen-recorded for TikTok.

### Install Three.js

```bash
npm install three @react-three/fiber @react-three/drei --yes
```

### 3D Wheel Architecture

Replace the current 2D SVG wheel with a Three.js `<Canvas>` rendered via `@react-three/fiber`. The wheel should feel like a **luminous holographic astrolabe floating in space**.

#### Visual Structure (layers from back to front)

**Layer 1 — Particle Field (depth backdrop)**
- A subtle cloud of ~300 tiny particles slowly orbiting behind the wheel
- Very dim (opacity 0.1–0.2), gives the sense of deep space surrounding the wheel
- Particles drift slowly in elliptical paths

**Layer 2 — Outer Zodiac Ring (torus/ring geometry)**
- A flat ring (torus with very thin tube radius) tilted ~15° toward the viewer
- Divided into 12 segments, each tinted by element colour:
  - Fire (Aries, Leo, Sagittarius): `#FF6B4A` at 20% opacity
  - Earth (Taurus, Virgo, Capricorn): `#4ADE80` at 20% opacity
  - Air (Gemini, Libra, Aquarius): `#60A5FA` at 20% opacity
  - Water (Cancer, Scorpio, Pisces): `#A78BFA` at 20% opacity
- Zodiac glyphs rendered as `<Html>` overlays (from `@react-three/drei`) positioned at each 30° segment centre on the ring
- The ring has a subtle emissive glow along its edge
- A thin luminous border line separates each segment

**Layer 3 — Degree Track (inner ring)**
- A second, slightly smaller ring inside the zodiac ring
- Very subtle — just a thin glowing line with tick marks every 30°
- Gives the wheel a precision-instrument feel

**Layer 4 — Planet Orbs (sphere geometries)**
- Each planet is a small `<Sphere>` mesh positioned along the ecliptic at its correct longitude
- Planets are positioned on the same plane as the zodiac ring, between the degree track and the centre
- Each planet sphere has:
  - `MeshStandardMaterial` with `emissive` set to the planet's colour
  - A `<pointLight>` at its position casting a soft coloured glow onto nearby elements
  - A subtle pulsing animation on `emissiveIntensity` (breathing effect, 3–5 second cycle, each planet offset)
- Planet labels rendered as `<Html>` overlays showing glyph + degree (e.g. "☉ 14°")
- Labels always face the camera (billboard behaviour — use drei's `<Html center>`)
- **Planet size hierarchy**: Sun = radius 0.12, Moon = 0.10, inner planets = 0.07, outer planets = 0.06

**Layer 5 — Aspect Lines (line geometries)**
- Thin glowing lines connecting planets that are in aspect
- Use `<Line>` from drei with `lineWidth={1}` and the aspect colour
- Lines have a subtle opacity pulse animation
- By default show only major applying aspects to avoid clutter
- When a planet is tapped, highlight only its aspects (brighten to full opacity), dim all others

**Layer 6 — Centre Glow**
- A soft radial glow at the centre of the wheel (a small sphere with high emissive + bloom, or a sprite)
- Represents Earth (the geocentric viewpoint)
- Very subtle — just enough to create depth

#### 3D Lighting

```
- 1x AmbientLight: intensity 0.15 (very dim base)
- 1x DirectionalLight: from upper-left, intensity 0.3 (subtle highlight)
- Per-planet PointLights: intensity 0.2–0.4, distance 2, decay 2
- Optional: UnrealBloomPass via postprocessing for that ethereal glow
```

Consider using `@react-three/postprocessing` for bloom:
```bash
npm install @react-three/postprocessing --yes
```

```tsx
import { EffectComposer, Bloom } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom 
    luminanceThreshold={0.2} 
    luminanceSmoothing={0.9} 
    intensity={0.8} 
  />
</EffectComposer>
```

This gives the entire wheel that ethereal, cinematic glow quality.

#### 3D Interaction — Preserving All Existing Behaviours

The 3D wheel MUST retain all interaction modes from the wheel addendum:

**Auto-rotation:**
- The entire wheel group rotates slowly around its Y-axis (if tilted) or Z-axis (if face-on)
- Speed: 1 revolution per ~5 minutes
- Smooth, continuous, mesmerising

**Grab and rotate:**
- Use drei's `<OrbitControls>` configured with constraints:
  ```tsx
  <OrbitControls
    enableZoom={false}        // disable zoom for Phase 1 (or true if ready)
    enablePan={false}         // no panning
    enableRotate={true}       // allow rotation
    autoRotate={true}         // auto-spin when idle
    autoRotateSpeed={0.3}     // slow
    minPolarAngle={Math.PI / 3}   // limit vertical tilt (don't flip upside down)
    maxPolarAngle={Math.PI / 1.5} // limit vertical tilt
    dampingFactor={0.05}      // smooth deceleration
    enableDamping={true}      // momentum/inertia on release
  />
  ```
- When user touches/drags, OrbitControls automatically stops autoRotate and gives manual control
- On release, damping provides the momentum/inertia feel
- autoRotate resumes after user stops interacting (OrbitControls handles this natively)

**Tap to explore:**
- Use drei's `<Html>` components for planet labels — these are real DOM elements that receive click events naturally
- Alternatively, use raycasting: on click/tap, cast a ray from the camera through the click point and check intersections with planet sphere meshes
- When a planet is tapped:
  - The planet orb briefly flashes brighter (animate emissiveIntensity to 2x then back)
  - The detail bottom sheet / side panel opens (same as current implementation, this is a React component outside the Canvas)
  - Pass the tapped planet's data up from the Three.js canvas to the React parent via a callback prop

#### Canvas Setup

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'

<div className="relative w-full" style={{ height: '85vw', maxHeight: '500px' }}>
  <Canvas
    camera={{ position: [0, 0, 5], fov: 45 }}
    style={{ background: 'transparent' }}  // let the app background show through
    gl={{ alpha: true, antialias: true }}
  >
    <ambientLight intensity={0.15} />
    <directionalLight position={[2, 3, 5]} intensity={0.3} />
    
    <AstroWheel3D 
      planets={planetPositions}
      aspects={aspects}
      onPlanetTap={handlePlanetTap}
      onSignTap={handleSignTap}
    />
    
    <OrbitControls 
      autoRotate 
      autoRotateSpeed={0.3}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 1.5}
    />
    
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.8} />
    </EffectComposer>
  </Canvas>
</div>
```

#### Important Implementation Notes

- The `<Canvas>` container div should have `touch-action: none` to prevent page scroll when interacting with the 3D wheel
- The canvas background MUST be transparent (`gl={{ alpha: true }}`) so the app's starfield background shows through
- Planet positions are calculated in `useAstroData` hook (already exists) and passed as props — the 3D component is purely visual
- Convert ecliptic longitude to 3D position: `x = radius * cos(longitude * PI/180)`, `z = radius * sin(longitude * PI/180)`, `y = 0` (all on the ecliptic plane)
- If the ring is tilted, apply the tilt as a rotation on the parent group, not on individual elements
- **Performance**: Use `React.memo` on planet components, avoid re-creating geometries on every frame
- **Mobile performance**: If FPS drops below 30 on mobile, reduce particle count and disable bloom. Test on a real device or throttle in Chrome DevTools.
- Use `useFrame` from @react-three/fiber for per-frame animations (breathing glow), NOT setInterval
- The `<Html>` elements from drei render actual DOM nodes overlaid on the 3D scene — use these for text labels since 3D text rendering is expensive and hard to read

#### Fallback

If Three.js rendering fails on a device (old browser, WebGL not supported), gracefully fall back to the existing 2D SVG wheel. Wrap the Canvas in an error boundary:

```tsx
<ErrorBoundary fallback={<AstroWheel2D {...props} />}>
  <Canvas>...</Canvas>
</ErrorBoundary>
```

---

## 3. Reposition Day Navigation — Below the Wheel

The Yesterday / Today / Tomorrow buttons must be **immediately accessible without scrolling**, positioned just below the astro wheel.

### Current Problem
The day navigation is at the bottom of the page, forcing users to scroll past all the cosmic weather content every time they want to check another day.

### Solution
Move the day navigation to sit **directly beneath the astro wheel**, before the cosmic weather section.

```
┌─────────────────────────────┐
│  ASTRARA        📍 London   │  Header
│  4 March 2026 · 10:11 GMT   │
├─────────────────────────────┤
│                             │
│      ╭── ASTRO WHEEL ──╮   │  3D Wheel
│      │   (interactive)  │   │
│      ╰──────────────────╯   │
│                             │
│   ← Yesterday  Today  Tomorrow →  │  ← Day nav HERE
│                             │
├─────────────────────────────┤
│  🌙 Moon Phase Card         │  Cosmic weather content
│  Planet Cards               │  (scrollable below)
│  Aspect Highlights          │
│  ...                        │
└─────────────────────────────┘
```

### Styling

```tsx
<div className="flex items-center justify-center gap-2 py-4">
  <button 
    onClick={() => navigateDay(-1)}
    className="px-4 py-2 rounded-xl text-sm
               bg-white/5 border border-white/10 
               text-white/50 hover:text-white/80 hover:bg-white/8
               active:scale-95 transition-all duration-200"
  >
    ← {t('nav.yesterday')}
  </button>
  
  <button 
    onClick={() => navigateDay(0)}
    className="px-5 py-2 rounded-xl text-sm font-medium
               bg-purple-500/20 border border-purple-400/30 
               text-purple-300
               active:scale-95 transition-all duration-200"
  >
    {t('nav.today')}
  </button>
  
  <button 
    onClick={() => navigateDay(1)}
    className="px-4 py-2 rounded-xl text-sm
               bg-white/5 border border-white/10 
               text-white/50 hover:text-white/80 hover:bg-white/8
               active:scale-95 transition-all duration-200"
  >
    {t('nav.tomorrow')} →
  </button>
</div>
```

- "Today" button should be visually distinct (accent colour) so user always knows which day they're viewing
- When viewing Yesterday or Tomorrow, the "Today" label becomes a regular button and the active day gets the accent style
- Smooth transition when switching days — planet cards should animate/fade, and the 3D wheel planets should smoothly animate to their new positions (lerp/tween over 500ms)
- Show the viewed date prominently in the header when not on "Today" (e.g. "3 March 2026" instead of just the live time)

---

## Build Steps

1. Read all current source files to understand the structure
2. **Scrollbar**: Add the CSS to globals.css, verify no scrollbars appear anywhere
3. **Day navigation**: Move the component to sit directly below the wheel, style it, wire up the date state
4. **3D Wheel**: Install Three.js ecosystem packages, build the 3D wheel component, replace the 2D wheel, preserve all interactivity
5. Test on mobile viewport (375px) — check performance, touch interaction, layout
6. Run `npm run build` — fix any errors
7. Commit: `feat: 3D astro wheel, remove scrollbar, reposition day nav`
