"use client";

import React, { useState } from "react";
import {
  X,
  Volume2,
  Search,
  BookMarked,
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
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-white/95 dark:bg-[#0c0e14]/95 backdrop-blur-md shadow-2xl flex flex-col border-l border-stone-200/80 dark:border-white/10 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-stone-200/80 dark:border-white/10 flex items-center justify-between bg-stone-50 dark:bg-white/5 safe-top-padding">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs">
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
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-200/70 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          aria-label="Đóng bảng từ vựng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3.5 border-b border-stone-200/80 dark:border-white/10 bg-white dark:bg-[#0c0e14]">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm từ vựng, phiên âm hoặc nghĩa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl focus:outline-hidden focus:bg-white dark:focus:bg-[#131722] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>
      </div>

      {/* Vocabulary List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Không tìm thấy từ vựng phù hợp với từ khóa "{search}"
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                  isExpanded
                    ? "bg-stone-50 dark:bg-white/5 border-emerald-600/60 dark:border-emerald-500/60 shadow-xs"
                    : "bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-white/8 border-stone-200/80 dark:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {item.word}
                      </span>
                      {item.partOfSpeech && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md font-mono border border-emerald-200/60 dark:border-emerald-800/60">
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
                      className="p-2 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer active:scale-95"
                      title="Phát âm từ này"
                      aria-label={`Phát âm từ ${item.word}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className="text-slate-400 p-1">
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
                  <div className="mt-3 space-y-2.5 pt-2.5 border-t border-stone-200/70 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
                    {/* Synonyms */}
                    {item.synonyms && item.synonyms.length > 0 && (
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Đồng nghĩa:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.synonyms.map((s, idx) => (
                            <span
                              key={idx}
                              className="bg-stone-100 dark:bg-white/10 px-2 py-0.5 rounded-md text-[11px] text-slate-700 dark:text-slate-300 border border-stone-200/80 dark:border-white/10"
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
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Cụm từ hay gặp:</span>
                        <ul className="space-y-1 pl-1">
                          {item.collocations.map((c, i) => (
                            <li key={i} className="text-[11px] leading-relaxed flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 flex-shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Example */}
                    {item.exampleEn && (
                      <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200/60 dark:border-white/5 space-y-1">
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
      <div className="p-3.5 border-t border-stone-200/80 dark:border-white/10 bg-stone-50 dark:bg-white/5 text-center safe-bottom-padding">
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Chạm vào từng từ để xem chi tiết ví dụ và cụm từ kết hợp
        </p>
      </div>
    </div>
  );
};
