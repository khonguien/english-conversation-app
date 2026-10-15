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
import { stopSpeaking, unlockAudio } from "@/utils/speech";

interface AudioInputBarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  suggestedHints: string[];
  isAiSpeaking?: boolean;
  onStopAudio?: () => void;
  onListeningChange?: (isListening: boolean) => void;
}

export const AudioInputBar: React.FC<AudioInputBarProps> = ({
  onSendMessage,
  disabled = false,
  suggestedHints,
  isAiSpeaking = false,
  onStopAudio,
  onListeningChange,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
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

    // Ensure TTS speech is stopped so microphone is not blocked
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
        "Trình duyệt này chưa hỗ trợ nhận diện giọng nói trực tiếp. Bạn có thể dùng tính năng đọc chính tả trên bàn phím hoặc gõ câu trả lời!"
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
          "Trình duyệt chưa được cấp quyền Micro!\n\nVui lòng cấp quyền Micro trong Cài đặt trình duyệt để tiếp tục luyện nói nhé!"
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

  return (
    <div className="sticky bottom-0 z-30 w-full px-3 sm:px-6 pb-3 sm:pb-5 pt-1 safe-bottom-padding pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto p-3 sm:p-4 bg-white/95 dark:bg-[#111520]/95 backdrop-blur-md rounded-2xl border border-stone-200/90 dark:border-white/10 shadow-lg space-y-3">
        {/* Suggestion Chips */}
        {suggestedHints.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-0.5 scrollbar-none">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60 whitespace-nowrap flex-shrink-0">
              <Sparkles className="w-3 h-3" />
              <span>Gợi ý đáp:</span>
            </div>
            {suggestedHints.map((hint, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectHint(hint)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 border active:scale-95 ${
                  inputText === hint
                    ? "bg-emerald-700 text-white border-emerald-700 font-semibold"
                    : "bg-stone-50 dark:bg-white/5 hover:bg-stone-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border-stone-200/80 dark:border-white/10"
                }`}
              >
                "{hint}"
              </button>
            ))}
          </div>
        )}

        {/* Live Speech / Transcription Preview */}
        {inputText.trim() && (
          <div className="flex items-center justify-between gap-2.5 px-3.5 py-2 bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 rounded-xl animate-in fade-in duration-150">
            <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white truncate flex-1">
              "{inputText}"
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setInputText("")}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Xóa câu này"
                aria-label="Xóa câu này"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors active:scale-95"
                aria-label="Gửi câu nói"
              >
                <span>Gửi</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Tactical Voice Controls */}
        {!isKeyboardMode ? (
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="flex items-center justify-center gap-6 w-full max-w-xs">
              {/* Keyboard Mode Switch */}
              <button
                type="button"
                onClick={() => setIsKeyboardMode(true)}
                className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 border border-stone-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                title="Gõ câu bằng bàn phím"
                aria-label="Chuyển sang bàn phím"
              >
                <Keyboard className="w-5 h-5" />
              </button>

              {/* Central Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer ${
                  isListening
                    ? "bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse"
                    : "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? "Đang thu âm (Bấm để gửi)" : "Bấm Micro để nói tiếng Anh"}
                aria-label={isListening ? "Dừng thu âm và gửi" : "Bắt đầu thu âm"}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7" />
                ) : (
                  <Mic className="w-7 h-7" />
                )}
              </button>

              {/* Send or Balanced Spacer */}
              {inputText.trim() ? (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={disabled}
                  className="w-11 h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs"
                  title="Gửi câu nói"
                  aria-label="Gửi câu nói"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-11 h-11" />
              )}
            </div>

            {/* Status Feedback */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              {isListening ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  Đang thu âm... Chạm micro khi nói xong
                </span>
              ) : isAiSpeaking ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  AI đang phát âm... Chạm mic để đối đáp
                </span>
              ) : (
                <span>Chạm Micro để luyện nói tiếng Anh</span>
              )}
            </p>
          </div>
        ) : (
          /* Keyboard Input Mode */
          <div className="flex items-center gap-2 max-w-lg mx-auto w-full bg-stone-50 dark:bg-white/5 p-1.5 rounded-xl border border-stone-200/90 dark:border-white/10 animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => setIsKeyboardMode(false)}
              className="p-2 rounded-lg bg-white dark:bg-white/10 hover:bg-stone-100 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex-shrink-0"
              title="Quay lại chế độ Mic"
              aria-label="Quay lại chế độ Mic"
            >
              <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder="Gõ câu trả lời bằng tiếng Anh..."
                className="w-full text-xs sm:text-sm px-3 py-1.5 bg-white dark:bg-[#131722] border border-stone-200 dark:border-white/10 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 dark:text-white"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() || disabled}
              className="w-9 h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              title="Gửi tin nhắn"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
