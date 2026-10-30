"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  SkipForward,
  Mic,
  MicOff,
  Send,
  Keyboard,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  LogOut,
  RefreshCw,
  X,
} from "lucide-react";
import { Topic, Scenario, ChatMessage } from "@/types/conversation";
import { RoleIcon } from "./TopicIcons";
import { speakText, stopSpeaking } from "@/utils/speech";

interface CassetteStudioConsoleProps {
  topic: Topic;
  scenario: Scenario;
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  workbenchMode: "library" | "studio";
  onEnterStudio: () => void;
  onEjectTape: () => void;
  userRole: "user" | "ai";
  onToggleUserRole: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isAiThinking: boolean;
  activeAudioId: string | null;
  isUserSpeaking: boolean;
  onListeningChange: (listening: boolean) => void;
  onPlayAudio: (msgId: string, text: string) => void;
  onStopAudio: () => void;
  onToggleReveal: (msgId: string) => void;
  subtitlesEnabled: boolean;
  onToggleSubtitles: () => void;
  speechRate: number;
  onChangeSpeechRate: () => void;
  onNextScenario: () => void;
  onResetChat: () => void;
  suggestedHints: string[];
  completedScenarioIds?: string[];
}

export const CassetteStudioConsole: React.FC<CassetteStudioConsoleProps> = ({
  topic,
  scenario,
  scenarios,
  onSelectScenario,
  workbenchMode,
  onEnterStudio,
  onEjectTape,
  userRole,
  onToggleUserRole,
  messages,
  onSendMessage,
  isAiThinking,
  activeAudioId,
  isUserSpeaking,
  onListeningChange,
  onPlayAudio,
  onStopAudio,
  onToggleReveal,
  subtitlesEnabled,
  onToggleSubtitles,
  speechRate,
  onChangeSpeechRate,
  onNextScenario,
  onResetChat,
  suggestedHints,
  completedScenarioIds = [],
}) => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isSlotting, setIsSlotting] = useState(false);
  const [tapeCounter, setTapeCounter] = useState(104);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [playingHintIndex, setPlayingHintIndex] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const counterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isAiSpeaking = activeAudioId !== null;
  const isPlayingActive = isPlayingPreview || isAiSpeaking;

  const isPlayingAsStaff = userRole === "ai";
  const currentAiRole = isPlayingAsStaff
    ? scenario.defaultRoles.user
    : scenario.defaultRoles.ai;
  const currentLearnerRole = isPlayingAsStaff
    ? scenario.defaultRoles.ai
    : scenario.defaultRoles.user;

  // Auto scroll chat to bottom
  useEffect(() => {
    if (workbenchMode === "studio") {
      chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAiThinking, workbenchMode]);

  // Notify parent on listening change
  useEffect(() => {
    onListeningChange(isListening);
  }, [isListening, onListeningChange]);

  // Tape slotting animation when scenario changes
  useEffect(() => {
    stopSpeaking();
    setIsPlayingPreview(false);
    setIsSlotting(true);
    const timer = setTimeout(() => setIsSlotting(false), 450);
    return () => clearTimeout(timer);
  }, [scenario.id]);

  // Counter ticks when reels rotate
  useEffect(() => {
    if (isPlayingActive) {
      counterIntervalRef.current = setInterval(() => {
        setTapeCounter((c) => (c >= 999 ? 100 : c + 1));
      }, 900);
    } else {
      if (counterIntervalRef.current) clearInterval(counterIntervalRef.current);
    }
    return () => {
      if (counterIntervalRef.current) clearInterval(counterIntervalRef.current);
    };
  }, [isPlayingActive]);

  // Speech Recognition management
  const stopListening = () => {
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
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
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
      alert("Speech recognition is not supported in this browser. Please use the keyboard mode.");
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
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setInputText(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      setIsListening(false);
    }
  };

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

  const handleTogglePreview = () => {
    if (isPlayingPreview) {
      stopSpeaking();
      setIsPlayingPreview(false);
    } else {
      stopSpeaking();
      setIsPlayingPreview(true);
      const text = scenario.initialMessageEn || scenario.titleEn;
      speakText(text, speechRate, () => {
        setIsPlayingPreview(false);
      });
    }
  };

  const handleNextTape = () => {
    stopSpeaking();
    setIsPlayingPreview(false);
    const currentIndex = scenarios.findIndex((s) => s.id === scenario.id);
    const nextIndex = (currentIndex + 1) % scenarios.length;
    onSelectScenario(scenarios[nextIndex]);
  };

  const handlePlayHint = (hint: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    stopSpeaking();
    setPlayingHintIndex(index);
    speakText(hint, 0.9, () => {
      setPlayingHintIndex(null);
    });
  };

  const formattedCounter = String(tapeCounter).padStart(3, "0");
  const userMessageCount = messages.filter((m) => m.sender === "user").length;
  const isMilestoneReached = userMessageCount >= 2 && messages.length >= 4;

  return (
    <div className="w-full rounded-3xl bg-[#ffffff] dark:bg-[#15120f] border border-stone-200 dark:border-amber-950/40 shadow-2xl flex flex-col transition-all duration-500 overflow-hidden relative">
      {/* Corner Hardware Screws */}
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700/60 border border-stone-400 dark:border-stone-600/60" />
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700/60 border border-stone-400 dark:border-stone-600/60" />

      {/* Top Deck Status Bar */}
      <div className="px-5 sm:px-7 pt-4 pb-3 flex items-center justify-between border-b border-stone-200 dark:border-stone-800/80 text-xs">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isPlayingActive
                ? "bg-amber-400 amber-led-active"
                : "bg-stone-300 dark:bg-stone-800"
            }`}
          />
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
            {workbenchMode === "studio"
              ? isAiSpeaking
                ? `${currentAiRole.name} Speaking`
                : isUserSpeaking
                ? "Listening to You"
                : "Studio Active"
              : isPlayingPreview
              ? "Playing Tape"
              : "Standby"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wider hidden sm:inline">
            Voice Archive Mk-II
          </span>
          <div className="px-2.5 py-0.5 rounded bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-xs font-bold tracking-widest text-amber-700 dark:text-amber-400">
            {formattedCounter}
          </div>
        </div>
      </div>

      {/* Cassette Tape Well & Mechanical Hardware Enclosure */}
      <div className="p-4 sm:p-6 bg-stone-50 dark:bg-[#0f0c0a] border-b border-stone-200 dark:border-stone-800/80">
        <div
          className={`rounded-2xl p-3 sm:p-4 bg-stone-200 dark:bg-[#1a1612] border-2 border-stone-300 dark:border-[#2b241d] shadow-md transition-all duration-300 ${
            isSlotting ? "animate-tape-slot" : ""
          }`}
        >
          {/* Top Label Foil Strip */}
          <div className="rounded-xl p-3 bg-amber-50/90 dark:bg-[#251f19] border border-amber-200/80 dark:border-amber-900/40 space-y-1 mb-3">
            <div className="flex items-center justify-between text-xs text-amber-900 dark:text-amber-400 font-semibold">
              <span className="tracking-wide">
                Side A • Lesson #{scenario.order || 1}
              </span>
              <span>Stereo Hi-Fi 60 Min</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-amber-100 tracking-tight truncate">
              {scenario.titleEn}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 truncate">
              {scenario.situation || scenario.titleVi}
            </p>
          </div>

          {/* Tape Acrylic Window & Dual Spools */}
          <div className="relative h-20 sm:h-22 rounded-xl bg-stone-300/60 dark:bg-[#0c0908] border border-stone-400/60 dark:border-stone-800/80 flex items-center justify-between px-6 sm:px-12 overflow-hidden shadow-inner">
            {/* Magnetic Tape Ribbon Strip */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-8 bg-stone-800/90 dark:bg-[#140f0c] border-y border-stone-700/50 dark:border-stone-900 z-0 opacity-80" />

            {/* Left Spool Reel */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 flex items-center justify-center shadow-md ${
                  isPlayingActive ? "animate-reel-spin" : ""
                }`}
              >
                <svg className="w-8 h-8 text-stone-400 dark:text-stone-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1 1 0 0 1 1 1v2.07A8.001 8.001 0 0 1 18.93 11H21a1 1 0 1 1 0 2h-2.07A8.001 8.001 0 0 1 13 18.93V21a1 1 0 1 1-2 0v-2.07A8.001 8.001 0 0 1 5.07 13H3a1 1 0 1 1 0-2h2.07A8.001 8.001 0 0 1 11 5.07V3a1 1 0 0 1 1-1zm0 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </div>
            </div>

            {/* Center VU Meter Bars */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPlayingActive
                        ? "bg-amber-500 animate-pulse"
                        : "bg-stone-400 dark:bg-stone-700"
                    }`}
                    style={{
                      height: isPlayingActive ? `${8 + (i % 3) * 6}px` : "6px",
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
                Magnetic Tape
              </span>
            </div>

            {/* Right Spool Reel */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 flex items-center justify-center shadow-md ${
                  isPlayingActive ? "animate-reel-spin" : ""
                }`}
              >
                <svg className="w-8 h-8 text-stone-400 dark:text-stone-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1 1 0 0 1 1 1v2.07A8.001 8.001 0 0 1 18.93 11H21a1 1 0 1 1 0 2h-2.07A8.001 8.001 0 0 1 13 18.93V21a1 1 0 1 1-2 0v-2.07A8.001 8.001 0 0 1 5.07 13H3a1 1 0 1 1 0-2h2.07A8.001 8.001 0 0 1 11 5.07V3a1 1 0 0 1 1-1zm0 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Transport & Mechanical Controls Bar */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
          {/* Mechanical Transport Buttons */}
          <div className="flex items-center gap-2">
            {workbenchMode === "library" ? (
              <button
                type="button"
                onClick={handleTogglePreview}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer btn-mech-amber ${
                  isPlayingPreview
                    ? "bg-amber-600 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-stone-950"
                }`}
                title="Preview native opening audio"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isPlayingPreview ? "animate-pulse" : ""}`} />
                <span>{isPlayingPreview ? "Playing" : "Preview"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => (isAiSpeaking ? onStopAudio() : onPlayAudio("preview", scenario.initialMessageEn))}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer btn-mech-amber ${
                  isAiSpeaking
                    ? "bg-amber-600 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-stone-950"
                }`}
                title="Replay opening message"
              >
                {isAiSpeaking ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay</span>
                  </>
                )}
              </button>
            )}

            {/* Next Tape */}
            <button
              type="button"
              onClick={handleNextTape}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer btn-mech-metal bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
              title="Next tape"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Next</span>
            </button>

            {/* Eject Tape Button */}
            <button
              type="button"
              onClick={onEjectTape}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer btn-mech-metal bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
              title="Eject tape and expand library rack"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{workbenchMode === "studio" ? "Eject" : "Rack"}</span>
            </button>
          </div>

          {/* Subtitles & Speed & Role Toggles */}
          <div className="flex items-center gap-2 text-xs">
            {workbenchMode === "studio" && (
              <>
                {/* Subtitle Masking toggle */}
                <button
                  type="button"
                  onClick={onToggleSubtitles}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    subtitlesEnabled
                      ? "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                      : "bg-amber-500 text-stone-950 shadow-xs"
                  }`}
                  title="Toggle Ear-First masked mode"
                >
                  {subtitlesEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{subtitlesEnabled ? "Subtitles" : "Ear-First"}</span>
                </button>

                {/* Speed Toggle */}
                <button
                  type="button"
                  onClick={onChangeSpeechRate}
                  className="px-2 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold transition-colors cursor-pointer"
                  title="Speech speed"
                >
                  {speechRate}x
                </button>
              </>
            )}

            {/* Role Switcher */}
            <button
              type="button"
              onClick={onToggleUserRole}
              className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 font-semibold text-stone-800 dark:text-stone-200 hover:border-amber-500 transition-colors cursor-pointer flex items-center gap-1"
              title="Switch role"
            >
              <RoleIcon role={userRole} className="w-3 h-3 text-amber-600" />
              <span className="truncate max-w-[80px]">
                {userRole === "user" ? scenario.defaultRoles.user.name : scenario.defaultRoles.ai.name}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Body */}
      {workbenchMode === "library" ? (
        /* Standby / Library Mode: Inviting Preview Banner */
        <div className="p-6 sm:p-7 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500">
              Tape Loaded & Ready
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              {scenario.titleEn}
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {scenario.situation}
            </p>
          </div>

          {/* Opening Speech Quote Preview */}
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-[#1a1612] border border-stone-200 dark:border-stone-800 space-y-1.5">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">
              Opening Statement ({scenario.defaultRoles.ai.name}):
            </span>
            <p className="text-sm italic font-medium text-stone-800 dark:text-stone-200">
              "{scenario.initialMessageEn}"
            </p>
          </div>

          {/* Enter Practice Studio CTA */}
          <button
            type="button"
            onClick={onEnterStudio}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-base flex items-center justify-between shadow-xl shadow-amber-500/25 cursor-pointer press-tactile group transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-stone-950 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Mic className="w-4 h-4 text-white" />
              </span>
              <span>Start Practice Session</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold opacity-90 group-hover:translate-x-1 transition-transform">
              <span>Speak Now</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      ) : (
        /* Studio Mode: In-Place Interactive Dialogue & Acoustic Mic Dock */
        <div className="flex-1 flex flex-col min-h-[420px] max-h-[65vh]">
          {/* Scrollable Dialogue Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              const isPlaying = activeAudioId === msg.id;
              const isRevealed = subtitlesEnabled || msg.revealed;

              if (isAi) {
                return (
                  <div key={msg.id} className="flex items-start gap-3 max-w-xl animate-in fade-in duration-200">
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 px-1">
                        {msg.roleName}
                      </span>

                      <div className="p-4 rounded-2xl rounded-tl-sm bg-stone-100 dark:bg-[#1c1815] border border-stone-200 dark:border-stone-800 space-y-2">
                        {/* Audio row */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 dark:border-stone-800/80">
                          <button
                            type="button"
                            onClick={() =>
                              isPlaying ? onStopAudio() : onPlayAudio(msg.id, msg.textEn)
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                              isPlaying
                                ? "bg-amber-500 text-stone-950"
                                : "text-amber-700 dark:text-amber-400 hover:bg-stone-200 dark:hover:bg-stone-800"
                            }`}
                          >
                            {isPlaying ? (
                              <>
                                <VolumeX className="w-3 h-3" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Replay</span>
                              </>
                            )}
                          </button>

                          {isPlaying && (
                            <div className="flex items-end gap-0.5 h-2.5">
                              <span className="w-0.5 bg-amber-500 rounded-full animate-wave-1" />
                              <span className="w-0.5 bg-amber-500 rounded-full animate-wave-2" />
                              <span className="w-0.5 bg-amber-500 rounded-full animate-wave-3" />
                            </div>
                          )}
                        </div>

                        {/* Dialogue content */}
                        {isRevealed ? (
                          <div className="space-y-1.5">
                            <p className="text-sm sm:text-base font-semibold leading-relaxed text-stone-900 dark:text-stone-100">
                              {msg.textEn}
                            </p>
                            {msg.textVi && (
                              <p className="text-xs text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-800">
                                {msg.textVi}
                              </p>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleReveal(msg.id)}
                            className="text-left w-full cursor-pointer py-1"
                            title="Click to reveal"
                          >
                            <p className="subtitle-blurred text-sm sm:text-base font-semibold leading-relaxed text-stone-900 dark:text-stone-100">
                              {msg.textEn}
                            </p>
                            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block mt-1">
                              Tap to reveal subtitle
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex items-start justify-end gap-3 max-w-xl ml-auto animate-in fade-in duration-200">
                  <div className="flex-1 min-w-0 space-y-1 text-right">
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 px-1">
                      You ({msg.roleName})
                    </span>
                    <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-sm bg-amber-600 dark:bg-amber-600 text-white font-semibold text-sm sm:text-base inline-block text-left shadow-sm">
                      {msg.textEn}
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <RoleIcon role="user" className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}

            {/* AI Thinking Animation */}
            {isAiThinking && (
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 p-2.5 bg-stone-100 dark:bg-[#1a1612] rounded-xl w-fit animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{currentAiRole.name} is responding...</span>
              </div>
            )}

            {/* Lesson Completion Milestone Card */}
            {isMilestoneReached && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Great job! Scenario Completed</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  You've successfully exercised real spoken reflexes for this situation!
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onResetChat}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 transition-colors cursor-pointer"
                  >
                    Practice Again
                  </button>
                  <button
                    type="button"
                    onClick={onNextScenario}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Next Tape</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div ref={chatScrollRef} className="h-2" />
          </div>

          {/* Contextual Shadowing Hints */}
          {suggestedHints.length > 0 && !isAiThinking && (
            <div className="px-4 py-2 border-t border-stone-200 dark:border-stone-800/80 bg-stone-50 dark:bg-[#110e0c] flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider flex-shrink-0">
                Shadowing:
              </span>
              {suggestedHints.map((hint, idx) => {
                const isPlayingThis = playingHintIndex === idx;
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center rounded-full bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300/80 dark:border-stone-700/80 text-xs text-stone-700 dark:text-stone-200 flex-shrink-0 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setInputText(hint)}
                      className="px-3 py-1 hover:text-amber-600 transition-colors cursor-pointer truncate max-w-[200px]"
                    >
                      {hint}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handlePlayHint(hint, idx, e)}
                      className="pr-2 pl-1 py-1 text-stone-400 hover:text-amber-500 transition-colors cursor-pointer"
                      title="Listen before speaking"
                    >
                      <Volume2 className={`w-3 h-3 ${isPlayingThis ? "animate-pulse text-amber-500" : ""}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Acoustic Mic Dock */}
          <div className="p-3 sm:p-4 bg-stone-100 dark:bg-[#16120e] border-t border-stone-200 dark:border-stone-800">
            {!isKeyboardMode ? (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full max-w-sm px-2">
                  {/* Keyboard Mode Button */}
                  <button
                    type="button"
                    onClick={() => setIsKeyboardMode(true)}
                    className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center cursor-pointer press-tactile"
                    title="Switch to typing"
                  >
                    <Keyboard className="w-4 h-4" />
                  </button>

                  {/* Central Acoustic Mic Button */}
                  <div className="relative flex items-center justify-center">
                    {isListening && (
                      <span className="absolute -inset-2.5 rounded-full bg-rose-500/20 animate-mic-pulse-ring pointer-events-none" />
                    )}
                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={isAiThinking}
                      className={`relative z-10 w-13 h-13 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer press-tactile ${
                        isListening
                          ? "bg-rose-600 text-white ring-4 ring-rose-500/30"
                          : "bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                      } disabled:opacity-50`}
                      title={isListening ? "Recording... tap to send" : "Tap mic to speak"}
                    >
                      {isListening ? (
                        <MicOff className="w-5 h-5 text-white" />
                      ) : (
                        <Mic className="w-5 h-5 text-stone-950" />
                      )}
                    </button>
                  </div>

                  {/* Send Button or Spacer */}
                  {inputText.trim() ? (
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={isAiThinking}
                      className="w-9 h-9 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center cursor-pointer press-tactile"
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-9 h-9" />
                  )}
                </div>

                {/* Status Feedback */}
                <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-1.5 text-center">
                  {isListening ? (
                    <span className="text-rose-600 font-semibold">
                      Listening... Speak clearly in English
                    </span>
                  ) : isAiSpeaking ? (
                    <span className="text-amber-600 font-semibold">
                      Partner speaking...
                    </span>
                  ) : (
                    <span>Tap mic or choose a shadowing phrase to speak</span>
                  )}
                </p>
              </div>
            ) : (
              /* Keyboard Input Mode */
              <div className="flex items-center gap-2 max-w-lg mx-auto w-full">
                <button
                  type="button"
                  onClick={() => setIsKeyboardMode(false)}
                  className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
                  title="Switch to mic"
                >
                  <Mic className="w-4 h-4 text-amber-600" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isAiThinking}
                  placeholder="Type your response in English..."
                  className="flex-1 text-xs sm:text-sm px-4 py-2 bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-full focus:outline-hidden focus:border-amber-500 text-stone-900 dark:text-stone-100"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputText.trim() || isAiThinking}
                  className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 disabled:opacity-40 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
