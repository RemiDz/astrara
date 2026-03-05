# ASTRARA v2 — Iteration 13: Glass Rings, Earth, Rotation Audio, Date Nav

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ CRITICAL: DO NOT BREAK EXISTING FEATURES

All features from previous iterations must continue working. Test them all after completing this iteration. See the checklist at the bottom.

---

## Fix 1: Glass Ring Shimmer — Restore and Enhance

The glass ring shimmer effect that previously existed has been lost. It needs to be restored and made MORE visible, not less.

### Diagnosis

The previous iteration likely broke the ring materials or the lighting setup. Read the current ring material code and compare with what's needed.

### Fix

The wheel rings MUST use `meshPhysicalMaterial` with these properties:

```tsx
<meshPhysicalMaterial
  color="#a78bfa"                   // soft purple tint
  transparent
  opacity={0.12}                    // semi-transparent
  roughness={0.05}                  // VERY smooth — this is key for reflections
  metalness={0.5}                   // metallic = more reflections
  clearcoat={1.0}                   // glass-like top layer
  clearcoatRoughness={0.05}         // smooth clearcoat = sharp reflections
  side={THREE.DoubleSide}           // visible from both sides
/>
```

Key things that kill the glass effect:
- `roughness` too high (above 0.3) — makes it matte instead of glossy
- `metalness` too low (below 0.3) — reduces reflections
- `clearcoat` missing or set to 0 — removes the glass layer entirely
- Using `meshBasicMaterial` or `meshStandardMaterial` instead of `meshPhysicalMaterial` — these don't support clearcoat

### Lighting for Glass

The glass effect needs light to reflect. Ensure these lights exist in the scene:

```tsx
{/* Ambient — base illumination */}
<ambientLight intensity={0.3} color="#ffffff" />

{/* Main directional — creates the primary reflection */}
<directionalLight
  position={[3, 4, 2]}
  intensity={0.6}
  color="#e0d0ff"
/>

{/* Orbiting point light — creates moving shimmer */}
{/* This was added in iteration 12 — verify it still exists */}
<OrbitingLight />

{/* Secondary fill light from below — catches the underside of rings */}
<pointLight
  position={[0, -2, 0]}
  intensity={0.2}
  color="#a78bfa"
  distance={6}
/>
```

### Add Environment Map

For meshPhysicalMaterial to really shine, it needs an environment map to reflect:

```tsx
import { Environment } from '@react-three/drei'

// Inside Canvas:
<Environment preset="night" background={false} />
```

`background={false}` means it doesn't change the scene background — it only provides reflection data for physical materials. This is lightweight and should not affect performance significantly.

### Test

After implementing, slowly rotate the wheel. You should see:
- Subtle purple-tinted glass reflections on the ring surfaces
- Reflections that shift as the wheel rotates or as the orbiting light moves
- The rings should look like they're made of tinted glass or crystal, not flat plastic

---

## Fix 2: Earth Design — Not Just a Blue Ball

The current bright blue sphere looks like a solid blue marble, which is confusing. Earth needs to be instantly recognisable with its distinctive blue ocean + green/brown continent pattern.

### Solution: Use a Texture

Download a small, free Earth texture and apply it. NASA Blue Marble textures are public domain.

**Step 1**: Download a small Earth texture (256×128px is sufficient) and save it to `public/textures/earth.jpg`

You can use this direct URL to download a small Earth texture:
```bash
curl -o public/textures/earth.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/240px-Earth_Western_Hemisphere_transparent_background.png"
```

If that URL doesn't work, create the texture directory and search for "earth texture small free" — any low-res Earth map will do. Alternatively, use a procedural approach (see fallback below).

**Step 2**: Apply the texture to the Earth sphere:

```tsx
import { useTexture } from '@react-three/drei'

function EarthSphere() {
  const earthRef = useRef<THREE.Mesh>(null)
  let earthTexture: THREE.Texture | null = null
  
  try {
    earthTexture = useTexture('/textures/earth.jpg')
  } catch {
    // Texture failed to load — use fallback colours
  }
  
  // Gentle rotation on own axis
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08
    }
  })
  
  return (
    <group position={[0, 0, 0]}>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[0.16, 32, 32]} />
        {earthTexture ? (
          <meshStandardMaterial
            map={earthTexture}
            emissive="#0a1a3a"
            emissiveIntensity={0.4}
            roughness={0.6}
            metalness={0.1}
          />
        ) : (
          // Fallback without texture
          <meshStandardMaterial
            color="#1e40af"
            emissive="#1e3a8a"
            emissiveIntensity={0.4}
            roughness={0.6}
            metalness={0.1}
          />
        )}
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial
          color="#93c5fd"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Subtle point light */}
      <pointLight color="#60a5fa" intensity={0.4} distance={1.5} decay={2} />
    </group>
  )
}
```

**Step 3**: If texture download fails or is unavailable at build time, use a PROCEDURAL fallback that looks better than a solid blue ball:

```tsx
{/* Fallback: Blue sphere + green wireframe continents */}
<group>
  {/* Ocean */}
  <mesh ref={earthRef}>
    <sphereGeometry args={[0.16, 32, 32]} />
    <meshStandardMaterial
      color="#1e40af"
      emissive="#1e3a8a"
      emissiveIntensity={0.35}
      roughness={0.6}
    />
  </mesh>
  
  {/* Continents — irregular wireframe overlay */}
  <mesh rotation={[0.4, 0.8, 0.15]}>
    <icosahedronGeometry args={[0.162, 2]} />
    <meshBasicMaterial
      color="#15803d"
      transparent
      opacity={0.3}
      wireframe={true}
    />
  </mesh>
  
  {/* Second continent layer at different rotation for coverage */}
  <mesh rotation={[-0.2, 2.1, -0.3]}>
    <icosahedronGeometry args={[0.161, 1]} />
    <meshBasicMaterial
      color="#a16207"
      transparent
      opacity={0.15}
      wireframe={true}
    />
  </mesh>
</group>
```

This creates a blue sphere with green and brown wireframe patches that suggest continents. Not photorealistic, but immediately recognisable as Earth.

### Brightness

Earth should be clearly visible but not blinding. The `emissiveIntensity` at 0.35–0.4 should give it a gentle glow that stands out against the dark background without competing with the planets.

---

## Fix 3: Rotation Sound — More Powerful Woofer Character

The current rotation sound is too subtle. It needs more "whooo whooo" — a rhythmic, pulsating woofer quality that gives the feeling of physical weight and momentum, like spinning a massive cosmic flywheel.

### What to Change

Keep the existing sub-bass oscillator and noise, but ADD:

**1. Pulsating LFO on the bass — creates the "whooo whooo" rhythm**

The key missing element is modulation. A second oscillator modulates the volume of the bass, creating the rhythmic pulsing effect. The modulation speed is tied to rotation velocity — faster spin = faster "whooo whooo":

```typescript
// Add to RotationSoundLayer:

private lfo: OscillatorNode | null = null
private lfoGain: GainNode | null = null

// In start():
this.lfo = this.ctx.createOscillator()
this.lfo.type = 'sine'
this.lfo.frequency.value = 1  // 1 Hz = one "whooo" per second at rest
this.lfoGain = this.ctx.createGain()
this.lfoGain.gain.value = 0.04  // modulation depth — will increase with speed

this.lfo.connect(this.lfoGain)
this.lfoGain.connect(this.oscGain!.gain)  // modulates the bass volume
this.lfo.start()
```

**2. LFO speed and depth tied to rotation velocity:**

```typescript
// In updateVelocity():
const absVel = Math.abs(angularVelocity)
const normalised = Math.min(absVel / 3, 1)

// LFO rate: 1 Hz (slow spin) → 6 Hz (fast spin) — faster whooo whooo
if (this.lfo) {
  this.lfo.frequency.linearRampToValueAtTime(
    1 + normalised * 5,
    now + smoothing
  )
}

// LFO depth: subtle (slow) → strong pulsation (fast)
if (this.lfoGain) {
  this.lfoGain.gain.linearRampToValueAtTime(
    normalised * 0.06,
    now + smoothing
  )
}
```

**3. Lower and wider bass frequency range:**

```typescript
// Base oscillator: 30 Hz → 70 Hz (was 40 → 80)
if (this.baseOsc) {
  this.baseOsc.frequency.linearRampToValueAtTime(
    30 + normalised * 40,
    now + smoothing
  )
}

// Sub oscillator: 15 Hz → 35 Hz (chest-rumbling territory)
if (this.subOsc) {
  this.subOsc.frequency.linearRampToValueAtTime(
    15 + normalised * 20,
    now + smoothing
  )
}
```

**4. Increase overall rotation sound volume:**

```typescript
// Master volume for rotation sound: was 0.08, increase to 0.14
if (this.oscGain) {
  this.oscGain.gain.linearRampToValueAtTime(
    normalised * 0.14,
    now + smoothing
  )
}

// Noise whoosh: was 0.04, increase to 0.07
if (this.noiseGain) {
  this.noiseGain.gain.linearRampToValueAtTime(
    normalised * 0.07,
    now + smoothing
  )
}
```

**5. Add a resonant filter on the bass for "woofer" character:**

```typescript
// Add in start():
const bassFilter = this.ctx.createBiquadFilter()
bassFilter.type = 'lowpass'
bassFilter.frequency.value = 120   // only allow sub-bass through
bassFilter.Q.value = 4             // resonant peak = woofer thump

// Connect: baseOsc → bassFilter → oscGain
this.baseOsc.connect(bassFilter)
bassFilter.connect(this.oscGain)
// (instead of baseOsc directly to oscGain)
```

### The Experience Should Feel Like

- **Slow rotation**: Deep, slow "whooooo....whooooo...." — like a distant turbine winding up
- **Medium rotation**: Faster pulsing "whoo-whoo-whoo-whoo" — feels weighty and powerful
- **Fast flick**: Rapid "wuwuwuwuwu" — like a spinning top or centrifuge, exciting
- **Letting go**: Everything gradually slows and deepens as momentum decays
- **Stopped**: Complete silence from the rotation layer (drone continues if audio is on)

---

## Fix 4: Settings — Rotation Speed Range 0–500%

Change the rotation speed slider max from 2.0 to 5.0:

```tsx
<input
  type="range"
  min="0"
  max="5"
  step="0.1"
  value={settings.rotationSpeed}
  onChange={(e) => onSettingsChange({ 
    ...settings, 
    rotationSpeed: parseFloat(e.target.value) 
  })}
  ...
/>
```

Update the percentage display:
```tsx
<span className="text-[10px] text-white/30">
  {settings.rotationSpeed === 0 
    ? t('settings.paused') 
    : `${Math.round(settings.rotationSpeed * 100)}%`}
</span>
```

And the OrbitControls:
```tsx
<OrbitControls
  autoRotate={entranceComplete && settings.rotationSpeed > 0}
  autoRotateSpeed={0.3 * settings.rotationSpeed}
  ...
/>
```

---

## Fix 5: Date Navigation Buttons — Show Actual Dates

Currently the buttons always say "← Yesterday" and "Tomorrow →" regardless of what date the user has navigated to. If the user has clicked Yesterday three times and is now viewing March 1st, the buttons should show actual dates, not "Yesterday/Tomorrow".

### Logic

```typescript
const today = new Date()
today.setHours(0, 0, 0, 0)

const selectedDay = new Date(selectedDate)
selectedDay.setHours(0, 0, 0, 0)

const isToday = selectedDay.getTime() === today.getTime()

// Previous day relative to selected date
const prevDate = new Date(selectedDate)
prevDate.setDate(prevDate.getDate() - 1)

// Next day relative to selected date
const nextDate = new Date(selectedDate)
nextDate.setDate(nextDate.getDate() + 1)

const isYesterday = (date: Date) => {
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return date.getTime() === yesterday.getTime()
}

const isTomorrow = (date: Date) => {
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return date.getTime() === tomorrow.getTime()
}

// Format button labels
function getButtonLabel(date: Date, direction: 'prev' | 'next'): string {
  if (direction === 'prev') {
    if (isYesterday(date)) return `← ${t('nav.yesterday')}`
    // Show short date: "← 1 Mar"
    return `← ${formatShortDate(date)}`
  } else {
    if (isTomorrow(date)) return `${t('nav.tomorrow')} →`
    return `${formatShortDate(date)} →`
  }
}

// Centre button
function getCentreLabel(): string {
  if (isToday) return t('nav.today')
  return formatShortDate(selectedDate)
}
```

### Short Date Formatter

```typescript
function formatShortDate(date: Date, lang: string): string {
  const day = date.getDate()
  const monthNames = lang === 'lt' 
    ? ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rgp', 'Rgs', 'Spa', 'Lap', 'Gru']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${day} ${monthNames[date.getMonth()]}`
}
```

### Button Rendering

```tsx
<div className="flex items-center justify-center gap-2 py-4">
  {/* Previous day */}
  <button
    type="button"
    onClick={() => goToDate(prevDate)}
    className="px-4 py-2 rounded-xl text-sm text-white/50 
               border border-white/10
               hover:border-white/20 hover:text-white/70
               active:scale-95
               transition-all select-none"
  >
    {getButtonLabel(prevDate, 'prev')}
  </button>
  
  {/* Centre — today or current date */}
  <button
    type="button"
    onClick={() => goToDate(today)}
    className={`px-4 py-2 rounded-xl text-sm select-none
               active:scale-95 transition-all
               ${isToday 
                 ? 'bg-purple-500/30 border border-purple-400/30 text-purple-200' 
                 : 'border border-white/10 text-white/50 hover:border-white/20'}`}
  >
    {getCentreLabel()}
  </button>
  
  {/* Next day */}
  <button
    type="button"
    onClick={() => goToDate(nextDate)}
    className="px-4 py-2 rounded-xl text-sm text-white/50 
               border border-white/10
               hover:border-white/20 hover:text-white/70
               active:scale-95
               transition-all select-none"
  >
    {getButtonLabel(nextDate, 'next')}
  </button>
</div>
```

### Behaviour Examples

| User views     | Left button    | Centre button | Right button   |
|---------------|----------------|---------------|----------------|
| Today (4 Mar) | ← Yesterday   | Today         | Tomorrow →     |
| 3 Mar         | ← 2 Mar       | 3 Mar         | Yesterday →    |
| 1 Mar         | ← 28 Feb      | 1 Mar         | 2 Mar →        |
| 5 Mar         | Tomorrow →     | 5 Mar         | 6 Mar →        |
| 10 Mar        | ← 9 Mar       | 10 Mar        | 11 Mar →       |

Wait — looking at that table, the "Tomorrow" label should only appear on the right button when viewing today. When viewing other dates, the right button should always show the next date. Same for "Yesterday" — only on the left button when viewing today.

Simplified rule:
- **Viewing today**: show "← Yesterday", "Today", "Tomorrow →"
- **Viewing any other date**: show "← {prev date}", "{current date}", "{next date} →"
- **Centre button always goes back to today** when tapped (regardless of what date is shown)

### i18n Keys to Add

**English:**
```json
{
  "nav.backToToday": "Back to Today"
}
```

**Lithuanian:**
```json
{
  "nav.backToToday": "Grįžti į Šiandien"
}
```

---

## Build Steps

### Phase A: Glass Rings
1. Check current ring materials — restore meshPhysicalMaterial with clearcoat if missing
2. Verify lighting setup — ambient + directional + orbiting point light
3. Add Environment preset="night" with background={false}
4. Test: glass shimmer is visible during rotation and from orbiting light

### Phase B: Earth Texture
5. Download small Earth texture to public/textures/earth.jpg
6. Apply texture with useTexture + fallback
7. Add gentle self-rotation
8. Test: Earth is recognisable with blue + green/brown, not a solid blue ball

### Phase C: Rotation Audio Enhancement
9. Add LFO oscillator to RotationSoundLayer for pulsating "whooo" effect
10. Tie LFO speed and depth to rotation velocity
11. Add resonant lowpass filter on bass for woofer character
12. Increase volume levels
13. Test: slow spin = deep slow whooo, fast spin = rapid pulsing, stop = silence

### Phase D: Settings + Date Nav
14. Change rotation speed slider max to 5.0 (500%)
15. Rewrite date navigation button labels with actual dates
16. Add short date formatter for both EN and LT
17. Test: navigate to 3 days ago → buttons show correct dates
18. Test: centre button always returns to today

### Phase E: Full Regression Test
19. Test ALL existing features:
    - Planet tap → detail panel ✓
    - Zodiac tap → detail panel ✓
    - Earth tap → Earth Panel ✓
    - Day navigation ✓
    - Sound toggle → drone + binaural ✓
    - Planet tap tones ✓
    - Info button → About modal ✓
    - Settings panel → sliders work ✓
    - Language switcher ✓
    - Wheel entrance animation ✓
    - All modals close properly ✓
20. Run `npm run build`
21. Push to **main** branch
22. Commit: `fix: glass rings, Earth texture, woofer rotation audio, date nav labels`
