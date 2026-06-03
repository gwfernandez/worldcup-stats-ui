import { Trophy, Repeat } from 'lucide-react';
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
        {isFinal ? (
          <Trophy size={12} stroke="#e8c84a" aria-hidden="true" />
        ) : (
          <Repeat size={12} stroke="#e8c84a" aria-hidden="true" />
        )}
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
