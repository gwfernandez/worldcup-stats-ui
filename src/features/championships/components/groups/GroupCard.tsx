import type { Group, Match } from '@/types/championship.types';
import { GroupStandingsTable } from './GroupStandingsTable';
import { MatchRow } from '../shared/MatchRow';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GroupCardProps {
  group: Group;
  onMatchSelect: (match: Match) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Card de grupo que muestra tabla de posiciones a la izquierda
 * y lista de partidos a la derecha.
 */
export function GroupCard({ group, onMatchSelect }: GroupCardProps) {
  return (
    <div className="bg-wc-surface-primary border border-wc-border-primary rounded-xl mb-3 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-wc-border-primary">
        <span className="text-xs font-medium text-wc-accent-gold">{group.name}</span>
      </div>

      {/* Body: tabla | partidos */}
      <div className="grid grid-cols-2">
        {/* Tabla de posiciones */}
        <div className="border-r border-wc-border-primary">
          <GroupStandingsTable standings={group.standings} />
        </div>

        {/* Partidos */}
        <div>
          {group.matches.map((match) => (
            <MatchRow key={match.id} match={match} onSelect={onMatchSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
