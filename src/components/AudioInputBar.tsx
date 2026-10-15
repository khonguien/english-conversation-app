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

  // Notify parent of listening state changes for the soundwave visualizer
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

  // Fresh start recognition instance for EVERY turn (crucial for iOS Safari & WebKit reuse)
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    // Ensure TTS speech is stopped and synthesis queue is cancelled so microphone is not blocked
    stopSpeaking();
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    // Force iOS Safari audio session to play-and-record mode
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
        "Trình duyệt này chưa hỗ trợ nhận diện giọng nói trực tiếp. Bạn có thể dùng tính năng đọc chính tả (biểu tượng Micro trên bàn phím điện thoại) hoặc gõ văn bản!"
      );
      return;
    }

    // Stop and discard any previous instance if lingering
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
      stopSpeaking(); // stop AI speech if playing and release audio session
      onStopAudio?.(); // Clear activeAudioId in page.tsx so isAiSpeaking becomes false immediately!
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
    <div className="sticky bottom-0 z-20 w-full px-3 sm:px-6 pb-3 sm:pb-4 pt-1 safe-bottom-padding pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto space-y-2.5">
        {/* Horizontal Quick Reply Chips Carousel */}
        {suggestedHints.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-[#0b101e]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-2xs whitespace-nowrap flex-shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400 animate-pulse" />
              <span>Gợi ý:</span>
            </div>
            {suggestedHints.map((hint, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectHint(hint)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 backdrop-blur-md shadow-2xs border active:scale-95 ${
                  inputText === hint
                    ? "bg-gradient-to-r from-indigo-600 to-sky-500 text-white border-transparent shadow-sm shadow-indigo-500/25"
                    : "bg-white/95 dark:bg-[#0b101e]/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                "{hint}"
              </button>
            ))}
          </div>
        )}

        {/* Transcription Preview Pill (Shown when text is spoken or selected) */}
        {inputText.trim() && (
          <div className="flex items-center justify-between gap-2.5 px-4 py-2.5 max-w-xl mx-auto bg-white/95 dark:bg-[#0b101e]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-md animate-in fade-in duration-150">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate pl-1 flex-1">
              "{inputText}"
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setInputText("")}
                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-full transition-colors cursor-pointer active:scale-95"
                title="Xóa câu này"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={disabled}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
              >
                <span>Gửi</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Minimal Controls */}
        {!isKeyboardMode ? (
          /* Clean Voice Controls */
          <div className="flex flex-col items-center justify-center pt-1 pb-1">
            <div className="flex items-center justify-center gap-6 w-full max-w-xs">
              {/* Keyboard Mode Switch */}
              <button
                type="button"
                onClick={() => setIsKeyboardMode(true)}
                className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-[#0b101e]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                title="Gõ câu bằng bàn phím"
                aria-label="Chuyển sang bàn phím"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              {/* Central Hero Mic Button with Multi-Ring Radar Ripple */}
              <div className="relative flex items-center justify-center">
                {isListening && (
                  <>
                    <span className="absolute -inset-3 rounded-full bg-rose-500/40 animate-radar-1 pointer-events-none" />
                    <span className="absolute -inset-3 rounded-full bg-rose-500/30 animate-radar-2 pointer-events-none" />
                  </>
                )}
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={disabled}
                  className={`relative z-10 w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full flex items-center justify-center transition-all duration-300 shadow-xl active:scale-95 cursor-pointer ${
                    isListening
                      ? "bg-gradient-to-tr from-rose-600 to-red-500 text-white scale-105 shadow-rose-600/35 ring-4 ring-rose-400/30"
                      : "bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 dark:from-indigo-600 dark:to-sky-500 hover:from-slate-800 dark:hover:from-indigo-500 hover:scale-105 text-white shadow-slate-900/25 dark:shadow-indigo-500/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={
                    isListening
                      ? "Đang thu âm (Bấm để dừng & gửi)"
                      : "Bấm Micro để nói tiếng Anh"
                  }
                  aria-label={isListening ? "Dừng thu âm" : "Nói qua micro"}
                >
                  {isListening ? (
                    <MicOff className="w-7 h-7 animate-pulse" />
                  ) : (
                    <Mic className="w-7 h-7" />
                  )}
                </button>
              </div>

              {/* Send or Balanced Spacer */}
              {inputText.trim() ? (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={disabled}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-indigo-500/25 active:scale-95"
                  title="Gửi câu nói"
                  aria-label="Gửi câu nói"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-11 h-11" />
              )}
            </div>

            {/* Concise Status Label */}
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2.5 text-center">
              {isListening ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  Đang thu âm... Chạm micro để dừng & gửi
                </span>
              ) : isAiSpeaking ? (
                <span className="text-sky-600 dark:text-cyan-400 font-semibold flex items-center justify-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  AI đang phát âm... Chạm mic để nói chen
                </span>
              ) : (
                "Chạm Micro để luyện nói tiếng Anh"
              )}
            </p>
          </div>
        ) : (
          /* Text Keyboard Input Mode - Clean Floating Pill */
          <div className="flex items-center gap-2 max-w-lg mx-auto w-full bg-white/95 dark:bg-[#0b101e]/95 backdrop-blur-xl p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => setIsKeyboardMode(false)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex-shrink-0 active:scale-95"
              title="Quay lại chế độ Mic"
            >
              <Mic className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder="Gõ câu trả lời bằng tiếng Anh..."
                className="w-full text-sm px-3.5 py-2 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() || disabled}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer flex-shrink-0 active:scale-95"
              title="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
