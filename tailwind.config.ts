import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // Maintain dark mode class-based toggle
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Broaden content paths to include all src files
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "", // Keep empty prefix for standard utility classes
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem", // Reduced default padding for mobile
        sm: "2rem",
        lg: "3rem", // Larger padding for desktop
      },
      screens: {
        "2xl": "1440px", // Slightly larger max-width for modern screens
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--primary-50))", // Added for lighter shades
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          hover: "hsl(var(--sidebar-hover))", // Added for sidebar hover effects
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Arial", "sans-serif"], // Added fallback fonts
        mono: ["JetBrains Mono", "Consolas", "Courier New", "monospace"], // Added fallback fonts
        heading: ["Geist", "Inter", "sans-serif"], // Added for headings in UI
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // Enhanced typography
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)", // Added default fallback
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
        xs: "calc(var(--radius, 0.5rem) - 6px)", // Added for smaller elements
      },
      spacing: {
        4.5: "1.125rem", // Added for button/icon sizes
        7.5: "1.875rem", // Added for custom gaps
        15: "3.75rem", // Added for larger sections
      },
      boxShadow: {
        "inner-sm": "inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)", // Added for subtle inner shadows
        "glow": "0 0 8px rgba(59, 130, 246, 0.3)", // Added for hover effects
      },
      transitionProperty: {
        width: "width", // Added for sidebar animations
        height: "height",
        opacity: "opacity",
        transform: "transform",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Retained for animations
    require("@tailwindcss/typography"), // Added for markdown/richtext rendering
  ],
} satisfies Config;
