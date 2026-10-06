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
} from "lucide-react";
import { Scenario, Topic } from "@/types/conversation";

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
}) => {
  const isPlayingAsStaff = userRole === "ai";
  const userRoleInfo = isPlayingAsStaff
    ? scenario.defaultRoles.ai
    : scenario.defaultRoles.user;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm safe-top-padding">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Scenario Title & Switcher */}
        <button
          onClick={onOpenScenarios}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition text-left group min-w-0"
          title="Chọn chủ đề & tình huống khác"
        >
          <span className="text-xl sm:text-2xl flex-shrink-0">{topic.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition">
                {scenario.order}. {scenario.titleEn}
              </h1>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0 transition" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">
              {scenario.titleVi}
            </p>
          </div>
        </button>

        {/* Right: Interactive controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Subtitle Toggle Button */}
          <button
            onClick={onToggleSubtitles}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
              subtitlesEnabled
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs"
                : "bg-amber-50 border-amber-300 text-amber-800 shadow-xs"
            }`}
            title={
              subtitlesEnabled
                ? "Đang bật chữ (Bấm để chuyển sang chế độ Ẩn chữ / Luyện nghe)"
                : "Đang ẩn chữ để luyện nghe (Bấm để hiện chữ)"
            }
          >
            {subtitlesEnabled ? (
              <>
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden xs:inline">Hiện chữ</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden xs:inline font-bold">Luyện nghe</span>
              </>
            )}
          </button>

          {/* Speech Rate Button */}
          <button
            onClick={onChangeSpeechRate}
            className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
            title="Đổi tốc độ đọc tiếng Anh"
          >
            {speechRate}x
          </button>

          {/* Role Swap Button */}
          <button
            onClick={onToggleRole}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
            title="Đổi vai đóng (Hành khách ⇄ Nhân viên)"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span><span className="hidden sm:inline">Vai: </span>{userRoleInfo.avatar} {userRoleInfo.name}</span>
          </button>

          {/* Vocabulary Drawer Toggle */}
          <button
            onClick={onToggleVocab}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
              isVocabOpen
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            }`}
            title="Xem danh sách từ vựng & mẫu câu"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Từ vựng</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-200/60 rounded-full font-bold">
              {scenario.vocabulary.length}
            </span>
          </button>

          {/* Reset Conversation */}
          <button
            onClick={onResetChat}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="Bắt đầu lại đoạn hội thoại này"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
