import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Championship } from '@/types/championship.types';
import { CONFEDERATION_STYLES } from '@/types/historicalStanding.types';
import { FlagImage } from '@/components/shared';

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
  const { year, hosts, confederationCodes } = championship;
  const [activeHostIndex, setActiveHostIndex] = useState(0);
  const [isHostVisible, setIsHostVisible] = useState(true);

  const accentColor = CONFEDERATION_STYLES[confederationCodes[0]]?.bar ?? DEFAULT_ACCENT;
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
      {/* Barra lateral de color de la confederación organizadora */}
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
