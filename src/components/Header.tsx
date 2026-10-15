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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0c0e14]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-white/10 safe-top-padding transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2.5">
        {/* Left: Back to Home & Scenario Title Switcher */}
        <div className="flex items-center gap-2 min-w-0">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 transition-colors border border-stone-200/80 dark:border-white/10 flex-shrink-0 cursor-pointer active:scale-95"
              title="Quay lại Trang chủ"
              aria-label="Quay lại Trang chủ"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenScenarios}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-white/5 hover:bg-stone-100 dark:hover:bg-white/10 border border-stone-200/80 dark:border-white/10 transition-colors text-left group min-w-0 cursor-pointer"
            title="Đổi chủ đề hoặc tình huống khác"
            aria-label="Đổi chủ đề hoặc tình huống khác"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <TopicIcon topicId={topic.id} className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {scenario.order ? `${scenario.order}. ` : ""}{scenario.titleEn}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 flex-shrink-0 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {scenario.titleVi}
              </p>
            </div>
          </button>
        </div>

        {/* Right: Interactive controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Subtitle / Listening Challenge Toggle Button */}
          <button
            type="button"
            onClick={onToggleSubtitles}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors border cursor-pointer active:scale-95 ${
              subtitlesEnabled
                ? "bg-white dark:bg-white/5 border-stone-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/10 font-semibold"
                : "bg-emerald-700 dark:bg-emerald-600 border-emerald-600 text-white font-bold"
            }`}
            title={
              subtitlesEnabled
                ? "Bấm để bật chế độ Luyện Nghe (che phụ đề)"
                : "Đang bật chế độ Luyện Nghe (bấm để hiện phụ đề)"
            }
            aria-label={
              subtitlesEnabled
                ? "Bật chế độ Luyện Nghe"
                : "Tắt chế độ Luyện Nghe"
            }
          >
            {subtitlesEnabled ? (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span className="hidden xs:inline">Hiện chữ</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-white" />
                <span className="hidden xs:inline">Luyện nghe</span>
              </>
            )}
          </button>

          {/* Speech Rate Button */}
          <button
            type="button"
            onClick={onChangeSpeechRate}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors border border-stone-200/80 dark:border-white/10 cursor-pointer active:scale-95"
            title="Đổi tốc độ đọc tiếng Anh (0.8x / 1.0x / 1.2x)"
            aria-label={`Tốc độ đọc hiện tại: ${speechRate}x`}
          >
            {speechRate}x
          </button>

          {/* Role Swap Button */}
          <button
            type="button"
            onClick={onToggleRole}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors border border-stone-200/80 dark:border-white/10 cursor-pointer active:scale-95 group"
            title="Đổi vai đóng (Hành khách ⇄ Nhân viên)"
            aria-label="Đổi vai đóng"
          >
            <RoleIcon role={userRole} className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate max-w-[120px]">
              <span className="hidden sm:inline text-slate-400 font-normal">Vai: </span>
              {userRoleInfo.name}
            </span>
            <RefreshCw className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-300 ml-0.5" />
          </button>

          {/* Vocabulary Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleVocab}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border cursor-pointer active:scale-95 ${
              isVocabOpen
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white"
                : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-stone-200/80 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10"
            }`}
            title="Xem danh sách từ vựng & mẫu câu"
            aria-label="Mở danh sách từ vựng"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Từ vựng</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isVocabOpen
                  ? "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-950"
                  : "bg-stone-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
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
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer active:scale-95"
            title="Bắt đầu lại đoạn hội thoại"
            aria-label="Bắt đầu lại đoạn hội thoại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
