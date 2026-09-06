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
        paper: "#F4EFE6",
        surface: "#FFFBF4",
        ink: "#1C1917",
        sage: "#3F6B54",
        "sage-tint": "#E7F0EA",
        gold: "#D4A017",
        clay: "#C2410C",
        mist: "#8A8175",
        background: "#F4EFE6",
        foreground: "#1C1917",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -18px rgba(28, 25, 23, 0.35)",
        lift: "0 18px 40px -20px rgba(28, 25, 23, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
