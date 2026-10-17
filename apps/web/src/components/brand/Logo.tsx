import type { CSSProperties } from 'react';

type Tone = 'auto' | 'oro' | 'noir' | 'marfil';

const TONES: Record<Tone, string> = {
  auto: 'var(--logo-mark)',
  oro: 'var(--brand-oro)',
  noir: 'var(--brand-noir)',
  marfil: 'var(--brand-marfil)',
};

/** Isotipo: cinco frascos ascendentes con una gota (la esencia que sube). */
export function Isotipo({ tone = 'auto', size = 48, label }: { tone?: Tone; size?: number; label?: string }) {
  return (
    <svg
      viewBox="0 0 100 100" width={size} height={size} className="block flex-none"
      style={{ fill: TONES[tone] }}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
    >
      <circle cx={50} cy={13} r={4} />
      <rect x={22.5} y={52} width={7} height={30} rx={1.5} />
      <rect x={34.5} y={38} width={7} height={44} rx={1.5} />
      <rect x={46.5} y={23} width={7} height={59} rx={1.5} />
      <rect x={58.5} y={38} width={7} height={44} rx={1.5} />
      <rect x={70.5} y={52} width={7} height={30} rx={1.5} />
      <rect x={18} y={86} width={64} height={2} />
    </svg>
  );
}

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'isotipo';
  tone?: Tone;
  /** Alto del isotipo en px. */
  size?: number;
  tagline?: string | false;
  className?: string;
}

/** Logotipo Esenzzia. Con tone="auto" toma logo-mark e ink del tema activo. */
export default function Logo({ variant = 'horizontal', tone = 'auto', size, tagline, className = '' }: LogoProps) {
  if (variant === 'isotipo') return <span className={`inline-flex ${className}`}><Isotipo tone={tone} size={size ?? 64} label="Esenzzia" /></span>;

  const wordColor = tone === 'auto' ? 'var(--ink)' : tone === 'oro' ? 'var(--brand-marfil)' : TONES[tone];

  if (variant === 'vertical') {
    const m = size ?? 120;
    return (
      <span className={`inline-flex flex-col items-center ${className}`} style={{ color: wordColor, gap: m * 0.16 }}>
        <Isotipo tone={tone} size={m} />
        <span
          className="font-display font-medium leading-none whitespace-nowrap"
          style={{ fontSize: m * 0.43, letterSpacing: '0.3em', marginRight: '-0.3em' }}
        >
          ESENZZIA
        </span>
        {tagline !== false && (
          <Filete tone={tone === 'auto' ? undefined : 'oro'} style={{ fontSize: Math.max(m * 0.15, 15) }}>
            {tagline || 'Esencias que perduran'}
          </Filete>
        )}
      </span>
    );
  }

  const m = size ?? 40;
  return (
    <span className={`inline-flex items-center gap-ez-3 ${className}`} style={{ color: wordColor }} role="img" aria-label="Esenzzia">
      <Isotipo tone={tone} size={m} />
      <span className="w-px bg-line-strong" style={{ height: m * 0.7 }} aria-hidden />
      <span
        className="font-display font-medium leading-none whitespace-nowrap tracking-[0.28em]"
        style={{ fontSize: m * 0.65 }} aria-hidden
      >
        ESENZZIA
      </span>
    </span>
  );
}

/** Filete: ornamento oro de 56 × 1 px a cada lado de una línea en cursiva. Una vez por pantalla. */
export function Filete({ children, tone, className = '', style }: { children?: React.ReactNode; tone?: 'oro'; className?: string; style?: CSSProperties }) {
  return (
    <span className={`inline-flex items-center gap-[18px] ${tone === 'oro' ? 'text-oro' : 'text-accent'} ${className}`}>
      <span className="w-14 h-px bg-accent-decor flex-none" aria-hidden />
      {children && (
        <>
          <span className="font-display italic text-perfume" style={style}>{children}</span>
          <span className="w-14 h-px bg-accent-decor flex-none" aria-hidden />
        </>
      )}
    </span>
  );
}
