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

    this.baseOsc = this.ctx.createOscillator()
    this.baseOsc.type = 'sine'
    this.baseOsc.frequency.value = 40
    this.baseOsc.connect(this.oscGain)
    this.baseOsc.start()

    // Sub-harmonic for richness
    const subGain = this.ctx.createGain()
    subGain.gain.value = 0.5
    this.subOsc = this.ctx.createOscillator()
    this.subOsc.type = 'sine'
    this.subOsc.frequency.value = 20
    this.subOsc.connect(subGain)
    subGain.connect(this.oscGain)
    this.subOsc.start()

    // Filtered noise — the "whoosh" texture
    this.noiseGain = this.ctx.createGain()
    this.noiseGain.gain.value = 0

    this.noiseFilter = this.ctx.createBiquadFilter()
    this.noiseFilter.type = 'bandpass'
    this.noiseFilter.frequency.value = 200
    this.noiseFilter.Q.value = 2

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

  updateVelocity(angularVelocity: number) {
    if (!this.isActive) return

    const absVel = Math.abs(angularVelocity)
    const normalised = Math.min(absVel / 3, 1)

    const now = this.ctx.currentTime
    const smoothing = 0.1

    if (this.oscGain) {
      this.oscGain.gain.linearRampToValueAtTime(normalised * 0.08, now + smoothing)
    }
    if (this.noiseGain) {
      this.noiseGain.gain.linearRampToValueAtTime(normalised * 0.04, now + smoothing)
    }
    if (this.baseOsc) {
      this.baseOsc.frequency.linearRampToValueAtTime(40 + normalised * 40, now + smoothing)
    }
    if (this.noiseFilter) {
      this.noiseFilter.frequency.linearRampToValueAtTime(200 + normalised * 600, now + smoothing)
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
    setTimeout(() => {
      try { bo?.stop() } catch { /* ok */ }
      try { so?.stop() } catch { /* ok */ }
      try { nn?.stop() } catch { /* ok */ }
    }, 600)

    this.baseOsc = null
    this.subOsc = null
    this.noiseNode = null
    this.oscGain = null
    this.noiseGain = null
    this.noiseFilter = null
    this.isActive = false
  }
}
