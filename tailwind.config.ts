import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1220px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "Source Sans 3", "ui-sans-serif", "system-ui", "sans-serif"],
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        earth: {
          moss: "hsl(var(--earth-moss))",
          forest: "hsl(var(--earth-forest))",
          canopy: "hsl(var(--earth-canopy))",
          fern: "hsl(var(--earth-fern))",
          sand: "hsl(var(--earth-sand))",
          clay: "hsl(var(--earth-clay))",
          sun: "hsl(var(--earth-sun))",
          river: "hsl(var(--earth-river))",
          night: "hsl(var(--earth-night))",
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        xl: "0.75rem",
        lg: "0.625rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(16 24 20 / 0.04)",
        premium: "0 1px 2px rgb(16 24 20 / 0.04)",
        lift: "0 1px 2px rgb(16 24 20 / 0.04)",
        glow: "0 0 0 1px rgb(255 255 255 / 0.14)",
      },
      backgroundImage: {
        "gradient-canopy": "linear-gradient(135deg, hsl(var(--earth-forest)) 0%, hsl(var(--earth-moss)) 52%, hsl(var(--earth-river)) 100%)",
        "gradient-sunrise": "linear-gradient(135deg, hsl(var(--earth-sun)) 0%, hsl(var(--earth-clay)) 45%, hsl(var(--earth-forest)) 100%)",
        "gradient-mist": "radial-gradient(circle at top left, hsl(var(--earth-fern) / 0.24), transparent 32%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        shimmer: "shimmer 1.8s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
