"use client";

import React, { useState, useMemo } from "react";
import {
  Mic,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Zap,
  Repeat,
  Volume2,
  Users,
} from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";
import { ThemeToggle } from "./ThemeToggle";

interface HomeDashboardProps {
  topics: Topic[];
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onStartScenario: (topic: Topic, scenario: Scenario, role: "user" | "ai") => void;
}

const TOPIC_ACCENTS: Record<string, { bgGlow: string; ring: string; badge: string }> = {
  airport: {
    bgGlow: "group-hover:bg-sky-500/10",
    ring: "border-sky-500/40 dark:border-sky-400/60 ring-2 ring-sky-500/20",
    badge: "text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800",
  },
  cafe: {
    bgGlow: "group-hover:bg-amber-500/10",
    ring: "border-amber-500/40 dark:border-amber-400/60 ring-2 ring-amber-500/20",
    badge: "text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
  },
  hotel: {
    bgGlow: "group-hover:bg-emerald-500/10",
    ring: "border-emerald-500/40 dark:border-emerald-400/60 ring-2 ring-emerald-500/20",
    badge: "text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
  },
  shopping: {
    bgGlow: "group-hover:bg-fuchsia-500/10",
    ring: "border-fuchsia-500/40 dark:border-fuchsia-400/60 ring-2 ring-fuchsia-500/20",
    badge: "text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-100/80 dark:bg-fuchsia-950/60 border-fuchsia-200 dark:border-fuchsia-800",
  },
  transportation: {
    bgGlow: "group-hover:bg-blue-500/10",
    ring: "border-blue-500/40 dark:border-blue-400/60 ring-2 ring-blue-500/20",
    badge: "text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
  },
  socializing: {
    bgGlow: "group-hover:bg-rose-500/10",
    ring: "border-rose-500/40 dark:border-rose-400/60 ring-2 ring-rose-500/20",
    badge: "text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
  },
  workplace: {
    bgGlow: "group-hover:bg-indigo-500/10",
    ring: "border-indigo-500/40 dark:border-indigo-400/60 ring-2 ring-indigo-500/20",
    badge: "text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800",
  },
};

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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar with glassmorphism */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 safe-top-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  English in Conversation
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500/10 to-sky-500/10 text-indigo-600 dark:text-sky-400 border border-indigo-200/60 dark:border-indigo-800/60 px-2 py-0.5 rounded-full">
                  AI Roleplay
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Luyện phản xạ giao tiếp tiếng Anh 2 chiều theo tình huống thực tế
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                const first = selectedTopic.scenarios[0];
                if (first) onStartScenario(selectedTopic, first, getLearnerRole(first));
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm hover:shadow cursor-pointer active:scale-95 group"
            >
              <span>Vào bài đầu tiên</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 sm:space-y-9">
        {/* Cinematic Modern Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 text-white p-6 sm:p-10 shadow-xl shadow-slate-950/10 border border-slate-800/80">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/25 to-sky-500/0 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Đối thoại tự nhiên cùng Trợ lý AI bản xứ</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight text-white">
              Tự Tin Giao Tiếp Tiếng Anh Trong Mọi Tình Huống
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Không học vẹt hay sợ hãi khi nói. Hãy chọn tình huống, bấm Micro và trực tiếp trò chuyện với AI. Hệ thống hỗ trợ phản xạ 2 chiều, kèm phụ đề song ngữ và gợi ý mẫu câu tức thì.
            </p>

            {/* Quick stats / highlight badges */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div className="bg-white/[0.07] hover:bg-white/[0.11] backdrop-blur-md rounded-2xl p-3 border border-white/10 transition-colors">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Kho tình huống</span>
                </div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  {totalScenarios} bài học
                </span>
              </div>

              <div className="bg-white/[0.07] hover:bg-white/[0.11] backdrop-blur-md rounded-2xl p-3 border border-white/10 transition-colors">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tốc độ phản xạ</span>
                </div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  ~1.4s cực nhanh
                </span>
              </div>

              <div className="bg-white/[0.07] hover:bg-white/[0.11] backdrop-blur-md rounded-2xl p-3 border border-white/10 transition-colors">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Repeat className="w-3.5 h-3.5 text-sky-300" />
                  <span>Chế độ 2 chiều</span>
                </div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  Khách ⇄ Staff
                </span>
              </div>

              <div className="bg-white/[0.07] hover:bg-white/[0.11] backdrop-blur-md rounded-2xl p-3 border border-white/10 transition-colors">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Giọng AI bản xứ</span>
                </div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  Edge TTS chuẩn
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Topic Selector Tabs */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Chủ Đề Thực Chiến
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn chủ đề giao tiếp bạn muốn làm chủ hôm nay
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {topics.map((topic) => {
              const isSelected = topic.id === selectedTopic.id;
              const accent = TOPIC_ACCENTS[topic.id] || {
                bgGlow: "group-hover:bg-slate-500/10",
                ring: "border-slate-900 dark:border-cyan-400 ring-2 ring-slate-900/10 dark:ring-cyan-500/30",
                badge: "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
              };

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    onSelectTopic(topic);
                    setSelectedSection("ALL");
                  }}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border flex items-center gap-3 relative overflow-hidden group cursor-pointer active:scale-98 ${
                    isSelected
                      ? `bg-white dark:bg-slate-900 shadow-md ${accent.ring}`
                      : "bg-white dark:bg-slate-900/90 hover:bg-slate-50/90 dark:hover:bg-slate-800/90 border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm hover:-translate-y-0.5"
                  }`}
                >
                  <span className="text-2xl p-2.5 bg-slate-100/90 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0 shadow-2xs">
                    {topic.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                      {topic.titleEn}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${accent.badge}`}>
                        {topic.scenarios.length} bài
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section Filter Pills */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{selectedTopic.icon}</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Danh Sách Tình Huống: {selectedTopic.titleEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Đang hiển thị {filteredScenarios.length} / {selectedTopic.scenarios.length} bài học
                </p>
              </div>
            </div>
          </div>

          {/* Section Filter Pills */}
          {sections.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {sections.map((sec) => {
                const isActive = selectedSection === sec;
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSection(sec)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap border cursor-pointer active:scale-95 ${
                      isActive
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs"
                        : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 shadow-2xs"
                    }`}
                  >
                    {sec === "ALL" ? "Tất cả các phần" : sec}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Scenarios Grid - Refined Card Elevation & Role Badges */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredScenarios.map((scenario) => {
            const learnerRole = getLearnerRole(scenario);

            return (
              <div
                key={scenario.id}
                onClick={() => onStartScenario(selectedTopic, scenario, learnerRole)}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-850 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-400/80 dark:hover:border-slate-700 p-4 sm:p-4.5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 flex items-center gap-1">
                      {scenario.isFreeTalk ? (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                          <span>Thực chiến tự do</span>
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
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                      {scenario.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 line-clamp-1">
                      {scenario.titleVi}
                    </p>
                  </div>

                  {/* Context Role Preview */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">
                      {scenario.defaultRoles.user.avatar} {scenario.defaultRoles.user.name} ⇄ {scenario.defaultRoles.ai.avatar} {scenario.defaultRoles.ai.name}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{scenario.vocabulary.length} từ vựng</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform">
                    <span>Luyện nói</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} English in Conversation • Luyện Giao Tiếp Tiếng Anh Thực Chiến
          </span>
          <span className="text-slate-400 dark:text-slate-500">
            Hỗ trợ tối ưu trên Google Chrome, Microsoft Edge và Safari (iPhone, iPad, Mac)
          </span>
        </div>
      </footer>
    </div>
  );
};

