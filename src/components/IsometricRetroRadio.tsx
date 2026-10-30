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
import {
  playRadioPlayButtonSound,
  playRadioStopButtonSound,
  playRadioTactileButtonSound,
} from "@/utils/retroAudioFx";

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
  isDialoguePanelActive?: boolean;
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
  isDialoguePanelActive = false,
}) => {
  // Get latest AI message to float from the speaker grille
  const latestAiMessage = [...messages].reverse().find((m) => m.sender === "ai");
  const isReelsSpinning = isPlaying || activeAudioId !== null || isAiThinking;

  // Door tilt styling based on doorState
  const getDoorTransformClass = () => {
    switch (doorState) {
      case "opening":
        return "animate-radio-door-open";
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
          RADIO DECK STATUS DISPLAY: Clean Retro Amber LED Status Bar
         ========================================================================= */}
      <div className="w-full max-w-xl mb-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#140a04] border border-amber-950/80 font-mono text-xs shadow-inner">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isPlaying
                ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                : scenario
                ? "bg-amber-500"
                : "bg-stone-700"
            }`}
          />
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider truncate">
            {isPlaying
              ? "RADIO BROADCAST • REELS ACTIVE"
              : scenario
              ? `TAPE LOADED: ${scenario.titleEn}`
              : "DECK CAVITY EMPTY • SELECT CASSETTE"}
          </span>
        </div>
        <span className="text-[10px] text-amber-500/70 uppercase font-bold flex-shrink-0 ml-2">
          FM 98.4 MHZ
        </span>
      </div>

      {/* =========================================================================
          ISOMETRIC 3D RETRO CASSETTE RADIO (Modeled on Reference Image 2)
         ========================================================================= */}
      <div className="relative w-full max-w-[490px] select-none">
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
          className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-transform duration-300"
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
          {/* Main Hardware Deck: [Cassette Bay Door] <gap> [Sound Wave Equalizer] <gap> [Speed Stepper Slider] */}
          {/* Horizontally aligned with exact equal spacing and fixed aspect ratio scaling */}
          <div className="flex items-center justify-between gap-3 sm:gap-4.5 w-full">
            {/* ===================================================================
                1. CASSETTE BAY DOOR (Proportional Aspect ~1.55/1, Fixed Height & Spindles)
               =================================================================== */}
            <div
              className={`relative rounded-xl p-2.5 sm:p-3 flex-1 max-w-[220px] sm:max-w-[240px] h-[132px] sm:h-[144px] flex flex-col justify-between ${getDoorTransformClass()}`}
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
                  doorState === "opening" || doorState === "closing"
                    ? undefined
                    : doorState === "inserting"
                    ? "perspective(600px) rotateX(-24deg) translateY(-8px)"
                    : "perspective(800px) rotateX(-4deg) translateY(-2px)",
                transformStyle: "preserve-3d",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            >
              {/* Cassette Tape Shell Inside Door or Empty Compartment */}
              {scenario ? (
                <div
                  className={`relative rounded-lg p-2.5 sm:p-3 border h-full w-full flex flex-col justify-between ${
                    doorState === "inserting" ? "animate-cassette-drop-in" : ""
                  }`}
                  style={{
                    background: "linear-gradient(180deg, #2b2724 0%, #1e1b19 100%)",
                    borderColor: "#4a443e",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Spine Header Label on Tape */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-700/60">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 truncate max-w-[125px] sm:max-w-[140px]">
                      {scenario.titleEn}
                    </span>
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-black/60 text-stone-300">
                      TAPE-{String(scenario.order || 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Tape Spool Window (Cute Double Hubs from Reference Image) */}
                  <div
                    className="relative rounded-md py-1.5 px-2.5 sm:px-3 flex items-center justify-between"
                    style={{
                      background: "rgba(10, 10, 10, 0.85)",
                      border: "1.5px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.9)",
                    }}
                  >
                    {/* Left Spool Reel (Always circular: aspect-square flex-shrink-0) */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 aspect-square flex-shrink-0 rounded-full border-2 border-stone-400/60 bg-stone-800 flex items-center justify-center relative ${
                        isReelsSpinning ? "animate-spin" : ""
                      }`}
                      style={{ animationDuration: "2.4s" }}
                    >
                      <div className="w-2.5 h-2.5 aspect-square rounded-full bg-white/90 shadow-inner" />
                      <span className="absolute top-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                      <span className="absolute bottom-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                      <span className="absolute left-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                      <span className="absolute right-0.5 w-1 h-1 bg-stone-300 rounded-xs" />
                    </div>

                    {/* Magnetic Tape Bridge Bar */}
                    <div className="flex-1 mx-2 sm:mx-2.5 h-1.5 rounded-full bg-amber-600 shadow-[0_0_6px_rgba(217,119,6,0.6)] relative overflow-hidden">
                      {isReelsSpinning && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                      )}
                    </div>

                    {/* Right Spool Reel (Always circular: aspect-square flex-shrink-0) */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 aspect-square flex-shrink-0 rounded-full border-2 border-stone-400/60 bg-stone-800 flex items-center justify-center relative ${
                        isReelsSpinning ? "animate-spin" : ""
                      }`}
                      style={{ animationDuration: "2.4s" }}
                    >
                      <div className="w-2.5 h-2.5 aspect-square rounded-full bg-white/90 shadow-inner" />
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
                  className="relative rounded-lg p-3 sm:p-4 border border-stone-800/80 flex flex-col items-center justify-between h-full w-full"
                  style={{
                    background: "linear-gradient(180deg, #141210 0%, #0d0c0a 100%)",
                    boxShadow: "inset 0 3px 8px rgba(0,0,0,0.9)",
                  }}
                >
                  <div className="flex items-center justify-center gap-5 opacity-30 my-auto">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 aspect-square rounded-full border border-stone-500 bg-stone-900 flex-shrink-0" />
                    <div className="w-8 sm:w-10 h-1 bg-stone-700" />
                    <div className="w-6 h-6 sm:w-7 sm:h-7 aspect-square rounded-full border border-stone-500 bg-stone-900 flex-shrink-0" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 mt-auto">
                    READY FOR CASSETTE
                  </span>
                </div>
              )}

              {/* Angled Clear Plastic Door Edge */}
              <div className="absolute -top-1 -right-1 w-3 h-full bg-gradient-to-l from-white/30 to-transparent pointer-events-none rounded-r-xl" />
            </div>

            {/* ===================================================================
                2. SOUND WAVE EQUALIZER ("Ô VUÔNG PHÁT SOUND WAVE" - Fixed Aspect Square)
               =================================================================== */}
            <div
              className="w-[132px] h-[132px] sm:w-[144px] sm:h-[144px] aspect-square flex-shrink-0 rounded-xl bg-stone-200/60 dark:bg-stone-800/40 border border-stone-300/80 dark:border-stone-700/60 shadow-inner grid grid-cols-7 gap-1 sm:gap-1.5 p-2 sm:p-2.5 place-content-center"
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
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 aspect-square flex-shrink-0 rounded-xs transition-all duration-100 ${
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

            {/* ===================================================================
                3. SEPARATED SPEED CONTROL (+ / - WITH STEPPER SLIDER & SPD LABEL)
               =================================================================== */}
            <div className="h-[132px] sm:h-[144px] w-7 sm:w-8 flex-shrink-0 flex flex-col items-center justify-between">
              <div
                className="w-full flex-1 rounded-full bg-stone-300 dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-700 relative flex flex-col justify-between items-center p-1 shadow-inner select-none"
                title="Speech Speed Controls (+ / -)"
              >
                {/* Top Button: [+] INCREASE SPEED */}
                <button
                  type="button"
                  onClick={() => {
                    playRadioTactileButtonSound();
                    onIncreaseSpeed();
                  }}
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
                    className="relative z-10 w-5 h-4 sm:w-5.5 sm:h-4.5 rounded-md bg-[#25221f] border border-stone-500 shadow-md transition-all duration-300 flex items-center justify-center text-[8px] font-mono text-amber-300 font-bold"
                    style={{
                      transform:
                        speechRate >= 1.5
                          ? "translateY(-22px)"
                          : speechRate === 1.2
                          ? "translateY(-7px)"
                          : speechRate === 1.0
                          ? "translateY(7px)"
                          : "translateY(22px)",
                    }}
                  >
                    {speechRate}x
                  </div>
                </div>

                {/* Bottom Button: [-] DECREASE SPEED */}
                <button
                  type="button"
                  onClick={() => {
                    playRadioTactileButtonSound();
                    onDecreaseSpeed();
                  }}
                  disabled={speechRate <= 0.8}
                  className="w-full py-0.5 text-xs font-mono font-bold text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-85 cursor-pointer flex items-center justify-center rounded-b-full z-20"
                  title="Decrease speed (-)"
                  aria-label="Decrease speed"
                >
                  -
                </button>
              </div>
              <span className="text-[8px] font-mono text-stone-500 mt-1 uppercase font-semibold leading-none">SPD</span>
            </div>
          </div>

          {/* ===================================================================
              BOTTOM ROW: 4 Mechanical Hardware Push Buttons (Image 2)
             =================================================================== */}
          <div className="mt-5 pt-4 border-t-2 border-stone-300/80 dark:border-stone-700/80 grid grid-cols-4 gap-2 sm:gap-3">
            {/* Button 1: EJECT - Appears dim/sunken on idle, surface illuminates on hover without text brightening */}
            <button
              type="button"
              onClick={onEject}
              disabled={!scenario}
              className="py-2.5 sm:py-3 px-2 rounded-xl font-mono text-xs font-bold active:translate-y-0.5 border-t border-l border-white/40 border-b-2 border-r border-stone-400/40 bg-[#dedad0]/65 dark:bg-[#1a1714] hover:bg-gradient-to-b hover:from-[#ffffff] hover:to-[#ede9df] dark:hover:from-[#2a2621] dark:hover:to-[#1e1b18] hover:border-white hover:border-b-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group disabled:opacity-30 disabled:cursor-not-allowed select-none"
              title="Eject tape back to shelf"
            >
              <Eject className="w-3.5 h-3.5 text-stone-400/80 group-hover:text-stone-500 dark:text-stone-500 dark:group-hover:text-stone-400 transition-colors" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-stone-400/80 group-hover:text-stone-500 dark:text-stone-500 dark:group-hover:text-stone-400 transition-colors">
                EJECT
              </span>
            </button>

            {/* Button 2: CC / SUBTITLES - Appears dim/sunken on idle, surface illuminates on hover without text brightening */}
            <button
              type="button"
              onClick={() => {
                playRadioTactileButtonSound();
                onToggleSubtitles();
              }}
              className={`py-2.5 sm:py-3 px-2 rounded-xl font-mono text-xs font-bold active:translate-y-0.5 border-t border-l border-white/40 border-b-2 border-r border-stone-400/40 bg-[#dedad0]/65 dark:bg-[#1a1714] hover:bg-gradient-to-b hover:from-[#ffffff] hover:to-[#ede9df] dark:hover:from-[#2a2621] dark:hover:to-[#1e1b18] hover:border-white hover:border-b-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group select-none ${
                subtitlesEnabled ? "ring-1 ring-amber-500/50" : ""
              }`}
              title="Toggle subtitles"
            >
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-stone-400/80 group-hover:text-stone-500 dark:text-stone-500 dark:group-hover:text-stone-400 transition-colors" />
                {subtitlesEnabled && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 inline-block" />
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-stone-400/80 group-hover:text-stone-500 dark:text-stone-500 dark:group-hover:text-stone-400 transition-colors">
                {subtitlesEnabled ? "CC ON" : "CC OFF"}
              </span>
            </button>

            {/* Button 3: STOP - Appears dim/sunken on idle, surface illuminates on hover without text brightening */}
            <button
              type="button"
              onClick={() => {
                playRadioStopButtonSound();
                onStop();
              }}
              disabled={!scenario}
              className="py-2.5 sm:py-3 px-2 rounded-xl font-mono text-xs font-bold active:translate-y-0.5 border-t border-l border-white/40 border-b-2 border-r border-stone-400/40 bg-[#dedad0]/65 dark:bg-[#1a1714] hover:bg-gradient-to-b hover:from-[#ffffff] hover:to-[#ede9df] dark:hover:from-[#2a2621] dark:hover:to-[#1e1b18] hover:border-white hover:border-b-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group disabled:opacity-30 disabled:cursor-not-allowed select-none"
              title="Stop audio & pause"
            >
              <Square className="w-3.5 h-3.5 fill-current text-stone-400/80 group-hover:text-stone-500 dark:text-stone-500 dark:group-hover:text-stone-400 transition-colors" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-stone-400/80 group-hover:text-stone-500 dark:text-stone-500 dark:group-hover:text-stone-400 transition-colors">
                STOP
              </span>
            </button>

            {/* Button 4: PLAY / TALK (VIBRANT ORANGE ACCENT BUTTON AS IN IMAGE 2) */}
            <button
              type="button"
              onClick={() => {
                playRadioPlayButtonSound();
                onPlay();
              }}
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
    </div>
  );
};
