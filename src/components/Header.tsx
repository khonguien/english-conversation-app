"use client";

import React from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Volume2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Scenario, Topic } from "@/types/conversation";
import { ThemeToggle } from "./ThemeToggle";

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
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 safe-top-padding transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Back to Home & Scenario Title Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200/80 dark:border-slate-700 flex-shrink-0 cursor-pointer"
              title="Quay lại Trang chủ chọn bài"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenScenarios}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700 transition text-left group min-w-0 cursor-pointer"
            title="Chọn chủ đề & tình huống khác"
          >
            <span className="text-xl sm:text-2xl flex-shrink-0">{topic.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate group-hover:text-slate-700 dark:group-hover:text-slate-200 transition">
                  {scenario.order}. {scenario.titleEn}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 flex-shrink-0 transition" />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                {scenario.titleVi}
              </p>
            </div>
          </button>
        </div>

        {/* Right: Interactive controls in unified Slate style */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Subtitle Toggle Button */}
          <button
            type="button"
            onClick={onToggleSubtitles}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition border cursor-pointer ${
              subtitlesEnabled
                ? "bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium"
                : "bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900 font-semibold shadow-2xs"
            }`}
            title={
              subtitlesEnabled
                ? "Đang bật chữ (Bấm để chuyển sang chế độ Luyện nghe / Ẩn chữ)"
                : "Đang ở chế độ Luyện nghe (Bấm để hiển thị đầy đủ chữ)"
            }
          >
            {subtitlesEnabled ? (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span className="hidden xs:inline">Hiện chữ</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-white dark:text-slate-900" />
                <span className="hidden xs:inline">Luyện nghe</span>
              </>
            )}
          </button>

          {/* Speech Rate Button */}
          <button
            type="button"
            onClick={onChangeSpeechRate}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200/80 dark:border-slate-700 cursor-pointer"
            title="Đổi tốc độ đọc tiếng Anh"
          >
            {speechRate}x
          </button>

          {/* Role Swap Button */}
          <button
            type="button"
            onClick={onToggleRole}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200/80 dark:border-slate-700 cursor-pointer"
            title="Đổi vai đóng (Hành khách ⇄ Nhân viên)"
          >
            <RefreshCw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span><span className="hidden sm:inline">Vai: </span>{userRoleInfo.avatar} {userRoleInfo.name}</span>
          </button>

          {/* Vocabulary Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleVocab}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition border cursor-pointer ${
              isVocabOpen
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            title="Xem danh sách từ vựng & mẫu câu"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Từ vựng</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              isVocabOpen ? "bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}>
              {scenario.vocabulary.length}
            </span>
          </button>

          {/* Theme Toggle Button (Light/Dark mode) */}
          <ThemeToggle />

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={onResetChat}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Bắt đầu lại đoạn hội thoại này"
            aria-label="Làm mới đoạn hội thoại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
