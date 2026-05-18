/**
 * HeroSection — Componente presentacional
 *
 * Props:
 *   - badge?:       string            — texto del badge superior
 *   - title?:       string            — primera línea del título
 *   - titleAccent?: string            — segunda línea con color acento
 *   - description?: string            — párrafo descriptivo
 *   - stats?:       HeroStat[]        — métricas que se muestran debajo
 *   - champion?:    string            — nombre del campeón
 *   - runnerUp?:    string            — nombre del subcampeón
 *   - topScorer?:   string            — nombre del goleador
 *   - heroImage?:   React.ReactNode   — slot para imagen/asset real; si se omite muestra el placeholder
 */

import { Trophy, Globe, Users, Swords, type LucideIcon } from 'lucide-react';

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
  champion?: string;
  runnerUp?: string;
  topScorer?: string;
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

// ---------------------------------------------------------------------------
// Subcomponentes internos
// ---------------------------------------------------------------------------

function StatItem({ icon: Icon, value, label }: HeroStat) {
  return (
    <div className="text-center">
      <Icon size={14} className="text-[#8a8fa8] mx-auto mb-1" aria-hidden="true" />
      <p className="text-lg font-medium text-[#e8c84a] leading-none">{value}</p>
      <p className="text-xs text-[#8a8fa8] mt-0.5">{label}</p>
    </div>
  );
}

function HeroImagePlaceholder() {
  return (
    <div
      className="w-48 h-36 shrink-0 bg-[#1e2233] border border-[#2a2d3a] rounded-xl flex flex-col items-center justify-center gap-2"
      aria-label="Imagen del mundial — reemplazar con asset real"
    >
      <Trophy size={40} className="text-[#e8c84a] opacity-40" aria-hidden="true" />
      <span className="text-xs text-[#8a8fa8]">hero image</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function HeroDetailSection({
  badge = 'Historia de los mundiales de fútbol',
  title = 'Todos los',
  titleAccent = 'Mundiales de Fútbol',
  description = 'Estadísticas, fixtures, planteles y goleadores desde Uruguay 1930 hasta hoy.',
  champion = 'Brasil',
  runnerUp = 'Italia',
  topScorer = 'Müller (10)',
  stats = DEFAULT_STATS,
  heroImage,
}: HeroSectionProps) {
  return (
    <section className="font-mono bg-[#161925] border-b border-[#2a2d3a] px-6 py-10 flex items-center gap-8">
      {/* ── Texto ────────────────────────────────────────────────────── */}
      <div className="flex-1">
        <span className="inline-block bg-[#1e2a14] text-[#8fc44a] text-xs px-3 py-1 rounded-full border border-[#3a5a1a] mb-3">
          {badge}
        </span>

        <h1 className="text-2xl font-medium text-white leading-snug mb-2">
          {title} <span className="text-[#e8c84a]">{titleAccent}</span>
        </h1>

        <p className="text-sm text-[#8a8fa8] leading-relaxed mb-6 max-w-2sm">{description}</p>

        <div className="text-sm text-[#8a8fa8] leading-relaxed mb-6 max-w-2sm">
          <span className="text-[15px] px-2 py-0.5 bg-[#2a2415] text-[#f1c40f] border border-[#5e4e1e] rounded-full">
            Campeón: {champion}
          </span>
          <span className="text-[15px] px-2 py-0.5 bg-[#2a1d15] text-[#ff9f43] border border-[#5e3a1e] rounded-full">
            Subcampeón: {runnerUp}
          </span>
          <span className="text-[15px] px-2 py-0.5 bg-[#221735] text-[#a55eea] border border-[#482d75] rounded-full">
            Goleador: {topScorer}
          </span>
        </div>

        {/* ── Stats ─────────────────────────────────────────────────── */}
        <div className="flex gap-6">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      {/* ── Imagen: slot externo o placeholder ───────────────────────── */}
      {heroImage ?? <HeroImagePlaceholder />}
    </section>
  );
}
