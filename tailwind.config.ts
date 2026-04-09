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
          'IBM Plex Sans Variable',
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
        mono: ['Source Code Pro', 'Menlo', 'Consolas', 'Monaco', 'monospace'],
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "ios-bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
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
        "ios-press": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.97)" },
          "100%": { transform: "scale(1)" },
        },
        "ios-spring": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(8px)" },
          "60%": { transform: "scale(1.03) translateY(-2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "ios-rubber": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.15, 0.85)" },
          "40%": { transform: "scale(0.85, 1.15)" },
          "50%": { transform: "scale(1.05, 0.95)" },
          "65%": { transform: "scale(0.98, 1.02)" },
          "75%": { transform: "scale(1.02, 0.98)" },
          "100%": { transform: "scale(1)" },
        },
        "ios-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        "ios-pulse": {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.6" },
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
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "ios-bounce-in": "ios-bounce-in 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards",
        "ios-slide-up": "ios-slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards",
        "ios-slide-down": "ios-slide-down 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards",
        "ios-fade-in": "ios-fade-in 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards",
        "ios-press": "ios-press 0.2s cubic-bezier(0.32, 0.72, 0, 1)",
        "ios-spring": "ios-spring 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "ios-rubber": "ios-rubber 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "ios-shake": "ios-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
        "ios-pulse": "ios-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "sheet-slide-in": "sheet-slide-in 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
        "collapsible-expand": "collapsible-expand 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "collapsible-collapse": "collapsible-collapse 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "skeleton-shimmer": "skeleton-shimmer 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
