import { Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import type { Championship } from '@/types/championship.types';
import { FlagImage } from '@/components/shared';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resuelve la ruta del logo estático para un mundial dado su año.
 * Los assets viven en src/assets/worldcups/{year}.png
 */
const getLogoUrl = (year: number): string =>
  new URL(`../../../assets/worldcups/${year}.png`, import.meta.url).href;

// ─── Mapa de color por código de campeón ──────────────────────────────────────

const CHAMPION_ACCENT: Record<string, string> = {
  UY: 'var(--wc-chart-cyan)',
  URU: 'var(--wc-chart-cyan)',
  IT: 'var(--wc-chart-red)',
  ITA: 'var(--wc-chart-red)',
  BR: 'var(--wc-chart-green)',
  BRA: 'var(--wc-chart-green)',
  DE: 'var(--wc-accent-gold)',
  GER: 'var(--wc-accent-gold)',
  FRG: 'var(--wc-accent-gold)',
  GB: 'var(--wc-chart-pink)',
  ENG: 'var(--wc-chart-pink)',
  AR: 'var(--wc-chart-sky)',
  ARG: 'var(--wc-chart-sky)',
  FR: 'var(--wc-conf-uefa-bar)',
  FRA: 'var(--wc-conf-uefa-bar)',
  ES: 'var(--wc-conf-concacaf-bar)',
  ESP: 'var(--wc-conf-concacaf-bar)',
};

const DEFAULT_ACCENT = 'var(--wc-text-muted)';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChampionshipCardProps {
  championship: Championship;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Card que representa una edición del mundial.
 * Muestra el logo oficial, año, sedes organizadoras y campeón.
 */
export function ChampionshipCard({ championship }: ChampionshipCardProps) {
  const { year, hosts, champion } = championship;

  const accentColor = CHAMPION_ACCENT[champion.code] ?? DEFAULT_ACCENT;

  const logoUrl = getLogoUrl(year);

  return (
    <Link
      to={`/worldcup/${year}`}
      className="group relative w-full text-left bg-wc-surface-primary border border-wc-border-primary rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-wc-accent-gold hover:bg-wc-conf-uefa-surface focus:outline-none focus:ring-2 focus:ring-wc-accent-gold focus:ring-offset-2 focus:ring-offset-wc-bg-primary"
    >
      {/* Barra lateral de color del campeón */}
      <div
        className="absolute top-0 left-0 w-[3px] h-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      {/* Logo del mundial */}
      <div className="flex items-center justify-center h-24 bg-wc-surface-secondary border-b border-wc-border-primary px-4">
        <img
          src={logoUrl}
          alt={`Logo del Mundial ${year}`}
          className="max-h-32 max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-200"
          onError={(e) => {
            // Fallback si el archivo no existe todavía
            const target = e.currentTarget;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        {/* Fallback placeholder — se muestra si la imagen no carga */}
        <span className="hidden text-2xl font-medium text-wc-accent-gold opacity-40">{year}</span>
      </div>

      {/* Info */}
      <div className="pl-4 pr-3 py-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <p className="text-lg font-medium text-wc-accent-gold leading-none shrink-0">{year}</p>

          <ul className="flex min-w-0 flex-col items-end gap-1" aria-label="Sedes">
            {hosts.map((host) => (
              <li
                key={`${year}-${host.code}`}
                className="max-w-full text-xs text-wc-text-primary flex items-center justify-end gap-1.5"
              >
                <FlagImage
                  countryCode={host.code}
                  alt={host.name}
                  width={16}
                  height={12}
                  className="rounded-[2px] shrink-0"
                />
                <span className="truncate">{host.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-wc-border-primary mb-2.5" />

        <p className="text-xs text-wc-text-muted flex items-center gap-1">
          <Star size={11} className="text-wc-accent-gold shrink-0" aria-hidden="true" />
          <span className="text-wc-text-primary truncate">{champion.name}</span>
        </p>
      </div>

      {/* Flecha hover */}
      <ChevronRight
        size={13}
        className="absolute bottom-3 right-2 text-wc-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        aria-hidden="true"
      />
    </Link>
  );
}
