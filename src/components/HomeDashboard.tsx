"use client";

import React, { useState, useMemo } from "react";
import {
  Mic,
  ArrowRight,
  Volume2,
  Headphones,
  Check,
  ChevronRight,
  Search,
  X,
  Trophy,
  Play,
  Ear,
  Zap,
  Sparkles,
} from "lucide-react";
import { Topic, Scenario } from "@/types/conversation";
import { ThemeToggle } from "./ThemeToggle";
import { TopicIcon, RoleIcon } from "./TopicIcons";
import { speakText, stopSpeaking } from "@/utils/speech";
import { CassetteDeck } from "./CassetteDeck";

interface HomeDashboardProps {
  topics: Topic[];
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onStartScenario: (topic: Topic, scenario: Scenario, role: "user" | "ai") => void;
  completedScenarioIds?: string[];
}

// Helper to remove any raw decorative emoji prefixes from topic/section names
function cleanLabel(text: string): string {
  return text.replace(/^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, "").trim();
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
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Active scenario for cassette deck (defaults to first scenario of selected topic)
  const activeScenario = useMemo(() => {
    if (activeScenarioId) {
      const found = selectedTopic.scenarios.find((s) => s.id === activeScenarioId);
      if (found) return found;
    }
    return selectedTopic.scenarios[0] || null;
  }, [selectedTopic, activeScenarioId]);

  // Group current topic's scenarios by logical flow/section
  const sections = useMemo(() => {
    const map: { [sectionName: string]: Scenario[] } = {};
    selectedTopic.scenarios.forEach((s) => {
      const sec = cleanLabel(s.section || "Tình huống thực tế");
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

  // Handle voice preview in hero spotlight and tracklist
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
    <div className="min-h-[100dvh] bg-[var(--color-bg-base)] text-[var(--color-text-primary)] flex flex-col transition-colors duration-250">
      {/* Top Navigation Bar in natural document flow - zero content overlap */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]/95 backdrop-blur-md safe-top-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-amber-600/30">
              <Headphones className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-[var(--color-text-primary)]">
                English in Conversation
              </span>
            </div>
          </div>

          {/* Right Action Hub */}
          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-bg-subtle)] text-xs font-semibold text-[var(--color-text-secondary)]">
                <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>
                  Completed {completedCount}/{totalScenarios}
                </span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Narrative Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* Section 1: The Asymmetric Hero Spread */}
        {!searchQuery && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (55%): Confident English Typography & Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.08]">
                  Real conversations.
                  <span className="text-[var(--color-text-muted)] font-normal block sm:inline"> Zero hesitation.</span>
                </h1>
                <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                  Put on your headphones, tap the mic, and roleplay 1-on-1 with native AI partners. Train your acoustic reflex with smart subtitle masking and instant voice shadowing.
                </p>
              </div>

              {/* Single Primary Action */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {activeScenario && (
                    <button
                      type="button"
                      onClick={() =>
                        onStartScenario(
                          selectedTopic,
                          activeScenario,
                          getLearnerRole(activeScenario)
                        )
                      }
                      className="inline-flex items-center justify-between gap-4 pl-6 pr-2.5 py-3.5 rounded-full text-base font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 press-tactile cursor-pointer group shadow-lg shadow-amber-500/25 transition-all"
                    >
                      <span>Start Speaking</span>
                      <span className="w-9 h-9 rounded-full bg-stone-950 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Mic className="w-4 h-4 text-white" strokeWidth={2} />
                      </span>
                    </button>
                  )}
                </div>

                {/* Substantive Value Indicators */}
                <div className="text-xs sm:text-sm text-[var(--color-text-muted)] flex flex-wrap items-center gap-3 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
                    18 real-world scenarios
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
                    Voice recognition
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
                    100% free & open
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (45%): Tactile Analog Cassette Player Centerpiece */}
            {activeScenario && (
              <div className="lg:col-span-6">
                <CassetteDeck
                  topic={selectedTopic}
                  scenario={activeScenario}
                  scenarios={selectedTopic.scenarios}
                  onSelectScenario={(sc) => setActiveScenarioId(sc.id)}
                  onStartScenario={onStartScenario}
                  learnerRole={getLearnerRole(activeScenario)}
                  onToggleLearnerRole={() =>
                    setRolePreferences((prev) => ({
                      ...prev,
                      [activeScenario.id]: prev[activeScenario.id] === "ai" ? "user" : "ai",
                    }))
                  }
                />
              </div>
            )}
          </section>
        )}

        {/* Section 2: Curated Tracklist */}
        <section className="space-y-8 pt-8 border-t border-[var(--color-border)]">
          {/* Header & Search */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  Explore Scenarios
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Select a topic to navigate practical spoken dialogues ({totalScenarios} lessons)
                </p>
              </div>

              {/* Minimal Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search scenarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 text-sm rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden focus:border-amber-600 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Topic Switcher Ribbon (Clean Tabs) */}
            {!searchQuery && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm whitespace-nowrap transition-all cursor-pointer press-tactile ${
                        isSelected
                          ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                          : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-amber-600/40 font-medium"
                      }`}
                    >
                      <TopicIcon topicId={t.id} className="w-4 h-4" />
                      <span>{cleanLabel(t.titleVi)}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? "bg-stone-950/15 text-stone-950"
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
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                Found <strong>{searchedScenarios.length}</strong> scenario(s):
              </p>
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-surface)] overflow-hidden">
                {searchedScenarios.map(({ topic, scenario }, idx) => (
                  <div
                    key={scenario.id}
                    onClick={() => {
                      setActiveScenarioId(scenario.id);
                      onStartScenario(topic, scenario, getLearnerRole(scenario));
                    }}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-sm font-semibold text-[var(--color-text-muted)] w-6">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            {cleanLabel(topic.titleVi)}
                          </span>
                          <h4 className="text-base font-semibold text-[var(--color-text-primary)] truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {scenario.titleEn}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] truncate mt-1">
                          {scenario.titleVi}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Topic Chapters Flow */
            <div className="space-y-8">
              {Object.entries(sections).map(([sectionName, scenarios]) => (
                <div key={sectionName} className="space-y-3">
                  <div className="flex items-center gap-2 px-1 text-xs sm:text-sm font-semibold text-[var(--color-text-muted)]">
                    <span className="w-2 h-px bg-[var(--color-border)]" />
                    <span>{cleanLabel(sectionName)}</span>
                  </div>

                  <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-surface)] overflow-hidden shadow-xs">
                    {scenarios.map((sc, idx) => {
                      const isCompleted = completedScenarioIds.includes(sc.id);
                      const currentRole = getLearnerRole(sc);
                      const isLoadedInDeck = activeScenario?.id === sc.id;

                      return (
                        <div
                          key={sc.id}
                          onClick={() => setActiveScenarioId(sc.id)}
                          className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors cursor-pointer group ${
                            isLoadedInDeck
                              ? "bg-amber-500/[0.06] border-l-4 border-amber-600"
                              : "hover:bg-[var(--color-bg-subtle)]"
                          }`}
                        >
                          {/* Left: Sequence index & Situation info */}
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="w-6 text-sm font-semibold text-[var(--color-text-muted)] flex items-center justify-center flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                </div>
                              ) : (
                                sc.order || idx + 1
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-[var(--color-text-primary)] group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors truncate">
                                  {sc.titleEn}
                                </h3>
                                {isLoadedInDeck && (
                                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    IN DECK
                                  </span>
                                )}
                                {sc.isFreeTalk && (
                                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    Open
                                  </span>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] truncate mt-1">
                                {sc.titleVi}
                              </p>
                            </div>
                          </div>

                          {/* Right: Controls & Launch */}
                          <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs text-[var(--color-text-muted)] hidden md:inline">
                              {sc.vocabulary.length} words
                            </span>

                            {/* Role selector */}
                            <button
                              type="button"
                              onClick={(e) => toggleLearnerRole(sc.id, e)}
                              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-subtle)] transition-colors cursor-pointer"
                              title="Switch role"
                            >
                              <RoleIcon role={currentRole} className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>{currentRole === "user" ? sc.defaultRoles.user.name : sc.defaultRoles.ai.name}</span>
                            </button>

                            {/* Voice Sample Preview */}
                            {sc.initialMessageEn && (
                              <button
                                type="button"
                                onClick={(e) => handleTogglePreviewAudio(sc, e)}
                                className={`p-2 rounded-full transition-colors cursor-pointer ${
                                  previewingAudioScenarioId === sc.id
                                    ? "bg-amber-600 text-white"
                                    : "text-[var(--color-text-muted)] hover:text-amber-700 dark:hover:text-amber-400 hover:bg-[var(--color-bg-subtle)]"
                                }`}
                                title="Listen to opening audio"
                                aria-label="Listen to opening sentence"
                              >
                                <Volume2 className="w-4 h-4" strokeWidth={2} />
                              </button>
                            )}

                            {/* Action Button: Warm amber pill */}
                            <button
                              type="button"
                              onClick={() => onStartScenario(selectedTopic, sc, currentRole)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--color-text-secondary)] group-hover:text-white bg-[var(--color-bg-subtle)] group-hover:bg-amber-600 dark:group-hover:bg-amber-600 transition-colors cursor-pointer"
                            >
                              <span>Practice</span>
                              <ChevronRight className="w-3.5 h-3.5" />
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

        {/* Section 3: The Pedagogical Methodology (Asymmetric Editorial Spread) */}
        <section className="pt-10 border-t border-[var(--color-border)] space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
              Designed around the brain's natural acoustic language acquisition reflex
            </p>
          </div>

          {/* Asymmetric 2-Column Spread (Breaks the 3-icon-card anti-pattern) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Left Column (7 cols): Ear-First Interactive Console */}
            <div className="lg:col-span-7 p-7 sm:p-8 rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  <Ear className="w-4 h-4" strokeWidth={2} />
                  <span>Acoustic Reflex</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                  Ear-First Listening Challenge
                </h3>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                  Smart subtitle masking challenges your ears to catch phonetics, connected speech, and intonation rather than relying on visual text reading.
                </p>
              </div>

              {/* Interactive Demo Area */}
              <div className="p-4 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <span>Masked native speech:</span>
                  <span className="text-amber-700 dark:text-amber-400 font-medium">Hover to unmask</span>
                </div>
                <p className="text-sm sm:text-base italic text-[var(--color-text-muted)] subtitle-blurred">
                  "Could I get a hot cappuccino with oat milk, please?"
                </p>
              </div>
            </div>

            {/* Right Column (5 cols): Stacked Secondary Cards */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Card A: Sub-second reflex */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-2.5 shadow-xs flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  <Zap className="w-4 h-4" strokeWidth={2} />
                  <span>Instant Cadence</span>
                </div>
                <h4 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                  Real-Time Conversation Flow
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Immediate 1–2 sentence AI responses (&lt;850ms) eliminate awkward silences and simulate the rapid cadence of everyday spoken English.
                </p>
              </div>

              {/* Card B: Voice Shadowing */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-2.5 shadow-xs flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" strokeWidth={2} />
                  <span>Shadowing Support</span>
                </div>
                <h4 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                  Instant Voice Shadowing
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Contextual quick-reply chips with instant audio preview let you hear native pronunciation before speaking, so you never freeze up.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-[var(--color-border)] py-10 text-center text-xs text-[var(--color-text-muted)] safe-bottom-padding">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            English in Conversation • Acoustic Reflex & Spoken English Experience.
          </p>
          <p>
            Designed with Apple & Linear Design Architecture
          </p>
        </div>
      </footer>
    </div>
  );
};
