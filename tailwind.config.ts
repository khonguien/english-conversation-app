import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      padding: {
        "safe-bottom": "env(safe-area-inset-bottom, 16px)",
        "safe-top": "env(safe-area-inset-top, 16px)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
        tactile: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      boxShadow: {
        "double-inner": "inset 0 1px 1px rgba(255, 255, 255, 0.6)",
        "double-inner-dark": "inset 0 1px 1px rgba(255, 255, 255, 0.08)",
        "ambient-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "ambient-md": "0 8px 24px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        "ambient-lg": "0 16px 36px -6px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "ambient-glow": "0 0 36px -4px rgba(245, 158, 11, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
