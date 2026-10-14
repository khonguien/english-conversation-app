"use client";

// Shared HTML5 Audio Element for iOS Safari & modern browsers
// Uses Playback category (audible even when hardware Silent Switch is ON on iPhone/iPad)
let sharedAudioEl: HTMLAudioElement | null = null;
let isAudioUnlocked = false;

// 1ms silent WAV base64 string to bless/unlock audio playback within user gesture
const SILENT_AUDIO_BASE64 =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

function getSharedAudioElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioEl) {
    sharedAudioEl = new Audio();
    sharedAudioEl.setAttribute("playsinline", "true");
    sharedAudioEl.setAttribute("webkit-playsinline", "true");
    sharedAudioEl.preload = "auto";
  }
  return sharedAudioEl;
}

// Persistent Web Audio API Context fallback
let sharedAudioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;

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

// Helper to fallback to browser native Web Speech API if offline or network fails
let activeUtterance: SpeechSynthesisUtterance | null = null;

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
        (v.name.includes("Ava") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
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

/**
 * Main Text-to-Speech function:
 * Plays smooth Microsoft Edge Neural TTS voice (en-US-AvaNeural) via Blessed Audio Engine.
 * Fully compatible with Mobile Safari on iOS/iPadOS, bypassing hardware mute and autoplay blocks.
 */
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

  // Stop any currently playing audio and release audio session
  stopSpeaking();

  const audioUrl = `/api/tts?text=${encodeURIComponent(text.trim())}&rate=${rate}&voice=${encodeURIComponent(voice)}`;
  const audio = getSharedAudioElement();

  let isCancelled = false;

  if (audio) {
    audio.src = audioUrl;
    audio.playbackRate = rate;

    const handleEnded = () => {
      cleanup();
      // Drop src to completely free iOS audio session for microphone input
      try {
        audio.removeAttribute("src");
        audio.load();
      } catch (e) {}
      if (!isCancelled) {
        onEnd?.();
      }
    };

    const handleError = (e: any) => {
      cleanup();
      if (!isCancelled) {
        console.warn("Audio playback failed, falling back to Web Speech:", e);
        speakWebSpeech(text, rate, onEnd, onError);
      }
    };

    const cleanup = () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };

    audio.addEventListener("ended", handleEnded, { once: true });
    audio.addEventListener("error", handleError, { once: true });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (!isCancelled) {
          console.warn("audio.play() error:", err);
          handleError(err);
        }
      });
    }

    return () => {
      isCancelled = true;
      cleanup();
      stopSpeaking();
    };
  }

  // Fallback to Web Speech if HTMLAudioElement is not available
  return speakWebSpeech(text, rate, onEnd, onError);
}

/**
 * Stop any ongoing audio playback and immediately release iOS audio session
 * to prevent deadlocking speech recognition microphone.
 */
export function stopSpeaking() {
  if (sharedAudioEl) {
    try {
      sharedAudioEl.pause();
      sharedAudioEl.currentTime = 0;
      sharedAudioEl.removeAttribute("src");
      sharedAudioEl.load(); // Vital: drops playback lock so Web Speech API microphone can start cleanly
    } catch (e) {}
  }

  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
      currentSourceNode.disconnect();
    } catch (e) {}
    currentSourceNode = null;
  }

  activeUtterance = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

/**
 * Check if audio is currently playing
 */
export function isSpeaking(): boolean {
  if (sharedAudioEl && !sharedAudioEl.paused && !sharedAudioEl.ended && sharedAudioEl.currentTime > 0) {
    return true;
  }
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

/**
 * User-gesture blessing to permanently unlock audio playback on iOS/iPadOS Safari.
 * Call this on any user touch/click (starting scenario, tapping mic, sending message).
 */
export function unlockAudio() {
  if (typeof window === "undefined") return;

  // 1. Bless HTML5 Audio Element for iOS Safari Playback
  const audio = getSharedAudioElement();
  if (audio && !isAudioUnlocked) {
    audio.src = SILENT_AUDIO_BASE64;
    audio
      .play()
      .then(() => {
        audio.pause();
        isAudioUnlocked = true;
      })
      .catch(() => {});
  }

  // 2. Unlock Web Audio Context if present
  const ctx = getSharedAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  // 3. Preload native voices
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.getVoices();
    } catch (e) {}
  }
}
