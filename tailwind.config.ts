import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#191919",
        anthropic: {
          dark: "#191919",
          surface: "#212121",
          elevated: "#282828",
          orange: "#E05A47",
          "orange-hover": "#C84A38",
          cream: "#FBF9F6",
          muted: "#A09D98",
          faint: "#6A6863",
          border: "#3E3E3E",
          "border-hover": "#5A5A5A",
        },
        surface: {
          DEFAULT: "#212121",
          subtle: "#1C1C1C",
          card: "#1E1E1E",
          cardHover: "#252525",
          border: "#3E3E3E",
          borderHover: "#555555",
        },
        accent: {
          orange: "#E05A47",
          orangeHover: "#C84A38",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Lora", "Georgia", "serif"],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "Fira Code",
          "monospace",
        ],
        sans: [
          "var(--font-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      borderColor: {
        DEFAULT: "#3E3E3E",
      },
    },
  },
  plugins: [],
};

export default config;
