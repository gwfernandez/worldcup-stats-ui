import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Match } from '@/types/championship.types';
import { FlagImage } from '@/components/shared';

const GOAL_TYPE_LABEL: Record<string, string> = {
  penalty: 'penal',
  own_goal: 'en propia',
  header: 'cabeza',
  normal: '',
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MatchModalProps {
  match: Match | null;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal centrado con overlay para el detalle de un partido.
 * Muestra equipos, resultado, metadata y lista de goles.
 */
export function MatchModal({ match, onClose }: MatchModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    if (!match) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [match, onClose]);

  if (!match) return null;

  const {
    homeTeam,
    homeTeamCode,
    awayTeam,
    awayTeamCode,
    homeScore,
    awayScore,
    date,
    stadium,
    attendance,
    phase,
    goals,
  } = match;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle del partido ${homeTeam} vs ${awayTeam}`}
    >
      <div
        className="bg-wc-surface-primary border border-wc-border-primary rounded-xl w-full max-w-sm max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border-primary">
          <span className="text-sm font-medium text-wc-text-primary">Detalle del partido</span>
          <button
            onClick={onClose}
            className="text-wc-text-muted hover:text-wc-text-primary transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          {/* Equipos y resultado */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center gap-1 flex-1">
              <FlagImage
                countryCode={homeTeamCode}
                alt={homeTeam}
                size="md"
                width={36}
                height={27}
                className="rounded"
              />
              <span className="text-xs text-wc-text-primary text-center">{homeTeam}</span>
            </div>
            <div className="text-2xl font-medium text-wc-accent-gold px-3">
              {homeScore !== null && awayScore !== null ? `${homeScore} – ${awayScore}` : 'vs'}
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <FlagImage
                countryCode={awayTeamCode}
                alt={awayTeam}
                size="md"
                width={36}
                height={27}
                className="rounded"
              />
              <span className="text-xs text-wc-text-primary text-center">{awayTeam}</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {date && (
              <span className="text-[11px] px-2 py-1 bg-wc-surface-secondary border border-wc-border-primary rounded-full text-wc-text-muted">
                {date}
              </span>
            )}
            {stadium && (
              <span className="text-[11px] px-2 py-1 bg-wc-surface-secondary border border-wc-border-primary rounded-full text-wc-text-muted">
                {stadium}
              </span>
            )}
            {attendance && (
              <span className="text-[11px] px-2 py-1 bg-wc-surface-secondary border border-wc-border-primary rounded-full text-wc-text-muted">
                {attendance.toLocaleString()} esp.
              </span>
            )}
            <span className="text-[11px] px-2 py-1 bg-wc-success-surface border border-wc-success-border rounded-full text-wc-success">
              {phase}
            </span>
          </div>

          {/* Goles */}
          {goals.length > 0 && (
            <div>
              <p className="text-[10px] text-wc-text-muted uppercase tracking-wider mb-1">Goles</p>
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center gap-2 py-1.5 border-t border-wc-surface-secondary text-xs text-wc-text-primary"
                >
                  <span className="text-[11px] text-wc-accent-gold min-w-[28px]">
                    {goal.minute}'
                  </span>
                  <FlagImage
                    countryCode={goal.teamCode}
                    alt=""
                    width={14}
                    height={10}
                    className="rounded-[1px]"
                  />
                  <span>{goal.playerName}</span>
                  {goal.type && goal.type !== 'normal' && (
                    <span className="text-[10px] text-wc-text-muted">
                      ({GOAL_TYPE_LABEL[goal.type] ?? goal.type})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {goals.length === 0 && (
            <p className="text-xs text-wc-text-muted text-center py-2">
              Sin detalle de goles disponible
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
