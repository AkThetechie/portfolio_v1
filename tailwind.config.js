/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'c-bg': '#0A0E17',
        'c-surface': '#111827',
        'c-border': '#1E293B',
        'c-green': '#00FF88',
        'c-blue': '#0EA5E9',
        'c-amber': '#F59E0B',
        'c-text': '#E2E8F0',
        'c-muted': '#64748B',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundColor: {
        DEFAULT: '#0A0E17',
      }
    },
  },
  plugins: [],
}
