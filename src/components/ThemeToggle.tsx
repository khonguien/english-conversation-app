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
        className={`w-8 h-8 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.05] ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
      title={theme === "light" ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer border select-none press-tactile ${
        theme === "light"
          ? "bg-black/[0.03] hover:bg-black/[0.06] text-slate-700 border-black/[0.06]"
          : "bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 border-white/[0.08]"
      } ${className}`}
    >
      {theme === "light" ? (
        <Moon className="w-3.5 h-3.5 text-slate-600" strokeWidth={2} />
      ) : (
        <Sun className="w-3.5 h-3.5 text-amber-300" strokeWidth={2} />
      )}
    </button>
  );
};
