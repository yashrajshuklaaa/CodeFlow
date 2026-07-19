class KeyboardAudio {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5; // subtle default volume
  private isMuted: boolean = false;
  private switchType: 'blue' | 'brown' | 'red' = 'brown'; // different tactile click profiles

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public getVolume() {
    return this.volume;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted() {
    return this.isMuted;
  }

  public setSwitchType(type: 'blue' | 'brown' | 'red') {
    this.switchType = type;
  }

  public getSwitchType() {
    return this.switchType;
  }

  public playCorrect(char: string) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Master gain node
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(this.volume, now);
      mainGain.connect(ctx.destination);

      const isSpaceOrEnter = char === ' ' || char === '\n' || char === '\r' || char === '\t';

      if (isSpaceOrEnter) {
        // Spacebar and Enter: Heavy, deep plastic "thock" sound with stabilizers
        // 1. Deep sine wave sweep for the heavy solid key body contact
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.08);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.6, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(oscGain);
        oscGain.connect(mainGain);

        // 2. Dynamic bandpass noise for the plastic stabilizer friction
        const noiseNode = this.createNoiseNode(ctx);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(280, now);
        noiseFilter.Q.setValueAtTime(4, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(mainGain);

        osc.start(now);
        noiseNode.start(now);

        osc.stop(now + 0.1);
        noiseNode.stop(now + 0.1);
      } else {
        // Normal Keypress: Custom tactile switches (Blue, Brown, Red profiles)
        // 1. Initial click switch latch (extremely fast high-frequency transient)
        const clickOsc = ctx.createOscillator();
        clickOsc.type = 'sine';
        
        let clickFreq = 2200;
        let clickGainVal = 0.35;
        let decayTime = 0.012;
        
        if (this.switchType === 'blue') {
          // Blue switches are extra clicky and metallic
          clickFreq = 2800;
          clickGainVal = 0.5;
          decayTime = 0.015;
        } else if (this.switchType === 'red') {
          // Red switches are linear and quiet
          clickFreq = 1600;
          clickGainVal = 0.15;
          decayTime = 0.008;
        }

        clickOsc.frequency.setValueAtTime(clickFreq, now);
        clickOsc.frequency.exponentialRampToValueAtTime(clickFreq * 0.5, now + decayTime);

        const clickGain = ctx.createGain();
        clickGain.gain.setValueAtTime(clickGainVal, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

        clickOsc.connect(clickGain);
        clickGain.connect(mainGain);

        // 2. Main switch housing collision
        const switchOsc = ctx.createOscillator();
        switchOsc.type = 'triangle';
        const organicOffset = Math.random() * 60 - 30; // organic variation so typing doesn't sound robotic
        let switchFreq = 380 + organicOffset;
        let switchDecay = 0.035;

        if (this.switchType === 'blue') {
          switchFreq = 480 + organicOffset;
          switchDecay = 0.04;
        } else if (this.switchType === 'red') {
          switchFreq = 300 + organicOffset;
          switchDecay = 0.03;
        }

        switchOsc.frequency.setValueAtTime(switchFreq, now);
        switchOsc.frequency.exponentialRampToValueAtTime(switchFreq * 0.7, now + switchDecay);

        const switchGain = ctx.createGain();
        switchGain.gain.setValueAtTime(0.55, now);
        switchGain.gain.exponentialRampToValueAtTime(0.001, now + switchDecay);

        switchOsc.connect(switchGain);
        switchGain.connect(mainGain);

        // 3. High-frequency release/scrape noise burst
        const noiseNode = this.createNoiseNode(ctx);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1600, now);

        const noiseGain = ctx.createGain();
        const noiseVal = this.switchType === 'blue' ? 0.15 : this.switchType === 'red' ? 0.05 : 0.09;
        noiseGain.gain.setValueAtTime(noiseVal, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(mainGain);

        clickOsc.start(now);
        switchOsc.start(now);
        noiseNode.start(now);

        clickOsc.stop(now + 0.05);
        switchOsc.stop(now + 0.05);
        noiseNode.stop(now + 0.05);
      }
    } catch (e) {
      console.warn("Audio Context playback failed", e);
    }
  }

  public playIncorrect() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(this.volume, now);
      mainGain.connect(ctx.destination);

      // Low, flat, slightly vibrating error "thump"
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.linearRampToValueAtTime(70, now + 0.15);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(114, now); // dissonance beats

      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(250, now);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.7, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(lpFilter);
      osc2.connect(lpFilter);
      lpFilter.connect(gainNode);
      gainNode.connect(mainGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.2);
      osc2.stop(now + 0.2);
    } catch (e) {
      console.warn("Audio Context playback failed", e);
    }
  }

  public playBackspace() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(this.volume * 0.8, now); // slightly softer
      mainGain.connect(ctx.destination);

      // Unique upward/downward backspace tactile "snip"
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gainNode);
      gainNode.connect(mainGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn("Audio Context playback failed", e);
    }
  }

  private createNoiseNode(ctx: AudioContext): AudioBufferSourceNode {
    const bufferSize = ctx.sampleRate * 0.15; // 150ms noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    return noise;
  }
}

export const keyboardAudio = new KeyboardAudio();
