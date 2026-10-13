"use client";

import React, { useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { ChatMessage, Scenario } from "@/types/conversation";

interface ChatWindowProps {
  messages: ChatMessage[];
  subtitlesEnabled: boolean;
  speechRate: number;
  isAiThinking: boolean;
  activeAudioId: string | null;
  isUserSpeaking?: boolean;
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
  isUserSpeaking = false,
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

  // Render 9 large fluid soundwave bars
  const renderSoundwaveBars = () => {
    if (isAiSpeaking) {
      return (
        <div className="flex items-center justify-center gap-1.5 h-12">
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-1" />
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-2" />
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-3" />
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-4" />
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-5" />
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-6" />
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-7" />
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-8" />
          <span className="w-1.5 bg-slate-900 rounded-full animate-soundwave-9" />
        </div>
      );
    }

    if (isUserSpeaking) {
      return (
        <div className="flex items-center justify-center gap-1.5 h-12">
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-1" />
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-2" />
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-3" />
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-4" />
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-5" />
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-6" />
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-7" />
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-8" />
          <span className="w-1.5 bg-rose-500 rounded-full animate-soundwave-9" />
        </div>
      );
    }

    if (isAiThinking) {
      return (
        <div className="flex items-center justify-center gap-1.5 h-12">
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      );
    }

    // Idle serene breath
    return (
      <div className="flex items-center justify-center gap-1.5 h-12">
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-1" />
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-2" />
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-3" />
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-4" />
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-5" />
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-6" />
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-7" />
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-8" />
        <span className="w-1.5 bg-slate-300 rounded-full animate-soundwave-idle-9" />
      </div>
    );
  };

  const renderStatusLabel = () => {
    if (isAiSpeaking) {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-slate-900 animate-ping" />
          <span>{currentAiRole.name} đang nói...</span>
        </div>
      );
    }
    if (isUserSpeaking) {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Đang lắng nghe giọng bạn...</span>
        </div>
      );
    }
    if (isAiThinking) {
      return (
        <div className="text-xs font-medium text-slate-500">
          Đang suy nghĩ câu trả lời...
        </div>
      );
    }
    return (
      <div className="text-[11px] font-medium text-slate-400">
        Sẵn sàng đối thoại • Chạm Micro để nói
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60">
      {/* Voice Canvas Stage: Frameless Hero Header with Big Soundwave */}
      <div className="pt-3 pb-2 px-4 flex flex-col items-center text-center space-y-1.5 flex-shrink-0">
        {/* Scenario & AI Persona Floating Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/85 backdrop-blur-md rounded-full shadow-2xs border border-slate-200/70 text-xs text-slate-700">
          <span className="text-base">{currentAiRole.avatar || "☕"}</span>
          <span className="font-bold text-slate-900">{currentAiRole.name}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">
            {currentAiRole.titleVi || currentAiRole.titleEn}
          </span>
          <button
            type="button"
            onClick={() => setIsSituationExpanded(!isSituationExpanded)}
            className="ml-1 text-[11px] font-medium text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="Xem chi tiết ngữ cảnh"
          >
            {isSituationExpanded ? "▲ Thu gọn" : "▼ Ngữ cảnh"}
          </button>
        </div>

        {/* Collapsible Situation Drawer */}
        {isSituationExpanded && (
          <div className="w-full max-w-lg mx-auto p-3.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl text-xs text-slate-600 leading-relaxed text-left shadow-xs animate-in fade-in duration-150">
            <p className="font-semibold text-slate-800 mb-1">
              📍 {scenario.order}. {scenario.titleEn}
            </p>
            <p className="text-slate-600 mb-1.5">
              Bối cảnh: {scenario.situation}
            </p>
            <div className="flex items-center gap-2 pt-1.5 text-[11px] text-slate-500 border-t border-slate-100">
              <span>
                Bạn đang đóng vai:{" "}
                <strong className="text-slate-800">
                  {currentLearnerRole.avatar} {currentLearnerRole.name}
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* Big & Fluid Soundwave Visualizer (48px height) */}
        <div className="pt-1.5 pb-0.5 flex flex-col items-center">
          {renderSoundwaveBars()}
          <div className="mt-1 h-5 flex items-center justify-center">
            {renderStatusLabel()}
          </div>
        </div>
      </div>

      {/* Cinematic Dialogue Stream */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 space-y-3.5 max-w-2xl mx-auto w-full">
        {/* Welcome turn when dialogue hasn't started */}
        {messages.length === 0 && (
          <div className="my-auto py-10 text-center space-y-3.5 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-14 h-14 rounded-full bg-white border border-slate-200/80 shadow-2xs mx-auto flex items-center justify-center text-3xl">
              🎙️
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                Đến lượt bạn mở lời trước!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                Bạn đang đóng vai{" "}
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                  {currentLearnerRole.avatar} {currentLearnerRole.name}
                </span>
                .<br />
                Chạm Micro ở thanh dưới hoặc chọn một câu gợi ý để bắt đầu.
              </p>
            </div>
          </div>
        )}

        {/* Dialogue Stream */}
        {messages.map((msg, index) => {
          const isAi = msg.sender === "ai";
          const isPlaying = activeAudioId === msg.id;
          const isRevealed = subtitlesEnabled || msg.revealed;
          const isLatest = index === messages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1 animate-in fade-in duration-200 ${
                isAi ? "items-start" : "items-end"
              }`}
            >
              {/* Speaker Label */}
              <div className="flex items-center gap-1.5 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span>{isAi ? `AI • ${msg.roleName}` : `BẠN • ${msg.roleName}`}</span>
              </div>

              {/* Speech Card - Modern Soft Card */}
              <div
                className={`w-full max-w-xl rounded-2xl p-4 sm:p-5 transition-all duration-200 ${
                  isAi
                    ? `bg-white/95 border border-slate-200/80 text-slate-900 shadow-2xs ${
                        isLatest ? "ring-2 ring-slate-900/5 shadow-xs" : ""
                      }`
                    : "bg-slate-900 text-white shadow-xs"
                }`}
              >
                {isAi ? (
                  <div className="space-y-2">
                    {/* Audio Play/Stop Control Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-slate-900" />
                        <span>Lời thoại AI</span>
                      </div>

                      <div className="flex items-center gap-1">
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

        {/* AI Thinking Indicator */}
        {isAiThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-1.5 px-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
            <span>{currentAiRole.name} đang suy nghĩ câu trả lời...</span>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
