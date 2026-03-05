# ASTRARA — Sun Flare Glow: Live Solar Activity on Sun Sphere

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

The astro wheel has a Sun sphere that is currently static in appearance. NOAA provides real-time solar X-ray flux data that tells us how active the Sun is right now. We want the Sun's glow radius, brightness, and corona to respond to this live data — so practitioners can see at a glance whether the Sun is calm or flaring. This follows the same approach as the Earth Kp aura (previous iteration) — purely visual, no numbers on the wheel.

Read all current Sun mesh/sphere, wheel, and any existing NOAA data-fetching source files before making changes.

---

## 1. Fetch Solar X-ray Flux from NOAA

**Endpoint:** `https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json`

This returns an array of recent X-ray flux readings. Each entry has:
```json
{
  "time_tag": "2026-03-05 14:00:00.000",
  "satellite": 16,
  "current_class": "B2.1",
  "current_int_xrray_flux": 2.1e-7,
  "energy": "0.1-0.8nm"
}
```

**Use the most recent entry** (last item in the array) with `energy: "0.1-0.8nm"` (the long-wavelength channel, which is the standard for flare classification).

**Fetch strategy:**
- Fetch once on app load, then refetch every 5 minutes
- Store in the same shared state / context as the Kp data
- If fetch fails, default to quiet Sun (no visual change from baseline)

---

## 2. Parse Flare Class

Solar flares are classified by their X-ray flux intensity:

```typescript
interface SolarActivity {
  flareClass: string        // e.g. "B2.1", "C5.3", "M1.2", "X2.4"
  fluxValue: number         // raw W/m² value
  level: 'quiet' | 'low' | 'moderate' | 'strong' | 'extreme'
  glowMultiplier: number    // how much to expand the Sun's corona
  brightnessBoost: number   // additional brightness (0–1)
  pulseSpeed: number        // 0 = no pulse, lower = faster
  coronaColour: string      // subtle colour shift at high activity
}

function parseSolarActivity(fluxValue: number, flareClass: string): SolarActivity {
  // A-class and below: background quiet Sun
  if (fluxValue < 1e-7) {
    return {
      flareClass, fluxValue, level: 'quiet',
      glowMultiplier: 1.0, brightnessBoost: 0, pulseSpeed: 0,
      coronaColour: '#FDB813'  // warm yellow — normal Sun
    }
  }
  // B-class: low activity
  if (fluxValue < 1e-6) {
    return {
      flareClass, fluxValue, level: 'low',
      glowMultiplier: 1.1, brightnessBoost: 0.05, pulseSpeed: 0,
      coronaColour: '#FDB813'
    }
  }
  // C-class: moderate — Sun is noticeably active
  if (fluxValue < 1e-5) {
    return {
      flareClass, fluxValue, level: 'moderate',
      glowMultiplier: 1.25, brightnessBoost: 0.15, pulseSpeed: 5,
      coronaColour: '#FDCE13'  // slightly brighter warm
    }
  }
  // M-class: strong — significant solar flare
  if (fluxValue < 1e-4) {
    return {
      flareClass, fluxValue, level: 'strong',
      glowMultiplier: 1.5, brightnessBoost: 0.3, pulseSpeed: 3,
      coronaColour: '#FFE066'  // hot bright yellow
    }
  }
  // X-class: extreme — major solar flare
  return {
    flareClass, fluxValue, level: 'extreme',
    glowMultiplier: 1.8, brightnessBoost: 0.5, pulseSpeed: 1.5,
    coronaColour: '#FFEEAA'  // near-white hot
  }
}
```

---

## 3. Modify Sun Sphere in the Wheel

Find the Sun mesh in the Three.js wheel scene. The Sun likely already has some glow or material. Modify it to respond to solar activity.

### Baseline Sun (quiet)
Keep whatever the Sun currently looks like as the baseline. All modifications are additive — we're enhancing, not replacing.

### Add Corona Glow Layers (same technique as Earth Kp aura)

```tsx
function SunCorona({ solarActivity }: { solarActivity: SolarActivity }) {
  const innerRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const { glowMultiplier, brightnessBoost, pulseSpeed, coronaColour } = solarActivity

  // Smooth transitions
  const targetColour = useRef(new THREE.Color(coronaColour))
  const currentColour = useRef(new THREE.Color(coronaColour))
  const targetScale = useRef(glowMultiplier)
  const currentScale = useRef(glowMultiplier)
  const targetOpacity = useRef(0.3 + brightnessBoost)
  const currentOpacity = useRef(0.3 + brightnessBoost)

  useEffect(() => {
    targetColour.current.set(coronaColour)
    targetScale.current = glowMultiplier
    targetOpacity.current = 0.3 + brightnessBoost
  }, [coronaColour, glowMultiplier, brightnessBoost])

  useFrame(({ clock }, delta) => {
    if (!innerRef.current || !outerRef.current) return

    // Smooth lerp toward targets
    currentColour.current.lerp(targetColour.current, delta * 1.5)
    currentScale.current += (targetScale.current - currentScale.current) * delta * 2
    currentOpacity.current += (targetOpacity.current - currentOpacity.current) * delta * 2

    // Apply colour
    const innerMat = innerRef.current.material as THREE.MeshBasicMaterial
    const outerMat = outerRef.current.material as THREE.MeshBasicMaterial
    innerMat.color.copy(currentColour.current)
    outerMat.color.copy(currentColour.current)

    // Pulse logic
    let pulseMultiplier = 1
    if (pulseSpeed > 0) {
      const pulse = Math.sin(clock.elapsedTime * (Math.PI * 2) / pulseSpeed) * 0.5 + 0.5
      pulseMultiplier = 0.8 + pulse * 0.2
      // Outer corona breathes
      outerRef.current.scale.setScalar(currentScale.current * 1.6 + pulse * 0.2)
    } else {
      outerRef.current.scale.setScalar(currentScale.current * 1.6)
    }

    innerMat.opacity = currentOpacity.current * pulseMultiplier
    outerMat.opacity = (currentOpacity.current * 0.5) * pulseMultiplier
    innerRef.current.scale.setScalar(currentScale.current)
  })

  return (
    <group>
      {/* Inner corona — tight warm glow */}
      <mesh ref={innerRef} scale={glowMultiplier}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={coronaColour}
          transparent
          opacity={0.3 + brightnessBoost}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer corona — diffuse bloom */}
      <mesh ref={outerRef} scale={glowMultiplier * 1.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={coronaColour}
          transparent
          opacity={(0.3 + brightnessBoost) * 0.5}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
```

**IMPORTANT:** Match the `sphereGeometry` radius to the Sun's actual mesh radius. The `scale` values above assume the Sun sphere has radius `1` — adjust multipliers to match reality. The corona must be a child of the same group as the Sun mesh so it moves with it.

---

## 4. Enhance the Sun Mesh Itself

In addition to the corona layers, subtly modify the Sun's own material:

- **Emissive intensity:** Boost the Sun mesh's emissive intensity proportionally to `brightnessBoost`. If the Sun uses `MeshStandardMaterial`, increase `emissiveIntensity` by `1 + brightnessBoost`. If `MeshBasicMaterial`, slightly lighten the base colour.
- **DO NOT** change the Sun's size/scale — only the corona around it grows. The Sun orb stays the same size always.

---

## 5. Update Sun Detail Panel

In the Sun's detail/insight panel (shown when tapping the Sun), add a Solar Activity section:

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│  ☉ SUN in Pisces at 14°                │
│                                         │
│  📏  149,320,000 km · 92,782,000 mi    │
│  ✦  8 min 17 sec at the speed of light │
│                                         │
│  ── Solar Activity ───────────────────  │
│                                         │
│  ● B2.1 — Low activity                 │
│                                         │
│  "The Sun is calm today. Solar          │
│   radiation is at background levels."   │
│                                         │
└─────────────────────────────────────────┘
```

The coloured dot `●` matches the corona colour. Status descriptions:

```
quiet:    "The Sun is very calm. Background radiation levels."
low:      "The Sun is calm with minor background activity."
moderate: "The Sun is moderately active. C-class flare detected — elevated solar radiation."
strong:   "The Sun is highly active. An M-class flare is in progress — significant solar radiation. Some practitioners report heightened sensitivity during M-class events."
extreme:  "Major X-class solar flare in progress. This is a powerful solar event — the strongest category. Geomagnetic effects may follow in 1–3 days."
```

---

## 6. Internationalisation

Add to both English and Lithuanian translation files (if i18n exists):

**English:**
- "Solar Activity"
- "Low activity"
- "Moderate activity"
- "Strong activity"
- "Extreme activity"
- "Very quiet"
- All five status descriptions above

**Lithuanian:**
- "Saulės aktyvumas"
- "Žemas aktyvumas"
- "Vidutinis aktyvumas"
- "Stiprus aktyvumas"
- "Ekstremalus aktyvumas"
- "Labai ramu"
- Translate all five descriptions naturally

---

## 7. Performance & Safety

- Same lightweight approach as Earth Kp aura: `MeshBasicMaterial`, low-poly spheres, minimal `useFrame` work
- Fetch NOAA data every 5 minutes, not every frame
- If NOAA fetch fails, Sun stays at baseline (quiet) — never show false alarm
- `depthWrite: false` on all corona meshes to prevent z-fighting
- Corona layers should NOT block or interfere with tapping the Sun to open its detail panel

---

## 8. Do NOT

- Do NOT change the Sun's base size or position on the wheel
- Do NOT add text labels or numbers on the wheel for solar data
- Do NOT make the corona so large it overlaps nearby planets (Mercury, Venus)
- Do NOT add any new UI elements outside the wheel — the effect is purely on the Sun sphere
- Do NOT touch the Earth Kp aura from the previous iteration
- Do NOT fetch from any endpoint other than the NOAA GOES X-ray one listed above

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: verify Sun has a subtle warm glow at baseline (most days will be A/B class)
3. Test: temporarily hardcode flux to `5e-5` (M-class) — verify expanded bright corona with pulse
4. Test: temporarily hardcode flux to `5e-4` (X-class) — verify large near-white pulsing corona
5. Test: remove hardcoded value, verify real NOAA data drives the glow
6. Test: verify Sun corona doesn't overlap or obscure nearby planet markers
7. Test: verify tapping Sun still opens detail panel correctly
8. Test: verify Sun detail panel shows solar activity section with correct class and description
9. Commit: `feat: sun flare glow — live solar activity corona from NOAA X-ray data`
10. Push to `main`
