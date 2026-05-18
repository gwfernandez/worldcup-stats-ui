import type { EliminationPhase, Match } from '@/types/championship.types';
import { MatchRow } from '@/features/championships/components/shared/MatchRow';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PhaseRowProps {
  phase: EliminationPhase;
  onMatchSelect: (match: Match) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Fila de una fase eliminatoria con header y lista de partidos.
 * La Final tiene tratamiento visual especial con color dorado.
 */
export function PhaseRow({ phase, onMatchSelect }: PhaseRowProps) {
  const isFinal = phase.isFinal;

  return (
    <div className="mb-2.5">
      {/* Header de fase */}
      <div
        className={`px-3 py-[6px] flex items-center gap-2 text-[11px] rounded-t-lg border ${
          isFinal ? 'bg-[#1e2a14] border-[#3a5a1a]' : 'bg-[#161925] border-[#2a2d3a]'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isFinal ? '#e8c84a' : '#e8c84a'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {isFinal ? (
            // ícono copa
            <>
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
            </>
          ) : (
            // ícono torneo
            <>
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </>
          )}
        </svg>
        <span className={`font-medium ${isFinal ? 'text-[#e8c84a]' : 'text-[#e8c84a]'}`}>
          {phase.name}
        </span>
      </div>

      {/* Partidos */}
      <div
        className={`bg-[#161925] border border-t-0 rounded-b-lg overflow-hidden ${
          isFinal ? 'border-[#3a5a1a]' : 'border-[#2a2d3a]'
        }`}
      >
        {phase.matches.map((match) => (
          <MatchRow key={match.id} match={match} onSelect={onMatchSelect} showWinner />
        ))}
      </div>
    </div>
  );
}
