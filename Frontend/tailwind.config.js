/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#020617', // Deep Midnight
          light: '#0f172a',   // Slate 900
          lighter: '#1e293b', // Slate 800
        },
        primary: {
          DEFAULT: '#06b6d4', // Cyan 500
          dark: '#0891b2',    // Cyan 600
          light: '#22d3ee',   // Cyan 400
        },
        secondary: {
          DEFAULT: '#8b5cf6', // Violet 500
        },
        risk: {
          low: '#10b981',      // Emerald 500
          medium: '#f59e0b',   // Amber 500
          high: '#f97316',     // Orange 500
          critical: '#f43f5e', // Rose 500
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neon': '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
      }
    },
  },
  plugins: [],
}
