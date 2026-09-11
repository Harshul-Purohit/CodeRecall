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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
};
