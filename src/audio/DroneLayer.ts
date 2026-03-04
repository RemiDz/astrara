import { SIGN_FREQUENCIES } from './frequencies'

export class DroneLayer {
  private ctx: AudioContext
  private masterGain: GainNode
  private oscillators: OscillatorNode[] = []
  private gains: GainNode[] = []
  private lfo: OscillatorNode | null = null
  private lfoGain: GainNode | null = null
  private isPlaying = false

  constructor(ctx: AudioContext, masterGain: GainNode) {
    this.ctx = ctx
    this.masterGain = masterGain
  }

  start(moonSign: string) {
    if (this.isPlaying) this.stop()

    const rootFreq = SIGN_FREQUENCIES[moonSign] || 432

    // Create a rich drone with multiple oscillators
    // Frequencies halved/quartered for comfortable listening range
    this.createOsc('sine', rootFreq / 4, 0.15)   // Sub-bass foundation
    this.createOsc('sine', rootFreq / 2, 0.12)   // Root tone
    this.createOsc('sine', (rootFreq / 2) * 1.5, 0.06) // Fifth above root
    this.createOsc('sine', rootFreq, 0.04)        // Octave brightness
    this.createOsc('sine', (rootFreq / 2) * 1.002, 0.05) // Detuned width

    // Slow LFO for breathing effect
    this.lfo = this.ctx.createOscillator()
    this.lfoGain = this.ctx.createGain()
    this.lfo.type = 'sine'
    this.lfo.frequency.value = 0.08 // one breath every ~12 seconds
    this.lfoGain.gain.value = 0.02  // subtle modulation
    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.masterGain.gain)
    this.lfo.start()

    this.isPlaying = true
  }

  private createOsc(type: OscillatorType, freq: number, vol: number) {
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

    this.oscillators.push(osc)
    this.gains.push(gain)
  }

  stop() {
    const now = this.ctx.currentTime
    // Fade out each gain node, then stop oscillators
    this.gains.forEach(g => {
      g.gain.cancelScheduledValues(now)
      g.gain.setValueAtTime(g.gain.value, now)
      g.gain.linearRampToValueAtTime(0, now + 2)
    })
    const oscs = [...this.oscillators]
    const gains = [...this.gains]
    setTimeout(() => {
      oscs.forEach(o => { try { o.stop() } catch { /* already stopped */ } })
      gains.forEach(g => { try { g.disconnect() } catch { /* ok */ } })
    }, 2200)

    if (this.lfo) {
      try { this.lfo.stop(now + 2) } catch { /* ok */ }
      this.lfo = null
    }
    if (this.lfoGain) {
      try { this.lfoGain.disconnect() } catch { /* ok */ }
      this.lfoGain = null
    }

    this.oscillators = []
    this.gains = []
    this.isPlaying = false
  }

  updateSign(newSign: string) {
    this.stop()
    setTimeout(() => this.start(newSign), 2200)
  }
}
