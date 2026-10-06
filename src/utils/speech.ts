"use client";

// Persistent Web Audio API Context (Bypasses HTML5 <audio> OS playback deadlock)
let sharedAudioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let isAudioContextUnlocked = false;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioCtxClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function decodeAudioDataSafe(
  ctx: AudioContext,
  arrayBuffer: ArrayBuffer
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const onResolve = (buffer: AudioBuffer) => {
      if (!settled) {
        settled = true;
        resolve(buffer);
      }
    };
    const onReject = (err: any) => {
      if (!settled) {
        settled = true;
        reject(err);
      }
    };

    try {
      const res = ctx.decodeAudioData(arrayBuffer, onResolve, onReject);
      if (res && typeof (res as any).then === "function") {
        (res as any).then(onResolve).catch(onReject);
      }
    } catch (e) {
      onReject(e);
    }
  });
}

// Keep active Web Speech utterance in module scope as fallback to prevent Chromium GC bug
let activeUtterance: SpeechSynthesisUtterance | null = null;

// Helper to fallback to browser native Web Speech API if Edge TTS is unavailable
function speakWebSpeech(
  text: string,
  rate: number = 1.0,
  onEnd?: () => void,
  onError?: (error: unknown) => void
): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported on this device.");
    onEnd?.();
    return () => {};
  }

  window.speechSynthesis.cancel();
  activeUtterance = null;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const englishVoice =
    voices.find(
      (v) =>
        (v.lang === "en-US" || v.lang === "en-GB") &&
        (v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
          v.name.includes("Karen") ||
          v.name.includes("Google") ||
          v.name.includes("Natural"))
    ) || voices.find((v) => v.lang.startsWith("en"));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  activeUtterance = utterance;

  utterance.onend = () => {
    activeUtterance = null;
    onEnd?.();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    if (e.error === "canceled" || e.error === "interrupted") {
      return;
    }
    console.warn("Web speech synthesis error:", e);
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    activeUtterance = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };
}

// Main Text-to-Speech function: Routes via Web Audio API (AudioContext)
// This strictly avoids HTML5 <audio> elements which lock the OS audio session in Playback mode and deadlock SpeechRecognition!
export function speakText(
  text: string,
  rate: number = 1.0,
  onEnd?: () => void,
  onError?: (error: unknown) => void,
  voice: string = "en-US-AvaNeural"
): () => void {
  if (typeof window === "undefined") {
    onEnd?.();
    return () => {};
  }

  // Stop any currently playing audio
  stopSpeaking();

  const ctx = getSharedAudioContext();
  if (!ctx) {
    return speakWebSpeech(text, rate, onEnd, onError);
  }

  let isCancelled = false;
  let sourceNode: AudioBufferSourceNode | null = null;

  const audioUrl = `/api/tts?text=${encodeURIComponent(text.trim())}&rate=${rate}&voice=${encodeURIComponent(voice)}`;

  fetch(audioUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`TTS HTTP error ${res.status}`);
      return res.arrayBuffer();
    })
    .then((arrayBuffer) => {
      if (isCancelled) return null;
      return decodeAudioDataSafe(ctx, arrayBuffer);
    })
    .then((audioBuffer) => {
      if (isCancelled || !audioBuffer) return;

      const startPlayback = () => {
        if (isCancelled) return;

        sourceNode = ctx.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(ctx.destination);
        currentSourceNode = sourceNode;

        sourceNode.onended = () => {
          if (currentSourceNode === sourceNode) {
            currentSourceNode = null;
          }
          // Suspend AudioContext when audio finishes to release audio session lock for microphone
          if (ctx.state === "running") {
            ctx.suspend().catch(() => {});
          }
          if (!isCancelled) {
            onEnd?.();
          }
        };

        sourceNode.start(0);
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(startPlayback).catch(startPlayback);
      } else {
        startPlayback();
      }
    })
    .catch((err) => {
      if (!isCancelled) {
        console.warn("Web Audio TTS failed, falling back to Web Speech:", err);
        speakWebSpeech(text, rate, onEnd, onError);
      }
    });

  return () => {
    isCancelled = true;
    if (sourceNode) {
      try {
        sourceNode.stop();
        sourceNode.disconnect();
      } catch (e) {}
    }
    if (currentSourceNode === sourceNode) {
      currentSourceNode = null;
    }
    if (ctx && ctx.state === "running") {
      ctx.suspend().catch(() => {});
    }
  };
}

export function stopSpeaking() {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
      currentSourceNode.disconnect();
    } catch (e) {}
    currentSourceNode = null;
  }
  if (sharedAudioCtx && sharedAudioCtx.state === "running") {
    sharedAudioCtx.suspend().catch(() => {});
  }
  activeUtterance = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

export function isSpeaking(): boolean {
  if (currentSourceNode) {
    return true;
  }
  if (
    typeof window !== "undefined" &&
    window.speechSynthesis &&
    window.speechSynthesis.speaking
  ) {
    return true;
  }
  return false;
}

// User-gesture blessing to unlock Web Audio API context for mobile browsers
export function unlockAudio() {
  if (typeof window === "undefined") return;

  const ctx = getSharedAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  if (ctx && !isAudioContextUnlocked) {
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      isAudioContextUnlocked = true;
    } catch (e) {}
  }
}
