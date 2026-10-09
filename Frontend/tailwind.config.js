/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#211832',
        surface: {
          dark: '#2C1F45',
          light: '#412B6B',
          inset: '#1A1228',
        },
        border: {
          clean: '#5C3E94',
          inset: '#3B265E',
          footer: '#3D2963',
        },
        brand: {
          orange: '#F25912',
          purple: '#412B6B',
          darkBg: '#211832',
        },
        status: {
          easy: '#22C55E',
          medium: '#EAB308',
          hard: '#EF4444',
        },
        subtext: '#B4A7D6',
        slateLav: {
          base: '#363B4E',
          surface: '#4F3B78',
          border: '#927FBF',
          accent: '#C4BBF0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-in': 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
