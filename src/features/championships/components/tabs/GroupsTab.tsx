import { useState } from 'react';
import type { Group, EliminationPhase, Match } from '@/types/championship.types';
import { GroupCard } from '@/features/championships/components/groups/GroupCard';
import { PhaseRow } from '@/features/championships/components/elimination/PhaseRow';
import { MatchModal } from '@/features/championships/components/shared/MatchModal';

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
      <div className="max-w-4xl mx-auto">
        {/* Fase de grupos */}
        <section aria-labelledby="groups-heading">
          <h3
            id="groups-heading"
            className="text-[11px] text-[#8a8fa8] uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
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
              className="text-[11px] text-[#8a8fa8] uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
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
      </div>
      {/* Modal de detalle */}
      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </>
  );
}
