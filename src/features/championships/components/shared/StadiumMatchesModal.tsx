import { useEffect } from 'react';
import { Building, X, MapPin, Users, AlertCircle } from 'lucide-react';
import type { ChampionshipStadium, ChampionshipStadiumMatch } from '@/types/stadium.types';
import { FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useChampionshipStadiumMatches } from '../../hooks/useChampionshipStadiumMatches';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StadiumMatchesModalProps {
  year: number;
  stadium: ChampionshipStadium | null;
  onClose: () => void;
}

const formatScore = (
  score: number | null,
  penalties: number | null,
): string => {
  if (score === null) return '—';
  return penalties === null ? String(score) : `${score} (${penalties})`;
};

const formatMatchScore = (match: ChampionshipStadiumMatch): string => {
  if (match.homeTeamScore === null || match.awayTeamScore === null) return 'vs';

  return `${formatScore(match.homeTeamScore, match.homeTeamScorePenalties)} – ${formatScore(
    match.awayTeamScore,
    match.awayTeamScorePenalties,
  )}`;
};

const getMatchKey = (match: ChampionshipStadiumMatch, index: number): string =>
  [
    match.matchDate ?? 'no-date',
    match.matchTime ?? 'no-time',
    match.homeTeam.code,
    match.awayTeam.code,
    index,
  ].join('-');

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal con los partidos jugados en un estadio.
 * El encabezado usa los datos de la fila seleccionada y el listado viene del endpoint.
 */
export function StadiumMatchesModal({ year, stadium, onClose }: StadiumMatchesModalProps) {
  const { t } = useTranslation('common');
  const { matches, isLoading, isError, refetch } = useChampionshipStadiumMatches(
    year,
    stadium?.id ?? null,
  );

  useEffect(() => {
    if (!stadium) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stadium, onClose]);

  if (!stadium) return null;

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
            {isLoading && (
              <p className="py-6 text-center text-sm text-wc-text-muted" role="status">
                {t('stadiumMatchesDialog.loading')}
              </p>
            )}

            {isError && !isLoading && (
              <div className="py-6 text-center">
                <p className="mb-3 text-sm text-wc-danger-text">
                  {t('stadiumMatchesDialog.loadError')}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-md border border-wc-border-primary px-3 py-1.5 text-xs text-wc-text-primary transition-colors hover:border-wc-accent-gold hover:text-wc-accent-gold focus:outline-none"
                >
                  {t('actions.retry')}
                </button>
              </div>
            )}

            {!isLoading && !isError && matches.length === 0 && (
              <p className="py-6 text-center text-sm text-wc-text-muted">
                {t('stadiumMatchesDialog.empty')}
              </p>
            )}

            {!isLoading &&
              !isError &&
              matches.map((match, index) => (
                <div
                  key={getMatchKey(match, index)}
                  className="w-full flex items-center gap-2 px-3 py-[5px] border-t border-wc-surface-secondary first:border-t-0 text-left"
                >
                  <span className="text-[10px] text-wc-text-muted min-w-[72px] shrink-0">
                    {match.matchDate ?? '—'}
                  </span>

                  <div className="flex items-center gap-1.5 flex-1 text-xs overflow-hidden text-wc-text-primary">
                    <FlagImage
                      countryCode={match.homeTeam.code}
                      alt={match.homeTeam.name}
                      width={14}
                      height={10}
                      className="rounded-[1px] shrink-0"
                    />
                    <span className="truncate">{match.homeTeam.name}</span>
                  </div>

                  <span className="text-[12px] font-medium text-wc-accent-gold min-w-[58px] text-center shrink-0">
                    {formatMatchScore(match)}
                  </span>

                  <div className="flex items-center justify-end gap-1.5 flex-1 text-xs overflow-hidden text-wc-text-primary">
                    <span className="truncate text-right">{match.awayTeam.name}</span>
                    <FlagImage
                      countryCode={match.awayTeam.code}
                      alt={match.awayTeam.name}
                      width={14}
                      height={10}
                      className="rounded-[1px] shrink-0"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
