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
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-white/90 dark:bg-[#0c0e14]/90 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-black/[0.08] dark:border-white/[0.1] animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02] safe-top-padding">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <BookMarked className="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Từ vựng & Mẫu câu
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[220px]">
              {scenarioTitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] rounded-full transition-colors cursor-pointer press-tactile"
          aria-label="Đóng bảng từ vựng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm từ vựng, phiên âm hoặc nghĩa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] rounded-full focus:outline-hidden focus:border-amber-600 transition-colors"
          />
        </div>
      </div>

      {/* Vocabulary List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)] text-xs">
            Không tìm thấy từ vựng phù hợp với từ khóa "{search}"
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer press-tactile ${
                  isExpanded
                    ? "bg-amber-500/[0.06] dark:bg-amber-500/[0.1] border-amber-500/30 shadow-xs"
                    : "bg-white/80 dark:bg-[#12151E]/80 hover:bg-black/[0.02] dark:hover:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08]"
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[var(--color-text-primary)] text-sm sm:text-base">
                        {item.word}
                      </span>
                      {item.partOfSpeech && (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/[0.1] px-2 py-0.5 rounded-full font-mono border border-amber-500/20">
                          {item.partOfSpeech}
                        </span>
                      )}
                      <span className="text-xs text-[var(--color-text-muted)] font-mono">
                        {item.ipa}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] mt-1">
                      {item.meaningVi}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handlePronounce(item.word, e)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-amber-700 dark:hover:text-amber-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] rounded-full transition-colors cursor-pointer active:scale-95"
                      title="Phát âm từ này"
                      aria-label={`Phát âm từ ${item.word}`}
                    >
                      <Volume2 className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                    <span className="text-[var(--color-text-muted)] p-1">
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
                  <div className="mt-3 space-y-2.5 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08] text-xs text-[var(--color-text-secondary)] animate-in fade-in duration-150">
                    {/* Synonyms */}
                    {item.synonyms && item.synonyms.length > 0 && (
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-semibold text-[var(--color-text-primary)]">Đồng nghĩa:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.synonyms.map((s, idx) => (
                            <span
                              key={idx}
                              className="bg-black/[0.04] dark:bg-white/[0.06] px-2 py-0.5 rounded-full text-[11px] text-[var(--color-text-secondary)] border border-black/[0.04] dark:border-white/[0.06]"
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
                        <span className="font-semibold text-[var(--color-text-primary)]">Cụm từ hay gặp:</span>
                        <ul className="space-y-1 pl-1">
                          {item.collocations.map((c, i) => (
                            <li key={i} className="text-[11px] leading-relaxed flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 flex-shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Example sentence */}
                    {item.exampleEn && (
                      <div className="p-3 rounded-xl bg-black/[0.025] dark:bg-white/[0.035] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                          <span className="font-semibold">Ví dụ trong ngữ cảnh:</span>
                          <button
                            type="button"
                            onClick={(e) => handlePronounce(item.exampleEn, e)}
                            className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Nghe câu</span>
                          </button>
                        </div>
                        <p className="font-medium text-[var(--color-text-primary)] italic">
                          "{item.exampleEn}"
                        </p>
                        {item.exampleVi && (
                          <p className="text-[11px] text-[var(--color-text-muted)] pt-1 border-t border-black/[0.04] dark:border-white/[0.05]">
                            {item.exampleVi}
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
    </div>
  );
};
