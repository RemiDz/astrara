import { DroneLayer } from './DroneLayer'
import { BinauralLayer } from './BinauralLayer'
import { PlanetToneLayer } from './PlanetToneLayer'
import { RotationSoundLayer } from './RotationSoundLayer'

export class CosmicAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private rotationGain: GainNode | null = null // independent gain for rotation sound
  private drone: DroneLayer | null = null
  private binaural: BinauralLayer | null = null
  private planetTone: PlanetToneLayer | null = null
  private rotationSound: RotationSoundLayer | null = null
  private active = false

  private async init() {
    this.ctx = new AudioContext()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0 // start silent
    this.masterGain.connect(this.ctx.destination)

    // Separate gain node for rotation sound — bypasses master mute
    this.rotationGain = this.ctx.createGain()
    this.rotationGain.gain.value = 1
    this.rotationGain.connect(this.ctx.destination)

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

    // Fade in master volume over 2 seconds
    const now = this.ctx!.currentTime
    this.masterGain!.gain.cancelScheduledValues(now)
    this.masterGain!.gain.setValueAtTime(0, now)
    this.masterGain!.gain.linearRampToValueAtTime(1, now + 2)

    // Start layers
    this.drone!.start(moonSign)
    this.binaural!.start(210.42, binauralPreset.hz) // Moon Cousto frequency carrier

    this.active = true
  }

  stop() {
    if (!this.ctx || !this.active) return

    const now = this.ctx.currentTime
    this.masterGain!.gain.cancelScheduledValues(now)
    this.masterGain!.gain.setValueAtTime(this.masterGain!.gain.value, now)
    this.masterGain!.gain.linearRampToValueAtTime(0, now + 2)

    setTimeout(() => {
      this.drone?.stop()
      this.binaural?.stop()
      this.active = false
    }, 2200)
  }

  onPlanetTap(planetName: string) {
    if (!this.active) return
    this.planetTone?.playTone(planetName)
  }

  onSignTap(signKey: string) {
    if (!this.active) return
    this.planetTone?.playSignTone(signKey)
  }

  updateConfiguration(moonSign: string, binauralPreset: { hz: number }) {
    if (!this.active) return
    this.drone?.updateSign(moonSign)
    this.binaural?.stop()
    setTimeout(() => {
      this.binaural?.start(210.42, binauralPreset.hz)
    }, 2200)
  }

  async startRotationSound() {
    if (!this.ctx) await this.init()
    if (this.ctx!.state === 'suspended') {
      await this.ctx!.resume()
    }
    if (!this.rotationSound) {
      // Route through independent rotationGain — plays even when main audio is muted
      this.rotationSound = new RotationSoundLayer(this.ctx!, this.rotationGain!)
    }
    this.rotationSound.start()
  }

  stopRotationSound() {
    this.rotationSound?.stop()
  }

  updateRotationVelocity(velocity: number) {
    this.rotationSound?.updateVelocity(velocity)
  }

  isPlaying() {
    return this.active
  }
}
