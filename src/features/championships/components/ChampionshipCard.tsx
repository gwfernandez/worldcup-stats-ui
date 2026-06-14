import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Championship } from '@/types/championship.types';
import { FlagImage } from '@/components/shared';

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
const HOST_ROTATION_MS = 1500;
const HOST_FADE_MS = 300;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChampionshipCardProps {
  championship: Championship;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Card que representa una edición del mundial.
 * Muestra la bandera del anfitrión como elemento principal; en mundiales multi-sede,
 * alterna bandera y nombre del país con un carrusel automático sincronizado.
 */
export function ChampionshipCard({ championship }: ChampionshipCardProps) {
  const { year, hosts, champion } = championship;
  // champion.code se usa solo para la barra lateral de color
  const [activeHostIndex, setActiveHostIndex] = useState(0);
  const [isHostVisible, setIsHostVisible] = useState(true);

  const accentColor = CHAMPION_ACCENT[champion.code] ?? DEFAULT_ACCENT;
  const hasMultipleHosts = hosts.length > 1;
  const activeHost = hosts[hasMultipleHosts ? activeHostIndex % hosts.length : 0] ?? hosts[0];
  const isActiveHostVisible = hasMultipleHosts ? isHostVisible : true;

  useEffect(() => {
    if (!hasMultipleHosts) {
      return;
    }

    let fadeTimeoutId: number | undefined;

    const intervalId = window.setInterval(() => {
      setIsHostVisible(false);

      fadeTimeoutId = window.setTimeout(() => {
        setActiveHostIndex((currentIndex) => (currentIndex + 1) % hosts.length);
        setIsHostVisible(true);
      }, HOST_FADE_MS);
    }, HOST_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
      if (fadeTimeoutId !== undefined) {
        window.clearTimeout(fadeTimeoutId);
      }
    };
  }, [hasMultipleHosts, hosts.length]);

  return (
    <Link
      to={`/worldcup/${year}`}
      className="group relative w-full text-left bg-wc-surface-primary border border-wc-border-primary rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-wc-accent-gold focus:outline-none focus:ring-2 focus:ring-wc-accent-gold focus:ring-offset-2 focus:ring-offset-wc-bg-primary"
    >
      {/* Barra lateral de color del campeón */}
      <div
        className="absolute top-0 left-0 w-[3px] h-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      {/* Contenido centrado: bandera → año → país */}
      <div className="flex flex-col items-center gap-2.5 px-4 py-5">
        <FlagImage
          countryCode={activeHost.code}
          alt={activeHost.name}
          width={96}
          height={72}
          className={`rounded-md shadow-sm transition-opacity duration-300 ease-in-out ${
            isActiveHostVisible ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'
          }`}
        />

        <p className="text-[22px] font-medium text-wc-accent-gold leading-none">{year}</p>

        <p
          className={`text-xs text-wc-text-secondary text-center truncate w-full transition-opacity duration-300 ease-in-out ${
            isActiveHostVisible ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label={hasMultipleHosts ? 'Sede activa' : 'Sede'}
        >
          {activeHost.name}
        </p>
      </div>
    </Link>
  );
}
