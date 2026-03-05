# ASTRARA v2 — Iteration 14: Shadow Fix, Lunata Cards, Wheel Tilt Animation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

All interaction logic, tap handlers, modals, audio, data fetching, and the entrance animation sequence must remain working. Test everything after completing.

---

## Fix 1: Remove Oval Shadow Behind Wheel

There is a large oval/circle shadow behind the wheel that moves when the user rotates it. It's visible when the wheel is tilted away from the flat 2D position. This is distracting and needs to be removed.

### Likely Causes

Search the wheel code for any of these and REMOVE them:

**1. A shadow-casting plane or disc behind the wheel:**
```tsx
// DELETE if found — any flat plane/circle positioned behind the wheel
<mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
  <circleGeometry ... />
  <meshBasicMaterial color="black" opacity={...} transparent />
</mesh>
```

**2. A sprite used as a shadow/glow behind the wheel:**
```tsx
// DELETE if found — any large sprite behind the wheel
<sprite scale={[5, 5, 1]} position={[0, 0, -0.5]}>
  <spriteMaterial ... />
</sprite>
```

**3. Shadow properties on the wheel group or any mesh:**
```tsx
// Set ALL of these to false on every mesh in the wheel:
castShadow={false}
receiveShadow={false}
```

**4. A fog or background gradient that follows the wheel group:**
Check if there's a `<fog>` element or a background plane inside the wheel `<group>`. If so, remove it.

**5. Canvas or CSS shadow on the container:**
Check the Canvas container div for any CSS `box-shadow` or `filter: drop-shadow(...)`. Remove if found.

**6. The atmosphere glow on Earth being too large:**
If the Earth's atmosphere sprite or BackSide sphere is very large (scale above 1.0), it could appear as a shadow when the wheel tilts. Reduce to a small glow:
```tsx
// Earth atmosphere should be only slightly larger than Earth:
<sphereGeometry args={[0.2, 32, 32]} />  // max 0.2 radius
```

**7. A bloom/glow post-processing effect creating a halo:**
If using `@react-three/postprocessing` with Bloom, check if the bloom intensity is too high or the threshold too low, causing a large glow area behind bright objects. Try reducing:
```tsx
<Bloom intensity={0.3} luminanceThreshold={0.6} />
```

### How to Verify

After removing the shadow, rotate the wheel to various angles — there should be NO dark or light oval shape moving with the wheel. Only the wheel rings, planets, zodiac glyphs, and aspect lines should be visible. The background should be clean starfield at all angles.

---

## Fix 2: Content Cards — Lunata Style

The content cards below the wheel (Moon phase, planetary insights, etc.) need to match Lunata's design language: transparent glass cards with deep space visible through them, clean typography, no heavy borders or solid backgrounds.

### Lunata Card Style Reference

Lunata uses:
- Very transparent backgrounds: `rgba(255, 255, 255, 0.03)` to `rgba(255, 255, 255, 0.05)`
- Subtle borders: `rgba(255, 255, 255, 0.06)` to `rgba(255, 255, 255, 0.08)`
- No heavy box shadows
- Clean monospaced or small-caps labels for section headings
- Generous padding and spacing
- Content breathes — not cramped

### Card Component Style

Replace ALL content card styling with:

```tsx
{/* Card container */}
<div className="mx-4 mb-4 rounded-2xl overflow-hidden"
     style={{
       background: 'rgba(255, 255, 255, 0.025)',
       border: '1px solid rgba(255, 255, 255, 0.06)',
     }}>
  <div className="p-5">
    
    {/* Section label — small caps, very muted */}
    <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-3 font-mono">
      {sectionLabel}
    </p>
    
    {/* Main title */}
    <h3 className="text-lg font-serif text-white/85 mb-1">
      {title}
    </h3>
    
    {/* Subtitle / secondary info */}
    <p className="text-sm text-white/40 mb-4">
      {subtitle}
    </p>
    
    {/* Body text */}
    <p className="text-[13px] text-white/45 leading-relaxed">
      {bodyText}
    </p>
    
  </div>
</div>
```

### Moon Phase Card Specifically

```tsx
<div className="mx-4 mb-4 rounded-2xl overflow-hidden"
     style={{
       background: 'rgba(255, 255, 255, 0.025)',
       border: '1px solid rgba(255, 255, 255, 0.06)',
     }}>
  <div className="p-5">
    
    {/* Moon phase label */}
    <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-3 font-mono">
      Moon Phase
    </p>
    
    {/* Moon icon + phase name */}
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">🌕</span>
      <div>
        <h3 className="text-lg font-serif text-white/85">Full Moon</h3>
        <p className="text-xs text-white/35">98% illumination</p>
      </div>
    </div>
    
    {/* Moon position */}
    <p className="text-sm text-white/45 mt-3">
      Moon in {moonSign} {moonGlyph} {moonDegree}°
    </p>
    
    {/* Insight text — no quotes, no italic, just clean text */}
    <p className="text-[13px] text-white/40 leading-relaxed mt-3">
      {moonInsightText}
    </p>
    
  </div>
</div>
```

### Important Style Notes

- Remove any italic styling on insight text — Lunata doesn't use italic for descriptions
- Remove any quotation marks around insight text — it should read as informational content, not a quote
- Remove any heavy animations on cards (fade-in is fine, but no bouncing or sliding)
- Cards should have no `backdrop-filter: blur()` — Lunata cards are transparent without blur, letting the starfield show through cleanly
- The deep space starfield background should be visible through the cards
- No rounded moon phase image/circle element if it looks out of place — use the emoji or a simple SVG instead

### Card Spacing

```tsx
{/* Container for all cards below the wheel */}
<div className="mt-2 pb-8 space-y-3">
  {/* Moon phase card */}
  {/* Planetary highlights card(s) */}
  {/* Any other content cards */}
</div>
```

Use `space-y-3` for consistent 12px gaps between cards. Horizontal margin `mx-4` to match the header padding.

---

## Fix 3: Post-Load Wheel Tilt Animation

After the wheel entrance animation completes (all elements have appeared — Earth, rings, zodiac signs, planets, aspect lines), the wheel should smoothly tilt ~45 degrees downward to give the user an angled 3D planetary view. This is the "reveal" moment — the wheel transforms from a flat 2D circle into a dramatic 3D astrolabe.

### Timing

The entrance animation takes ~3 seconds (from iteration 7). The tilt should begin AFTER the entrance is complete:

```
0-3s:     Entrance animation (Earth → rings → signs → planets → lines)
3-3.5s:   Brief pause — let the user see the flat wheel
3.5-5s:   Smooth tilt from 0° to ~45° downward
5s+:      Auto-rotation begins, wheel stays at tilted angle
```

### Implementation

Use the camera's polar angle rather than rotating the wheel group itself. This way all the `<Html>` overlays (zodiac badges, planet labels) stay correctly oriented.

**Option A: Animate OrbitControls polar angle (Recommended)**

```tsx
const controlsRef = useRef<any>(null)
const [entranceComplete, setEntranceComplete] = useState(false)
const [tiltComplete, setTiltComplete] = useState(false)

// After entrance animation finishes:
useEffect(() => {
  if (entranceComplete) {
    // Brief pause before tilt
    const timer = setTimeout(() => {
      setTiltComplete(true)  // triggers the tilt animation in useFrame
    }, 500)
    return () => clearTimeout(timer)
  }
}, [entranceComplete])

// In useFrame — smoothly interpolate the polar angle
const targetPolarAngle = tiltComplete ? Math.PI / 3 : Math.PI / 2
// Math.PI / 2 = looking straight at the wheel face-on (flat 2D)
// Math.PI / 3 = tilted ~30° from top (looking slightly down at it)
// Math.PI / 2.5 = tilted ~36° — a good middle ground
// Adjust to taste — the goal is a dramatic but not extreme tilt

useFrame(() => {
  if (controlsRef.current && tiltComplete) {
    const controls = controlsRef.current
    const currentPolar = controls.getPolarAngle()
    const diff = targetPolarAngle - currentPolar
    
    if (Math.abs(diff) > 0.001) {
      // Smooth interpolation — ease out
      const newPolar = currentPolar + diff * 0.03  // 0.03 = speed (lower = slower/smoother)
      controls.minPolarAngle = newPolar
      controls.maxPolarAngle = newPolar
    } else {
      // Tilt complete — restore free rotation range
      controls.minPolarAngle = 0.3
      controls.maxPolarAngle = 2.8
    }
    controls.update()
  }
})

<OrbitControls
  ref={controlsRef}
  autoRotate={tiltComplete}
  autoRotateSpeed={0.3 * settings.rotationSpeed}
  ...
/>
```

**Key details:**
- The tilt animates over ~1.5 seconds (controlled by the 0.03 interpolation factor)
- During the tilt, polar angle constraints are temporarily locked to force the smooth animation
- Once the tilt reaches the target, constraints are released so the user can freely rotate
- Auto-rotation only starts after the tilt completes
- The interpolation uses ease-out (the `diff * 0.03` approach naturally slows as it approaches the target)

**Option B: Animate wheel group rotation (Alternative)**

If Option A causes issues with Html overlays, rotate the wheel group itself:

```tsx
const wheelGroupRef = useRef<THREE.Group>(null)

useFrame(() => {
  if (wheelGroupRef.current && tiltComplete) {
    const targetX = -0.8  // radians — tilts wheel forward ~45°
    const current = wheelGroupRef.current.rotation.x
    const diff = targetX - current
    
    if (Math.abs(diff) > 0.001) {
      wheelGroupRef.current.rotation.x += diff * 0.03
    }
  }
})
```

**Warning with Option B:** Html overlays (zodiac badges, planet labels) may not counter-rotate properly, causing them to appear tilted. Option A (camera/controls approach) avoids this issue.

### The Experience

1. User opens Astrara
2. "Reading the stars..." appears
3. Wheel builds itself beautifully (entrance animation)
4. Brief moment of stillness — wheel is flat, face-on
5. Wheel smoothly tilts downward — the flat circle transforms into a dramatic 3D view
6. Wheel begins to slowly auto-rotate
7. User sees the full cosmic picture — planets at their positions, aspect lines connecting them, Earth at the centre

This tilt is the cinematic "wow" moment. It transforms the app from "a chart" to "a living model of the solar system."

---

## Build Steps

### Phase A: Shadow Removal
1. Search the entire wheel code for shadow sources (planes, sprites, shadows, large glows, bloom)
2. Remove or disable all shadow-casting elements
3. Test: rotate wheel to various angles — no oval shadow visible

### Phase B: Lunata-Style Cards
4. Update all content card components to the transparent glass style
5. Remove italic and quotation marks from insight text
6. Remove backdrop-blur from cards
7. Use monospaced small-caps section labels
8. Test: cards look transparent with starfield visible through them
9. Test: cards match Lunata aesthetic — clean, spacious, minimal

### Phase C: Post-Load Tilt
10. Add tiltComplete state that activates 500ms after entrance animation finishes
11. Implement smooth polar angle interpolation in useFrame
12. Release rotation constraints once tilt reaches target
13. Start auto-rotation only after tilt completes
14. Test: page load → entrance animation → pause → smooth tilt → auto-rotation begins
15. Test: after tilt, user can still freely rotate the wheel

### Phase D: Regression Test
16. Test ALL existing features:
    - Planet tap → detail panel ✓
    - Zodiac tap → detail panel ✓
    - Earth tap → Earth Panel ✓
    - Day navigation ✓
    - Sound toggle and all audio layers ✓
    - Info/Settings/About modals ✓
    - Language switcher ✓
    - All modals close properly ✓
17. Run `npm run build`
18. Push to **main** branch
19. Commit: `fix: remove wheel shadow, Lunata-style cards, post-load cinematic tilt`
