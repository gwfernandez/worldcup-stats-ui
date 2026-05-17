import { useEffect } from 'react';
import type { HistoricalScorer } from '@/types/historicalScorer.types';
import { MEDAL_LABEL } from '@/types/historicalScorer.types';
import { CONFEDERATION_STYLES, CONFEDERATION_TOOLTIP } from '@/types/historicalStanding.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG_URL = (code: string) => `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HistoricalScorerModalProps {
  scorer: HistoricalScorer | null;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal de detalle de goleador histórico.
 * Muestra stats globales y tabla con goles agrupados por mundial.
 */
export function HistoricalScorerModal({ scorer, onClose }: HistoricalScorerModalProps) {
  useEffect(() => {
    if (!scorer) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [scorer, onClose]);

  if (!scorer) return null;

  const confStyle = CONFEDERATION_STYLES[scorer.confederation];
  const confTooltip = CONFEDERATION_TOOLTIP[scorer.confederation];
  const titles = scorer.worldCups.filter((wc) => wc.medal === 'gold').length;
  const sorted = [...scorer.worldCups].sort((a, b) => a.year - b.year);

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle histórico de ${scorer.playerName}`}
    >
      <div
        className="bg-[#161925] border border-[#2a2d3a] rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d3a]">
          <div className="flex items-center gap-2 text-sm font-medium text-[#e8eaf0]">
            <img
              src={FLAG_URL(scorer.teamCode)}
              alt={scorer.teamName}
              width={18}
              height={13}
              className="rounded-[2px]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {scorer.playerName} — {scorer.teamName}
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
              { val: scorer.totalGoals, lbl: 'Goles totales' },
              { val: scorer.worldCups.length, lbl: 'Mundiales' },
              { val: scorer.average.toFixed(2), lbl: 'Promedio' },
              { val: titles > 0 ? `🏆 ${titles}` : '—', lbl: 'Títulos' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center flex-1">
                <p className="text-[17px] font-medium text-[#e8c84a] leading-none">{val}</p>
                <p className="text-[10px] text-[#8a8fa8] mt-1">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Confederación */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-[#8a8fa8]">Confederación:</span>
            <div className="relative inline-flex group/conf cursor-default">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-[#1e2233] text-[#8a8fa8] border-[#2a2d3a]'}`}
              >
                {scorer.confederation}
              </span>
              {confTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/conf:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                  {confTooltip}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
                </div>
              )}
            </div>
          </div>

          {/* Tabla por mundial */}
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-[#2a2d3a]">
                <th className="text-left font-normal text-[#8a8fa8] pb-2 pr-3">Mundial</th>
                <th className="text-right font-normal text-[#8a8fa8] pb-2 pr-3">Goles</th>
                <th className="text-right font-normal text-[#8a8fa8] pb-2 pr-3">Promedio</th>
                <th className="text-right font-normal text-[#8a8fa8] pb-2">Medalla</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((wc) => (
                <tr key={wc.year} className="border-t border-[#1e2233]">
                  {/* Mundial */}
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={FLAG_URL(wc.hostCode)}
                        alt={wc.host}
                        width={14}
                        height={10}
                        className="rounded-[1px] shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="font-medium text-[#e8c84a]">{wc.year}</span>
                      <span className="text-[#8a8fa8]">{wc.host}</span>
                    </div>
                  </td>

                  {/* Goles */}
                  <td className="py-2 pr-3 text-right font-medium text-[#e8c84a]">{wc.goals}</td>

                  {/* Promedio */}
                  <td className="py-2 pr-3 text-right text-[#8a8fa8]">
                    {wc.goals > 0 ? wc.average.toFixed(2) : '—'}
                  </td>

                  {/* Medalla / desempeño */}
                  <td className="py-2 text-right">
                    {wc.medal ? (
                      <span className="text-sm">{MEDAL_LABEL[wc.medal]}</span>
                    ) : (
                      <span className="text-[10px] text-[#8a8fa8]">{wc.performance}</span>
                    )}
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
