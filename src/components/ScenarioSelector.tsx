"use client";

import React, { useState } from "react";
import { X, Check, Compass, ArrowRight } from "lucide-react";
import { ALL_TOPICS } from "@/data/topics";
import { Scenario, Topic } from "@/types/conversation";
import { TopicIcon } from "./TopicIcons";

interface ScenarioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: Topic;
  currentScenario: Scenario;
  onSelectScenario: (topic: Topic, scenario: Scenario) => void;
}

function cleanLabel(text: string): string {
  return text.replace(/^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, "").trim();
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  isOpen,
  onClose,
  currentTopic,
  currentScenario,
  onSelectScenario,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState(currentTopic.id);

  if (!isOpen) return null;

  const activeTopic =
    ALL_TOPICS.find((t) => t.id === selectedTopicId) || currentTopic;

  // Group scenarios by section
  const sections: { [sectionName: string]: Scenario[] } = {};
  activeTopic.scenarios.forEach((s) => {
    const sec = cleanLabel(s.section || "Tình huống thực tế");
    if (!sections[sec]) {
      sections[sec] = [];
    }
    sections[sec].push(s);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                Select Scenario
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Choose a situation to practice real-time conversational reflexes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] rounded-full transition-colors cursor-pointer press-tactile"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Topic Tabs */}
        <div className="flex border-b border-[var(--color-border)] px-4 pt-3 pb-2 bg-[var(--color-bg-subtle)]/50 gap-2 overflow-x-auto scrollbar-none">
          {ALL_TOPICS.map((topic) => {
            const isTabActive = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer press-tactile ${
                  isTabActive
                    ? "bg-amber-600 dark:bg-amber-500 text-white shadow-xs font-bold"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                }`}
              >
                <TopicIcon topicId={topic.id} className="w-3.5 h-3.5" />
                <span>{cleanLabel(topic.titleVi)}</span>
                <span className="text-xs opacity-80">
                  ({topic.scenarios.length})
                </span>
              </button>
            );
          })}
        </div>

        {/* Scenarios List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {Object.entries(sections).map(([sectionName, scenarios]) => (
            <div key={sectionName} className="space-y-3">
              <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider px-1">
                {sectionName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scenarios.map((sc) => {
                  const isSelected =
                    activeTopic.id === currentTopic.id &&
                    sc.id === currentScenario.id;

                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        onSelectScenario(activeTopic, sc);
                        onClose();
                      }}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer press-tactile ${
                        isSelected
                          ? "bg-amber-500/[0.08] border-amber-600 dark:border-amber-500 ring-1 ring-amber-500/20"
                          : "bg-[var(--color-bg-surface)] border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1">
                            {sc.isFreeTalk ? "Open Roleplay" : `Lesson #${sc.order}`}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-amber-600 px-2 py-0.5 rounded-full shadow-xs">
                              <Check className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                          {sc.titleEn}
                        </h4>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                          {sc.titleVi}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                        <span>{sc.vocabulary.length} words</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                          <span>Practice</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
