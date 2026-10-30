"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Send,
  Keyboard,
  Sparkles,
  X,
  Volume2,
} from "lucide-react";
import { speakText, stopSpeaking, unlockAudio } from "@/utils/speech";

interface AudioInputBarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  suggestedHints: string[];
  isAiSpeaking?: boolean;
  onStopAudio?: () => void;
  onListeningChange?: (isListening: boolean) => void;
  isInline?: boolean;
}

export const AudioInputBar: React.FC<AudioInputBarProps> = ({
  onSendMessage,
  disabled = false,
  suggestedHints,
  isAiSpeaking = false,
  onStopAudio,
  onListeningChange,
  isInline = false,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [playingHintIndex, setPlayingHintIndex] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Notify parent of listening state changes
  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  // Check speech recognition support once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  // Clean stop for recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Fresh start recognition instance for each turn
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    stopSpeaking();
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    if (typeof navigator !== "undefined" && (navigator as any).audioSession) {
      try {
        (navigator as any).audioSession.type = "play-and-record";
      } catch (e) {}
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. You can use keyboard typing or dictation!"
      );
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setIsListening(false);
        recognitionRef.current = null;
        alert(
          "Microphone permission was denied. Please allow microphone access in your browser settings to practice speaking."
        );
      } else if (event.error === "audio-capture" || event.error === "network") {
        setIsListening(false);
        recognitionRef.current = null;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.warn("Could not start recognition:", e);
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, []);

  // Stop mic immediately if AI starts speaking
  useEffect(() => {
    if (isAiSpeaking && isListening) {
      stopListening();
    }
  }, [isAiSpeaking, isListening, stopListening]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const toggleListening = () => {
    unlockAudio();
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      onStopAudio?.();
      startListening();
    }
  };

  const handleSend = () => {
    unlockAudio();
    if (!inputText.trim() || disabled) return;
    stopListening();
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectHint = (hint: string) => {
    unlockAudio();
    setInputText(hint);
  };

  // Play audio pronunciation of a suggested hint
  const handlePlayHintAudio = (hint: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    unlockAudio();
    stopSpeaking();
    setPlayingHintIndex(idx);
    speakText(hint, 0.9, () => {
      setPlayingHintIndex(null);
    });
  };

  return (
    <div
      className={
        isInline
          ? "relative w-full z-10 pt-2"
          : "fixed bottom-0 inset-x-0 z-30 w-full px-4 sm:px-6 pb-4 sm:pb-6 pt-2 safe-bottom-padding pointer-events-none"
      }
    >
      <div className={isInline ? "w-full space-y-2.5" : "max-w-xl mx-auto pointer-events-auto space-y-2.5"}>
        {/* Suggestion Chips with Audio Listen Button */}
        {suggestedHints.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/[0.1] px-3 py-1.5 rounded-full border border-emerald-500/20 whitespace-nowrap flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggested:</span>
            </div>
            {suggestedHints.map((hint, idx) => {
              const isPlayingThis = playingHintIndex === idx;

              return (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap flex-shrink-0 cursor-pointer press-tactile ${
                    inputText === hint
                      ? "bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs"
                      : "bg-[var(--color-bg-surface)]/95 backdrop-blur-md hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border-[var(--color-border)] shadow-xs"
                  }`}
                  onClick={() => handleSelectHint(hint)}
                >
                  <span>"{hint}"</span>
                  <button
                    type="button"
                    onClick={(e) => handlePlayHintAudio(hint, idx, e)}
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      inputText === hint
                        ? "text-white/80 hover:text-white"
                        : "text-[var(--color-text-muted)] hover:text-amber-700 dark:hover:text-amber-400"
                    }`}
                    title="Listen to phrase"
                    aria-label={`Listen to: ${hint}`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingThis ? "animate-pulse text-amber-400" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Speech / Transcription Preview */}
        {inputText.trim() && (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[var(--color-bg-surface)]/95 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-sm animate-in fade-in duration-150">
            <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)] truncate flex-1">
              "{inputText}"
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setInputText("")}
                className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-full transition-colors cursor-pointer press-tactile"
                title="Clear input"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Acoustic Hardware Dock */}
        <div className="rounded-full bg-[var(--color-bg-surface)]/95 backdrop-blur-2xl border border-[var(--color-border)] shadow-xl p-2 sm:p-2.5">
          {!isKeyboardMode ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-between w-full max-w-xs px-2">
                {/* Keyboard Mode Switch */}
                <button
                  type="button"
                  onClick={() => setIsKeyboardMode(true)}
                  className="w-10 h-10 rounded-full bg-[var(--color-bg-subtle)] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-center transition-all cursor-pointer press-tactile"
                  title="Switch to typing"
                  aria-label="Switch to typing"
                >
                  <Keyboard className="w-4 h-4" strokeWidth={1.75} />
                </button>

                {/* Central Acoustic Mic Button with Fluid Rings */}
                <div className="relative flex items-center justify-center">
                  {isListening && (
                    <span className="absolute -inset-2.5 rounded-full bg-rose-500/20 animate-mic-pulse-ring pointer-events-none" />
                  )}
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={disabled}
                    className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 cursor-pointer press-tactile ${
                      isListening
                        ? "bg-rose-600 text-white ring-4 ring-rose-500/30 shadow-lg shadow-rose-600/30"
                        : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={isListening ? "Recording (Tap to send)" : "Tap mic to speak"}
                    aria-label={isListening ? "Stop recording and send" : "Start speaking"}
                  >
                    {isListening ? (
                      <MicOff className="w-6 h-6 text-white" strokeWidth={2} />
                    ) : (
                      <Mic className="w-6 h-6 text-white" strokeWidth={2} />
                    )}
                  </button>
                </div>

                {/* Send or Balanced Action Spacer */}
                {inputText.trim() ? (
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={disabled}
                    className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-all cursor-pointer press-tactile shadow-xs"
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-10 h-10" />
                )}
              </div>

              {/* Status Feedback Line */}
              <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1.5 text-center">
                {isListening ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block" />
                    Listening... Tap mic when finished
                  </span>
                ) : isAiSpeaking ? (
                  <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center justify-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    Partner speaking...
                  </span>
                ) : (
                  <span>Tap microphone to respond in English</span>
                )}
              </p>
            </div>
          ) : (
            /* Keyboard Input Mode */
            <div className="flex items-center gap-2 max-w-lg mx-auto w-full px-2">
              <button
                type="button"
                onClick={() => setIsKeyboardMode(false)}
                className="p-2.5 rounded-full bg-[var(--color-bg-subtle)] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer flex-shrink-0 press-tactile"
                title="Switch back to Mic"
                aria-label="Switch back to Mic"
              >
                <Mic className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={disabled}
                  placeholder="Type your response in English..."
                  className="w-full text-xs sm:text-sm px-4 py-2 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-full focus:outline-hidden focus:border-amber-600 text-[var(--color-text-primary)] transition-colors"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim() || disabled}
                className="w-9 h-9 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0 press-tactile shadow-xs"
                title="Send reply"
                aria-label="Send reply"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
