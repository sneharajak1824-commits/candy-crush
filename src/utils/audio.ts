// Authentic Web Audio API synthesizer for Indian Garba Dhol, Dandiya Clacks, and Chimes
// Zero external audio files required, zero latency, runs instantly on any device!

class GarbaSoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private masterGain: GainNode | null = null;
  
  // Background Dhol loop sequencer
  private isBeatRunning: boolean = false;
  private bpm: number = 108;
  private beatStep: number = 0;
  private timerId: number | null = null;
  private isFrenzyActive: boolean = false;

  constructor() {
    try {
      const savedMute = localStorage.getItem('garba_dash_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('garba_dash_vol');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol);
      }
    } catch {
      // ignore
    }
  }

  public initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('garba_dash_muted', String(this.isMuted));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    try {
      localStorage.setItem('garba_dash_vol', String(this.volume));
    } catch {}
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // --- SOUND EFFECTS ---

  /** Dandiya Clack ("Taak!"): High resonant wood block strike with crisp transient */
  public playDandiyaClack(pitchMultiplier = 1.0, isPerfect = false): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      // Primary wood strike
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 * pitchMultiplier, now);
      filter.Q.setValueAtTime(3.5, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(380 * pitchMultiplier, now + 0.045);

      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);

      // Add a secondary resonance for authentic hollow wooden dandiya stick
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2200 * pitchMultiplier, now);
      gain2.gain.setValueAtTime(0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now);
      osc2.stop(now + 0.05);

      // If PERFECT catch, trigger cheerful Ghunghroo bell shimmer!
      if (isPerfect) {
        this.playGhunghroo(now + 0.02);
      }
    } catch {
      // Audio gracefully fails if autoplay blocked
    }
  }

  /** Ghunghroo / Manjira Jingle (High shimmering bell chime) */
  public playGhunghroo(startTime?: number): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    try {
      const t = startTime || ctx.currentTime;
      const freqs = [2637, 3135, 3951, 4698]; // High harmonic frequencies
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        const amp = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(amp, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {}
  }

  /** Sweet Pickup (Jalebi-Fafda / Modak) - Cheerful ascending flourish */
  public playSweetBonus(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.05 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.22);
      });
    } catch {}
  }

  /** Bhide's Whistle Screech (Obstacle collision!) */
  public playBhideWhistle(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Dual high warble whistle
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.linearRampToValueAtTime(2200, now + 0.05);
      osc.frequency.linearRampToValueAtTime(1900, now + 0.1);
      osc.frequency.linearRampToValueAtTime(2400, now + 0.18);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  /** Missed Dandiya Thud */
  public playMissThud(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }

  /** "Hey Maa Mataji!" celebration jingle (Signature Daya Victory) */
  public playHeyMaaMataji(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      // Traditional Gujarati celebratory motif: Dha-Ni-Sa-Re-Ga
      const melody = [
        { freq: 440.0, dur: 0.12, time: 0 },
        { freq: 493.88, dur: 0.12, time: 0.12 },
        { freq: 554.37, dur: 0.15, time: 0.24 },
        { freq: 659.25, dur: 0.22, time: 0.39 },
        { freq: 880.0, dur: 0.45, time: 0.61 },
      ];

      melody.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.freq, now + item.time);

        gain.gain.setValueAtTime(0, now + item.time);
        gain.gain.linearRampToValueAtTime(0.3, now + item.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + item.time);
        osc.stop(now + item.time + item.dur + 0.02);
      });
    } catch {}
  }

  /** Super Garba Frenzy Mode Activated! */
  public playFrenzyStart(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      // Rapid ascending Garba shehnai trill
      for (let i = 0; i < 8; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500 + i * 90, now + i * 0.04);

        gain.gain.setValueAtTime(0.18, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.09);
      }
    } catch {}
  }

  // --- BACKGROUND DHOL BEAT SEQUENCER ---

  /** Starts real-time festive Gujarati Garba Dhol rhythm */
  public startGarbaBeat(bpm = 108): void {
    this.bpm = bpm;
    this.isBeatRunning = true;
    this.beatStep = 0;
    this.scheduleNextBeat();
  }

  public updateBpm(bpm: number, isFrenzy: boolean): void {
    this.bpm = bpm;
    this.isFrenzyActive = isFrenzy;
  }

  public stopGarbaBeat(): void {
    this.isBeatRunning = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextBeat(): void {
    if (!this.isBeatRunning) return;

    // 16-step Garba rhythm pattern (Dha - Ge - Na - Tin | Ta - Ke - Dha - Ge)
    this.playDholStep(this.beatStep);

    this.beatStep = (this.beatStep + 1) % 16;

    // 16th note interval = (60 / bpm) / 4 * 1000 ms
    const effectiveBpm = this.isFrenzyActive ? this.bpm * 1.25 : this.bpm;
    const intervalMs = (60 / effectiveBpm / 4) * 1000;

    this.timerId = window.setTimeout(() => {
      this.scheduleNextBeat();
    }, intervalMs);
  }

  /** Plays individual Dhol strokes */
  private playDholStep(step: number): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    // Standard Gujarati Garba groove accents:
    // Bass Dhol (Dha) on 0, 6, 8, 12
    // Treble Snap (Ta/Tin) on 2, 4, 10, 14
    // Ghunghroo jingles periodically
    const isBass = step === 0 || step === 6 || step === 8 || step === 12;
    const isTreble = step === 2 || step === 4 || step === 10 || step === 14;
    const isHighAccent = step === 0 || step === 8;

    if (isBass) {
      this.playDholBass(isHighAccent);
    }
    if (isTreble) {
      this.playDholTreble();
    }
    if (this.isFrenzyActive && (step % 2 === 0)) {
      // Shimmering tambourine / manjira during frenzy
      this.playGhunghroo();
    }
  }

  /** Dhol Bass Drum ("DHA"): Resonant low punch with warm pitch-drop */
  private playDholBass(accent = false): void {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startFreq = accent ? 130 : 105;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(52, now + 0.12);

      const amp = (accent ? 0.32 : 0.22) * (this.isFrenzyActive ? 1.2 : 1.0);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }

  /** Dhol Treble Rim ("TA / TIN"): Crisp high crack of the wooden stick on goat skin */
  private playDholTreble(): void {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);

      osc.type = 'square';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }
}

export const garbaAudio = new GarbaSoundManager();
