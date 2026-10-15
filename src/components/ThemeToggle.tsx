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
        className={`w-9 h-9 rounded-xl border border-stone-200/80 dark:border-white/10 bg-stone-100 dark:bg-white/5 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
      title={theme === "light" ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl transition-colors cursor-pointer border select-none active:scale-95
        ${
          theme === "light"
            ? "bg-stone-100 hover:bg-stone-200 text-slate-700 border-stone-200/80"
            : "bg-white/5 hover:bg-white/10 text-amber-300 border-white/10"
        } ${className}`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-slate-600" />
      ) : (
        <Sun className="w-4 h-4 text-amber-300" />
      )}
    </button>
  );
};
