import { Trophy, Repeat } from 'lucide-react';
import type { EliminationPhase, Match } from '@/types/championship.types';
import { MatchRow } from '../shared/MatchRow';

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
          isFinal
            ? 'bg-wc-success-surface border-wc-success-border'
            : 'bg-wc-surface-primary border-wc-border-primary'
        }`}
      >
        {isFinal ? (
          <Trophy size={12} stroke="var(--wc-accent-gold)" aria-hidden="true" />
        ) : (
          <Repeat size={12} stroke="var(--wc-accent-gold)" aria-hidden="true" />
        )}
        <span className={`font-medium ${isFinal ? 'text-wc-accent-gold' : 'text-wc-accent-gold'}`}>
          {phase.name}
        </span>
      </div>

      {/* Partidos */}
      <div
        className={`bg-wc-surface-primary border border-t-0 rounded-b-lg overflow-hidden ${
          isFinal ? 'border-wc-success-border' : 'border-wc-border-primary'
        }`}
      >
        {phase.matches.map((match) => (
          <MatchRow key={match.id} match={match} onSelect={onMatchSelect} showWinner />
        ))}
      </div>
    </div>
  );
}
