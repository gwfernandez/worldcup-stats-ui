/**
 * HeroSection — Componente presentacional
 *
 * Props:
 *   - badge?:       string            — texto del badge superior
 *   - title?:       string            — primera línea del título
 *   - titleAccent?: string            — segunda línea con color acento
 *   - description?: string            — párrafo descriptivo
 *   - stats?:       HeroStat[]        — métricas que se muestran debajo
 *   - heroImage?:   React.ReactNode   — slot para imagen/asset real; si se omite muestra el placeholder
 */

import { Trophy, Globe, Users, Swords, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface HeroStat {
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface HeroSectionProps {
  badge?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  stats?: HeroStat[];
  heroImage?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_STATS: HeroStat[] = [
  { icon: Trophy, value: '22', label: 'Ediciones' },
  { icon: Globe, value: '80+', label: 'Selecciones' },
  { icon: Swords, value: '2800+', label: 'Partidos' },
  { icon: Users, value: '1000+', label: 'Jugadores' },
];
const DEFAULT_STAT_KEYS = ['editions', 'teams', 'matches', 'players'] as const;

// ---------------------------------------------------------------------------
// Subcomponentes internos
// ---------------------------------------------------------------------------

function StatItem({ icon: Icon, value, label }: HeroStat) {
  return (
    <div className="text-center">
      <Icon size={14} className="text-wc-text-muted mx-auto mb-1" aria-hidden="true" />
      <p className="text-lg font-medium text-wc-accent-gold leading-none">{value}</p>
      <p className="text-xs text-wc-text-muted mt-0.5">{label}</p>
    </div>
  );
}

function HeroImagePlaceholder() {
  const { t } = useTranslation('common');

  return (
    <div
      className="w-48 h-36 shrink-0 bg-wc-surface-secondary border border-wc-border-primary rounded-xl flex flex-col items-center justify-center gap-2"
      aria-label={t('app.heroImagePlaceholder')}
    >
      <Trophy size={40} className="text-wc-accent-gold opacity-40" aria-hidden="true" />
      <span className="text-xs text-wc-text-muted">hero image</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function HeroSection({
  badge,
  title,
  titleAccent,
  description,
  stats,
  heroImage,
}: HeroSectionProps) {
  const { t } = useTranslation(['championships', 'common']);
  const resolvedStats =
    stats ??
    DEFAULT_STATS.map((stat, index) => ({
      ...stat,
      label: t(`championships:stats.${DEFAULT_STAT_KEYS[index]}`),
    }));

  return (
    <section className="font-mono bg-wc-surface-primary border-b border-wc-border-primary">
      <div className="max-w-7xl mx-auto px-6 py-10 flex items-center gap-8">
        {/* ── Texto ────────────────────────────────────────────────────── */}
        <div className="flex-1">
          <span className="inline-block bg-wc-success-surface text-wc-success text-xs px-3 py-1 rounded-full border border-wc-success-border mb-3">
            {badge ?? t('championships:hero.badge')}
          </span>

          <h1 className="text-2xl font-medium text-white leading-snug mb-2">
            {title ?? t('championships:hero.title')}{' '}
            <span className="text-wc-accent-gold">
              {titleAccent ?? t('championships:hero.titleAccent')}
            </span>
          </h1>

          <p className="text-sm text-wc-text-muted leading-relaxed mb-6 max-w-2sm">
            {description ?? t('championships:hero.defaultDescription')}
          </p>

          {/* ── Stats ─────────────────────────────────────────────────── */}
          <div className="flex gap-6">
            {resolvedStats.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* ── Imagen: slot externo o placeholder ───────────────────────── */}
        <div className="hidden shrink-0 md:block">{heroImage ?? <HeroImagePlaceholder />}</div>
      </div>
    </section>
  );
}
