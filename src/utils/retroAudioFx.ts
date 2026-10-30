// Hyper-Realistic Mechanical Acoustic Sound Engine
// Uses in-memory base64 AudioBuffers with multi-stage modal physical modeling fallback.
// 0ms latency, zero external network dependencies, 100% offline, zero fetch calls.

import { SOUND_DATA_BASE64 } from "./soundData";

let audioCtx: AudioContext | null = null;
let isMutedState = false;
const muteListeners: Set<(muted: boolean) => void> = new Set();
const bufferCache = new Map<string, AudioBuffer>();
let isPreloading = false;

export function isRetroAudioMuted(): boolean {
  return isMutedState;
}

export function toggleRetroAudioMute(): boolean {
  isMutedState = !isMutedState;
  muteListeners.forEach((listener) => listener(isMutedState));
  return isMutedState;
}

export function subscribeAudioMute(listener: (muted: boolean) => void): () => void {
  muteListeners.add(listener);
  return () => muteListeners.delete(listener);
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  if (audioCtx && !isPreloading) {
    preloadSounds(audioCtx);
  }
  return audioCtx;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  if (typeof window === "undefined") return new ArrayBuffer(0);
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Preload in-memory static assets into RAM AudioBuffers for 0ms latency playback
// No network fetch calls = 100% immune to IDM and browser download intercepts
async function preloadSounds(ctx: AudioContext) {
  if (isPreloading) return;
  isPreloading = true;

  const soundEntries = [
    { key: "tapeEject", base64: SOUND_DATA_BASE64.tapeEject },
    { key: "tapeInsert", base64: SOUND_DATA_BASE64.tapeInsert },
    { key: "buttonPlay", base64: SOUND_DATA_BASE64.radioButton },
    { key: "buttonStop", base64: SOUND_DATA_BASE64.radioButton },
    { key: "buttonTactile", base64: SOUND_DATA_BASE64.radioButton },
    { key: "tapePull", base64: SOUND_DATA_BASE64.tapePull },
    { key: "tapeSlideIn", base64: SOUND_DATA_BASE64.tapeSlideIn },
  ];

  for (const { key, base64 } of soundEntries) {
    if (bufferCache.has(key)) continue;
    try {
      const arrayBuf = base64ToArrayBuffer(base64);
      const decoded = await ctx.decodeAudioData(arrayBuf);
      bufferCache.set(key, decoded);
    } catch (e) {
      // Procedural fallback will handle if decode fails
    }
  }
}

// Play cached buffer or return false to indicate fallback needed
function playCachedBuffer(key: string, volume = 1.0, playbackRate = 1.0): boolean {
  if (isMutedState) return true;
  const ctx = getAudioContext();
  if (!ctx) return true;

  const buf = bufferCache.get(key);
  if (!buf) return false;

  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.playbackRate.value = playbackRate;

  const gain = ctx.createGain();
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(ctx.destination);

  source.start(0);
  return true;
}

// Helper: Generate a short buffer of white noise
function createNoiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// =========================================================================
// 1. TAPE PULL FROM RACK (Dry friction breakaway + shell ribs on wood + cavity thock)
// =========================================================================
export function playTapePullSound(): void {
  if (isMutedState) return;
  if (playCachedBuffer("tapePull", 0.9)) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Layer 1: Breakaway scrape (3.8kHz)
  const noise1 = ctx.createBufferSource();
  noise1.buffer = createNoiseBuffer(ctx, 0.045);
  const f1 = ctx.createBiquadFilter();
  f1.type = "bandpass";
  f1.frequency.setValueAtTime(3800, now);
  f1.Q.setValueAtTime(3.5, now);
  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0.35, now);
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
  noise1.connect(f1);
  f1.connect(g1);
  g1.connect(ctx.destination);
  noise1.start(now);

  // Layer 2: Polycarbonate shell sliding against wood (1.1kHz)
  const noise2 = ctx.createBufferSource();
  noise2.buffer = createNoiseBuffer(ctx, 0.16);
  const f2 = ctx.createBiquadFilter();
  f2.type = "bandpass";
  f2.frequency.setValueAtTime(1100, now + 0.02);
  f2.Q.setValueAtTime(2.8, now + 0.02);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.01, now + 0.02);
  g2.gain.linearRampToValueAtTime(0.28, now + 0.08);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  noise2.connect(f2);
  f2.connect(g2);
  g2.connect(ctx.destination);
  noise2.start(now + 0.02);

  // Layer 3: Exit hollow box resonance at 165ms (460Hz & 920Hz)
  [460, 920].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + 0.165);
    g.gain.setValueAtTime(idx === 0 ? 0.22 : 0.12, now + 0.165);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.21);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + 0.165);
    osc.stop(now + 0.21);
  });
}

// =========================================================================
// 2. TAPE SLIDE IN / RETURN TO RACK (Reverse friction slide + wood thud)
// =========================================================================
export function playTapeSlideInSound(): void {
  if (isMutedState) return;
  if (playCachedBuffer("tapeSlideIn", 0.85)) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.13);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(1200, now);
  f.Q.setValueAtTime(2.5, now);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.2, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
  noise.connect(f);
  f.connect(g);
  g.connect(ctx.destination);
  noise.start(now);

  // Seating wood thud at 120ms
  const osc = ctx.createOscillator();
  const gThud = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(130, now + 0.12);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
  gThud.gain.setValueAtTime(0.35, now + 0.12);
  gThud.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc.connect(gThud);
  gThud.connect(ctx.destination);
  osc.start(now + 0.12);
  osc.stop(now + 0.18);
}

// =========================================================================
// 3. TAPE INSERT INTO RADIO BAY (Guide slide + dual spindle tooth clicks + latch snap)
// =========================================================================
export function playTapeInsertSound(): void {
  if (isMutedState) return;
  if (playCachedBuffer("tapeInsert", 0.95)) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Stage 1: Door guide slide (0-60ms)
  const nSlide = ctx.createBufferSource();
  nSlide.buffer = createNoiseBuffer(ctx, 0.06);
  const fSlide = ctx.createBiquadFilter();
  fSlide.type = "bandpass";
  fSlide.frequency.setValueAtTime(1500, now);
  fSlide.Q.setValueAtTime(2.5, now);
  const gSlide = ctx.createGain();
  gSlide.gain.setValueAtTime(0.2, now);
  gSlide.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  nSlide.connect(fSlide);
  fSlide.connect(gSlide);
  gSlide.connect(ctx.destination);
  nSlide.start(now);

  // Stage 2: Dual spindle tooth clicks (65ms and 95ms)
  [0.065, 0.095].forEach((offset, idx) => {
    const n = ctx.createBufferSource();
    n.buffer = createNoiseBuffer(ctx, 0.015);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(1600 + idx * 500, now + offset);
    f.Q.setValueAtTime(8.0, now + offset);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.45, now + offset);
    g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.015);
    n.connect(f);
    f.connect(g);
    g.connect(ctx.destination);
    n.start(now + offset);
  });

  // Stage 3: Base seating hollow thud (125ms)
  const oscThud = ctx.createOscillator();
  const gThud = ctx.createGain();
  oscThud.type = "sine";
  oscThud.frequency.setValueAtTime(240, now + 0.125);
  oscThud.frequency.exponentialRampToValueAtTime(65, now + 0.175);
  gThud.gain.setValueAtTime(0.35, now + 0.125);
  gThud.gain.exponentialRampToValueAtTime(0.001, now + 0.175);
  oscThud.connect(gThud);
  gThud.connect(ctx.destination);
  oscThud.start(now + 0.125);
  oscThud.stop(now + 0.175);

  // Stage 4: Spring latch snap (210ms)
  const nLatch = ctx.createBufferSource();
  nLatch.buffer = createNoiseBuffer(ctx, 0.06);
  const fLatch = ctx.createBiquadFilter();
  fLatch.type = "bandpass";
  fLatch.frequency.setValueAtTime(2800, now + 0.21);
  fLatch.Q.setValueAtTime(6.0, now + 0.21);
  const gLatch = ctx.createGain();
  gLatch.gain.setValueAtTime(0.55, now + 0.21);
  gLatch.gain.exponentialRampToValueAtTime(0.001, now + 0.27);
  nLatch.connect(fLatch);
  fLatch.connect(gLatch);
  gLatch.connect(ctx.destination);
  nLatch.start(now + 0.21);
}

// =========================================================================
// 4. RADIO EJECT: THE HEAVY MECHANICAL "KA-CHUNK" (~320ms)
// =========================================================================
export function playRadioEjectSound(): void {
  if (isMutedState) return;
  if (playCachedBuffer("tapeEject", 1.0)) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Part 1: Metal lever slide friction (0-25ms)
  const nLever = ctx.createBufferSource();
  nLever.buffer = createNoiseBuffer(ctx, 0.025);
  const fLever = ctx.createBiquadFilter();
  fLever.type = "bandpass";
  fLever.frequency.setValueAtTime(2600, now);
  fLever.Q.setValueAtTime(3.0, now);
  const gLever = ctx.createGain();
  gLever.gain.setValueAtTime(0.3, now);
  gLever.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  nLever.connect(fLever);
  fLever.connect(gLever);
  gLever.connect(ctx.destination);
  nLever.start(now);

  // Part 2: Head-bridge mechanical solenoid release THUNK (25ms - 90ms)
  const oscThunk = ctx.createOscillator();
  const gThunk = ctx.createGain();
  oscThunk.type = "sine";
  oscThunk.frequency.setValueAtTime(85, now + 0.025);
  oscThunk.frequency.exponentialRampToValueAtTime(30, now + 0.09);
  gThunk.gain.setValueAtTime(0.65, now + 0.025);
  gThunk.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  oscThunk.connect(gThunk);
  gThunk.connect(ctx.destination);
  oscThunk.start(now + 0.025);
  oscThunk.stop(now + 0.09);

  // Part 3: Spring catch snap ("KA" at 60ms)
  const nSnap = ctx.createBufferSource();
  nSnap.buffer = createNoiseBuffer(ctx, 0.035);
  const fSnap = ctx.createBiquadFilter();
  fSnap.type = "bandpass";
  fSnap.frequency.setValueAtTime(2400, now + 0.06);
  fSnap.Q.setValueAtTime(5.5, now + 0.06);
  const gSnap = ctx.createGain();
  gSnap.gain.setValueAtTime(0.75, now + 0.06);
  gSnap.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
  nSnap.connect(fSnap);
  fSnap.connect(gSnap);
  gSnap.connect(ctx.destination);
  nSnap.start(now + 0.06);

  // Part 4: Door travel stop bumper impact ("CHUNK" at 140ms and 175ms)
  [0.14, 0.175].forEach((offset, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(idx === 0 ? 320 : 180, now + offset);
    osc.frequency.exponentialRampToValueAtTime(idx === 0 ? 120 : 70, now + offset + 0.045);
    g.gain.setValueAtTime(idx === 0 ? 0.5 : 0.35, now + offset);
    g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.045);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.045);
  });
}

// =========================================================================
// 5. RADIO PLAY BUTTON: Heavy mechanical latching piano-key throw (~120ms)
// =========================================================================
export function playRadioPlayButtonSound(): void {
  if (isMutedState) return;
  if (playCachedBuffer("buttonPlay", 1.0, 0.92)) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Travel friction
  const n = ctx.createBufferSource();
  n.buffer = createNoiseBuffer(ctx, 0.02);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(1800, now);
  f.Q.setValueAtTime(2.5, now);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.2, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  n.connect(f);
  f.connect(g);
  g.connect(ctx.destination);
  n.start(now);

  // Heavy mechanical lock CLONK at 22ms
  const osc = ctx.createOscillator();
  const gLock = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(115, now + 0.022);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
  gLock.gain.setValueAtTime(0.6, now + 0.022);
  gLock.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(gLock);
  gLock.connect(ctx.destination);
  osc.start(now + 0.022);
  osc.stop(now + 0.1);
}

// =========================================================================
// 6. RADIO STOP BUTTON: Spring tension release snap (~90ms)
// =========================================================================
export function playRadioStopButtonSound(): void {
  if (isMutedState) return;
  if (playCachedBuffer("buttonStop", 0.95)) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const n = ctx.createBufferSource();
  n.buffer = createNoiseBuffer(ctx, 0.035);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(2300, now);
  f.Q.setValueAtTime(6.0, now);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.7, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
  n.connect(f);
  f.connect(g);
  g.connect(ctx.destination);
  n.start(now);

  // Chassis rebound
  const osc = ctx.createOscillator();
  const gRebound = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(135, now + 0.012);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.07);
  gRebound.gain.setValueAtTime(0.45, now + 0.012);
  gRebound.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc.connect(gRebound);
  gRebound.connect(ctx.destination);
  osc.start(now + 0.012);
  osc.stop(now + 0.07);
}

// =========================================================================
// 7. TACTILE HARDWARE BUTTON (CC, Speed +/-): Crisp Alps microswitch snap (~35ms)
// =========================================================================
export function playRadioTactileButtonSound(): void {
  if (isMutedState) return;
  if (playCachedBuffer("buttonTactile", 0.85, 1.15)) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const n = ctx.createBufferSource();
  n.buffer = createNoiseBuffer(ctx, 0.015);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(2200, now);
  f.Q.setValueAtTime(5.0, now);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.5, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
  n.connect(f);
  f.connect(g);
  g.connect(ctx.destination);
  n.start(now);

  // Plastic bottoming thud
  const osc = ctx.createOscillator();
  const gThud = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(580, now + 0.006);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.028);
  gThud.gain.setValueAtTime(0.35, now + 0.006);
  gThud.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
  osc.connect(gThud);
  gThud.connect(ctx.destination);
  osc.start(now + 0.006);
  osc.stop(now + 0.028);
}

// Alias for generic click
export function playRadioClickSound(): void {
  playRadioTactileButtonSound();
}

// =========================================================================
// 8. TELEPRINTER PTT TOGGLE SWITCH
// =========================================================================
export function playToggleSwitchSound(isUp: boolean): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const baseFreq = isUp ? 1200 : 900;

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.25, now + 0.04);
  g.gain.setValueAtTime(0.22, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);

  const steel = ctx.createOscillator();
  const steelGain = ctx.createGain();
  steel.type = "sine";
  steel.frequency.setValueAtTime(260, now + 0.01);
  steel.frequency.exponentialRampToValueAtTime(70, now + 0.07);
  steelGain.gain.setValueAtTime(0.12, now + 0.01);
  steelGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  steel.connect(steelGain);
  steelGain.connect(ctx.destination);
  steel.start(now + 0.01);
  steel.stop(now + 0.07);
}

// =========================================================================
// 9. TELEPRINTER DOT-MATRIX PRINTHEAD CHIRP (Character typing "rẹt rẹt")
// =========================================================================
export function playDotMatrixPrintSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freq = 2600 + Math.random() * 800;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.012);
  gain.gain.setValueAtTime(0.035, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.012);

  const stepNoise = ctx.createBufferSource();
  stepNoise.buffer = createNoiseBuffer(ctx, 0.01);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(3200, now);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.02, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
  stepNoise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  stepNoise.start(now);
}

// =========================================================================
// 10. IBM PUNCH CARD FEED
// =========================================================================
export function playPunchCardFeedSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.12);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + 0.1);
  filter.Q.setValueAtTime(2.0, now);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);

  const tick = ctx.createOscillator();
  const tickGain = ctx.createGain();
  tick.type = "triangle";
  tick.frequency.setValueAtTime(900, now + 0.08);
  tick.frequency.exponentialRampToValueAtTime(180, now + 0.12);
  tickGain.gain.setValueAtTime(0.12, now + 0.08);
  tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  tick.connect(tickGain);
  tickGain.connect(ctx.destination);
  tick.start(now + 0.08);
  tick.stop(now + 0.12);
}
