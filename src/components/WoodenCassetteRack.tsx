"use client";

import React, { useState, useMemo } from "react";
import { Check, ChevronLeft, ChevronRight, Disc, Layers, Sparkles } from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";

interface WoodenCassetteRackProps {
  topics: Topic[];
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  activeScenario: Scenario | null;
  onSelectScenario: (scenario: Scenario) => void;
  completedScenarioIds?: string[];
  pullingScenarioId?: string | null;
  returningScenarioId?: string | null;
}

// Vintage cassette spine color palette inspired by authentic 70s-80s tape collections
const SPINE_THEMES = [
  { bg: "bg-amber-600 text-stone-950", border: "border-amber-700", accent: "bg-stone-950 text-amber-300" },
  { bg: "bg-red-700 text-white", border: "border-red-800", accent: "bg-white text-red-900" },
  { bg: "bg-sky-800 text-white", border: "border-sky-900", accent: "bg-sky-200 text-sky-950" },
  { bg: "bg-emerald-700 text-white", border: "border-emerald-800", accent: "bg-emerald-200 text-emerald-950" },
  { bg: "bg-stone-800 text-stone-100", border: "border-stone-900", accent: "bg-amber-500 text-stone-950" },
  { bg: "bg-orange-600 text-white", border: "border-orange-700", accent: "bg-white text-orange-950" },
  { bg: "bg-yellow-500 text-stone-950", border: "border-yellow-600", accent: "bg-stone-900 text-yellow-300" },
  { bg: "bg-teal-700 text-white", border: "border-teal-800", accent: "bg-teal-100 text-teal-950" },
];

export const WoodenCassetteRack: React.FC<WoodenCassetteRackProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
  activeScenario,
  onSelectScenario,
  completedScenarioIds = [],
  pullingScenarioId = null,
  returningScenarioId = null,
}) => {
  // We display 3 topic columns side-by-side in the wooden rack (like the 3-4 column rack in Image 1)
  const [columnOffset, setColumnOffset] = useState<number>(() => {
    const idx = topics.findIndex((t) => t.id === selectedTopic.id);
    return Math.max(0, Math.min(idx, topics.length - 3));
  });

  const visibleTopics = useMemo(() => {
    return topics.slice(columnOffset, columnOffset + 3);
  }, [topics, columnOffset]);

  // Max 7 tapes per bay viewport (User directive: "tối đa là 7 băng, nếu nhiều hơn thì cuộn")
  const MAX_VISIBLE_TAPES = 7;
  const [bayOffsets, setBayOffsets] = useState<Record<string, number>>({});

  // 1 lần lên xuống được 7 hàng luôn (User directive: "1 lần lên xuống được 7 hàng luôn cho đỡ tốn công")
  const handleBayPage = (topicId: string, direction: number) => {
    setBayOffsets((prev) => {
      const current = prev[topicId] || 0;
      const targetTopic = topics.find((t) => t.id === topicId);
      if (!targetTopic) return prev;
      const maxOffset = Math.max(0, targetTopic.scenarios.length - MAX_VISIBLE_TAPES);
      let next = current + direction * MAX_VISIBLE_TAPES;
      if (next < 0) next = 0;
      if (next > maxOffset) next = maxOffset;
      return { ...prev, [topicId]: next };
    });
  };

  const handlePrevColumns = () => {
    setColumnOffset((prev) => Math.max(0, prev - 3));
  };

  const handleNextColumns = () => {
    setColumnOffset((prev) => Math.min(topics.length - 3, prev + 3));
  };

  return (
    <div className="relative select-none w-full">
      {/* Wooden Rack Outer Frame - Rustic Vintage Wood Texture */}
      <div
        className="relative rounded-2xl p-3 sm:p-5 shadow-2xl transition-all"
        style={{
          background: "linear-gradient(135deg, #422918 0%, #2e1b0e 45%, #231409 100%)",
          boxShadow:
            "inset 0 2px 4px rgba(255, 230, 200, 0.15), inset 0 -3px 6px rgba(0, 0, 0, 0.8), 0 15px 35px -5px rgba(0, 0, 0, 0.6), 0 2px 5px rgba(0,0,0,0.4)",
          border: "4px solid #1c0e06",
        }}
      >
        {/* Wood grain highlight line */}
        <div className="absolute top-1 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />

        {/* Rack Header & Column Pagination */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-950/60 text-amber-200/90">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase text-amber-300">
              CASSETTE ARCHIVE RACK
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handlePrevColumns}
              disabled={columnOffset === 0}
              className="p-1 sm:px-2 sm:py-1 rounded bg-[#1c0e06] hover:bg-[#32190c] text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed border border-amber-900/40 transition-colors flex items-center gap-1 cursor-pointer"
              title="Previous categories"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[10px]">PREV</span>
            </button>
            <span className="font-mono text-[10px] sm:text-xs text-amber-400/80">
              {columnOffset + 1}–{Math.min(topics.length, columnOffset + 3)} / {topics.length}
            </span>
            <button
              type="button"
              onClick={handleNextColumns}
              disabled={columnOffset >= topics.length - 3}
              className="p-1 sm:px-2 sm:py-1 rounded bg-[#1c0e06] hover:bg-[#32190c] text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed border border-amber-900/40 transition-colors flex items-center gap-1 cursor-pointer"
              title="Next categories"
            >
              <span className="hidden sm:inline font-mono text-[10px]">NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-Column Wooden Compartment Grid (As in Reference Image 1) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {visibleTopics.map((topic, colIdx) => {
            const isTopicActive = selectedTopic.id === topic.id;
            const bayOffset = bayOffsets[topic.id] || 0;
            const visibleScenarios = topic.scenarios.slice(bayOffset, bayOffset + MAX_VISIBLE_TAPES);
            const hasMoreTapes = topic.scenarios.length > MAX_VISIBLE_TAPES;

            return (
              <div
                key={topic.id}
                onWheel={(e) => {
                  if (hasMoreTapes) {
                    if (e.deltaY > 0) handleBayPage(topic.id, 1);
                    else if (e.deltaY < 0) handleBayPage(topic.id, -1);
                  }
                }}
                className={`relative rounded-xl p-2 sm:p-2.5 flex flex-col transition-all duration-300 ${
                  isTopicActive
                    ? "ring-1 ring-amber-500/50 bg-[#1e1007]/90"
                    : "bg-[#180d06]/85 hover:bg-[#1e1007]/80"
                }`}
                style={{
                  boxShadow: "inset 0 3px 8px rgba(0, 0, 0, 0.7), inset 0 0 2px rgba(255, 255, 255, 0.05)",
                  border: "2px solid #2a150a",
                }}
              >
                {/* Topic Brass Label Plate (Fixed 62px height, synchronized across all bays) */}
                <div
                  onClick={() => onSelectTopic(topic)}
                  className="w-full h-[62px] mb-2.5 p-2 rounded-lg bg-gradient-to-b from-[#3a2010] to-[#251308] border border-amber-800/50 transition-all shadow-xs flex items-center justify-between cursor-pointer group"
                  style={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Left Column: Category Index, Tape Count & English Title */}
                  <div className="flex-1 min-w-0 pr-2 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono tracking-wider text-amber-400 font-bold uppercase whitespace-nowrap">
                        BAY 0{columnOffset + colIdx + 1}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-amber-400/90 bg-[#140803] px-1.5 py-0.5 rounded border border-amber-950 whitespace-nowrap">
                        {topic.scenarios.length} TAPES
                      </span>
                    </div>

                    <div className="text-[11px] sm:text-xs font-bold text-amber-200 truncate leading-tight group-hover:text-amber-100 transition-colors">
                      {topic.titleEn}
                    </div>
                  </div>

                  {/* Right Column: Vertical Page Stepper (Rendered cleanly when > 7 tapes) */}
                  {hasMoreTapes && (
                    <div
                      className="flex flex-col items-center justify-between h-full py-0.5 px-1 bg-[#140803] rounded border border-amber-950/80 shadow-xs flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleBayPage(topic.id, -1)}
                        disabled={bayOffset === 0}
                        className="text-amber-400 hover:text-amber-200 disabled:opacity-20 text-[8px] leading-none active:scale-90 cursor-pointer p-0.5"
                        title="Page up (▲)"
                        aria-label="Previous 7 tapes"
                      >
                        ▲
                      </button>
                      <span className="text-[7px] font-mono font-bold text-amber-300 leading-none">
                        {Math.floor(bayOffset / MAX_VISIBLE_TAPES) + 1}/{Math.ceil(topic.scenarios.length / MAX_VISIBLE_TAPES)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleBayPage(topic.id, 1)}
                        disabled={bayOffset + MAX_VISIBLE_TAPES >= topic.scenarios.length}
                        className="text-amber-400 hover:text-amber-200 disabled:opacity-20 text-[8px] leading-none active:scale-90 cursor-pointer p-0.5"
                        title="Page down (▼)"
                        aria-label="Next 7 tapes"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>

                {/* Horizontal Stack of Cassette Tapes with Spine Labels (Max 7 visible at a time) */}
                <div className="flex-1 flex flex-col gap-1.5">
                  {visibleScenarios.map((scenario, scIdx) => {
                    const actualIdx = bayOffset + scIdx;
                    const isLoadedInRadio = activeScenario?.id === scenario.id;
                    const isPulling = pullingScenarioId === scenario.id;
                    const isReturning = returningScenarioId === scenario.id;
                    const isCompleted = completedScenarioIds.includes(scenario.id);
                    const theme = SPINE_THEMES[actualIdx % SPINE_THEMES.length];

                    // If tape is loaded in radio and not currently returning, slot is EMPTY
                    const isEmptySlot = isLoadedInRadio && !isReturning && !isPulling;

                    return (
                      <div
                        key={scenario.id}
                        className="relative group min-h-[34px] sm:min-h-[38px] flex items-center"
                      >
                        {/* Always present: Empty Shelf Slot Groove / Track Cavity */}
                        <div
                          className="absolute inset-0 rounded bg-[#0b0502] border border-amber-950/40 flex items-center justify-between px-2.5 overflow-hidden"
                          style={{
                            boxShadow: "inset 0 3px 8px rgba(0,0,0,0.95), inset 0 0 2px rgba(255,255,255,0.03)",
                          }}
                        >
                          {/* Inner wooden guide rails */}
                          <div className="w-full flex items-center justify-between opacity-30 pointer-events-none">
                            <span className="text-[8px] font-mono text-amber-600/60">
                              SLOT {String(actualIdx + 1).padStart(2, "0")}
                            </span>
                            <div className="w-12 h-1 rounded-full bg-amber-950 border-b border-amber-800/20" />
                            <span className="text-[8px] font-mono text-amber-600/40">EMPTY</span>
                          </div>
                        </div>

                        {/* Cassette Spine Component - Rendered when tape is present, pulling out, or returning */}
                        {!isEmptySlot ? (
                          <div
                            onClick={() => {
                              if (isPulling) return;
                              onSelectTopic(topic);
                              onSelectScenario(scenario);
                            }}
                            className={`relative z-10 w-full flex items-center justify-between px-2 sm:px-2.5 py-1.5 sm:py-2 rounded border cursor-pointer transition-all duration-200 ${
                              isPulling
                                ? "animate-tape-pull-out pointer-events-none"
                                : isReturning
                                ? "animate-tape-slide-in"
                                : "hover:translate-x-2.5 hover:shadow-lg"
                            } ${theme.bg} ${theme.border}`}
                            style={{
                              boxShadow: "0 3px 8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                            }}
                          >
                            {/* Cassette Code Pill */}
                            <div className="flex items-center gap-1.5 min-w-0 pr-1">
                              <span
                                className={`text-[9px] font-mono font-bold px-1 py-0.5 rounded ${theme.accent}`}
                              >
                                {String(actualIdx + 1).padStart(2, "0")}
                              </span>
                              <span className="text-[11px] sm:text-xs font-semibold tracking-tight truncate leading-tight">
                                {scenario.titleEn}
                              </span>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {isCompleted ? (
                                <span
                                  className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                                  title="Completed scenario"
                                >
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-black/30 group-hover:bg-white/70 transition-colors" />
                              )}
                            </div>
                          </div>
                        ) : (
                          /* EMPTY SLOT INTERACTION: Shows tape loaded in radio */
                          <div
                            className="relative z-10 w-full h-full flex items-center justify-between px-2.5 py-1.5 rounded text-amber-400/40 font-mono text-[9px] pointer-events-none select-none"
                          >
                            <span className="italic flex items-center gap-1.5 truncate max-w-[140px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40 flex-shrink-0" />
                              <span className="truncate">{scenario.titleEn}</span>
                            </span>
                            <span className="uppercase text-[8px] tracking-wider font-bold bg-black/60 px-1.5 py-0.5 rounded border border-amber-950/60 text-amber-400/70 flex-shrink-0">
                              IN RADIO
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Filler Empty Slots if a bay has fewer than 7 tapes (keeps all 3 bays at uniform 7-slot height) */}
                  {Array.from({ length: Math.max(0, MAX_VISIBLE_TAPES - visibleScenarios.length) }).map((_, fIdx) => (
                    <div
                      key={`empty-filler-${fIdx}`}
                      className="relative min-h-[34px] sm:min-h-[38px] rounded bg-[#0b0502]/60 border border-amber-950/20 flex items-center justify-between px-2.5 opacity-25 pointer-events-none"
                    >
                      <span className="text-[8px] font-mono text-amber-700/40">
                        SLOT {String(visibleScenarios.length + fIdx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[8px] font-mono text-amber-700/30 uppercase">EMPTY</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ambient Cassette Resting on the Table (Authentic Detail from Image 1) */}
        <div className="mt-4 pt-3 border-t border-amber-950/60 flex items-center justify-between text-xs text-amber-300/70">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider">
              ✦ Click any cassette on the shelf to extract & load into radio
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-amber-400/60">
            <span>TABLETOP ARCHIVE</span>
            <span>•</span>
            <span>1984 VINTAGE SERIES</span>
          </div>
        </div>
      </div>
    </div>
  );
};
