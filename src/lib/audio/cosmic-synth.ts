import { PlanetPosition } from '@/types';
import { PLANET_WAVEFORMS, PLANET_VOLUMES, PLANET_LFO_RATES, PLANET_DETUNE } from '@/lib/astro/frequency-map';

interface OscillatorNode {
  oscillator: globalThis.OscillatorNode;
  gain: GainNode;
  lfo: globalThis.OscillatorNode;
  lfoGain: GainNode;
}

export class CosmicSynth {
  private ctx: AudioContext | null = null;
  private nodes: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;
  private delay: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private isPlaying = false;

  async start(planets: PlanetPosition[]): Promise<void> {
    if (this.isPlaying) return;

    this.ctx = new AudioContext();

    // iOS fix
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 3);

    // Delay for space/reverb
    this.delay = this.ctx.createDelay(1);
    this.delay.delayTime.setValueAtTime(0.3, this.ctx.currentTime);
    this.delayGain = this.ctx.createGain();
    this.delayGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    this.masterGain.connect(this.ctx.destination);
    this.masterGain.connect(this.delay);
    this.delay.connect(this.delayGain);
    this.delayGain.connect(this.ctx.destination);
    this.delayGain.connect(this.delay); // feedback loop

    planets.forEach((planet) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      // Main oscillator
      osc.type = PLANET_WAVEFORMS[planet.planet];
      osc.frequency.setValueAtTime(planet.frequency, this.ctx.currentTime);
      osc.detune.setValueAtTime(PLANET_DETUNE[planet.planet], this.ctx.currentTime);

      // Volume
      const vol = PLANET_VOLUMES[planet.planet];
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);

      // LFO for organic breathing
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(PLANET_LFO_RATES[planet.planet], this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(vol * 0.3, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      lfo.start();

      this.nodes.push({ oscillator: osc, gain, lfo, lfoGain });
    });

    this.isPlaying = true;
  }

  stop(): void {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(0, now + 2);

    setTimeout(() => {
      this.nodes.forEach(({ oscillator, lfo }) => {
        try {
          oscillator.stop();
          lfo.stop();
        } catch {
          // already stopped
        }
      });
      this.nodes = [];

      if (this.ctx) {
        this.ctx.close();
        this.ctx = null;
      }
      this.masterGain = null;
      this.delay = null;
      this.delayGain = null;
      this.isPlaying = false;
    }, 2100);
  }

  get playing(): boolean {
    return this.isPlaying;
  }
}
