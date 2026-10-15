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

  // Render 9 fluid soundwave bars oscillating INSIDE the AI Voice Orb with rich gradients
  const renderOrbSoundwaveBars = () => {
    if (isAiSpeaking) {
      return (
        <div className="flex items-center justify-center gap-1.5 h-12 relative z-10">
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-1 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-2 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-3 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-4 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-5 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-6 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-7 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-8 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-200 rounded-full animate-soundwave-9 shadow-xs" />
        </div>
      );
    }

    if (isUserSpeaking) {
      return (
        <div className="flex items-center justify-center gap-1.5 h-12 relative z-10">
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-1 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-2 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-3 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-4 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-5 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-6 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-7 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-8 shadow-xs" />
          <span className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-soundwave-9 shadow-xs" />
        </div>
      );
    }

    if (isAiThinking) {
      return (
        <div className="flex items-center justify-center gap-2 h-12 relative z-10">
          <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce shadow-xs" />
          <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s] shadow-xs" />
          <span className="w-2.5 h-2.5 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.4s] shadow-xs" />
        </div>
      );
    }

    // Idle serene breath inside orb
    return (
      <div className="flex items-center justify-center gap-1.5 h-12 relative z-10 opacity-75">
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-1" />
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-2" />
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-3" />
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-4" />
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-5" />
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-6" />
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-7" />
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-8" />
        <span className="w-1.5 bg-slate-400/70 dark:bg-slate-500/80 rounded-full animate-soundwave-idle-9" />
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#f8fafc] via-white to-slate-50/80 dark:from-[#070b14] dark:via-[#0b101e] dark:to-[#070b14] transition-colors duration-200">
      {/* Voice Canvas Stage: Living AI Voice Orb with Multi-Layer Aura */}
      <div className="pt-3 pb-2 px-4 flex flex-col items-center text-center flex-shrink-0">
        <div className="relative flex items-center justify-center">
          {/* Ambient Multi-Ring Aura Glow */}
          {isAiSpeaking ? (
            <>
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/35 via-sky-400/35 to-cyan-400/35 blur-xl animate-pulse" />
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300 opacity-70 animate-orb-spin blur-xs" />
            </>
          ) : isUserSpeaking ? (
            <>
              <div className="absolute -inset-4 rounded-full bg-rose-500/35 blur-xl animate-pulse" />
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 opacity-70 animate-orb-spin blur-xs" />
            </>
          ) : isAiThinking ? (
            <>
              <div className="absolute -inset-3.5 rounded-full bg-sky-500/25 blur-lg animate-pulse" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 opacity-50 animate-orb-spin blur-xs" />
            </>
          ) : (
            <div className="absolute -inset-2.5 rounded-full bg-indigo-500/10 dark:bg-sky-500/15 blur-md animate-orb-glow" />
          )}

          {/* The Big AI Voice Orb Body */}
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border border-slate-700/80 dark:border-white/20 shadow-xl flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
              isAiSpeaking
                ? "scale-105 shadow-cyan-500/25 ring-2 ring-cyan-400/50"
                : isUserSpeaking
                ? "scale-105 shadow-rose-500/25 ring-2 ring-rose-400/50"
                : "hover:scale-102"
            }`}
            title={`${currentAiRole.name} Voice Orb`}
          >
            {renderOrbSoundwaveBars()}
          </div>
        </div>

        {/* Concise caption below the orb */}
        <div className="mt-2.5 text-center">
          <p className="text-xs font-bold text-slate-800 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{currentAiRole.name}</span>
            <span className="font-normal text-slate-300 dark:text-slate-600">•</span>
            <span
              className={`font-semibold ${
                isAiSpeaking
                  ? "text-sky-600 dark:text-cyan-400"
                  : isUserSpeaking
                  ? "text-rose-600 dark:text-rose-400"
                  : isAiThinking
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {isAiSpeaking
                ? "Đang nói..."
                : isUserSpeaking
                ? "Đang lắng nghe bạn..."
                : isAiThinking
                ? "Đang suy nghĩ..."
                : currentAiRole.titleVi || currentAiRole.titleEn}
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
          <div className="w-full max-w-lg mx-auto mt-2.5 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left shadow-sm animate-in fade-in duration-150">
            <p className="font-bold text-slate-900 dark:text-white mb-1 text-sm">
              {scenario.order}. {scenario.titleEn}
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              <strong className="text-slate-700 dark:text-slate-300">Bối cảnh:</strong> {scenario.situation}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span>
                Bạn đang đóng vai:{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  {currentLearnerRole.avatar} {currentLearnerRole.name}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Spacious Dialogue Stream */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 lg:px-12 py-3 space-y-4 max-w-5xl sm:max-w-6xl mx-auto w-full">
        {/* Welcome turn when dialogue hasn't started */}
        {messages.length === 0 && (
          <div className="my-auto py-12 text-center space-y-4 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-indigo-500/5 dark:bg-slate-850 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs mx-auto flex items-center justify-center">
              <Mic className="w-7 h-7 text-indigo-600 dark:text-sky-400 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Đến lượt bạn mở lời trước!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Bạn đang đóng vai{" "}
                <span className="font-bold text-indigo-700 dark:text-sky-300 bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60">
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
                className="flex items-start gap-3 sm:gap-3.5 max-w-3xl animate-in fade-in duration-200"
              >
                {/* AI Speech Card */}
                <div className="flex-1 min-w-0 flex flex-col space-y-1.5">
                  <div className="flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-sky-400 inline-block" />
                    <span>AI • {msg.roleName}</span>
                  </div>

                  <div
                    className={`w-full rounded-2xl p-4 sm:p-5 transition-all duration-200 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs ${
                      isLatest ? "ring-2 ring-indigo-500/10 dark:ring-sky-500/20 shadow-md" : ""
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Audio Control Row */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="text-slate-400 font-semibold">Lời thoại mẫu</span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            isPlaying
                              ? onStopAudio()
                              : onPlayAudio(msg.id, msg.textEn)
                          }
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                            isPlaying
                              ? "bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-sm shadow-indigo-500/25 animate-pulse"
                              : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
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
                              <Volume2 className="w-3.5 h-3.5 text-indigo-500 dark:text-sky-400" />
                              <span>Nghe</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Spoken Dialogue Text - High Clarity Typography */}
                      {isRevealed ? (
                        <div className="space-y-1.5 pt-0.5">
                          <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-900 dark:text-slate-50 tracking-tight">
                            {msg.textEn}
                          </p>
                          {msg.textVi && (
                            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-normal pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                              {msg.textVi}
                            </p>
                          )}
                          {!subtitlesEnabled && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => onToggleReveal(msg.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
                                title="Ẩn lại phụ đề câu này"
                              >
                                <EyeOff className="w-3 h-3" />
                                <span>Ẩn lại phụ đề</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Listening Challenge: Frosted Glass Reveal */
                        <button
                          type="button"
                          onClick={() => onToggleReveal(msg.id)}
                          className="text-left w-full cursor-pointer group focus:outline-hidden pt-1"
                          title="Chạm để mở phụ đề câu này"
                        >
                          <div className="filter blur-sm select-none transition duration-200 group-hover:blur-xs space-y-1">
                            <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                              {msg.textEn}
                            </p>
                            {msg.textVi && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                                {msg.textVi}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chạm để mở phụ đề (Chế độ luyện nghe)</span>
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
              className="flex flex-col items-end space-y-1.5 ml-auto max-w-2xl sm:max-w-3xl animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>BẠN • {msg.roleName}</span>
              </div>

              <div className="rounded-2xl rounded-tr-xs p-4 sm:p-4.5 bg-slate-900 dark:bg-indigo-600 text-white shadow-sm border border-slate-800 dark:border-indigo-500/40">
                <p className="text-sm sm:text-base font-semibold leading-relaxed text-white">
                  {msg.textEn}
                </p>
              </div>
            </div>
          );
        })}

        {/* AI Thinking Indicator */}
        {isAiThinking && (
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 py-2 px-3 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 w-fit animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-sky-400 animate-ping" />
            <span>{currentAiRole.name} đang suy nghĩ câu trả lời...</span>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
