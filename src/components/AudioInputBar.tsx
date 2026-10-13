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
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200/90 safe-bottom-padding">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 space-y-2">
        {/* Top bar: Hints & Listening Status */}
        <div className="flex items-center justify-between gap-2">
          {suggestedHints.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition py-0.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-slate-500" />
              <span>Gợi ý cách trả lời ({suggestedHints.length})</span>
              {showHints ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {isListening && (
              <span className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span className="hidden sm:inline">Đang thu âm tiếng Anh...</span>
                <span className="sm:hidden">Đang thu...</span>
              </span>
            )}
          </div>
        </div>

        {/* Hints expandable */}
        {showHints && suggestedHints.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5 pb-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {suggestedHints.slice(0, 5).map((hint, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectHint(hint)}
                className="text-xs text-left bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 px-3 py-1.5 rounded-full transition shadow-2xs cursor-pointer"
              >
                "{hint}"
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-1 rounded-full bg-red-400 animate-pulse-ring pointer-events-none"></span>
            )}
            <button
              type="button"
              onClick={toggleListening}
              disabled={disabled}
              className={`relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition shadow-2xs cursor-pointer ${
                isListening
                  ? "bg-red-600 text-white scale-105"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={
                isListening
                  ? "Đang thu âm (Bấm để dừng)"
                  : "Bấm để nói tiếng Anh qua Micro"
              }
              aria-label={isListening ? "Dừng thu âm" : "Nói qua micro"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
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
              className={`w-full text-sm sm:text-base px-4 py-2.5 bg-slate-100 border rounded-2xl focus:outline-hidden transition placeholder:text-slate-400 ${
                isListening
                  ? "border-red-400 bg-red-50/20 text-slate-900"
                  : "border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() || disabled}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white flex items-center justify-center transition shadow-2xs flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
            title="Gửi câu nói"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
