import { PLANET_FREQUENCIES, SIGN_FREQUENCIES, getSignElement } from './frequencies'

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

    const now = this.ctx.currentTime
    const duration = 3

    // Bell-like tone with harmonics
    this.playPartial(freq, 0.15, now, duration)
    this.playPartial(freq * 2, 0.06, now, duration)   // octave
    this.playPartial(freq * 3, 0.03, now, duration)    // fifth above octave
  }

  playSignTone(signKey: string) {
    const freq = SIGN_FREQUENCIES[signKey]
    if (!freq) return

    const element = getSignElement(signKey)
    const now = this.ctx.currentTime

    switch (element) {
      case 'fire':
        this.playPartial(freq / 4, 0.1, now, 2)
        this.playPartial(freq / 4 * 1.5, 0.08, now + 0.1, 2) // rising fifth
        break
      case 'earth':
        this.playPartial(freq / 8, 0.12, now, 3) // very low, grounding
        break
      case 'air':
        this.playPartial(freq / 2, 0.06, now, 1.5)
        this.playPartial(freq, 0.04, now + 0.15, 1.5) // octave shimmer
        break
      case 'water':
        this.playPartial(freq / 2, 0.1, now, 2.5)
        this.playPartial(freq / 4, 0.08, now + 0.3, 2.5) // descending
        break
    }
  }

  private playPartial(freq: number, volume: number, startTime: number, duration: number) {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.value = freq

    filter.type = 'lowpass'
    filter.frequency.value = freq * 4
    filter.Q.value = 1

    // Bell-like envelope: quick attack, long decay
    gain.gain.value = 0
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(startTime)
    osc.stop(startTime + duration + 0.1)
  }
}
