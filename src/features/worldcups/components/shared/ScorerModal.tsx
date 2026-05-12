import { useEffect } from 'react';
import type { Scorer } from '../../../../types/scorer.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG_URL = (code: string) => `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

const FINAL_PHASES = ['Final', 'Semifinales', 'Cuartos de final', 'Tercer puesto'];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ScorerModalProps {
  scorer: Scorer | null;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal de detalle de goleador.
 * Muestra resumen de stats y tabla con cada gol: fecha, minuto, rival y fase.
 */
export function ScorerModal({ scorer, onClose }: ScorerModalProps) {
  useEffect(() => {
    if (!scorer) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [scorer, onClose]);

  if (!scorer) return null;

  const { playerName, teamName, teamCode, totalGoals, matchesPlayed, average, goals } = scorer;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de goles de ${playerName}`}
    >
      <div
        className="bg-[#161925] border border-[#2a2d3a] rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d3a]">
          <div className="flex items-center gap-2 text-sm font-medium text-[#e8eaf0]">
            <img
              src={FLAG_URL(teamCode)}
              alt={teamName}
              width={18}
              height={13}
              className="rounded-[2px]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {playerName} — {teamName}
          </div>
          <button
            onClick={onClose}
            className="text-[#8a8fa8] hover:text-[#e8eaf0] transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-4">
          {/* Stats resumen */}
          <div className="flex gap-5 px-4 py-3 bg-[#1e2233] border border-[#2a2d3a] rounded-lg mb-4">
            {[
              { val: totalGoals, lbl: 'Goles' },
              { val: matchesPlayed, lbl: 'Partidos' },
              { val: average.toFixed(2), lbl: 'Promedio' },
              { val: new Set(goals.map((g) => g.phase)).size, lbl: 'Fases' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center flex-1">
                <p className="text-lg font-medium text-[#e8c84a] leading-none">{val}</p>
                <p className="text-[10px] text-[#8a8fa8] mt-1">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Tabla de goles */}
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#2a2d3a]">
                <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2 pr-3">
                  Fecha
                </th>
                <th className="text-right text-[11px] font-normal text-[#8a8fa8] pb-2 pr-3">
                  Min.
                </th>
                <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2 pr-3">
                  Rival
                </th>
                <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Fase</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => {
                const isFinalPhase = FINAL_PHASES.includes(goal.phase);
                return (
                  <tr key={goal.id} className="border-t border-[#1e2233]">
                    <td className="py-2 pr-3 text-[#8a8fa8] whitespace-nowrap">{goal.date}</td>
                    <td className="py-2 pr-3 text-right">
                      <span className="text-[11px] font-medium text-[#e8c84a]">{goal.minute}'</span>
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={FLAG_URL(goal.rivalTeamCode)}
                          alt={goal.rivalTeam}
                          width={14}
                          height={10}
                          className="rounded-[1px] shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="text-[#e8eaf0]">{goal.rivalTeam}</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          isFinalPhase
                            ? 'bg-[#1e2a14] border-[#3a5a1a] text-[#8fc44a]'
                            : 'bg-[#1e2233] border-[#2a2d3a] text-[#8a8fa8]'
                        }`}
                      >
                        {goal.phase}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
