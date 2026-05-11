import { Star, ChevronRight } from 'lucide-react';
import type { WorldCup } from '../../../types/worldcup.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resuelve la ruta del logo estático para un mundial dado su año.
 * Los assets viven en src/assets/worldcups/{year}.png
 */
const getLogoUrl = (year: number): string =>
  new URL(`../../../assets/worldcups/${year}.png`, import.meta.url).href;

// ─── Mapa de color por código de campeón ──────────────────────────────────────

const CHAMPION_ACCENT: Record<string, string> = {
  UY: '#4a9fd4',
  IT: '#d44a4a',
  BR: '#4ad45a',
  DE: '#e8c84a',
  GB: '#d44a7a',
  AR: '#78b4e8',
  FR: '#4a78d4',
  ES: '#d4874a',
};

const DEFAULT_ACCENT = '#8a8fa8';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface WorldCupCardProps {
  worldCup: WorldCup;
  onClick: (year: number) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Card que representa una edición del mundial.
 * Muestra el logo oficial, año, país organizador y campeón.
 */
export function WorldCupCard({ worldCup: worldCup, onClick }: WorldCupCardProps) {
  const { year, country, countryCode, champion, championCode } = worldCup;

  const accentColor = championCode
    ? (CHAMPION_ACCENT[championCode] ?? DEFAULT_ACCENT)
    : DEFAULT_ACCENT;

  const logoUrl = getLogoUrl(year);

  const countryFlag = `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;

  return (
    <button
      onClick={() => onClick(year)}
      className="group relative w-full text-left bg-[#161925] border border-[#2a2d3a] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#e8c84a] hover:bg-[#1a1e2e] focus:outline-none focus:ring-2 focus:ring-[#e8c84a] focus:ring-offset-2 focus:ring-offset-[#0f1117]"
    >
      {/* Barra lateral de color del campeón */}
      <div
        className="absolute top-0 left-0 w-[3px] h-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      {/* Logo del mundial */}
      <div className="flex items-center justify-center h-24 bg-[#1e2233] border-b border-[#2a2d3a] px-4">
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
        <span className="hidden text-2xl font-medium text-[#e8c84a] opacity-40">{year}</span>
      </div>

      {/* Info */}
      <div className="pl-4 pr-3 py-3">
        <p className="text-lg font-medium text-[#e8c84a] leading-none mb-1">{year}</p>

        <p className="text-xs text-[#e8eaf0] flex items-center gap-1.5 mb-2.5">
          <img
            src={countryFlag}
            alt={country}
            width={16}
            height={12}
            className="rounded-[2px] shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {country}
        </p>

        <div className="h-px bg-[#2a2d3a] mb-2.5" />

        <p className="text-xs text-[#8a8fa8] flex items-center gap-1">
          <Star size={11} className="text-[#e8c84a] shrink-0" aria-hidden="true" />
          <span className="text-[#e8eaf0] truncate">{champion ?? '—'}</span>
        </p>
      </div>

      {/* Flecha hover */}
      <ChevronRight
        size={13}
        className="absolute bottom-3 right-2 text-[#8a8fa8] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        aria-hidden="true"
      />
    </button>
  );
}
