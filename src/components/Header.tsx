"use client";

import React from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  RotateCcw,
  ChevronDown,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Scenario, Topic } from "@/types/conversation";
import { ThemeToggle } from "./ThemeToggle";
import { TopicIcon, RoleIcon } from "./TopicIcons";

interface HeaderProps {
  topic: Topic;
  scenario: Scenario;
  subtitlesEnabled: boolean;
  onToggleSubtitles: () => void;
  speechRate: number;
  onChangeSpeechRate: () => void;
  isVocabOpen: boolean;
  onToggleVocab: () => void;
  onOpenScenarios: () => void;
  onResetChat: () => void;
  userRole: "user" | "ai";
  onToggleRole: () => void;
  onBackToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  topic,
  scenario,
  subtitlesEnabled,
  onToggleSubtitles,
  speechRate,
  onChangeSpeechRate,
  isVocabOpen,
  onToggleVocab,
  onOpenScenarios,
  onResetChat,
  userRole,
  onToggleRole,
  onBackToHome,
}) => {
  const isPlayingAsStaff = userRole === "ai";
  const userRoleInfo = isPlayingAsStaff
    ? scenario.defaultRoles.ai
    : scenario.defaultRoles.user;

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-bg-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] safe-top-padding transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Left: Back to Home & Scenario Title Switcher */}
        <div className="flex items-center gap-2.5 min-w-0">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-subtle)] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-all border border-[var(--color-border)] flex-shrink-0 cursor-pointer press-tactile"
              title="Return to Home"
              aria-label="Return to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          {/* Scenario Trigger Capsule */}
          <button
            type="button"
            onClick={onOpenScenarios}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[var(--color-bg-subtle)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] border border-[var(--color-border)] transition-all text-left group min-w-0 cursor-pointer press-tactile"
            title="Switch scenario"
            aria-label="Switch scenario"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <TopicIcon topicId={topic.id} className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {scenario.order ? `${scenario.order}. ` : ""}{scenario.titleEn}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] flex-shrink-0 transition-colors" />
              </div>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {scenario.titleVi}
              </p>
            </div>
          </button>
        </div>

        {/* Right: Interactive controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Subtitle / Listening Challenge Toggle Button */}
          <button
            type="button"
            onClick={onToggleSubtitles}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all border cursor-pointer press-tactile ${
              subtitlesEnabled
                ? "bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold"
                : "bg-amber-600 dark:bg-amber-600 border-amber-600 dark:border-amber-600 text-white font-bold shadow-xs"
            }`}
            title={
              subtitlesEnabled
                ? "Switch to Ear-First mode (blur subtitles)"
                : "Subtitle blur active (tap to reveal text)"
            }
            aria-label="Toggle subtitles"
          >
            {subtitlesEnabled ? (
              <>
                <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="hidden xs:inline">Subtitles</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                <span className="hidden xs:inline">Ear-First</span>
              </>
            )}
          </button>

          {/* Speech Rate Button */}
          <button
            type="button"
            onClick={onChangeSpeechRate}
            className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-subtle)] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-all border border-[var(--color-border)] cursor-pointer press-tactile"
            title="Speech Rate (0.8x / 1.0x / 1.2x)"
            aria-label={`Current rate: ${speechRate}x`}
          >
            {speechRate}x
          </button>

          {/* Role Swap Button */}
          <button
            type="button"
            onClick={onToggleRole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-subtle)] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-all border border-[var(--color-border)] cursor-pointer press-tactile group"
            title="Switch roles"
            aria-label="Switch roles"
          >
            <RoleIcon role={userRole} className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="truncate max-w-[120px]">
              <span className="hidden sm:inline text-[var(--color-text-muted)] font-normal">Role: </span>
              {userRoleInfo.name}
            </span>
            <RefreshCw className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:rotate-180 transition-transform duration-300 ml-0.5" />
          </button>

          {/* Vocabulary Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleVocab}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer press-tactile ${
              isVocabOpen
                ? "bg-[var(--color-text-primary)] text-[var(--color-bg-base)] border-[var(--color-text-primary)] shadow-sm"
                : "bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-[var(--color-border)]"
            }`}
            title="Vocabulary & key phrases"
            aria-label="Open vocabulary"
          >
            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Vocab</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                isVocabOpen
                  ? "bg-white/20 text-inherit"
                  : "bg-emerald-500/[0.12] text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {scenario.vocabulary.length}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={onResetChat}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] rounded-full transition-colors cursor-pointer press-tactile"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
};
