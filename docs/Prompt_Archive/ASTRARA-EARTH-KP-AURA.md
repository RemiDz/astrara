# ASTRARA — Earth Kp Aura: Live Geomagnetic Glow on Earth Globe

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

The astro wheel has a small blue Earth globe at its centre ("You Are Here"). The app already fetches the Kp index from NOAA for the Earth Intelligence panel. We want to add a subtle glowing aura ring around the Earth globe that changes colour and behaviour based on the current Kp value — giving practitioners an at-a-glance sense of geomagnetic conditions without tapping anything.

Read all current Earth globe, wheel, and NOAA data-fetching source files before making changes.

---

## 1. Find the Existing Kp Data

The app already fetches Kp from NOAA somewhere (likely for the Earth Intelligence / Earth detail panel). Find where this data lives and make it accessible to the wheel/Earth globe component.

The NOAA endpoint is: `https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json`
or: `https://services.swpc.noaa.gov/json/planetary_k_index_1m.json`

If the Kp value is currently only fetched when the Earth panel opens, refactor so it's fetched once on app load and stored in shared state (context, zustand, or whatever state management the app uses). The wheel needs access to the current Kp value at all times.

---

## 2. Kp Colour Scale

Map the Kp index (0–9) to colours that follow the standard NOAA geomagnetic storm scale:

```typescript
function getKpColour(kp: number): { colour: string; glowIntensity: number; pulseSpeed: number } {
  if (kp <= 1) return { colour: '#22c55e', glowIntensity: 0.15, pulseSpeed: 0 }        // Green — quiet
  if (kp <= 2) return { colour: '#4ade80', glowIntensity: 0.2, pulseSpeed: 0 }          // Light green — quiet
  if (kp <= 3) return { colour: '#a3e635', glowIntensity: 0.25, pulseSpeed: 0 }         // Yellow-green — unsettled
  if (kp <= 4) return { colour: '#facc15', glowIntensity: 0.35, pulseSpeed: 4 }         // Yellow — active (gentle pulse begins)
  if (kp <= 5) return { colour: '#f59e0b', glowIntensity: 0.45, pulseSpeed: 3 }         // Amber — minor storm
  if (kp <= 6) return { colour: '#ef4444', glowIntensity: 0.55, pulseSpeed: 2.5 }       // Red — moderate storm
  if (kp <= 7) return { colour: '#dc2626', glowIntensity: 0.65, pulseSpeed: 2 }         // Deep red — strong storm
  if (kp <= 8) return { colour: '#a855f7', glowIntensity: 0.75, pulseSpeed: 1.5 }       // Purple — severe storm
  return { colour: '#c026d3', glowIntensity: 0.85, pulseSpeed: 1 }                       // Magenta — extreme storm (Kp 9)
}
```

- `glowIntensity`: opacity of the aura (0–1)
- `pulseSpeed`: seconds per pulse cycle. 0 = no pulse (static glow). Lower = faster pulse for higher urgency.

---

## 3. Add the Aura to the Earth Globe (Three.js)

Find the Earth globe mesh in the wheel scene. Add a glowing ring/sphere around it.

### Approach: Double-layer glow

**Layer 1 — Inner aura (tight glow):**
- A slightly larger transparent sphere around the Earth mesh
- Uses `MeshBasicMaterial` with the Kp colour, `transparent: true`, `opacity` set to `glowIntensity * 0.6`
- Scale: 1.3× the Earth globe radius
- `side: THREE.BackSide` to create an inner-glow effect

**Layer 2 — Outer aura (soft bloom):**
- A larger transparent sphere
- `MeshBasicMaterial` with Kp colour, `opacity` set to `glowIntensity * 0.3`
- Scale: 1.8× the Earth globe radius
- `side: THREE.BackSide`
- This creates the soft falloff

```tsx
function EarthAura({ kp }: { kp: number }) {
  const auraRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const { colour, glowIntensity, pulseSpeed } = getKpColour(kp)

  useFrame(({ clock }) => {
    if (!auraRef.current || !outerRef.current) return

    if (pulseSpeed > 0) {
      // Smooth sine wave pulse
      const pulse = Math.sin(clock.elapsedTime * (Math.PI * 2) / pulseSpeed) * 0.5 + 0.5
      const baseOpacity = glowIntensity * 0.6
      auraRef.current.material.opacity = baseOpacity * (0.7 + pulse * 0.3)
      outerRef.current.material.opacity = (glowIntensity * 0.3) * (0.6 + pulse * 0.4)

      // Subtle scale breathing on the outer aura
      const scaleBreath = 1.8 + pulse * 0.15
      outerRef.current.scale.setScalar(scaleBreath)
    } else {
      // Static glow — no animation
      auraRef.current.material.opacity = glowIntensity * 0.6
      outerRef.current.material.opacity = glowIntensity * 0.3
    }
  })

  return (
    <group>
      {/* Inner aura */}
      <mesh ref={auraRef} scale={1.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={colour}
          transparent
          opacity={glowIntensity * 0.6}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer soft aura */}
      <mesh ref={outerRef} scale={1.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={colour}
          transparent
          opacity={glowIntensity * 0.3}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
```

**IMPORTANT:** The `<EarthAura>` component must be a child of the same group as the Earth globe mesh, positioned at the same origin, so it moves with Earth. Match the sphere geometry radius to the Earth globe's actual radius — adjust the 1.3× and 1.8× scale multipliers to look right relative to the actual Earth mesh size.

---

## 4. Transition Between States

When the Kp value changes (new data fetch), the aura should NOT snap to the new colour. Smoothly interpolate:

- Colour: lerp between old and new colour over 2 seconds using `THREE.Color.lerp()` inside `useFrame`
- Opacity: lerp over 1 second
- Scale: lerp over 1.5 seconds

Store the previous Kp colour in a ref and animate toward the new target each frame.

```tsx
const targetColour = useRef(new THREE.Color(colour))
const currentColour = useRef(new THREE.Color(colour))

useEffect(() => {
  targetColour.current.set(colour)
}, [colour])

useFrame((_, delta) => {
  currentColour.current.lerp(targetColour.current, delta * 2) // smooth ~0.5s transition
  if (auraRef.current) {
    ;(auraRef.current.material as THREE.MeshBasicMaterial).color.copy(currentColour.current)
  }
})
```

---

## 5. Fallback When Kp Data Unavailable

If NOAA data hasn't loaded yet or the fetch fails:
- Show a very faint blue-white glow (the Earth's natural colour) with `glowIntensity: 0.1` and no pulse
- Do NOT show red/amber as a default — that would falsely alarm users
- Once data arrives, smoothly transition to the correct Kp colour

---

## 6. Update Earth Detail Panel

In the Earth Intelligence panel (shown when tapping Earth), add a small visual indicator that matches the aura:

- A coloured dot or small badge next to the Kp value showing the same colour as the aura
- Add a one-line label: "Quiet" / "Unsettled" / "Active" / "Minor storm" / "Moderate storm" / "Strong storm" / "Severe storm" / "Extreme storm"

Map:
```
Kp 0–1: "Quiet"
Kp 2–3: "Unsettled"  
Kp 4:   "Active"
Kp 5:   "Minor storm"
Kp 6:   "Moderate storm"
Kp 7:   "Strong storm"
Kp 8:   "Severe storm"
Kp 9:   "Extreme storm"
```

---

## 7. Performance

- The aura uses only `MeshBasicMaterial` (no lighting calculations)
- Only 2 extra spheres with low poly count (32 segments is plenty)
- `depthWrite: false` prevents z-fighting
- The `useFrame` callback does minimal work (one lerp + one sine)
- This should add negligible GPU cost

---

## 8. Do NOT

- Do NOT add text labels or numbers on the wheel for Kp — the aura is purely visual
- Do NOT make the aura so bright it competes with the planets
- Do NOT add a legend or key on the wheel — the colour speaks for itself
- Do NOT change the Earth globe itself (texture, size, position) — only add the aura around it
- Do NOT touch any other planet visuals in this iteration

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: verify Earth has a subtle green glow when Kp is low (most days)
3. Test: temporarily hardcode Kp to 7 and verify red pulsing aura appears
4. Test: temporarily hardcode Kp to 9 and verify magenta fast pulse
5. Test: remove hardcoded value, verify real NOAA data drives the aura
6. Test: verify aura doesn't clip or interfere with planet markers near Earth
7. Test: verify aura looks good on both mobile and desktop
8. Commit: `feat: earth Kp aura — live geomagnetic glow around Earth globe`
9. Push to `main`
