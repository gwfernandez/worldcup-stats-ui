import type { Match } from '@/types/worldcup.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG_URL = (code: string) => `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

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
      className="w-full flex items-center gap-2 px-3 py-[5px] border-t border-[#1e2233] first:border-t-0 hover:bg-[#1e2233] transition-colors duration-150 focus:outline-none focus:bg-[#1e2233] text-left"
    >
      {/* Fecha */}
      <span className="text-[10px] text-[#8a8fa8] min-w-[46px] shrink-0">{date}</span>

      {/* Equipo local */}
      <div
        className={`flex items-center gap-1.5 flex-1 text-xs overflow-hidden ${homeWon ? 'text-[#8fc44a] font-medium' : 'text-[#e8eaf0]'}`}
      >
        <img
          src={FLAG_URL(homeTeamCode)}
          alt={homeTeam}
          width={14}
          height={10}
          className="rounded-[1px] shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="truncate">{homeTeam}</span>
      </div>

      {/* Marcador */}
      <span className="text-[12px] font-medium text-[#e8c84a] min-w-[36px] text-center shrink-0">
        {formatScore(homeScore, awayScore)}
      </span>

      {/* Equipo visitante */}
      <div
        className={`flex items-center justify-end gap-1.5 flex-1 text-xs overflow-hidden ${awayWon ? 'text-[#8fc44a] font-medium' : 'text-[#e8eaf0]'}`}
      >
        <span className="truncate text-right">{awayTeam}</span>
        <img
          src={FLAG_URL(awayTeamCode)}
          alt={awayTeam}
          width={14}
          height={10}
          className="rounded-[1px] shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Ícono de detalle */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#8a8fa8] shrink-0"
        aria-hidden="true"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </button>
  );
}
