"use client";

// Helper for Text-to-Speech using Web Speech API
export function speakText(
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

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate; // 0.8 (slow), 1.0 (normal), 1.2 (fast)
  utterance.pitch = 1.0;

  // Pick a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
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

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    // If interrupted because user clicked stop or next, don't trigger error
    if (e.error !== "canceled" && e.error !== "interrupted") {
      console.warn("Speech synthesis error:", e);
      onError?.(e);
    }
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  // Return cancel function
  return () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// iOS Safari audio unlock
export function unlockAudio() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance("");
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }
}
