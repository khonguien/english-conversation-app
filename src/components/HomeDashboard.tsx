"use client";

import React, { useState, useMemo } from "react";
import {
  Mic,
  ArrowRight,
  Volume2,
  VolumeX,
  Users,
  Compass,
  Headphones,
  Check,
  ChevronRight,
  EyeOff,
  Sparkles,
  Search,
  BookOpen,
  X,
  Trophy,
  Play,
} from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";
import { ThemeToggle } from "./ThemeToggle";
import { TopicIcon, RoleIcon } from "./TopicIcons";
import { speakText, stopSpeaking } from "@/utils/speech";

interface HomeDashboardProps {
  topics: Topic[];
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onStartScenario: (topic: Topic, scenario: Scenario, role: "user" | "ai") => void;
  completedScenarioIds?: string[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
  onStartScenario,
  completedScenarioIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rolePreferences, setRolePreferences] = useState<Record<string, "user" | "ai">>({});
  const [previewingAudioScenarioId, setPreviewingAudioScenarioId] = useState<string | null>(null);

  // Group current topic's scenarios by section
  const sections = useMemo(() => {
    const map: { [sectionName: string]: Scenario[] } = {};
    selectedTopic.scenarios.forEach((s) => {
      const sec = s.section || "Tình huống thực tế";
      if (!map[sec]) map[sec] = [];
      map[sec].push(s);
    });
    return map;
  }, [selectedTopic]);

  // Search filtered scenarios across all topics
  const searchedScenarios = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    const results: { topic: Topic; scenario: Scenario }[] = [];
    topics.forEach((t) => {
      t.scenarios.forEach((sc) => {
        if (
          sc.titleEn.toLowerCase().includes(q) ||
          sc.titleVi.toLowerCase().includes(q) ||
          sc.situation.toLowerCase().includes(q) ||
          t.titleEn.toLowerCase().includes(q) ||
          t.titleVi.toLowerCase().includes(q)
        ) {
          results.push({ topic: t, scenario: sc });
        }
      });
    });
    return results;
  }, [topics, searchQuery]);

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

  const completedCount = completedScenarioIds.length;

  // Handle instant voice preview
  const handleTogglePreviewAudio = (scenario: Scenario, e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewingAudioScenarioId === scenario.id) {
      stopSpeaking();
      setPreviewingAudioScenarioId(null);
    } else {
      stopSpeaking();
      const textToSpeak = scenario.initialMessageEn || scenario.titleEn;
      setPreviewingAudioScenarioId(scenario.id);
      speakText(textToSpeak, 1.0, () => {
        setPreviewingAudioScenarioId(null);
      });
    }
  };

  const featuredScenario = selectedTopic.scenarios[0];

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0e14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0c0e14]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-white/10 safe-top-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                  English in Conversation
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
                  Audio Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Phòng luyện phản xạ giao tiếp tiếng Anh 1-on-1 theo tình huống
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {completedCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Trophy className="w-3.5 h-3.5" />
                <span>
                  Đã học {completedCount}/{totalScenarios} bài
                </span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Focused Hero Stage (Single Leading Element, No Card Soup) */}
        {featuredScenario && !searchQuery && (
          <section className="p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#131722] border border-stone-200/90 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60">
                  <TopicIcon topicId={selectedTopic.id} className="w-4 h-4" />
                </div>
                <span>Chủ đề nổi bật: {selectedTopic.titleEn}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">
                  {selectedTopic.titleVi}
                </span>
              </div>

              {completedScenarioIds.includes(featuredScenario.id) && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 w-fit">
                  <Check className="w-3 h-3" /> Đã hoàn thành
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Context & Dialogue */}
              <div className="lg:col-span-8 space-y-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {featuredScenario.order ? `${featuredScenario.order}. ` : ""}
                  {featuredScenario.titleEn}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {featuredScenario.titleVi}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {featuredScenario.situation}
                </p>

                {/* Instant Audio Sample Preview */}
                {featuredScenario.initialMessageEn && (
                  <div className="pt-2 flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={(e) => handleTogglePreviewAudio(featuredScenario, e)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer active:scale-95 press-spring ${
                        previewingAudioScenarioId === featuredScenario.id
                          ? "bg-emerald-700 text-white"
                          : "bg-stone-100 dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                      }`}
                      title="Nghe giọng đọc câu mở đầu"
                      aria-label="Nghe thử câu mở đầu"
                    >
                      {previewingAudioScenarioId === featuredScenario.id ? (
                        <>
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 bg-white rounded-full animate-wave-1" />
                            <span className="w-0.5 bg-white rounded-full animate-wave-2" />
                            <span className="w-0.5 bg-white rounded-full animate-wave-3" />
                          </div>
                          <span>Đang phát câu mở đầu...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Nghe thử giọng đọc: "{featuredScenario.initialMessageEn.slice(0, 36)}..."</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Roles & Start CTA */}
              <div className="lg:col-span-4 flex flex-col justify-center space-y-3 p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Bạn đang đóng vai:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {getLearnerRole(featuredScenario) === "user"
                        ? featuredScenario.defaultRoles.user.name
                        : featuredScenario.defaultRoles.ai.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => toggleLearnerRole(featuredScenario.id, e)}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Đổi vai
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onStartScenario(
                      selectedTopic,
                      featuredScenario,
                      getLearnerRole(featuredScenario)
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-xs active:scale-98 cursor-pointer press-spring"
                >
                  <Mic className="w-4 h-4" />
                  <span>Bắt đầu đối thoại ngay</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Sleek Topic Navigator Ribbon (Single Horizontal Rail - No 8 Big Cards!) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Chọn Chủ Đề & Tình Huống
              </h2>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tình huống, từ vựng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-white dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Compact Horizontal Topic Switcher */}
          {!searchQuery && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-b border-stone-200/80 dark:border-white/10">
              {topics.map((t) => {
                const isSelected = t.id === selectedTopic.id;
                const completedInTopic = t.scenarios.filter((sc) =>
                  completedScenarioIds.includes(sc.id)
                ).length;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTopic(t)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer press-spring ${
                      isSelected
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                        : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-white/10 border border-stone-200/80 dark:border-white/10"
                    }`}
                  >
                    <TopicIcon topicId={t.id} className="w-3.5 h-3.5" />
                    <span>{t.titleVi}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-900"
                          : "bg-stone-100 dark:bg-white/10 text-slate-400"
                      }`}
                    >
                      {completedInTopic > 0 ? `${completedInTopic}/${t.scenarios.length}` : t.scenarios.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Scannable Typographic Lesson Tracklist (Clean rows, NOT nested card boxes!) */}
        <section className="space-y-6">
          {searchedScenarios ? (
            /* Search Results List */
            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tìm thấy <strong>{searchedScenarios.length}</strong> tình huống phù hợp:
              </p>
              {searchedScenarios.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-white/5 rounded-xl border border-stone-200/80 dark:border-white/10 text-xs text-slate-400">
                  Không tìm thấy bài học nào phù hợp với "{searchQuery}".
                </div>
              ) : (
                <div className="divide-y divide-stone-200/80 dark:divide-white/10 border border-stone-200/80 dark:border-white/10 rounded-xl bg-white dark:bg-[#131722] overflow-hidden">
                  {searchedScenarios.map(({ topic, scenario }, idx) => (
                    <div
                      key={scenario.id}
                      onClick={() => onStartScenario(topic, scenario, getLearnerRole(scenario))}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono text-slate-400 w-5">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-md">
                              {topic.titleVi}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                              {scenario.titleEn}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {scenario.titleVi}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          {scenario.vocabulary.length} từ
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Selected Topic Tracklist by Section */
            Object.entries(sections).map(([sectionName, scenarios]) => (
              <div key={sectionName} className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                  {sectionName}
                </h3>

                <div className="divide-y divide-stone-200/80 dark:divide-white/10 border border-stone-200/80 dark:border-white/10 rounded-xl bg-white dark:bg-[#131722] overflow-hidden">
                  {scenarios.map((sc, idx) => {
                    const isCompleted = completedScenarioIds.includes(sc.id);
                    const currentRole = getLearnerRole(sc);

                    return (
                      <div
                        key={sc.id}
                        className="p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Left: Index & Titles */}
                        <div
                          className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 cursor-pointer"
                          onClick={() => onStartScenario(selectedTopic, sc, currentRole)}
                        >
                          <div className="w-6 text-xs font-mono text-slate-400 flex items-center justify-center flex-shrink-0">
                            {isCompleted ? (
                              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              String(sc.order || idx + 1).padStart(2, "0")
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                                {sc.titleEn}
                              </h4>
                              {sc.isFreeTalk && (
                                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded-md">
                                  Tự do
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {sc.titleVi}
                            </p>
                          </div>
                        </div>

                        {/* Right: Quick Controls & Start Action */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          {/* Vocabulary pill */}
                          <span className="text-[11px] text-slate-400 hidden md:inline">
                            {sc.vocabulary.length} từ
                          </span>

                          {/* Role Pill Switcher */}
                          <button
                            type="button"
                            onClick={(e) => toggleLearnerRole(sc.id, e)}
                            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="Đổi vai đóng"
                          >
                            <RoleIcon role={currentRole} className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>
                              {currentRole === "user" ? sc.defaultRoles.user.name : sc.defaultRoles.ai.name}
                            </span>
                          </button>

                          {/* Instant Listen Preview */}
                          {sc.initialMessageEn && (
                            <button
                              type="button"
                              onClick={(e) => handleTogglePreviewAudio(sc, e)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                previewingAudioScenarioId === sc.id
                                  ? "bg-emerald-700 text-white"
                                  : "text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-white/10"
                              }`}
                              title="Nghe câu mở đầu"
                              aria-label="Nghe thử câu mở đầu"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Enter Chat Button */}
                          <button
                            type="button"
                            onClick={() => onStartScenario(selectedTopic, sc, currentRole)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-colors cursor-pointer active:scale-95 press-spring"
                          >
                            <span className="hidden xs:inline">Luyện tập</span>
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-stone-200/80 dark:border-white/10 bg-white/50 dark:bg-black/20 py-5 text-center text-xs text-slate-500 dark:text-slate-400 safe-bottom-padding">
        <p className="max-w-md mx-auto">
          English in Conversation • Thiết kế audio-first tinh gọn, không rườm rà.
        </p>
      </footer>
    </div>
  );
};
