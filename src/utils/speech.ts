"use client";

// Persistent shared HTML5 Audio instance pre-blessed by user interaction to bypass Safari/Chrome autoplay lock
let sharedAudio: HTMLAudioElement | null = null;
let isAudioUnlocked = false;

function getSharedAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.setAttribute("playsinline", "true");
    sharedAudio.preload = "auto";
  }
  return sharedAudio;
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

// Main Text-to-Speech function: Prioritizes Microsoft Edge Neural TTS (Natural human voice)
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

  const audio = getSharedAudio();
  if (!audio) {
    return speakWebSpeech(text, rate, onEnd, onError);
  }

  try {
    const audioUrl = `/api/tts?text=${encodeURIComponent(text.trim())}&rate=${rate}&voice=${encodeURIComponent(voice)}`;

    let hasEnded = false;

    const handleEnded = () => {
      cleanup();
      try {
        audio.pause();
      } catch (e) {}
      if (!hasEnded) {
        hasEnded = true;
        onEnd?.();
      }
    };

    const handleError = (e: any) => {
      cleanup();
      console.warn("Edge TTS stream failed, falling back to Web Speech API:", e);
      speakWebSpeech(text, rate, onEnd, onError);
    };

    const cleanup = () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    audio.src = audioUrl;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        cleanup();
        console.warn("Audio play prevented/blocked:", err);

        // If Safari/Chrome blocked autoplay (e.g. on initial page load without touch)
        if (err.name === "NotAllowedError" || err.name === "AbortError") {
          console.log("Autoplay was blocked by browser. Clearing active audio state.");
          if (!hasEnded) {
            hasEnded = true;
            onEnd?.(); // Clears activeAudioId in parent so mic is NOT blocked!
          }
          return;
        }

        speakWebSpeech(text, rate, onEnd, onError);
      });
    }

    return () => {
      cleanup();
      audio.pause();
      audio.currentTime = 0;
    };
  } catch (err) {
    console.warn("Could not play neural audio, falling back to Web Speech:", err);
    return speakWebSpeech(text, rate, onEnd, onError);
  }
}

export function stopSpeaking() {
  if (sharedAudio) {
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
  }
  activeUtterance = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  if (sharedAudio && !sharedAudio.paused && !sharedAudio.ended) {
    return true;
  }
  if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.speaking) {
    return true;
  }
  return false;
}

// iOS Safari & Chrome audio unlock: pre-blesses the sharedAudio element so async play() succeeds
export function unlockAudio() {
  if (typeof window === "undefined") return;

  const audio = getSharedAudio();
  if (audio && !isAudioUnlocked) {
    // Play a tiny 1-byte silent WAV to unlock audio playback for the session
    audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    audio
      .play()
      .then(() => {
        audio.pause();
        isAudioUnlocked = true;
      })
      .catch(() => {});
  }

  // Backup: unlock Web Speech synthesis
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance("");
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }
}
