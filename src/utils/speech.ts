"use client";

// Active HTML5 Audio instance for Edge Neural TTS
let currentAudio: HTMLAudioElement | null = null;

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

// Main Text-to-Speech function: Prioritizes Microsoft Edge Neural TTS (Natural human voice)
export function speakText(
  text: string,
  rate: number = 1.0,
  onEnd?: () => void,
  onError?: (error: unknown) => void
): () => void {
  if (typeof window === "undefined") {
    onEnd?.();
    return () => {};
  }

  // Stop any currently playing audio
  stopSpeaking();

  try {
    const audioUrl = `/api/tts?text=${encodeURIComponent(text.trim())}&rate=${rate}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    let hasEnded = false;

    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
      if (!hasEnded) {
        hasEnded = true;
        onEnd?.();
      }
    };

    audio.onerror = () => {
      console.warn("Edge TTS stream failed, falling back to Web Speech API.");
      if (currentAudio === audio) {
        currentAudio = null;
      }
      speakWebSpeech(text, rate, onEnd, onError);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // If autoplay policy blocked or stream failed, fallback gracefully
        console.warn("HTML5 audio play blocked/failed, trying Web Speech fallback:", err);
        if (currentAudio === audio) {
          currentAudio = null;
        }
        speakWebSpeech(text, rate, onEnd, onError);
      });
    }

    // Return cancel function
    return () => {
      if (currentAudio === audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        currentAudio = null;
      }
    };
  } catch (err) {
    console.warn("Could not initialize HTML5 audio, falling back to Web Speech:", err);
    return speakWebSpeech(text, rate, onEnd, onError);
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio.src = "";
    currentAudio = null;
  }
  activeUtterance = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  if (currentAudio && !currentAudio.paused && !currentAudio.ended) {
    return true;
  }
  if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.speaking) {
    return true;
  }
  return false;
}

// iOS Safari audio unlock for both Web Speech and HTML5 Audio
export function unlockAudio() {
  if (typeof window !== "undefined") {
    // 1. Unlock Web Speech
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("");
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
    // 2. Unlock HTML5 Audio
    try {
      const silentAudio = new Audio(
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
      );
      silentAudio.play().catch(() => {});
    } catch (e) {}
  }
}
