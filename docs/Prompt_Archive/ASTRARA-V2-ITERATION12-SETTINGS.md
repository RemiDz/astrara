# ASTRARA v2 — Iteration 12: Settings, Rotation Audio, Earth Fix, Glass Rings

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ CRITICAL: DO NOT BREAK EXISTING FEATURES

Before making ANY changes, read and understand the current codebase. The following features are WORKING and must continue to work after this iteration:

- ✅ 3D wheel rendering with zodiac signs and planets
- ✅ Planet and zodiac sign tap → detail panel opens
- ✅ Day navigation (Yesterday/Today/Tomorrow)
- ✅ Earth tap → Earth Panel with NOAA data
- ✅ Sound toggle → drone + binaural beats
- ✅ Planet tap tones and zodiac tap tones
- ✅ Info button → About modal
- ✅ Language switcher (EN/LT)
- ✅ Location detection
- ✅ Wheel entrance animation
- ✅ All bottom sheet modals open AND close properly

**Test ALL of the above after completing this iteration.**

This iteration adds NEW features alongside existing ones. Do not refactor, rename, or restructure existing working code unless absolutely necessary for integration.

---

## Feature 1: Settings Panel

### Settings Icon in Header

Add a small gear icon to the header, next to the info button:

```tsx
<div className="flex items-center gap-2">
  <h1 className="text-2xl font-serif text-white/90 tracking-wide">ASTRARA</h1>
  
  {/* Info button (EXISTING — do not modify) */}
  <button onClick={() => setShowAbout(true)} ...>i</button>
  
  {/* Settings button — NEW */}
  <button
    type="button"
    onClick={() => setShowSettings(true)}
    className="w-6 h-6 rounded-full border border-white/25 
               flex items-center justify-center
               text-white/40 text-xs
               hover:border-white/40 hover:text-white/60
               active:scale-90
               transition-all select-none cursor-pointer"
    aria-label="Settings"
  >
    ⚙
  </button>
</div>
```

### Settings Bottom Sheet

Same glassmorphism bottom sheet pattern as other modals. Keep it minimal — three controls only:

```tsx
export function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: Props) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative z-10 w-full max-w-md mx-auto
                      bg-[#0D0D1A]/95 backdrop-blur-xl 
                      border border-white/10 
                      rounded-t-2xl sm:rounded-2xl 
                      p-6 pb-8
                      animate-slide-up">
        
        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />
        
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 
                     transition-colors select-none text-lg"
        >✕</button>
        
        <h2 className="text-lg font-serif text-white/90 text-center mb-6">
          {t('settings.title')}
        </h2>
        
        {/* Slider 1: Planet Size */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">
              {t('settings.planetSize')}
            </label>
            <span className="text-[10px] text-white/30">
              {Math.round(settings.planetScale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.planetScale}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              planetScale: parseFloat(e.target.value) 
            })}
            className="w-full accent-purple-500 h-1 bg-white/10 rounded-full
                       appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-purple-400
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          />
          <div className="flex justify-between text-[9px] text-white/20 mt-1">
            <span>{t('settings.small')}</span>
            <span>{t('settings.large')}</span>
          </div>
        </div>
        
        {/* Slider 2: Rotation Speed */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">
              {t('settings.rotationSpeed')}
            </label>
            <span className="text-[10px] text-white/30">
              {settings.rotationSpeed === 0 ? t('settings.paused') : `${Math.round(settings.rotationSpeed * 100)}%`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.rotationSpeed}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              rotationSpeed: parseFloat(e.target.value) 
            })}
            className="w-full accent-purple-500 h-1 bg-white/10 rounded-full
                       appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-purple-400
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          />
          <div className="flex justify-between text-[9px] text-white/20 mt-1">
            <span>{t('settings.paused')}</span>
            <span>{t('settings.fast')}</span>
          </div>
        </div>
        
        {/* Toggle 3: Rotation Sound */}
        <div className="flex items-center justify-between py-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block">
              {t('settings.rotationSound')}
            </label>
            <span className="text-[9px] text-white/20">
              {t('settings.rotationSoundHint')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSettingsChange({ 
              ...settings, 
              rotationSoundEnabled: !settings.rotationSoundEnabled 
            })}
            className={`w-11 h-6 rounded-full transition-colors duration-300 
                       flex items-center px-0.5 cursor-pointer select-none
                       ${settings.rotationSoundEnabled 
                         ? 'bg-purple-500/60' 
                         : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md 
                            transition-transform duration-300
                            ${settings.rotationSoundEnabled 
                              ? 'translate-x-5' 
                              : 'translate-x-0'}`} 
            />
          </button>
        </div>
        
        {/* Reset button */}
        <button
          type="button"
          onClick={() => onSettingsChange({
            planetScale: 1.0,
            rotationSpeed: 1.0,
            rotationSoundEnabled: false,
          })}
          className="w-full mt-6 py-2.5 rounded-xl text-xs text-white/30
                     border border-white/8 hover:border-white/15
                     hover:text-white/50 transition-all select-none"
        >
          {t('settings.reset')}
        </button>
        
      </div>
    </div>
  )
}
```

### Settings State

```typescript
interface AstraraSettings {
  planetScale: number          // 0.5 to 1.5, default 1.0
  rotationSpeed: number        // 0 to 2, default 1.0
  rotationSoundEnabled: boolean // default false
}

// In the main page component:
const [settings, setSettings] = useState<AstraraSettings>(() => {
  const saved = localStorage.getItem('astrara-settings')
  return saved ? JSON.parse(saved) : {
    planetScale: 1.0,
    rotationSpeed: 1.0,
    rotationSoundEnabled: false,
  }
})

// Save to localStorage on change
useEffect(() => {
  localStorage.setItem('astrara-settings', JSON.stringify(settings))
}, [settings])
```

### Applying Settings to the Wheel

**Planet scale**: Multiply each planet's base radius by `settings.planetScale`:

```tsx
// In planet rendering:
const baseRadius = PLANET_SIZES[planet.name]
const scaledRadius = baseRadius * settings.planetScale
```

Do NOT change tap target sizes when scaling planets — tap targets stay at 48px minimum always.

**Rotation speed**: Apply to OrbitControls autoRotateSpeed:

```tsx
<OrbitControls
  autoRotate={entranceComplete}
  autoRotateSpeed={0.3 * settings.rotationSpeed}  // base speed × user multiplier
  ...
/>
```

When `settings.rotationSpeed === 0`, set `autoRotate={false}` to fully pause rotation.

---

## Feature 2: Wheel Rotation Sound

A low, cinematic vortex hum that responds to wheel rotation velocity. Only plays when:
1. The main audio toggle (🔈) is ON, AND
2. The rotation sound toggle in settings is enabled

### Audio Implementation

Add a new class to the audio system:

```typescript
// audio/RotationSoundLayer.ts

export class RotationSoundLayer {
  private ctx: AudioContext
  private masterGain: GainNode
  private baseOsc: OscillatorNode | null = null
  private subOsc: OscillatorNode | null = null
  private noiseNode: AudioBufferSourceNode | null = null
  private oscGain: GainNode | null = null
  private noiseGain: GainNode | null = null
  private noiseFilter: BiquadFilterNode | null = null
  private isActive = false
  private currentVelocity = 0

  constructor(ctx: AudioContext, masterGain: GainNode) {
    this.ctx = ctx
    this.masterGain = masterGain
  }

  start() {
    if (this.isActive) return
    
    // 1. Deep sub-bass oscillator — the core "vortex" hum
    this.oscGain = this.ctx.createGain()
    this.oscGain.gain.value = 0  // starts silent
    this.oscGain.connect(this.masterGain)
    
    this.baseOsc = this.ctx.createOscillator()
    this.baseOsc.type = 'sine'
    this.baseOsc.frequency.value = 40  // very low — felt more than heard
    this.baseOsc.connect(this.oscGain)
    this.baseOsc.start()
    
    // 2. Sub-harmonic for richness
    this.subOsc = this.ctx.createOscillator()
    this.subOsc.type = 'sine'
    this.subOsc.frequency.value = 20  // sub-bass rumble
    const subGain = this.ctx.createGain()
    subGain.gain.value = 0
    this.subOsc.connect(subGain)
    subGain.connect(this.oscGain)
    this.subOsc.start()
    
    // 3. Filtered noise — the "whoosh" texture
    this.noiseGain = this.ctx.createGain()
    this.noiseGain.gain.value = 0
    
    this.noiseFilter = this.ctx.createBiquadFilter()
    this.noiseFilter.type = 'bandpass'
    this.noiseFilter.frequency.value = 200  // will shift with velocity
    this.noiseFilter.Q.value = 2
    
    // Create noise buffer
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    this.noiseNode = this.ctx.createBufferSource()
    this.noiseNode.buffer = buffer
    this.noiseNode.loop = true
    this.noiseNode.connect(this.noiseFilter)
    this.noiseFilter.connect(this.noiseGain)
    this.noiseGain.connect(this.masterGain)
    this.noiseNode.start()
    
    this.isActive = true
  }

  // Call this every frame from useFrame with the current rotation velocity
  updateVelocity(angularVelocity: number) {
    if (!this.isActive) return
    
    // Map velocity to audio parameters
    // angularVelocity: 0 (stationary) to ~5 (fast spin)
    const absVel = Math.abs(angularVelocity)
    const normalised = Math.min(absVel / 3, 1)  // 0 to 1
    
    const now = this.ctx.currentTime
    const smoothing = 0.1  // 100ms smoothing to prevent clicks
    
    // Volume: silent when still, louder when spinning
    if (this.oscGain) {
      this.oscGain.gain.linearRampToValueAtTime(
        normalised * 0.08,  // max volume 0.08 — subtle, not overpowering
        now + smoothing
      )
    }
    
    // Noise volume: adds whoosh at higher velocities
    if (this.noiseGain) {
      this.noiseGain.gain.linearRampToValueAtTime(
        normalised * 0.04,
        now + smoothing
      )
    }
    
    // Pitch rises with speed: 40 Hz (still) → 80 Hz (fast)
    if (this.baseOsc) {
      this.baseOsc.frequency.linearRampToValueAtTime(
        40 + normalised * 40,
        now + smoothing
      )
    }
    
    // Noise filter opens up with speed: 200 Hz → 800 Hz
    if (this.noiseFilter) {
      this.noiseFilter.frequency.linearRampToValueAtTime(
        200 + normalised * 600,
        now + smoothing
      )
    }
    
    this.currentVelocity = absVel
  }

  stop() {
    if (!this.isActive) return
    const now = this.ctx.currentTime
    
    if (this.oscGain) {
      this.oscGain.gain.linearRampToValueAtTime(0, now + 0.5)
    }
    if (this.noiseGain) {
      this.noiseGain.gain.linearRampToValueAtTime(0, now + 0.5)
    }
    
    setTimeout(() => {
      this.baseOsc?.stop()
      this.subOsc?.stop()
      this.noiseNode?.stop()
      this.isActive = false
    }, 600)
  }
}
```

### Tracking Rotation Velocity

In the wheel component, track how fast the wheel is rotating:

```tsx
const prevRotation = useRef(0)
const rotationVelocity = useRef(0)

useFrame(() => {
  if (wheelGroupRef.current) {
    const currentRotation = wheelGroupRef.current.rotation.y
    rotationVelocity.current = currentRotation - prevRotation.current
    prevRotation.current = currentRotation
    
    // Send velocity to rotation sound if enabled
    if (settings.rotationSoundEnabled && audioEngine) {
      audioEngine.updateRotationVelocity(rotationVelocity.current)
    }
  }
})
```

### Integration with CosmicAudioEngine

Add rotation sound management to the existing engine. Do NOT replace or restructure the existing engine — only ADD to it:

```typescript
// Add to CosmicAudioEngine class:

private rotationSound: RotationSoundLayer | null = null

// Add this method:
startRotationSound() {
  if (!this.ctx) return
  if (!this.rotationSound) {
    this.rotationSound = new RotationSoundLayer(this.ctx, this.masterGain!)
  }
  this.rotationSound.start()
}

stopRotationSound() {
  this.rotationSound?.stop()
}

updateRotationVelocity(velocity: number) {
  this.rotationSound?.updateVelocity(velocity)
}
```

---

## Feature 3: Earth Visibility Fix

The Earth at the wheel centre is almost invisible — too dark against the dark background.

### Fix

Find the Earth mesh and increase its brightness significantly:

```tsx
{/* Earth sphere — BRIGHTER */}
<mesh ref={earthRef}>
  <sphereGeometry args={[0.15, 32, 32]} />
  <meshStandardMaterial
    color="#2563eb"                    // brighter blue (was too dark before)
    emissive="#1d4ed8"                 // strong blue self-illumination
    emissiveIntensity={0.6}            // INCREASE from whatever it was (probably 0.2-0.4)
    roughness={0.5}
    metalness={0.1}
  />
</mesh>

{/* Atmosphere glow — MORE VISIBLE */}
<mesh>
  <sphereGeometry args={[0.2, 32, 32]} />
  <meshBasicMaterial
    color="#60a5fa"                    // lighter blue glow
    transparent
    opacity={0.2}                     // INCREASE from 0.12
    side={THREE.BackSide}
  />
</mesh>

{/* Point light from Earth — helps illuminate nearby elements */}
<pointLight 
  color="#60a5fa" 
  intensity={0.5}                     // INCREASE from 0.3
  distance={2} 
  decay={2} 
/>
```

Also add a subtle green landmass hint if not already present — this helps recognition:

```tsx
{/* Green landmass hint — low-poly overlay */}
<mesh rotation={[0.4, 0, 0.2]}>
  <icosahedronGeometry args={[0.152, 2]} />
  <meshBasicMaterial
    color="#22c55e"                    // green
    transparent
    opacity={0.15}
    wireframe={true}
  />
</mesh>
```

The Earth should be clearly recognisable as a small, glowing blue-green sphere — never invisible.

---

## Feature 4: Glass Ring Effect Enhancement

The glass/glossy effect on the wheel rings rarely shows because it depends on viewing angle and lighting. Fix by adding a moving light source.

### Add an Orbiting Light

Create a point light that slowly orbits around the wheel, causing the glass rings to shimmer and catch reflections continuously:

```tsx
function OrbitingLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const time = clock.getElapsedTime()
      // Orbit in a circle above the wheel
      const radius = 3
      lightRef.current.position.x = Math.cos(time * 0.15) * radius
      lightRef.current.position.y = 1.5 + Math.sin(time * 0.1) * 0.5  // gently bobs up/down
      lightRef.current.position.z = Math.sin(time * 0.15) * radius
    }
  })
  
  return (
    <pointLight
      ref={lightRef}
      color="#c4b5fd"            // soft purple-white light
      intensity={0.4}
      distance={8}
      decay={2}
    />
  )
}
```

Add this component INSIDE the Canvas, alongside the existing lights:

```tsx
<Canvas ...>
  {/* Existing lights — DO NOT REMOVE */}
  <ambientLight intensity={...} />
  {/* ... other existing lights ... */}
  
  {/* NEW: Orbiting light for glass ring shimmer */}
  <OrbitingLight />
  
  {/* Existing wheel group — DO NOT MODIFY */}
  <group ref={wheelGroupRef}>
    ...
  </group>
</Canvas>
```

### Verify Ring Material

Check that the wheel rings are using `meshPhysicalMaterial` with glass-like properties. If they've been changed to simpler materials, restore them:

```tsx
<meshPhysicalMaterial
  color="#ffffff"
  transparent
  opacity={0.15}                // semi-transparent glass
  roughness={0.1}               // smooth = more reflections
  metalness={0.3}               // some metallic reflection
  clearcoat={1.0}               // glass-like top coating
  clearcoatRoughness={0.1}      // smooth clearcoat
  envMapIntensity={1.0}         // responds to environment lighting
/>
```

The combination of the orbiting light + meshPhysicalMaterial with clearcoat creates a continuous, beautiful glass shimmer effect without requiring the user to rotate the wheel to a specific angle.

### Optional: Add an Environment Map

For even richer reflections, add a simple environment map using drei's `<Environment>`:

```tsx
import { Environment } from '@react-three/drei'

<Canvas ...>
  <Environment preset="night" />  // subtle dark environment for reflections
  ...
</Canvas>
```

This gives the glass rings something to reflect. The "night" preset is very dark and won't brighten the scene — it just provides subtle reflection data for the physical materials.

**WARNING**: Only add `<Environment>` if it doesn't significantly impact performance. Test on mobile — if frame rate drops below 30fps, remove it. The orbiting light alone should be sufficient.

---

## i18n Keys

**English:**
```json
{
  "settings.title": "Settings",
  "settings.planetSize": "Planet Size",
  "settings.rotationSpeed": "Rotation Speed",
  "settings.rotationSound": "Rotation Sound",
  "settings.rotationSoundHint": "Low vortex hum when spinning the wheel",
  "settings.small": "Small",
  "settings.large": "Large",
  "settings.paused": "Paused",
  "settings.fast": "Fast",
  "settings.reset": "Reset to Defaults"
}
```

**Lithuanian:**
```json
{
  "settings.title": "Nustatymai",
  "settings.planetSize": "Planetų Dydis",
  "settings.rotationSpeed": "Sukimosi Greitis",
  "settings.rotationSound": "Sukimosi Garsas",
  "settings.rotationSoundHint": "Žemas vortekso gūdesys sukant ratą",
  "settings.small": "Mažas",
  "settings.large": "Didelis",
  "settings.paused": "Sustabdytas",
  "settings.fast": "Greitas",
  "settings.reset": "Atkurti Numatytuosius"
}
```

---

## Build Steps

### Phase A: Settings Panel
1. Create settings state with localStorage persistence
2. Create SettingsPanel component
3. Add gear icon to header (next to info button)
4. Wire planet scale to planet rendering
5. Wire rotation speed to OrbitControls autoRotateSpeed
6. Test: open settings → adjust sliders → wheel responds in real time
7. Test: close settings → preferences persist on page reload

### Phase B: Rotation Sound
8. Create RotationSoundLayer class in audio/
9. Add rotation sound methods to CosmicAudioEngine (ADD only, don't restructure)
10. Track rotation velocity in useFrame
11. Wire velocity to rotation sound when enabled
12. Test: enable rotation sound in settings → spin wheel → hear vortex hum
13. Test: sound is silent when wheel is still
14. Test: sound only plays when BOTH main audio toggle AND settings toggle are on

### Phase C: Earth Visibility
15. Find Earth mesh materials and increase emissive intensity and colours
16. Increase atmosphere glow opacity
17. Test: Earth is clearly visible as a blue-green sphere at wheel centre

### Phase D: Glass Ring Enhancement
18. Add OrbitingLight component inside Canvas
19. Verify ring materials are meshPhysicalMaterial with clearcoat
20. Optionally add Environment preset (test performance first)
21. Test: glass rings shimmer continuously as the orbiting light moves
22. Test: shimmer is visible without user needing to manually rotate

### Phase E: Final Verification
23. Test ALL existing features still work:
    - Planet tap → detail panel ✓
    - Zodiac tap → detail panel ✓  
    - Earth tap → Earth panel ✓
    - Day navigation ✓
    - Sound toggle → drone + binaural ✓
    - Info button → About modal ✓
    - Language switcher ✓
    - Wheel entrance animation ✓
    - All modals close properly (no stuck dim) ✓
24. Run `npm run build`
25. Push to **main** branch
26. Commit: `feat: settings panel, rotation vortex audio, Earth visibility, glass ring shimmer`
