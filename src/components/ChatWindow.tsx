"use client";

import React, { useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Mic,
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

  // Render 9 fluid soundwave bars oscillating INSIDE the AI Voice Orb
  const renderOrbSoundwaveBars = () => {
    if (isAiSpeaking) {
      return (
        <div className="flex items-center justify-center gap-1.5 h-12">
          <span className="w-1.5 bg-white rounded-full animate-soundwave-1" />
          <span className="w-1.5 bg-white rounded-full animate-soundwave-2" />
          <span className="w-1.5 bg-white rounded-full animate-soundwave-3" />
          <span className="w-1.5 bg-white rounded-full animate-soundwave-4" />
          <span className="w-1.5 bg-white rounded-full animate-soundwave-5" />
          <span className="w-1.5 bg-white rounded-full animate-soundwave-6" />
          <span className="w-1.5 bg-white rounded-full animate-soundwave-7" />
          <span className="w-1.5 bg-white rounded-full animate-soundwave-8" />
          <span className="w-1.5 bg-white rounded-full animate-soundwave-9" />
        </div>
      );
    }

    if (isUserSpeaking) {
      return (
        <div className="flex items-center justify-center gap-1.5 h-12">
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-1" />
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-2" />
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-3" />
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-4" />
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-5" />
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-6" />
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-7" />
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-8" />
          <span className="w-1.5 bg-rose-400 rounded-full animate-soundwave-9" />
        </div>
      );
    }

    if (isAiThinking) {
      return (
        <div className="flex items-center justify-center gap-1.5 h-12">
          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      );
    }

    // Idle serene breath inside orb
    return (
      <div className="flex items-center justify-center gap-1.5 h-12">
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-1" />
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-2" />
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-3" />
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-4" />
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-5" />
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-6" />
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-7" />
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-8" />
        <span className="w-1.5 bg-slate-500/80 rounded-full animate-soundwave-idle-9" />
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200">
      {/* Voice Canvas Stage: Big Circular AI Voice Orb (ChatGPT / Gemini style) */}
      <div className="pt-3 pb-2 px-4 flex flex-col items-center text-center flex-shrink-0">
        {/* The Big AI Voice Orb (No icon inside, fluid soundwave pulsating within) */}
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-900 dark:bg-slate-900/90 border-2 border-slate-800 dark:border-cyan-500/30 shadow-lg flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
            isAiSpeaking
              ? "scale-105 ring-4 ring-slate-900/15 dark:ring-cyan-500/30 shadow-slate-900/30 dark:shadow-cyan-900/40"
              : isUserSpeaking
              ? "scale-105 ring-4 ring-rose-500/20 shadow-rose-900/20"
              : "hover:scale-102"
          }`}
          title={`${currentAiRole.name} Voice Orb`}
        >
          {renderOrbSoundwaveBars()}
        </div>

        {/* Concise caption below the orb */}
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight">
            {currentAiRole.name}
            <span className="font-normal text-slate-400 mx-1.5">•</span>
            <span className="font-medium text-slate-500 dark:text-slate-400">
              {isAiSpeaking
                ? "Đang nói..."
                : isUserSpeaking
                ? "Đang lắng nghe bạn..."
                : isAiThinking
                ? "Đang suy nghĩ..."
                : (currentAiRole.titleVi || currentAiRole.titleEn)}
            </span>
          </p>

          <button
            type="button"
            onClick={() => setIsSituationExpanded(!isSituationExpanded)}
            className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
            title="Xem chi tiết ngữ cảnh"
          >
            <span>{scenario.order}. {scenario.titleEn}</span>
            <span>{isSituationExpanded ? "▲" : "▼"}</span>
          </button>
        </div>

        {/* Collapsible Situation Drawer */}
        {isSituationExpanded && (
          <div className="w-full max-w-lg mx-auto mt-2 p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left shadow-xs animate-in fade-in duration-150">
            <p className="font-semibold text-slate-800 dark:text-white mb-1">
              {scenario.order}. {scenario.titleEn}
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-1.5">
              Bối cảnh: {scenario.situation}
            </p>
            <div className="flex items-center gap-2 pt-1.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span>
                Bạn đang đóng vai:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {currentLearnerRole.avatar} {currentLearnerRole.name}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Spacious Dialogue Stream - Expanded to max-w-7xl for laptops */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 lg:px-12 py-3 space-y-4 max-w-6xl sm:max-w-7xl mx-auto w-full">
        {/* Welcome turn when dialogue hasn't started */}
        {messages.length === 0 && (
          <div className="my-auto py-10 text-center space-y-3.5 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs mx-auto flex items-center justify-center">
              <Mic className="w-6 h-6 text-slate-700 dark:text-cyan-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                Đến lượt bạn mở lời trước!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Bạn đang đóng vai{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700">
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

          if (isAi) {
            return (
              <div
                key={msg.id}
                className="flex items-start gap-2.5 sm:gap-3.5 max-w-3xl animate-in fade-in duration-200"
              >
                {/* AI Speech Card */}
                <div className="flex-1 min-w-0 flex flex-col space-y-1">
                  <div className="flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <span>AI • {msg.roleName}</span>
                  </div>

                  <div
                    className={`w-full rounded-2xl p-3.5 sm:p-4 transition-all duration-200 bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs ${
                      isLatest ? "ring-2 ring-slate-900/5 dark:ring-cyan-500/20 shadow-xs" : ""
                    }`}
                  >
                    <div className="space-y-1.5">
                      {/* Audio Control Row */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-cyan-400" />
                          <span>Lời thoại AI</span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            isPlaying
                              ? onStopAudio()
                              : onPlayAudio(msg.id, msg.textEn)
                          }
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                            isPlaying
                              ? "bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 animate-pulse font-semibold"
                              : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
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

                      {/* Spoken Dialogue Text - Refined Typography */}
                      {isRevealed ? (
                        <div className="space-y-1 pt-0.5">
                          <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-900 dark:text-slate-100">
                            {msg.textEn}
                          </p>
                          {msg.textVi && (
                            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-normal pt-1 border-t border-slate-100 dark:border-slate-800">
                              {msg.textVi}
                            </p>
                          )}
                          {!subtitlesEnabled && (
                            <div className="pt-0.5">
                              <button
                                type="button"
                                onClick={() => onToggleReveal(msg.id)}
                                className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
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
                          className="text-left w-full cursor-pointer group focus:outline-hidden pt-0.5"
                          title="Chạm để mở phụ đề câu này"
                        >
                          <div className="filter blur-xs select-none transition duration-200 group-hover:blur-[2px] space-y-1">
                            <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                              {msg.textEn}
                            </p>
                            {msg.textVi && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                                {msg.textVi}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chạm để mở phụ đề</span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Learner Dialogue Turn
          return (
            <div
              key={msg.id}
              className="flex flex-col items-end space-y-1 ml-auto max-w-2xl sm:max-w-3xl animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-1.5 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>BẠN • {msg.roleName}</span>
              </div>

              <div className="rounded-2xl p-3.5 sm:p-4 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 shadow-xs border border-transparent dark:border-slate-700">
                <p className="text-sm sm:text-base font-medium leading-relaxed text-white dark:text-slate-100">
                  {msg.textEn}
                </p>
              </div>
            </div>
          );
        })}

        {/* AI Thinking Indicator */}
        {isAiThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-1.5 px-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-cyan-400 animate-ping" />
            <span>{currentAiRole.name} đang suy nghĩ câu trả lời...</span>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
