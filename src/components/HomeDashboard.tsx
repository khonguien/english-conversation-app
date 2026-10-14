"use client";

import React, { useState, useMemo } from "react";
import {
  Mic,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";
import { ThemeToggle } from "./ThemeToggle";

interface HomeDashboardProps {
  topics: Topic[];
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onStartScenario: (topic: Topic, scenario: Scenario, role: "user" | "ai") => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
  onStartScenario,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [rolePreferences, setRolePreferences] = useState<Record<string, "user" | "ai">>({});

  // Extract unique sections in the selected topic
  const sections = useMemo(() => {
    const list = Array.from(new Set(selectedTopic.scenarios.map((s) => s.section)));
    return ["ALL", ...list];
  }, [selectedTopic]);

  // Filter scenarios by section
  const filteredScenarios = useMemo(() => {
    if (selectedSection === "ALL") return selectedTopic.scenarios;
    return selectedTopic.scenarios.filter((s) => s.section === selectedSection);
  }, [selectedTopic, selectedSection]);

  const getLearnerRole = (scenario: Scenario): "user" | "ai" => {
    return rolePreferences[scenario.id] || "user";
  };

  const totalScenarios = useMemo(() => {
    return topics.reduce((acc, t) => acc + t.scenarios.length, 0);
  }, [topics]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white dark:text-cyan-400 shadow-2xs border border-transparent dark:border-slate-700">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  English in Conversation
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 px-2 py-0.5 rounded-full">
                  AI Roleplay
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Luyện phản xạ giao tiếp tiếng Anh 2 chiều theo tình huống thực tế
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                const first = selectedTopic.scenarios[0];
                if (first) onStartScenario(selectedTopic, first, getLearnerRole(first));
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white transition shadow-2xs cursor-pointer active:scale-95"
            >
              <span>Vào bài đầu tiên</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Expanded for laptop */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Dark Hero Section - Preserved as requested */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-xs border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-200 text-xs font-medium backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Đối thoại tự nhiên cùng Trợ lý AI bản xứ</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
              Tự Tin Giao Tiếp Tiếng Anh Trong Mọi Tình Huống
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Không học vẹt hay sợ hãi khi nói. Hãy chọn tình huống, bấm Micro và trực tiếp trò chuyện với AI. Hệ thống hỗ trợ phản xạ 2 chiều, kèm phụ đề song ngữ và gợi ý mẫu câu tức thì.
            </p>

            {/* Quick stats / highlight badges */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10">
                <span className="block text-base sm:text-lg font-bold text-white">
                  {totalScenarios} bài
                </span>
                <span className="text-slate-400 text-[11px]">Tình huống đời thực</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10">
                <span className="block text-base sm:text-lg font-bold text-white">
                  ~1.4s
                </span>
                <span className="text-slate-400 text-[11px]">AI phản hồi tức thì</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10">
                <span className="block text-base sm:text-lg font-bold text-white">
                  2 Chiều
                </span>
                <span className="text-slate-400 text-[11px]">Đổi vai Khách ⇄ Staff</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10">
                <span className="block text-base sm:text-lg font-bold text-white">
                  Edge TTS
                </span>
                <span className="text-slate-400 text-[11px]">Giọng đọc tự nhiên</span>
              </div>
            </div>
          </div>
        </section>

        {/* Topic Selector Tabs */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Chủ Đề Thực Chiến
              </h2>
              <p className="text-xs text-slate-500">
                Chọn chủ đề giao tiếp bạn muốn làm chủ hôm nay
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {topics.map((topic) => {
              const isSelected = topic.id === selectedTopic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    onSelectTopic(topic);
                    setSelectedSection("ALL");
                  }}
                  className={`text-left p-3 sm:p-3.5 rounded-2xl transition border flex items-center gap-3 relative overflow-hidden group cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-white dark:bg-slate-800 border-slate-900 dark:border-cyan-400 shadow-xs ring-2 ring-slate-900/10 dark:ring-cyan-500/30"
                      : "bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800/90 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
                  }`}
                >
                  <span className="text-2xl p-2 bg-slate-100 dark:bg-slate-800/90 rounded-xl group-hover:scale-105 transition flex-shrink-0">
                    {topic.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                      {topic.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {topic.scenarios.length} bài
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section Filter Pills */}
        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedTopic.icon}</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                Danh Sách Tình Huống: {selectedTopic.titleEn}
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Đang hiển thị {filteredScenarios.length} / {selectedTopic.scenarios.length} bài
            </span>
          </div>

          {/* Section Filter Pills */}
          {sections.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {sections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSection(sec)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap border cursor-pointer active:scale-95 ${
                    selectedSection === sec
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-2xs"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {sec === "ALL" ? "Tất cả các phần" : sec}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Scenarios Grid - Compact Modern Grid (Streamlined per user feedback) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {filteredScenarios.map((scenario) => {
            const learnerRole = getLearnerRole(scenario);

            return (
              <div
                key={scenario.id}
                onClick={() => onStartScenario(selectedTopic, scenario, learnerRole)}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50/90 dark:hover:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-400/80 dark:hover:border-slate-600 p-4 shadow-2xs hover:shadow-xs transition cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 flex items-center gap-1">
                      {scenario.isFreeTalk ? (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Tự do</span>
                        </>
                      ) : (
                        `Bài #${scenario.order}`
                      )}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[130px]">
                      {scenario.section}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-slate-700 dark:group-hover:text-cyan-400 transition line-clamp-1">
                      {scenario.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
                      {scenario.titleVi}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span>{scenario.vocabulary.length} từ vựng</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Bắt đầu</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} English in Conversation • Luyện Giao Tiếp Tiếng Anh Thực Chiến
          </span>
          <span className="text-slate-400 dark:text-slate-500">
            Hỗ trợ tốt nhất trên trình duyệt Google Chrome, Microsoft Edge và Safari
          </span>
        </div>
      </footer>
    </div>
  );
};
