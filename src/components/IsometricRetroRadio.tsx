"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Square,
  Play,
  ArrowUpRight,
  Sparkles,
  Eye,
  EyeOff,
  Eject,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { Scenario, Topic, ChatMessage } from "@/types/conversation";
import { AudioInputBar } from "./AudioInputBar";

interface IsometricRetroRadioProps {
  topic: Topic;
  scenario: Scenario | null;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onEject: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isAiThinking: boolean;
  activeAudioId: string | null;
  isUserSpeaking: boolean;
  onListeningChange: (listening: boolean) => void;
  onPlayAudio: (id: string, text: string) => void;
  onStopAudio: () => void;
  onToggleReveal: (msgId: string) => void;
  subtitlesEnabled: boolean;
  onToggleSubtitles: () => void;
  speechRate: number;
  onIncreaseSpeed: () => void;
  onDecreaseSpeed: () => void;
  suggestedHints: string[];
  userRole: "user" | "ai";
  onToggleUserRole: () => void;
  onResetChat: () => void;
  doorState?: "closed" | "opening" | "inserting" | "closing";
}

export const IsometricRetroRadio: React.FC<IsometricRetroRadioProps> = ({
  topic,
  scenario,
  isPlaying,
  onPlay,
  onStop,
  onEject,
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
  onIncreaseSpeed,
  onDecreaseSpeed,
  suggestedHints,
  userRole,
  onToggleUserRole,
  onResetChat,
  doorState = "closed",
}) => {
  // Get latest AI message to float from the speaker grille
  const latestAiMessage = [...messages].reverse().find((m) => m.sender === "ai");
  const isReelsSpinning = isPlaying || activeAudioId !== null || isAiThinking;

  // Door tilt styling based on doorState
  const getDoorTransformClass = () => {
    switch (doorState) {
      case "opening":
        return "animate-radio-door-open";
      case "inserting":
        return "scale-[1.02]";
      case "closing":
        return "animate-radio-door-close";
      default:
        return "";
    }
  };

  // Audio-reactive Sound Wave Equalizer for 42-hole speaker grille (7 cols x 6 rows)
  const isAudioActive = isPlaying || activeAudioId !== null || isUserSpeaking;
  const [eqLevels, setEqLevels] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!isAudioActive && !isAiThinking) {
      setEqLevels([0, 0, 0, 0, 0, 0, 0]);
      return;
    }

    let sweepStep = 0;
    const interval = setInterval(() => {
      if (isAudioActive) {
        // Natural speech frequency distribution: vocal frequencies (cols 2-4) have higher amplitude
        setEqLevels([
          Math.floor(Math.random() * 3) + 1, // Col 0: 1-3
          Math.floor(Math.random() * 4) + 2, // Col 1: 2-5
          Math.floor(Math.random() * 4) + 3, // Col 2: 3-6
          Math.floor(Math.random() * 3) + 4, // Col 3 (center peak): 4-6
          Math.floor(Math.random() * 4) + 3, // Col 4: 3-6
          Math.floor(Math.random() * 4) + 2, // Col 5: 2-5
          Math.floor(Math.random() * 3) + 1, // Col 6: 1-3
        ]);
      } else if (isAiThinking) {
        // Thinking state: radar / scanner pulse across the 7 columns
        sweepStep = (sweepStep + 1) % 7;
        const thinkingWave = [1, 1, 1, 1, 1, 1, 1];
        thinkingWave[sweepStep] = 5;
        thinkingWave[(sweepStep + 6) % 7] = 3;
        thinkingWave[(sweepStep + 1) % 7] = 3;
        setEqLevels(thinkingWave);
      }
    }, 85);

    return () => clearInterval(interval);
  }, [isAudioActive, isAiThinking]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* =========================================================================
          ACOUSTIC DIALOGUE BUBBLE (Floats up from Radio Speaker Grille)
         ========================================================================= */}
      <div className="w-full max-w-xl min-h-[90px] mb-4 flex flex-col justify-end">
        {latestAiMessage && scenario ? (
          <div
            className="relative self-end w-full sm:w-[92%] p-4 rounded-2xl bg-[#ffffff]/95 dark:bg-[#1f1a16]/95 border-2 border-amber-800/30 dark:border-amber-500/30 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25), 0 0 15px rgba(245, 158, 11, 0.1)",
            }}
          >
            {/* Audio Wave Sound Tag */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {isPlaying && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  )}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400">
                  {scenario.defaultRoles[userRole === "user" ? "ai" : "user"].titleEn} (AI)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onPlayAudio(latestAiMessage.id, latestAiMessage.textEn)}
                  className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                  title="Replay phrase"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleReveal(latestAiMessage.id)}
                  className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors cursor-pointer"
                  title="Toggle translation"
                >
                  {latestAiMessage.revealed ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Spoken Text (English & Optional Vietnamese) */}
            <div className="text-sm sm:text-base font-medium text-stone-900 dark:text-stone-100 leading-snug">
              {subtitlesEnabled || latestAiMessage.revealed ? (
                <span>{latestAiMessage.textEn}</span>
              ) : (
                <span className="italic text-stone-400 dark:text-stone-500 text-xs">
                  [Ear-First Mode: Listen to the audio or click eye icon to view text]
                </span>
              )}
            </div>

            {(latestAiMessage.revealed || subtitlesEnabled) && latestAiMessage.textVi && (
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic">
                {latestAiMessage.textVi}
              </div>
            )}

            {/* Pointer triangle connecting bubble to radio speaker grille */}
            <div className="absolute -bottom-2.5 right-16 w-5 h-5 bg-[#ffffff] dark:bg-[#1f1a16] border-r-2 border-b-2 border-amber-800/30 dark:border-amber-500/30 transform rotate-45" />
          </div>
        ) : (
          <div className="w-full text-center py-3 px-5 rounded-2xl bg-[#180e07] border-2 border-amber-950 text-amber-300/90 text-xs font-mono shadow-inner flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {scenario ? (
              <span>
                TAPE LOADED • Press orange <strong className="text-orange-400 font-bold uppercase">PLAY</strong> to start live dialogue
              </span>
            ) : (
              <span className="text-stone-400">
                DECK EMPTY • Select any cassette from the rack to insert into radio
              </span>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          ISOMETRIC 3D RETRO CASSETTE RADIO (Modeled on Reference Image 2)
         ========================================================================= */}
      <div className="relative w-full max-w-xl select-none">
        {/* Isometric Cast Shadow on Wooden Desk (Image 2 Cast Shadow) */}
        <div
          className="absolute -bottom-6 -right-6 w-[98%] h-[85%] rounded-3xl pointer-events-none transform -skew-x-12 opacity-40 dark:opacity-60"
          style={{
            background: "linear-gradient(135deg, rgba(20, 10, 5, 0.7) 0%, rgba(10, 5, 2, 0.2) 70%, transparent 100%)",
            filter: "blur(14px)",
          }}
        />

        {/* 3D Radio Main Body Chassis (Off-white / Retro Cream) */}
        <div
          className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-transform duration-300"
          style={{
            background: "linear-gradient(180deg, #f7f5f0 0%, #ebe7dc 100%)",
            borderTop: "3px solid #ffffff",
            borderLeft: "2px solid #ffffff",
            borderRight: "4px solid #cfcbc2",
            borderBottom: "6px solid #b8b3a7",
            boxShadow:
              "0 20px 40px -10px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -3px 6px rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* Main Grid: Left Cassette Bay + Right Speaker Grille */}
          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center">
            {/* ===================================================================
                LEFT SECTION: Tilted Cassette Bay Door with Mechanical Animation
               =================================================================== */}
            <div className="col-span-6 sm:col-span-7">
              {/* Tilted Angled Bay Door Frame */}
              <div
                className={`relative rounded-xl p-3 sm:p-4 transition-all duration-300 ${getDoorTransformClass()}`}
                style={{
                  background: "linear-gradient(135deg, #1f1d1a 0%, #121110 100%)",
                  boxShadow:
                    doorState === "opening" || doorState === "inserting"
                      ? "inset 0 6px 14px rgba(0, 0, 0, 0.95), 0 16px 28px -4px rgba(0,0,0,0.5)"
                      : "inset 0 4px 10px rgba(0, 0, 0, 0.8), inset 0 0 2px rgba(255, 255, 255, 0.15), 0 10px 20px -5px rgba(0,0,0,0.4)",
                  borderTop: "3px solid #ffffff",
                  borderLeft: "3px solid #ffffff",
                  borderRight: "4px solid #cfcbc2",
                  borderBottom: "5px solid #b8b3a7",
                  transform:
                    doorState === "opening"
                      ? "perspective(600px) rotateX(-24deg) translateY(-8px)"
                      : doorState === "inserting"
                      ? "perspective(600px) rotateX(-20deg) translateY(-6px)"
                      : "perspective(800px) rotateX(-4deg) translateY(-2px)",
                }}
              >
                {/* Cassette Tape Shell Inside Door or Empty Compartment */}
                {scenario ? (
                  <div
                    className={`relative rounded-lg p-3 sm:p-4 border transition-all ${
                      doorState === "inserting" ? "animate-cassette-drop-in" : ""
                    }`}
                    style={{
                      background: "linear-gradient(180deg, #2b2724 0%, #1e1b19 100%)",
                      borderColor: "#4a443e",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                    }}
                  >
                    {/* Spine Header Label on Tape */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-700/60">
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 truncate max-w-[140px]">
                        {scenario.titleEn}
                      </span>
                      <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-black/60 text-stone-300">
                        TAPE-{String(scenario.order || 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Tape Spool Window (Cute Double Hubs from Image 2) */}
                    <div
                      className="relative rounded-md py-2 px-3 sm:px-4 flex items-center justify-between"
                      style={{
                        background: "rgba(10, 10, 10, 0.85)",
                        border: "1.5px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "inset 0 2px 6px rgba(0,0,0,0.9)",
                      }}
                    >
                      {/* Left Spool Reel */}
                      <div
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-stone-400/60 bg-stone-800 flex items-center justify-center relative ${
                          isReelsSpinning ? "animate-spin" : ""
                        }`}
                        style={{ animationDuration: "2.4s" }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-inner" />
                        <span className="absolute top-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                        <span className="absolute bottom-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                        <span className="absolute left-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                        <span className="absolute right-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                      </div>

                      {/* Magnetic Tape Bridge Bar (Orange Line in Image 2) */}
                      <div className="flex-1 mx-2 sm:mx-3 h-1.5 rounded-full bg-amber-600 shadow-[0_0_6px_rgba(217,119,6,0.6)] relative overflow-hidden">
                        {isReelsSpinning && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                        )}
                      </div>

                      {/* Right Spool Reel */}
                      <div
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-stone-400/60 bg-stone-800 flex items-center justify-center relative ${
                          isReelsSpinning ? "animate-spin" : ""
                        }`}
                        style={{ animationDuration: "2.4s" }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-inner" />
                        <span className="absolute top-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                        <span className="absolute bottom-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                        <span className="absolute left-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                        <span className="absolute right-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EMPTY CASSETTE DECK CAVITY (When tape is ejected) */
                  <div
                    className="relative rounded-lg p-5 sm:p-7 border border-stone-800/80 flex flex-col items-center justify-center min-h-[92px]"
                    style={{
                      background: "linear-gradient(180deg, #141210 0%, #0d0c0a 100%)",
                      boxShadow: "inset 0 3px 8px rgba(0,0,0,0.9)",
                    }}
                  >
                    <div className="flex items-center justify-center gap-6 opacity-30">
                      <div className="w-6 h-6 rounded-full border border-stone-500 bg-stone-900" />
                      <div className="w-8 h-1 bg-stone-700" />
                      <div className="w-6 h-6 rounded-full border border-stone-500 bg-stone-900" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 mt-2">
                      READY FOR CASSETTE
                    </span>
                  </div>
                )}

                {/* Angled Clear Plastic Door Edge (Isometric visual cue from Image 2) */}
                <div className="absolute -top-1 -right-1 w-3 h-full bg-gradient-to-l from-white/30 to-transparent pointer-events-none rounded-r-xl" />
              </div>
            </div>

            {/* ===================================================================
                RIGHT SECTION: Perforated Speaker Grille & Speed Stepper Slider
               =================================================================== */}
            <div className="col-span-6 sm:col-span-5 flex items-center justify-between gap-3 pl-1 sm:pl-2">
              {/* Matrix Perforated Holes (7 cols x 6 rows) - Sound Wave Equalizer */}
              <div
                className="flex-1 grid grid-cols-7 gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl bg-stone-200/60 dark:bg-stone-800/40 border border-stone-300/80 dark:border-stone-700/60 shadow-inner"
                title={isAudioActive ? "Audio Equalizer (Active)" : "Speaker Grille"}
              >
                {Array.from({ length: 42 }).map((_, idx) => {
                  const col = idx % 7;
                  const row = Math.floor(idx / 7);
                  const levelFromBottom = 5 - row; // 0 at bottom, 5 at top
                  const isLit = isAudioActive || isAiThinking ? levelFromBottom < eqLevels[col] : false;
                  const isPeak = isLit && levelFromBottom >= 4;

                  return (
                    <div
                      key={idx}
                      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-xs transition-all duration-100 ${
                        isLit
                          ? isPeak
                            ? "bg-amber-400 dark:bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.95)]"
                            : "bg-amber-500 dark:bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.85)]"
                          : "bg-[#78736a] dark:bg-[#4a453f]"
                      }`}
                      style={{
                        boxShadow: isLit
                          ? undefined
                          : "inset 0 1px 2px rgba(0,0,0,0.6)",
                      }}
                    />
                  );
                })}
              </div>

              {/* SEPARATED SPEED CONTROL (+ / - WITH SLIDER KNOB) */}
              <div className="flex flex-col items-center">
                <div
                  className="w-6 sm:w-7 h-28 sm:h-32 rounded-full bg-stone-300 dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-700 relative flex flex-col justify-between items-center p-1 shadow-inner select-none"
                  title="Speech Speed Controls (+ / -)"
                >
                  {/* Top Button: [+] INCREASE SPEED */}
                  <button
                    type="button"
                    onClick={onIncreaseSpeed}
                    disabled={speechRate >= 1.5}
                    className="w-full py-0.5 text-xs font-mono font-bold text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-85 cursor-pointer flex items-center justify-center rounded-t-full z-20"
                    title="Increase speed (+)"
                    aria-label="Increase speed"
                  >
                    +
                  </button>

                  {/* Vertical Guide Track with Stepped Knob */}
                  <div className="flex-1 w-full relative flex items-center justify-center my-0.5 pointer-events-none">
                    {/* Track slot groove */}
                    <div className="absolute inset-y-1 w-1 bg-stone-400/60 dark:bg-stone-700/80 rounded-full" />
                    
                    {/* Mechanical Knob */}
                    <div
                      className="relative z-10 w-5 h-4.5 sm:w-5.5 sm:h-5 rounded-md bg-[#25221f] border border-stone-500 shadow-md transition-all duration-300 flex items-center justify-center text-[8px] font-mono text-amber-300 font-bold"
                      style={{
                        transform:
                          speechRate >= 1.5
                            ? "translateY(-24px)"
                            : speechRate === 1.2
                            ? "translateY(-8px)"
                            : speechRate === 1.0
                            ? "translateY(8px)"
                            : "translateY(24px)",
                      }}
                    >
                      {speechRate}x
                    </div>
                  </div>

                  {/* Bottom Button: [-] DECREASE SPEED */}
                  <button
                    type="button"
                    onClick={onDecreaseSpeed}
                    disabled={speechRate <= 0.8}
                    className="w-full py-0.5 text-xs font-mono font-bold text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-85 cursor-pointer flex items-center justify-center rounded-b-full z-20"
                    title="Decrease speed (-)"
                    aria-label="Decrease speed"
                  >
                    -
                  </button>
                </div>
                <span className="text-[8px] font-mono text-stone-500 mt-1 uppercase font-semibold">SPD</span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              BOTTOM ROW: 4 Mechanical Hardware Push Buttons (Image 2)
             =================================================================== */}
          <div className="mt-5 pt-4 border-t-2 border-stone-300/80 dark:border-stone-700/80 grid grid-cols-4 gap-2 sm:gap-3">
            {/* Button 1: EJECT */}
            <button
              type="button"
              onClick={onEject}
              disabled={!scenario}
              className="py-2.5 sm:py-3 px-2 rounded-xl font-mono text-xs font-bold text-stone-700 dark:text-stone-300 bg-gradient-to-b from-[#f2efea] to-[#dad6cc] hover:from-[#e8e4dc] hover:to-[#cecac0] disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-0.5 border-t border-l border-white border-b-3 border-r-2 border-stone-400 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group"
              title="Eject tape back to shelf"
            >
              <Eject className="w-3.5 h-3.5 group-hover:text-stone-900" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase">EJECT</span>
            </button>

            {/* Button 2: CC / SUBTITLES */}
            <button
              type="button"
              onClick={onToggleSubtitles}
              className={`py-2.5 sm:py-3 px-2 rounded-xl font-mono text-xs font-bold active:translate-y-0.5 border-t border-l border-white border-b-3 border-r-2 border-stone-400 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                subtitlesEnabled
                  ? "bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900"
                  : "bg-gradient-to-b from-[#f2efea] to-[#dad6cc] text-stone-700 dark:text-stone-300"
              }`}
              title="Toggle subtitles"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase">
                {subtitlesEnabled ? "CC ON" : "CC OFF"}
              </span>
            </button>

            {/* Button 3: STOP */}
            <button
              type="button"
              onClick={onStop}
              disabled={!scenario}
              className="py-2.5 sm:py-3 px-2 rounded-xl font-mono text-xs font-bold text-stone-700 dark:text-stone-300 bg-gradient-to-b from-[#f2efea] to-[#dad6cc] hover:from-[#e8e4dc] hover:to-[#cecac0] disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-0.5 border-t border-l border-white border-b-3 border-r-2 border-stone-400 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group"
              title="Stop audio & pause"
            >
              <Square className="w-3.5 h-3.5 fill-current text-stone-600 group-hover:text-red-600 transition-colors" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase">STOP</span>
            </button>

            {/* Button 4: PLAY / TALK (VIBRANT ORANGE ACCENT BUTTON AS IN IMAGE 2) */}
            <button
              type="button"
              onClick={onPlay}
              disabled={!scenario}
              className={`py-2.5 sm:py-3 px-2 rounded-xl font-mono text-xs font-bold active:translate-y-0.5 border-t border-l border-amber-300 border-b-4 border-r-2 border-amber-800 shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                isPlaying
                  ? "bg-gradient-to-b from-orange-600 to-orange-700 text-white ring-2 ring-orange-400"
                  : "bg-gradient-to-b from-[#f25a24] to-[#d64512] text-white hover:brightness-105"
              }`}
              title={scenario ? "Start live conversation with AI" : "Load a cassette first"}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase">
                {isPlaying ? "TALKING" : "PLAY"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          USER VOICE DOCK (Situated Directly Below the Radio on the Wooden Desk)
         ========================================================================= */}
      <div className="w-full max-w-xl mt-4">
        {scenario && (
          <AudioInputBar
            onSendMessage={onSendMessage}
            disabled={isAiThinking}
            suggestedHints={suggestedHints}
            isAiSpeaking={isPlaying || activeAudioId !== null}
            onStopAudio={onStopAudio}
            onListeningChange={onListeningChange}
            isInline={true}
          />
        )}
      </div>
    </div>
  );
};
