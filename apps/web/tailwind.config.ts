import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold:  { DEFAULT: '#C9A84C', light: '#E2C97E', dark: '#9A7430' },
        dark:  { DEFAULT: '#1A1A1A', muted: '#2D2D2D' },
        cream: { DEFAULT: '#FAF8F4', warm: '#F5F0E8' },
      },
    },
  },
  plugins: [],
} satisfies Config;
