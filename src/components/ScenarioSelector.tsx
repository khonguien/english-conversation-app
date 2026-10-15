"use client";

import React, { useState } from "react";
import { X, Check, BookOpen, Users, Compass, Sparkles } from "lucide-react";
import { ALL_TOPICS } from "@/data/topics";
import { Scenario, Topic } from "@/types/conversation";

interface ScenarioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: Topic;
  currentScenario: Scenario;
  onSelectScenario: (topic: Topic, scenario: Scenario) => void;
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
    if (!sections[s.section]) {
      sections[s.section] = [];
    }
    sections[s.section].push(s);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Chọn Chủ Đề & Tình Huống
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Luyện phản xạ giao tiếp theo tình huống thực tế
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Topic Tabs */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 px-4 pt-2 bg-slate-50/40 dark:bg-[#070b14]/40 gap-2 overflow-x-auto scrollbar-none">
          {ALL_TOPICS.map((topic) => {
            const isTabActive = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  isTabActive
                    ? "border-indigo-600 dark:border-sky-400 text-indigo-600 dark:text-sky-300 bg-white/70 dark:bg-slate-850/60 rounded-t-xl"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <span>{topic.icon}</span>
                <span>{topic.titleVi}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  ({topic.scenarios.length})
                </span>
              </button>
            );
          })}
        </div>

        {/* Scenarios List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {Object.entries(sections).map(([sectionName, scenarios]) => (
            <div key={sectionName} className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
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
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group cursor-pointer active:scale-98 shadow-2xs ${
                        isSelected
                          ? "bg-indigo-50/80 dark:bg-slate-850/90 border-indigo-400 dark:border-sky-500/60 ring-2 ring-indigo-500/20 shadow-xs"
                          : "bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-850/50 hover:shadow-xs"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            {sc.isFreeTalk ? (
                              <>
                                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                                <span>Thực chiến tự do</span>
                              </>
                            ) : (
                              `Bài #${sc.order}`
                            )}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-indigo-600 dark:bg-sky-500 px-2 py-0.5 rounded-full shadow-2xs">
                              <Check className="w-3 h-3" /> Đang học
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-sky-300 transition-colors line-clamp-1">
                          {sc.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {sc.titleVi}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <BookOpen className="w-3 h-3" />
                          {sc.vocabulary.length} từ vựng
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="w-3 h-3" />
                          {sc.defaultRoles.user.avatar} ⇄ {sc.defaultRoles.ai.avatar}
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
