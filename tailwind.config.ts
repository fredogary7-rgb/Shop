import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#111111",
          soft: "#1c1c1c",
          muted: "#525252",
          subtle: "#8a8a8a",
        },
        gold: {
          50: "#f9f4ec",
          100: "#f0e6d4",
          200: "#e0cca8",
          300: "#cdb17c",
          400: "#b08d57",
          500: "#9a7745",
          600: "#7d5f38",
          700: "#654b2e",
        },
        cream: {
          DEFAULT: "#f8f5f0",
          dark: "#efe8dd",
          deeper: "#e6dccb",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      opacity: {
        8: "0.08",
        12: "0.12",
        15: "0.15",
      },
      letterSpacing: {
        tighter: "-0.02em",
        widest: "0.18em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,17,17,0.04), 0 8px 24px rgba(17,17,17,0.06)",
        cardHover:
          "0 2px 4px rgba(17,17,17,0.06), 0 16px 40px rgba(17,17,17,0.12)",
        gold: "0 8px 30px rgba(176,141,87,0.35)",
      },
      backgroundImage: {
        "hero-grain":
          "radial-gradient(circle at 20% 20%, rgba(176,141,87,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(17,17,17,0.5), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.4s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
