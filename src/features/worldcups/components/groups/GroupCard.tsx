import type { Group, Match } from '@/types/worldcup.types';
import { GroupStandingsTable } from '@/features/worldCups/components/groups/GroupStandingsTable';
import { MatchRow } from '@/features/worldCups/components/shared/MatchRow';

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
    <div className="bg-[#161925] border border-[#2a2d3a] rounded-xl mb-3 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#2a2d3a]">
        <span className="text-xs font-medium text-[#e8c84a]">{group.name}</span>
      </div>

      {/* Body: tabla | partidos */}
      <div className="grid grid-cols-2">
        {/* Tabla de posiciones */}
        <div className="border-r border-[#2a2d3a]">
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
