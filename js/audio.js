// Web Audio API Procedural Sound Engine
// Zero external assets required - runs offline & anywhere
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.engineOsc = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.screechNoise = null;
    this.screechGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.initEngineSound();
      this.initScreechSound();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
    }
    if (this.screechGain && this.ctx && this.isMuted) {
      this.screechGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  initEngineSound() {
    if (!this.ctx) return;
    // Engine base oscillator
    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

    // Lowpass filter to muffle harsh high frequencies
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.engineOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);
    this.engineOsc.start();
  }

  initScreechSound() {
    if (!this.ctx) return;
    // White noise buffer for tire screech
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1400, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.screechGain = this.ctx.createGain();
    this.screechGain.gain.setValueAtTime(0, this.ctx.currentTime);

    whiteNoise.connect(bandpass);
    bandpass.connect(this.screechGain);
    this.screechGain.connect(this.ctx.destination);
    whiteNoise.start();
  }

  updateEngine(speedRatio, isAccelerating, inRace = true) {
    if (!this.initialized || this.isMuted || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    if (!inRace) {
      this.engineGain.gain.setTargetAtTime(0, t, 0.05);
      return;
    }

    // Target pitch from 40Hz (idle) to 220Hz (top rev)
    const baseFreq = 48 + speedRatio * 160 + (isAccelerating ? 25 : 0);
    const filterFreq = 300 + speedRatio * 850 + (isAccelerating ? 300 : 0);
    const targetVolume = this.isMuted ? 0 : 0.09 + speedRatio * 0.06;

    this.engineOsc.frequency.setTargetAtTime(baseFreq, t, 0.06);
    this.engineFilter.frequency.setTargetAtTime(filterFreq, t, 0.06);
    this.engineGain.gain.setTargetAtTime(targetVolume, t, 0.05);
  }

  setTireScreech(intensity) {
    if (!this.initialized || this.isMuted || !this.screechGain) return;
    const t = this.ctx.currentTime;
    const clamped = Math.max(0, Math.min(1, intensity));
    this.screechGain.gain.setTargetAtTime(clamped * 0.12, t, 0.03);
  }

  playCountdownBeep(isFinal = false) {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isFinal ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 440, this.ctx.currentTime);

    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isFinal ? 0.45 : 0.25));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + (isFinal ? 0.5 : 0.3));
  }

  playHonk() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    [440, 554].forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  playCollision() {
    if (this.isMuted || !this.ctx) return;
    const now = performance.now();
    if (this.lastCollisionTime && now - this.lastCollisionTime < 200) return;
    this.lastCollisionTime = now;

    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.15);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playVictory() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    // Victory fanfare notes: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (idx === 3 ? 0.6 : 0.22));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + (idx === 3 ? 0.65 : 0.25));
    });
  }

  playCardOpen() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    // Magical cute chime notes: G5, B5, D6, G6
    const notes = [783.99, 987.77, 1174.66, 1567.98];
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);
  }
}

window.soundManager = new SoundManager();
