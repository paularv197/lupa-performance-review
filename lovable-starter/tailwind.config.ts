import type { Config } from "tailwindcss";

/**
 * Lupa People design tokens, mapped 1:1 from the Pencil (.pen) design.
 * Colors resolve to CSS variables defined in app/globals.css so the whole
 * app stays on-brand from a single source of truth.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        section: "var(--section)",
        card: "var(--card)",
        foreground: "var(--foreground)",
        body: "var(--body)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
        connector: "var(--connector)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
          tint: "var(--primary-tint)",
        },
        // status semantics
        "status-approved-bg": "var(--status-approved-bg)",
        "status-approved-fg": "var(--status-approved-fg)",
        "status-denied-bg": "var(--status-denied-bg)",
        "status-denied-fg": "var(--status-denied-fg)",
        "status-info-bg": "var(--status-info-bg)",
        "status-info-fg": "var(--status-info-fg)",
        "status-pending-bg": "var(--status-pending-bg)",
        "status-pending-fg": "var(--status-pending-fg)",
        "status-neutral-bg": "var(--status-neutral-bg)",
        "status-neutral-fg": "var(--status-neutral-fg)",
        "status-ai-bg": "var(--status-ai-bg)",
        "status-ai-fg": "var(--status-ai-fg)",
        // review score scale (0-3)
        "score-0-bg": "var(--score-0-bg)",
        "score-0-fg": "var(--score-0-fg)",
        "score-1-bg": "var(--score-1-bg)",
        "score-1-fg": "var(--score-1-fg)",
        "score-2-bg": "var(--score-2-bg)",
        "score-2-fg": "var(--score-2-fg)",
        "score-3-bg": "var(--score-3-bg)",
        "score-3-fg": "var(--score-3-fg)",
        // charts
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",
      },
      borderRadius: {
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        dialog: "var(--radius-dialog)",
        pill: "var(--radius-pill)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 36, 30, 0.04)",
        popover: "0 10px 28px rgba(15, 36, 30, 0.14)",
        dialog: "0 16px 40px rgba(15, 36, 30, 0.20)",
      },
    },
  },
  plugins: [],
};

export default config;
