"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  SkipForward,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";
import { speakText, stopSpeaking } from "@/utils/speech";

interface CassetteDeckProps {
  topic: Topic;
  scenario: Scenario;
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  onStartScenario: (topic: Topic, scenario: Scenario, role: "user" | "ai") => void;
  learnerRole: "user" | "ai";
  onToggleLearnerRole: () => void;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({
  topic,
  scenario,
  scenarios,
  onSelectScenario,
  onStartScenario,
  learnerRole,
  onToggleLearnerRole,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSlotting, setIsSlotting] = useState<boolean>(false);
  const [tapeCounter, setTapeCounter] = useState<number>(104);
  const counterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop audio and trigger slot animation on scenario change
  useEffect(() => {
    stopSpeaking();
    setIsPlaying(false);
    setIsSlotting(true);
    const timer = setTimeout(() => setIsSlotting(false), 450);
    return () => clearTimeout(timer);
  }, [scenario.id]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (counterIntervalRef.current) clearInterval(counterIntervalRef.current);
    };
  }, []);

  // Update counter while playing
  useEffect(() => {
    if (isPlaying) {
      counterIntervalRef.current = setInterval(() => {
        setTapeCounter((prev) => (prev >= 999 ? 100 : prev + 1));
      }, 900);
    } else {
      if (counterIntervalRef.current) clearInterval(counterIntervalRef.current);
    }
    return () => {
      if (counterIntervalRef.current) clearInterval(counterIntervalRef.current);
    };
  }, [isPlaying]);

  const handlePlayAudio = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    stopSpeaking();
    const textToSpeak = scenario.initialMessageEn || scenario.titleEn;
    setIsPlaying(true);

    speakText(textToSpeak, 1.0, () => {
      setIsPlaying(false);
    });
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setIsPlaying(false);
  };

  const handleNextTape = () => {
    stopSpeaking();
    setIsPlaying(false);
    const currentIndex = scenarios.findIndex((s) => s.id === scenario.id);
    const nextIndex = (currentIndex + 1) % scenarios.length;
    onSelectScenario(scenarios[nextIndex]);
  };

  const formattedCounter = String(tapeCounter).padStart(3, "0");

  return (
    <div className="w-full rounded-3xl p-5 sm:p-7 bg-[#ffffff] dark:bg-[#15120f] border border-stone-200 dark:border-amber-950/40 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Decorative Corner Hardware Screws */}
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700/60 border border-stone-400 dark:border-stone-600/60" />
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700/60 border border-stone-400 dark:border-stone-600/60" />
      <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700/60 border border-stone-400 dark:border-stone-600/60" />
      <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700/60 border border-stone-400 dark:border-stone-600/60" />

      {/* Top Deck Status Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200 dark:border-stone-800/80 text-xs">
        <div className="flex items-center gap-2">
          {/* Amber Indicator Lamp */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isPlaying
                  ? "bg-amber-400 amber-led-active"
                  : "bg-stone-300 dark:bg-stone-800"
              }`}
            />
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-300">
              {isPlaying ? "Tape Playing" : "Standby"}
            </span>
          </div>
        </div>

        {/* Brand & Digital Counter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            Voice Archive Mk-II
          </span>
          <div className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-xs font-bold tracking-widest text-amber-700 dark:text-amber-400">
            {formattedCounter}
          </div>
        </div>
      </div>

      {/* Recessed Cassette Tray Well */}
      <div className="p-3 sm:p-4 rounded-2xl bg-stone-100 dark:bg-[#0a0807] border border-stone-200 dark:border-stone-900 shadow-inner">
        {/* The Cassette Tape Body (Animated on Slotting) */}
        <div
          className={`relative rounded-xl p-3 sm:p-4 bg-stone-200 dark:bg-[#1a1612] border-2 border-stone-300 dark:border-[#2b241d] shadow-md transition-all duration-300 ${
            isSlotting ? "animate-tape-slot" : ""
          }`}
        >
          {/* Top Label Foil Strip */}
          <div className="rounded-lg p-2.5 sm:p-3 bg-amber-50/90 dark:bg-[#251f19] border border-amber-200/80 dark:border-amber-900/40 space-y-1 mb-3">
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
          <div className="relative h-20 sm:h-24 rounded-lg bg-stone-300/60 dark:bg-[#0f0c0a] border border-stone-400/60 dark:border-stone-800/80 flex items-center justify-between px-6 sm:px-10 overflow-hidden shadow-inner">
            {/* Magnetic Tape Ribbon Strip across middle */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-8 bg-stone-800/90 dark:bg-[#140f0c] border-y border-stone-700/50 dark:border-stone-900 z-0 opacity-80" />

            {/* Left Spool Reel */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 flex items-center justify-center shadow-md ${
                  isPlaying ? "animate-reel-spin" : ""
                }`}
              >
                {/* 6-Tooth Cassette Gear Spokes */}
                <svg className="w-9 h-9 text-stone-400 dark:text-stone-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1 1 0 0 1 1 1v2.07A8.001 8.001 0 0 1 18.93 11H21a1 1 0 1 1 0 2h-2.07A8.001 8.001 0 0 1 13 18.93V21a1 1 0 1 1-2 0v-2.07A8.001 8.001 0 0 1 5.07 13H3a1 1 0 1 1 0-2h2.07A8.001 8.001 0 0 1 11 5.07V3a1 1 0 0 1 1-1zm0 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </div>
            </div>

            {/* Centered Tape Progress Meter */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPlaying
                        ? "bg-amber-500 animate-pulse"
                        : "bg-stone-400 dark:bg-stone-700"
                    }`}
                    style={{
                      height: isPlaying ? `${8 + (i % 3) * 6}px` : "6px",
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
                Magnetic Tape
              </span>
            </div>

            {/* Right Spool Reel */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 flex items-center justify-center shadow-md ${
                  isPlaying ? "animate-reel-spin" : ""
                }`}
              >
                <svg className="w-9 h-9 text-stone-400 dark:text-stone-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1 1 0 0 1 1 1v2.07A8.001 8.001 0 0 1 18.93 11H21a1 1 0 1 1 0 2h-2.07A8.001 8.001 0 0 1 13 18.93V21a1 1 0 1 1-2 0v-2.07A8.001 8.001 0 0 1 5.07 13H3a1 1 0 1 1 0-2h2.07A8.001 8.001 0 0 1 11 5.07V3a1 1 0 0 1 1-1zm0 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sample Dialogue Snippet Preview */}
          <div className="mt-3 px-3 py-2 rounded-lg bg-stone-100/90 dark:bg-[#130f0c] border border-stone-300/80 dark:border-stone-800/60 text-xs">
            <span className="font-semibold text-amber-700 dark:text-amber-500 block mb-0.5">
              Opening line ({scenario.defaultRoles.ai.name}):
            </span>
            <p className="italic text-stone-700 dark:text-stone-300 line-clamp-2">
              "{scenario.initialMessageEn}"
            </p>
          </div>
        </div>
      </div>

      {/* Mechanical Hardware Buttons Control Rack */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3">
        {/* Physical Transport Buttons */}
        <div className="flex items-center gap-2">
          {/* PLAY Button */}
          <button
            type="button"
            onClick={handlePlayAudio}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer btn-mech-amber ${
              isPlaying
                ? "bg-amber-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold"
            }`}
            title="Play sample native audio"
            aria-label="Play audio"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isPlaying ? "animate-pulse" : ""}`} />
            <span>{isPlaying ? "Playing" : "Play"}</span>
          </button>

          {/* STOP Button */}
          <button
            type="button"
            onClick={handleStopAudio}
            disabled={!isPlaying}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer btn-mech-metal bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Stop playback"
            aria-label="Stop audio"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>

          {/* NEXT TAPE Button */}
          <button
            type="button"
            onClick={handleNextTape}
            className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer btn-mech-metal bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/70 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
            title="Eject & load next tape"
            aria-label="Next scenario"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Next</span>
          </button>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 dark:text-stone-400 text-[11px]">
            Role:
          </span>
          <button
            type="button"
            onClick={onToggleLearnerRole}
            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 font-semibold text-stone-800 dark:text-stone-200 hover:border-amber-500 transition-colors cursor-pointer"
            title="Switch learner role"
          >
            {learnerRole === "user"
              ? scenario.defaultRoles.user.name
              : scenario.defaultRoles.ai.name}
          </button>
        </div>
      </div>

      {/* Main Studio Launch CTA Bar */}
      <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800/80">
        <button
          type="button"
          onClick={() => onStartScenario(topic, scenario, learnerRole)}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-between shadow-lg shadow-amber-500/20 cursor-pointer press-tactile group"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4 text-white" />
            </span>
            <span>Enter Practice Studio</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm font-bold opacity-90 group-hover:translate-x-1 transition-transform text-stone-950">
            <span>Speak Now</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </div>
        </button>
      </div>
    </div>
  );
};
