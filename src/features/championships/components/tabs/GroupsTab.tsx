import { useState } from 'react';
import { LayoutGrid, Repeat } from 'lucide-react';
import type { Group, EliminationPhase, Match } from '@/types/championship.types';
import { PhaseRow } from '../elimination/PhaseRow';
import { GroupCard } from '../groups/GroupCard';
import { MatchModal } from '../shared/MatchModal';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GroupsTabProps {
  groups: Group[];
  eliminationPhases: EliminationPhase[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Solapa 1 — Grupos y fixture.
 * Muestra la fase de grupos y la fase eliminatoria.
 * Gestiona el estado del modal de detalle de partido.
 */
export function GroupsTab({ groups, eliminationPhases }: GroupsTabProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <>
      {/* Fase de grupos */}
      <section aria-labelledby="groups-heading">
        <h3
          id="groups-heading"
          className="text-[11px] text-wc-text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
        >
          <LayoutGrid size={12} aria-hidden="true" />
          Fase de grupos
        </h3>

        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onMatchSelect={setSelectedMatch} />
        ))}
      </section>

      {/* Fase eliminatoria */}
      {eliminationPhases.length > 0 && (
        <section aria-labelledby="elimination-heading" className="mt-4">
          <h3
            id="elimination-heading"
            className="text-[11px] text-wc-text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
          >
            <Repeat size={12} aria-hidden="true" />
            Fase eliminatoria
          </h3>

          {eliminationPhases
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((phase) => (
              <PhaseRow key={phase.id} phase={phase} onMatchSelect={setSelectedMatch} />
            ))}
        </section>
      )}

      {/* Modal de detalle */}
      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </>
  );
}
