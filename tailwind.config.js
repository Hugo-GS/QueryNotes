/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', 'sans-serif'],
        mono: ['Ubuntu Mono', 'monospace'],
      },
      colors: {
        lab: {
          bg: 'var(--color-lab-bg)',
          bgDim: 'var(--color-lab-bg-dim)',
          panel: 'var(--color-lab-panel)',
          codeBg: 'var(--color-lab-code-bg)',
          border: 'var(--color-lab-border)',
          text: 'var(--color-lab-text)',
          textMuted: 'var(--color-lab-text-muted)',
          red: 'var(--color-lab-red)',
          green: 'var(--color-lab-green)',
          greenLight: 'var(--color-lab-green-light)',
          blue: 'var(--color-lab-blue)',
          blueAqua: 'var(--color-lab-blue-aqua)',
          yellow: 'var(--color-lab-yellow)',
          orange: 'var(--color-lab-orange)',
          purple: 'var(--color-lab-purple)',
          selection: 'var(--color-lab-selection)',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    }
  },
  plugins: [],
}
