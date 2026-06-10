import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { HistoricalScorer } from '@/types/historicalScorer.types';
import { MEDAL_LABEL } from '@/types/historicalScorer.types';
import { CONFEDERATION_STYLES } from '@/types/historicalStanding.types';
import { CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { Tooltip, FlagImage } from '@/components/shared';

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
  const confTooltip = CONFEDERATION_TOOLTIP[scorer.confederation] ?? '';
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
        className="bg-wc-surface-primary border border-wc-border-primary rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border-primary">
          <div className="flex items-center gap-2 text-sm font-medium text-wc-text-primary">
            <FlagImage
              countryCode={scorer.teamCode}
              alt={scorer.teamName}
              className="rounded-[2px]"
            />
            {scorer.playerName} — {scorer.teamName}
          </div>
          <button
            onClick={onClose}
            className="text-wc-text-muted hover:text-wc-text-primary transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-4">
          {/* Stats resumen */}
          <div className="flex gap-5 px-4 py-3 bg-wc-surface-secondary border border-wc-border-primary rounded-lg mb-4">
            {[
              { val: scorer.totalGoals, lbl: 'Goles totales' },
              { val: scorer.worldCups.length, lbl: 'Mundiales' },
              { val: scorer.average.toFixed(2), lbl: 'Promedio' },
              { val: titles > 0 ? `🏆 ${titles}` : '—', lbl: 'Títulos' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center flex-1">
                <p className="text-[17px] font-medium text-wc-accent-gold leading-none">{val}</p>
                <p className="text-[10px] text-wc-text-muted mt-1">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Confederación */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-wc-text-muted">Confederación:</span>
            <Tooltip content={confTooltip} groupName="conf" hideWhenEmpty>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-wc-surface-secondary text-wc-text-muted border-wc-border-primary'}`}
              >
                {scorer.confederation}
              </span>
            </Tooltip>
          </div>

          {/* Tabla por mundial */}
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-wc-border-primary">
                <th className="text-left font-normal text-wc-text-muted pb-2 pr-3">Mundial</th>
                <th className="text-right font-normal text-wc-text-muted pb-2 pr-3">Goles</th>
                <th className="text-right font-normal text-wc-text-muted pb-2 pr-3">Promedio</th>
                <th className="text-right font-normal text-wc-text-muted pb-2">Medalla</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((wc) => (
                <tr key={wc.year} className="border-t border-wc-surface-secondary">
                  {/* Mundial */}
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <FlagImage
                        countryCode={wc.hostCode}
                        alt={wc.host}
                        width={14}
                        height={10}
                        className="rounded-[1px] shrink-0"
                      />
                      <span className="font-medium text-wc-accent-gold">{wc.year}</span>
                      <span className="text-wc-text-muted">{wc.host}</span>
                    </div>
                  </td>

                  {/* Goles */}
                  <td className="py-2 pr-3 text-right font-medium text-wc-accent-gold">
                    {wc.goals}
                  </td>

                  {/* Promedio */}
                  <td className="py-2 pr-3 text-right text-wc-text-muted">
                    {wc.goals > 0 ? wc.average.toFixed(2) : '—'}
                  </td>

                  {/* Medalla / desempeño */}
                  <td className="py-2 text-right">
                    {wc.medal ? (
                      <span className="text-sm">{MEDAL_LABEL[wc.medal]}</span>
                    ) : (
                      <span className="text-[10px] text-wc-text-muted">{wc.performance}</span>
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
