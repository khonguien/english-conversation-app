"use client";

import React, { useState, useMemo } from "react";
import {
  Mic,
  Sparkles,
  ArrowRight,
  BookOpen,
  Volume2,
  RefreshCw,
  Compass,
  MessageSquare,
  Award,
  Layers,
  CheckCircle2,
  ChevronRight,
  Headphones,
} from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";

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
  // Track learner role per scenario ID (default "user")
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

  const handleToggleScenarioRole = (scenarioId: string, currentRole: "user" | "ai") => {
    const nextRole = currentRole === "user" ? "ai" : "user";
    setRolePreferences((prev) => ({ ...prev, [scenarioId]: nextRole }));
  };

  const getLearnerRole = (scenario: Scenario): "user" | "ai" => {
    return rolePreferences[scenario.id] || "user";
  };

  const totalScenarios = useMemo(() => {
    return topics.reduce((acc, t) => acc + t.scenarios.length, 0);
  }, [topics]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  English in Conversation
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                  AI Practice
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Luyện phản xạ giao tiếp tiếng Anh 2 chiều theo tình huống thực tế
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const first = selectedTopic.scenarios[0];
                if (first) onStartScenario(selectedTopic, first, getLearnerRole(first));
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm hover:shadow"
            >
              <span>Vào bài đầu tiên</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Đối thoại tự nhiên cùng Trợ lý AI bản xứ</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Tự Tin Giao Tiếp Tiếng Anh{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-violet-300">
                Trong Mọi Tình Huống
              </span>
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Không còn học thuộc vẹt hay sợ hãi khi nói. Hãy chọn tình huống, bấm Micro và trực tiếp trò chuyện với AI. Hệ thống hỗ trợ phản xạ 2 chiều, kèm phụ đề song ngữ và gợi ý mẫu câu tức thì.
            </p>

            {/* Quick stats / highlight badges */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                <span className="block text-base sm:text-lg font-bold text-amber-300">
                  {totalScenarios} bài
                </span>
                <span className="text-indigo-200 text-[11px]">Tình huống đời thực</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                <span className="block text-base sm:text-lg font-bold text-emerald-300">
                  ~1.0s
                </span>
                <span className="text-indigo-200 text-[11px]">AI phản hồi tức thì</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                <span className="block text-base sm:text-lg font-bold text-sky-300">
                  2 Chiều
                </span>
                <span className="text-indigo-200 text-[11px]">Đổi vai Khách ⇄ Staff</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                <span className="block text-base sm:text-lg font-bold text-purple-300">
                  Edge TTS
                </span>
                <span className="text-indigo-200 text-[11px]">Giọng đọc tự nhiên</span>
              </div>
            </div>
          </div>
        </section>

        {/* Topic Selector Tabs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Chủ Đề Thực Chiến
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Chọn chủ đề giao tiếp bạn muốn làm chủ hôm nay
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topics.map((topic) => {
              const isSelected = topic.id === selectedTopic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic);
                    setSelectedSection("ALL");
                  }}
                  className={`text-left p-4 rounded-2xl transition border flex items-start gap-3.5 relative overflow-hidden group ${
                    isSelected
                      ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                      : "bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span className="text-3xl p-2.5 bg-slate-100 rounded-2xl group-hover:scale-105 transition flex-shrink-0">
                    {topic.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition truncate">
                        {topic.titleEn}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex-shrink-0">
                        {topic.scenarios.length} tình huống
                      </span>
                    </div>
                    <p className="text-xs font-medium text-indigo-700 mb-1">
                      {topic.titleVi}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {topic.description}
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
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Danh Sách Tình Huống: {selectedTopic.titleEn}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Đang hiển thị {filteredScenarios.length} / {selectedTopic.scenarios.length} bài
            </span>
          </div>

          {/* Section Filter Pills */}
          {sections.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {sections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap border ${
                    selectedSection === sec
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {sec === "ALL" ? "Tất cả các phần" : sec}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Scenarios Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.map((scenario) => {
            const learnerRole = getLearnerRole(scenario);
            const isPlayingAsStaff = learnerRole === "ai";
            const learnerRoleInfo = isPlayingAsStaff
              ? scenario.defaultRoles.ai
              : scenario.defaultRoles.user;
            const aiRoleInfo = isPlayingAsStaff
              ? scenario.defaultRoles.user
              : scenario.defaultRoles.ai;

            return (
              <div
                key={scenario.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top: Order & Section */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                      {scenario.isFreeTalk ? "🌟 Free Talk" : `Bài #${scenario.order}`}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[160px]">
                      {scenario.section}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition leading-snug">
                      {scenario.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {scenario.titleVi}
                    </p>
                  </div>

                  {/* Situation Context */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {scenario.situation}
                  </p>

                  {/* Role Selection Picker on Card */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Vai của bạn:
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleScenarioRole(scenario.id, learnerRole);
                        }}
                        className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                        title="Bấm để đổi vai"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Đổi vai</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
                      <span className="text-base">{learnerRoleInfo.avatar}</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-indigo-950 block truncate">
                          {learnerRoleInfo.name} ({learnerRoleInfo.titleVi})
                        </span>
                        <span className="text-[10px] text-indigo-700/80 block">
                          Đối đáp với AI: {aiRoleInfo.avatar} {aiRoleInfo.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Vocabulary count & Start CTA */}
                <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{scenario.vocabulary.length} từ vựng</span>
                  </div>

                  <button
                    onClick={() => onStartScenario(selectedTopic, scenario, learnerRole)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-2xs group-hover:shadow group-hover:scale-102"
                  >
                    <span>Luyện nói ngay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* How It Works Guidelines */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h3 className="font-black text-slate-900 text-lg sm:text-xl">
              Phương Pháp Học Hiệu Quả
            </h3>
            <p className="text-xs text-slate-500">
              3 bước đơn giản giúp bạn tăng phản xạ giao tiếp tự nhiên
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Chọn tình huống & Vai diễn
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đọc trước tóm tắt ngữ cảnh, có thể bấm "Từ vựng" để xem trước các từ cốt lõi trước khi bắt đầu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Bấm Micro & Tự Tin Nói
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nói bằng tiếng Anh tự nhiên. Bạn có thể bấm mở phần "Gợi ý cách trả lời" ở thanh dưới nếu chưa biết nói gì.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Lắng Nghe AI & Đổi Vai
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nghe AI đối đáp giọng bản xứ. Sau khi hoàn thành vai khách, hãy thử đổi vai nhân viên để làm chủ trọn vẹn tình huống!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} English in Conversation • Luyện Giao Tiếp Tiếng Anh Thực Chiến
          </span>
          <span className="text-slate-400">
            Hỗ trợ tốt nhất trên trình duyệt Google Chrome, Microsoft Edge và Safari
          </span>
        </div>
      </footer>
    </div>
  );
};
