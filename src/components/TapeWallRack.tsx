"use client";

import React, { useState } from "react";
import {
  Check,
  Play,
  Volume2,
  ChevronRight,
  Disc,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";
import { TopicIcon, RoleIcon } from "./TopicIcons";
import { speakText, stopSpeaking } from "@/utils/speech";

interface TapeWallRackProps {
  topics: Topic[];
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  activeScenario: Scenario;
  onSelectScenario: (scenario: Scenario, autoStart?: boolean) => void;
  completedScenarioIds?: string[];
  isCompact?: boolean;
  onExpandRack?: () => void;
}

function cleanLabel(text: string): string {
  return text.replace(/^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, "").trim();
}

export const TapeWallRack: React.FC<TapeWallRackProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
  activeScenario,
  onSelectScenario,
  completedScenarioIds = [],
  isCompact = false,
  onExpandRack,
}) => {
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const handlePreviewAudio = (scenario: Scenario, e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewingId === scenario.id) {
      stopSpeaking();
      setPreviewingId(null);
    } else {
      stopSpeaking();
      setPreviewingId(scenario.id);
      const text = scenario.initialMessageEn || scenario.titleEn;
      speakText(text, 1.0, () => {
        setPreviewingId(null);
      });
    }
  };

  return (
    <div
      className={`rounded-3xl p-5 sm:p-7 bg-[#ffffff] dark:bg-[#14110e] border border-stone-200 dark:border-amber-950/30 shadow-xl flex flex-col transition-all duration-300 relative overflow-hidden ${
        isCompact ? "h-full" : ""
      }`}
    >
      {/* Decorative Wooden Rail Inset */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 opacity-60" />

      {/* Rack Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800/80 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Acoustic Wall Rack
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate mt-0.5">
            {isCompact ? "Tape Library" : selectedTopic.titleEn}
          </h2>
          {!isCompact && (
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
              {selectedTopic.titleVi} • {selectedTopic.scenarios.length} Voice Tapes on Shelf
            </p>
          )}
        </div>

        {/* Expand Rack Button (when compact) */}
        {isCompact && onExpandRack && (
          <button
            type="button"
            onClick={onExpandRack}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer flex-shrink-0"
            title="Expand library view"
            aria-label="Expand library view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Shelf / Topic Switcher */}
      <div className="mb-5 overflow-x-auto pb-1 scrollbar-none flex items-center gap-1.5">
        {topics.map((t, index) => {
          const isSelected = t.id === selectedTopic.id;
          const completedCount = t.scenarios.filter((sc) =>
            completedScenarioIds.includes(sc.id)
          ).length;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTopic(t)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-amber-500 text-stone-950 font-bold shadow-sm shadow-amber-500/20"
                  : "bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700/80 text-stone-600 dark:text-stone-300 font-medium border border-stone-200 dark:border-stone-800"
              }`}
            >
              <TopicIcon topicId={t.id} className="w-3.5 h-3.5" />
              <span>{isCompact ? cleanLabel(t.titleVi).split(" ")[0] : cleanLabel(t.titleVi)}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? "bg-stone-950/20 text-stone-950"
                    : "bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400"
                }`}
              >
                {completedCount > 0 ? `${completedCount}/${t.scenarios.length}` : t.scenarios.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cassette Tape Shelves */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[72vh]">
        <div
          className={
            isCompact
              ? "space-y-2.5"
              : "grid grid-cols-1 md:grid-cols-2 gap-4"
          }
        >
          {selectedTopic.scenarios.map((sc, index) => {
            const isLoaded = activeScenario.id === sc.id;
            const isCompleted = completedScenarioIds.includes(sc.id);
            const isPreviewing = previewingId === sc.id;

            if (isCompact) {
              /* Compact Spine View (Sidebar Mode) */
              return (
                <div
                  key={sc.id}
                  onClick={() => onSelectScenario(sc, false)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                    isLoaded
                      ? "bg-amber-500/10 border-amber-500/50 shadow-sm"
                      : "bg-stone-50 dark:bg-[#191512] hover:bg-stone-100 dark:hover:bg-[#201b17] border-stone-200 dark:border-stone-800/70"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                        isLoaded
                          ? "bg-amber-500 text-stone-950"
                          : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      {sc.order || index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {sc.titleEn}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {sc.titleVi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {isLoaded ? (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        In Deck
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectScenario(sc, true)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-200 hover:bg-amber-500 dark:bg-stone-800 dark:hover:bg-amber-500 hover:text-stone-950 dark:hover:text-stone-950 transition-colors cursor-pointer"
                        title="Load & practice"
                      >
                        Play
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            /* Full Tactile Cassette Card (Dominant Mode) */
            return (
              <div
                key={sc.id}
                onClick={() => onSelectScenario(sc, false)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between space-y-3 relative overflow-hidden press-tactile ${
                  isLoaded
                    ? "bg-amber-500/[0.08] border-amber-500/60 shadow-md shadow-amber-500/10"
                    : "bg-stone-50 dark:bg-[#181411] hover:bg-stone-100/90 dark:hover:bg-[#1f1a16] border-stone-200/90 dark:border-stone-800/80"
                }`}
              >
                {/* Top Tape Label Foil */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-[11px] font-bold text-stone-700 dark:text-stone-300">
                      TAPE #{sc.order || index + 1}
                    </span>
                    <span>Side A • Stereo</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5">
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    )}
                    {isLoaded && (
                      <span className="text-[10px] font-bold text-stone-950 bg-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        In Deck
                      </span>
                    )}
                  </div>
                </div>

                {/* Cassette Title & Subtitle */}
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors tracking-tight line-clamp-1">
                    {sc.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {sc.situation || sc.titleVi}
                  </p>
                </div>

                {/* Decorative Mini Tape Spools Window */}
                <div className="h-10 rounded-lg bg-stone-200/80 dark:bg-[#0d0a09] border border-stone-300/80 dark:border-stone-800/70 flex items-center justify-between px-6 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="w-5 h-5 rounded-full border-2 border-stone-400 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                  </div>
                  <div className="h-2 w-16 bg-stone-700/60 rounded-full" />
                  <div className="w-5 h-5 rounded-full border-2 border-stone-400 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                  </div>
                </div>

                {/* Tape Bottom Metadata & Action Bar */}
                <div
                  className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800/60 text-xs text-stone-500 dark:text-stone-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <RoleIcon role="user" className="w-3.5 h-3.5 text-amber-600" />
                      <span>{sc.defaultRoles.user.name}</span>
                    </span>
                    <span>•</span>
                    <span>{sc.vocabulary.length} words</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    {/* Audio Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => handlePreviewAudio(sc, e)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isPreviewing
                          ? "bg-amber-500 text-stone-950 font-bold"
                          : "hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                      }`}
                      title="Preview opening audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Slot / Practice Button */}
                    <button
                      type="button"
                      onClick={() => onSelectScenario(sc, true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xs cursor-pointer press-tactile transition-all"
                    >
                      <span>Practice</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
