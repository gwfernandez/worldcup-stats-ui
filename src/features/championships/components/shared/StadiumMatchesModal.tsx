import { useEffect } from 'react';
import { Building, X, MapPin, Users, AlertCircle } from 'lucide-react';
import type { ChampionshipStadium } from '@/types/stadium.types';
import { MatchRow } from './MatchRow';
import type { Match } from '@/types/championship.types';
import { useTranslation } from 'react-i18next';
import { MOCK_STADIUM_MATCHES } from '../../mocks/stadiumMatches.mock';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StadiumMatchesModalProps {
  stadium: ChampionshipStadium | null;
  onClose: () => void;
  onMatchSelect: (match: Match) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal con los partidos jugados en un estadio.
 * Reutiliza MatchRow para consistencia visual con el resto de la app.
 */
export function StadiumMatchesModal({ stadium, onClose, onMatchSelect }: StadiumMatchesModalProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!stadium) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stadium, onClose]);

  if (!stadium) return null;

  const matches = MOCK_STADIUM_MATCHES.map((match) => ({
    ...match,
    stadium: stadium.name,
    attendance: stadium.capacity,
  }));
  const sorted = [...matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('dialogs.matchesAt', { stadium: stadium.name })}
    >
      <div
        className="bg-wc-surface-primary border border-wc-border-primary rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border-primary">
          <div className="flex items-center gap-2 text-sm font-medium text-wc-text-primary">
            <Building size={15} stroke="var(--wc-accent-gold)" aria-hidden="true" />
            {stadium.name}
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
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-wc-surface-secondary border border-wc-border-primary rounded-lg mb-4 text-[11px]">
            <span className="text-wc-text-muted flex items-center gap-1">
              <MapPin size={11} aria-hidden="true" />
              {t('labels.city')}:{' '}
              <span className="text-wc-text-primary ml-1">{stadium.cityName}</span>
            </span>
            {stadium.capacity > 0 && (
              <>
                <span className="text-wc-border-primary">·</span>
                <span className="text-wc-text-muted flex items-center gap-1">
                  <Users size={11} aria-hidden="true" />
                  {t('labels.capacityShort')}:{' '}
                  <span className="text-wc-text-primary ml-1">
                    {stadium.capacity.toLocaleString()}
                  </span>
                </span>
              </>
            )}
            <span className="text-wc-border-primary">·</span>
            <span className="text-wc-text-muted flex items-center gap-1">
              <AlertCircle size={11} aria-hidden="true" />
              {t('labels.matches')}:{' '}
              <span className="text-wc-text-primary ml-1">{stadium.matchesPlayed}</span>
            </span>
          </div>

          {/* Lista de partidos */}
          <div className="bg-wc-surface-secondary border border-wc-border-primary rounded-lg overflow-hidden">
            {sorted.map((match) => (
              <MatchRow key={match.id} match={match} onSelect={onMatchSelect} showWinner />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
