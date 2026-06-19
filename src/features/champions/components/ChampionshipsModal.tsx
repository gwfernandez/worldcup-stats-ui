import { useEffect, useState } from 'react';
import { X, Trophy } from 'lucide-react';
import type { Champion, ChampionFinal } from '@/types/champion.types';
import { FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useChampionFinals } from '../hooks/useChampionFinals';

const HOST_ROTATION_MS = 1500;
const HOST_FADE_MS = 300;

export interface ChampionshipsModalProps {
  team: Champion | null;
  onClose: () => void;
}

interface HostFlagCarouselProps {
  hosts: ChampionFinal['hostCodes'];
}

function HostFlagCarousel({ hosts }: HostFlagCarouselProps) {
  const [activeHostIndex, setActiveHostIndex] = useState(0);
  const [isHostVisible, setIsHostVisible] = useState(true);
  const hasMultipleHosts = hosts.length > 1;
  const activeHost = hosts[hasMultipleHosts ? activeHostIndex % hosts.length : 0] ?? hosts[0];

  useEffect(() => {
    if (!hasMultipleHosts) {
      return;
    }

    let fadeTimeoutId: number | undefined;
    const intervalId = window.setInterval(() => {
      setIsHostVisible(false);

      fadeTimeoutId = window.setTimeout(() => {
        setActiveHostIndex((currentIndex) => (currentIndex + 1) % hosts.length);
        setIsHostVisible(true);
      }, HOST_FADE_MS);
    }, HOST_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
      if (fadeTimeoutId !== undefined) {
        window.clearTimeout(fadeTimeoutId);
      }
    };
  }, [hasMultipleHosts, hosts.length]);

  if (!activeHost) {
    return <span className="text-wc-text-muted">—</span>;
  }

  return (
    /* This wrapper keeps the cell size stable while the flag fades. */
    <div className="flex h-3 w-4 items-center justify-center">
      <FlagImage
        countryCode={activeHost.code}
        alt={activeHost.name}
        width={16}
        height={12}
        className={`rounded-[2px] shrink-0 transition-opacity duration-300 ease-in-out ${hasMultipleHosts && !isHostVisible ? 'opacity-0' : 'opacity-100'
          }`}
      />
    </div>
  );
}

const formatScore = (score: number | null, penalties: number | null): string => {
  if (score === null) {
    return '—';
  }

  return penalties === null ? String(score) : `${score} (${penalties})`;
};

const formatMatchDate = (matchDate: string | null): string =>
  matchDate === null ? '—' : matchDate.slice(5);

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
            {team.team.name}
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
            <div className="overflow-x-auto" data-testid="champion-finals-scroll">
              <table className="w-full min-w-[460px] border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-wc-border-primary">
                    <th className="w-16 px-1 pb-1 text-center font-normal text-wc-text-muted">
                      {t('titlesDialog.year')}
                    </th>
                    <th className="w-12 px-1 pb-1 text-center font-normal text-wc-text-muted">
                      {t('titlesDialog.date')}
                    </th>
                    <th className="whitespace-nowrap px-1 pb-1 text-center text-[10px] font-normal text-wc-text-muted">
                      {t('titlesDialog.matches')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {finals.map((final) => (
                    <tr key={final.year} className="border-t border-wc-surface-secondary">
                      <td className="px-1 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <HostFlagCarousel hosts={final.hostCodes} />
                          <span className="text-[12px] font-medium text-wc-accent-gold">
                            {final.year}
                          </span>
                        </div>
                      </td>
                      <td className="px-1 py-3 text-center text-wc-text-muted">
                        {formatMatchDate(final.matchDate)}
                      </td>
                      <td className="px-1 py-3">
                        <div
                          className="mx-auto grid w-max grid-cols-[120px_96px_120px] items-center justify-start gap-2"
                          data-testid="match-layout"
                        >
                          <div
                            className="flex items-center justify-end gap-2 text-right"
                            data-testid="home-team"
                          >
                            <span className="whitespace-nowrap text-wc-text-primary">
                              {final.homeTeam.name}
                            </span>
                            <FlagImage
                              countryCode={final.homeTeam.code}
                              alt={final.homeTeam.name}
                              width={16}
                              height={12}
                            />
                          </div>
                          <div
                            className="grid w-24 grid-cols-[1fr_auto_1fr] items-center gap-1 tabular-nums"
                            data-testid="match-score"
                          >
                            <span className="text-right font-medium text-wc-accent-gold">
                              {formatScore(final.homeTeamScore, final.homeTeamScorePenalties)}
                            </span>
                            <span className="text-center text-wc-text-muted">
                              {t('labels.versus')}
                            </span>
                            <span className="text-left font-medium text-wc-accent-gold">
                              {formatScore(final.awayTeamScore, final.awayTeamScorePenalties)}
                            </span>
                          </div>
                          <div
                            className="flex items-center justify-start gap-2 text-left"
                            data-testid="away-team"
                          >
                            <FlagImage
                              countryCode={final.awayTeam.code}
                              alt={final.awayTeam.name}
                              width={16}
                              height={12}
                            />
                            <span className="whitespace-nowrap text-wc-text-primary">
                              {final.awayTeam.name}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
