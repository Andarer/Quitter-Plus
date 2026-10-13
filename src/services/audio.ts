/**
 * Web Audio API synthesizer for offline ambient sound & feedback
 * Works 100% offline without external audio files
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play gentle bell chime (C5 or E5 chord)
  playChime(freq = 528): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {
      console.warn('Audio chime error', e);
    }
  }

  // Play celebratory achievement fanfare
  playAchievementFanfare(): void {
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq);
      }, idx * 120);
    });
  }

  // Start soothing ambient wave generator for Urge Surfing
  startAmbientWaves(): void {
    if (this.isAmbientPlaying) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Create pink noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter to simulate ocean swells
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      // Low frequency oscillator for wave ebb & flow
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 5-second wave cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(180, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);

      noise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      noise.start();
      lfo.start();

      this.ambientGain = masterGain;
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Ambient waves error', e);
    }
  }

  stopAmbientWaves(): void {
    if (!this.isAmbientPlaying || !this.ambientGain || !this.ctx) return;
    try {
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      setTimeout(() => {
        this.isAmbientPlaying = false;
        this.ambientGain = null;
      }, 1000);
    } catch {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundService = new SoundSynthesizer();
