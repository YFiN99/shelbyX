import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dde7ff",
          500: "#4f6ef7",
          600: "#3b55e8",
          700: "#2940cc",
          900: "#111a6b",
        },
        surface: {
          0: "#0a0b14",
          1: "#0f1121",
          2: "#151829",
          3: "#1c2038",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease both",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
