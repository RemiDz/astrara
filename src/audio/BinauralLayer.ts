export class BinauralLayer {
  private ctx: AudioContext
  private masterGain: GainNode
  private leftOsc: OscillatorNode | null = null
  private rightOsc: OscillatorNode | null = null
  private leftGain: GainNode | null = null
  private rightGain: GainNode | null = null
  private merger: ChannelMergerNode | null = null
  private isPlaying = false

  constructor(ctx: AudioContext, masterGain: GainNode) {
    this.ctx = ctx
    this.masterGain = masterGain
  }

  start(carrierFreq: number, beatFreq: number) {
    if (this.isPlaying) this.stop()

    this.merger = this.ctx.createChannelMerger(2)

    // Left ear: carrier frequency
    this.leftGain = this.ctx.createGain()
    this.leftGain.gain.value = 0
    this.leftOsc = this.ctx.createOscillator()
    this.leftOsc.type = 'sine'
    this.leftOsc.frequency.value = carrierFreq
    this.leftOsc.connect(this.leftGain)
    this.leftGain.connect(this.merger, 0, 0)

    // Right ear: carrier + beat frequency
    this.rightGain = this.ctx.createGain()
    this.rightGain.gain.value = 0
    this.rightOsc = this.ctx.createOscillator()
    this.rightOsc.type = 'sine'
    this.rightOsc.frequency.value = carrierFreq + beatFreq
    this.rightOsc.connect(this.rightGain)
    this.rightGain.connect(this.merger, 0, 1)

    this.merger.connect(this.masterGain)

    this.leftOsc.start()
    this.rightOsc.start()

    // Fade in over 3 seconds
    const now = this.ctx.currentTime
    this.leftGain.gain.linearRampToValueAtTime(0.08, now + 3)
    this.rightGain.gain.linearRampToValueAtTime(0.08, now + 3)

    this.isPlaying = true
  }

  stop() {
    const now = this.ctx.currentTime
    if (this.leftGain) {
      this.leftGain.gain.cancelScheduledValues(now)
      this.leftGain.gain.setValueAtTime(this.leftGain.gain.value, now)
      this.leftGain.gain.linearRampToValueAtTime(0, now + 2)
    }
    if (this.rightGain) {
      this.rightGain.gain.cancelScheduledValues(now)
      this.rightGain.gain.setValueAtTime(this.rightGain.gain.value, now)
      this.rightGain.gain.linearRampToValueAtTime(0, now + 2)
    }

    const lo = this.leftOsc
    const ro = this.rightOsc
    const lg = this.leftGain
    const rg = this.rightGain
    const mg = this.merger
    setTimeout(() => {
      try { lo?.stop() } catch { /* ok */ }
      try { ro?.stop() } catch { /* ok */ }
      try { lg?.disconnect() } catch { /* ok */ }
      try { rg?.disconnect() } catch { /* ok */ }
      try { mg?.disconnect() } catch { /* ok */ }
    }, 2200)

    this.leftOsc = null
    this.rightOsc = null
    this.leftGain = null
    this.rightGain = null
    this.merger = null
    this.isPlaying = false
  }
}
