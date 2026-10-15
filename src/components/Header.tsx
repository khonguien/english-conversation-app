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
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#070b14]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 safe-top-padding transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2.5">
        {/* Left: Back to Home & Scenario Title Switcher */}
        <div className="flex items-center gap-2 min-w-0">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-slate-700/80 flex-shrink-0 cursor-pointer active:scale-95 shadow-2xs"
              title="Quay lại Trang chủ chọn bài"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenScenarios}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-100/70 dark:bg-slate-850/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/70 transition-all text-left group min-w-0 cursor-pointer shadow-2xs"
            title="Chọn chủ đề & tình huống khác"
          >
            <span className="text-xl sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              {topic.icon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                  {scenario.order}. {scenario.titleEn}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 flex-shrink-0 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {scenario.titleVi}
              </p>
            </div>
          </button>
        </div>

        {/* Right: Interactive controls in modern segmented pill style */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Subtitle Toggle Button */}
          <button
            type="button"
            onClick={onToggleSubtitles}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all border cursor-pointer active:scale-95 shadow-2xs ${
              subtitlesEnabled
                ? "bg-slate-100/90 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 font-semibold"
                : "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-white font-bold shadow-amber-500/20 shadow-sm"
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
                <EyeOff className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="hidden xs:inline">Luyện nghe</span>
              </>
            )}
          </button>

          {/* Speech Rate Button */}
          <button
            type="button"
            onClick={onChangeSpeechRate}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700 cursor-pointer active:scale-95 shadow-2xs"
            title="Đổi tốc độ đọc tiếng Anh"
          >
            {speechRate}x
          </button>

          {/* Role Swap Button */}
          <button
            type="button"
            onClick={onToggleRole}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700 cursor-pointer active:scale-95 shadow-2xs group"
            title="Đổi vai đóng (Hành khách ⇄ Nhân viên)"
          >
            <RefreshCw className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
            <span className="truncate">
              <span className="hidden sm:inline text-slate-400 font-normal">Vai: </span>
              {userRoleInfo.avatar} {userRoleInfo.name}
            </span>
          </button>

          {/* Vocabulary Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleVocab}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 shadow-2xs ${
              isVocabOpen
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-sm"
                : "bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700"
            }`}
            title="Xem danh sách từ vựng & mẫu câu"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Từ vựng</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isVocabOpen
                  ? "bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-950"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              }`}
            >
              {scenario.vocabulary.length}
            </span>
          </button>

          {/* Theme Toggle Button (Light/Dark mode) */}
          <ThemeToggle />

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={onResetChat}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-95"
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
