"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Send,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  Keyboard,
  Sparkles,
  X,
} from "lucide-react";
import { stopSpeaking, isSpeaking } from "@/utils/speech";

interface AudioInputBarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  suggestedHints: string[];
  isAiSpeaking?: boolean;
  onStopAudio?: () => void;
}

export const AudioInputBar: React.FC<AudioInputBarProps> = ({
  onSendMessage,
  disabled = false,
  suggestedHints,
  isAiSpeaking = false,
  onStopAudio,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

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
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking(); // stop AI speech if playing
      onStopAudio?.(); // Clear activeAudioId in page.tsx so isAiSpeaking becomes false immediately!
      startListening();
    }
  };

  const handleSend = () => {
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
    setInputText(hint);
    setShowHints(false);
  };

  return (
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200/90 safe-bottom-padding shadow-xs">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2.5 space-y-2.5">
        {/* Horizontal Quick Reply Chips Carousel */}
        {suggestedHints.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 whitespace-nowrap pl-1 pr-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Gợi ý:</span>
            </div>
            {suggestedHints.map((hint, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectHint(hint)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer whitespace-nowrap flex-shrink-0 shadow-2xs border ${
                  inputText === hint
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/80 active:scale-95"
                }`}
              >
                "{hint}"
              </button>
            ))}
          </div>
        )}

        {/* Transcription Preview Pill (Shown when text is spoken or selected) */}
        {inputText.trim() && (
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-2xl animate-in fade-in duration-150">
            <p className="text-xs sm:text-sm font-medium text-slate-900 truncate pl-1 flex-1">
              "{inputText}"
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setInputText("")}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                title="Xóa câu này"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={disabled}
                className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-2xs cursor-pointer transition active:scale-95"
              >
                <span>Gửi</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Controls Dock */}
        {!isKeyboardMode ? (
          /* Voice-First Hero Dock */
          <div className="flex flex-col items-center justify-center pt-1 pb-1">
            <div className="flex items-center justify-center gap-6 w-full max-w-xs">
              {/* Keyboard Mode Switch */}
              <button
                type="button"
                onClick={() => setIsKeyboardMode(true)}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95"
                title="Gõ câu bằng bàn phím"
                aria-label="Chuyển sang bàn phím"
              >
                <Keyboard className="w-5 h-5" />
              </button>

              {/* Central Hero Mic Button */}
              <div className="relative">
                {isListening && (
                  <span className="absolute -inset-2 rounded-full bg-red-400 animate-pulse-ring pointer-events-none" />
                )}
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={disabled}
                  className={`relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 cursor-pointer ${
                    isListening
                      ? "bg-red-600 text-white scale-105 ring-4 ring-red-400/30"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={
                    isListening
                      ? "Đang thu âm (Bấm để kết thúc)"
                      : "Bấm Micro để nói tiếng Anh"
                  }
                  aria-label={isListening ? "Dừng thu âm" : "Nói qua micro"}
                >
                  {isListening ? (
                    <MicOff className="w-7 h-7 sm:w-8 sm:h-8" />
                  ) : (
                    <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
                  )}
                </button>
              </div>

              {/* Send or Placeholder */}
              {inputText.trim() ? (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={disabled}
                  className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95"
                  title="Gửi câu nói"
                  aria-label="Gửi câu nói"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-11 h-11" />
              )}
            </div>

            {/* Status Label */}
            <p className="text-[11px] font-medium text-slate-500 mt-2">
              {isListening ? (
                <span className="text-red-600 font-semibold animate-pulse">
                  🔴 Đang thu âm... Chạm micro để kết thúc & gửi
                </span>
              ) : isAiSpeaking ? (
                <span className="text-slate-700 font-medium">
                  🔊 AI đang phát âm... Chạm mic để nói chen
                </span>
              ) : (
                "Chạm Micro để luyện nói tiếng Anh"
              )}
            </p>
          </div>
        ) : (
          /* Text Keyboard Input Mode */
          <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => setIsKeyboardMode(false)}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
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
                className="w-full text-sm px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl focus:outline-hidden focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-900"
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() || disabled}
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white flex items-center justify-center transition shadow-2xs cursor-pointer flex-shrink-0"
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
