import { ExternalLink } from 'lucide-react';
import type { Match } from '@/types/championship.types';
import { FlagImage } from '@/components/shared';

const formatScore = (home: number | null, away: number | null): string =>
  home !== null && away !== null ? `${home} – ${away}` : 'vs';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MatchRowProps {
  match: Match;
  onSelect: (match: Match) => void;
  /** Resalta el equipo ganador en verde. Por defecto true */
  showWinner?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Fila de partido reutilizable para grupos y fases eliminatorias.
 * Muestra fecha, equipos, resultado y botón de detalle.
 */
export function MatchRow({ match, onSelect, showWinner = true }: MatchRowProps) {
  const { date, homeTeam, homeTeamCode, awayTeam, awayTeamCode, homeScore, awayScore } = match;

  const homeWon = showWinner && homeScore !== null && awayScore !== null && homeScore > awayScore;
  const awayWon = showWinner && homeScore !== null && awayScore !== null && awayScore > homeScore;

  return (
    <button
      onClick={() => onSelect(match)}
      className="w-full flex items-center gap-2 px-3 py-[5px] border-t border-wc-surface-secondary first:border-t-0 hover:bg-wc-surface-secondary transition-colors duration-150 focus:outline-none focus:bg-wc-surface-secondary text-left"
    >
      {/* Fecha */}
      <span className="text-[10px] text-wc-text-muted min-w-[46px] shrink-0">{date}</span>

      {/* Equipo local */}
      <div
        className={`flex items-center gap-1.5 flex-1 text-xs overflow-hidden ${homeWon ? 'text-wc-success font-medium' : 'text-wc-text-primary'}`}
      >
        <FlagImage
          countryCode={homeTeamCode}
          alt={homeTeam}
          width={14}
          height={10}
          className="rounded-[1px] shrink-0"
        />
        <span className="truncate">{homeTeam}</span>
      </div>

      {/* Marcador */}
      <span className="text-[12px] font-medium text-wc-accent-gold min-w-[36px] text-center shrink-0">
        {formatScore(homeScore, awayScore)}
      </span>

      {/* Equipo visitante */}
      <div
        className={`flex items-center justify-end gap-1.5 flex-1 text-xs overflow-hidden ${awayWon ? 'text-wc-success font-medium' : 'text-wc-text-primary'}`}
      >
        <span className="truncate text-right">{awayTeam}</span>
        <FlagImage
          countryCode={awayTeamCode}
          alt={awayTeam}
          width={14}
          height={10}
          className="rounded-[1px] shrink-0"
        />
      </div>

      {/* Ícono de detalle */}
      <ExternalLink size={11} className="text-wc-text-muted shrink-0" aria-hidden="true" />
    </button>
  );
}
