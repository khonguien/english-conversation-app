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
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages or AI thinking status changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiThinking]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 max-w-3xl mx-auto w-full">
      {/* Scenario Briefing Card */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-sky-50/70 to-emerald-50/70 border border-indigo-100/80 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <span className="text-xl sm:text-2xl mt-0.5">📌</span>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {scenario.titleEn} – {scenario.titleVi}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {scenario.situation}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span className="bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                AI: {scenario.defaultRoles.ai.avatar} {scenario.defaultRoles.ai.name}
              </span>
              <span className="bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                Bạn: {scenario.defaultRoles.user.avatar} {scenario.defaultRoles.user.name}
              </span>
              <span className="text-indigo-600 font-medium">
                🎯 Mục tiêu: Trả lời tự nhiên, đúng ý
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      {messages.map((msg) => {
        const isAi = msg.sender === "ai";
        const isPlaying = activeAudioId === msg.id;
        const showText = subtitlesEnabled || msg.revealed;

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-2 sm:gap-2.5 ${
              isAi ? "justify-start" : "justify-end"
            }`}
          >
            {/* AI Avatar */}
            {isAi && (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-base sm:text-lg flex-shrink-0 shadow-xs mb-1">
                {scenario.defaultRoles.ai.avatar}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xs transition ${
                isAi
                  ? "bg-white border border-slate-200 text-slate-900 rounded-bl-xs"
                  : "bg-indigo-600 text-white rounded-br-xs"
              }`}
            >
              {/* Header inside bubble */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-[10px] font-semibold tracking-wide uppercase ${
                    isAi ? "text-indigo-600" : "text-indigo-200"
                  }`}
                >
                  {msg.roleName}
                </span>

                {isAi && (
                  <div className="flex items-center gap-1">
                    {/* Audio Play/Stop Button */}
                    <button
                      onClick={() =>
                        isPlaying
                          ? onStopAudio()
                          : onPlayAudio(msg.id, msg.textEn)
                      }
                      className={`p-1 rounded-full transition ${
                        isPlaying
                          ? "bg-indigo-600 text-white animate-pulse"
                          : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                      }`}
                      title={isPlaying ? "Dừng phát" : "Nghe lại câu này"}
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
                  {showText ? (
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-800">
                        {msg.textEn}
                      </p>
                      {msg.textVi && (
                        <p className="text-xs sm:text-[13px] text-slate-500 italic pt-0.5 border-t border-slate-100">
                          {msg.textVi}
                        </p>
                      )}
                      {!subtitlesEnabled && (
                        <span className="inline-block text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          (Đã mở chữ câu này)
                        </span>
                      )}
                    </div>
                  ) : (
                    /* Listening Challenge Mode: Masked text */
                    <button
                      onClick={() => onToggleReveal(msg.id)}
                      className="text-left w-full py-1 text-slate-400 hover:text-slate-600 group"
                    >
                      <div className="font-mono text-sm tracking-widest text-slate-300 group-hover:text-slate-400 select-none">
                        •••• ••••••• ••••••••
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50/80 hover:bg-amber-100 px-2 py-0.5 rounded-md mt-1 transition">
                        <Eye className="w-3 h-3 text-amber-600" />
                        <span>Chạm để xem phụ đề nếu nghe chưa kịp</span>
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                /* User Message */
                <p className="text-sm sm:text-base leading-relaxed text-white font-normal">
                  {msg.textEn}
                </p>
              )}
            </div>

            {/* User Avatar */}
            {!isAi && (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-700 flex items-center justify-center text-base sm:text-lg flex-shrink-0 text-white shadow-xs mb-1">
                {scenario.defaultRoles.user.avatar}
              </div>
            )}
          </div>
        );
      })}

      {/* AI Thinking Animation */}
      {isAiThinking && (
        <div className="flex items-end gap-2.5 justify-start">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-base flex-shrink-0">
            {scenario.defaultRoles.ai.avatar}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
              <span className="text-slate-400 text-[11px] ml-1">
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
