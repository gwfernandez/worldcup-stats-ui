import { useEffect } from 'react';
import { X, Trophy } from 'lucide-react';
import type { Champion, ChampionFinal } from '@/types/champion.types';
import { FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useChampionFinals } from '../hooks/useChampionFinals';

export interface ChampionshipsModalProps {
  team: Champion | null;
  onClose: () => void;
}

interface FinalPresentation {
  rival: ChampionFinal['homeTeam'];
  score: string | null;
}

const getFinalPresentation = (final: ChampionFinal, championCode: string): FinalPresentation => {
  const championIsHome = final.homeTeam.code === championCode;
  const championScore = championIsHome ? final.homeTeamScore : final.awayTeamScore;
  const rivalScore = championIsHome ? final.awayTeamScore : final.homeTeamScore;
  const championPenalties = championIsHome
    ? final.homeTeamScorePenalties
    : final.awayTeamScorePenalties;
  const rivalPenalties = championIsHome
    ? final.awayTeamScorePenalties
    : final.homeTeamScorePenalties;

  if (championScore === null || rivalScore === null) {
    return {
      rival: championIsHome ? final.awayTeam : final.homeTeam,
      score: null,
    };
  }

  const penalties =
    championPenalties !== null && rivalPenalties !== null
      ? ` (${championPenalties}–${rivalPenalties} pen.)`
      : '';

  return {
    rival: championIsHome ? final.awayTeam : final.homeTeam,
    score: `${championScore}–${rivalScore}${penalties}`,
  };
};

export function ChampionshipsModal({ team, onClose }: ChampionshipsModalProps) {
  const { t } = useTranslation('common');
  const { finals, isLoading, isError, refetch } = useChampionFinals(team?.team.code ?? null);

  useEffect(() => {
    if (!team) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [team, onClose]);

  if (!team) return null;

  const years =
    finals.length > 0
      ? finals.map((final) => final.year).sort((a, b) => a - b)
      : [...team.years].sort((a, b) => a - b);

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('titlesDialog.titleFor', { team: team.team.name })}
    >
      <div
        className="bg-wc-surface-primary border border-wc-border-primary rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border-primary">
          <div className="flex items-center gap-2 text-sm font-medium text-wc-text-primary">
            <FlagImage
              countryCode={team.team.code}
              alt={team.team.name}
              width={20}
              height={15}
              className="rounded-[2px]"
            />
            {team.team.name} - {t('labels.titles')}
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

        <div className="px-4 py-4">
          <div className="flex gap-5 px-4 py-3 bg-wc-surface-secondary border border-wc-border-primary rounded-lg mb-4">
            {[
              {
                val:
                  team.wins > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <Trophy
                        size={18}
                        className="text-wc-accent-gold opacity-40"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-wc-accent-gold">{team.wins}</span>
                    </div>
                  ) : (
                    '-'
                  ),
                lbl: t('labels.totalTitles'),
              },
              { val: years[0] ?? '-', lbl: t('labels.firstTitle') },
              { val: years[years.length - 1] ?? '-', lbl: t('labels.lastTitle') },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center flex-1">
                <div className="text-[17px] font-medium text-wc-accent-gold leading-none">
                  {val}
                </div>
                <p className="text-[10px] text-wc-text-muted mt-1">{lbl}</p>
              </div>
            ))}
          </div>

          {isLoading && (
            <p role="status" className="py-8 text-center text-sm text-wc-text-muted">
              {t('titlesDialog.loading')}
            </p>
          )}

          {isError && (
            <div role="alert" className="py-8 text-center">
              <p className="text-sm text-red-400">{t('titlesDialog.loadError')}</p>
              <button
                type="button"
                onClick={refetch}
                className="mt-3 rounded-md border border-wc-border-primary px-3 py-1.5 text-xs text-wc-text-primary hover:border-wc-accent-gold hover:text-wc-accent-gold transition-colors"
              >
                {t('actions.retry')}
              </button>
            </div>
          )}

          {!isLoading && !isError && finals.length === 0 && (
            <p className="py-8 text-center text-sm text-wc-text-muted">{t('titlesDialog.empty')}</p>
          )}

          {!isLoading && !isError && finals.length > 0 && (
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-wc-border-primary">
                  <th className="text-left font-normal text-wc-text-muted pb-2 pr-3">
                    {t('labels.year')}
                  </th>
                  <th className="text-left font-normal text-wc-text-muted pb-2 pr-3">
                    {t('labels.host')}
                  </th>
                  <th className="text-right font-normal text-wc-text-muted pb-2">
                    {t('labels.final')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {finals.map((final) => {
                  const { rival, score } = getFinalPresentation(final, team.team.code);

                  return (
                    <tr key={final.year} className="border-t border-wc-surface-secondary">
                      <td className="py-2 pr-3">
                        <span className="font-medium text-wc-accent-gold text-[12px]">
                          {final.year}
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        {final.hostCodes.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            {final.hostCodes.map((host) => (
                              <div key={host.code} className="flex items-center gap-1.5">
                                <FlagImage
                                  countryCode={host.code}
                                  alt={host.name}
                                  width={13}
                                  height={9}
                                  className="rounded-[1px] shrink-0"
                                />
                                <span className="text-wc-text-muted">{host.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-wc-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        <span className="font-medium text-wc-accent-gold">{score ?? '—'}</span>{' '}
                        <span className="text-wc-text-muted">
                          {t('labels.versus')}{' '}
                          <FlagImage
                            countryCode={rival.code}
                            alt=""
                            width={12}
                            height={8}
                            className="rounded-[1px] inline-block mx-0.5 align-middle"
                          />
                          {rival.name}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
