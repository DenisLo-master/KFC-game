export type GameSound = 'pick' | 'startCooking' | 'ready' | 'serve' | 'error' | 'warning';

const STORAGE_KEY = 'kfs-audio-enabled';

type Tone = {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
};

const tones: Record<GameSound, Tone[]> = {
  pick: [{ frequency: 620, duration: 0.055, type: 'triangle', gain: 0.055 }],
  startCooking: [
    { frequency: 150, duration: 0.045, type: 'sawtooth', gain: 0.04 },
    { frequency: 260, duration: 0.08, type: 'square', gain: 0.035, delay: 0.045 },
  ],
  ready: [
    { frequency: 520, duration: 0.07, type: 'triangle', gain: 0.055 },
    { frequency: 820, duration: 0.08, type: 'triangle', gain: 0.05, delay: 0.065 },
  ],
  serve: [
    { frequency: 420, duration: 0.06, type: 'sine', gain: 0.05 },
    { frequency: 640, duration: 0.09, type: 'sine', gain: 0.045, delay: 0.055 },
  ],
  error: [
    { frequency: 170, duration: 0.11, type: 'sawtooth', gain: 0.055 },
    { frequency: 120, duration: 0.13, type: 'sawtooth', gain: 0.04, delay: 0.08 },
  ],
  warning: [
    { frequency: 240, duration: 0.08, type: 'square', gain: 0.04 },
    { frequency: 240, duration: 0.08, type: 'square', gain: 0.04, delay: 0.12 },
  ],
};

let audioContext: AudioContext | null = null;
let unlockInstalled = false;

function readStoredAudioEnabled() {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(STORAGE_KEY) !== 'false';
}

function getContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioCtor) return null;
  audioContext ??= new AudioCtor();
  return audioContext;
}

function unlockAudio() {
  const context = getContext();
  if (!context || context.state === 'running') return;
  void context.resume().catch(() => undefined);
}

export function installAudioUnlock() {
  if (typeof window === 'undefined' || unlockInstalled) return;
  unlockInstalled = true;
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio);
}

export function getAudioEnabled() {
  return readStoredAudioEnabled();
}

export function setAudioEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  if (enabled) unlockAudio();
}

export function playGameSound(sound: GameSound) {
  if (!readStoredAudioEnabled()) return;

  const context = getContext();
  if (!context) return;
  if (context.state !== 'running') {
    void context.resume().catch(() => undefined);
    return;
  }

  const now = context.currentTime;
  for (const tone of tones[sound]) {
    const start = now + (tone.delay ?? 0);
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = tone.type ?? 'sine';
    oscillator.frequency.setValueAtTime(tone.frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(tone.gain ?? 0.045, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + tone.duration + 0.02);
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
