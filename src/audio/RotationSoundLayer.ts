export class RotationSoundLayer {
  private ctx: AudioContext
  private masterGain: GainNode
  private baseOsc: OscillatorNode | null = null
  private subOsc: OscillatorNode | null = null
  private noiseNode: AudioBufferSourceNode | null = null
  private oscGain: GainNode | null = null
  private noiseGain: GainNode | null = null
  private noiseFilter: BiquadFilterNode | null = null
  private noiseCeiling: BiquadFilterNode | null = null
  private lfo: OscillatorNode | null = null
  private lfoGain: GainNode | null = null
  private bassFilter: BiquadFilterNode | null = null
  private subGain: GainNode | null = null
  private isActive = false

  constructor(ctx: AudioContext, masterGain: GainNode) {
    this.ctx = ctx
    this.masterGain = masterGain
  }

  start() {
    if (this.isActive) return

    // Deep sub-bass oscillator — the core "vortex" hum
    this.oscGain = this.ctx.createGain()
    this.oscGain.gain.value = 0
    this.oscGain.connect(this.masterGain)

    // Resonant lowpass filter for woofer character
    this.bassFilter = this.ctx.createBiquadFilter()
    this.bassFilter.type = 'lowpass'
    this.bassFilter.frequency.value = 120
    this.bassFilter.Q.value = 4

    this.baseOsc = this.ctx.createOscillator()
    this.baseOsc.type = 'sine'
    this.baseOsc.frequency.value = 30
    this.baseOsc.connect(this.bassFilter)
    this.bassFilter.connect(this.oscGain)
    this.baseOsc.start()

    // Sub-harmonic for richness
    this.subGain = this.ctx.createGain()
    this.subGain.gain.value = 0.5
    this.subOsc = this.ctx.createOscillator()
    this.subOsc.type = 'sine'
    this.subOsc.frequency.value = 15
    this.subOsc.connect(this.subGain)
    this.subGain.connect(this.oscGain)
    this.subOsc.start()

    // LFO — pulsating "whooo whooo" modulation
    this.lfo = this.ctx.createOscillator()
    this.lfo.type = 'sine'
    this.lfo.frequency.value = 1
    this.lfoGain = this.ctx.createGain()
    this.lfoGain.gain.value = 0.04
    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.oscGain.gain)
    this.lfo.start()

    // Filtered noise — the "whoosh" texture
    this.noiseGain = this.ctx.createGain()
    this.noiseGain.gain.value = 0

    this.noiseFilter = this.ctx.createBiquadFilter()
    this.noiseFilter.type = 'bandpass'
    this.noiseFilter.frequency.value = 80
    this.noiseFilter.Q.value = 6

    // Hard lowpass ceiling — prevents harsh content on phone speakers
    this.noiseCeiling = this.ctx.createBiquadFilter()
    this.noiseCeiling.type = 'lowpass'
    this.noiseCeiling.frequency.value = 300
    this.noiseCeiling.Q.value = 1

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
    this.noiseFilter.connect(this.noiseCeiling)
    this.noiseCeiling.connect(this.noiseGain)
    this.noiseGain.connect(this.masterGain)
    this.noiseNode.start()

    this.isActive = true
  }

  updateVelocity(angularVelocity: number) {
    if (!this.isActive) return

    const absVel = Math.abs(angularVelocity)
    const normalised = Math.min(absVel / 3, 1)

    const now = this.ctx.currentTime
    const smoothing = 0.1

    // Bass volume — increased for woofer character
    if (this.oscGain) {
      this.oscGain.gain.linearRampToValueAtTime(normalised * 0.14, now + smoothing)
    }
    // Noise whoosh — quiet texture, not the main sound
    if (this.noiseGain) {
      this.noiseGain.gain.linearRampToValueAtTime(normalised * 0.02, now + smoothing)
    }
    // Base oscillator: 30 Hz → 70 Hz
    if (this.baseOsc) {
      this.baseOsc.frequency.linearRampToValueAtTime(30 + normalised * 40, now + smoothing)
    }
    // Sub oscillator: 15 Hz → 35 Hz (chest-rumbling)
    if (this.subOsc) {
      this.subOsc.frequency.linearRampToValueAtTime(15 + normalised * 20, now + smoothing)
    }
    // Noise filter stays in low range — max 250 Hz
    if (this.noiseFilter) {
      this.noiseFilter.frequency.linearRampToValueAtTime(80 + normalised * 170, now + smoothing)
    }
    // LFO rate: 1 Hz (slow spin) → 6 Hz (fast spin)
    if (this.lfo) {
      this.lfo.frequency.linearRampToValueAtTime(1 + normalised * 5, now + smoothing)
    }
    // LFO depth: subtle → strong pulsation
    if (this.lfoGain) {
      this.lfoGain.gain.linearRampToValueAtTime(normalised * 0.06, now + smoothing)
    }
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

    const bo = this.baseOsc
    const so = this.subOsc
    const nn = this.noiseNode
    const lf = this.lfo
    setTimeout(() => {
      try { bo?.stop() } catch { /* ok */ }
      try { so?.stop() } catch { /* ok */ }
      try { nn?.stop() } catch { /* ok */ }
      try { lf?.stop() } catch { /* ok */ }
    }, 600)

    this.baseOsc = null
    this.subOsc = null
    this.noiseNode = null
    this.oscGain = null
    this.noiseGain = null
    this.noiseFilter = null
    this.noiseCeiling = null
    this.lfo = null
    this.lfoGain = null
    this.bassFilter = null
    this.subGain = null
    this.isActive = false
  }
}
