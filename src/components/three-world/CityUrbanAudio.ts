/**
 * City Urban Audio Engine
 * Lightweight, procedural Web Audio API synthesizer for urban ambience,
 * vehicle hums, and footsteps.
 * Zero external asset dependencies, zero network requests, instant startup.
 */

class CityUrbanAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Safe default: muted until user activates
  private engineGain: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;
  private isInitialized: boolean = false;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (this.ctx) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Ambience noise node (soft city wind / distant street murmur)
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 240;

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.value = 0;

      noise.connect(filter);
      filter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.ctx.destination);
      noise.start();

      this.isInitialized = true;
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.isMuted = !this.isMuted;
    if (this.ambienceGain) {
      this.ambienceGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.08, this.ctx?.currentTime || 0, 0.1);
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Procedural footstep sound for avatar walking / sprinting
   */
  public playFootstep(isSprinting = false) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(isSprinting ? 95 : 80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio glitches
    }
  }
}

export const urbanAudio = new CityUrbanAudioManager();
