"use client";

import React, { useState } from "react";
import { X, Check, Compass, Sparkles } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111520] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200/90 dark:border-white/10 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 dark:border-white/10 flex items-center justify-between bg-stone-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Chọn Chủ Đề & Tình Huống
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Luyện phản xạ giao tiếp theo ngữ cảnh thực tế
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-200/70 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ chọn tình huống"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Topic Tabs */}
        <div className="flex border-b border-stone-200/80 dark:border-white/10 px-4 pt-2 bg-stone-50/50 dark:bg-white/3 gap-2 overflow-x-auto scrollbar-none">
          {ALL_TOPICS.map((topic) => {
            const isTabActive = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isTabActive
                    ? "border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-white/5 rounded-t-xl"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <TopicIcon topicId={topic.id} className="w-4 h-4" />
                <span>{topic.titleVi}</span>
                <span className="text-[11px] text-slate-400">
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
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
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
                      className={`text-left p-4 rounded-xl border transition-colors flex flex-col justify-between group cursor-pointer active:scale-98 ${
                        isSelected
                          ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 ring-1 ring-emerald-500/20"
                          : "bg-white dark:bg-white/5 border-stone-200/80 dark:border-white/10 hover:border-stone-300 dark:hover:border-white/20 hover:bg-stone-50 dark:hover:bg-white/8"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            {sc.isFreeTalk ? (
                              <>
                                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span>Thực chiến tự do</span>
                              </>
                            ) : (
                              `Bài #${sc.order}`
                            )}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-700 dark:bg-emerald-600 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Đang học
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {sc.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {sc.titleVi}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{sc.vocabulary.length} từ vựng</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold group-hover:underline">
                          Chọn bài này →
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
