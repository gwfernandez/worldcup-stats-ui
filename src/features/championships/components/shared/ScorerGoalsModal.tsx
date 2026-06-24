import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { FlagImage } from '@/components/shared';
import type { PlayerGoal, Scorer } from '@/types/scorer.types';
import { useTranslation } from 'react-i18next';
import { usePlayerGoals } from '../../hooks/usePlayerGoals';

const MOBILE_MEDIA_QUERY = '(max-width: 639px)';

const formatMatchDate = (matchDate: string | null): string =>
  matchDate === null ? '—' : matchDate.slice(5);

const formatGoalMinute = (goal: PlayerGoal): string =>
  `${goal.minuteRegular}'${goal.penalty === true ? ' (P)' : ''}`;

interface PlayerGoalMatchGroup {
  key: string;
  matchDate: PlayerGoal['matchDate'];
  opponentTeam: PlayerGoal['opponentTeam'];
  stage: PlayerGoal['stage'];
  goals: PlayerGoal[];
}

const getGoalMatchKey = (goal: PlayerGoal): string =>
  JSON.stringify([goal.matchDate, goal.opponentTeam.code, goal.stage]);

const groupGoalsByMatch = (goals: PlayerGoal[]): PlayerGoalMatchGroup[] => {
  const groups = new Map<string, PlayerGoalMatchGroup>();

  goals.forEach((goal) => {
    const key = getGoalMatchKey(goal);
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.goals.push(goal);
      return;
    }

    groups.set(key, {
      key,
      matchDate: goal.matchDate,
      opponentTeam: goal.opponentTeam,
      stage: goal.stage,
      goals: [goal],
    });
  });

  return Array.from(groups.values());
};

const getIsMobileViewport = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(MOBILE_MEDIA_QUERY).matches;

export interface ScorerGoalsModalProps {
  selectedScorer: Scorer | null;
  year: number;
  onClose: () => void;
}

export function ScorerGoalsModal({ selectedScorer, year, onClose }: ScorerGoalsModalProps) {
  const { t } = useTranslation('common');
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);
  const { goals, isLoading, isError, refetch } = usePlayerGoals(selectedScorer?.playerId ?? null, year);
  const goalGroups = useMemo(() => groupGoalsByMatch(goals), [goals]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
    };

    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    if (!selectedScorer) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedScorer, onClose]);

  if (!selectedScorer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:px-4 sm:py-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('dialogs.goalsFor', { player: selectedScorer.fullName })}
    >
      <div
        className="max-h-[calc(100dvh-1rem)] w-[min(360px,calc(100vw-16px))] overflow-y-auto rounded-xl border border-wc-border-primary bg-wc-surface-primary sm:max-h-[85vh] sm:w-full sm:max-w-[490px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border-primary">
          <div className="flex min-w-0 items-center text-sm font-medium text-wc-text-primary">
            <span className="truncate">{selectedScorer.fullName}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-wc-text-muted hover:text-wc-text-primary transition-colors focus:outline-none"
            aria-label={t('actions.close')}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-3 py-4 sm:px-4">
          {isLoading && (
            <p role="status" className="py-8 text-center text-sm text-wc-text-muted">
              {t('scorerDetail.loading')}
            </p>
          )}

          {isError && (
            <div role="alert" className="py-8 text-center">
              <p className="text-sm text-red-400">{t('scorerDetail.loadError')}</p>
              <button
                type="button"
                onClick={refetch}
                className="mt-3 rounded-md border border-wc-border-primary px-3 py-1.5 text-xs text-wc-text-primary hover:border-wc-accent-gold hover:text-wc-accent-gold transition-colors"
              >
                {t('actions.retry')}
              </button>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="flex gap-5 px-4 py-3 bg-wc-surface-secondary border border-wc-border-primary rounded-lg mb-4">
                {[
                  { val: goals.length, lbl: t('labels.totalGoals') },
                  { val: year, lbl: t('labels.worldCup') },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="text-center flex-1">
                    <p className="text-[17px] font-medium text-wc-accent-gold leading-none">
                      {val}
                    </p>
                    <p className="text-[10px] text-wc-text-muted mt-1">{lbl}</p>
                  </div>
                ))}
                <div className="text-center flex-1" data-testid="scorer-goals-team-summary">
                  <div className="flex h-[17px] items-center justify-center">
                    <FlagImage
                      countryCode={selectedScorer.team.code}
                      alt={selectedScorer.team.name}
                      width={24}
                      height={17}
                      className="rounded-[2px] shrink-0"
                    />
                  </div>
                  <p className="text-[10px] text-wc-text-muted mt-1">{t('labels.team')}</p>
                </div>
              </div>

              {goals.length === 0 ? (
                <p className="py-8 text-center text-sm text-wc-text-muted">
                  {t('scorerDetail.empty')}
                </p>
              ) : isMobileViewport ? (
                <div className="space-y-2.5" data-testid="player-goal-cards">
                  {goalGroups.map((goalGroup) => (
                    <article
                      key={goalGroup.key}
                      className="rounded-lg border border-wc-border-primary bg-wc-surface-secondary px-3 py-2.5"
                      data-testid="player-goal-card"
                    >
                      <div className="border-b border-wc-border-primary pb-2">
                        <span className="block truncate text-[10px] text-wc-text-muted">
                          {goalGroup.stage ?? '—'}
                        </span>
                      </div>

                      <div
                        className="grid grid-cols-[64px_minmax(0,1fr)_72px] pt-2 text-center"
                        data-testid="player-goal-card-details"
                      >
                        <div>
                          <p className="text-[9px] text-wc-text-muted">{t('labels.date')}</p>
                          <p className="mt-0.5 text-[11px] text-wc-text-primary">
                            {formatMatchDate(goalGroup.matchDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-wc-text-muted">{t('labels.rival')}</p>
                          <div className="mt-0.5 flex items-center justify-center gap-1.5">
                            <FlagImage
                              countryCode={goalGroup.opponentTeam.code}
                              alt={goalGroup.opponentTeam.name}
                              width={16}
                              height={12}
                              className="rounded-[2px] shrink-0"
                            />
                            <span className="text-[11px] text-wc-text-primary">
                              {goalGroup.opponentTeam.name}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-wc-text-muted">
                            {t('labels.minuteFull')}
                          </p>
                          <div className="mt-1" data-testid="player-goal-subrows">
                            {goalGroup.goals.map((goal, goalIndex) => (
                              <div
                                key={`${goal.minuteRegular}-${goal.penalty === true ? 'penalty' : 'regular'}-${goalIndex}`}
                                className="py-1 text-[10px] leading-none text-wc-accent-gold first:pt-0 last:pb-0"
                                data-testid="player-goal-subrow"
                              >
                                {formatGoalMinute(goal)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto" data-testid="player-goals-scroll">
                  <table className="w-full min-w-[356px] table-fixed border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-wc-border-primary">
                        <th className="w-[52px] py-0 pr-1 pb-2 pl-0 text-center font-normal text-wc-text-muted">
                          {t('labels.date')}
                        </th>
                        <th className="w-[132px] py-0 pr-1 pb-2 pl-1 text-left font-normal text-wc-text-muted">
                          {t('labels.rival')}
                        </th>
                        <th className="w-[58px] py-0 pr-1 pb-2 pl-0 text-center font-normal text-wc-text-muted">
                          {t('labels.minuteFull')}
                        </th>
                        <th className="w-[114px] px-2 pb-2 text-left font-normal text-wc-text-muted">
                          {t('labels.phase')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {goalGroups.map((goalGroup) => (
                        <tr
                          key={goalGroup.key}
                          className="border-t border-wc-surface-secondary"
                        >
                          <td className="py-3 pr-1 pl-0 text-center text-wc-text-muted">
                            {formatMatchDate(goalGroup.matchDate)}
                          </td>
                          <td className="py-3 pr-1 pl-1">
                            <div className="flex items-center justify-start gap-2">
                              <FlagImage
                                countryCode={goalGroup.opponentTeam.code}
                                alt={goalGroup.opponentTeam.name}
                                width={16}
                                height={12}
                                className="rounded-[2px] shrink-0"
                              />
                              <span className="text-wc-text-primary">
                                {goalGroup.opponentTeam.name}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-3 pr-1 pl-0 text-center text-wc-accent-gold">
                            <div data-testid="player-goal-table-subrows">
                              {goalGroup.goals.map((goal, goalIndex) => (
                                <div
                                  key={`${goal.minuteRegular}-${goal.penalty === true ? 'penalty' : 'regular'}-${goalIndex}`}
                                  className="py-1 leading-none first:pt-0 last:pb-0"
                                  data-testid="player-goal-table-subrow"
                                >
                                  {formatGoalMinute(goal)}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-2 py-3 text-wc-text-muted">{goalGroup.stage ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
