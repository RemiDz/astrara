# ASTRARA v2 — Iteration 10: Cosmic Soundscape — Hear the Sky

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Vision

Astrara becomes the first astrology app you can **hear**. A subtle ambient drone plays in the background, tuned to the current planetary configuration, with an optional binaural beats layer for brainwave entrainment. Tapping planets on the wheel plays their individual frequency tone — turning the astro wheel into a celestial instrument.

Audio is **off by default**. The user taps a sound icon in the header to toggle it on. Their preference is saved in localStorage.

All audio is generated client-side using the Web Audio API — zero audio files, zero downloads, zero API calls.

---

## Architecture

```
src/
├── audio/
│   ├── CosmicAudioEngine.ts    # Main audio engine class
│   ├── DroneLayer.ts           # Background drone generator
│   ├── BinauralLayer.ts        # Binaural beats generator
│   ├── PlanetToneLayer.ts      # Interactive planet tone player
│   ├── frequencies.ts          # Planet/sign frequency mappings
│   └── useCosmicAudio.ts       # React hook for audio state
```

---

## Sound Toggle — Header Icon

Add a sound icon to the header, between the location and language switcher:

```
┌──────────────────────────────────────────────┐
│  ASTRARA          📍Durham   🔇   🇬🇧 EN ▾  │
└──────────────────────────────────────────────┘
                                 ↑
                          tap to toggle 🔈/🔇
```

```tsx
<button
  type="button"
  onClick={toggleAudio}
  className="text-white/40 hover:text-white/70 transition-colors select-none text-lg"
  aria-label={audioOn ? 'Mute cosmic soundscape' : 'Play cosmic soundscape'}
>
  {audioOn ? '🔈' : '🔇'}
</button>
```

- Default: muted (🔇)
- On tap: unmuted (🔈) — audio fades in over 2 seconds
- Preference saved: `localStorage.setItem('astrara-audio', 'on' | 'off')`
- On subsequent visits, if saved preference is 'on', show the icon as 🔈 but do NOT auto-play (browsers block autoplay). Instead show a subtle pulse on the icon to invite the user to tap it. Audio only starts on user interaction (click/tap).

---

## Layer 1: Background Drone

The foundation. A rich, evolving drone that shifts based on the current Moon sign and dominant planetary energy.

### Frequency Selection

The drone's root frequency is determined by the **Moon's current zodiac sign**, using the sign-frequency mapping already established in the zodiac detail panels:

```typescript
// audio/frequencies.ts

export const SIGN_FREQUENCIES: Record<string, number> = {
  aries:       396,    // Liberation
  taurus:      417,    // Facilitating change
  gemini:      528,    // Transformation
  cancer:      639,    // Connection
  leo:         741,    // Expression
  virgo:       852,    // Intuition
  libra:       639,    // Harmony
  scorpio:     174,    // Foundation
  sagittarius: 963,    // Awakening
  capricorn:   285,    // Healing
  aquarius:    963,    // Cosmic consciousness
  pisces:      852,    // Third eye
}

// Planet frequencies based on Hans Cousto's octave method
// (planetary orbital periods transposed into audible range)
export const PLANET_FREQUENCIES: Record<string, number> = {
  sun:     126.22,   // Solar year tone
  moon:    210.42,   // Synodic month tone (D#)
  mercury: 141.27,   // Mercury orbit
  venus:   221.23,   // Venus orbit (A)
  mars:    144.72,   // Mars orbit (D)
  jupiter: 183.58,   // Jupiter orbit (F#)
  saturn:  147.85,   // Saturn orbit (D)
  uranus:  207.36,   // Uranus orbit
  neptune: 211.44,   // Neptune orbit
  pluto:   140.25,   // Pluto orbit
}
```

### Drone Implementation

```typescript
// audio/DroneLayer.ts

export class DroneLayer {
  private ctx: AudioContext
  private masterGain: GainNode
  private oscillators: OscillatorNode[] = []
  private isPlaying = false

  constructor(ctx: AudioContext, masterGain: GainNode) {
    this.ctx = ctx
    this.masterGain = masterGain
  }

  start(moonSign: string) {
    if (this.isPlaying) this.stop()
    
    const rootFreq = SIGN_FREQUENCIES[moonSign] || 432
    
    // Create a rich drone with multiple oscillators
    
    // 1. Sub-bass foundation (one octave below root, very quiet)
    const sub = this.createOsc('sine', rootFreq / 4, 0.15)
    
    // 2. Root tone (sine — pure, warm)
    const root = this.createOsc('sine', rootFreq / 2, 0.12)
    
    // 3. Fifth above root (creates openness)
    const fifth = this.createOsc('sine', (rootFreq / 2) * 1.5, 0.06)
    
    // 4. Octave above root (brightness)
    const octave = this.createOsc('sine', rootFreq, 0.04)
    
    // 5. Subtle detuned layer (creates width/movement)
    const detune = this.createOsc('sine', (rootFreq / 2) * 1.002, 0.05)
    
    this.oscillators = [sub, root, fifth, octave, detune]
    
    // Slow LFO to modulate the drone volume for a breathing effect
    const lfo = this.ctx.createOscillator()
    const lfoGain = this.ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 0.08  // very slow: one breath every ~12 seconds
    lfoGain.gain.value = 0.02   // subtle volume modulation
    lfo.connect(lfoGain)
    lfoGain.connect(this.masterGain.gain)
    lfo.start()
    
    this.isPlaying = true
  }

  private createOsc(type: OscillatorType, freq: number, vol: number): OscillatorNode {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = 0
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    
    // Fade in over 3 seconds
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 3)
    
    return osc
  }

  stop() {
    this.oscillators.forEach(osc => {
      // Fade out over 2 seconds before stopping
      const gain = osc.connect(this.masterGain) // get the gain node
      // Simplified: just stop with a slight delay
      osc.stop(this.ctx.currentTime + 2)
    })
    this.oscillators = []
    this.isPlaying = false
  }

  // Call when Moon changes sign (rare — every ~2.5 days)
  updateSign(newSign: string) {
    // Crossfade: start new drone, fade out old
    this.stop()
    setTimeout(() => this.start(newSign), 2000)
  }
}
```

**Important**: The drone frequencies are halved (divided by 2 or 4) to bring solfeggio frequencies into a comfortable listening range. 852 Hz as a raw tone is quite high-pitched; 852/2 = 426 Hz and 852/4 = 213 Hz are much warmer drone fundamentals.

---

## Layer 2: Binaural Beats

A binaural beat is created by playing slightly different frequencies in the left and right ears. The brain perceives the difference as a pulsing tone at the difference frequency, which can entrain brainwaves.

### Binaural Frequency Selection

The binaural beat frequency is determined by the **dominant planetary energy** of the day:

```typescript
// audio/frequencies.ts

export const BINAURAL_PRESETS: Record<string, { hz: number; label: string }> = {
  // Mapped to planetary energies
  grounding:    { hz: 3.5,  label: 'Delta — deep rest' },        // Saturn, Pluto
  calming:      { hz: 6.0,  label: 'Theta — meditation' },       // Moon, Neptune
  balanced:     { hz: 7.83, label: 'Schumann — Earth sync' },     // Default / Earth
  focused:      { hz: 10.0, label: 'Alpha — relaxed focus' },     // Mercury, Sun
  energising:   { hz: 14.0, label: 'Low Beta — alertness' },      // Mars, Jupiter
  creative:     { hz: 7.0,  label: 'Theta — imagination' },       // Venus, Uranus
}

export function getBinauralPreset(planets: PlanetPosition[]): { hz: number; label: string } {
  // Find the most influential planet based on:
  // 1. Is it the sign ruler of today's Sun sign?
  // 2. Is it making the tightest aspect?
  // 3. Fallback: use Schumann resonance (7.83 Hz)
  
  // Simplified: use Moon sign element
  const moonSign = planets.find(p => p.name === 'Moon')?.zodiacSign
  const element = getSignElement(moonSign)
  
  switch (element) {
    case 'fire':  return BINAURAL_PRESETS.energising
    case 'earth': return BINAURAL_PRESETS.grounding
    case 'air':   return BINAURAL_PRESETS.focused
    case 'water': return BINAURAL_PRESETS.calming
    default:      return BINAURAL_PRESETS.balanced
  }
}
```

### Binaural Implementation

```typescript
// audio/BinauralLayer.ts

export class BinauralLayer {
  private ctx: AudioContext
  private masterGain: GainNode
  private leftOsc: OscillatorNode | null = null
  private rightOsc: OscillatorNode | null = null
  private merger: ChannelMergerNode | null = null
  private isPlaying = false

  constructor(ctx: AudioContext, masterGain: GainNode) {
    this.ctx = ctx
    this.masterGain = masterGain
  }

  start(carrierFreq: number, beatFreq: number) {
    if (this.isPlaying) this.stop()
    
    // Create stereo merger
    this.merger = this.ctx.createChannelMerger(2)
    
    // Left ear: carrier frequency
    const leftGain = this.ctx.createGain()
    leftGain.gain.value = 0
    this.leftOsc = this.ctx.createOscillator()
    this.leftOsc.type = 'sine'
    this.leftOsc.frequency.value = carrierFreq
    this.leftOsc.connect(leftGain)
    leftGain.connect(this.merger, 0, 0)  // left channel
    
    // Right ear: carrier + beat frequency
    const rightGain = this.ctx.createGain()
    rightGain.gain.value = 0
    this.rightOsc = this.ctx.createOscillator()
    this.rightOsc.type = 'sine'
    this.rightOsc.frequency.value = carrierFreq + beatFreq
    this.rightOsc.connect(rightGain)
    rightGain.connect(this.merger, 0, 1)  // right channel
    
    this.merger.connect(this.masterGain)
    
    this.leftOsc.start()
    this.rightOsc.start()
    
    // Fade in over 3 seconds
    leftGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 3)
    rightGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 3)
    
    this.isPlaying = true
  }

  stop() {
    if (this.leftOsc) this.leftOsc.stop(this.ctx.currentTime + 2)
    if (this.rightOsc) this.rightOsc.stop(this.ctx.currentTime + 2)
    this.isPlaying = false
  }
}
```

The carrier frequency for binaural beats should be the Moon's Cousto frequency (210.42 Hz) — a comfortable, warm tone. The beat frequency is the binaural preset (3.5–14 Hz depending on elemental energy).

---

## Layer 3: Interactive Planet Tones

When the user taps a planet on the wheel AND audio is enabled, play a short tone at that planet's Cousto frequency. This is a brief, musical moment — not a sustained sound.

```typescript
// audio/PlanetToneLayer.ts

export class PlanetToneLayer {
  private ctx: AudioContext
  private masterGain: GainNode

  constructor(ctx: AudioContext, masterGain: GainNode) {
    this.ctx = ctx
    this.masterGain = masterGain
  }

  playTone(planetName: string) {
    const freq = PLANET_FREQUENCIES[planetName.toLowerCase()]
    if (!freq) return
    
    // Create a bell-like tone with harmonics
    const now = this.ctx.currentTime
    const duration = 3  // seconds
    
    // Fundamental
    this.playPartial(freq, 0.15, now, duration)
    
    // Second harmonic (octave) — quieter
    this.playPartial(freq * 2, 0.06, now, duration)
    
    // Third harmonic (fifth above octave) — very quiet
    this.playPartial(freq * 3, 0.03, now, duration)
  }

  private playPartial(freq: number, volume: number, startTime: number, duration: number) {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()
    
    osc.type = 'sine'
    osc.frequency.value = freq
    
    // Soft low-pass filter for warmth
    filter.type = 'lowpass'
    filter.frequency.value = freq * 4
    filter.Q.value = 1
    
    // Bell-like envelope: quick attack, long decay
    gain.gain.value = 0
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.05)      // 50ms attack
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration) // slow decay
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    
    osc.start(startTime)
    osc.stop(startTime + duration + 0.1)
  }
}
```

### When Tapping Zodiac Signs

When a zodiac sign is tapped and audio is on, briefly shift the drone's character:
- Play a short chord based on the sign's element:
  - Fire signs: play a rising interval (ascending fifth)
  - Earth signs: play a low grounding pulse
  - Air signs: play a shimmer (quick octave arpeggio)
  - Water signs: play a gentle descending tone
- The effect lasts 2-3 seconds then the drone returns to normal

```typescript
playSignTone(signKey: string) {
  const freq = SIGN_FREQUENCIES[signKey]
  if (!freq) return
  
  const element = getSignElement(signKey)
  const now = this.ctx.currentTime
  
  switch (element) {
    case 'fire':
      this.playPartial(freq / 4, 0.1, now, 2)
      this.playPartial(freq / 4 * 1.5, 0.08, now + 0.1, 2)  // fifth above
      break
    case 'earth':
      this.playPartial(freq / 8, 0.12, now, 3)  // very low, grounding
      break
    case 'air':
      this.playPartial(freq / 2, 0.06, now, 1.5)
      this.playPartial(freq, 0.04, now + 0.15, 1.5)  // octave shimmer
      break
    case 'water':
      this.playPartial(freq / 2, 0.1, now, 2.5)
      this.playPartial(freq / 4, 0.08, now + 0.3, 2.5)  // descending
      break
  }
}
```

---

## Main Audio Engine

```typescript
// audio/CosmicAudioEngine.ts

export class CosmicAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private drone: DroneLayer | null = null
  private binaural: BinauralLayer | null = null
  private planetTone: PlanetToneLayer | null = null
  private isActive = false

  async init() {
    // Create AudioContext on user gesture (required by browsers)
    this.ctx = new AudioContext()
    
    // Master volume control
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0  // start silent
    this.masterGain.connect(this.ctx.destination)
    
    // Create layers
    this.drone = new DroneLayer(this.ctx, this.masterGain)
    this.binaural = new BinauralLayer(this.ctx, this.masterGain)
    this.planetTone = new PlanetToneLayer(this.ctx, this.masterGain)
  }

  async start(moonSign: string, binauralPreset: { hz: number }) {
    if (!this.ctx) await this.init()
    
    // Resume context if suspended (browser autoplay policy)
    if (this.ctx!.state === 'suspended') {
      await this.ctx!.resume()
    }
    
    // Fade in master volume
    this.masterGain!.gain.linearRampToValueAtTime(1, this.ctx!.currentTime + 2)
    
    // Start drone based on Moon sign
    this.drone!.start(moonSign)
    
    // Start binaural layer
    const carrierFreq = 210.42  // Moon Cousto frequency
    this.binaural!.start(carrierFreq, binauralPreset.hz)
    
    this.isActive = true
  }

  stop() {
    if (!this.ctx || !this.isActive) return
    
    // Fade out master volume over 2 seconds
    this.masterGain!.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2)
    
    // Stop layers after fade
    setTimeout(() => {
      this.drone?.stop()
      this.binaural?.stop()
      this.isActive = false
    }, 2200)
  }

  // Called when user taps a planet on the wheel
  onPlanetTap(planetName: string) {
    if (!this.isActive) return
    this.planetTone?.playTone(planetName)
  }

  // Called when user taps a zodiac sign on the wheel
  onSignTap(signKey: string) {
    if (!this.isActive) return
    this.planetTone?.playSignTone(signKey)
  }

  // Called when day changes (yesterday/tomorrow)
  updateConfiguration(moonSign: string, binauralPreset: { hz: number }) {
    if (!this.isActive) return
    this.drone?.updateSign(moonSign)
    // Binaural might change if Moon element changes
    this.binaural?.stop()
    const carrierFreq = 210.42
    setTimeout(() => {
      this.binaural?.start(carrierFreq, binauralPreset.hz)
    }, 2000)
  }

  isPlaying() {
    return this.isActive
  }
}
```

---

## React Hook

```typescript
// audio/useCosmicAudio.ts

import { useRef, useState, useCallback, useEffect } from 'react'
import { CosmicAudioEngine } from './CosmicAudioEngine'
import { getBinauralPreset } from './frequencies'

export function useCosmicAudio(planets: PlanetPosition[], moonSign: string) {
  const engineRef = useRef<CosmicAudioEngine | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Restore preference (but don't auto-play)
  useEffect(() => {
    const saved = localStorage.getItem('astrara-audio')
    // Just note the preference — actual playback requires user tap
    // Could show a subtle indicator that audio is available
  }, [])

  const toggle = useCallback(async () => {
    if (!engineRef.current) {
      engineRef.current = new CosmicAudioEngine()
    }

    if (isPlaying) {
      engineRef.current.stop()
      setIsPlaying(false)
      localStorage.setItem('astrara-audio', 'off')
    } else {
      const preset = getBinauralPreset(planets)
      await engineRef.current.start(moonSign, preset)
      setIsPlaying(true)
      localStorage.setItem('astrara-audio', 'on')
    }
  }, [isPlaying, planets, moonSign])

  const onPlanetTap = useCallback((planetName: string) => {
    engineRef.current?.onPlanetTap(planetName)
  }, [])

  const onSignTap = useCallback((signKey: string) => {
    engineRef.current?.onSignTap(signKey)
  }, [])

  // Update audio when day changes
  useEffect(() => {
    if (isPlaying && engineRef.current) {
      const preset = getBinauralPreset(planets)
      engineRef.current.updateConfiguration(moonSign, preset)
    }
  }, [moonSign, planets, isPlaying])

  return { isPlaying, toggle, onPlanetTap, onSignTap }
}
```

---

## Wiring Into Existing Components

### Header

```tsx
const { isPlaying, toggle, onPlanetTap, onSignTap } = useCosmicAudio(planets, moonSign)

// In header:
<button type="button" onClick={toggle} className="... select-none">
  {isPlaying ? '🔈' : '🔇'}
</button>
```

### Wheel Planet Taps

In the existing planet tap handler, add:

```tsx
const handlePlanetTap = (planet: PlanetPosition) => {
  onPlanetTap(planet.name)       // play tone if audio is on
  setSelectedPlanet(planet)       // open detail panel (existing behaviour)
}
```

### Wheel Zodiac Taps

```tsx
const handleSignTap = (sign: ZodiacSign) => {
  onSignTap(sign.key)            // play element tone if audio is on
  setSelectedSign(sign)           // open detail panel (existing behaviour)
}
```

---

## Audio Indicator — Subtle Visual Feedback

When audio is playing, add a very subtle visual indicator so users know it's active:

### Option: Pulsing rings around Earth

When audio is on, the Earth's atmosphere glow gently pulses in sync with the drone's LFO breathing (~0.08 Hz = one pulse every 12 seconds). This creates a visual-audio connection — Earth appears to breathe with the sound.

```tsx
// In the Earth component:
const atmosphereOpacity = audioPlaying 
  ? 0.12 + Math.sin(time * 0.08 * Math.PI * 2) * 0.05  // 0.07 to 0.17
  : 0.12  // static when audio off
```

---

## i18n Keys

**English:**
```json
{
  "audio.on": "Cosmic soundscape on",
  "audio.off": "Sound off",
  "audio.headphones": "Best with headphones 🎧"
}
```

**Lithuanian:**
```json
{
  "audio.on": "Kosminis garsovaizdis įjungtas",
  "audio.off": "Garsas išjungtas",
  "audio.headphones": "Geriausia su ausinėmis 🎧"
}
```

### Headphones Hint

The first time a user enables audio, show a brief toast notification:

```tsx
{showHeadphoneHint && (
  <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50
                  px-4 py-2 rounded-xl bg-black/80 backdrop-blur-sm
                  border border-white/10
                  text-white/60 text-xs
                  animate-fade-in-out">
    {t('audio.headphones')}
  </div>
)}
```

This shows for 3 seconds then fades away. Only shown once (track in localStorage).

---

## Performance & Browser Notes

- **AudioContext must be created on user gesture** — this is a browser requirement. The `toggle` function handles this by calling `init()` on first tap.
- **iOS Safari**: AudioContext may start in 'suspended' state. Always call `ctx.resume()` before starting oscillators.
- **Memory**: Oscillators that have `.stop()` called are automatically garbage collected. No manual cleanup needed.
- **CPU**: Web Audio oscillators are extremely lightweight. 5-8 simultaneous sine oscillators use negligible CPU.
- **Binaural beats require headphones** — without headphones, both ears hear both frequencies and there's no binaural effect. The hint toast reminds users.
- **Don't use Tone.js** — it's a large library and overkill for this. Raw Web Audio API is sufficient and keeps the bundle small.

---

## Build Steps

1. Read current audio-related code (if any) and the planet/sign tap handlers
2. Create `audio/frequencies.ts` with all frequency mappings
3. Create `audio/DroneLayer.ts`
4. Create `audio/BinauralLayer.ts`
5. Create `audio/PlanetToneLayer.ts`
6. Create `audio/CosmicAudioEngine.ts`
7. Create `audio/useCosmicAudio.ts` hook
8. Add sound toggle button to header
9. Wire `onPlanetTap` and `onSignTap` into existing wheel tap handlers
10. Add headphones hint toast (first time only)
11. Add Earth atmosphere pulse sync when audio is playing
12. Add i18n keys to both en.json and lt.json
13. Test: toggle audio on → drone + binaural starts with 2-second fade in
14. Test: toggle audio off → everything fades out over 2 seconds
15. Test: tap planets while audio is on → hear distinct tones for each planet
16. Test: tap zodiac signs → hear element-based tones
17. Test: switch days → drone updates if Moon sign changes
18. Test: on iOS Safari — audio works after tap
19. Test: headphones hint shows once then never again
20. Push to **main** branch
21. Run `npm run build`
22. Commit: `feat: cosmic soundscape — drone, binaural beats, interactive planet tones`
