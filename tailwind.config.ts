import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'IBM Plex Sans',
          '-apple-system',
          'system-ui',
          'Avenir Next',
          'Avenir',
          'Segoe UI',
          'Helvetica Neue',
          'Helvetica',
          'Ubuntu',
          'Roboto',
          'Noto',
          'Arial',
          'sans-serif',
        ],
        heading: [
          'Space Grotesk',
          '-apple-system',
          'system-ui',
          'Avenir Next',
          'Avenir',
          'Segoe UI',
          'Helvetica Neue',
          'Helvetica',
          'sans-serif',
        ],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        metric: {
          DEFAULT: "hsl(var(--metric-card))",
          hover: "hsl(var(--metric-card-hover))",
        },
        chart: {
          line: "hsl(var(--chart-line))",
          fill: "hsl(var(--chart-fill))",
          highlight: "hsl(var(--chart-highlight))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "2px",
        md: "0px",
        sm: "0px",
        xl: "4px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "ios-slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ios-slide-down": {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ios-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "sheet-slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "collapsible-expand": {
          "0%": { height: "0", opacity: "0" },
          "100%": { height: "var(--radix-collapsible-content-height)", opacity: "1" },
        },
        "collapsible-collapse": {
          "0%": { height: "var(--radix-collapsible-content-height)", opacity: "1" },
          "100%": { height: "0", opacity: "0" },
        },
        "skeleton-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "ios-slide-up": "ios-slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "ios-slide-down": "ios-slide-down 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "ios-fade-in": "ios-fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "sheet-slide-in": "sheet-slide-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "collapsible-expand": "collapsible-expand 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "collapsible-collapse": "collapsible-collapse 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "skeleton-shimmer": "skeleton-shimmer 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
