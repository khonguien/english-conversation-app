"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Mic,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  BookMarked,
} from "lucide-react";
import { ChatMessage, Scenario } from "@/types/conversation";
import { RoleIcon } from "./TopicIcons";

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
  onNextScenario?: () => void;
  onResetChat?: () => void;
  onMarkCompleted?: (scenarioId: string) => void;
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
  onNextScenario,
  onResetChat,
  onMarkCompleted,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isSituationExpanded, setIsSituationExpanded] = useState(false);

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

  // Mark completed when user has exchanged at least 4 messages
  const userMessageCount = messages.filter((m) => m.sender === "user").length;
  const isMilestoneReached = userMessageCount >= 2 && messages.length >= 4;

  useEffect(() => {
    if (isMilestoneReached && onMarkCompleted) {
      onMarkCompleted(scenario.id);
    }
  }, [isMilestoneReached, onMarkCompleted, scenario.id]);

  const isAiSpeaking = activeAudioId !== null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafaf9] dark:bg-[#0c0e14] relative transition-colors duration-200">
      {/* Top Acoustic Status & Briefing Bar */}
      <div className="py-2.5 px-4 border-b border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-[#111520]/70 backdrop-blur-md flex-shrink-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Situation title & toggle */}
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => setIsSituationExpanded(!isSituationExpanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
              title="Xem thông tin bối cảnh hội thoại"
              aria-expanded={isSituationExpanded}
            >
              <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">
                {scenario.order ? `Tình huống #${scenario.order}: ` : ""}
                {scenario.titleEn}
              </span>
              {isSituationExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              )}
            </button>
          </div>

          {/* Turn Counter & Voice Status */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 mr-1">
              <span>{messages.length} lượt thoại</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs">
              {isAiSpeaking ? (
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-wave-1" />
                    <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-wave-2" />
                    <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-wave-3" />
                    <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-wave-4" />
                    <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-wave-5" />
                  </div>
                  <span>{currentAiRole.name} đang nói...</span>
                </div>
              ) : isUserSpeaking ? (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Đang nghe bạn nói...</span>
                </div>
              ) : isAiThinking ? (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>AI đang chuẩn bị câu trả lời...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Đối tác: {currentAiRole.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Situation Card */}
        {isSituationExpanded && (
          <div className="max-w-4xl mx-auto mt-2.5 p-3.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-2 animate-in fade-in duration-150">
            <p className="leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Bối cảnh:</strong> {scenario.situation}
            </p>
            <div className="pt-2 border-t border-stone-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>
                Bạn: <strong className="text-slate-800 dark:text-slate-200">{currentLearnerRole.name}</strong> ({currentLearnerRole.titleVi || currentLearnerRole.titleEn})
              </span>
              <span>
                AI: <strong className="text-slate-800 dark:text-slate-200">{currentAiRole.name}</strong> ({currentAiRole.titleVi || currentAiRole.titleEn})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Dialogue Stream */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-5 space-y-5 max-w-4xl mx-auto w-full">
        {/* Empty state when learner speaks first */}
        {messages.length === 0 && (
          <div className="my-auto py-12 text-center space-y-3 max-w-md mx-auto animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Đến lượt bạn mở lời trước
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Bạn đang đóng vai <strong className="text-slate-800 dark:text-slate-200">{currentLearnerRole.name}</strong>. Hãy bấm giữ Micro ở bên dưới để cất lời chào đối tác.
              </p>
            </div>
          </div>
        )}

        {/* Message Bubble List */}
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          const isPlaying = activeAudioId === msg.id;
          const isRevealed = subtitlesEnabled || msg.revealed;

          if (isAi) {
            return (
              <div key={msg.id} className="flex items-start gap-3 max-w-2xl animate-in fade-in duration-200">
                {/* AI Avatar */}
                <div className="w-8 h-8 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                    <span>{msg.roleName}</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl rounded-tl-xs bg-white dark:bg-[#131722] border border-stone-200/90 dark:border-white/10 shadow-xs space-y-3">
                    {/* Audio Player Row */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-white/5">
                      <button
                        type="button"
                        onClick={() =>
                          isPlaying ? onStopAudio() : onPlayAudio(msg.id, msg.textEn)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer active:scale-95 press-spring ${
                          isPlaying
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-white/15"
                        }`}
                        title={isPlaying ? "Dừng phát âm" : "Nghe lại câu này"}
                        aria-label={isPlaying ? "Dừng phát âm" : "Nghe lại câu này"}
                      >
                        {isPlaying ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Dừng</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Nghe câu này</span>
                          </>
                        )}
                      </button>

                      {isPlaying && (
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-wave-1" />
                          <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-wave-2" />
                          <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-wave-3" />
                        </div>
                      )}
                    </div>

                    {/* Dialogue Text Content */}
                    {isRevealed ? (
                      <div className="space-y-2">
                        <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-900 dark:text-white">
                          {msg.textEn}
                        </p>
                        {msg.textVi && (
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-stone-100 dark:border-white/5 leading-relaxed">
                            {msg.textVi}
                          </p>
                        )}
                        {!subtitlesEnabled && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => onToggleReveal(msg.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Che lại phụ đề</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Listening Challenge blurred text */
                      <button
                        type="button"
                        onClick={() => onToggleReveal(msg.id)}
                        className="text-left w-full cursor-pointer group focus:outline-hidden py-1"
                        title="Chạm để xem phụ đề câu này"
                        aria-label="Chạm để xem phụ đề câu này"
                      >
                        <div className="filter blur-md select-none transition group-hover:blur-xs space-y-1">
                          <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                            {msg.textEn}
                          </p>
                          {msg.textVi && (
                            <p className="text-xs text-slate-400 pt-1 border-t border-stone-100 dark:border-white/5">
                              {msg.textVi}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:underline mt-2 pt-2 border-t border-stone-100 dark:border-white/5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chạm để hiển thị phụ đề & bản dịch</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // User turn
          return (
            <div key={msg.id} className="flex items-start justify-end gap-3 max-w-2xl ml-auto animate-in fade-in duration-200">
              <div className="flex-1 min-w-0 space-y-1 text-right">
                <div className="flex items-center justify-end gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                  <span>Bạn ({msg.roleName})</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl rounded-tr-xs bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs inline-block text-left">
                  <p className="text-base sm:text-lg font-semibold leading-relaxed">
                    {msg.textEn}
                  </p>
                </div>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-xl bg-stone-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                <RoleIcon role="user" className="w-4 h-4" />
              </div>
            </div>
          );
        })}

        {/* AI Thinking animation */}
        {isAiThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2.5 bg-white dark:bg-[#131722] rounded-xl border border-stone-200/80 dark:border-white/10 w-fit animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
            <span>{currentAiRole.name} đang phản hồi...</span>
          </div>
        )}

        {/* Milestone / Lesson Completion Card */}
        {isMilestoneReached && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Tuyệt vời! Bạn đã hoàn thành tình huống đối thoại này!</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Bạn đã luyện tập đối đáp phản xạ thành công. Bạn có thể bấm để luyện tập lại từ đầu hoặc tiếp tục sang bài học kế tiếp.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {onResetChat && (
                <button
                  type="button"
                  onClick={onResetChat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-stone-100 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 border border-stone-200/80 dark:border-white/10 cursor-pointer active:scale-95 transition-colors press-spring"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Luyện tập lại</span>
                </button>
              )}
              {onNextScenario && (
                <button
                  type="button"
                  onClick={onNextScenario}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-95 transition-colors press-spring shadow-xs"
                >
                  <span>Sang bài tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
