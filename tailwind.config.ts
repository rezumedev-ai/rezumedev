
import type { Config } from "tailwindcss";
import { flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px',
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF',
          hover: '#4F46E5'
        },
        secondary: {
          DEFAULT: '#1E293B',
          foreground: '#F8FAFC'
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B'
        },
        accent: {
          DEFAULT: '#EEF2FF',
          foreground: '#6366F1'
        },
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      maxWidth: {
        container: "1280px",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'fade-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-up': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        'pulse-gentle': {
          '0%, 100%': {
            transform: 'scale(1)'
          },
          '50%': {
            transform: 'scale(1.05)'
          }
        },
        'rainbow': {
          '0%': { 'background-position': '0%' },
          '100%': { 'background-position': '200%' }
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' }
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-up': 'scale-up 0.3s ease-out',
        'pulse-gentle': 'pulse-gentle 3s infinite',
        'rainbow': 'rainbow var(--speed, 2s) infinite linear',
        'marquee': 'marquee var(--duration) linear infinite',
        'aurora': 'aurora 60s linear infinite',
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addBase, theme }: { addBase: any; theme: any }) {
      let allColors = flattenColorPalette(theme("colors"));
      let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
      );

      addBase({
        ":root": newVars,
      });
    },
  ],
} satisfies Config;

export default config;
