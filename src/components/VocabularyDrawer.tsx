"use client";

import React, { useState } from "react";
import {
  X,
  Volume2,
  Search,
  BookMarked,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { VocabularyItem } from "@/types/conversation";
import { speakText } from "@/utils/speech";

interface VocabularyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vocabulary: VocabularyItem[];
  scenarioTitle: string;
}

export const VocabularyDrawer: React.FC<VocabularyDrawerProps> = ({
  isOpen,
  onClose,
  vocabulary,
  scenarioTitle,
}) => {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = vocabulary.filter(
    (item) =>
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.meaningVi.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePronounce = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(word, 0.85);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-slate-200/80 dark:border-slate-800/80 animate-in slide-in-from-right duration-250">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50 safe-top-padding">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white flex items-center justify-center shadow-xs">
            <BookMarked className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Từ vựng & Mẫu câu
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
              {scenarioTitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-[#070b14]/50">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm từ vựng, phiên âm hoặc nghĩa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-850/70 border border-slate-200/90 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-hidden focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-sky-400 transition-all"
          />
        </div>
      </div>

      {/* Vocabulary List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
            Không tìm thấy từ vựng phù hợp với từ khóa "{search}"
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isExpanded
                    ? "bg-slate-50/90 dark:bg-slate-850/80 border-indigo-300 dark:border-sky-500/50 shadow-xs ring-1 ring-indigo-500/10"
                    : "bg-white dark:bg-slate-900/60 hover:bg-slate-50/70 dark:hover:bg-slate-850/50 border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {item.word}
                      </span>
                      {item.partOfSpeech && (
                        <span className="text-[10px] font-bold text-indigo-700 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md font-mono border border-indigo-200/60 dark:border-indigo-800/60">
                          {item.partOfSpeech}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                        {item.ipa}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                      {item.meaningVi}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handlePronounce(item.word, e)}
                      className="p-2 text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-95"
                      title="Phát âm từ này"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className="text-slate-300 dark:text-slate-600 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="mt-3 space-y-2.5 pt-2.5 border-t border-slate-200/70 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
                    {/* Synonyms */}
                    {item.synonyms && item.synonyms.length > 0 && (
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Đồng nghĩa:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.synonyms.map((s, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collocations */}
                    {item.collocations && item.collocations.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Cụm từ hay gặp:</span>
                        <ul className="space-y-1 pl-1">
                          {item.collocations.map((c, i) => (
                            <li key={i} className="text-[11px] leading-relaxed flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-sky-400 flex-shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Example */}
                    {item.exampleEn && (
                      <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 italic">
                          "{item.exampleEn}"
                        </p>
                        {item.exampleVi && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            → {item.exampleVi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 text-center safe-bottom-padding">
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Chạm vào từng từ để xem chi tiết ví dụ và cụm từ kết hợp
        </p>
      </div>
    </div>
  );
};
