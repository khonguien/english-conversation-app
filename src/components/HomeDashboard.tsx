"use client";

import React, { useState, useMemo } from "react";
import {
  Mic,
  ArrowRight,
  BookOpen,
  Volume2,
  Users,
  Compass,
  Headphones,
  Check,
  ChevronRight,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";
import { ThemeToggle } from "./ThemeToggle";
import { TopicIcon, RoleIcon } from "./TopicIcons";

interface HomeDashboardProps {
  topics: Topic[];
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onStartScenario: (topic: Topic, scenario: Scenario, role: "user" | "ai") => void;
}

const CATEGORIES = [
  { id: "ALL", label: "Tất cả chủ đề" },
  { id: "TRAVEL", label: "Du lịch & Đi lại", topicIds: ["airport", "hotel", "transportation"] },
  { id: "DINING", label: "Ẩm thực & Thư giãn", topicIds: ["cafe", "restaurant"] },
  { id: "DAILY", label: "Đời sống & Công sở", topicIds: ["shopping", "socializing", "workplace"] },
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
  onStartScenario,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [rolePreferences, setRolePreferences] = useState<Record<string, "user" | "ai">>({});

  // Filter topics by category
  const filteredTopics = useMemo(() => {
    if (selectedCategory === "ALL") return topics;
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    if (!cat || !cat.topicIds) return topics;
    return topics.filter((t) => cat.topicIds.includes(t.id));
  }, [topics, selectedCategory]);

  const getLearnerRole = (scenario: Scenario): "user" | "ai" => {
    return rolePreferences[scenario.id] || "user";
  };

  const toggleLearnerRole = (scenarioId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRolePreferences((prev) => ({
      ...prev,
      [scenarioId]: prev[scenarioId] === "ai" ? "user" : "ai",
    }));
  };

  const totalScenarios = useMemo(() => {
    return topics.reduce((acc, t) => acc + t.scenarios.length, 0);
  }, [topics]);

  // Featured scenario is the first scenario of the selected topic
  const featuredScenario = selectedTopic.scenarios[0];

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0e14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0c0e14]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-white/10 safe-top-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  English in Conversation
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
                  Audio Practice
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Luyện phản xạ giao tiếp tiếng Anh 1-on-1 theo ngữ cảnh thực tế
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {featuredScenario && (
              <button
                type="button"
                onClick={() =>
                  onStartScenario(
                    selectedTopic,
                    featuredScenario,
                    getLearnerRole(featuredScenario)
                  )
                }
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-xs active:scale-95 cursor-pointer"
              >
                <span>Vào bài học</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Editorial Hero (Asymmetric) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Vision & Philosophy */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-stone-100 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Học giao tiếp qua phản xạ âm thanh, không áp lực ngữ pháp</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
                Luyện nói tiếng Anh tự nhiên qua từng tình huống.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Chọn một tình huống thực tế, nhấn giữ Micro và trực tiếp trò chuyện với Trợ lý AI bản xứ. Ứng dụng hỗ trợ ẩn phụ đề để bạn ép tai luyện nghe, hoặc bật gợi ý khi chưa biết cách đối đáp.
              </p>
            </div>

            {/* Practical feature pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-stone-200/80 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                  <Mic className="w-4 h-4" />
                  <span>Nói qua Micro</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Nhận diện giọng nói chuẩn xác, phản xạ 2 chiều tự nhiên.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-stone-200/80 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                  <EyeOff className="w-4 h-4" />
                  <span>Luyện Nghe Bắt Âm</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Che chữ để rèn luyện thói quen nghe hiểu bằng tai.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-stone-200/80 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                  <Users className="w-4 h-4" />
                  <span>Đổi Vai Linh Hoạt</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Thử sức ở vai hành khách hoặc nhân viên phục vụ.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Featured Practice Card */}
          {featuredScenario && (
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#131722] border border-stone-200/90 dark:border-white/10 shadow-sm relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <TopicIcon topicId={selectedTopic.id} className="w-4 h-4" />
                    <span>{selectedTopic.titleEn}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Bài #{featuredScenario.order || 1}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {featuredScenario.titleEn}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {featuredScenario.titleVi}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p className="line-clamp-3">{featuredScenario.situation}</p>
                </div>

                {/* Role indicator in scenario */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <RoleIcon role={getLearnerRole(featuredScenario)} className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Bạn đang đóng vai:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {getLearnerRole(featuredScenario) === "user"
                          ? featuredScenario.defaultRoles.user.name
                          : featuredScenario.defaultRoles.ai.name}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleLearnerRole(featuredScenario.id, e)}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Đổi vai
                  </button>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() =>
                    onStartScenario(
                      selectedTopic,
                      featuredScenario,
                      getLearnerRole(featuredScenario)
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Bắt đầu đối thoại ngay</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Topic Selection Grid */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Chủ Đề Thực Chiến
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Chọn lĩnh vực bạn muốn luyện tập phản xạ hôm nay ({totalScenarios} tình huống có sẵn)
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                      : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-white/10 border border-stone-200/80 dark:border-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTopics.map((topic) => {
              const isSelected = topic.id === selectedTopic.id;
              const vocabCount = topic.scenarios.reduce(
                (sum, sc) => sum + sc.vocabulary.length,
                0
              );

              return (
                <div
                  key={topic.id}
                  onClick={() => onSelectTopic(topic)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "bg-white dark:bg-[#131722] border-emerald-600 dark:border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                      : "bg-white dark:bg-white/5 border-stone-200/80 dark:border-white/10 hover:border-stone-300 dark:hover:border-white/20 hover:bg-stone-50/50 dark:hover:bg-white/8"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950"
                            : "bg-stone-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                        }`}
                      >
                        <TopicIcon topicId={topic.id} className="w-5 h-5" />
                      </div>

                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                          <Check className="w-3 h-3" /> Đang chọn
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {topic.titleEn}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {topic.titleVi}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <span>{topic.scenarios.length} tình huống</span>
                    <span>{vocabCount} từ vựng</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Detailed Scenarios of the Selected Topic */}
        <section className="space-y-4 pt-4 border-t border-stone-200/80 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TopicIcon topicId={selectedTopic.id} className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Danh sách bài học trong "{selectedTopic.titleEn}"
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {selectedTopic.scenarios.length} bài đối thoại
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {selectedTopic.scenarios.map((scenario) => {
              const currentRole = getLearnerRole(scenario);

              return (
                <div
                  key={scenario.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-white/5 border border-stone-200/80 dark:border-white/10 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">
                        {scenario.isFreeTalk ? "Thực chiến tự do" : `Tình huống #${scenario.order}`}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-stone-100 dark:bg-white/10 px-2 py-0.5 rounded-md">
                        {scenario.vocabulary.length} từ vựng
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {scenario.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {scenario.titleVi}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {scenario.situation}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => toggleLearnerRole(scenario.id, e)}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RoleIcon role={currentRole} className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        Vai:{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {currentRole === "user"
                            ? scenario.defaultRoles.user.name
                            : scenario.defaultRoles.ai.name}
                        </strong>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartScenario(selectedTopic, scenario, currentRole)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-colors cursor-pointer active:scale-95 shadow-xs"
                    >
                      <span>Vào luyện tập</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-stone-200/80 dark:border-white/10 bg-white/50 dark:bg-black/20 py-6 text-center text-xs text-slate-500 dark:text-slate-400 safe-bottom-padding">
        <p className="max-w-md mx-auto">
          English in Conversation • Thiết kế audio-first chuẩn PWA cho trải nghiệm luyện phản xạ tự nhiên.
        </p>
      </footer>
    </div>
  );
};
