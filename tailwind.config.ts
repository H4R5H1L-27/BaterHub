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
        // Stitch Brand Design System
        primary: {
          DEFAULT: "#4648d4",
          container: "#6063ee",
          fixed: "#e1e0ff",
          "fixed-dim": "#c0c1ff",
        },
        "on-primary": "#ffffff",
        "on-primary-container": "#fffbff",
        "on-primary-fixed": "#07006c",
        "on-primary-fixed-variant": "#2f2ebe",

        secondary: {
          DEFAULT: "#712ae2",
          container: "#8a4cfc",
          fixed: "#eaddff",
          "fixed-dim": "#d2bbff",
        },
        "on-secondary": "#ffffff",
        "on-secondary-container": "#fffbff",
        "on-secondary-fixed": "#25005a",
        "on-secondary-fixed-variant": "#5a00c6",

        tertiary: {
          DEFAULT: "#825100",
          container: "#a36700",
          fixed: "#ffddb8",
          "fixed-dim": "#ffb95f",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "on-tertiary-fixed": "#2a1700",
        "on-tertiary-fixed-variant": "#653e00",

        surface: {
          DEFAULT: "#faf8ff",
          dim: "#d2d9f4",
          bright: "#faf8ff",
          container: "#eaedff",
          "container-lowest": "#ffffff",
          "container-low": "#f2f3ff",
          "container-high": "#e2e7ff",
          "container-highest": "#dae2fd",
          variant: "#dae2fd",
        },
        "on-surface": "#131b2e",
        "on-surface-variant": "#464554",
        "surface-tint": "#494bd6",

        outline: {
          DEFAULT: "#767586",
          variant: "#c7c4d7",
        },

        // Legacy compatibility aliases
        paper: "#faf8ff",
        ink: "#131b2e",
        sage: "#4648d4",
        "sage-tint": "#e1e0ff",
        gold: "#825100",
        clay: "#ba1a1a",
        mist: "#767586",
        background: "#faf8ff",
        foreground: "#131b2e",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(19, 27, 46, 0.05), 0 2px 6px -1px rgba(19, 27, 46, 0.03)",
        lift: "0 12px 30px -4px rgba(70, 72, 212, 0.14), 0 4px 10px -2px rgba(19, 27, 46, 0.04)",
        modal: "0 24px 48px -8px rgba(19, 27, 46, 0.16)",
      },
    },
  },
  plugins: [],
};
export default config;
