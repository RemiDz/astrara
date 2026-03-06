# ASTRARA — Inner Ring: Earth's Magnetosphere Visualisation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## What to Do

The thick inner ring on the astro wheel currently has no meaning. Transform it into a live visualisation of Earth's magnetosphere — it responds to the Kp geomagnetic index data already fetched from NOAA.

Read all current wheel, ring, and Kp data source files before making changes.

---

## 1. Find the Inner Ring

Search the wheel component for the thick inner ring/band. It's the most prominent ring closest to Earth, between the planet area and the zodiac signs. It may be a `RingGeometry`, `TorusGeometry`, or a circular mesh with inner and outer radii.

---

## 2. Visual Behaviour Based on Kp Index

The ring represents Earth's magnetosphere. Its appearance changes based on the current Kp index (0–9).

### Colour Mapping

Use the SAME Kp colour scale as the Earth aura (already in the codebase):

```typescript
function getMagnetosphereStyle(kp: number) {
  if (kp <= 1) return { colour: '#22c55e', opacity: 0.04, pulseSpeed: 0, glowStrength: 0.02 }
  if (kp <= 2) return { colour: '#4ade80', opacity: 0.05, pulseSpeed: 0, glowStrength: 0.03 }
  if (kp <= 3) return { colour: '#a3e635', opacity: 0.06, pulseSpeed: 0, glowStrength: 0.04 }
  if (kp <= 4) return { colour: '#facc15', opacity: 0.08, pulseSpeed: 6, glowStrength: 0.06 }
  if (kp <= 5) return { colour: '#f59e0b', opacity: 0.10, pulseSpeed: 4, glowStrength: 0.08 }
  if (kp <= 6) return { colour: '#ef4444', opacity: 0.13, pulseSpeed: 3, glowStrength: 0.10 }
  if (kp <= 7) return { colour: '#dc2626', opacity: 0.16, pulseSpeed: 2, glowStrength: 0.12 }
  if (kp <= 8) return { colour: '#a855f7', opacity: 0.20, pulseSpeed: 1.5, glowStrength: 0.15 }
  return { colour: '#c026d3', opacity: 0.25, pulseSpeed: 1, glowStrength: 0.18 }
}
```

Key principle: **Most days (Kp 0–3) the ring is barely visible** — a whisper of green that you'd almost miss. During storms (Kp 5+) it comes alive with colour and pulse. This makes geomagnetic events feel special, not routine.

---

## 3. Ring Structure — Three Layers

Replace the single thick solid ring with THREE layered rings that create a soft, atmospheric magnetosphere feel:

### Layer 1: Inner Edge Glow (closest to Earth)

```typescript
// Thin bright inner edge
<mesh rotation={[Math.PI / 2, 0, 0]}>
  <ringGeometry args={[innerRadius, innerRadius + thickness * 0.15, 128]} />
  <meshBasicMaterial
    color={colour}
    transparent
    opacity={opacity * 1.5}
    side={THREE.DoubleSide}
    depthWrite={false}
  />
</mesh>
```

### Layer 2: Main Body (the wide middle)

```typescript
// Wide semi-transparent body
<mesh rotation={[Math.PI / 2, 0, 0]}>
  <ringGeometry args={[innerRadius + thickness * 0.1, innerRadius + thickness * 0.85, 128]} />
  <meshBasicMaterial
    color={colour}
    transparent
    opacity={opacity * 0.6}
    side={THREE.DoubleSide}
    depthWrite={false}
  />
</mesh>
```

### Layer 3: Outer Edge Fade (closest to zodiac ring)

```typescript
// Thin fading outer edge
<mesh rotation={[Math.PI / 2, 0, 0]}>
  <ringGeometry args={[innerRadius + thickness * 0.8, innerRadius + thickness, 128]} />
  <meshBasicMaterial
    color={colour}
    transparent
    opacity={opacity * 0.3}
    side={THREE.DoubleSide}
    depthWrite={false}
  />
</mesh>
```

This creates a gradient effect: bright near Earth, fading outward — like a real magnetosphere would look.

Use the SAME inner and outer radii as the current thick ring so the overall wheel proportions don't change.

---

## 4. Pulse Animation (Kp 4+)

When Kp is 4 or above, the ring gently pulses. The pulse is a smooth sine wave affecting opacity:

```typescript
useFrame(({ clock }) => {
  const style = getMagnetosphereStyle(kpValue)
  
  // Smooth colour transition
  targetColour.current.set(style.colour)
  currentColour.current.lerp(targetColour.current, delta * 1.5)

  // Smooth opacity transition  
  targetOpacity.current = style.opacity
  currentOpacity.current += (targetOpacity.current - currentOpacity.current) * delta * 2

  let finalOpacity = currentOpacity.current

  // Pulse only when pulseSpeed > 0
  if (style.pulseSpeed > 0) {
    const pulse = Math.sin(clock.elapsedTime * (Math.PI * 2) / style.pulseSpeed) * 0.5 + 0.5
    finalOpacity = currentOpacity.current * (0.7 + pulse * 0.3)
  }

  // Apply to all three layers
  innerEdgeMat.current.color.copy(currentColour.current)
  innerEdgeMat.current.opacity = finalOpacity * 1.5

  mainBodyMat.current.color.copy(currentColour.current)
  mainBodyMat.current.opacity = finalOpacity * 0.6

  outerEdgeMat.current.color.copy(currentColour.current)
  outerEdgeMat.current.opacity = finalOpacity * 0.3
})
```

### Aurora Shimmer Effect (Kp 6+)

For strong storms, add a subtle aurora-like shimmer — the colour slowly shifts between the base colour and a secondary hue:

```typescript
if (kpValue >= 6) {
  // Shimmer between base colour and a purple/green aurora tint
  const shimmer = Math.sin(clock.elapsedTime * 0.5) * 0.5 + 0.5
  const auroraColour = new THREE.Color('#6366f1')  // indigo
  const blended = currentColour.current.clone().lerp(auroraColour, shimmer * 0.3)
  
  innerEdgeMat.current.color.copy(blended)
  mainBodyMat.current.color.copy(blended)
  outerEdgeMat.current.color.copy(blended)
}
```

This gives the ring a slow colour-breathing effect during intense geomagnetic storms — like the aurora borealis.

---

## 5. Smooth Transitions Between Kp Values

When Kp data updates (new NOAA fetch), the ring must NOT snap to the new colour/opacity. Everything lerps smoothly over ~2 seconds:

- Colour: `THREE.Color.lerp()` in useFrame
- Opacity: linear interpolation in useFrame
- Pulse speed: gradual ramp (don't suddenly start pulsing)

Store targets in refs, animate toward them each frame.

---

## 6. Fallback When Kp Data Unavailable

If NOAA data hasn't loaded yet or the fetch fails:

- Show the ring as a very faint neutral grey-blue at opacity 0.03
- No pulse
- Once data arrives, smoothly transition to the correct Kp colour

Do NOT show red/amber as a default — that would falsely alarm users.

---

## 7. Heliocentric View

In solar system view, the magnetosphere ring should fade out with the zodiac elements since it's a geocentric concept (Earth's magnetosphere around YOU at the centre). Multiply all opacities by `zodiacOpacity`.

---

## 8. Remove Old Ring Styling

Delete any existing solid colour, border, or decorative styling on the thick inner ring. It should ONLY be driven by the Kp data now. No static fallback appearance — the three-layer Kp system replaces it entirely.

---

## 9. Performance

- Three `RingGeometry` meshes with `MeshBasicMaterial` — negligible GPU cost
- `useFrame` does minimal work: one lerp, one sine, three opacity assignments
- No new data fetching — uses existing Kp data from the NOAA fetch already in the app
- `depthWrite: false` on all layers prevents z-fighting

---

## Do NOT

- Do NOT change the ring's position or radius — keep the same wheel proportions
- Do NOT make the ring bright or solid — it must be atmospheric and transparent
- Do NOT add text or labels to the ring — it's purely visual
- Do NOT change the Earth Kp aura glow (the small glow around Earth itself) — that stays as is
- Do NOT change any planet positions, zodiac signs, or other wheel elements
- Do NOT touch the starfield, Sun corona, or any other visual elements

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: Kp 0–3 (most days) — ring is barely visible, faint green whisper
3. Test: temporarily hardcode Kp to 5 — ring becomes amber, starts gently pulsing
4. Test: temporarily hardcode Kp to 7 — ring is red, pulsing faster, aurora shimmer begins
5. Test: temporarily hardcode Kp to 9 — ring is magenta, fast pulse, aurora colour breathing
6. Test: remove hardcoded values — real NOAA data drives the ring
7. Test: ring smoothly transitions when data updates (no snapping)
8. Test: ring has gradient effect (brighter near Earth, fading outward)
9. Test: ring fades out in heliocentric view
10. Test: ring fades back in when returning to geocentric view
11. Test: ring looks correct on mobile (375px) — no clipping or overflow
12. Commit: `feat: magnetosphere ring — Kp-driven inner ring visualisation`
13. Push to `main`
