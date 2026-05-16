import { useEffect } from 'react';
import type { ChampionTeam } from '../../../../types/champion.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG_URL = (code: string) => `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChampionshipsModalProps {
  team: ChampionTeam | null;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal con el detalle de todos los campeonatos ganados por una selección.
 * Muestra año, sede y resultado de la final.
 */
export function ChampionshipsModal({ team, onClose }: ChampionshipsModalProps) {
  useEffect(() => {
    if (!team) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [team, onClose]);

  if (!team) return null;

  const sorted = [...team.championships].sort((a, b) => a.year - b.year);
  const firstTitle = sorted[0]?.year;
  const lastTitle = sorted[sorted.length - 1]?.year;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Títulos de ${team.teamName}`}
    >
      <div
        className="bg-[#161925] border border-[#2a2d3a] rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d3a]">
          <div className="flex items-center gap-2 text-sm font-medium text-[#e8eaf0]">
            <img
              src={FLAG_URL(team.teamCode)}
              alt={team.teamName}
              width={20}
              height={15}
              className="rounded-[2px]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {team.teamName} — Títulos
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
              { val: `${team.titles} 🏆`, lbl: 'Títulos totales' },
              { val: firstTitle ?? '—', lbl: 'Primer título' },
              { val: lastTitle ?? '—', lbl: 'Último título' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center flex-1">
                <p className="text-[17px] font-medium text-[#e8c84a] leading-none">{val}</p>
                <p className="text-[10px] text-[#8a8fa8] mt-1">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Tabla de campeonatos */}
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-[#2a2d3a]">
                <th className="text-left font-normal text-[#8a8fa8] pb-2 pr-3">Año</th>
                <th className="text-left font-normal text-[#8a8fa8] pb-2 pr-3">Sede</th>
                <th className="text-right font-normal text-[#8a8fa8] pb-2">Final</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.year} className="border-t border-[#1e2233]">
                  {/* Año */}
                  <td className="py-2 pr-3">
                    <span className="font-medium text-[#e8c84a] text-[12px]">{c.year}</span>
                  </td>

                  {/* Sede */}
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={FLAG_URL(c.hostCode)}
                        alt={c.host}
                        width={13}
                        height={9}
                        className="rounded-[1px] shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-[#8a8fa8]">{c.host}</span>
                    </div>
                  </td>

                  {/* Resultado de la final */}
                  <td className="py-2 text-right">
                    <span className="font-medium text-[#e8c84a]">{c.finalScore}</span>{' '}
                    <span className="text-[#8a8fa8]">
                      vs{' '}
                      <img
                        src={FLAG_URL(c.finalOpponentCode)}
                        alt=""
                        width={12}
                        height={8}
                        className="rounded-[1px] inline-block mx-0.5 align-middle"
                        aria-hidden="true"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {c.finalOpponent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
