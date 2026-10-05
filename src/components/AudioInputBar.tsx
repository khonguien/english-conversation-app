"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Send, Lightbulb, ChevronUp, ChevronDown } from "lucide-react";
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
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Fresh start recognition instance for EVERY turn (crucial for iOS Safari & WebKit reuse)
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

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
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
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
      setIsListening(false);
      recognitionRef.current = null;

      if (event.error === "not-allowed") {
        alert(
          "Trình duyệt Safari chưa được cấp quyền Micro!\n\nCách bật: Vào Cài đặt (Settings) trên iPhone/iPad > Safari > Micro (Microphone) > Chọn 'Cho phép' (Allow) và tải lại trang nhé!"
        );
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
  }, [isAiSpeaking]);

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
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-bottom-padding">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 space-y-2">
        {/* Top bar: Hints & Auto-Mic Toggle / Status */}
        <div className="flex items-center justify-between gap-2">
          {suggestedHints.length > 0 ? (
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition py-0.5"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Gợi ý cách trả lời ({suggestedHints.length})</span>
              {showHints ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {isListening && (
              <span className="flex items-center gap-1.5 text-xs text-red-600 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span className="hidden sm:inline">Đang thu âm tiếng Anh...</span>
                <span className="sm:hidden">Đang thu...</span>
              </span>
            )}

          </div>
        </div>

        {/* Hints expandable */}
        {showHints && suggestedHints.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5 pb-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {suggestedHints.slice(0, 4).map((hint, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectHint(hint)}
                className="text-xs text-left bg-indigo-50/80 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/80 px-2.5 py-1.5 rounded-xl transition shadow-2xs"
              >
                "{hint}"
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          {/* Big Mic Button */}
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-1 rounded-full bg-red-400 animate-pulse-ring pointer-events-none"></span>
            )}
            <button
              onClick={toggleListening}
              disabled={disabled}
              className={`relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition shadow-md ${
                isListening
                  ? "bg-red-600 text-white scale-105"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } disabled:opacity-50`}
              title={
                isListening
                  ? "Đang thu âm (Bấm để dừng)"
                  : "Bấm để nói tiếng Anh qua Micro"
              }
            >
              {isListening ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>

          {/* Text Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={
                isListening
                  ? "Đang lắng nghe bạn nói..."
                  : "Nói qua mic hoặc gõ câu trả lời..."
              }
              className={`w-full text-sm sm:text-base px-3.5 py-2.5 bg-slate-100 border rounded-2xl focus:outline-hidden transition placeholder:text-slate-400 ${
                isListening
                  ? "border-red-400 bg-red-50/30 text-slate-900"
                  : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              }`}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || disabled}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition shadow-sm flex-shrink-0"
            title="Gửi câu nói"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
