import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Scorer } from '@/types/scorer.types';
import { FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');

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
      aria-label={t('dialogs.goalsFor', { player: playerName })}
    >
      <div
        className="bg-wc-surface-primary border border-wc-border-primary rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border-primary">
          <div className="flex items-center gap-2 text-sm font-medium text-wc-text-primary">
            <FlagImage countryCode={teamCode} alt={teamName} className="rounded-[2px]" />
            {playerName} — {teamName}
          </div>
          <button
            onClick={onClose}
            className="text-wc-text-muted hover:text-wc-text-primary transition-colors focus:outline-none"
            aria-label={t('actions.close')}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-4">
          {/* Stats resumen */}
          <div className="flex gap-5 px-4 py-3 bg-wc-surface-secondary border border-wc-border-primary rounded-lg mb-4">
            {[
              { val: totalGoals, lbl: t('labels.goals') },
              { val: matchesPlayed, lbl: t('labels.matches') },
              { val: average.toFixed(2), lbl: t('labels.average') },
              { val: new Set(goals.map((g) => g.phase)).size, lbl: t('labels.phases') },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center flex-1">
                <p className="text-lg font-medium text-wc-accent-gold leading-none">{val}</p>
                <p className="text-[10px] text-wc-text-muted mt-1">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Tabla de goles */}
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-wc-border-primary">
                <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2 pr-3">
                  {t('labels.date')}
                </th>
                <th className="text-right text-[11px] font-normal text-wc-text-muted pb-2 pr-3">
                  {t('labels.minute')}
                </th>
                <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2 pr-3">
                  {t('labels.rival')}
                </th>
                <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
                  {t('labels.phase')}
                </th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => {
                const isFinalPhase = FINAL_PHASES.includes(goal.phase);
                return (
                  <tr key={goal.id} className="border-t border-wc-surface-secondary">
                    <td className="py-2 pr-3 text-wc-text-muted whitespace-nowrap">{goal.date}</td>
                    <td className="py-2 pr-3 text-right">
                      <span className="text-[11px] font-medium text-wc-accent-gold">
                        {goal.minute}'
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1.5">
                        <FlagImage
                          countryCode={goal.rivalTeamCode}
                          alt={goal.rivalTeam}
                          width={14}
                          height={10}
                          className="rounded-[1px] shrink-0"
                        />
                        <span className="text-wc-text-primary">{goal.rivalTeam}</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          isFinalPhase
                            ? 'bg-wc-success-surface border-wc-success-border text-wc-success'
                            : 'bg-wc-surface-secondary border-wc-border-primary text-wc-text-muted'
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
