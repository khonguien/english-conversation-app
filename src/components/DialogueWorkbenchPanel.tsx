"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Mic,
  MicOff,
  Keyboard,
  Send,
  Radio,
  CornerDownLeft,
  Terminal,
  Activity,
  Disc,
} from "lucide-react";
import { Scenario, Topic, ChatMessage } from "@/types/conversation";
import { speakText, stopSpeaking, unlockAudio } from "@/utils/speech";

interface DialogueWorkbenchPanelProps {
  scenario: Scenario | null;
  topic: Topic;
  messages: ChatMessage[];
  isAiThinking: boolean;
  activeAudioId: string | null;
  onPlayAudio: (id: string, text: string) => void;
  onStopAudio: () => void;
  onToggleReveal: (msgId: string) => void;
  subtitlesEnabled: boolean;
  userRole: "user" | "ai";
  onResetChat: () => void;
  suggestedHints?: string[];
  onSendMessage: (text: string) => void;
  isUserSpeaking: boolean;
  onListeningChange: (listening: boolean) => void;
}

export const DialogueWorkbenchPanel: React.FC<DialogueWorkbenchPanelProps> = ({
  scenario,
  topic,
  messages,
  isAiThinking,
  activeAudioId,
  onPlayAudio,
  onStopAudio,
  onToggleReveal,
  subtitlesEnabled,
  userRole,
  onResetChat,
  suggestedHints = [],
  onSendMessage,
  isUserSpeaking,
  onListeningChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of radar screen
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isAiThinking]);

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
    onListeningChange(false);
  }, [onListeningChange]);

  // Start speech recognition instance
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    unlockAudio();
    stopSpeaking();
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use the keyboard mode!"
      );
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      onListeningChange(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setInputText(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      onListeningChange(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      onListeningChange(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      setIsListening(false);
      onListeningChange(false);
    }
  }, [onListeningChange]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      if (inputText.trim()) {
        handleSend();
      }
    } else {
      startListening();
    }
  };

  const handleSend = () => {
    unlockAudio();
    if (!inputText.trim() || isAiThinking) return;
    const text = inputText.trim();
    setInputText("");
    stopListening();
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!scenario) return null;

  const aiRole = scenario.defaultRoles[userRole === "user" ? "ai" : "user"];
  const learnerRole = scenario.defaultRoles[userRole === "user" ? "user" : "ai"];

  return (
    <div
      className="relative w-full rounded-2xl flex flex-col h-[580px] select-none shadow-2xl transition-all overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #181512 0%, #110e0b 100%)",
        border: "3px solid #2e261f",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.85), inset 0 2px 4px rgba(255, 255, 255, 0.08), inset 0 -4px 8px rgba(0,0,0,0.8)",
      }}
    >
      {/* =========================================================================
          TOP HARDWARE BEZEL: Hex Bolts & Radar Model Badge Plate
         ========================================================================= */}
      <div className="relative px-3 sm:px-4 py-2 border-b-2 border-[#0d0a08] bg-gradient-to-r from-[#221c17] via-[#1b1612] to-[#221c17] flex items-center justify-between">
        {/* Left Bolt & Designation Plate */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-900 shadow-inner flex items-center justify-center">
            <div className="w-1 h-0.5 bg-stone-400 rounded-xs" />
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-amber-400 font-bold uppercase">
            <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">CRT RADAR TERMINAL</span>
            <span className="text-amber-600/70">•</span>
            <span className="text-amber-300">AN/ARC-184</span>
          </div>
        </div>

        {/* Center Active Radar Frequency */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-amber-950 font-mono text-[9px] text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
          <span>FREQ: 142.85 MHz</span>
        </div>

        {/* Right Bolt & Rewind Key */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetChat}
            className="px-2 py-0.5 rounded bg-[#1f1207] hover:bg-[#341d0c] border border-amber-800/80 hover:border-amber-500 text-amber-300 text-[9px] font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
            title="Clear and reset comms"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>RESET</span>
          </button>
          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-900 shadow-inner flex items-center justify-center">
            <div className="w-1 h-0.5 bg-stone-400 rounded-xs" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN CRT DISPLAY SCREEN: 1984 Amber Phosphor Tube with Scanlines
         ========================================================================= */}
      <div
        className="relative flex-1 flex flex-col p-3 sm:p-4 overflow-hidden border-2 border-black/80 m-2 sm:m-2.5 rounded-xl"
        style={{
          background:
            "radial-gradient(ellipse at center, #1a1005 0%, #0d0802 65%, #050301 100%)",
          boxShadow:
            "inset 0 0 30px rgba(245, 158, 11, 0.12), inset 0 2px 6px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)",
        }}
      >
        {/* CRT Scanline Overlay Effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0.5) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Background Radar Range Concentric Grid & Sweep Cue */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center z-0">
          <div className="w-80 h-80 rounded-full border border-amber-500" />
          <div className="w-56 h-56 rounded-full border border-amber-500 absolute" />
          <div className="w-32 h-32 rounded-full border border-amber-500 absolute" />
          <div className="w-full h-[1px] bg-amber-500 absolute" />
          <div className="h-full w-[1px] bg-amber-500 absolute" />
        </div>

        {/* Terminal Header Telemetry */}
        <div className="relative z-10 pb-2 mb-2 border-b border-amber-900/60 flex items-center justify-between text-amber-400 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-amber-500 font-bold uppercase tracking-wider">
              [CHAN: {topic.titleEn}]
            </span>
            <span className="text-amber-300/80 truncate">
              TAPE #{String(scenario.order || 1).padStart(2, "0")} • {scenario.titleEn}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 text-[9px] text-amber-500/70">
            <span>SQ: ON</span>
            <span>ANT: 5/5</span>
          </div>
        </div>

        {/* Scrollable CRT Transcript Stream */}
        <div
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto pr-1 space-y-3 custom-vintage-scrollbar"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-amber-500/60 font-mono space-y-2">
              <Activity className="w-8 h-8 opacity-40 text-amber-400 animate-pulse" />
              <p className="text-xs font-bold tracking-widest uppercase text-amber-400">
                [COMMS RADAR STANDBY]
              </p>
              <p className="text-[11px] text-amber-400/50 max-w-[260px] leading-relaxed">
                Radio link connected. Press PTT mic below or enter text to transmit.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAi = msg.sender === "ai";
              const isPlayingThis = activeAudioId === msg.id;
              const isRevealed = subtitlesEnabled || msg.revealed;

              if (isAi) {
                return (
                  <div
                    key={msg.id}
                    className="flex flex-col items-start gap-1 max-w-[95%] animate-in fade-in duration-150"
                  >
                    {/* Header: Incoming AI Signal Stamp */}
                    <div className="flex items-center justify-between w-full px-1">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-400 tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                        <span>► [RCV] {msg.roleName} (AI)</span>
                      </div>

                      {/* Mini Phosphor Controls: Audio Replay & Decrypt */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            isPlayingThis
                              ? onStopAudio()
                              : onPlayAudio(msg.id, msg.textEn)
                          }
                          className={`p-1 rounded border text-amber-300 transition-all cursor-pointer ${
                            isPlayingThis
                              ? "bg-amber-600 text-black border-amber-400 font-bold"
                              : "bg-black/60 hover:bg-amber-950/70 border-amber-900/80"
                          }`}
                          title={isPlayingThis ? "Halt audio" : "Replay signal"}
                        >
                          {isPlayingThis ? (
                            <VolumeX className="w-3 h-3 text-red-300 fill-current" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleReveal(msg.id)}
                          className="p-1 rounded border bg-black/60 hover:bg-amber-950/70 border-amber-900/80 text-amber-300 transition-all cursor-pointer"
                          title="Toggle translation decrypt"
                        >
                          {isRevealed ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3 text-amber-500/70" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Amber Phosphor Screen Message Box */}
                    <div
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-[#0e0904]/90 border border-amber-900/70 text-amber-100 font-mono text-xs sm:text-[13px] leading-relaxed shadow-sm space-y-1.5"
                      style={{
                        boxShadow: "0 0 10px rgba(245, 158, 11, 0.08)",
                      }}
                    >
                      <div className="text-amber-200">
                        {isRevealed ? (
                          <span style={{ textShadow: "0 0 6px rgba(251, 191, 36, 0.4)" }}>
                            {msg.textEn}
                          </span>
                        ) : (
                          <div
                            onClick={() => onToggleReveal(msg.id)}
                            className="bg-black/50 hover:bg-black/80 border border-dashed border-amber-900 py-1.5 px-2 rounded text-[10px] text-amber-500/70 italic cursor-pointer transition-colors flex items-center justify-between"
                            title="Click to unredact text"
                          >
                            <span>[RESTRICTED COMMS: TAP EYE TO DECRYPT]</span>
                            <Eye className="w-3 h-3 text-amber-600" />
                          </div>
                        )}
                      </div>

                      {isRevealed && msg.textVi && (
                        <p className="text-[11px] text-amber-500/80 pt-1 border-t border-amber-950 italic">
                          {msg.textVi}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              /* Learner (User) Outgoing Transmission */
              return (
                <div
                  key={msg.id}
                  className="flex flex-col items-end gap-1 max-w-[95%] ml-auto animate-in fade-in duration-150"
                >
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-400 tracking-wider uppercase px-1">
                    <span>▲ [XMIT] YOU ({learnerRole.titleEn})</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  </div>

                  <div
                    className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-amber-700/40 via-amber-600/30 to-amber-700/40 border border-amber-500/60 text-amber-100 font-mono text-xs sm:text-[13px] leading-relaxed shadow-sm"
                    style={{
                      textShadow: "0 0 6px rgba(251, 191, 36, 0.35)",
                      boxShadow: "0 0 12px rgba(217, 119, 6, 0.15)",
                    }}
                  >
                    {msg.textEn}
                  </div>
                </div>
              );
            })
          )}

          {/* AI Thinking Wave */}
          {isAiThinking && (
            <div className="flex items-center gap-2 p-2 rounded bg-black/70 border border-amber-800/80 max-w-[240px] animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              <span className="text-[10px] font-mono font-bold uppercase text-amber-300 tracking-wider">
                DECODING TRANSMISSION...
              </span>
            </div>
          )}
        </div>

        {/* Suggested Frequency Stamped Chips (Exclusively inside Radar Terminal) */}
        {suggestedHints.length > 0 && (
          <div className="relative z-10 pt-2 mt-1 border-t border-amber-900/60">
            <span className="text-[8px] font-mono text-amber-500/70 font-bold uppercase block mb-1 tracking-wider">
              SUGGESTED FREQ RESPONSES (CLICK TO SEND):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-14 overflow-y-auto">
              {suggestedHints.slice(0, 3).map((hint, hIdx) => (
                <button
                  key={hIdx}
                  type="button"
                  onClick={() => onSendMessage(hint)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#160c03] hover:bg-amber-950/80 border border-amber-800/70 hover:border-amber-400 text-amber-300 hover:text-amber-100 transition-all flex items-center gap-1 cursor-pointer truncate max-w-full shadow-2xs active:scale-95"
                  title={`Send: "${hint}"`}
                >
                  <span className="truncate">"{hint}"</span>
                  <CornerDownLeft className="w-2.5 h-2.5 flex-shrink-0 text-amber-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          PHYSICAL HARDWARE CONTROL BASE: Push-To-Talk Mic & Mechanical Keys Desk
         ========================================================================= */}
      <div
        className="relative z-20 px-4 py-3 bg-gradient-to-b from-[#241e18] via-[#1a1410] to-[#120e0a] border-t-2 border-[#332b22] flex flex-col gap-2"
        style={{
          boxShadow:
            "inset 0 1px 2px rgba(255, 255, 255, 0.15), 0 -4px 10px rgba(0,0,0,0.6)",
        }}
      >
        {/* Hardware Keyboard Slot (Expandable) */}
        {isKeyboardMode ? (
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0d0905] border-2 border-amber-900/70 shadow-inner">
            <Terminal className="w-3.5 h-3.5 text-amber-500 ml-1 flex-shrink-0" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type message and press Enter..."
              disabled={isAiThinking}
              className="flex-1 bg-transparent text-amber-200 placeholder-amber-700 text-xs font-mono outline-hidden"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() || isAiThinking}
              className="px-3 py-1 rounded-lg bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-40 text-black font-mono font-bold text-[10px] tracking-wider uppercase border-t border-l border-amber-400 border-b-2 border-amber-900 shadow-md transition-all active:translate-y-0.5 cursor-pointer"
            >
              TRANSMIT
            </button>
          </div>
        ) : null}

        {/* Physical Mechanical Keys Console Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Keyboard Mode Toggle Hard Key */}
          <button
            type="button"
            onClick={() => setIsKeyboardMode((prev) => !prev)}
            className={`px-3 py-2 rounded-xl font-mono text-[10px] font-bold tracking-wider uppercase border-t border-l border-white/20 border-b-3 border-r border-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 ${
              isKeyboardMode
                ? "bg-amber-600 text-black border-amber-400"
                : "bg-gradient-to-b from-[#3a3229] to-[#251f19] text-amber-300 hover:from-[#453c32] hover:to-[#2e261f]"
            }`}
            title="Toggle hardware keyboard mode"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">KEYBOARD</span>
          </button>

          {/* Center: Large Mechanical PTT (Push-To-Talk) Microphone Key */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              disabled={isAiThinking}
              className={`relative px-5 sm:px-6 py-2 rounded-2xl font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 border-t-2 border-l border-amber-300/60 border-b-4 border-r-2 border-black shadow-xl transition-all cursor-pointer active:translate-y-0.5 select-none ${
                isListening
                  ? "bg-gradient-to-b from-red-600 to-red-700 text-white ring-2 ring-red-400 animate-pulse"
                  : "bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950"
              }`}
              title={isListening ? "Listening... click to send" : "Push To Talk (PTT)"}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-white animate-spin" />
                  <span>TRANSMITTING...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-stone-950" />
                  <span>PTT MIC</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Audio Level / Transmission Meter */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-amber-500/70 uppercase font-semibold hidden sm:inline">
              MOD
            </span>
            <div className="flex items-end gap-0.5 h-3">
              <span className={`w-1 rounded-full ${isListening ? "bg-amber-400 animate-wave-1" : "bg-amber-950"} h-2`} />
              <span className={`w-1 rounded-full ${isListening ? "bg-amber-400 animate-wave-2" : "bg-amber-950"} h-3`} />
              <span className={`w-1 rounded-full ${isListening ? "bg-amber-400 animate-wave-3" : "bg-amber-950"} h-2.5`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
