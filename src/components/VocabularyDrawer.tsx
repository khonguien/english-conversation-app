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
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
      {/* Drawer Header */}
      <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 safe-top-padding">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Từ vựng & Cụm từ</h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
              {scenarioTitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-100 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm từ vựng hoặc nghĩa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Vocabulary List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Không tìm thấy từ vựng phù hợp
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className="pt-2.5 first:pt-0 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                        {item.word}
                      </span>
                      {item.partOfSpeech && (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                          {item.partOfSpeech}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">
                        {item.ipa}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-emerald-700 mt-0.5">
                      {item.meaningVi}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handlePronounce(item.word, e)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Phát âm từ này"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className="text-slate-300">
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
                  <div className="mt-2.5 space-y-2 pl-2 border-l-2 border-emerald-200 text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-r-lg">
                    {/* Synonyms */}
                    {item.synonyms && item.synonyms.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700">Đồng nghĩa: </span>
                        <span>{item.synonyms.join(", ")}</span>
                      </div>
                    )}

                    {/* Collocations */}
                    {item.collocations && item.collocations.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700">Cụm từ hay gặp:</span>
                        <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-600">
                          {item.collocations.map((c, i) => (
                            <li key={i} className="text-[11px] leading-relaxed">
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Example */}
                    {item.exampleEn && (
                      <div className="pt-1 border-t border-slate-200/60">
                        <p className="font-medium text-slate-800 italic">
                          "{item.exampleEn}"
                        </p>
                        {item.exampleVi && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            👉 {item.exampleVi}
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
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-center safe-bottom-padding">
        <p className="text-[11px] text-slate-500">
          Chạm vào từng từ để xem ví dụ & cụm từ kết hợp
        </p>
      </div>
    </div>
  );
};
