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

  const [isSituationExpanded, setIsSituationExpanded] = React.useState(false);
  const isAiSpeaking = activeAudioId !== null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Top Half: AI Character Persona & Soundwave Stage */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-3 sm:py-4 shadow-2xs flex-shrink-0">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-2">
          {/* Avatar with Soundwave Glow */}
          <div className="relative">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 border-2 border-slate-200 flex items-center justify-center text-2xl sm:text-3xl shadow-sm transition-transform duration-300 ${
                isAiSpeaking ? "scale-105 ring-4 ring-slate-900/10" : ""
              }`}
            >
              {currentAiRole.avatar || "☕"}
            </div>

            {/* Speaking Badge */}
            {isAiSpeaking && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            )}
          </div>

          {/* AI Character Name & Role */}
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                {currentAiRole.name}
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200/80">
                AI Partner
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentAiRole.titleVi || currentAiRole.titleEn}
            </p>
          </div>

          {/* Soundwave Visualizer Bars */}
          <div className="flex items-center gap-1.5 h-7">
            {isAiSpeaking ? (
              <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                <span className="w-1 bg-slate-900 rounded-full animate-soundwave-1" />
                <span className="w-1 bg-slate-900 rounded-full animate-soundwave-2" />
                <span className="w-1 bg-slate-900 rounded-full animate-soundwave-3" />
                <span className="w-1 bg-slate-900 rounded-full animate-soundwave-4" />
                <span className="w-1 bg-slate-900 rounded-full animate-soundwave-5" />
                <span className="text-[11px] font-semibold text-slate-800 ml-1.5">
                  Đang nói...
                </span>
              </div>
            ) : isAiThinking ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-[11px] text-slate-600 font-medium">
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce" />
                <span
                  className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
                <span className="ml-1">Đang suy nghĩ...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1 text-slate-400 text-[11px] font-medium">
                <span className="w-1 h-1.5 bg-slate-300 rounded-full" />
                <span className="w-1 h-2 bg-slate-300 rounded-full" />
                <span className="w-1 h-1.5 bg-slate-300 rounded-full" />
                <span className="ml-1">Sẵn sàng lắng nghe</span>
              </div>
            )}
          </div>

          {/* Collapsible Situation Context Pill */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setIsSituationExpanded(!isSituationExpanded)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 px-3 py-1 rounded-full transition cursor-pointer"
            >
              <span>📍 {scenario.order}. {scenario.titleEn}</span>
              <span className="text-slate-400 text-[11px]">
                {isSituationExpanded ? "▲ Thu gọn" : "▼ Xem ngữ cảnh"}
              </span>
            </button>

            {isSituationExpanded && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 leading-relaxed text-left max-w-lg mx-auto shadow-2xs animate-in fade-in duration-150">
                <p className="font-medium text-slate-800 mb-1">
                  Bối cảnh: {scenario.situation}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                  <span>Bạn đang đóng vai: <strong>{currentLearnerRole.avatar} {currentLearnerRole.name}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Half: Cinematic Dialogue Stream */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Welcome turn when dialogue starts */}
        {messages.length === 0 && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center space-y-3 shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-200 my-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-2xl">
              🎙️
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                Đến lượt bạn mở lời trước!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Bạn đang đóng vai{" "}
                <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {currentLearnerRole.avatar} {currentLearnerRole.name}
                </span>.
                Bấm nút Micro ở thanh dưới hoặc chọn một câu gợi ý để bắt đầu cuộc trò chuyện.
              </p>
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          const isPlaying = activeAudioId === msg.id;
          const isRevealed = subtitlesEnabled || msg.revealed;

          return (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1 animate-in fade-in duration-200 ${
                isAi ? "items-start" : "items-end"
              }`}
            >
              {/* Speaker Label */}
              <div className="flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <span>{isAi ? `AI • ${msg.roleName}` : `BẠN • ${msg.roleName}`}</span>
              </div>

              {/* Speech Card */}
              <div
                className={`w-full max-w-xl rounded-2xl p-4 sm:p-5 shadow-2xs transition ${
                  isAi
                    ? "bg-white border border-slate-200/90 text-slate-900"
                    : "bg-slate-900 text-white shadow-xs"
                }`}
              >
                {isAi ? (
                  <div className="space-y-2">
                    {/* Audio Control Row */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-slate-900" />
                        <span>Lời thoại AI</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Audio Play/Stop Button */}
                        <button
                          type="button"
                          onClick={() =>
                            isPlaying
                              ? onStopAudio()
                              : onPlayAudio(msg.id, msg.textEn)
                          }
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                            isPlaying
                              ? "bg-slate-900 text-white animate-pulse"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                          title={isPlaying ? "Dừng phát" : "Nghe lại câu này"}
                        >
                          {isPlaying ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>Dừng</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Nghe</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Spoken Dialogue Text */}
                    {isRevealed ? (
                      <div className="space-y-1.5 pt-0.5">
                        <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-900">
                          {msg.textEn}
                        </p>
                        {msg.textVi && (
                          <p className="text-xs sm:text-[13px] text-slate-500 leading-normal pt-1.5 border-t border-slate-100">
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
                      /* Listening Challenge: Blur to reveal */
                      <button
                        type="button"
                        onClick={() => onToggleReveal(msg.id)}
                        className="text-left w-full cursor-pointer group focus:outline-hidden pt-1"
                        title="Chạm để mở phụ đề câu này"
                      >
                        <div className="filter blur-xs select-none transition duration-200 group-hover:blur-[2px] space-y-1">
                          <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-700">
                            {msg.textEn}
                          </p>
                          {msg.textVi && (
                            <p className="text-xs text-slate-400 pt-1 border-t border-slate-100">
                              {msg.textVi}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition mt-2 pt-2 border-t border-slate-100">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chạm để mở phụ đề</span>
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
                  /* Learner Dialogue */
                  <div className="space-y-1">
                    <p className="text-base sm:text-lg font-medium leading-relaxed text-white">
                      {msg.textEn}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
