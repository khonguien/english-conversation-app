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
  RotateCcw,
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

  // Group current topic's scenarios by logical flow/section
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

  // Handle instant voice preview in hero spotlight
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
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)] flex flex-col transition-colors duration-300">
      {/* Apple-grade Glass Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[var(--color-bg-base)]/80 backdrop-blur-xl border-b border-[var(--color-border)] safe-top-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm sm:text-base tracking-tight text-[var(--color-text-primary)]">
                English in Conversation
              </span>
              <span className="hidden md:inline ml-2 text-[10px] uppercase font-mono tracking-wider text-[var(--color-text-muted)]">
                Audio Experience
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--color-accent-subtle)] text-xs font-medium text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                <Trophy className="w-3 h-3" />
                <span>
                  Đã luyện {completedCount}/{totalScenarios} bài
                </span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Narrative Flow */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* Section 1: The Linear/Apple-style Split Hero */}
        {!searchQuery && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (58%): The Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] inline-block" />
                <span>Luyện giao tiếp qua phản xạ âm thanh thực tế</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.12]">
                  Nói tiếng Anh tự nhiên.
                  <br />
                  <span className="text-[var(--color-text-muted)] font-medium">
                    Không nhồi nhét ngữ pháp.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl pt-1">
                  Đeo tai nghe, bật micro và đối đáp 1-on-1 cùng Trợ lý AI bản xứ. Ứng dụng hỗ trợ làm mờ phụ đề để ép tai bắt âm, cùng tính năng gợi ý thông minh khi bạn chưa biết cách mở lời.
                </p>
              </div>

              {/* Primary CTA + Trust Signals */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
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
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-all shadow-md active:scale-98 cursor-pointer press-spring"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Bắt đầu bài luyện tập ngay</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
                  <span>✓ 18 tình huống đời sống</span>
                  <span>•</span>
                  <span>✓ Web Speech chuẩn xác</span>
                  <span>•</span>
                  <span>✓ 100% miễn phí</span>
                </p>
              </div>
            </div>

            {/* Right Column (42%): The Product Spotlight (Interactive Live Studio Canvas) */}
            {featuredScenario && (
              <div className="lg:col-span-5">
                <div className="rounded-2xl p-5 sm:p-6 bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-dreamy space-y-4 relative overflow-hidden">
                  {/* Spotlight Header */}
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 text-xs">
                    <div className="flex items-center gap-2 text-[var(--color-accent)] font-semibold">
                      <TopicIcon topicId={selectedTopic.id} className="w-4 h-4" />
                      <span>{selectedTopic.titleEn}</span>
                    </div>
                    <span className="text-[var(--color-text-muted)] font-mono">
                      Bài #{featuredScenario.order || 1}
                    </span>
                  </div>

                  {/* Spotlight Title & Situation */}
                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                      {featuredScenario.titleEn}
                    </h2>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {featuredScenario.titleVi}
                    </p>
                  </div>

                  {/* Interactive Live Dialogue Simulation */}
                  <div className="space-y-2.5 pt-1">
                    {/* Simulated AI Turn */}
                    <div className="p-3.5 rounded-xl bg-[var(--color-bg-subtle)] space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                        <span className="font-semibold text-[var(--color-accent)]">
                          {featuredScenario.defaultRoles.ai.name} (AI)
                        </span>
                        {/* Audio Preview Button */}
                        <button
                          type="button"
                          onClick={(e) => handleTogglePreviewAudio(featuredScenario, e)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                            previewingAudioScenarioId === featuredScenario.id
                              ? "bg-[var(--color-accent)] text-white"
                              : "text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]"
                          }`}
                          title="Nghe câu mở đầu này"
                        >
                          {previewingAudioScenarioId === featuredScenario.id ? (
                            <>
                              <div className="flex items-end gap-0.5 h-2">
                                <span className="w-0.5 bg-white rounded-full animate-wave-1" />
                                <span className="w-0.5 bg-white rounded-full animate-wave-2" />
                              </div>
                              <span>Đang phát...</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Nghe mẫu</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)] leading-relaxed italic">
                        "{featuredScenario.initialMessageEn}"
                      </p>
                    </div>

                    {/* Simulated Learner Target */}
                    <div className="p-3.5 rounded-xl border border-[var(--color-border)] space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                        <span>
                          Bạn đóng vai:{" "}
                          <strong className="text-[var(--color-text-primary)]">
                            {getLearnerRole(featuredScenario) === "user"
                              ? featuredScenario.defaultRoles.user.name
                              : featuredScenario.defaultRoles.ai.name}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleLearnerRole(featuredScenario.id, e)}
                          className="text-[11px] font-medium text-[var(--color-accent)] hover:underline cursor-pointer"
                        >
                          Đổi vai
                        </button>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                        {featuredScenario.situation}
                      </p>
                    </div>
                  </div>

                  {/* Direct Launch Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        onStartScenario(
                          selectedTopic,
                          featuredScenario,
                          getLearnerRole(featuredScenario)
                        )
                      }
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-all cursor-pointer press-spring"
                    >
                      <span>Vào phòng đối thoại</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section 2: The Curated Situational Pathway (Timeline / Linear Tracklist) */}
        <section className="space-y-8 pt-4 border-t border-[var(--color-border)]">
          {/* Section Header & Topic Segmented Rail */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  Lộ Trình Các Tình Huống
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
                  Chọn chủ đề và theo dõi các chặng giao tiếp thực tế ({totalScenarios} bài học)
                </p>
              </div>

              {/* Minimal Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm tình huống, từ khóa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden focus:border-[var(--color-accent)] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Topic Switcher Ribbon (Apple Segmented Bar) */}
            {!searchQuery && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer press-spring ${
                        isSelected
                          ? "bg-[var(--color-text-primary)] text-[var(--color-bg-base)] shadow-sm font-semibold"
                          : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
                      }`}
                    >
                      <TopicIcon topicId={t.id} className="w-3.5 h-3.5" />
                      <span>{t.titleVi}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected
                            ? "bg-[var(--color-bg-surface)]/20 text-inherit"
                            : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        {completedInTopic > 0 ? `${completedInTopic}/${t.scenarios.length}` : t.scenarios.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sequential Chapter Pathway / Tracklist */}
          {searchedScenarios ? (
            /* Search Results */
            <div className="space-y-3">
              <p className="text-xs text-[var(--color-text-muted)]">
                Tìm thấy <strong>{searchedScenarios.length}</strong> tình huống:
              </p>
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-surface)] overflow-hidden">
                {searchedScenarios.map(({ topic, scenario }, idx) => (
                  <div
                    key={scenario.id}
                    onClick={() => onStartScenario(topic, scenario, getLearnerRole(scenario))}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-[var(--color-text-muted)] w-6">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-1.5 py-0.2 rounded">
                            {topic.titleVi}
                          </span>
                          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent)] transition-colors">
                            {scenario.titleEn}
                          </h4>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                          {scenario.titleVi}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Topic Chapters Flow */
            <div className="space-y-8">
              {Object.entries(sections).map(([sectionName, scenarios]) => (
                <div key={sectionName} className="space-y-3">
                  <div className="flex items-center gap-2 px-1 text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                    <span className="w-2 h-px bg-[var(--color-border)]" />
                    <span>{sectionName}</span>
                  </div>

                  <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-surface)] overflow-hidden shadow-sm">
                    {scenarios.map((sc, idx) => {
                      const isCompleted = completedScenarioIds.includes(sc.id);
                      const currentRole = getLearnerRole(sc);

                      return (
                        <div
                          key={sc.id}
                          className="p-4 sm:p-4.5 flex items-center justify-between gap-4 hover:bg-[var(--color-bg-subtle)] transition-colors group"
                        >
                          {/* Left: Sequence index & Situation info */}
                          <div
                            className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1 cursor-pointer"
                            onClick={() => onStartScenario(selectedTopic, sc, currentRole)}
                          >
                            <div className="w-6 text-xs font-mono text-[var(--color-text-muted)] flex items-center justify-center flex-shrink-0">
                              {isCompleted ? (
                                <Check className="w-4 h-4 text-[var(--color-accent)]" />
                              ) : (
                                String(sc.order || idx + 1).padStart(2, "0")
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                                  {sc.titleEn}
                                </h3>
                                {sc.isFreeTalk && (
                                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded-md">
                                    Tự do
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                                {sc.titleVi}
                              </p>
                            </div>
                          </div>

                          {/* Right: Controls & Launch */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-[11px] font-mono text-[var(--color-text-muted)] hidden md:inline">
                              {sc.vocabulary.length} từ vựng
                            </span>

                            {/* Role selector */}
                            <button
                              type="button"
                              onClick={(e) => toggleLearnerRole(sc.id, e)}
                              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-base)] transition-colors cursor-pointer"
                              title="Đổi vai đóng"
                            >
                              <RoleIcon role={currentRole} className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                              <span>{currentRole === "user" ? sc.defaultRoles.user.name : sc.defaultRoles.ai.name}</span>
                            </button>

                            {/* Voice Sample Preview */}
                            {sc.initialMessageEn && (
                              <button
                                type="button"
                                onClick={(e) => handleTogglePreviewAudio(sc, e)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  previewingAudioScenarioId === sc.id
                                    ? "bg-[var(--color-accent)] text-white"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-base)]"
                                }`}
                                title="Nghe câu mở đầu"
                                aria-label="Nghe thử câu mở đầu"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            )}

                            {/* Action Button */}
                            <button
                              type="button"
                              onClick={() => onStartScenario(selectedTopic, sc, currentRole)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer active:scale-95 press-spring"
                            >
                              <span>Luyện</span>
                              <Play className="w-2.5 h-2.5 fill-current" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 3: The 3 Core Pedagogical Breakthroughs (Law 2: One Thing Per Section) */}
        <section className="pt-8 border-t border-[var(--color-border)] space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Phương Pháp Luyện Phản Xạ Âm Thanh
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Được thiết kế dựa trên quy luật phản xạ tự nhiên của não bộ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Luyện Nghe Bắt Âm (Ear-First)
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Chế độ làm mờ phụ đề buộc tai bạn phải bắt âm ngữ điệu của người bản xứ thay vì lệ thuộc vào việc đọc chữ bằng mắt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Đàm Thoại 2 Chiều Không Độ Trễ
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                AI thấu hiểu ý của bạn và phản hồi ngắn gọn 1–2 câu trong chưa đầy 1 giây, tạo nhịp đối đáp liên tục như nói chuyện ngoài đời thực.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Gợi Ý Phát Âm Chống "Đứng Hình"
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Mỗi khi lúng túng chưa biết đáp lại thế nào, bạn có thể bấm nghe phát âm thử các mẫu câu gợi ý để nhại lại ngay lập tức.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Apple-style Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 text-center text-xs text-[var(--color-text-muted)] safe-bottom-padding">
        <p className="max-w-md mx-auto">
          English in Conversation • Thiết kế chuẩn Apple Audio & Linear Experience.
        </p>
      </footer>
    </div>
  );
};
