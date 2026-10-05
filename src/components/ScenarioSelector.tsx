"use client";

import React, { useState } from "react";
import { X, Check, BookOpen, Users, Compass } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Chọn chủ đề & Tình huống giao tiếp
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic Tabs */}
        <div className="flex border-b border-slate-200 px-4 pt-2 bg-white gap-2 overflow-x-auto">
          {ALL_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                selectedTopicId === topic.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.titleVi}</span>
              <span className="text-xs text-slate-400">({topic.scenarios.length})</span>
            </button>
          ))}
        </div>

        {/* Scenarios List */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-6">
          {Object.entries(sections).map(([sectionName, scenarios]) => (
            <div key={sectionName} className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                {sectionName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scenarios.map((sc) => {
                  const isSelected =
                    activeTopic.id === currentTopic.id &&
                    sc.id === currentScenario.id;

                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        onSelectScenario(activeTopic, sc);
                        onClose();
                      }}
                      className={`text-left p-3.5 rounded-xl border transition flex flex-col justify-between group ${
                        sc.isFreeTalk
                          ? isSelected
                            ? "bg-gradient-to-br from-amber-50 to-indigo-50 border-amber-300 ring-2 ring-amber-400/30 shadow-md"
                            : "bg-gradient-to-br from-amber-50/50 via-white to-indigo-50/40 border-amber-200 hover:border-amber-300 hover:shadow-md"
                          : isSelected
                          ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                          : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/80 hover:shadow-xs"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${sc.isFreeTalk ? "text-amber-700 font-extrabold flex items-center gap-1" : "text-indigo-600"}`}>
                            {sc.isFreeTalk ? "🌟 THỰC CHIẾN TỰ DO" : `Bài ${sc.order}`}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Đang học
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                          {sc.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {sc.titleVi}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-emerald-500" />
                          {sc.vocabulary.length} từ vựng
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Users className="w-3 h-3" />
                          {sc.defaultRoles.ai.avatar} vs {sc.defaultRoles.user.avatar}
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
