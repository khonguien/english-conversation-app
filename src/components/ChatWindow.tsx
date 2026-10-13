"use client";

import React, { useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { ChatMessage, Scenario } from "@/types/conversation";

interface ChatWindowProps {
  messages: ChatMessage[];
  subtitlesEnabled: boolean;
  speechRate: number;
  isAiThinking: boolean;
  activeAudioId: string | null;
  onPlayAudio: (msgId: string, text: string) => void;
  onStopAudio: () => void;
  onToggleReveal: (msgId: string) => void;
  scenario: Scenario;
  userRole?: "user" | "ai";
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  subtitlesEnabled,
  speechRate,
  isAiThinking,
  activeAudioId,
  onPlayAudio,
  onStopAudio,
  onToggleReveal,
  scenario,
  userRole = "user",
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const isPlayingAsAiRole = userRole === "ai";
  const currentAiRole = isPlayingAsAiRole
    ? scenario.defaultRoles.user
    : scenario.defaultRoles.ai;
  const currentLearnerRole = isPlayingAsAiRole
    ? scenario.defaultRoles.ai
    : scenario.defaultRoles.user;

  // Auto-scroll when messages or AI thinking status changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiThinking]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 max-w-3xl mx-auto w-full">
      {/* Scenario Briefing Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
            {currentAiRole.avatar || "💬"}
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>{scenario.order}. {scenario.titleEn} – {scenario.titleVi}</span>
                {scenario.isFreeTalk && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                    Tự do
                  </span>
                )}
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {scenario.situation}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
              <span className="bg-slate-100 px-2.5 py-1 rounded-full text-slate-700 font-medium border border-slate-200/80">
                AI: {currentAiRole.avatar} {currentAiRole.name}
              </span>
              <span className="bg-slate-900 px-2.5 py-1 rounded-full text-white font-medium">
                Bạn: {currentLearnerRole.avatar} {currentLearnerRole.name}
              </span>
              <span className="text-slate-500 font-normal">
                {scenario.isFreeTalk
                  ? "• Trò chuyện tự do không ràng buộc"
                  : "• Luyện đối thoại theo ngữ cảnh"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Opening turn prompt when learner speaks first and no messages exist yet */}
      {messages.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-xl">
            🎙️
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-slate-900">
            Đến lượt bạn mở lời trước!
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Bạn đang đóng vai{" "}
            <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {currentLearnerRole.avatar} {currentLearnerRole.name}
            </span>.
            Bấm nút Micro bên dưới hoặc chọn câu gợi ý để bắt đầu cuộc trò chuyện.
          </p>
        </div>
      )}

      {/* Messages Thread */}
      {messages.map((msg) => {
        const isAi = msg.sender === "ai";
        const isPlaying = activeAudioId === msg.id;
        const isRevealed = subtitlesEnabled || msg.revealed;

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-2 sm:gap-2.5 ${
              isAi ? "justify-start" : "justify-end"
            }`}
          >
            {/* AI Avatar */}
            {isAi && (
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm flex-shrink-0 text-slate-700 shadow-2xs mb-0.5">
                {currentAiRole.avatar}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-2xs transition ${
                isAi
                  ? "bg-white border border-slate-200/90 text-slate-900 rounded-tl-sm"
                  : "bg-slate-900 text-white rounded-tr-sm"
              }`}
            >
              {/* Header inside bubble */}
              <div className="flex items-center justify-between gap-3 mb-1">
                <span
                  className={`text-[10px] font-semibold tracking-wider uppercase ${
                    isAi ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {msg.roleName}
                </span>

                {isAi && (
                  <div className="flex items-center gap-1">
                    {/* First message prompt on Safari/iOS if autoplay was blocked */}
                    {messages.length === 1 && !isPlaying && (
                      <button
                        type="button"
                        onClick={() => onPlayAudio(msg.id, msg.textEn)}
                        className="flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-0.5 rounded-full transition cursor-pointer"
                        title="Bấm để nghe AI nói"
                      >
                        <Volume2 className="w-3 h-3 text-slate-700" />
                        <span>Nghe AI nói</span>
                      </button>
                    )}

                    {/* Audio Play/Stop Button */}
                    <button
                      type="button"
                      onClick={() =>
                        isPlaying
                          ? onStopAudio()
                          : onPlayAudio(msg.id, msg.textEn)
                      }
                      className={`p-1 rounded-full transition cursor-pointer ${
                        isPlaying
                          ? "bg-slate-900 text-white animate-pulse"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      }`}
                      title={isPlaying ? "Dừng phát" : "Nghe phát âm"}
                      aria-label={isPlaying ? "Dừng phát âm" : "Phát âm câu này"}
                    >
                      {isPlaying ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Spoken Text Area */}
              {isAi ? (
                <div>
                  {isRevealed ? (
                    <div className="space-y-1">
                      <p className="text-[15px] sm:text-base font-normal leading-relaxed text-slate-900">
                        {msg.textEn}
                      </p>
                      {msg.textVi && (
                        <p className="text-xs sm:text-[13px] text-slate-500 leading-normal pt-1 border-t border-slate-100">
                          {msg.textVi}
                        </p>
                      )}
                      {!subtitlesEnabled && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => onToggleReveal(msg.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition cursor-pointer"
                            title="Ẩn lại phụ đề câu này"
                          >
                            <EyeOff className="w-3 h-3" />
                            <span>Ẩn lại phụ đề</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Listening Challenge Mode: Elegant Blur-to-reveal */
                    <button
                      type="button"
                      onClick={() => onToggleReveal(msg.id)}
                      className="text-left w-full cursor-pointer group focus:outline-hidden"
                      title="Chạm để xem phụ đề câu này"
                    >
                      <div className="filter blur-xs select-none transition duration-200 group-hover:blur-[2px] space-y-1">
                        <p className="text-[15px] sm:text-base font-normal leading-relaxed text-slate-700">
                          {msg.textEn}
                        </p>
                        {msg.textVi && (
                          <p className="text-xs text-slate-400 pt-1 border-t border-slate-100">
                            {msg.textVi}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 group-hover:text-slate-800 transition mt-1 pt-1 border-t border-slate-100">
                        <Eye className="w-3 h-3" />
                        <span>Chạm để mở phụ đề</span>
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                /* User Message */
                <p className="text-[15px] sm:text-base leading-relaxed text-white font-normal">
                  {msg.textEn}
                </p>
              )}
            </div>

            {/* User Avatar */}
            {!isAi && (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm flex-shrink-0 text-slate-200 shadow-2xs mb-0.5">
                {scenario.defaultRoles.user.avatar}
              </div>
            )}
          </div>
        );
      })}

      {/* AI Thinking Animation */}
      {isAiThinking && (
        <div className="flex items-end gap-2.5 justify-start">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm flex-shrink-0 text-slate-700 shadow-2xs">
            {scenario.defaultRoles.ai.avatar}
          </div>
          <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm px-4 py-3 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span
                className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
              <span className="text-slate-500 text-xs ml-1.5">
                {scenario.defaultRoles.ai.name} đang suy nghĩ...
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-2" />
    </div>
  );
};
