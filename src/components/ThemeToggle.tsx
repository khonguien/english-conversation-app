"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Chuyển sang chế độ tối (Dark Studio)" : "Chuyển sang chế độ sáng (Light EdTech)"}
      title={theme === "light" ? "Chuyển sang chế độ Dark Studio" : "Chuyển sang chế độ Light EdTech"}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 cursor-pointer border select-none
        ${
          theme === "light"
            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80 shadow-2xs hover:scale-105 active:scale-95"
            : "bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-2xs hover:scale-105 active:scale-95"
        } ${className}`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-slate-600 transition-transform duration-200" />
      ) : (
        <Sun className="w-4 h-4 text-amber-300 transition-transform duration-200" />
      )}
    </button>
  );
};
