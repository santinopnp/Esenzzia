import type { Config } from 'tailwindcss';

// Los colores leen las variables de src/styles/tokens.css, así cambian solos entre temas marfil y noir.
const v = (name: string) => `var(--${name})`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Panta', '"Cormorant Garamond"', 'Georgia', 'serif'],
        serif:   ['Panta', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        noir:   v('brand-noir'),
        oro:    { DEFAULT: v('brand-oro'), claro: v('brand-oro-claro'), profundo: v('brand-oro-profundo'), texto: v('brand-oro-texto') },
        marfil: v('brand-marfil'),
        lacre:  v('brand-lacre'),
        surface: { DEFAULT: v('surface'), alt: v('surface-alt'), inverse: v('surface-inverse') },
        ink:     { DEFAULT: v('ink'), soft: v('ink-soft'), muted: v('ink-muted') },
        accent:  { DEFAULT: v('accent'), decor: v('accent-decor') },
        line:    { DEFAULT: v('line'), strong: v('line-strong') },
        control: v('control-border'),
        action:  { DEFAULT: v('action'), hover: v('action-hover'), on: v('on-action') },
        special: { DEFAULT: v('special'), on: v('on-special') },
        danger:  v('danger'),
        focus:   v('focus'),
      },
      fontSize: {
        'wordmark-sm': ['26px', { lineHeight: '1', letterSpacing: '0.28em', fontWeight: '500' }],
        'perfume-xl':  ['34px', { lineHeight: '1.1' }],
        perfume:       ['26px', { lineHeight: '1.2' }],
        'perfume-sm':  ['20px', { lineHeight: '1.25' }],
        title:         ['20px', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        nav:           ['15px', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        body:          ['14px', { lineHeight: '1.55' }],
        'body-sm':     ['13px', { lineHeight: '1.5' }],
        eyebrow:       ['12px', { lineHeight: '1.4', letterSpacing: '0.24em', fontWeight: '500' }],
        legal:         ['11px', { lineHeight: '1.45', letterSpacing: '0.18em' }],
      },
      spacing: {
        'ez-1': '6px', 'ez-2': '8px', 'ez-3': '12px', 'ez-4': '16px',
        'ez-5': '20px', 'ez-6': '32px', 'ez-7': '48px', 'ez-8': '56px',
        control: '44px', header: '76px',
      },
      borderRadius: {
        sm: '6px', DEFAULT: '8px', md: '8px', lg: '12px', xl: '12px', '2xl': '12px',
      },
      boxShadow: {
        hairline: v('shadow-hairline'),
      },
    },
  },
  plugins: [],
} satisfies Config;
