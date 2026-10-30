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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--color-bg-base)] relative transition-colors duration-200">
      {/* Top Briefing Bar */}
      <div className="py-2.5 px-4 sm:px-6 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]/90 backdrop-blur-md flex-shrink-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Situation title & toggle */}
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => setIsSituationExpanded(!isSituationExpanded)}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer text-left press-tactile"
              title="View scenario context"
              aria-expanded={isSituationExpanded}
            >
              <Info className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
              <span className="truncate">
                {scenario.order ? `Lesson #${scenario.order}: ` : ""}
                {scenario.titleEn}
              </span>
              {isSituationExpanded ? (
                <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
              )}
            </button>
          </div>

          {/* Turn Counter & Voice Status */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--color-text-muted)] mr-1">
              <span>{messages.length} turns</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs">
              {isAiSpeaking ? (
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-wave-1" />
                    <span className="w-0.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-wave-2" />
                    <span className="w-0.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-wave-3" />
                  </div>
                  <span>{currentAiRole.name} speaking...</span>
                </div>
              ) : isUserSpeaking ? (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Listening...</span>
                </div>
              ) : isAiThinking ? (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>AI responding...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                  <span>Partner: {currentAiRole.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Situation Brief Card */}
        {isSituationExpanded && (
          <div className="max-w-4xl mx-auto mt-2.5 p-4 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-text-secondary)] space-y-2 animate-in fade-in duration-150">
            <p className="leading-relaxed">
              <strong className="text-[var(--color-text-primary)]">Context:</strong> {scenario.situation}
            </p>
            <div className="pt-2 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
              <span>
                You: <strong className="text-[var(--color-text-primary)]">{currentLearnerRole.name}</strong> ({currentLearnerRole.titleVi || currentLearnerRole.titleEn})
              </span>
              <span>
                Partner: <strong className="text-[var(--color-text-primary)]">{currentAiRole.name}</strong> ({currentAiRole.titleVi || currentAiRole.titleEn})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Dialogue Stream */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-6 max-w-4xl mx-auto w-full pb-40">
        {/* Empty state when learner speaks first */}
        {messages.length === 0 && (
          <div className="my-auto py-16 text-center space-y-3 max-w-md mx-auto animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <Mic className="w-6 h-6 animate-pulse" strokeWidth={1.75} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                Your turn to open the dialogue
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                You are playing as <strong className="text-[var(--color-text-primary)]">{currentLearnerRole.name}</strong>. Tap the microphone button below to greet your conversation partner.
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
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm shadow-amber-600/30">
                  <Sparkles className="w-4 h-4" strokeWidth={2} />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)] px-1">
                    <span>{msg.roleName}</span>
                  </div>

                  <div className="p-5 rounded-3xl rounded-tl-sm bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-xs space-y-3">
                    {/* Audio Player Row */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() =>
                          isPlaying ? onStopAudio() : onPlayAudio(msg.id, msg.textEn)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer press-tactile ${
                          isPlaying
                            ? "bg-amber-600 text-white"
                            : "bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        }`}
                        title={isPlaying ? "Stop audio" : "Replay phrase"}
                        aria-label={isPlaying ? "Stop audio" : "Replay phrase"}
                      >
                        {isPlaying ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" strokeWidth={2} />
                            <span>Play audio</span>
                          </>
                        )}
                      </button>

                      {isPlaying && (
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-wave-1" />
                          <span className="w-0.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-wave-2" />
                          <span className="w-0.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-wave-3" />
                        </div>
                      )}
                    </div>

                    {/* Dialogue Text Content */}
                    {isRevealed ? (
                      <div className="space-y-2">
                        <p className="text-base sm:text-lg font-semibold leading-relaxed text-[var(--color-text-primary)]">
                          {msg.textEn}
                        </p>
                        {msg.textVi && (
                          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border)] leading-relaxed">
                            {msg.textVi}
                          </p>
                        )}
                        {!subtitlesEnabled && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => onToggleReveal(msg.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide subtitle</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Listening Challenge blurred text with Peek preview */
                      <button
                        type="button"
                        onClick={() => onToggleReveal(msg.id)}
                        className="text-left w-full cursor-pointer group focus:outline-hidden py-1"
                        title="Tap to reveal subtitle"
                        aria-label="Tap to reveal subtitle"
                      >
                        <div className="subtitle-blurred space-y-1">
                          <p className="text-base sm:text-lg font-semibold leading-relaxed text-[var(--color-text-primary)]">
                            {msg.textEn}
                          </p>
                          {msg.textVi && (
                            <p className="text-xs text-[var(--color-text-muted)] pt-1 border-t border-[var(--color-border)]">
                              {msg.textVi}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 group-hover:underline mt-2.5 pt-2 border-t border-[var(--color-border)]">
                          <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                          <span>Tap to reveal subtitle & Vietnamese meaning</span>
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
                <div className="flex items-center justify-end gap-2 text-xs font-semibold text-[var(--color-text-muted)] px-1">
                  <span>You ({msg.roleName})</span>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl rounded-tr-sm bg-amber-600 dark:bg-amber-600 text-white shadow-md shadow-amber-600/20 inline-block text-left">
                  <p className="text-base sm:text-lg font-semibold leading-relaxed">
                    {msg.textEn}
                  </p>
                </div>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] flex items-center justify-center flex-shrink-0 mt-1">
                <RoleIcon role="user" className="w-4 h-4" />
              </div>
            </div>
          );
        })}

        {/* AI Thinking animation */}
        {isAiThinking && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] p-3 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] w-fit shadow-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{currentAiRole.name} is thinking...</span>
          </div>
        )}

        {/* Milestone / Lesson Completion Card */}
        {isMilestoneReached && (
          <div className="p-6 rounded-3xl bg-amber-500/[0.08] border border-amber-500/20 animate-in fade-in duration-300 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              <span>Great job! You completed this conversation scenario!</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              You've successfully exercised real-time spoken reflexes for this situation. You can practice again or move to the next lesson.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {onResetChat && (
                <button
                  type="button"
                  onClick={onResetChat}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] cursor-pointer press-tactile transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Practice Again</span>
                </button>
              )}
              {onNextScenario && (
                <button
                  type="button"
                  onClick={onNextScenario}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer press-tactile transition-all shadow-md shadow-amber-600/20"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
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
