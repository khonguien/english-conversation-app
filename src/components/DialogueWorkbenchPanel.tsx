"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Keyboard,
  Send,
  Radio,
  CornerDownLeft,
  Terminal,
  Activity,
  Volume1,
  FileText,
} from "lucide-react";
import { Scenario, Topic, ChatMessage } from "@/types/conversation";
import { speakText, stopSpeaking, unlockAudio } from "@/utils/speech";
import {
  playDotMatrixPrintSound,
  playToggleSwitchSound,
  playRadioClickSound,
  playPunchCardFeedSound,
  isRetroAudioMuted,
  toggleRetroAudioMute,
  subscribeAudioMute,
} from "@/utils/retroAudioFx";

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
  const [isFxMuted, setIsFxMuted] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Subscribe to global mute state
  useEffect(() => {
    setIsFxMuted(isRetroAudioMuted());
    return subscribeAudioMute((muted) => setIsFxMuted(muted));
  }, []);

  // Auto-scroll paper upward to the latest typed message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isAiThinking]);

  // Dot-matrix needle printhead sound effect when new message arrives
  const prevMsgCountRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMsgCountRef.current) {
      let count = 0;
      const interval = setInterval(() => {
        playDotMatrixPrintSound();
        count++;
        if (count >= 5) clearInterval(interval);
      }, 65);
    }
    prevMsgCountRef.current = messages.length;
  }, [messages]);

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

  // Toggle PTT switch (Up = On Air, Down = Standby)
  const toggleListening = () => {
    if (isListening) {
      playToggleSwitchSound(false);
      stopListening();
      if (inputText.trim()) {
        handleSend();
      }
    } else {
      playToggleSwitchSound(true);
      startListening();
    }
  };

  const handleSend = () => {
    unlockAudio();
    if (!inputText.trim() || isAiThinking) return;
    const text = inputText.trim();
    setInputText("");
    stopListening();
    playDotMatrixPrintSound();
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Feed IBM Punch Card
  const handlePunchCardClick = (hint: string) => {
    unlockAudio();
    playPunchCardFeedSound();
    onSendMessage(hint);
  };

  // Toggle MUTE FX
  const handleToggleMute = () => {
    const newState = toggleRetroAudioMute();
    setIsFxMuted(newState);
    if (!newState) {
      playRadioClickSound();
    }
  };

  if (!scenario) return null;

  const aiRole = scenario.defaultRoles[userRole === "user" ? "ai" : "user"];
  const learnerRole = scenario.defaultRoles[userRole === "user" ? "user" : "ai"];

  return (
    <div
      className="relative w-full rounded-2xl flex flex-col h-[580px] select-none shadow-2xl transition-all overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #241e19 0%, #171310 100%)",
        border: "3px solid #3d3228",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -4px 8px rgba(0,0,0,0.8)",
      }}
    >
      {/* =========================================================================
          TOP BEZEL: Teleprinter Machine Badge & Serrated Tear-Off Bar
         ========================================================================= */}
      <div className="relative px-3 sm:px-4 py-2 border-b-2 border-[#120e0b] bg-gradient-to-r from-[#2c241e] via-[#211a14] to-[#2c241e] flex items-center justify-between text-stone-300">
        {/* Machine Model Badge */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-900 shadow-inner flex items-center justify-center">
            <div className="w-1 h-0.5 bg-stone-400 rounded-xs" />
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-amber-300 font-bold uppercase">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">TELEX MODEL T-84</span>
            <span className="text-amber-600/70">•</span>
            <span className="text-amber-400">TRACTOR PRINTHEAD</span>
          </div>
        </div>

        {/* Action Controls: Form Feed & Mute FX */}
        <div className="flex items-center gap-2">
          {/* Mute FX Toggle Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`p-1 px-2 rounded border text-[9px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
              isFxMuted
                ? "bg-red-950/80 border-red-800 text-red-300"
                : "bg-[#18110a] hover:bg-[#2c1d12] border-amber-900/60 text-amber-400"
            }`}
            title={isFxMuted ? "Unmute mechanical sounds" : "Mute mechanical sounds"}
          >
            {isFxMuted ? (
              <>
                <VolumeX className="w-2.5 h-2.5" />
                <span>FX MUTED</span>
              </>
            ) : (
              <>
                <Volume1 className="w-2.5 h-2.5 text-amber-400" />
                <span>FX SOUND</span>
              </>
            )}
          </button>

          {/* Form Feed / Reset */}
          <button
            type="button"
            onClick={() => {
              playPunchCardFeedSound();
              onResetChat();
            }}
            className="px-2 py-0.5 rounded bg-[#1c1209] hover:bg-[#342010] border border-amber-800/80 text-amber-300 text-[9px] font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
            title="Form Feed / Clear and reset telex paper"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>FORM FEED</span>
          </button>

          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-900 shadow-inner flex items-center justify-center">
            <div className="w-1 h-0.5 bg-stone-400 rounded-xs" />
          </div>
        </div>
      </div>

      {/* Serrated Acrylic / Steel Tear-off Guide Rail */}
      <div className="h-1.5 w-full bg-gradient-to-r from-stone-500 via-stone-300 to-stone-500 border-b border-black/80 opacity-90 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
      </div>

      {/* =========================================================================
          CONTINUOUS TRACTOR-FEED PAPER (Ivory / Aged Cream Roll feeding upward)
         ========================================================================= */}
      <div className="relative flex-1 flex flex-row overflow-hidden m-2 sm:m-2.5 rounded-lg teleprinter-paper border-2 border-[#b8ae9c]">
        {/* Left Tractor Feed Margin with Round Sprocket Holes */}
        <div className="w-5 sm:w-6 border-r border-[#d4c9b6] flex flex-col justify-around py-3 items-center select-none bg-[#f1ebd8]/70">
          {Array.from({ length: 14 }).map((_, idx) => (
            <div key={`lh-${idx}`} className="tractor-sprocket-hole" />
          ))}
        </div>

        {/* Center Paper Transcript Stream */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Teleprinter Header Stamp on Paper */}
          <div className="px-3 sm:px-4 py-2 border-b border-[#ded3be] flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-stone-600 font-bold uppercase tracking-wider bg-white/20">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-amber-900">DISPATCH #{String(scenario.order || 1).padStart(2, "0")}</span>
              <span>•</span>
              <span className="text-stone-700 truncate">{scenario.titleEn}</span>
            </div>
            <div className="flex items-center gap-1 text-stone-500 flex-shrink-0">
              <span>TTY-142.85</span>
              <span>•</span>
              <span className="text-emerald-700">ONLINE</span>
            </div>
          </div>

          {/* Scrollable Printable Paper Body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 custom-paper-scrollbar space-y-3.5"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-stone-600 font-mono space-y-2">
                <Activity className="w-8 h-8 opacity-40 text-stone-500 animate-pulse" />
                <p className="text-xs font-bold tracking-widest uppercase text-stone-800">
                  [TELEX TERMINAL IDLE • READY]
                </p>
                <p className="text-[11px] text-stone-600 max-w-[260px] leading-relaxed">
                  Continuous tractor-feed paper loaded. Flip PTT toggle switch below or feed an IBM punch card to transmit.
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
                      className="flex flex-col items-start gap-1 max-w-[96%] animate-in fade-in duration-150"
                    >
                      {/* Telex Header Stamp */}
                      <div className="flex items-center justify-between w-full px-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-stone-700 uppercase">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-800">► RCV [TELEX]</span>
                          <span className="text-stone-900 font-bold">{msg.roleName} (AI):</span>
                        </div>

                        {/* Stamp Action Controls: Speaker Replay & Decrypt */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              playRadioClickSound();
                              isPlayingThis
                                ? onStopAudio()
                                : onPlayAudio(msg.id, msg.textEn);
                            }}
                            className={`p-1 rounded border text-[9px] font-mono flex items-center gap-0.5 cursor-pointer transition-colors ${
                              isPlayingThis
                                ? "bg-amber-600 text-white border-amber-800 font-bold"
                                : "bg-[#ebe4d3] hover:bg-[#ded5c2] border-[#cfc4b0] text-stone-800"
                            }`}
                            title={isPlayingThis ? "Halt audio" : "Replay signal"}
                          >
                            {isPlayingThis ? (
                              <VolumeX className="w-3 h-3 text-white fill-current" />
                            ) : (
                              <Volume2 className="w-3 h-3 text-stone-800" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playRadioClickSound();
                              onToggleReveal(msg.id);
                            }}
                            className="p-1 rounded border bg-[#ebe4d3] hover:bg-[#ded5c2] border-[#cfc4b0] text-stone-800 transition-colors cursor-pointer"
                            title="Toggle translation decrypt"
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3 text-stone-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Printed Message Box on Paper */}
                      <div className="w-full p-2.5 rounded-md bg-[#fffdf8] border border-[#d6cbba] shadow-xs space-y-1">
                        {/* English Line: Carbon Black Ribbon Inking */}
                        <div>
                          {isRevealed ? (
                            <div className="text-stone-900 font-mono text-xs sm:text-[13px] font-bold leading-relaxed tracking-tight">
                              {msg.textEn}
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                playDotMatrixPrintSound();
                                onToggleReveal(msg.id);
                              }}
                              className="restricted-stamp py-1.5 px-2.5 rounded bg-red-950/5 border border-red-700/60 text-[10px] text-red-700 font-bold uppercase cursor-pointer flex items-center justify-between"
                              title="Click to unseal restricted telegram"
                            >
                              <span>[RESTRICTED TELEGRAM • TAP TO DECRYPT]</span>
                              <Eye className="w-3.5 h-3.5 text-red-700" />
                            </div>
                          )}
                        </div>

                        {/* Vietnamese Translation: Vintage Red Ribbon Inking */}
                        {isRevealed && msg.textVi && (
                          <div className="text-red-700 dark:text-red-600 font-mono text-[11px] font-semibold leading-relaxed italic border-l-2 border-red-500/50 pl-2 mt-1">
                            {msg.textVi}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                /* Learner (User) Outgoing Transmission (Typewriter Blue/Black Ink) */
                return (
                  <div
                    key={msg.id}
                    className="flex flex-col items-end gap-1 max-w-[96%] ml-auto animate-in fade-in duration-150"
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold text-stone-700 uppercase px-1">
                      <span>▲ XMIT [LOCAL STATION] • YOU ({learnerRole.titleEn})</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                    </div>

                    <div className="p-2.5 rounded-md bg-[#edf3fa] border border-[#b8cde4] text-[#0f2847] font-mono text-xs sm:text-[13px] font-bold leading-relaxed shadow-xs">
                      {msg.textEn}
                    </div>
                  </div>
                );
              })
            )}

            {/* Printhead Needle Typing / AI Decoding Cue */}
            {isAiThinking && (
              <div className="flex items-center gap-2 p-2 rounded bg-[#fffdf8] border border-[#d6cbba] max-w-[250px] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span className="text-[10px] font-mono font-bold uppercase text-stone-800 tracking-wider">
                  PRINTHEAD INKING DISPATCH...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Tractor Feed Margin with Round Sprocket Holes */}
        <div className="w-5 sm:w-6 border-l border-[#d4c9b6] flex flex-col justify-around py-3 items-center select-none bg-[#f1ebd8]/70">
          {Array.from({ length: 14 }).map((_, idx) => (
            <div key={`rh-${idx}`} className="tractor-sprocket-hole" />
          ))}
        </div>
      </div>

      {/* =========================================================================
          IBM 80-COLUMN PUNCH CARDS INTAKE HOPPER (Suggested Responses)
         ========================================================================= */}
      {suggestedHints.length > 0 && (
        <div className="relative z-10 px-3 py-1.5 bg-[#1e1813] border-t-2 border-[#33271d] flex flex-col gap-1">
          <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase tracking-wider text-amber-400/80">
            <span>IBM 80-COLUMN PROGRAMMED RESPONSES (CLICK TO FEED):</span>
            <span className="text-stone-400">READER READY</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto custom-vintage-scrollbar py-0.5">
            {suggestedHints.slice(0, 3).map((hint, hIdx) => (
              <button
                key={hIdx}
                type="button"
                onClick={() => handlePunchCardClick(hint)}
                className="punch-card-stock p-1.5 px-2.5 rounded-sm flex items-center gap-2 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 text-left max-w-full group"
                title={`Feed punch card into reader: "${hint}"`}
              >
                {/* Punch Holes Pattern */}
                <div className="flex flex-col gap-0.5 opacity-60">
                  <div className="flex gap-0.5">
                    <div className="punch-card-hole" />
                    <div className="punch-card-hole" />
                  </div>
                  <div className="flex gap-0.5">
                    <div className="punch-card-hole opacity-40" />
                    <div className="punch-card-hole" />
                  </div>
                </div>

                {/* Card Mono Text */}
                <span className="font-mono text-[10px] text-stone-900 font-bold tracking-tight truncate max-w-[210px] sm:max-w-[260px]">
                  "{hint}"
                </span>

                <span className="text-[8px] font-mono text-amber-800 font-bold uppercase ml-auto opacity-70 group-hover:opacity-100 flex-shrink-0">
                  FEED ↵
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          BOTTOM INDUSTRIAL BASE: Heavy PTT Toggle Switch & Mechanical Keyboard
         ========================================================================= */}
      <div
        className="relative z-20 px-3.5 py-2.5 bg-gradient-to-b from-[#261f18] via-[#1a140f] to-[#110d0a] border-t-2 border-[#382d22] flex flex-col gap-2"
        style={{
          boxShadow:
            "inset 0 1px 2px rgba(255, 255, 255, 0.15), 0 -4px 10px rgba(0,0,0,0.6)",
        }}
      >
        {/* Recessed Mechanical Keyboard Input Drawer */}
        {isKeyboardMode ? (
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0d0905] border-2 border-amber-900/70 shadow-inner">
            <Terminal className="w-3.5 h-3.5 text-amber-500 ml-1 flex-shrink-0" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type telegram message and press Enter..."
              disabled={isAiThinking}
              className="flex-1 bg-transparent text-amber-200 placeholder-amber-700/80 text-xs font-mono outline-hidden"
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

        {/* Industrial Switch & Key Console */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Mechanical Keyboard Drawer Key */}
          <button
            type="button"
            onClick={() => {
              playRadioClickSound();
              setIsKeyboardMode((prev) => !prev);
            }}
            className={`px-2.5 py-1.5 rounded-xl font-mono text-[10px] font-bold tracking-wider uppercase border-t border-l border-white/20 border-b-3 border-r border-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 ${
              isKeyboardMode
                ? "bg-amber-600 text-black border-amber-400"
                : "bg-gradient-to-b from-[#3a3025] to-[#251e17] text-amber-300 hover:from-[#45392d] hover:to-[#2e251d]"
            }`}
            title="Toggle mechanical keyboard input"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">KEYBOARD</span>
          </button>

          {/* Center: Industrial Toggle Switch for PTT Mic */}
          <div className="flex items-center gap-3">
            {/* Red Jewel Indicator Bulb */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                  isListening
                    ? "bg-red-500 border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.95)] animate-pulse"
                    : "bg-red-950/70 border-red-900"
                }`}
              />
              <span className="text-[7px] font-mono text-stone-400 uppercase font-bold mt-0.5">
                ON AIR
              </span>
            </div>

            {/* Heavy Toggle Switch Lever */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={isAiThinking}
              className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#2b221a] to-[#19130f] border-2 border-[#453629] shadow-lg cursor-pointer active:scale-95 transition-all"
              title={isListening ? "Flip down to stop & transmit" : "Flip up to transmit speech"}
            >
              {/* Mechanical Toggle Lever Graphic */}
              <div className="w-6 h-9 rounded-md bg-[#110d0a] border border-stone-600 flex flex-col items-center justify-between p-1 relative shadow-inner">
                <span className="text-[6px] font-mono font-bold text-stone-400 uppercase">UP</span>
                {/* Metallic Lever Knob */}
                <div
                  className={`w-4 h-3.5 rounded-sm bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 border border-stone-600 shadow-md transition-all duration-150 transform ${
                    isListening
                      ? "-translate-y-1.5 bg-gradient-to-r from-red-400 via-red-200 to-red-400"
                      : "translate-y-1.5"
                  }`}
                />
                <span className="text-[6px] font-mono font-bold text-stone-400 uppercase">DN</span>
              </div>

              {/* Text label */}
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wider">
                  PTT TOGGLE
                </span>
                <span className="text-[8px] font-mono text-stone-400 font-bold uppercase">
                  {isListening ? "TRANSMITTING (UP)" : "STANDBY (DOWN)"}
                </span>
              </div>
            </button>
          </div>

          {/* Right: Audio Modulation Meter */}
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
